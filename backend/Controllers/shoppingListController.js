import mongoose from 'mongoose';
import ShoppingList from '../Models/shoppingListModel.js';

class ShoppingListController {
  static async createNewShoppingList(req, res, next) {
    const { homeId, createdBy, listName, shoppingDate, shopVisitors, itemList } = req.body;

    try {
      const shoppingList = new ShoppingList({
        homeId: mongoose.Types.ObjectId.isValid(homeId) ? new mongoose.Types.ObjectId(homeId) : null,
        createdBy: mongoose.Types.ObjectId.isValid(createdBy) ? new mongoose.Types.ObjectId(createdBy) : null,
        listName,
        shoppingDate,
        shopVisitors,
        itemList,
        status: 'Pending',
      });

      await shoppingList.save();
      res.status(201).send('New shopping list created successfully!');
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Failed to create shopping list.');
    }
  }

  static async getShoppingLists(req, res, next) {
    try {
      const { homeID } = req.user;  // Assuming req.user contains homeID for the authenticated user

      // Check if the user is the home owner or a member of the home
      const shoppingLists = await ShoppingList.find({
        $or: [
          { createdBy: req.user._id }, // Shopping lists created by the authenticated user
          { homeId: homeID },          // Shopping lists for the user's home
          { shopVisitors: req.user._id } // Shopping lists where the user is a visitor
        ],
      })
        

      if (shoppingLists.length === 0) {
        return res.status(404).json({ success: false, message: 'No shopping lists found.' });
      }

      res.status(200).json(shoppingLists);
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
      res.status(500).json({ success: false, message: 'Error fetching shopping lists.' });
    }
  }
}

export default ShoppingListController;
