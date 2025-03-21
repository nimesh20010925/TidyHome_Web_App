import express from "express";
import InventoryController from "../Controllers/inventoryController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const inventoryRoutes = express.Router();

inventoryRoutes.post(
  "/createNewInventory",
  authenticateUser,
  InventoryController.createInventoryItem
);

inventoryRoutes.get(
  "/getAllInventories",
  authenticateUser,
  InventoryController.getAllInventoryItems
);

inventoryRoutes.get(
  "/getInventoryById/:id",
  authenticateUser,
  InventoryController.getInventoryItemById
);

inventoryRoutes.put(
  "/updateInventory/:id",
  authenticateUser,
  InventoryController.updateInventoryItem
);

inventoryRoutes.delete(
  "/deleteInventory/:id",
  authenticateUser,
  InventoryController.deleteInventoryItem
);

export default inventoryRoutes;
