import { validationResult } from 'express-validator';
import { JWT } from '../utils/Jwt';

export class GlobalMiddleWare {
  static checkError(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      next(new Error(errors.array()[0].msg))
    } else {
      next()
    }
  }

  static async auth(req, res, next) {
    const header_auth = req.headers.authorization
    const token = header_auth ? header_auth.slice(7, header_auth.length) : null
    // const authHeader = header_auth.split(' ');
    // const token = authHeader[1];
    try {
      req.errorStatus = 401
      if (!token) {
        next(new Error("No user found."))
      }
      const decoded = await JWT.jwtVerify(token)
      req.user = decoded
      next()
    } catch (error) {
      next(new Error("No user found."))
    }
  }

  static async decodeRefreshToken (req, res, next) {
    const refreshToken = req.body.refreshToken;
    try {
      if (!refreshToken) {
        req.error.status = 403;
        next(new Error("Access denied. Your session has expired please login."))
      }
      const decoded = await JWT.jwtVerifyRefreshToken(refreshToken);
      req.user = decoded;
      next();
    } catch(error) {
      req.error.status = 403;
      next(new Error("Access denied. Your session has expired please login."))
    }
  }

  static adminRole(req, res, next) {
    const user = req.user;
    if (user.type !== "admin") {
      req.errorStatus = 401
      next(new Error("Unauthorized user. Contact admin."))
    }
    next()
  }
}
