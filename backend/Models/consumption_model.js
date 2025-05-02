import mongoose from "mongoose";

const consumptionSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    amount_used: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    remaining_stock: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const consumption = mongoose.model("consumptions", consumptionSchema);
