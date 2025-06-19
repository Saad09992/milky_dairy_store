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
  
  // Admin methods
  createProduct(productData) {
    return api.post("/products", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  
  updateProduct(id, productData) {
    return api.put(`/products/${id}`, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  
  deleteProduct(id) {
    return api.delete(`/products/${id}`);
  }
}

export default new ProductService();
