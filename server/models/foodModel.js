const pool = require('../config/db');

const FoodModel = {
  async getTodayMenu() {
    const [rows] = await pool.query('SELECT * FROM food_menu WHERE menu_date = CURDATE() ORDER BY id ASC');
    return rows;
  },

  async addItem(meal_type, item_name) {
    const [result] = await pool.query(
      'INSERT INTO food_menu (meal_type, item_name, menu_date) VALUES (?, ?, CURDATE())',
      [meal_type, item_name]
    );
    return { id: result.insertId, meal_type, item_name, menu_date: new Date() };
  },

  async deleteItem(id) {
    await pool.query('DELETE FROM food_menu WHERE id = ?', [id]);
  }
};

module.exports = FoodModel;
