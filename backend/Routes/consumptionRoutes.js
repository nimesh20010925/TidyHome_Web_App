import express from "express";
import consumptionController from "../Controllers/consumptionController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  authenticateUser,
  consumptionController.createConsumption
);
router.get("/", authenticateUser, consumptionController.getConsumption);
router.get("/:id", authenticateUser, consumptionController.getConsumptionById);
router.put("/:id", authenticateUser, consumptionController.updateConsumption);
router.delete(
  "/:id",
  authenticateUser,
  consumptionController.deleteConsumption
);

export default router;
