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

export const userManagementService = {
  // Lấy tất cả người dùng
  getUsers: async () => {
    try {
      const response = await apiClient.get('/list/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết một người dùng
  getUserById: async (id) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Khóa/mở khóa tài khoản người dùng
  toggleUserBlock: async (id, blockStatus) => {
    try {
      const response = await apiClient.put(`/users/${id}/block`, {
        block: blockStatus
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Format người dùng cho hiển thị
  formatUser: (user) => {
    return {
      ...user,
      formattedCreatedAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A',
      formattedUpdatedAt: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('vi-VN') : 'N/A',
      statusText: user.block ? 'Đã khóa' : 'Hoạt động',
      statusColor: user.block ? 'error' : 'success'
    };
  },

  // Lấy avatar URL
  getAvatarUrl: (avatarUrl) => {
    if (!avatarUrl) return null;
    if (avatarUrl.startsWith('http')) return avatarUrl;
    return `http://localhost:3000/${avatarUrl}`;
  },

  // Validate dữ liệu người dùng
  validateUser: (data) => {
    const errors = {};
    
    if (!data.name || data.name.trim() === '') {
      errors.name = 'Tên người dùng là bắt buộc';
    }
    
    if (!data.email || data.email.trim() === '') {
      errors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    if (!data.phone || data.phone.trim() === '') {
      errors.phone = 'Số điện thoại là bắt buộc';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default userManagementService; 