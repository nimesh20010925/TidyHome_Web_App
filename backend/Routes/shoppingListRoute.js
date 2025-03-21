import express from "express";
import ShoppingListController from "../Controllers/shoppingListController.js";
import { authenticateUser, authorizeHomeOwner } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get shopping lists
router.get("/shopping-lists", authenticateUser, ShoppingListController.getShoppingLists);

// Route to create a new shopping list
router.post("/shopping-lists", authenticateUser, authorizeHomeOwner, ShoppingListController.createNewShoppingList);

export default router;
