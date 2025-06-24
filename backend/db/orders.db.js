const pool = require("../config/index");

const createOrderDb = async ({
  cartId,
  amount,
  itemTotal,
  userId,
  ref,
  paymentMethod,
}) => {
  const { rows: order } = await pool.query(
    "INSERT INTO orders(user_id, status, amount, total, ref, payment_method) VALUES($1, 'complete', $2, $3, $4, $5) returning *",
    [userId, amount, itemTotal, ref, paymentMethod]
  );

  // copy cart items from the current cart_item table into order_item table with pricing information
  await pool.query(
    `
      INSERT INTO order_item(
        order_id, 
        product_id, 
        quantity, 
        price_at_time, 
        discounted_price_at_time, 
        is_on_sale_at_time, 
        discount_percentage_at_time, 
        subtotal
      ) 
      SELECT 
        $1, 
        ci.product_id, 
        ci.quantity,
        p.price,
        p.discounted_price,
        p.is_on_sale,
        p.discount_percentage,
        CASE 
          WHEN p.is_on_sale = true AND p.discounted_price IS NOT NULL 
          THEN p.discounted_price * ci.quantity
          ELSE p.price * ci.quantity
        END as subtotal
      FROM cart_item ci
      JOIN products p ON ci.product_id = p.product_id
      WHERE ci.cart_id = $2
      returning *
      `,
    [order[0].order_id, cartId]
  );
  return order[0];
};

const getAllOrdersDb = async ({ userId, limit, offset }) => {
  const { rowCount } = await pool.query(
    "SELECT * from orders WHERE orders.user_id = $1",
    [userId]
  );
  const orders = await pool.query(
    `SELECT order_id, user_id, status, date::date, amount, total 
      from orders WHERE orders.user_id = $1 order by order_id desc limit $2 offset $3`,
    [userId, limit, offset]
  );
  return { items: orders.rows, total: rowCount };
};

const getOrderDb = async ({ id, userId }) => {
  const { rows: order } = await pool.query(
    `SELECT 
      products.*, 
      order_item.quantity,
      order_item.price_at_time,
      order_item.discounted_price_at_time,
      order_item.is_on_sale_at_time,
      order_item.discount_percentage_at_time,
      order_item.subtotal
      from orders 
      join order_item
      on order_item.order_id = orders.order_id
      join products 
      on products.product_id = order_item.product_id 
      where orders.order_id = $1 AND orders.user_id = $2`,
    [id, userId]
  );
  console.log(order);
  return order;
};

module.exports = {
  createOrderDb,
  getAllOrdersDb,
  getOrderDb,
};
