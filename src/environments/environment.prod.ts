import { Utils } from "../utils/Utils";
import { Environment } from "./environment";

Utils.dotenvConfig();

export const ProdEnv: Environment = {
  db_url: process.env.PROD_MONGODB_URI,
  jwt_secret_key: process.env.PROD_JWT_SECRET_KEY,
  jwt_refresh_token_secret_key: process.env.PROD_JWT_REFRESH_TOKEN_SECRET_KEY,
  session_secret_key: process.env.PROD_SESSION_SECRET_KEY,
  cloudinary_auth: {
    cloud_name: process.env.PROD_CLOUDINARY_NAME,
    api_key: process.env.PROD_CLOUDINARY_API_KEY,
    api_secret: process.env.PROD_CLOUDINARY_API_SECRET,
  },
  flutterwave_secret_key: {
    public_key: process.env.PROD_FLUTTERWAVE_PUBLIC_KEY,
    secret_key: process.env.PROD_FLUTTERWAVE_SECRET_KEY,
    encryption_key: process.env.PROD_FLUTTERWAVE_ENCRYPTION_KEY,
  },
}