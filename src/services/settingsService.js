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

export const settingsService = {
  // Gửi verify code về email
  forgotPassword: async (email) => {
    const res = await apiClient.post('/forgot-password', { email });
    return res.data;
  },
  // Đổi mật khẩu với verify code
  resetPassword: async (email, code, newPassword) => {
    const res = await apiClient.post('/reset-password', { email, code, newPassword });
    return res.data;
  },
  // Lấy thông tin owner hiện tại
  getOwnerInfo: async () => {
    const res = await apiClient.get('/list/owner');
    return res.data && res.data[0];
  },
  // Cập nhật thông tin owner
  updateOwnerInfo: async (id, data) => {
    const res = await apiClient.put(`/update/${id}`, data);
    return res.data;
  },
  // Cập nhật thông tin cá nhân
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Đổi mật khẩu khi đã đăng nhập
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiClient.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate email
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password
  validatePassword: (password) => {
    // Ít nhất 6 ký tự, có chữ hoa, chữ thường và số
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  },

  // Validate password strength
  getPasswordStrength: (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    if (strength < 2) return { level: 'weak', color: 'error', text: 'Yếu' };
    if (strength < 4) return { level: 'medium', color: 'warning', text: 'Trung bình' };
    return { level: 'strong', color: 'success', text: 'Mạnh' };
  }
};

export default settingsService; 