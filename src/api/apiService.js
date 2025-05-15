import axios from 'axios';

const apiClient = axios.create({
  baseURL:'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiService = {
  login: (url, data) => apiClient.post(url, data),
  logout: (url) => apiClient.post(url),
};

export default apiService;