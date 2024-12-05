import { PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Body, JsonController, Post } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { User } from 'api/models/user.model';
import { UserService } from 'api/services/user.service';

// Response Types
// ?|> login
class loginBody extends PickType(User, ['email']) {
  @IsString()
  password: string;
}

class loginResponse {
  @IsString()
  token: string;
}

// Controller
@JsonController('/auth')
@OpenAPI({})
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('/login')
  @ResponseSchema(loginResponse)
  public async login(@Body() { email, password }: loginBody) {
    return this.userService.login({
      email,
      password,
    });
  }
}
