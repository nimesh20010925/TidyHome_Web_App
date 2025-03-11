import mongoose from "mongoose";
import Inventory from "../Models/inventoryModel.js";

class InventoryController {
  static async createInventoryItem(req, res, next) {
    const {
      homeId,
      itemImage,
      itemName,
      categoryId,
      quantity,
      price,
      itemType,
      supplierId,
      lowStockLevel,
      manufacturedDate,
      brandName,
      createdBy,
    } = req.body;

    try {
      const inventoryItem = new Inventory({
        homeId,
        itemImage,
        itemName,
        categoryId,
        quantity,
        price,
        itemType,
        supplierId,
        lowStockLevel,
        manufacturedDate,
        brandName,
        createdBy,
      });
      await inventoryItem.save();

      res.status(201).send("New inventory item added successfully!");
      console.log("New inventory item added successfully!");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Failed to add inventory item.");
    }
  }

  static async getAllInventoryItems(req, res, next) {
    try {
      const inventories = await Inventory.find();

      if (!inventories || inventories.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No inventories found.",
        });
      }

      res.status(200).json({
        success: true,
        data: inventories,
      });

      console.log("Successfully found inventories!");
    } catch (error) {
      console.error("Error fetching inventories:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch inventories.",
      });
    }
  }

  static async getInventoryItemById(req, res, next) {
    const { id } = req.params;

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid inventory ID format" });
      }

      const inventoryItem = await Inventory.findById(id);

      if (!inventoryItem) {
        return res.status(404).json({ error: "Inventory not found" });
      }

      res.status(200).json({ success: true, data: inventoryItem });
    } catch (error) {
      console.error("Error fetching inventory by ID:", error);
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  }

  static async updateInventoryItem(req, res, next) {
    const { id } = req.params;
    const updateData = req.body;

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid inventory ID format" });
      }

      const updatedInventory = await Inventory.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedInventory) {
        return res.status(404).json({ error: "Inventory not found" });
      }

      res.status(200).json({ success: true, data: updatedInventory });
    } catch (error) {
      console.error("Error updating inventory:", error);
      res.status(500).json({ error: "Failed to update inventory" });
    }
  }

  static async deleteInventoryItem(req, res, next) {
    const { id } = req.params;

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid inventory ID format" });
      }

      const deletedInventory = await Inventory.findByIdAndDelete(id);

      if (!deletedInventory) {
        return res.status(404).json({ error: "Inventory not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Inventory deleted successfully" });
    } catch (error) {
      console.error("Error deleting inventory:", error);
      res.status(500).json({ error: "Failed to delete inventory" });
    }
  }
}

export default InventoryController;
