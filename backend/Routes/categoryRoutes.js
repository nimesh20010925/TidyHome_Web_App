import express from "express";
import categoryController from "../Controllers/categoryController.js";

const router = express.Router();


router.post("/create", categoryController.createcategory);
router.get("/", categoryController.getcategory);
router.get("/:id", categoryController.getcategoryById);
router.put("/:id", categoryController.updatecategory);
router.delete("/:id", categoryController.deletecategory);

export default router;


