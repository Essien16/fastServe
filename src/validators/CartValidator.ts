import { body, validationResult } from "express-validator"

export const validateAddToCart = [
  body("menuItemId")
    .exists()
    .withMessage("Menu item ID is required")
    .isMongoId()
    .withMessage("Menu item ID must be a valid MongoDB ID"),

  body("quantity")
    .exists()
    .withMessage("Quantity is required")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be a positive integer"),
]

export const validateRemoveFromCart = [
  body("menuItemId")
    .exists()
    .withMessage("Menu item ID is required")
    .isMongoId()
    .withMessage("Menu item ID must be a valid MongoDB ID"),
]

export const checkCartValidationResult = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}
