import mongoose from "mongoose";
import ShoppingList from "../Models/shoppingListModel.js";
import ShoppingListItemsController from "./shoppingListItemsController.js";

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

      // Fetch shopping lists and populate itemList with actual item details
      const shoppingLists = await ShoppingList.find({
        $or: [
          { createdBy: req.user._id },
          { homeId: homeID },
          { shopVisitors: req.user._id },
        ],
      }).populate("itemList"); // Populating the itemList field with full item data

      if (!shoppingLists.length) {
        return res
          .status(404)
          .json({ success: false, message: "No shopping lists found." });
      }

      res.status(200).json({
        success: true,
        message: "Shopping lists retrieved successfully.",
        shoppingLists,
      });
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
        return res.status(404).json({
          success: false,
          message:
            "Shopping list not found or you are not authorized to delete this list.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Shopping list deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting shopping list:", error);
      res
        .status(500)
        .json({ success: false, message: "Error deleting shopping list." });
    }
  }

  static async updateShoppingList(req, res, next) {
    const { listId } = req.params;
    const { listName, shoppingDate, shopVisitors, itemList } = req.body;

    console.log(req.body);

    try {
      let createdItemIds = [];

      // Create new shopping list items only if `itemList` is provided
      if (Array.isArray(itemList) && itemList.length > 0) {
        createdItemIds = await Promise.all(
          itemList.map(async (item) => {
            const reqClone = { ...req, body: item }; // Mock request for item creation
            const resClone = {
              status: () => ({ send: () => {} }), // Mock response
            };

            const createdItem =
              await ShoppingListItemsController.createNewShoppingListItem(
                reqClone,
                resClone,
                next
              );

            return createdItem._id; // Return created item ID
          })
        );
      }

      // Update the shopping list with new item details
      const shoppingList = await ShoppingList.findOneAndUpdate(
        { _id: listId },
        {
          listName,
          shoppingDate,
          shopVisitors,
          ...(createdItemIds.length > 0 && {
            $push: { itemList: { $each: createdItemIds } },
          }),
        },
        { new: true }
      );

      if (!shoppingList) {
        return res.status(404).json({
          success: false,
          message:
            "Shopping list not found or you are not authorized to update this list.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Shopping list updated successfully.",
        shoppingList,
      });
    } catch (error) {
      console.error("Error updating shopping list:", error);
      res.status(500).json({
        success: false,
        message: "Error updating shopping list.",
      });
    }
  }
}

export default ShoppingListController;
