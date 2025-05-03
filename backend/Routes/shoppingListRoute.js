import express from "express";
import ShoppingListController from "../Controllers/shoppingListController.js";
import {
  authenticateUser,
  authorizeHomeOwner,
} from "../middleware/authMiddleware.js";
import ShoppingListItemsController from "../Controllers/shoppingListItemsController.js";

const router = express.Router();

// Route to get shopping lists
router.get(
  "/shopping-lists",
  authenticateUser,
  ShoppingListController.getShoppingLists
);

router.get(
  "/getShoppingListById/:id",
  authenticateUser,
  ShoppingListController.getShoppingListById
);

router.get(
  "/getAllItemsByShoppingListId/:id",
  authenticateUser,
  ShoppingListController.getAllItemsByShoppingListId
);

// Route to create a new shopping list
router.post(
  "/shopping-lists",
  authenticateUser,
  authorizeHomeOwner,
  ShoppingListController.createNewShoppingList
);

// Route to update a shopping list (only accessible by home owner)
router.put(
  "/shopping-lists/:listId",
  authenticateUser,
  ShoppingListController.updateShoppingList
);

// Route to delete a shopping list (only accessible by home owner)
router.delete(
  "/shopping-lists/:listId",
  authenticateUser,
  authorizeHomeOwner,
  ShoppingListController.deleteShoppingList
);

// Route to delete a shopping list item (only accessible by home owner)
router.delete(
  "/shopping-list-items/:itemId",
  authenticateUser,
  authorizeHomeOwner,
  ShoppingListItemsController.deleteShoppingListItem
);

export default router;
