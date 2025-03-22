import express from "express";
import { createcategory, deletecategory, getcategory, getcategoryById, updatecategory } from "../Controllers/categoryController.js";

const router = express.Router();


router.post("/create", createcategory);
router.get("/", getcategory);
router.get("/getone/:id", getcategoryById);
router.put("/:id", updatecategory);
router.delete("/deletecat/:id", deletecategory);

export default router;


