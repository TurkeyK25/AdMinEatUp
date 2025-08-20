import axios from 'axios';

// Sử dụng proxy thay vì gọi trực tiếp để tránh CORS
const API_BASE_URL = '/api';

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để xử lý response
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor để tự động thêm token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const statisticsService = {
  // Thống kê tổng quan hệ thống
  getDashboardSummary: async () => {
    try {
      console.log('API - Calling getDashboardSummary');
      const response = await apiClient.get('/admin/dashboard');
      console.log('API - Dashboard summary response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API - Error getting dashboard summary:', error);
      throw error;
    }
  },

  // Tổng doanh thu hệ thống
  getTotalRevenue: async () => {
    try {
      console.log('API - Calling getTotalRevenue');
      const response = await apiClient.get('/admin/total-revenue');
      console.log('API - Total revenue response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API - Error getting total revenue:', error);
      throw error;
    }
  },

  // Thống kê doanh thu chi tiết tất cả nhà hàng
  getAllRestaurantsRevenue: async () => {
    try {
      console.log('API - Calling getAllRestaurantsRevenue');
      const response = await apiClient.get('/admin/revenue/all-restaurants');
      console.log('API - All restaurants revenue response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API - Error getting all restaurants revenue:', error);
      throw error;
    }
  },

  // Lấy danh sách tất cả nhà hàng (admins)
  getAllRestaurants: async () => {
    try {
      console.log('API - Calling getAllRestaurants');
      const response = await apiClient.get('/list/admins');
      console.log('API - All restaurants response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API - Error getting all restaurants:', error);
      throw error;
    }
  },

  // Thống kê theo nhà hàng cụ thể
  getRestaurantStats: async (restaurantId) => {
    try {
      console.log('API - Calling getRestaurantStats for ID:', restaurantId);
      const response = await apiClient.get(`/admin/dashboard-stats/by-restaurant/${restaurantId}`);
      console.log('API - Restaurant stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API - Error getting restaurant stats:', error);
      throw error;
    }
  },

  // Doanh thu theo nhà hàng cụ thể
  getRestaurantRevenue: async (restaurantId) => {
    try {
      console.log('API - Calling getRestaurantRevenue for ID:', restaurantId);
      const response = await apiClient.get(`/admin/revenue/by-restaurant/${restaurantId}`);
      console.log('API - Restaurant revenue response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API - Error getting restaurant revenue:', error);
      throw error;
    }
  },

  // Thống kê đơn hàng theo thời gian
  getOrderCountSummary: async () => {
    try {
      console.log('API - Calling getOrderCountSummary');
      const response = await apiClient.get('/admin/order-count-summary');
      console.log('API - Order count summary response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API - Error getting order count summary:', error);
      throw error;
    }
  },

  // Thống kê doanh thu theo thời gian
  getRevenueSummary: async () => {
    try {
      console.log('API - Calling getRevenueSummary');
      const response = await apiClient.get('/admin/revenue-summary');
      console.log('API - Revenue summary response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API - Error getting revenue summary:', error);
      throw error;
    }
  },

  // Top sản phẩm bán chạy
  getTopProducts: async (period = 'year') => {
    try {
      console.log('API - Calling getTopProducts with period:', period);
      const response = await apiClient.get(`/admin/top-products?period=${period}`);
      console.log('API - Top products response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API - Error getting top products:', error);
      return [];
    }
  },

  // Thống kê trạng thái đơn hàng
  getOrderStatusSummary: async (period = 'year') => {
    try {
      console.log('API - Calling getOrderStatusSummary with period:', period);
      const response = await apiClient.get(`/admin/order-status-summary?period=${period}`);
      console.log('API - Order status summary response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API - Error getting order status summary:', error);
      return [];
    }
  },
}; 