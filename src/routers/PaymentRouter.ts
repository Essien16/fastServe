import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController"

class PaymentRouter {
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
    this.router.get("/redirect", PaymentController.handleRedirect)
  }
  postRoutes() {
    this.router.post("/", PaymentController.initiatePayment)
  }
  patchRoutes() {}
  putRoutes() {}

  deleteRoutes() {}
}

export default new PaymentRouter().router
