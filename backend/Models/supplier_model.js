import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    supplier_id: {
      type: String,
      required: true,
    },
    supplier_name: {
      type: String,
      required: true,
    },
    supplier_contact: {
      type: String,
      required: true,
    },
    supplier_email: {
      type: String,
      required: true,
    },
    supplier_address: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Supplier", "Store"],
      default: "Supplier",
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure every supplier is tied to a user
    },
  },
  {
    timestamps: true,
  }
);

// Ensure supplier_id and supplier_email are unique within a user
supplierSchema.index({ supplier_id: 1, userID: 1 }, { unique: true });
supplierSchema.index({ supplier_email: 1, userID: 1 }, { unique: true });

export const supplier = mongoose.model("suppliers", supplierSchema);
