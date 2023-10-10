// import { Router } from "express";
// import { Utils } from "../utils/Utils";
// import { ImageUploadController } from "../controllers/ImageUploadController"; i might have deleted this
// import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";

// class ImageUploadRouter {
//   public router: Router

//   constructor() {
//     this.router = Router()
//     this.getRoutes()
//     this.postRoutes()
//     this.putRoutes()
//     this.patchRoutes()
//     this.deleteRoutes()
//   }

//   getRoutes() {
//     this.router.get("/", GlobalMiddleWare.auth, ImageUploadController.getImages)
//   }
//   postRoutes() {
//     this.router.post("/upload", GlobalMiddleWare.auth, new Utils().multer.single("images"), ImageUploadController.addImage)
//   }
//   patchRoutes() {
//   }
//   putRoutes() {}
  
//   deleteRoutes() {}
// }

// export default new ImageUploadRouter().router

//ignore these files. check the imageservice uploader for details