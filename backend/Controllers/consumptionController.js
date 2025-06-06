import { consumption } from "../Models/consumption_model.js";
import Inventory from "../Models/inventoryModel.js";
import Notification from "../Models/notificationModel.js";
import userModel from "../Models/userModel.js";

const createConsumption = async (req, res) => {
  try {
    const {
      product_name,
      amount_used,
      item_type,
      date,
      remaining_stock,
      notes,
    } = req.body;
    const userID = req.user._id; // Extracted from authentication middleware

    // Validate input
    if (!product_name || !amount_used || !item_type || !date || !notes) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Parse amount_used to ensure it's a number
    const amountUsed = parseFloat(amount_used);
    if (isNaN(amountUsed) || amountUsed < 0) {
      return res
        .status(400)
        .json({ message: "Amount used must be a non-negative number" });
    }

    // Get the user's homeId
    const user = await userModel.findById(userID);
    if (!user || !user.homeID) {
      return res.status(403).json({
        message: "User does not belong to any home",
      });
    }
    const homeId = user.homeID;

    // Find the inventory item by product_name and homeId
    const inventoryItem = await Inventory.findOne({
      itemName: product_name,
      homeId,
    });
    if (!inventoryItem) {
      return res.status(404).json({
        message: `Inventory item '${product_name}' not found for this home`,
      });
    }

    // Validate item_type matches inventory
    if (inventoryItem.itemType !== item_type) {
      return res.status(400).json({
        message: `Item type '${item_type}' does not match inventory item type '${inventoryItem.itemType}'`,
      });
    }

    // Calculate remaining stock
    const currentStock = inventoryItem.quantity;
    const newRemainingStock = currentStock - amountUsed;
    if (newRemainingStock < 0) {
      return res.status(400).json({ message: "Insufficient stock available" });
    }

    // Create consumption record
    const newConsumption = new consumption({
      product_name,
      amount_used: amountUsed,
      item_type,
      homeId,
      date: new Date(date),
      remaining_stock: newRemainingStock,
      notes,
    });

    // Update inventory quantity
    inventoryItem.quantity = newRemainingStock;
    await inventoryItem.save();

    // Check for low stock and create notification
    if (inventoryItem.quantity <= inventoryItem.lowStockLevel) {
      const notification = new Notification({
        message: `Low stock alert: ${product_name} has only ${inventoryItem.quantity} units remaining`,
        user: userID, // Still notify the user
      });
      await notification.save();
    }

    // Save consumption record
    const savedConsumption = await newConsumption.save();

    res.status(201).json({
      message: "Consumption created successfully",
      savedConsumption,
    });
  } catch (error) {
    console.error("Error creating consumption:", error);
    res
      .status(500)
      .json({ message: "Error creating consumption", error: error.message });
  }
};

const getConsumption = async (req, res) => {
  try {
    const userID = req.user._id;
    const user = await userModel.findById(userID);
    if (!user || !user.homeID) {
      return res.status(403).json({
        message: "User does not belong to any home",
      });
    }
    const homeId = user.homeID;

    const consumptions = await consumption
      .find({ homeId })
      .populate("homeId", "homeName");
    res.status(200).json({
      message: "Consumptions fetched successfully",
      consumptions,
    });
  } catch (error) {
    console.error("Error fetching consumptions:", error);
    res
      .status(500)
      .json({ message: "Error fetching consumptions", error: error.message });
  }
};

const getConsumptionById = async (req, res) => {
  try {
    const userID = req.user._id;
    const user = await userModel.findById(userID);
    if (!user || !user.homeID) {
      return res.status(403).json({
        message: "User does not belong to any home",
      });
    }
    const homeId = user.homeID;

    const consumptionRecord = await consumption
      .findById(req.params.id)
      .populate("homeId", "homeName");
    if (!consumptionRecord) {
      return res.status(404).json({ message: "Consumption record not found" });
    }
    if (consumptionRecord.homeId.toString() !== homeId.toString()) {
      return res.status(403).json({
        message:
          "Unauthorized: You can only access consumption records for your home",
      });
    }
    res.status(200).json({
      message: "Consumption fetched successfully",
      consumptionRecord,
    });
  } catch (error) {
    console.error("Error fetching consumption:", error);
    res
      .status(500)
      .json({ message: "Error fetching consumption", error: error.message });
  }
};

