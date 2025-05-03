// Controllers/consumptionController.js
import { consumption } from "../Models/consumption_model.js";
import Inventory from "../Models/inventoryModel.js";
import Notification from "../Models/notificationModel.js";

const createConsumption = async (req, res) => {
  try {
    const { product_name, amount_used, date, remaining_stock, notes } =
      req.body;
    const userID = req.user._id; // Extracted from authentication middleware

    // Validate input
    if (!product_name || !amount_used || !date || !notes) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Parse amount_used to ensure it's a number
    const amountUsed = parseFloat(amount_used);
    if (isNaN(amountUsed) || amountUsed < 0) {
      return res
        .status(400)
        .json({ message: "Amount used must be a non-negative number" });
    }

    // Find the inventory item by product_name
    const inventoryItem = await Inventory.findOne({ itemName: product_name });
    if (!inventoryItem) {
      return res
        .status(404)
        .json({ message: `Inventory item '${product_name}' not found` });
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
      user: userID,
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
        user: userID,
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
    const consumptions = await consumption
      .find({ user: userID })
      .populate("user", "name email");
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
    const consumptionRecord = await consumption
      .findById(req.params.id)
      .populate("user", "name email");
    if (!consumptionRecord) {
      return res.status(404).json({ message: "Consumption record not found" });
    }
    if (consumptionRecord.user.toString() !== userID.toString()) {
      return res.status(403).json({
        message:
          "Unauthorized: You can only access your own consumption records",
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
    const { product_name, amount_used, date, notes } = req.body;

    // Validate input
    if (!product_name || !amount_used || !date || !notes) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Parse amount_used
    const newAmountUsed = parseFloat(amount_used);
    if (isNaN(newAmountUsed) || newAmountUsed < 0) {
      return res
        .status(400)
        .json({ message: "Amount used must be a non-negative number" });
    }

    // Find the consumption record
    const consumptionRecord = await consumption.findById(req.params.id);
    if (!consumptionRecord) {
      return res.status(404).json({ message: "Consumption record not found" });
    }
    if (consumptionRecord.user.toString() !== userID.toString()) {
      return res.status(403).json({
        message:
          "Unauthorized: You can only update your own consumption records",
      });
    }

    // Find the inventory item
    const inventoryItem = await Inventory.findOne({ itemName: product_name });
    if (!inventoryItem) {
      return res
        .status(404)
        .json({ message: `Inventory item '${product_name}' not found` });
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
    const consumptionRecord = await consumption.findById(req.params.id);
    if (!consumptionRecord) {
      return res.status(404).json({ message: "Consumption record not found" });
    }
    if (consumptionRecord.user.toString() !== userID.toString()) {
      return res.status(403).json({
        message:
          "Unauthorized: You can only delete your own consumption records",
      });
    }

    // Restore inventory stock
    const inventoryItem = await Inventory.findOne({
      itemName: consumptionRecord.product_name,
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
