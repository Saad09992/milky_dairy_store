const paymentService = require("../services/payment.service");
const pool = require("../config/index");

const makePayment = async (req, res) => {
  const { email, amount, orderId } = req.body;

  // Call the updated cash payment service
  const result = await paymentService.payment(amount, email);

  // Store cash payment data in the cash_payments table
  await pool.query(
    "INSERT INTO cash_payments (order_id, amount) VALUES ($1, $2)",
    [orderId, amount]
  );

  res.json(result);
};

module.exports = {
  makePayment,
};
