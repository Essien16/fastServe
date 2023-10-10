import mongoose from "mongoose";
const { Schema, model } = mongoose;

const orderItemSchema = new Schema(
  {
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: "menus",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceAtOrderTime: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
)
const cartSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "users" },
  session_id: { type: String, required: true },
  items: [orderItemSchema],
  total_price: { type: Number, required: true, default: 0 },
})

export default model("carts", cartSchema)
