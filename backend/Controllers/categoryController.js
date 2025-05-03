import category from "../Models/category_model.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import userModel from "../Models/userModel.js";

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export const createcategory = async (req, res) => {
  try {
    const { category_type, category_name, category_description, date } = req.body;
    const userID = req.user._id; // From authenticateUser middleware

    if (!category_type || !category_name || !category_description || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Fetch user to get homeID
    const user = await userModel.findById(userID);
    if (!user || !user.homeID) {
      return res.status(400).json({ message: "User does not belong to a home" });
    }

    const newcategory = new category({
      category_type,
      category_name,
      category_description,
      date,
      category_image: req.file ? `/uploads/${req.file.filename}` : null,
      homeID: user.homeID, // Associate with home
    });

    const savedcategory = await newcategory.save();
    res.status(201).json({ message: "Category created successfully", savedcategory });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category name must be unique within the home" });
    }
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
};

export const createCategoryWithUpload = upload.single("category_image");

export const getcategory = async (req, res) => {
  try {
    const userID = req.user._id;
    const user = await userModel.findById(userID);
    if (!user || !user.homeID) {
      return res.status(400).json({ message: "User does not belong to a home" });
    }

    const categorys = await category.find({ homeID: user.homeID });
    res.status(200).json({ message: "Categories fetched successfully", categorys });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};

export const getcategoryById = async (req, res) => {
  try {
    const userID = req.user._id;
    const user = await userModel.findById(userID);
    if (!user || !user.homeID) {
      return res.status(400).json({ message: "User does not belong to a home" });
    }

    const categoryRecord = await category.findOne({
      _id: req.params.id,
      homeID: user.homeID,
    });
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
    const userID = req.user._id;
    const user = await userModel.findById(userID);
    if (!user || !user.homeID) {
      return res.status(400).json({ message: "User does not belong to a home" });
    }

    const categoryRecord = await category.findOne({
      _id: req.params.id,
      homeID: user.homeID,
    });
    if (!categoryRecord) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedData = {
      ...req.body,
      ...(req.file && { category_image: `/uploads/${req.file.filename}` }),
    };
    const updatedcategory = await category.findOneAndUpdate(
      { _id: req.params.id, homeID: user.homeID },
      updatedData,
      { new: true }
    );
    res.status(200).json({ message: "Category updated successfully", updatedcategory });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category name must be unique within the home" });
    }
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
};

export const updateCategoryWithUpload = upload.single("category_image");

export const deletecategory = async (req, res) => {
  try {
    const userID = req.user._id;
    const user = await userModel.findById(userID);
    if (!user || !user.homeID) {
      return res.status(400).json({ message: "User does not belong to a home" });
    }

    const deletedCategory = await category.findOneAndDelete({
      _id: req.params.id,
      homeID: user.homeID,
    });
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};