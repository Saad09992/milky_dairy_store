const productService = require("../services/product.service");

const getAllProducts = async (req, res) => {
  const { page = 1 } = req.query;

  const products = await productService.getAllProducts(page);
  res.json(products);
};

const createProduct = async (req, res) => {
  const productData = {
    ...req.body,
    image_url: req.file ? req.file.filename : null,
  };
  const newProduct = await productService.addProduct(productData);
  res.status(200).json(newProduct);
};

const getProduct = async (req, res) => {
  const product = await productService.getProductById(req.params);
  res.status(200).json(product);
};

const getProductBySlug = async (req, res) => {
  const product = await productService.getProductBySlug(req.params);
  res.status(200).json(product);
};

const getProductByName = async (req, res) => {
  const product = await productService.getProductByName(req.params);
  res.status(200).json(product);
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const productData = {
    ...req.body,
    image_url: req.file ? req.file.filename : null,
    id,
  };
  const updatedProduct = await productService.updateProduct(productData);
  res.status(200).json(updatedProduct);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const deletedProduct = await productService.removeProduct(id);
  res.status(200).json(deletedProduct);
};

module.exports = {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductByName,
  getProductBySlug,
};
