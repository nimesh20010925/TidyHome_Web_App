import { supplier } from "../Models/supplier_model.js";

const createsupplier = async (req, res) => {
  try {
    const { supplier_id, supplier_name, supplier_contact, supplier_email, supplier_address, date, type } = req.body;

    if (!supplier_id || !supplier_name || !supplier_contact || !supplier_email || !supplier_address || !date || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newsupplier = new supplier({
      supplier_id,
      supplier_name,
      supplier_contact,
      supplier_email,
      supplier_address,
      date,
      type,
    });

    const savedsupplier = await newsupplier.save();
    res.status(201).json({ message: "Supplier created successfully", savedsupplier });
  } catch (error) {
    res.status(500).json({ message: "Error creating supplier", error: error.message });
  }
};

const getsupplier = async (req, res) => {
  try {
    const suppliers = await supplier.find();
    res.status(200).json({ message: "Suppliers fetched successfully", suppliers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching suppliers", error: error.message });
  }
};

const getsupplierById = async (req, res) => {
  try {
    const supplierRecord = await supplier.findById(req.params.id);
    if (!supplierRecord) {
      return res.status(404).json({ message: "Supplier record not found" });
    }
    res.status(200).json({ message: "Supplier fetched successfully", supplierRecord });
  } catch (error) {
    res.status(500).json({ message: "Error fetching supplier", error: error.message });
  }
};

const updatesupplier = async (req, res) => {
  try {
    const supplierRecord = await supplier.findById(req.params.id);
    if (!supplierRecord) {
      return res.status(404).json({ message: "Supplier record not found" });
    }
    const updatedsupplier = await supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Supplier updated successfully", updatedsupplier });
  } catch (error) {
    res.status(500).json({ message: "Error updating supplier", error: error.message });
  }
};

const deletesupplier = async (req, res) => {
  try {
    const supplierRecord = await supplier.findById(req.params.id);
    if (!supplierRecord) {
      return res.status(404).json({ message: "Supplier record not found" });
    }
    await supplier.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting supplier", error: error.message });
  }
};

const supplierController = {
  createsupplier,
  getsupplier,
  getsupplierById,
  updatesupplier,
  deletesupplier,
};

export default supplierController;