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

export const restaurantService = {
  // Lấy tất cả nhà hàng
  getRestaurants: async () => {
    try {
      const response = await apiClient.get('/list/admins');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết một nhà hàng
  getRestaurantById: async (id) => {
    try {
      const response = await apiClient.get(`/list/admins/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo nhà hàng mới
  createRestaurant: async (restaurantData) => {
    try {
      const response = await apiClient.post('/admins', restaurantData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật nhà hàng
  updateRestaurant: async (id, data) => {
    try {
      const response = await apiClient.put(`/admins/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa nhà hàng
  deleteRestaurant: async (id) => {
    try {
      console.log('API - Deleting restaurant with ID:', id);
      const response = await apiClient.delete(`/delete/${id}`);
      console.log('API - Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API - Error deleting restaurant:', error);
      throw error;
    }
  },

  // Chặn/Bỏ chặn nhà hàng
  blockRestaurant: async (id, block) => {
    try {
      console.log('API - Blocking restaurant with ID:', id, 'block:', block);
      const response = await apiClient.put(`/admins/${id}/block`, { block });
      console.log('API - Block response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API - Error blocking restaurant:', error);
      throw error;
    }
  },

  // Validate dữ liệu nhà hàng
  validateRestaurant: (data) => {
    const errors = {};
    
    if (!data.name || data.name.trim() === '') {
      errors.name = 'Tên nhà hàng là bắt buộc';
    }
    
    if (!data.address || data.address.trim() === '') {
      errors.address = 'Địa chỉ là bắt buộc';
    }
    
    if (!data.phone || data.phone.trim() === '') {
      errors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(data.phone.replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (!data.description || data.description.trim() === '') {
      errors.description = 'Mô tả là bắt buộc';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Format nhà hàng cho hiển thị
  formatRestaurant: (restaurant) => {
    return {
      ...restaurant,
      formattedCreatedAt: restaurant.createdAt ? new Date(restaurant.createdAt).toLocaleDateString('vi-VN') : 'N/A',
      formattedUpdatedAt: restaurant.updatedAt ? new Date(restaurant.updatedAt).toLocaleDateString('vi-VN') : 'N/A',
      // Đảm bảo có các trường cần thiết cho hiển thị
      name: restaurant.name || restaurant.restaurant_name || 'Không có tên',
      phone: restaurant.phone || restaurant.phone_number || 'N/A',
      email: restaurant.email || 'N/A',
      rating: restaurant.rating || 0,
      num_reviews: restaurant.num_reviews || 0,
      block: restaurant.block || false
    };
  }
};

export default restaurantService; 