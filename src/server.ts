import * as express from "express";
import * as session from "express-session"
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { getEnvironmentVariables } from "./environments/environment";
import configureSession from "./utils/Session";
import UserRouter from "./routers/UserRouter";
//import ImageUploadRouter from "./routers/ImageUploadRouter";
import CityRouter from "./routers/CityRouter";
import RestaurantRouter from "./routers/RestaurantRouter";
import CategoryRouter from "./routers/CategoryRouter";
import MenuRouter from "./routers/MenuRouter";
import TableRouter from "./routers/TableRouter";
import OrderRouter from "./routers/OrderRouter";
import CartRouter from "./routers/CartRouter";
import PaymentRouter from "./routers/PaymentRouter";
import { Utils } from "./utils/Utils";
import { Redis } from "./utils/Redis";


export class Server {
  public app: express.Application = express()

  constructor() {
    //console.log(typeof this.app.use)
    this.setConfigs()
    this.setRoutes()
    //NB: Always handle errors after calling routes
    this.error404Handler()
    this.handleErrors()
  }

  setConfigs() {
    this.dotenvConfig();
    this.connectMongoDb();
    this.connectRedis();
    this.allowCors();
    this.configureBodyParser();
    this.configureSessions();
  }

  dotenvConfig() {
    Utils.dotenvConfig();
  }

  connectMongoDb() {
    mongoose
      .connect(getEnvironmentVariables().db_url)
      .then(() => {
        console.log("Connected to MongoDb successfully")
      })
      .catch((error) => console.log(error))
  }

  connectRedis() {
    Redis.connectToRedis();
  }

  configureBodyParser() {
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json())
  }
  configureSessions() {
    // console.log("Is app defined?", !!this.app)
    // console.log("Is app an Express app?", this.app instanceof express)
    this.app.use(configureSession())
  }
  allowCors() {
    this.app.use(cors())
  }
  setRoutes() {
    this.app.use("/src/uploads", express.static("src/uploads"))
    this.app.use("/api/v1/user", UserRouter)
    // this.app.use("/api/v1/image", ImageUploadRouter); //this endpoint is no longer in use. images upload is now a service not an endpoint
    this.app.use("/api/v1/city", CityRouter)
    this.app.use("/api/v1/restaurant", RestaurantRouter)
    this.app.use("/api/v1/categories", CategoryRouter)
    this.app.use("/api/v1/menu", MenuRouter)
    this.app.use("/api/v1/table", TableRouter)
    this.app.use("/api/v1/cart", CartRouter)
    this.app.use("/api/v1/order", OrderRouter)
    this.app.use("/api/v1/pay", PaymentRouter)
  }

  error404Handler() {
    this.app.use((req, res) => {
      res.status(404).json({
        msg: "Not found",
        status_code: 404,
      })
    })
  }

  handleErrors() {
    this.app.use((error, req, res, next) => {
      const errorStatus = req.errorStatus || 500
      res.status(errorStatus).json({
        msg: error.message || "Something went wrong.",
        status_code: errorStatus,
      })
    })
  }
}
