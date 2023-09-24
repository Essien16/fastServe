import { validationResult } from 'express-validator';
import { JWT } from '../utils/Jwt';

export class GlobalMiddleWare {
  static checkError(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new Error(errors.array()[0].msg));
    } else {
      next();
    }
  }

  static async auth(req, res, next) {
    const header_auth = req.headers.authorization;
    const token = header_auth ? header_auth.slice(7, header_auth.length) : null;
    // const authHeader = header_auth.split(' ');
    // const token = authHeader[1];
    try {
      req.errorStatus = 401;
      if (!token) {
        next(new Error('No user found.'));
      }
      const decoded = await JWT.jwtVerify(token);
      req.user = decoded;
      next();
    } catch (error) {
      next(new Error('No user found.'));
    }
  }
}
