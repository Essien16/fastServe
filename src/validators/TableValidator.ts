import { body, validationResult } from "express-validator"

export class TableValidators {
  static addTable() {
    return [
      body("restaurant_id")
        .exists()
        .withMessage("Restaurant ID is required")
        .isMongoId()
        .withMessage("Invalid Restaurant ID format"),

    //   body("number")
    //     .exists()
    //     .withMessage("Table number is required")
    //     .isNumeric()
    //     .withMessage("Table number must be a number")
    //     .custom((value) => {
    //       if (value > 0) return true
    //       throw new Error("Table number must be a positive number")
    //     }), I commented this out so that the increament function I did while creating a table works. So with this, the system automatically increases the table number itself each time a table is created.
    ]
  }
}