const updateConsumption = async (req, res) => {
  try {
    const userID = req.user._id;
    const { product_name, amount_used, item_type, date, notes } = req.body;

    // Validate input
    if (!product_name || !amount_used || !item_type || !date || !notes) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Parse amount_used
    const newAmountUsed = parseFloat(amount_used);
    if (isNaN(newAmountUsed) || newAmountUsed < 0) {
      return res
        .status(400)
        .json({ message: "Amount used must be a non-negative number" });
    }

    // Get the user's homeId
    const user = await userModel.findById(userID);
    if (!user || !user.homeID) {
      return res.status(403).json({
        message: "User does not belong to any home",
      });
    }
    const homeId = user.homeID;

    // Find the consumption record
    const consumptionRecord = await consumption.findById(req.params.id);
    if (!consumptionRecord) {
      return res.status(404).json({ message: "Consumption record not found" });
    }
    if (consumptionRecord.homeId.toString() !== homeId.toString()) {
      return res.status(403).json({
        message:
          "Unauthorized: You can only update consumption records for your home",
      });
    }

    // Find the inventory item
    const inventoryItem = await Inventory.findOne({
      itemName: product_name,
      homeId,
    });
    if (!inventoryItem) {
      return res.status(404).json({
        message: `Inventory item '${product_name}' not found for this home`,
      });
    }

    // Validate item_type matches inventory
    if (inventoryItem.itemType !== item_type) {
      return res.status(400).json({
        message: `Item type '${item_type}' does not match inventory item type '${inventoryItem.itemType}'`,
      });
    }

    // Calculate stock adjustment
    const oldAmountUsed = parseFloat(consumptionRecord.amount_used);
    const stockDifference = oldAmountUsed - newAmountUsed; // Positive if reducing consumption, negative if increasing
    const newInventoryStock = inventoryItem.quantity + stockDifference;

    if (newInventoryStock < 0) {
      return res.status(400).json({ message: "Insufficient stock available" });
    }

    // Update inventory quantity
    inventoryItem.quantity = newInventoryStock;
    await inventoryItem.save();

    // Check for low stock and create notification
    if (inventoryItem.quantity <= inventoryItem.lowStockLevel) {
      const notification = new Notification({
        message: `Low stock alert: ${product_name} has only ${inventoryItem.quantity} units remaining`,
        user: userID,
      });
      await notification.save();
    }

    // Update consumption record
    const updatedConsumption = await consumption.findByIdAndUpdate(
      req.params.id,
      {
        product_name,
        amount_used: newAmountUsed,
        item_type,
        date: new Date(date),
        remaining_stock: newInventoryStock,
        notes,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Consumption updated successfully",
      updatedConsumption,
    });
  } catch (error) {
    console.error("Error updating consumption:", error);
    res
      .status(500)
      .json({ message: "Error updating consumption", error: error.message });
  }
};

const deleteConsumption = async (req, res) => {
  try {
    const userID = req.user._id;
    const user = await userModel.findById(userID);
    if (!user || !user.homeID) {
      return res.status(403).json({
        message: "User does not belong to any home",
      });
    }
    const homeId = user.homeID;

    const consumptionRecord = await consumption.findById(req.params.id);
    if (!consumptionRecord) {
      return res.status(404).json({ message: "Consumption record not found" });
    }
    if (consumptionRecord.homeId.toString() !== homeId.toString()) {
      return res.status(403).json({
        message:
          "Unauthorized: You can only delete consumption records for your home",
      });
    }

    // Restore inventory stock
    const inventoryItem = await Inventory.findOne({
      itemName: consumptionRecord.product_name,
      homeId,
    });
    if (inventoryItem) {
      inventoryItem.quantity += parseFloat(consumptionRecord.amount_used);
      await inventoryItem.save();
    }

    await consumption.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Consumption deleted successfully" });
  } catch (error) {
    console.error("Error deleting consumption:", error);
    res
      .status(500)
      .json({ message: "Error deleting consumption", error: error.message });
  }
};

const consumptionController = {
  createConsumption,
  getConsumption,
  getConsumptionById,
  updateConsumption,
  deleteConsumption,
};

export default consumptionController;
