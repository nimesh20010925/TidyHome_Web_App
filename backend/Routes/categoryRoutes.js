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
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authenticateUser, createCategoryWithUpload, createcategory);
router.get("/", authenticateUser, getcategory);
router.get("/getone/:id", authenticateUser, getcategoryById);
router.put("/:id", authenticateUser, updateCategoryWithUpload, updatecategory);
router.delete("/:id", authenticateUser, deletecategory);

export default router;