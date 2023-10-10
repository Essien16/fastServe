import { DevEnv } from "./environment.dev";
import { ProdEnv } from "./environment.prod";

export interface Environment {
  db_url: string
  jwt_secret_key: string
  session_secret_key: string
  //NB: the ? is used so that if we want to use either send grid or gmail
  sendgrid_api?: {
    api_key: string
    email_from: string
  }
  gmail_auth?: {
    user: string
    pass: string
  }
  mailtrap_auth?: {
    user: string
    pass: string
  }
  cloudinary_auth: {
    cloud_name: string
    api_key: string
    api_secret: string
  }
}

export function getEnvironmentVariables() {
    if (process.env.NODE_ENV === 'production') {
        return ProdEnv
    }
    return DevEnv;
};