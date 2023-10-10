import { Router } from "express"
import { Utils } from "../utils/Utils"
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare"
import { MenuController } from "../controllers/MenuController"
import { MenuValidators } from "../validators/MenuValidators"
import { cloudConfig, cloudinaryUpload } from "../services/cloudinaryConfig"

class MenuRouter {
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
    this.router.get(
      "/:restaurantId",
      MenuValidators.getMenu(),
      GlobalMiddleWare.checkError,
      MenuController.getMenu
    )
  }
  postRoutes() {
    this.router.post(
      "/add/item",
      GlobalMiddleWare.auth,
      MenuValidators.validateFileUpload,
      MenuValidators.addItem(),
      cloudConfig,
      cloudinaryUpload,
      GlobalMiddleWare.checkError,
      MenuController.addItem
    )
  }
  patchRoutes() {}
  putRoutes() {}

  deleteRoutes() {}
}

export default new MenuRouter().router
