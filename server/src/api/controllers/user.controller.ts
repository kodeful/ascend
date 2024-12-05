import { PickType } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { Exclude, Type, plainToInstance } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import {
  Authorized,
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

// Response Types
// ?|> me
class meResponse {
  @ValidateNested()
  @Type(() => User)
  data: User;
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
