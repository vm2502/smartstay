const pool = require('./config/db');

pool.query("CREATE TABLE IF NOT EXISTS food_menu (id INT AUTO_INCREMENT PRIMARY KEY, meal_type ENUM('breakfast', 'lunch', 'dinner'), item_name VARCHAR(100), menu_date DATE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);")
  .then(() => {
    console.log('Created food_menu table');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
