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

export const authService = {
  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/login', credentials);
      console.log(response.data);
      return response.data; // Trả về data trực tiếp từ response
    } catch (error) {
      throw error;
    }
  },

  // Lưu user vào localStorage
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Lấy user từ localStorage
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Xóa user khi đăng xuất
  removeUser: () => {
    localStorage.removeItem('user');
  },

  // Kiểm tra xem user đã đăng nhập chưa
  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  }
};

export default authService; 