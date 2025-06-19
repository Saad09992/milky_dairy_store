const {
  getProductNutritionDb,
  createProductNutritionDb,
  updateProductNutritionDb,
  deleteProductNutritionDb,
} = require("../db/nutrition.db");
const { ErrorHandler } = require("../helpers/error");

class NutritionService {
  getProductNutrition = async (productId) => {
    try {
      const nutrition = await getProductNutritionDb(productId);
      if (!nutrition) {
        throw new ErrorHandler(404, "Nutrition data not found for this product");
      }
      return nutrition;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message);
    }
  };

  createProductNutrition = async (data) => {
    try {
      // Validate required fields
      const requiredFields = ['calories', 'protein', 'fat', 'vitamin'];
      for (const field of requiredFields) {
        if (!data[field] && data[field] !== 0) {
          throw new ErrorHandler(400, `${field} is required`);
        }
      }

      return await createProductNutritionDb(data);
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message);
    }
  };

  updateProductNutrition = async (data) => {
    try {
      const existingNutrition = await getProductNutritionDb(data.product_id);
      if (!existingNutrition) {
        throw new ErrorHandler(404, "Nutrition data not found for this product");
      }

      return await updateProductNutritionDb(data);
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message);
    }
  };

  deleteProductNutrition = async (productId) => {
    try {
      const existingNutrition = await getProductNutritionDb(productId);
      if (!existingNutrition) {
        throw new ErrorHandler(404, "Nutrition data not found for this product");
      }

      return await deleteProductNutritionDb(productId);
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message);
    }
  };
}

module.exports = new NutritionService(); 