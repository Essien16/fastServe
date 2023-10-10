import * as mongoose from "mongoose"
import { model } from "mongoose"

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "active",
  },
  created_at: {
    type: Date,
    required: true,
    default: new Date(),
  },
  updated_at: {
    type: Date,
    required: true,
    default: new Date(),
  },
  restaurant_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'restaurants'
  }
})
export default model("categories", categorySchema)
