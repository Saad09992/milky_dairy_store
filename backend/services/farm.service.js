const {
  getAllFarmsDb,
  getFarmByIdDb,
  createFarmDb,
  updateFarmDb,
  deleteFarmDb,
  getFarmsByLocationDb,
  getFarmsByCertificationDb,
  getTotalFarmsCountDb,
} = require("../db/farm.db");
const { ErrorHandler } = require("../helpers/error");

class FarmService {
  getAllFarms = async (page = 1) => {
    try {
      const limit = 10;
      const offset = (page - 1) * limit;
      
      const [farms, totalCount] = await Promise.all([
        getAllFarmsDb({ limit, offset }),
        getTotalFarmsCountDb()
      ]);

      return {
        farms,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalFarms: totalCount,
          hasNextPage: page * limit < totalCount,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message);
    }
  };

  getFarmById = async (id) => {
    try {
      const farm = await getFarmByIdDb({ id });
      if (!farm) {
        throw new ErrorHandler(404, "Farm not found");
      }
      return farm;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message);
    }
  };

  createFarm = async (data) => {
    try {
      // Validate required fields
      const requiredFields = ['name', 'description', 'location', 'practices'];
      for (const field of requiredFields) {
        if (!data[field]) {
          throw new ErrorHandler(400, `${field} is required`);
        }
      }

      // Validate email format if provided
      if (data.contact_email && !this.isValidEmail(data.contact_email)) {
        throw new ErrorHandler(400, "Invalid email format");
      }

      // Validate established year if provided
      if (data.established_year) {
        const currentYear = new Date().getFullYear();
        if (data.established_year < 1800 || data.established_year > currentYear) {
          throw new ErrorHandler(400, "Invalid established year");
        }
      }

      return await createFarmDb(data);
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message);
    }
  };

  updateFarm = async (id, data) => {
    try {
      // Check if farm exists
      const existingFarm = await getFarmByIdDb({ id });
      if (!existingFarm) {
        throw new ErrorHandler(404, "Farm not found");
      }

      // Validate email format if provided
      if (data.contact_email && !this.isValidEmail(data.contact_email)) {
        throw new ErrorHandler(400, "Invalid email format");
      }

      // Validate established year if provided
      if (data.established_year) {
        const currentYear = new Date().getFullYear();
        if (data.established_year < 1800 || data.established_year > currentYear) {
          throw new ErrorHandler(400, "Invalid established year");
        }
      }

      const updatedData = {
        farm_id: id,
        ...data
      };

      return await updateFarmDb(updatedData);
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message);
    }
  };

  deleteFarm = async (id) => {
    try {
      const farm = await getFarmByIdDb({ id });
      if (!farm) {
        throw new ErrorHandler(404, "Farm not found");
      }
      return await deleteFarmDb({ id });
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message);
    }
  };

  getFarmsByLocation = async (location, page = 1) => {
    try {
      const limit = 10;
      const offset = (page - 1) * limit;
      
      const farms = await getFarmsByLocationDb({ location, limit, offset });
      return farms;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message);
    }
  };

  getFarmsByCertification = async (certification, page = 1) => {
    try {
      const limit = 10;
      const offset = (page - 1) * limit;
      
      const farms = await getFarmsByCertificationDb({ certification, limit, offset });
      return farms;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message);
    }
  };

  // Helper method to validate email format
  isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
}

module.exports = new FarmService(); 