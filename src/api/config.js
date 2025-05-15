import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5000/api';

const config = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

const apiClient = axios.create(config);

export default apiClient;