import api from "./baseUrl";

// Get all farms with pagination
export const getAllFarms = async (page = 1) => {
  try {
    const response = await api.get(`/farms?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get farm by ID
export const getFarmById = async (id) => {
  try {
    const response = await api.get(`/farms/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get farms by location
export const getFarmsByLocation = async (location, page = 1) => {
  try {
    const response = await api.get(`/farms/location/${encodeURIComponent(location)}?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get farms by certification
export const getFarmsByCertification = async (certification, page = 1) => {
  try {
    const response = await api.get(`/farms/certification/${encodeURIComponent(certification)}?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create new farm (admin only)
export const createFarm = async (farmData) => {
  try {
    const formData = new FormData();
    
    // Add all text fields
    Object.keys(farmData).forEach(key => {
      if (key !== 'image' && farmData[key] !== undefined && farmData[key] !== null) {
        if (key === 'certifications' && Array.isArray(farmData[key])) {
          formData.append(key, farmData[key].join(','));
        } else {
          formData.append(key, farmData[key]);
        }
      }
    });
    
    // Add image if provided
    if (farmData.image) {
      formData.append('image', farmData.image);
    }
    
    const response = await api.post('/farms', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update farm (admin only)
export const updateFarm = async (id, farmData) => {
  try {
    const formData = new FormData();
    
    // Add all text fields
    Object.keys(farmData).forEach(key => {
      if (key !== 'image' && farmData[key] !== undefined && farmData[key] !== null) {
        if (key === 'certifications' && Array.isArray(farmData[key])) {
          formData.append(key, farmData[key].join(','));
        } else {
          formData.append(key, farmData[key]);
        }
      }
    });
    
    // Add image if provided
    if (farmData.image) {
      formData.append('image', farmData.image);
    }
    
    const response = await api.put(`/farms/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete farm (admin only)
export const deleteFarm = async (id) => {
  try {
    const response = await api.delete(`/farms/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 