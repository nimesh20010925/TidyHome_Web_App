import  category  from "../Models/category_model.js";
import mongoose from "mongoose";


export const createcategory = async (req, res) => {
  try {
    const {  category_type, category_name, category_description, date } = req.body;

    if (!category_type || !category_name || !category_description || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newcategory = new category({
      
      category_type,
      category_name,
      category_description,
      date,
    });

    const savedcategory = await newcategory.save();
    res.status(201).json({ message: "category created successfully", savedcategory });
  } catch (error) {
    res.status(500).json({ message: "error creating category", error: error.message });
  }
};

export const getcategory = async (req, res) => {
  try {
    const categorys = await category.find();
    res.status(200).json({ message: "categorys fetched successfully", categorys });
  } catch (error) {
    res.status(500).json({ message: "error fetching categorys", error: error.message });
  }
};

export const getcategoryById = async (req, res) => {
  try {
    const categoryRecord = await category.findById(req.params.id);
    if (!categoryRecord) {
      return res.status(404).json({ message: "category not record found" });
    }
    res.status(200).json({ message: "category fetched successfully", categoryRecord });
  } catch (error) {
    res.status(500).json({ message: "error fetching category", error: error.message });
  }
};

export const updatecategory = async (req, res) => {
  try {
    const categoryRecord = await category.findById(req.params.id);
    if (!categoryRecord) {
      return res.status(404).json({ message: "category not record found" });
    }
    const updatedcategory = await category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "category updated successfully", updatedcategory });
  } catch (error) {
    res.status(500).json({ message: "error updating category", error: error.message });
  }
};

export const deletecategory = async (req, res) => {

  try {

    await category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category deleted successfully" });
    

  
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};