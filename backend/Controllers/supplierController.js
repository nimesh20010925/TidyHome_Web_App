import { supplier } from "../Models/supplier_model.js";


const createsupplier = async (req, res) => {
  try {
    const { supplier_id, supplier_name, supplier_contact, supplier_email, supplier_address, date } = req.body;

    if (!supplier_id || !supplier_name || !supplier_contact || !supplier_email || !supplier_address || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newsupplier = new supplier({
      supplier_id,
      supplier_name,
      supplier_contact,
      supplier_email,
      supplier_address,
      date,
    });

    const savedsupplier = await newsupplier.save();
    res.status(201).json({ message: "supplier created successfully", savedsupplier });
  } catch (error) {
    res.status(500).json({ message: "error creating supplier", error: error.message });
  }
};

const getsupplier = async (req, res) => {
  try {
    const suppliers = await supplier.find();
    res.status(200).json({ message: "suppliers fetched successfully", suppliers });
  } catch (error) {
    res.status(500).json({ message: "error fetching suppliers", error: error.message });
  }
};

const getsupplierById = async (req, res) => {
  try {
    const supplierRecord = await supplier.findById(req.params.id);
    if (!supplierRecord) {
      return res.status(404).json({ message: "supplier not record found" });
    }
    res.status(200).json({ message: "supplier fetched successfully", supplierRecord });
  } catch (error) {
    res.status(500).json({ message: "error fetching supplier", error: error.message });
  }
};

const updatesupplier = async (req, res) => {
  try {
    const supplierRecord = await supplier.findById(req.params.id);
    if (!supplierRecord) {
      return res.status(404).json({ message: "supplier not record found" });
    }
    const updatedsupplier = await supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "supplier updated successfully", updatedsupplier });
  } catch (error) {
    res.status(500).json({ message: "error updating supplier", error: error.message });
  }
};

const deletesupplier = async (req, res) => {
  try {
    const supplierRecord = await supplier.findById(req.params.id);
    if (!supplierRecord) {
      return res.status(404).json({ message: "supplier not record found" });
    }
    await supplier.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "error deleting supplier", error: error.message });
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