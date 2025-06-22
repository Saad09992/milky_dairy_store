const farmService = require("../services/farm.service");

const getAllFarms = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const result = await farmService.getAllFarms(parseInt(page));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const getFarmById = async (req, res) => {
  try {
    const { id } = req.params;
    const farm = await farmService.getFarmById(id);
    res.status(200).json(farm);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const createFarm = async (req, res) => {
  try {
    const farmData = {
      ...req.body,
      image_url: req.file ? req.file.filename : null,
    };
    
    // Convert certifications string to array if provided as string
    if (farmData.certifications && typeof farmData.certifications === 'string') {
      farmData.certifications = farmData.certifications.split(',').map(cert => cert.trim());
    }
    
    const newFarm = await farmService.createFarm(farmData);
    res.status(201).json(newFarm);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const updateFarm = async (req, res) => {
  try {
    const { id } = req.params;
    const farmData = {
      ...req.body,
      image_url: req.file ? req.file.filename : null,
    };
    
    // Convert certifications string to array if provided as string
    if (farmData.certifications && typeof farmData.certifications === 'string') {
      farmData.certifications = farmData.certifications.split(',').map(cert => cert.trim());
    }
    
    const updatedFarm = await farmService.updateFarm(id, farmData);
    res.status(200).json(updatedFarm);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const deleteFarm = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFarm = await farmService.deleteFarm(id);
    res.status(200).json({ 
      message: "Farm deleted successfully", 
      farm: deletedFarm 
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const getFarmsByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const { page = 1 } = req.query;
    const farms = await farmService.getFarmsByLocation(location, parseInt(page));
    res.status(200).json(farms);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const getFarmsByCertification = async (req, res) => {
  try {
    const { certification } = req.params;
    const { page = 1 } = req.query;
    const farms = await farmService.getFarmsByCertification(certification, parseInt(page));
    res.status(200).json(farms);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

module.exports = {
  getAllFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm,
  getFarmsByLocation,
  getFarmsByCertification,
}; 