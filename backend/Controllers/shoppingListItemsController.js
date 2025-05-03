import mongoose from "mongoose";
import ShoppingListItems from "../Models/shoppingListItemsModel.js";

class ShoppingListItemsController {
  static async createNewShoppingListItem(req, res, next) {
    const {
      homeId,
      shoppingListId,
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
        shoppingListId: mongoose.Types.ObjectId.isValid(shoppingListId)
          ? new mongoose.Types.ObjectId(shoppingListId)
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

      const savedItem = await shoppingListItem.save();

      console.log("New shopping list item created successfully!");
      return savedItem;
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Failed to create new shopping list item.");
    }
  }

  static async getShoppingListItemById(req, res, next) {
    const { itemId } = req.params;

    try {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid item ID format.",
        });
      }

      const shoppingListItem = await ShoppingListItems.findById(itemId);

      if (!shoppingListItem) {
        return res.status(404).json({
          success: false,
          message: "Shopping list item not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Shopping list item retrieved successfully.",
        shoppingListItem,
      });
    } catch (error) {
      console.error("Error fetching shopping list item:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching shopping list item.",
      });
    }
  }

  static async updateShoppingListItem(req, res, next) {
    const { itemId } = req.params;
    const updateData = req.body;

    console.log("📞 updateShoppingListItem called with itemId:", itemId);
    console.log("🧾 Body:", updateData);

    try {
      if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid item ID format.",
        });
      }

      const updateObject = {
        ...updateData,
        ...(updateData.homeId &&
        mongoose.Types.ObjectId.isValid(updateData.homeId)
          ? { homeId: new mongoose.Types.ObjectId(updateData.homeId) }
          : {}),
        ...(updateData.shoppingListId &&
        mongoose.Types.ObjectId.isValid(updateData.shoppingListId)
          ? {
              shoppingListId: new mongoose.Types.ObjectId(
                updateData.shoppingListId
              ),
            }
          : {}),
        ...(updateData.inventoryId &&
        mongoose.Types.ObjectId.isValid(updateData.inventoryId)
          ? { inventoryId: new mongoose.Types.ObjectId(updateData.inventoryId) }
          : {}),
      };

      console.log("🛠️ Update object:", updateObject);

      const updatedItem = await ShoppingListItems.findByIdAndUpdate(
        itemId,
        updateObject,
        { new: true, runValidators: true }
      );

      if (!updatedItem) {
        return res.status(404).json({
          success: false,
          message: "Shopping list item not found.",
        });
      }

      console.log("✅ Shopping list item updated:", updatedItem._id);

      res.status(200).json({
        success: true,
        message: "Shopping list item updated successfully.",
        shoppingListItem: updatedItem,
      });
    } catch (error) {
      console.error("❌ Error updating shopping list item:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update shopping list item.",
      });
    }
  }

  static async deleteShoppingListItem(req, res, next) {
    const { itemId } = req.params;

    try {
      if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid item ID format.",
        });
      }

      const deletedItem = await ShoppingListItems.findByIdAndDelete(itemId);

      if (!deletedItem) {
        return res.status(404).json({
          success: false,
          message: "Shopping list item not found.",
        });
      }

      console.log("Shopping list item deleted successfully!");
      res.status(200).json({
        success: true,
        message: "Shopping list item deleted successfully.",
        shoppingListItem: deletedItem,
      });
    } catch (error) {
      console.error("Error deleting shopping list item:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete shopping list item.",
      });
    }
  }
}

export default ShoppingListItemsController;
