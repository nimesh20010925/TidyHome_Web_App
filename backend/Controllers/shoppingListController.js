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
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Failed to create shopping list.");
    }
  }

  static async getShoppingLists(req, res, next) {
    try {
      const { homeID } = req.user; // Assuming req.user contains homeID for the authenticated user

      // Check if the user is the home owner or a member of the home
      const shoppingLists = await ShoppingList.find({
        $or: [
          { createdBy: req.user._id }, // Shopping lists created by the authenticated user
          { homeId: homeID }, // Shopping lists for the user's home
          { shopVisitors: req.user._id }, // Shopping lists where the user is a visitor
        ],
      });

      if (shoppingLists.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No shopping lists found." });
      }

      res.status(200).json(shoppingLists);
    } catch (error) {
      console.error("Error fetching shopping lists:", error);
      res
        .status(500)
        .json({ success: false, message: "Error fetching shopping lists." });
    }
  }

  static async getShoppingListById(req, res, next) {
    const { id } = req.params;

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ error: "Invalid shopping list ID format" });
      }

      const shoppingList = await ShoppingList.findById(id);

      if (!inventoryItem) {
        return res.status(404).json({ error: "Inventory not found" });
      }

      res.status(200).json({ success: true, data: shoppingList });
    } catch (error) {
      console.error("Error fetching shopping list by ID:", error);
      res.status(500).json({ error: "Failed to fetch shopping list" });
    }
  }

  static async getAllItemsByShoppingListId(req, res, next) {
    const { id } = req.params;

    try {
      const shoppingList = await ShoppingList.findById(id).populate("itemList");

      if (!shoppingList) {
        return res.status(404).json({
          success: false,
          message: "Shopping list not found.",
        });
      }

      if (!shoppingList.itemList || shoppingList.itemList.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No items found in this shopping list.",
        });
      }

      res.status(200).json({
        success: true,
        data: shoppingList.itemList,
      });

      console.log("Successfully found shopping list items!");
    } catch (error) {
      console.error("Error fetching shopping list items:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch shopping list items.",
      });
    }
  }

 
  static async deleteShoppingList(req, res, next) {
    const { listId } = req.params;

    try {
      const shoppingList = await ShoppingList.findOneAndDelete({
        _id: listId,
        createdBy: req.user._id, // Ensure only the home owner can delete
      });

      if (!shoppingList) {
        return res.status(404).json({ success: false, message: 'Shopping list not found or you are not authorized to delete this list.' });
      }

      res.status(200).json({ success: true, message: 'Shopping list deleted successfully.' });
    } catch (error) {
      console.error('Error deleting shopping list:', error);
      res.status(500).json({ success: false, message: 'Error deleting shopping list.' });
    }
  }

  static async updateShoppingList(req, res, next) {
    const { listId } = req.params;
    const { listName, shoppingDate, shopVisitors, itemList } = req.body;

    try {
      const shoppingList = await ShoppingList.findOneAndUpdate(
        { _id: listId, createdBy: req.user._id }, // Ensure only the home owner can update
        { listName, shoppingDate, shopVisitors, itemList },
        { new: true }
      );

      if (!shoppingList) {
        return res.status(404).json({ success: false, message: 'Shopping list not found or you are not authorized to update this list.' });
      }

      res.status(200).json({ success: true, message: 'Shopping list updated successfully.', shoppingList });
    } catch (error) {
      console.error('Error updating shopping list:', error);
      res.status(500).json({ success: false, message: 'Error updating shopping list.' });
    }
  }


}

export default ShoppingListController;
