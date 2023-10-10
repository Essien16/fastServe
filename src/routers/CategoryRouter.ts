import { Router } from "express"
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare"
import { CategoryController } from "../controllers/CategoryController";

class CategoryRouter {
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
    this.router.get("/:restaurantId", GlobalMiddleWare.auth, CategoryController.getCategoriesByRestaurantId)
  }
  postRoutes() {}
  patchRoutes() {}
  putRoutes() {}

  deleteRoutes() {}
}

export default new CategoryRouter().router
