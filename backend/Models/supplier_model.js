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
    homeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
      required: true, // Ensure every supplier is tied to a home
    },
  },
  {
    timestamps: true,
  }
);

// Ensure supplier_id and supplier_email are unique within a home
supplierSchema.index({ supplier_id: 1, homeId: 1 }, { unique: true });
supplierSchema.index({ supplier_email: 1, homeId: 1 }, { unique: true });

export const supplier = mongoose.model("suppliers", supplierSchema);
