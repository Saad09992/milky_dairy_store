import api from "../api/baseUrl";

class CartService {
  getCart() {
    return api.get("/cart");
  }
  async addToCart(product_id, quantity) {
    return await api.post("/cart/add", { product_id, quantity });
  }

  async removeFromCart(product_id) {
    return await api.delete("/cart/delete", {
      data: { product_id: Number(product_id) },
    });
  }

  async increment(product_id) {
    return api.put("/cart/increment", { product_id });
  }

  async decrement(product_id) {
    return api.put("/cart/decrement", { product_id });
  }
}

export default new CartService();
