import * as mongoose from "mongoose"
import { model } from "mongoose";

const menuSchema = new mongoose.Schema({
  restaurant_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "restaurants",
  },
  category_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "categories",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  itemImage: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Available", "Sold Out"],
    default: "Available",
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
})
export default model("menus", menuSchema)
