import mongoose from "mongoose";

const Schema = mongoose.Schema;

const shoppingListItemsSchema = new mongoose.Schema(
  {
    homeId: {
      type: Schema.Types.ObjectId,
      ref: "Home",
      required: true,
    },
    shoppingListId: {
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
      trim: true,
    },
    itemType: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    estimatedItemCost: {
      type: Number,
      min: 0,
    },
    isUrgent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Completed"],
    },
  },
  { timestamps: true }
);

// Middleware to auto-calculate estimated cost before saving
shoppingListItemsSchema.pre("save", function (next) {
  this.estimatedItemCost = this.quantity * this.price;
  next();
});

const ShoppingListItems = mongoose.model(
  "ShoppingListItems",
  shoppingListItemsSchema
);

export default ShoppingListItems;
