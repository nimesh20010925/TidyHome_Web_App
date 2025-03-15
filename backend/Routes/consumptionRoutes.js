import express from "express";
import consumptionController from "../Controllers/consumptionController.js";

const router = express.Router();


router.post("/create", consumptionController.createConsumption);
router.get("/", consumptionController.getConsumption);
router.get("/:id", consumptionController.getConsumptionById);
router.put("/:id", consumptionController.updateConsumption);
router.delete("/:id", consumptionController.deleteConsumption);

export default router;