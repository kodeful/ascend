import { Action } from 'routing-controllers';

export function authorizationChecker(): (
  action: Action,
  roles: any[],
) => Promise<boolean> | boolean {
  return async function innerAuthorizationChecker(): Promise<boolean> {
    return true;
  };
}
