// Removed Stripe integration
// const Stripe = require("stripe");
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  payment = async (amount, email) => {
    // Cash payment confirmation
    return { status: "success", message: "Cash payment confirmed", amount, email };
  };
}

module.exports = new PaymentService();
