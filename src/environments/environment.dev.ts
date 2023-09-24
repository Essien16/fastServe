import { Environment } from "./environment";

export const DevEnv: Environment = {
  db_url: "mongodb://localhost:27017/fastServe",
  gmail_auth: {
    user: "essienjustice@gmail.com",
    pass: "Justada25",
  },
  mailtrap_auth: {
    user: "9db2f4c888c1a5",
    pass: "5d651fea2ad922",
  },
  jwt_secret_key: 'thenextunicorn'
};