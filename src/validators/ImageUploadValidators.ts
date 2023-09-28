import { body } from "express-validator";

export class ImageUploadValidators {

    static addImage() {
        return [
          body("image", "Image file is required").custom(
            (image, { req }) => {
              if (req.file) {
                return true
              } else { 
                throw new Error("File not uploaded")
              }
            }
          ),
        ]
    }
}
