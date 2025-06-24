const productService = require("../services/product.service");

const getAllProducts = async (req, res) => {
  const { page = 1 } = req.query;

  const products = await productService.getAllProducts(page);
  res.json(products);
};

const getProductsOnSale = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const products = await productService.getProductsOnSale(page);
    res.json(products);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      image_url: req.file ? req.file.filename : null,
    };
    const newProduct = await productService.addProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params);
    res.status(200).json(product);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await productService.getProductBySlug(req.params);
    res.status(200).json(product);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const getProductByName = async (req, res) => {
  try {
    const product = await productService.getProductByName(req.params);
    res.status(200).json(product);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = {
      ...req.body,
      id,
    };
    
    // Only set image_url if a new file is uploaded
    if (req.file) {
      productData.image_url = req.file.filename;
    }
    
    const updatedProduct = await productService.updateProduct(productData);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await productService.removeProduct(id);
    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

module.exports = {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductByName,
  getProductBySlug,
  getProductsOnSale,
};
