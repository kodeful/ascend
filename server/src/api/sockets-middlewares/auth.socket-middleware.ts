import { Middleware, MiddlewareInterface } from 'socket-controllers';
import Container from 'typedi';

import { AuthService } from 'api/services/auth.service';
import { UserService } from 'api/services/user.service';

@Middleware({ namespace: new RegExp('.*') })
export class AuthSocketMiddleware implements MiddlewareInterface {
  async use(socket: any, next: (err?: any) => any) {
    const authService = Container.get<AuthService>(AuthService);
    const userService = Container.get<UserService>(UserService);
    const token = socket.handshake.auth.token;

    const id = await authService.parseToken(token);

    if (!id) {
      // TODO: handle error
      return;
    }

    socket.user = await userService.findOneById(id);
    next();
  }
}
