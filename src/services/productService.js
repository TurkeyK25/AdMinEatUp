import axios from 'axios';

const API_BASE_URL = '/api';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const productService = {
  getProducts: async () => {
    try {
      const response = await apiClient.get('/product');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/product/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteProduct: async (id) => {
    try {
      const response = await apiClient.delete(`/product/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default productService; 