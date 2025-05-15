import apiService from './apiService';

const fetchData = async (endpoint) => {
  try {
    const response = await apiService.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching data: ' + error.message);
  }
};

const createData = async (endpoint, data) => {
  try {
    const response = await apiService.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error('Error creating data: ' + error.message);
  }
};

const updateData = async (endpoint, data) => {
  try {
    const response = await apiService.put(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error('Error updating data: ' + error.message);
  }
};

const deleteData = async (endpoint) => {
  try {
    const response = await apiService.delete(endpoint);
    return response.data;
  } catch (error) {
    throw new Error('Error deleting data: ' + error.message);
  }
};

export { fetchData, createData, updateData, deleteData };