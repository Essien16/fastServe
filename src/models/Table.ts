import mongoose from "mongoose";
import { model } from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "restaurants",
    },
    status: {
      type: String,
      required: true,
      enum: ["Available", "Occupied"],
      default: "Available",
    },
    order_ids: [ //this implementation can take multiple orders from the same table
      {
        type: mongoose.Types.ObjectId,
        ref: "orders",
      },
    ],
    qr_code: {
      type: String,
      required: true,
      unique: true,
    },
    number: {
      type: Number, // Table number or identifier that is human-readable. i.e Table 2
      required: true,
    },
//     seating_capacity: {
//       type: Number,
//       required: true,
//       min: 1,
//     },
   },
  {
    timestamps: true,
  }
)

// Add indexes on fields that will be frequently queried
tableSchema.index({ restaurant_id: 1, status: 1, number: 1 }, { unique: true })

const Table = mongoose.model("tables", tableSchema)

export default Table
