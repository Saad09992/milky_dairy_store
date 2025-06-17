const pool = require("../config");

const getReviewsDb = async ({ product_id }) => {
  const reviewExist = await pool.query(
    "SELECT EXISTS (SELECT * FROM reviews where product_id = $1)",
    [product_id]
  );

  // get reviews associated with the product
  const reviews = await pool.query(
    `SELECT users.fullname as name, reviews.* FROM reviews
        join users 
        on users.user_id = reviews.user_id
        WHERE product_id = $1`,
    [product_id]
  );
  return {
    reviewExist: reviewExist.rows[0].exists,
    reviews: reviews.rows,
  };
};

const createReviewDb = async ({ product_id, content, rating, userId }) => {
  const { rows: review } = await pool.query(
    `INSERT INTO reviews(user_id, product_id, content, rating, date) 
     VALUES($1, $2, $3, $4, CURRENT_DATE) 
     RETURNING *`,
    [userId, product_id, content, rating]
  );
  return review[0];
};

const updateReviewDb = async ({ content, rating, id }) => {
  const { rows: review } = await pool.query(
    `UPDATE reviews 
     SET content = $1, rating = $2, date = CURRENT_DATE 
     WHERE id = $3 
     RETURNING *`,
    [content, rating, id]
  );
  return review[0];
};

module.exports = {
  createReviewDb,
  updateReviewDb,
  getReviewsDb,
};
