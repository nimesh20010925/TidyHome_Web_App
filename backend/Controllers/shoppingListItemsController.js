import mongoose from "mongoose";
import ShoppingListItems from "../Models/shoppingListModel.js";

class ShoppingListItemsController {
  static async createNewShoppingListItem(req, res, next) {
    const {
      homeId,
      shopppingListId,
      inventoryId,
      itemName,
      itemType,
      quantity,
      price,
      estimatedItemCost,
      isUrgent,
      status,
    } = req.body;

    try {
      const shoppingListItem = new ShoppingListItems({
        homeId: mongoose.Types.ObjectId.isValid(homeId)
          ? new mongoose.Types.ObjectId(homeId)
          : null,
        shopppingListId: mongoose.Types.ObjectId.isValid(shopppingListId)
          ? new mongoose.Types.ObjectId(shopppingListId)
          : null,
        inventoryId: mongoose.Types.ObjectId.isValid(inventoryId)
          ? new mongoose.Types.ObjectId(inventoryId)
          : null,
        itemName,
        itemType,
        quantity,
        price,
        estimatedItemCost,
        isUrgent,
        status,
      });

      await shoppingListItem.save();

      res.status(201).send("New shopping list item created successfully!");
      console.log("New shopping list item created successfully!");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Failed to create new shopping list item.");
    }
  }

  
}

export default ShoppingListItemsController;
