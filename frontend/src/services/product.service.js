import api from "../api/baseUrl";
class ProductService {
  getProducts(page) {
    return api.get(`/products/?page=${page}`);
  }
  getProduct(id) {
    return api.get(`/products/${id}`);
  }
  getProductByName(name) {
    return api.get(`/products/${name}`);
  }
}

export default new ProductService();
