import { body, validationResult } from "express-validator"

export const validateOrder = [
  body("session_id")
    .exists()
    .withMessage("Session ID is required")
    .isString()
    .withMessage("Session ID must be a string"),

  body("restaurant_id")
    .exists()
    .withMessage("Restaurant ID is required")
    .isMongoId()
    .withMessage("Restaurant ID must be a valid MongoDB ID"),

  body("table_id")
    .exists()
    .withMessage("Table ID is required")
    .isMongoId()
    .withMessage("Table ID must be a valid MongoDB ID"),

  body("orderItems")
    .exists()
    .withMessage("Order items are required")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item")
    .custom((items) => {
      return items.every((item) => {
        return item.name && typeof item.price === "number" && item.quantity
      })
    })
    .withMessage("Each item must have a name, price, and quantity"),

  body("orderType")
    .exists()
    .withMessage("Order type is required")
    .isIn(["Dine-in", "Takeout", "Delivery"])
    .withMessage("Order type must be either Dine-in, Takeout, or Delivery"),

  body("status")
    .optional()
    .isIn(["Pending", "Prepared", "Delivered", "Paid"])
    .withMessage("Status must be either Pending, Prepared, Delivered, or Paid"),

  body("total_price")
    .exists()
    .withMessage("Total price is required")
    .isNumeric()
    .withMessage("Total price must be a number"),

  body("payment_method")
    .exists()
    .withMessage("Payment method is required")
    .isIn(["Cash", "POS", "Online"])
    .withMessage("Payment method must be either Cash, POS, or Online"),

  body("address")
    .if((value, { req }) => req.body.orderType === "Delivery")
    .exists()
    .withMessage("Address is required for Delivery orders")
    .isString()
    .withMessage("Address must be a string"),
]

export const checkOrderValidationResult = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}
