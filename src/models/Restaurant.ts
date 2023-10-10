import mongoose from "mongoose"
const { Schema, model } = mongoose

const restaurantSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
  name: { type: String, required: true },
  description: { type: String },
  cover: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
})

export default model("restaurants", restaurantSchema)
