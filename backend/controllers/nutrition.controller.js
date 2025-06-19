const nutritionService = require("../services/nutrition.service");

const getProductNutrition = async (req, res) => {
  try {
    const { productId } = req.params;
    const nutrition = await nutritionService.getProductNutrition(productId);
    res.status(200).json(nutrition);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const createProductNutrition = async (req, res) => {
  try {
    const nutritionData = {
      ...req.body,
      product_id: req.params.productId
    };
    const newNutrition = await nutritionService.createProductNutrition(nutritionData);
    res.status(201).json(newNutrition);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const updateProductNutrition = async (req, res) => {
  try {
    const { productId } = req.params;
    const nutritionData = {
      ...req.body,
      product_id: productId
    };
    const updatedNutrition = await nutritionService.updateProductNutrition(nutritionData);
    res.status(200).json(updatedNutrition);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const deleteProductNutrition = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedNutrition = await nutritionService.deleteProductNutrition(productId);
    res.status(200).json(deletedNutrition);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

module.exports = {
  getProductNutrition,
  createProductNutrition,
  updateProductNutrition,
  deleteProductNutrition
}; 