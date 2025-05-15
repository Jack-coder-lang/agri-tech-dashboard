import apiService from './apiService';

export const login = async (email, password) => {
  try {
    const response = await apiService.login('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logout = async () => {
  try {
    await apiService.logout('/auth/logout');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};