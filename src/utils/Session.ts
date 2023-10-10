import * as session from "express-session";
import { v4 as uuidv4 } from "uuid";
const MongoStore = require("connect-mongo")
import { getEnvironmentVariables } from "../environments/environment";
import * as express from "express";

// const configureSession = (app: express.Application) => {
//   try {
//     app.use(
//       session({
//         secret: getEnvironmentVariables().session_secret_key, // Ensure this is secured and not in source code in production
//         resave: false,
//         saveUninitialized: true,
//         cookie: {
//           // secure: process.env.NODE_ENV === "production", // Use secure cookies in production, non-secure in development
//           maxAge: 3600000,
//         },
//         genid: (req) => {
//           return uuidv4() // use UUIDs for session IDs
//         },
//       })
//     )
//     //console.log("Session configured successfully.")
//   } catch (error) {
//     console.error("Error configuring session:", error)
//   }
  
//}
function configureSession() {
  return session({
    secret: getEnvironmentVariables().session_secret_key,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: getEnvironmentVariables().db_url,
    }),
    cookie: { secure: false, maxAge: 3600000 },
    genid: (req) => {
      return uuidv4()
    },
  })
}

export default configureSession 

