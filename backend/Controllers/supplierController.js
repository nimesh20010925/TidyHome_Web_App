import { supplier } from "../Models/supplier_model.js";
import userModel from "../Models/userModel.js";

const createSupplier = async (req, res) => {
  try {
    const {
      supplier_id,
      supplier_name,
      supplier_contact,
      supplier_email,
      supplier_address,
      date,
      type,
    } = req.body;
    const userID = req.user._id; // From authenticateUser middleware

    // Validate input
    if (
      !supplier_id ||
      !supplier_name ||
      !supplier_contact ||
      !supplier_email ||
      !supplier_address ||
      !date ||
      !type
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get the user's homeId
    const user = await userModel.findById(userID);
    if (!user || !user.homeID) {
      return res.status(403).json({
        message: "User does not belong to any home",
      });
    }
    const homeId = user.homeID;

    // Create new supplier
    const newSupplier = new supplier({
      supplier_id,
      supplier_name,
      supplier_contact,
      supplier_email,
      supplier_address,
      date: new Date(date),
      type,
      homeId, // Associate with home
    });

    const savedSupplier = await newSupplier.save();
    res
      .status(201)
      .json({ message: "Supplier created successfully", savedSupplier });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${field.replace(
          "homeId",
          "home"
        )} already exists for this home`,
      });
    }
    res
      .status(500)
      .json({ message: "Error creating supplier", error: error.message });
  }
};

const getSupplier = async (req, res) => {
  try {
    const userID = req.user._id;
    const user = await userModel.findById(userID);
    if (!user || !user.homeID) {
      return res.status(403).json({
        message: "User does not belong to any home",
      });
    }
    const homeId = user.homeID;

    const suppliers = await supplier
      .find({ homeId })
      .populate("homeId", "homeName");
    res
      .status(200)
      .json({ message: "Suppliers fetched successfully", suppliers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching suppliers", error: error.message });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const userID = req.user._id;
    const user = await userModel.findById(userID);
    if (!user || !user.homeID) {
      return res.status(403).json({
        message: "User does not belong to any home",
      });
    }
    const homeId = user.homeID;

    const supplierRecord = await supplier
      .findOne({
        _id: req.params.id,
        homeId,
      })
      .populate("homeId", "homeName");
    if (!supplierRecord) {
      return res.status(404).json({ message: "Supplier record not found" });
    }
    res
      .status(200)
      .json({ message: "Supplier fetched successfully", supplierRecord });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching supplier", error: error.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const userID = req.user._id;
    const user = await userModel.findById(userID);
    if (!user || !user.homeID) {
      return res.status(403).json({
        message: "User does not belong to any home",
      });
    }
    const homeId = user.homeID;

    const supplierRecord = await supplier.findOne({
      _id: req.params.id,
      homeId,
    });
    if (!supplierRecord) {
      return res.status(404).json({ message: "Supplier record not found" });
    }

    const updatedSupplier = await supplier
      .findOneAndUpdate({ _id: req.params.id, homeId }, req.body, { new: true })
      .populate("homeId", "homeName");
    res
      .status(200)
      .json({ message: "Supplier updated successfully", updatedSupplier });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${field.replace(
          "homeId",
          "home"
        )} already exists for this home`,
      });
    }
    res
      .status(500)
      .json({ message: "Error updating supplier", error: error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const userID = req.user._id;
    const user = await userModel.findById(userID);
    if (!user || !user.homeID) {
      return res.status(403).json({
        message: "User does not belong to any home",
      });
    }
    const homeId = user.homeID;

    const supplierRecord = await supplier.findOne({
      _id: req.params.id,
      homeId,
    });
    if (!supplierRecord) {
      return res.status(404).json({ message: "Supplier record not found" });
    }

    await supplier.findOneAndDelete({ _id: req.params.id, homeId });
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting supplier", error: error.message });
  }
};

const supplierController = {
  createSupplier,
  getSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};

export default supplierController;