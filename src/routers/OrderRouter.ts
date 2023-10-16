import { Router } from "express";
import { validateOrder, checkOrderValidationResult } from "../validators/OrderValidator";
import { OrderController } from "../controllers/OrderController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";


class OrderRouter {
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
    this.router.get("/user",GlobalMiddleWare.auth, OrderController.getOrders)
  }

  postRoutes() {
    this.router.post("/", validateOrder, checkOrderValidationResult, OrderController.createOrder)
  }
  patchRoutes() {}
  putRoutes() {}

  deleteRoutes() {}
}

export default new OrderRouter().router
