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
  
  // Combine products with nutrition data and calculate discounted prices
  const productsWithNutrition = rows.map(product => {
    const nutrition = nutritionData.find(n => n.product_id === product.product_id);
    
    // Calculate discounted price if product is on sale
    let discountedPrice = null;
    if (product.is_on_sale && product.discount_percentage > 0) {
      const currentDate = new Date();
      const isSaleActive = (!product.sale_start_date || product.sale_start_date <= currentDate) &&
                         (!product.sale_end_date || product.sale_end_date >= currentDate);
      
      if (isSaleActive) {
        discountedPrice = product.price * (1 - product.discount_percentage / 100);
        discountedPrice = Math.round(discountedPrice * 100) / 100; // Round to 2 decimal places
      }
    }
    
    return {
      ...product,
      nutrition: nutrition || null,
      discounted_price: discountedPrice
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
  cholesterol,
  discount_percentage = 0.00,
  is_on_sale = false,
  sale_start_date = null,
  sale_end_date = null
}) => {
  try {
    // Calculate discounted price if product is on sale
    let discounted_price = null;
    if (is_on_sale && discount_percentage > 0) {
      discounted_price = price * (1 - discount_percentage / 100);
      discounted_price = Math.round(discounted_price * 100) / 100; // Round to 2 decimal places
    }

    // Create the product
    const { rows: product } = await pool.query(
      `INSERT INTO products(name, price, description, image_url, slug, discount_percentage, is_on_sale, sale_start_date, sale_end_date, discounted_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *;`,
      [name, price, description, image_url, slug, discount_percentage, is_on_sale, sale_start_date, sale_end_date, discounted_price]
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
        
        // Calculate discounted price if product is on sale
        let discounted_price = null;
        if (is_on_sale && discount_percentage > 0) {
          discounted_price = price * (1 - discount_percentage / 100);
          discounted_price = Math.round(discounted_price * 100) / 100; // Round to 2 decimal places
        }
        
        // Retry the insert
        const { rows: product } = await pool.query(
          `INSERT INTO products(name, price, description, image_url, slug, discount_percentage, is_on_sale, sale_start_date, sale_end_date, discounted_price)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING *;`,
          [name, price, description, image_url, slug, discount_percentage, is_on_sale, sale_start_date, sale_end_date, discounted_price]
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
  
  // Calculate discounted price if product is on sale
  let discountedPrice = null;
  if (productData.is_on_sale && productData.discount_percentage > 0) {
    const currentDate = new Date();
    const isSaleActive = (!productData.sale_start_date || productData.sale_start_date <= currentDate) &&
                       (!productData.sale_end_date || productData.sale_end_date >= currentDate);
    
    if (isSaleActive) {
      discountedPrice = productData.price * (1 - productData.discount_percentage / 100);
      discountedPrice = Math.round(discountedPrice * 100) / 100; // Round to 2 decimal places
    }
  }
  
  return {
    ...productData,
    nutrition: nutrition[0] || null,
    reviews: reviews,
    discounted_price: discountedPrice
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
  
  // Calculate discounted price if product is on sale
  let discountedPrice = null;
  if (productData.is_on_sale && productData.discount_percentage > 0) {
    const currentDate = new Date();
    const isSaleActive = (!productData.sale_start_date || productData.sale_start_date <= currentDate) &&
                       (!productData.sale_end_date || productData.sale_end_date >= currentDate);
    
    if (isSaleActive) {
      discountedPrice = productData.price * (1 - productData.discount_percentage / 100);
      discountedPrice = Math.round(discountedPrice * 100) / 100; // Round to 2 decimal places
    }
  }
  
  return {
    ...productData,
    nutrition: nutrition[0] || null,
    reviews: reviews,
    discounted_price: discountedPrice
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
  
  // Calculate discounted price if product is on sale
  let discountedPrice = null;
  if (productData.is_on_sale && productData.discount_percentage > 0) {
    const currentDate = new Date();
    const isSaleActive = (!productData.sale_start_date || productData.sale_start_date <= currentDate) &&
                       (!productData.sale_end_date || productData.sale_end_date >= currentDate);
    
    if (isSaleActive) {
      discountedPrice = productData.price * (1 - productData.discount_percentage / 100);
      discountedPrice = Math.round(discountedPrice * 100) / 100; // Round to 2 decimal places
    }
  }
  
  return {
    ...productData,
    nutrition: nutrition[0] || null,
    reviews: reviews,
    discounted_price: discountedPrice
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
  discount_percentage,
  is_on_sale,
  sale_start_date,
  sale_end_date,
  id,
}) => {
  // Calculate discounted price if product is on sale
  let discounted_price = null;
  if (is_on_sale && discount_percentage > 0) {
    discounted_price = price * (1 - discount_percentage / 100);
    discounted_price = Math.round(discounted_price * 100) / 100; // Round to 2 decimal places
  }

  // Build the UPDATE query dynamically based on whether image_url is provided
  let updateQuery, queryParams;
  
  if (image_url !== undefined && image_url !== null) {
    // Update with new image
    updateQuery = `UPDATE products 
                   SET name = $1, price = $2, description = $3, image_url = $4, slug = $5, 
                       discount_percentage = $6, is_on_sale = $7, sale_start_date = $8, sale_end_date = $9, discounted_price = $10
                   WHERE product_id = $11 
                   RETURNING *`;
    queryParams = [name, price, description, image_url, slug, discount_percentage, is_on_sale, sale_start_date, sale_end_date, discounted_price, id];
  } else {
    // Update without changing the image
    updateQuery = `UPDATE products 
                   SET name = $1, price = $2, description = $3, slug = $4, 
                       discount_percentage = $5, is_on_sale = $6, sale_start_date = $7, sale_end_date = $8, discounted_price = $9
                   WHERE product_id = $10 
                   RETURNING *`;
    queryParams = [name, price, description, slug, discount_percentage, is_on_sale, sale_start_date, sale_end_date, discounted_price, id];
  }

  const { rows: product } = await pool.query(updateQuery, queryParams);
  
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

const getProductsOnSaleDb = async ({ limit, offset }) => {
  const currentDate = new Date();
  
  // Get products on sale with review stats
  const { rows } = await pool.query(
    `SELECT products.*, trunc(avg(reviews.rating)) as avg_rating, count(reviews.*) 
     FROM products
     LEFT JOIN reviews ON products.product_id = reviews.product_id
     WHERE products.is_on_sale = true 
     AND (products.sale_start_date IS NULL OR products.sale_start_date <= $1)
     AND (products.sale_end_date IS NULL OR products.sale_end_date >= $1)
     AND products.discount_percentage > 0
     GROUP BY products.product_id 
     ORDER BY products.discount_percentage DESC
     LIMIT $2 OFFSET $3`,
    [currentDate, limit, offset]
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
  
  // Combine products with nutrition data and calculate discounted price
  const productsWithNutrition = rows.map(product => {
    const nutrition = nutritionData.find(n => n.product_id === product.product_id);
    const discountedPrice = product.price * (1 - product.discount_percentage / 100);
    
    return {
      ...product,
      nutrition: nutrition || null,
      discounted_price: Math.round(discountedPrice * 100) / 100 // Round to 2 decimal places
    };
  });
  
  return productsWithNutrition;
};

module.exports = {
  getProductDb,
  getProductByNameDb,
  createProductDb,
  updateProductDb,
  deleteProductDb,
  getAllProductsDb,
  getProductBySlugDb,
  getProductsOnSaleDb,
};
