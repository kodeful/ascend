import { OmitType, PickType } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { Exclude, Type, plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { find, isEqual, omit } from 'lodash';
import {
  Authorized,
  BadRequestError,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParams,
  Req,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { User, UserModel, UserRole } from 'api/models/user.model';
import { UserService } from 'api/services/user.service';
import { FilterMeta, FilterQueryParams } from 'api/types/filter.types';
import { UserWithPassword } from 'api/types/models/user.types';
import { mongoId } from 'utils/mongoId';

// Response Types
// ?|> updateMe
class updateMeBody extends PickType(User, ['firstName', 'lastName', 'email']) {
  @Exclude()
  @IsOptional()
  protected _: null;
}

// ?|> updateMeChangePassword
class updateMeChangePasswordBody {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}

// ?|> filterUsers
class filterUsersData extends OmitType(User, ['workspaces']) {
  @IsEnum(UserRole)
  role: UserRole;

  @IsBoolean()
  verified: boolean;
}

class filterUsersResponse {
  @ValidateNested({ each: true })
  @Type(() => filterUsersData)
  data: filterUsersData[];

  @ValidateNested()
  @Type(() => FilterMeta)
  meta: FilterMeta;
}

// ?|> createUser
class createUserBody extends PickType(User, [
  'email',
  'firstName',
  'lastName',
  'phone',
  'username',
]) {
  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  password: string;
}

// ?|> updateUser
class updateUserBody extends PickType(User, [
  'email',
  'firstName',
  'lastName',
  'phone',
  'username',
]) {
  @Exclude()
  @IsOptional()
  protected _: null;
}

// Controller
@Authorized()
@JsonController('/user')
@OpenAPI({})
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  @ResponseSchema(User)
  public async me(@CurrentUser() user: User) {
    return user;
  }

  @Put('/me')
  @ResponseSchema(undefined)
  public async updateMe(
    @CurrentUser() user: User,
    @Body() { firstName, lastName, email }: updateMeBody,
  ) {
    await this.userService.updateOneById(user._id, {
      firstName,
      lastName,
      email,
    });

    return {};
  }

  @Put('/me/change-password')
  @ResponseSchema(undefined)
  public async updateMeChangePassword(
    @CurrentUser() user: User,
    @Body() { oldPassword, newPassword }: updateMeChangePasswordBody,
  ) {
    const { password } = await this.userService.findOneById(user._id, {
      select: ['+password'],
      Model: UserWithPassword,
    });

    if (!isEqual(password, oldPassword)) {
      throw new BadRequestError('Old password is incorrect');
    }

    await this.userService.updateOneById(user._id, {
      password: newPassword,
    });

    return {};
  }

  @Get()
  @ResponseSchema(filterUsersResponse)
  public async filterUsers(
    @Req() req: any,
    // @CurrentUser() user: User,
    @QueryParams() queryParams: FilterQueryParams<User>,
  ) {
    const { limit, page, sort, filter } = plainToInstance(
      FilterQueryParams,
      queryParams,
    );

    const { data: users, meta } = await this.userService.filter({
      limit,
      page,
      sort,
      filter,
      defaultFilter: {},
      preFilter: {
        'workspaces.organisation': mongoId(req.organisation._id),
      },
      Model: User,
    });

    const data = users.map((user) => {
      const workspace = find(user.workspaces, {
        organisation: req.organisation._id,
      });
      const teamUser = omit(user, ['workspaces']);

      return {
        ...teamUser,
        role: workspace.role,
        verified: workspace.verified,
      };
    }) as filterUsersData[];

    return { data, meta };
  }

  @Get('/:userId')
  @ResponseSchema(User)
  public async getUser(@Param('userId') userId: string) {
    return await this.userService.findOneById(mongoId(userId));
  }

  @Post()
  @ResponseSchema(undefined)
  public async createUser(
    @Body()
    {
      email,
      firstName,
      lastName,
      phone,
      username,
      role,
      password,
    }: createUserBody,
    @Req() req: any,
  ) {
    await this.userService.create({
      email,
      firstName,
      lastName,
      phone,
      username,
      password,
      workspaces: [
        {
          organisation: req.organisation._id,
          role,
          verified: true,
        },
      ],
    });

    return {};
  }

  @Put('/:userId')
  @ResponseSchema(undefined)
  public async updateUser(
    @Param('userId') userId: Ref<User>,
    @Body() { email, firstName, lastName, phone, username }: updateUserBody,
  ) {
    await UserModel.findByIdAndUpdate(userId, {
      email,
      firstName,
      lastName,
      phone,
      username,
    });

    return {};
  }
}
