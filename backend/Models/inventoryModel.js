import mongoose from "mongoose";

const Schema = mongoose.Schema;

const inventorySchema = new mongoose.Schema(
  {
    homeId: {
      type: Schema.Types.ObjectId,
      ref: "Home",
      required: true,
    },
    itemImage: {
      type: String,
      required: false,
    },
    itemName: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "categorys",
      required: false,
    },
    quantity: {
      type: Number,
      required: false,
      min: [0, "Quantity cannot be negative"],
    },
    price: {
      type: Number,
      required: false,
    },
    itemType: {
      type: String,
      required: false,
    },
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "suppliers",
      required: false,
    },
    lowStockLevel: {
      type: Number,
      required: false,
    },
    expiryDate: {
      type: Date,
      required: false,
    },
    brandName: {
      type: String,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
