import { body, validationResult, ValidationError } from "express-validator"
import User from "../models/User"
import Restaurant from "../models/Restaurant"
import { Request, Response, NextFunction } from "express"
import * as multer from "multer"

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" })

export class RestaurantValidators {
  static addRestaurant() {
    return [
      body("name").isString().withMessage("Owner Name is required"),
      body("email")
        .isEmail()
        .withMessage("Email is required")
        .custom(async (email, { req }) => {
          const existingUser = await User.findOne({ email })
          if (existingUser) {
            throw new Error("User Already Exists")
          }
          return true
        }),
      body("phone").isString().withMessage("Phone number is required"),
      body("password")
        .isAlphanumeric()
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be between 8-20 characters"),
      body("res_name").isString().withMessage("Restaurant Name is required"),
      body("description").isString().withMessage("Description is required"),
      body("address").isString().withMessage("Address is required"),
      body("status").isString().withMessage("Status is required"),
    ]
  }

  static validateFileUpload(req: Request, res: Response, next: NextFunction) {
    upload.single("cover")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(400).send({ error: err.message })
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(400).send({ error: err.message })
      }
      // Everything went fine, proceed to next middleware.
      next()
    })
  }
}


