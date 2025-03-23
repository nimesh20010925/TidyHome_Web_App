import category from "../Models/category_model.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists in your project root
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

export const createcategory = async (req, res) => {
  try {
    const { category_type, category_name, category_description, date } = req.body;

    if (!category_type || !category_name || !category_description || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newcategory = new category({
      category_type,
      category_name,
      category_description,
      date,
      category_image: req.file ? `/uploads/${req.file.filename}` : null, // Save image path
    });

    const savedcategory = await newcategory.save();
    res.status(201).json({ message: "Category created successfully", savedcategory });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
};

// Apply multer middleware to the create route
export const createCategoryWithUpload = upload.single("category_image");

// Keep other methods as they are unless they need image handling
export const getcategory = async (req, res) => {
  try {
    const categorys = await category.find();
    res.status(200).json({ message: "Categories fetched successfully", categorys });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};

export const getcategoryById = async (req, res) => {
  try {
    const categoryRecord = await category.findById(req.params.id);
    if (!categoryRecord) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category fetched successfully", categoryRecord });
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error: error.message });
  }
};

export const updatecategory = async (req, res) => {
  try {
    const categoryRecord = await category.findById(req.params.id);
    if (!categoryRecord) {
      return res.status(404).json({ message: "Category not found" });
    }
    const updatedData = {
      ...req.body,
      ...(req.file && { category_image: `/uploads/${req.file.filename}` }),
    };
    const updatedcategory = await category.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.status(200).json({ message: "Category updated successfully", updatedcategory });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
};

// Apply multer middleware to the update route
export const updateCategoryWithUpload = upload.single("category_image");

export const deletecategory = async (req, res) => {
  try {
    const deletedCategory = await category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};