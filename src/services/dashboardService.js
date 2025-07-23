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

export const dashboardService = {
  // Lấy danh sách orders
  getOrders: async () => {
    try {
      const response = await apiClient.get('/orders');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách reviews
  getReviews: async () => {
    try {
      const response = await apiClient.get('/reviews/product');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách users
  getUsers: async () => {
    try {
      const response = await apiClient.get('/list/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách products
  getProducts: async () => {
    try {
      const response = await apiClient.get('/product');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách vouchers
  getVouchers: async () => {
    try {
      const response = await apiClient.get('/vouchers');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách admins
  getAdmins: async () => {
    try {
      const response = await apiClient.get('/list/admins');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tính toán thống kê từ orders
  getOrderStats: (orders) => {
    if (!orders || orders.length === 0) return {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      deliveredOrders: 0,
      pendingOrders: 0,
      cancelledOrders: 0
    };

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const averageOrderValue = totalRevenue / totalOrders;
    
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      deliveredOrders: statusCounts['Delivered'] || 0,
      pendingOrders: statusCounts['Pending'] || 0,
      cancelledOrders: statusCounts['Cancelled'] || 0
    };
  },

  // Tính toán thống kê từ users
  getUserStats: (users) => {
    if (!users || users.length === 0) return {
      totalUsers: 0,
      activeUsers: 0,
      newUsersThisMonth: 0
    };

    const totalUsers = users.length;
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const newUsersThisMonth = users.filter(user => {
      // Kiểm tra nếu user có createdAt field
      if (user.createdAt) {
        const userCreatedAt = new Date(user.createdAt);
        return userCreatedAt >= thisMonth;
      }
      return false; // Nếu không có createdAt thì không tính
    }).length;

    return {
      totalUsers,
      activeUsers: totalUsers, // Có thể thêm logic để tính active users
      newUsersThisMonth
    };
  },

  // Tính toán thống kê từ products
  getProductStats: (products) => {
    if (!products || products.length === 0) return {
      totalProducts: 0,
      activeProducts: 0,
      averagePrice: 0
    };

    const totalProducts = products.length;
    const activeProducts = products.filter(product => product.status === true).length;
    const totalPrice = products.reduce((sum, product) => sum + (product.price || 0), 0);
    const averagePrice = totalPrice / totalProducts;

    return {
      totalProducts,
      activeProducts,
      averagePrice
    };
  },

  // Tính toán thống kê từ reviews
  getReviewStats: (reviews) => {
    if (!reviews || reviews.length === 0) return {
      totalReviews: 0,
      averageRating: 0,
      totalRating: 0
    };

    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / totalReviews;

    return {
      totalReviews,
      averageRating,
      totalRating
    };
  },

  // Tính toán thống kê từ vouchers
  getVoucherStats: (vouchers) => {
    if (!vouchers || vouchers.length === 0) return {
      totalVouchers: 0,
      activeVouchers: 0,
      totalUsage: 0
    };

    const totalVouchers = vouchers.length;
    const activeVouchers = vouchers.filter(voucher => voucher.active === true).length;
    const totalUsage = vouchers.reduce((sum, voucher) => sum + (voucher.used_count || 0), 0);

    return {
      totalVouchers,
      activeVouchers,
      totalUsage
    };
  }
};

export default dashboardService; 