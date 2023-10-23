import * as Jwt from "jsonwebtoken";
import { getEnvironmentVariables } from "../environments/environment";
import { Redis } from "./Redis";

export class JWT {
  static jwtSign(payload, userId, expiresIn: string = "1200s") {
    return Jwt.sign(payload, getEnvironmentVariables().jwt_secret_key, {
      expiresIn,
      audience: userId.toString(),
    })
  }

  static jwtVerify(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Jwt.verify(
        token,
        getEnvironmentVariables().jwt_secret_key,
        (err, decoded) => {
          if (err) {
            reject(err)
          } else if (!decoded) {
            reject(new Error("User not authorized"))
          } else {
            resolve(decoded)
          }
        }
      )
    })
  }

  static async jwtSignRefreshToken(payload, userId, expiresIn: string = "3d", redis_ex: number = 72 * 60 * 60) {
    try {
      const refreshToken = Jwt.sign(
        payload,
        getEnvironmentVariables().jwt_refresh_token_secret_key,
        {
          expiresIn,
          audience: userId.toString(),
        }
      );
      await Redis.setValue(userId.toString(), refreshToken, redis_ex);
      return refreshToken;
    } catch (error) {
      throw(error);
    };
  };

  static jwtVerifyRefreshToken(refreshToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Jwt.verify(
        refreshToken,
        getEnvironmentVariables().jwt_refresh_token_secret_key,
        (err, decoded) => {
          if (err) {
            reject(err)
          } else if (!decoded) {
            reject(new Error("User not authorized"))
          } else {
            const user: any = decoded;
            Redis.getValue(user.aud).then(value => {
              if (value === refreshToken) {
                resolve(decoded);
              } else {
                reject(new Error("Session expired. Please Login."));
              }
            }).catch (error => {
              reject(error);
            })
            resolve(decoded);
          }
        }
      )
    });
  };
}