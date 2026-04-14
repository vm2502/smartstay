const FoodModel = require('../models/foodModel');

const getMenu = async (req, res) => {
  try {
    const menuItems = await FoodModel.getTodayMenu();
    res.json(menuItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching food menu' });
  }
};

const addItem = async (req, res) => {
  try {
    const { meal_type, item_name } = req.body;
    if (!meal_type || !item_name) {
      return res.status(400).json({ message: 'Missing meal_type or item_name' });
    }
    const newItem = await FoodModel.addItem(meal_type, item_name);
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding food menu item' });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await FoodModel.deleteItem(id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting food menu item' });
  }
};

module.exports = {
  getMenu,
  addItem,
  deleteItem
};
