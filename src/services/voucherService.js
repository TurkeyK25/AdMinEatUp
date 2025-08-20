import { Restaurant } from '@mui/icons-material';
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

export const voucherService = {
  // Lấy danh sách tất cả vouchers
  getVouchers: async () => {
    try {
      const response = await apiClient.get('/vouchers');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy voucher theo ID
  getVoucherById: async (id) => {
    try {
      const response = await apiClient.get(`/vouchers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo voucher mới
  createVoucher: async (voucherData) => {
    try {
      console.log('API - Dữ liệu voucher được gửi:', voucherData);
      console.log('API - restaurant_id:', voucherData.restaurant_id);
      const response = await apiClient.post('/vouchers', voucherData);
      console.log('API - Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API - Error creating voucher:', error);
      throw error;
    }
  },

  // Cập nhật voucher
  updateVoucher: async (id, voucherData) => {
    try {
      const response = await apiClient.put(`/vouchers/${id}`, voucherData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa voucher
  deleteVoucher: async (id) => {
    try {
      const response = await apiClient.delete(`/vouchers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Format voucher data cho form
  formatVoucherForForm: (voucher) => {
    if (!voucher) return {
      code: '',
      description: '',
      restaurant_id: '',
      discount_type: 'percentage',
      discount_value: '',
      min_order_amount: '',
      max_discount_amount: '',
      start_date: '',
      end_date: '',
      usage_limit: '',
      user_specific: false,
      active: true,
    };

    return {
      code: voucher.code || '',
      description: voucher.description || '',
      restaurant_id: voucher.restaurant_id || '',
      discount_type: voucher.discount_type || 'percentage',
      discount_value: voucher.discount_value || '',
      min_order_amount: voucher.min_order_amount || '',
      max_discount_amount: voucher.max_discount_amount || '',
      start_date: voucher.start_date ? new Date(voucher.start_date).toISOString().split('T')[0] : '',
      end_date: voucher.end_date ? new Date(voucher.end_date).toISOString().split('T')[0] : '',
      usage_limit: voucher.usage_limit || '',
      user_specific: voucher.user_specific || false,
      active: voucher.active !== undefined ? voucher.active : true,
    };
  },

  // Validate voucher data
  validateVoucher: (voucherData) => {
    const errors = {};

    if (!voucherData.code) {
      errors.code = 'Mã voucher là bắt buộc';
    }

    if (!voucherData.description) {
      errors.description = 'Mô tả là bắt buộc';
    }

    if (!voucherData.restaurant_id) {
      errors.restaurant_id = 'Vui lòng chọn nhà hàng';
    }

    if (!voucherData.discount_value || voucherData.discount_value <= 0) {
      errors.discount_value = 'Giá trị giảm giá phải lớn hơn 0';
    }

    if (!voucherData.min_order_amount || voucherData.min_order_amount < 0) {
      errors.min_order_amount = 'Giá trị đơn hàng tối thiểu không hợp lệ';
    }

    if (!voucherData.start_date) {
      errors.start_date = 'Ngày bắt đầu là bắt buộc';
    }

    if (!voucherData.end_date) {
      errors.end_date = 'Ngày kết thúc là bắt buộc';
    }

    if (voucherData.start_date && voucherData.end_date) {
      const startDate = new Date(voucherData.start_date);
      const endDate = new Date(voucherData.end_date);
      if (startDate >= endDate) {
        errors.end_date = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    return errors;
  }
};

export default voucherService; 