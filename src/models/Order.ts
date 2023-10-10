import mongoose from "mongoose"
const { Schema } = mongoose

const orderItemSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  {
    _id: false,
  }
)

const orderSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false, //this field is set to false so that first time users dont have to signup to use the system
    },
    session_id: {
      type: String,
      required: true, //this session ID is used to track the order throughout its lifecycle since the signup isn't mandatory for first time users.
    },
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: "restaurants",
      required: true,
    },
    table_id: {
      type: Schema.Types.ObjectId,
      ref: "tables",
      required: true,
    },
    orderItems: [orderItemSchema],
    orderType: {
      type: String,
      enum: ["DINE-IN", "TAKEOUT", "DELIVERY"],
      required: true,
    },
    address: {
      type: String,
      required: function () {
        return this.orderType === "DELIVERY"
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Prepared", "Delivered", "Paid"],
      default: "Pending",
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    note: String,
    payment_method: {
      type: String,
      enum: ["Cash", "POS", "Online"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

orderSchema.index({ user_id: 1, restaurant_id: 1, table_id: 1 })

const Order = mongoose.model("orders", orderSchema)

export default Order
