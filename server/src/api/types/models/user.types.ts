import { OmitType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { User } from 'api/models/user.model';

export class UserWithPassword extends OmitType(User, ['password']) {
  @IsString()
  password: string;
}
