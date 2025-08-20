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

// Helper function to safely get numeric value
const getNumericValue = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'object') {
    // If it's an object, try to get a numeric value
    if (typeof value.total_amount === 'number') return value.total_amount;
    if (typeof value.amount === 'number') return value.amount;
    return 0;
  }
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

export const orderService = {
  // Lấy tất cả đơn hàng của một nhà hàng cụ thể
  getOrdersByRestaurant: async (restaurantId) => {
    try {
      const response = await apiClient.get(`/admin/orders/by-restaurant/${restaurantId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết một đơn hàng cụ thể
  getOrderDetail: async (orderId, restaurantId) => {
    try {
      const response = await apiClient.get(`/admin/order/detail/${orderId}/${restaurantId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await apiClient.put(`/admin/order/update-status/${orderId}`, { status });
      console.log(orderId);
      console.log(status);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa đơn hàng
  deleteOrder: async (orderId, restaurantId) => {
    try {
      const response = await apiClient.delete(`/admin/order/delete/${orderId}/${restaurantId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách trạng thái đơn hàng
  getOrderStatuses: () => {
    return [
      { value: 'Processed', label: 'XÁC NHẬN', color: 'primary' },
      { value: 'AdminProcessing', label: 'ĐANG XỬ LÝ', color: 'warning' },
      { value: 'Delivered', label: 'ĐÃ GIAO', color: 'success' },
      { value: 'Cancelled', label: 'ĐÃ HỦY', color: 'error' }
    ];
  },

  // Format trạng thái để hiển thị
  getStatusLabel: (status) => {
    const statuses = orderService.getOrderStatuses();
    const statusObj = statuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  },

  // Lấy màu cho trạng thái
  getStatusColor: (status) => {
    const statuses = orderService.getOrderStatuses();
    const statusObj = statuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'default';
  },

  // Format đơn hàng cho hiển thị
  formatOrder: (order) => {
    const totalAmount = getNumericValue(order.total_amount);
    const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
    
    return {
      ...order,
      formattedTotal: `${totalAmount.toLocaleString()} VNĐ`,
      formattedDate: createdAt.toLocaleDateString('vi-VN'),
      statusLabel: orderService.getStatusLabel(order.status),
      statusColor: orderService.getStatusColor(order.status)
    };
  },

  // Tính tổng số lượng sản phẩm trong đơn hàng
  getTotalItems: (order) => {
    if (!order.items || !Array.isArray(order.items)) return 0;
    return order.items.reduce((total, item) => {
      const quantity = getNumericValue(item.quantity);
      return total + quantity;
    }, 0);
  },

  // Validate dữ liệu cập nhật trạng thái
  validateStatusUpdate: (status) => {
    console.log("Sending to API:", {
      order_id,
      new_status,
      restaurant_id
    });
    const validStatuses = ['Processed', 'AdminProcessing', 'Delivered', 'Cancelled'];
    
    return validStatuses.includes(status);
  }
};

export default orderService; 