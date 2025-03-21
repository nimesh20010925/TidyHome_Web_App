import mongoose from "mongoose";

const Schema = mongoose.Schema;

const shoppingListItemsSchema = new mongoose.Schema(
  {
    homeId: {
      type: Schema.Types.ObjectId,
      ref: "Home",
      required: true,
    },
    shopppingListId: {
      type: Schema.Types.ObjectId,
      ref: "ShoppingList",
      required: true,
    },
    inventoryId: {
      type: Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    itemType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedItemCost: {
      type: Number,
      required: true,
    },
    isUrgent: {
      type: Boolean,
      default: false,
      required: false,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Completed"],
    },
  },
  { timestamps: true }
);

const ShoppingListItems = mongoose.model(
  "ShoppingListItems",
  shoppingListItemsSchema
);

export default ShoppingListItems;
