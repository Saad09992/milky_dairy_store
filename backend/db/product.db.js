const pool = require("../config");

const getAllProductsDb = async ({ limit, offset }) => {
  // Get products with review stats
  const { rows } = await pool.query(
    `SELECT products.*, trunc(avg(reviews.rating)) as avg_rating, count(reviews.*) 
     FROM products
     LEFT JOIN reviews ON products.product_id = reviews.product_id
     GROUP BY products.product_id 
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  
  // Get nutrition data for all products
  const productIds = rows.map(product => product.product_id);
  let nutritionData = [];
  
  if (productIds.length > 0) {
    const { rows: nutrition } = await pool.query(
      "SELECT * FROM product_nutrition WHERE product_id = ANY($1)",
      [productIds]
    );
    nutritionData = nutrition;
  }
  
  // Combine products with nutrition data
  const productsWithNutrition = rows.map(product => {
    const nutrition = nutritionData.find(n => n.product_id === product.product_id);
    return {
      ...product,
      nutrition: nutrition || null
    };
  });
  
  const products = [...productsWithNutrition].sort(() => Math.random() - 0.5);
  return products;
};

const createProductDb = async ({
  name,
  price,
  description,
  image_url,
  slug,
  calories,
  protein,
  fat,
  vitamin,
  carbohydrates,
  fiber,
  sugar,
  sodium,
  cholesterol
}) => {
  try {
    // Create the product
    const { rows: product } = await pool.query(
      `INSERT INTO products(name, price, description, image_url, slug)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *;`,
      [name, price, description, image_url, slug]
    );
    
    const newProduct = product[0];
    
    // Create nutrition data if provided
    if (calories !== undefined || protein !== undefined || fat !== undefined || vitamin !== undefined) {
      try {
        // Convert vitamin string to array format
        let vitaminArray = null;
        if (vitamin) {
          vitaminArray = vitamin.split(',').map(v => v.trim());
        }
        
        const { rows: nutrition } = await pool.query(
          `INSERT INTO product_nutrition 
           (product_id, calories, protein, fat, vitamin)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (product_id) DO UPDATE SET
           calories = EXCLUDED.calories,
           protein = EXCLUDED.protein,
           fat = EXCLUDED.fat,
           vitamin = EXCLUDED.vitamin
           RETURNING *`,
          [newProduct.product_id, calories, protein, fat, vitaminArray]
        );
        
        return { ...newProduct, nutrition: nutrition[0] };
      } catch (error) {
        console.error('Error creating nutrition data:', error);
        // Return product without nutrition if nutrition creation fails
        return newProduct;
      }
    }
    
    return newProduct;
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'products_pkey') {
      // Primary key constraint violation - reset the sequence
      try {
        await pool.query("SELECT setval('products_product_id_seq', (SELECT MAX(product_id) FROM products))");
        // Retry the insert
        const { rows: product } = await pool.query(
          `INSERT INTO products(name, price, description, image_url, slug)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *;`,
          [name, price, description, image_url, slug]
        );
        
        const newProduct = product[0];
        
        // Create nutrition data if provided
        if (calories !== undefined || protein !== undefined || fat !== undefined || vitamin !== undefined) {
          try {
            // Convert vitamin string to array format
            let vitaminArray = null;
            if (vitamin) {
              vitaminArray = vitamin.split(',').map(v => v.trim());
            }
            
            const { rows: nutrition } = await pool.query(
              `INSERT INTO product_nutrition 
               (product_id, calories, protein, fat, vitamin)
               VALUES ($1, $2, $3, $4, $5)
               ON CONFLICT (product_id) DO UPDATE SET
               calories = EXCLUDED.calories,
               protein = EXCLUDED.protein,
               fat = EXCLUDED.fat,
               vitamin = EXCLUDED.vitamin
               RETURNING *`,
              [newProduct.product_id, calories, protein, fat, vitaminArray]
            );
            
            return { ...newProduct, nutrition: nutrition[0] };
          } catch (nutritionError) {
            console.error('Error creating nutrition data after retry:', nutritionError);
            return newProduct;
          }
        }
        
        return newProduct;
      } catch (retryError) {
        throw new Error('Failed to create product after sequence reset');
      }
    }
    throw error;
  }
};

const getProductDb = async ({ id }) => {
  // Get product with review stats
  const { rows: product } = await pool.query(
    `SELECT products.*, trunc(avg(reviews.rating),1) as avg_rating, count(reviews.*) 
     FROM products
     LEFT JOIN reviews ON products.product_id = reviews.product_id
     WHERE products.product_id = $1
     GROUP BY products.product_id`,
    [id]
  );
  
  if (product.length === 0) {
    return null;
  }
  
  const productData = product[0];
  
  // Get nutrition data separately
  const { rows: nutrition } = await pool.query(
    "SELECT * FROM product_nutrition WHERE product_id = $1",
    [id]
  );
  
  // Get reviews separately
  const { rows: reviews } = await pool.query(
    `SELECT reviews.*, users.fullname, users.username 
     FROM reviews 
     LEFT JOIN users ON reviews.user_id = users.user_id
     WHERE reviews.product_id = $1
     ORDER BY reviews.date DESC`,
    [id]
  );
  
  return {
    ...productData,
    nutrition: nutrition[0] || null,
    reviews: reviews
  };
};

const getProductBySlugDb = async ({ slug }) => {
  // Get product with review stats
  const { rows: product } = await pool.query(
    `SELECT products.*, trunc(avg(reviews.rating),1) as avg_rating, count(reviews.*) 
     FROM products
     LEFT JOIN reviews ON products.product_id = reviews.product_id
     WHERE products.slug = $1
     GROUP BY products.product_id`,
    [slug]
  );
  
  if (product.length === 0) {
    return null;
  }
  
  const productData = product[0];
  
  // Get nutrition data separately
  const { rows: nutrition } = await pool.query(
    "SELECT * FROM product_nutrition WHERE product_id = $1",
    [productData.product_id]
  );
  
  // Get reviews separately
  const { rows: reviews } = await pool.query(
    `SELECT reviews.*, users.fullname, users.username 
     FROM reviews 
     LEFT JOIN users ON reviews.user_id = users.user_id
     WHERE reviews.product_id = $1
     ORDER BY reviews.date DESC`,
    [productData.product_id]
  );
  
  return {
    ...productData,
    nutrition: nutrition[0] || null,
    reviews: reviews
  };
};

const getProductByNameDb = async ({ name }) => {
  // Get product with review stats
  const { rows: product } = await pool.query(
    `SELECT products.*, trunc(avg(reviews.rating),1) as avg_rating, count(reviews.*) 
     FROM products
     LEFT JOIN reviews ON products.product_id = reviews.product_id
     WHERE products.name = $1
     GROUP BY products.product_id`,
    [name]
  );
  
  if (product.length === 0) {
    return null;
  }
  
  const productData = product[0];
  
  // Get nutrition data separately
  const { rows: nutrition } = await pool.query(
    "SELECT * FROM product_nutrition WHERE product_id = $1",
    [productData.product_id]
  );
  
  // Get reviews separately
  const { rows: reviews } = await pool.query(
    `SELECT reviews.*, users.fullname, users.username 
     FROM reviews 
     LEFT JOIN users ON reviews.user_id = users.user_id
     WHERE reviews.product_id = $1
     ORDER BY reviews.date DESC`,
    [productData.product_id]
  );
  
  return {
    ...productData,
    nutrition: nutrition[0] || null,
    reviews: reviews
  };
};

const updateProductDb = async ({
  name,
  price,
  description,
  image_url,
  slug,
  calories,
  protein,
  fat,
  vitamin,
  carbohydrates,
  fiber,
  sugar,
  sodium,
  cholesterol,
  id,
}) => {
  // Update the product
  const { rows: product } = await pool.query(
    "UPDATE products SET name = $1, price = $2, description = $3, image_url = $4, slug = $5 WHERE product_id = $6 RETURNING *",
    [name, price, description, image_url, slug, id]
  );
  
  if (product.length === 0) {
    throw new Error('Product not found');
  }
  
  const updatedProduct = product[0];
  
  // Handle nutrition data update
  if (calories !== undefined || protein !== undefined || fat !== undefined || vitamin !== undefined) {
    try {
      // Convert vitamin string to array format
      let vitaminArray = null;
      if (vitamin) {
        vitaminArray = vitamin.split(',').map(v => v.trim());
      }
      
      const { rows: nutrition } = await pool.query(
        `INSERT INTO product_nutrition 
         (product_id, calories, protein, fat, vitamin)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (product_id) DO UPDATE SET
         calories = EXCLUDED.calories,
         protein = EXCLUDED.protein,
         fat = EXCLUDED.fat,
         vitamin = EXCLUDED.vitamin
         RETURNING *`,
        [id, calories, protein, fat, vitaminArray]
      );
      
      return { ...updatedProduct, nutrition: nutrition[0] };
    } catch (error) {
      console.error('Error updating nutrition data:', error);
      return updatedProduct;
    }
  }
  
  return updatedProduct;
};

const deleteProductDb = async ({ id }) => {
  const { rows } = await pool.query(
    "DELETE FROM products WHERE product_id = $1 RETURNING *",
    [id]
  );
  return rows[0];
};

module.exports = {
  getProductDb,
  getProductByNameDb,
  createProductDb,
  updateProductDb,
  deleteProductDb,
  getAllProductsDb,
  getProductBySlugDb,
};
