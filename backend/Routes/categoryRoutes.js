import express from "express";
import {
  createcategory,
  deletecategory,
  getcategory,
  getcategoryById,
  updatecategory,
  createCategoryWithUpload,
  updateCategoryWithUpload,
} from "../Controllers/categoryController.js";

const router = express.Router();

router.post("/create", createCategoryWithUpload, createcategory);
router.get("/", getcategory);
router.get("/getone/:id", getcategoryById);
router.put("/:id", updateCategoryWithUpload, updatecategory);
router.delete("/:id", deletecategory);

export default router;