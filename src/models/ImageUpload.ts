import * as mongoose from "mongoose"
import { model } from "mongoose"

const imageUploadSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true,
    default: true
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
})

export default model("imageUploads", imageUploadSchema)
