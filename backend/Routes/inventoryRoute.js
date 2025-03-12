import express from "express";
import InventoryController from "../Controllers/inventoryController.js";

const inventoryRoutes = express.Router();

inventoryRoutes.post(
  "/createNewInventory",
  InventoryController.createInventoryItem
);

inventoryRoutes.get(
  "/getAllInventories",
  InventoryController.getAllInventoryItems
);

inventoryRoutes.get(
  "/getInventoryById/:id",
  InventoryController.getInventoryItemById
);

inventoryRoutes.put(
  "/updateInventory/:id",
  InventoryController.updateInventoryItem
);

inventoryRoutes.delete(
  "/deleteInventory/:id",
  InventoryController.deleteInventoryItem
);

export default inventoryRoutes;
