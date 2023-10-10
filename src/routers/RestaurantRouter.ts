import { Router } from "express"
import { Utils } from "../utils/Utils"
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare"
import { RestaurantController } from "../controllers/RestaurantController"
import { RestaurantValidators } from "../validators/RestaurantValidators"
import * as multer from 'multer';
import { cloudConfig, cloudinaryUpload } from "../services/cloudinaryConfig"

class RestaurantRouter {
  public router: Router

  constructor() {
    this.router = Router()
    this.getRoutes()
    this.postRoutes()
    this.putRoutes()
    this.patchRoutes()
    this.deleteRoutes()
  }

  getRoutes() {
    this.router.get("/all", GlobalMiddleWare.auth, GlobalMiddleWare.adminRole, RestaurantController.getRestaurants)
    this.router.get("/:restaurantId/tables", RestaurantController.getTables)
  }
  postRoutes() {
    this.router.post(
      "/create",
      GlobalMiddleWare.auth,
      GlobalMiddleWare.adminRole,
      RestaurantValidators.validateFileUpload,
      RestaurantValidators.addRestaurant(),
      cloudConfig,
      cloudinaryUpload,
      GlobalMiddleWare.checkError,
      RestaurantController.addRestaurant
    )
  }
  patchRoutes() {}
  putRoutes() {}

  deleteRoutes() {}
}

export default new RestaurantRouter().router
