import { Action, NotFoundError } from 'routing-controllers';
import Container from 'typedi';

import { User } from 'api/models/user.model';
import { AuthService } from 'api/services/auth.service';
import { UserService } from 'api/services/user.service';

export function authorizationChecker(): (
  action: Action,
  roles: any[],
) => Promise<boolean> | boolean {
  const authService = Container.get<AuthService>(AuthService);
  const userService = Container.get<UserService>(UserService);

  return async function innerAuthorizationChecker(
    action: Action,
    // roles: any[],
  ): Promise<boolean> {
    const id = await authService.parseTokenFromRequest(action.request);
    if (!id) {
      return false;
    }

    action.request.user = await userService.findOneById(id, {
      populate: [],
      Model: User,
    });
    if (!action.request.user) {
      throw new NotFoundError('User not found');
    }

    return true;
  };
}
