import express from "express";
import supplierController from "../Controllers/supplierController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authenticateUser, supplierController.createsupplier);
router.get("/", authenticateUser, supplierController.getsupplier);
router.get("/:id", authenticateUser, supplierController.getsupplierById);
router.put("/:id", authenticateUser, supplierController.updatesupplier);
router.delete("/:id", authenticateUser, supplierController.deletesupplier);

export default router;