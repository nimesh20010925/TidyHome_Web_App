import { consumption } from "../Models/consumption_model.js";

const createConsumption = async (req, res) => {
  try {
    const { product_name, amount_used, date, remaining_stock, notes } =
      req.body;
    const userID = req.user._id; // Extracted from authentication middleware

    if (!product_name || !amount_used || !date || !remaining_stock || !notes) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newConsumption = new consumption({
      product_name,
      amount_used,
      user: userID,
      date,
      remaining_stock,
      notes,
    });

    const savedConsumption = await newConsumption.save();
    res
      .status(201)
      .json({ message: "Consumption created successfully", savedConsumption });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating consumption", error: error.message });
  }
};

const getConsumption = async (req, res) => {
  try {
    const userID = req.user._id; // Extracted from authentication middleware
    const consumptions = await consumption
      .find({ user: userID })
      .populate("user", "name email");
    res
      .status(200)
      .json({ message: "Consumptions fetched successfully", consumptions });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching consumptions", error: error.message });
  }
};

const getConsumptionById = async (req, res) => {
  try {
    const userID = req.user._id; // Extracted from authentication middleware
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
    res
      .status(200)
      .json({ message: "Consumption fetched successfully", consumptionRecord });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching consumption", error: error.message });
  }
};

const updateConsumption = async (req, res) => {
  try {
    const userID = req.user._id; // Extracted from authentication middleware
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
    const updatedConsumption = await consumption.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Consumption updated successfully",
      updatedConsumption,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating consumption", error: error.message });
  }
};

const deleteConsumption = async (req, res) => {
  try {
    const userID = req.user._id; // Extracted from authentication middleware
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
    await consumption.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Consumption deleted successfully" });
  } catch (error) {
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
