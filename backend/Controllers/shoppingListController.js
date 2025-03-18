import mongoose from "mongoose";
import ShoppingList from "../Models/shoppingListModel.js";

class ShoppingListController {
  static async createNewShoppingList(req, res, next) {
    const {
      homeId,
      createdBy,
      listName,
      shoppingDate,
      shopVisitors,
      itemList,
    } = req.body;

    try {
      const shoppingList = new ShoppingList({
        homeId: mongoose.Types.ObjectId.isValid(homeId)
          ? new mongoose.Types.ObjectId(homeId)
          : null,
        createdBy: mongoose.Types.ObjectId.isValid(createdBy)
          ? new mongoose.Types.ObjectId(createdBy)
          : null,
        listName,
        shoppingDate,
        shopVisitors,
        itemList,
        status: "Pending", 
      });

      await shoppingList.save();

      res.status(201).send("New shopping list created successfully!");
      console.log("New shopping list created successfully!");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Failed to create shopping list.");
    }
  }
}

export default ShoppingListController;
