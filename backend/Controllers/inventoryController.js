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
      expiryDate,
      brandName,
      createdBy,
    } = req.body;

    try {
      console.log(req.body);
      const inventoryItem = new Inventory({
        homeId: mongoose.Types.ObjectId.isValid(homeId)
          ? new mongoose.Types.ObjectId(homeId)
          : null,
        itemImage,
        itemName,
        categoryId: mongoose.Types.ObjectId.isValid(categoryId)
          ? new mongoose.Types.ObjectId(categoryId)
          : null,
        supplierId: mongoose.Types.ObjectId.isValid(supplierId)
          ? new mongoose.Types.ObjectId(supplierId)
          : null,
        quantity,
        price,
        itemType,
        lowStockLevel,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
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
      const { homeId } = req.query;
      console.log("homeId from query:", homeId);

      if (!homeId) {
        return res.status(400).json({
          success: false,
          message: "homeId is required to fetch inventories.",
        });
      }

      const inventories = await Inventory.find({ homeId })
        .populate("categoryId")
        .populate("supplierId")
        .sort({ createdAt: -1 });

      if (!inventories || inventories.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No inventories found for the given homeId.",
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

  static async getInventoryCountByCategory(req, res, next) {
    try {
      const { homeId } = req.query;
      console.log("Home", homeId);

      if (!homeId || !mongoose.Types.ObjectId.isValid(homeId)) {
        return res.status(400).json({ error: "Valid homeId is required." });
      }

      const results = await Inventory.aggregate([
        {
          $match: {
            homeId: new mongoose.Types.ObjectId(homeId),
          },
        },
        {
          $group: {
            _id: "$categoryId",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "categorys",
            localField: "_id",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $project: {
            _id: 0,
            categoryId: "$_id",
            count: 1,
            categoryName: "$category.category_name",
            categoryImage: "$category.category_image",
          },
        },
      ]);

      console.log("results", results);
      res.status(200).json({ success: true, data: results });
    } catch (error) {
      console.error("Error getting inventory count by category:", error);
      res.status(500).json({ error: "Failed to fetch data" });
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
    let updateData = req.body;

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid inventory ID format" });
      }

      // Convert string IDs to ObjectId if they are valid
      if (updateData.categoryId) {
        updateData.categoryId = mongoose.Types.ObjectId.isValid(
          updateData.categoryId
        )
          ? new mongoose.Types.ObjectId(updateData.categoryId)
          : undefined; // Remove invalid categoryId
      }

      if (updateData.supplierId) {
        updateData.supplierId = mongoose.Types.ObjectId.isValid(
          updateData.supplierId
        )
          ? new mongoose.Types.ObjectId(updateData.supplierId)
          : undefined; // Remove invalid supplierId
      }

      // Filter out undefined fields to avoid overwriting with `undefined`
      updateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      );

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
