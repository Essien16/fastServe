import { Router } from "express"
import { Utils } from "../utils/Utils"
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare"
import { TableController } from "../controllers/TableController";
import { TableValidators } from "../validators/TableValidator";

class TableRouter {
  public router: Router

  constructor() {
    this.router = Router()
    this.getRoutes()
    this.postRoutes()
    this.putRoutes()
    this.patchRoutes()
    this.deleteRoutes()
  }

  getRoutes() {}
  postRoutes() {
    this.router.post(
      "/add",
      TableValidators.addTable(),
      GlobalMiddleWare.checkError,
      TableController.addTable
    )
  }
  patchRoutes() {}
  putRoutes() {}

  deleteRoutes() {}
}

export default new TableRouter().router
