import { Utils } from "../utils/Utils";
import { Environment } from "./environment";

Utils.dotenvConfig();

export const DevEnv: Environment = {
  db_url: process.env.DEV_MONGODB_URI,
  cloudinary_auth: {
    cloud_name: process.env.DEV_CLOUDINARY_NAME,
    api_key: process.env.DEV_CLOUDINARY_API_KEY,
    api_secret: process.env.DEV_CLOUDINARY_API_SECRET,
  },
  mailtrap_auth: {
    user: process.env.DEV_MAILTRAP_USER,
    pass: process.env.DEV_MAILTRAP_PASS,
  },
  jwt_secret_key: process.env.DEV_JWT_SECRET_KEY,
  jwt_refresh_token_secret_key: process.env.DEV_JWT_REFRESH_TOKEN_SECRET_KEY,
  session_secret_key: process.env.DEV_SESSION_SECRET_KEY,
  flutterwave_secret_key: {
    public_key: process.env.DEV_FLUTTERWAVE_PUBLIC_KEY,
    secret_key: process.env.DEV_FLUTTERWAVE_SECRET_KEY,
    encryption_key: process.env.DEV_FLUTTERWAVE_ENCRYPTION_KEY,
  },
  redis: {
    username: process.env.LOCAL_REDIS_USERNAME,
    password: process.env.LOCAL_REDIS_PASSWORD,
    host: process.env.LOCAL_REDIS_HOST,
    port: parseInt(process.env.LOCAL_REDIS_PORT),
  },
}