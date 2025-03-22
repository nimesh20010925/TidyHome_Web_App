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
      enum: ['Supplier', 'Store'], // Restrict to these values
      default: 'Supplier'
    },
  },
  {
    timestamps: true,
  }
);

export const supplier = mongoose.model("suppliers", supplierSchema);