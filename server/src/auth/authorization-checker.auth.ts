import { Action, NotFoundError } from 'routing-controllers';
import Container from 'typedi';

import { User } from 'api/models/user.model';
import { AuthService } from 'api/services/auth.service';
import { OrganisationService } from 'api/services/organisation.service';
import { UserService } from 'api/services/user.service';

export function authorizationChecker(): (
  action: Action,
  roles: any[],
) => Promise<boolean> | boolean {
  const authService = Container.get(AuthService);
  const userService = Container.get(UserService);
  const organisationService = Container.get(OrganisationService);

  return async function innerAuthorizationChecker(
    action: Action,
    // roles: any[],
  ): Promise<boolean> {
    const id = await authService.parseTokenFromRequest(action.request);
    if (!id) {
      return false;
    }

    const user = await userService.findOneById(id, {
      populate: [],
      Model: User,
    });
    action.request.user = user;
    if (!action.request.user) {
      throw new NotFoundError('User not found');
    }

    const workspace =
      action.request.header('x-workspace') ||
      user.workspaces?.[0]?.organisation;
    action.request.organisation =
      await organisationService.findOneById(workspace);
    if (!action.request.organisation) {
      throw new NotFoundError('Organisation not found');
    }

    return true;
  };
}
