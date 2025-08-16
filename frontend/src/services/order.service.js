import api from "../api/baseUrl";

class OrderService {
  createOrder(amount, itemTotal, ref, paymentMethod, paymentDetails = {}) {
    return api.post("/orders", {
      amount,
      itemTotal,
      ref,
      paymentMethod,
      paymentDetails,
    });
  }
  getAllOrders(page) {
    return api.get(`/orders/?page=${page}`);
  }
  getOrder(id) {
    return api.get(`/orders/${id}`);
  }
}

export default new OrderService();
