import { body, param } from "express-validator"
import { Request, Response, NextFunction } from "express"
import * as multer from "multer"
import Category from "../models/Category"
import Restaurant from "../models/Restaurant"

const upload = multer({ dest: "uploads/" })

export class MenuValidators {
  static addItem() {
    return [
      //   body("itemImage", "Item image is required").custom(
      //     (itemImage, { req }) => {
      //       if (req.file) {
      //         return true
      //       } else {
      //         throw "File not uploaded"
      //       }
      //     }
      //   ),
      body("name", "Item name is required").isString(),
      body("restaurant_id", "Restaurant ID is required")
        .isString()
        .custom((restaurant_id, { req }) => {
          return Restaurant.findById(restaurant_id)
            .then((restaurant) => {
              if (restaurant) {
                return true
              } else {
                throw "Restaurant does not exist"
              }
            })
            .catch((error) => {
              throw new Error(error)
            })
        }),
      body("category_id", "Category ID is required")
        .isString()
        .custom((category_id, { req }) => {
          return Category.findOne({
            _id: category_id,
            restaurant_id: req.body.restaurant_id,
          })
            .then((category) => {
              if (category) {
                return true
              } else {
                throw "Category does not exist"
              }
            })
            .catch((error) => {
              throw new Error(error)
            })
        }),
      body("status", "Item status is required").isString(),
      body("price", "Price is required").isString(),
    ]
  }

  static validateFileUpload(req: Request, res: Response, next: NextFunction) {
    upload.single("itemImage")(req, res, (err) => {
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

  static getMenu() {
    return [
      param("restaurantId", "Restaurant ID is required")
        .isString()
        .custom((restaurantId, { req }) => {
          return Restaurant.findById(restaurantId)
            .then((restaurant) => {
              if (restaurant) {
                req.restaurant = restaurant;
                return true
              } else {
                throw "Restaurant does not exist"
              }
            })
            .catch((error) => {
              throw new Error(error)
            })
        }),
    ]
  }
}
