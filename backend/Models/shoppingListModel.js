import mongoose from "mongoose";

const Schema = mongoose.Schema;

const shoppingListSchema = new mongoose.Schema(
  {
    homeId: {
      type: Schema.Types.ObjectId,
      ref: "Home",
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    listName: {
      type: String,
      required: false,
    },
    shoppingDate: {
      type: Date,
      required: false,
    },
    shopVisitors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    itemList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShoppingListItems",
        required: false,
      },
    ],
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Completed"],
    },
  },
  { timestamps: true }
);

const ShoppingList = mongoose.model("ShoppingList", shoppingListSchema);

export default ShoppingList;
