import express from "express";
import supplierController from "../Controllers/supplierController.js";

const router = express.Router();


router.post("/create", supplierController.createsupplier);
router.get("/", supplierController.getsupplier);
router.get("/:id", supplierController.getsupplierById);
router.put("/:id", supplierController.updatesupplier);
router.delete("/:id", supplierController.deletesupplier);

export default router;



