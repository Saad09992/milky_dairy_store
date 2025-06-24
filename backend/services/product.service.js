const { createProductReview } = require("../controllers/products.controller");
const {
  getAllProductsDb,
  createProductDb,
  getProductDb,
  updateProductDb,
  deleteProductDb,
  getProductByNameDb,
  getProductBySlugDb,
  getProductsOnSaleDb,
} = require("../db/product.db");
const { ErrorHandler } = require("../helpers/error");

class ProductService {
  getAllProducts = async (page) => {
    const limit = 12;
    const offset = (page - 1) * limit;
    try {
      return await getAllProductsDb({ limit, offset });
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  getProductsOnSale = async (page) => {
    const limit = 12;
    const offset = (page - 1) * limit;
    try {
      return await getProductsOnSaleDb({ limit, offset });
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  addProduct = async (data) => {
    try {
      // Generate slug from name
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const body = {
        ...data,
        slug: slug,
        discount_percentage: data.discount_percentage || 0.00,
        is_on_sale: data.is_on_sale || false,
        sale_start_date: data.sale_start_date || null,
        sale_end_date: data.sale_end_date || null,
      };

      return await createProductDb(body);
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message);
    }
  };

  getProductById = async (id) => {
    try {
      const product = await getProductDb(id);
      if (!product) {
        throw new ErrorHandler(404, "product not found");
      }
      return product;
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  getProductBySlug = async (slug) => {
    try {
      const product = await getProductBySlugDb(slug);
      if (!product) {
        throw new ErrorHandler(404, "product not found");
      }
      return product;
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  getProductByName = async (name) => {
    try {
      const product = await getProductByNameDb(name);
      if (!product) {
        throw new ErrorHandler(404, "product not found");
      }
      return product;
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  updateProduct = async (data) => {
    try {
      const product = await getProductDb(data);
      if (!product) {
        throw new ErrorHandler(404, "product not found");
      }
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const body = {
        ...data,
        slug: slug,
        discount_percentage: data.discount_percentage || 0.00,
        is_on_sale: data.is_on_sale || false,
        sale_start_date: data.sale_start_date || null,
        sale_end_date: data.sale_end_date || null,
      };
      return await updateProductDb(body);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  removeProduct = async (id) => {
    try {
      const data = {
        id,
      };
      const product = await getProductDb(data);
      console.log(product);
      if (!product) {
        throw new ErrorHandler(404, "product not found");
      }
      return await deleteProductDb(data);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
}

module.exports = new ProductService();
