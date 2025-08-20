import axios from 'axios';

// Sử dụng proxy thay vì gọi trực tiếp để tránh CORS
const API_BASE_URL = '/api';

// Tạo instance axios với cấu hình mặc định
export const apiClient = axios.create({
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