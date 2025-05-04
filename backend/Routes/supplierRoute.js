import express from "express";
import supplierController from "../Controllers/supplierController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authenticateUser, supplierController.createSupplier);
router.get("/", authenticateUser, supplierController.getSupplier);
router.get("/:id", authenticateUser, supplierController.getSupplierById);
router.put("/:id", authenticateUser, supplierController.updateSupplier);
router.delete("/:id", authenticateUser, supplierController.deleteSupplier);

export default router;