import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Service } from 'typedi';

import { env } from 'env';

@Service()
export class AuthService {
  async parseToken(token: string) {
    const decoded = jwt.verify(token, env.app.decodeKey);

    const { id } = decoded as JwtPayload;
    return id;
  }

  async parseTokenFromRequest(req: Request) {
    const authorization = req.header('authorization');

    if (authorization && authorization.split(' ')[0] === 'Bearer') {
      const token = authorization.split(' ')[1];
      return this.parseToken(token);
    }

    return;
  }
}
