import { consumption } from "../Models/consumption_model.js";


const createConsumption = async (req, res) => {
  try {
    const { product_name, amount_used, user, date, remaining_stock, notes } = req.body;

    if (!product_name || !amount_used || !user || !date || !remaining_stock || !notes) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newConsumption = new consumption({
      product_name,
      amount_used,
      user,
      date,
      remaining_stock,
      notes,
    });

    const savedConsumption = await newConsumption.save();
    res.status(201).json({ message: "consumption created successfully", savedConsumption });
  } catch (error) {
    res.status(500).json({ message: "error creating consumption", error: error.message });
  }
};

const getConsumption = async (req, res) => {
  try {
    const consumptions = await consumption.find();
    res.status(200).json({ message: "consumptions fetched successfully", consumptions });
  } catch (error) {
    res.status(500).json({ message: "error fetching consumptions", error: error.message });
  }
};

const getConsumptionById = async (req, res) => {
  try {
    const consumptionRecord = await consumption.findById(req.params.id);
    if (!consumptionRecord) {
      return res.status(404).json({ message: "consumption not record found" });
    }
    res.status(200).json({ message: "consumption fetched successfully", consumptionRecord });
  } catch (error) {
    res.status(500).json({ message: "error fetching consumption", error: error.message });
  }
};

const updateConsumption = async (req, res) => {
  try {
    const consumptionRecord = await consumption.findById(req.params.id);
    if (!consumptionRecord) {
      return res.status(404).json({ message: "consumption not record found" });
    }
    const updatedConsumption = await consumption.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "consumption updated successfully", updatedConsumption });
  } catch (error) {
    res.status(500).json({ message: "error updating consumption", error: error.message });
  }
};

const deleteConsumption = async (req, res) => {
  try {
    const consumptionRecord = await consumption.findById(req.params.id);
    if (!consumptionRecord) {
      return res.status(404).json({ message: "consumption not record found" });
    }
    await consumption.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "consumption deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "error deleting consumption", error: error.message });
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

