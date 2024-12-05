import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import {
  Authorized,
  CurrentUser,
  Get,
  JsonController,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { User } from 'api/models/user.model';
// import { UserService } from 'api/services/user.service';

// Response Types
// ?|> me
class meResponse {
  @ValidateNested()
  @Type(() => User)
  data: User;
}

// Controller
@Authorized()
@JsonController('/user')
@OpenAPI({})
export class UserController {
  // constructor(private userService: UserService) {}

  @Get('/me')
  @ResponseSchema(meResponse)
  public async me(@CurrentUser() user: User) {
    return { data: user };
  }
}
