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

export const statisticsService = {
  // Tổng hợp dashboard
  getDashboardSummary: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Tổng doanh thu
  getTotalRevenue: async () => {
    try {
      const response = await apiClient.get('/admin/total-revenue');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Thống kê đơn hàng theo thời gian
  getOrderCountSummary: async () => {
    try {
      const response = await apiClient.get('/admin/order-count-summary');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Thống kê doanh thu theo thời gian
  getRevenueSummary: async () => {
    try {
      const response = await apiClient.get('/admin/revenue-summary');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Lấy sản phẩm bán chạy nhất (nếu có API)
  getTopProducts: async (period = 'year') => {
    // Giả sử có API /api/admin/top-products?period=year
    try {
      const response = await apiClient.get(`/admin/top-products?period=${period}`);
      return response.data;
    } catch (error) {
      // Nếu chưa có API, trả về mảng rỗng
      return [];
    }
  },
  // Lấy thống kê trạng thái đơn hàng (nếu có API)
  getOrderStatusSummary: async (period = 'year') => {
    // Giả sử có API /api/admin/order-status-summary?period=year
    try {
      const response = await apiClient.get(`/admin/order-status-summary?period=${period}`);
      return response.data;
    } catch (error) {
      // Nếu chưa có API, trả về mảng rỗng
      return [];
    }
  },
};

export default statisticsService; 