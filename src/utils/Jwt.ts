import * as Jwt from "jsonwebtoken";
import { getEnvironmentVariables } from "../environments/environment";

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

  static jwtSignRefreshToken(payload, userId, expiresIn: string = "5d") {
    return Jwt.sign(payload, getEnvironmentVariables().jwt_refresh_token_secret_key, {
      expiresIn,
      audience: userId.toString(),
    })
  }

  static jwtVerifyRefreshToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Jwt.verify(
        token,
        getEnvironmentVariables().jwt_refresh_token_secret_key,
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
}