import jwt from 'jsonwebtoken';
import { isEqual } from 'lodash';
import { Model } from 'mongoose';
import { NotFoundError, UnauthorizedError } from 'routing-controllers';
import { Inject, Service } from 'typedi';

import { User } from 'api/models/user.model';
import { UserWithPassword } from 'api/types/models/user.types';
import { env } from 'env';
import { CRUD } from 'utils/models/CRUD';

@Service()
export class UserService extends CRUD<User> {
  constructor(
    @Inject(User.name)
    readonly userModel: Model<User>,
  ) {
    super(User, userModel);
  }

  public async login({ email, password }: { email: string; password: string }) {
    const user = await this.findOne({
      filter: { email },
      select: ['+password'],
      Model: UserWithPassword,
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!isEqual(password, user.password)) {
      throw new UnauthorizedError('Invalid password');
    }

    const token = jwt.sign({ id: user._id }, env.app.decodeKey, {
      // expiresIn: "1h",
    });

    return {
      token,
    };
  }
}
