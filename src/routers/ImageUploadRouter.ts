import { Router } from "express";
import { Utils } from "../utils/Utils";
import { ImageUploadController } from "../controllers/ImageUploadController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { ImageUploadValidators } from "../validators/ImageUploadValidators";

class BannerRouter {
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
    this.router.get("/", GlobalMiddleWare.auth, ImageUploadController.getImages)
  }
  postRoutes() {
    this.router.post('/add', GlobalMiddleWare.auth, GlobalMiddleWare.adminRole, new Utils().multer.single('image'), ImageUploadValidators.addImage(), GlobalMiddleWare.checkError, ImageUploadController.addImage)
  }
  patchRoutes() {
  }
  putRoutes() {}
  
  deleteRoutes() {}
}

export default new BannerRouter().router
