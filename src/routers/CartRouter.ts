import { Router } from "express"
import { validateAddToCart, validateRemoveFromCart, checkCartValidationResult } from "../validators/CartValidator";
import { CartController } from "../controllers/CartController";

class CartRouter {
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
    this.router.get("/", CartController.getCart);
  }
  postRoutes() {
    this.router.post(
        "/add", 
        validateAddToCart, 
        checkCartValidationResult, 
        CartController.addToCart
    );
    this.router.post(
      "/remove",
      validateRemoveFromCart,
      checkCartValidationResult,
      CartController.removeFromCart
    )
  }
  patchRoutes() {}
  putRoutes() {}

  deleteRoutes() {}
}

export default new CartRouter().router
