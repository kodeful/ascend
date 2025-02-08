import { PickType } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { Exclude, Type, plainToInstance } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { isEqual } from 'lodash';
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
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { User, UserModel } from 'api/models/user.model';
import { UserService } from 'api/services/user.service';
import { FilterQueryParams } from 'api/types/filter.types';
import { UserWithPassword } from 'api/types/models/user.types';

// Response Types
// ?|> me
class meResponse {
  @ValidateNested()
  @Type(() => User)
  data: User;
}

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
class filterUsersResponse {
  @ValidateNested({ each: true })
  @Type(() => User)
  data: User[];
}

// ?|> createUser
class createUserBody extends PickType(User, [
  'email',
  'firstName',
  'lastName',
  'phone',
  'username',
  'role',
]) {
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
  @ResponseSchema(meResponse)
  public async me(@CurrentUser() user: User) {
    return { data: user };
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
    @CurrentUser() user: User,
    @QueryParams() queryParams: FilterQueryParams<User>,
  ) {
    const { limit, page, sort, filter } = plainToInstance(
      FilterQueryParams,
      queryParams,
    );

    return this.userService.filter({
      limit,
      page,
      sort,
      filter,
      defaultFilter: {
        _id: { $ne: user._id },
      },
      Model: User,
    });
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
    @CurrentUser() user: User,
  ) {
    await UserModel.create({
      organisation: user.organisation,
      email,
      firstName,
      lastName,
      phone,
      username,
      role,
      password,
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
