import * as express from "express";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { getEnvironmentVariables } from "./environments/environment";
import UserRouter from "./routers/UserRouter";
import ImageUploadRouter from "./routers/ImageUploadRouter";

export class Server {
  public app: express.Application = express();

  constructor() {
    this.setConfigs();
    this.setRoutes();
    //NB: Always handle errors after calling routes
    this.error404Handler();
    this.handleErrors();
  }
  setConfigs() {
    this.connectMongoDb();
    this.allowCors();
    this.configureBodyParser();
  }
  connectMongoDb() {
    mongoose
      .connect(getEnvironmentVariables().db_url)
      .then(() => {
        console.log("Connected to MongoDb successfully");
      })
      .catch((error) => console.log(error));
  }
  configureBodyParser() {
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
  }
  allowCors() {
    this.app.use(cors());
  }
  setRoutes() {
    this.app.use("/src/uploads", express.static("src/uploads"));
    this.app.use("/api/v1/user", UserRouter);
    this.app.use("/api/v1/image", ImageUploadRouter)
  }

  error404Handler() {
    this.app.use((req, res) => {
      res.status(404).json({
        msg: "Not found",
        status_code: 404,
      });
    });
  }

  handleErrors() {
    this.app.use((error, req, res, next) => {
        const errorStatus = req.errorStatus || 500;
        res.status(errorStatus).json({
            msg: error.message || "Something went wrong.",
            status_code: errorStatus,
      });
    });
  }
}
