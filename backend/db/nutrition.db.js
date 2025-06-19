const pool = require("../config");

const getProductNutritionDb = async (productId) => {
  const { rows } = await pool.query(
    "SELECT * FROM product_nutrition WHERE product_id = $1",
    [productId]
  );
  return rows[0];
};

const createProductNutritionDb = async ({
  product_id,
  calories,
  protein,
  fat,
  vitamin
}) => {
  // Convert vitamin string to array format
  let vitaminArray = null;
  if (vitamin) {
    vitaminArray = vitamin.split(',').map(v => v.trim());
  }
  
  const { rows } = await pool.query(
    `INSERT INTO product_nutrition 
     (product_id, calories, protein, fat, vitamin)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [product_id, calories, protein, fat, vitaminArray]
  );
  return rows[0];
};

const updateProductNutritionDb = async ({
  product_id,
  calories,
  protein,
  fat,
  vitamin
}) => {
  // Convert vitamin string to array format
  let vitaminArray = null;
  if (vitamin) {
    vitaminArray = vitamin.split(',').map(v => v.trim());
  }
  
  const { rows } = await pool.query(
    `UPDATE product_nutrition 
     SET calories = $2, protein = $3, fat = $4, vitamin = $5
     WHERE product_id = $1
     RETURNING *`,
    [product_id, calories, protein, fat, vitaminArray]
  );
  return rows[0];
};

const deleteProductNutritionDb = async (productId) => {
  const { rows } = await pool.query(
    "DELETE FROM product_nutrition WHERE product_id = $1 RETURNING *",
    [productId]
  );
  return rows[0];
};

module.exports = {
  getProductNutritionDb,
  createProductNutritionDb,
  updateProductNutritionDb,
  deleteProductNutritionDb,
}; 