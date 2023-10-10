// import ImageUpload from "../models/ImageUpload";
//import imageUploadService from "../services/imageUploadService";


// export class ImageUploadController {
    //static async addImage(req, res, next) {
        // const path = req.file.path;
        // try {
        //     const data = {
        //         image: path
        //     }
        //     const image = await new ImageUpload(data).save()
        //     res.send(image);
        // } catch (error) {
        //     next(error)
        // }

    //      try {
    //        const result = await imageUploadService.uploadImage(req.file)
    //        res.json({ url: result.url }) 
    //      } catch (error) {
    //        next(error)
    //      }
    // }

//     static async getImages(req, res, next) {
//         try{
//             const images = await ImageUpload.find({status: true});
//             res.send(images)
//         } catch (error) {
//             next(error)
//         }
//     }
// }

//this file was created when i was using an endpoint to upload images. The new implementation is now a service.

