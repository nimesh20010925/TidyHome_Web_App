import mongoose from "mongoose";
import Inventory from "./inventoryModel.js";

const consumptionSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
      validate: {
        validator: async function (value) {
          // Check if product_name exists in the inventory for the same homeId
          const consumption = this;
          const inventoryItem = await Inventory.findOne({
            homeId: consumption.homeId,
            itemName: value,
          });
          return !!inventoryItem;
        },
        message:
          "Product name must match an item in the inventory for this home.",
      },
    },
    amount_used: {
      type: String, // Kept as string to match frontend, parsed in controller
      required: true,
    },
    item_type: {
      type: String, // New field to store item_type (e.g., "kg", "ml")
      required: true,
    },
    homeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    remaining_stock: {
      type: String, // Kept as string to match frontend, parsed in controller
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

consumptionSchema.pre("save", function (next) {
  if (this.remaining_stock != null) {
    const parsedStock = parseFloat(this.remaining_stock);
    if (!isNaN(parsedStock)) {
      this.remaining_stock = parsedStock.toFixed(2); // Format to 2 decimal places
    }
  }
  next();
});

export const consumption = mongoose.model("consumptions", consumptionSchema);
