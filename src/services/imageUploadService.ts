// import cloudinary from "../services/cloudinaryConfig"
// import * as fs from "fs"

// class ImageUploadService {
//   static async uploadImage(file: Express.Multer.File): Promise<any> {
//     if (!file) {
//       return Promise.reject(new Error("Image field is required."))
//     }

//     return new Promise((resolve, reject) => {
//       cloudinary.uploader.upload(file.path, (error, result) => {
//         if (error) {
//           reject(error)
//         } else {
//           // Delete the temporary file after uploading to Cloudinary
//           fs.unlinkSync(file.path)
//           resolve(result)
//         }
//       })
//     })
//   }
// }

// export default ImageUploadService

//this file was used when i created an endpoint for uploading image. but i changed that to creating a service that endpoint can use.