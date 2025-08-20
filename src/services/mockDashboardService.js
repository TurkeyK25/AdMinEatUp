// Mock data cho dashboard
const mockOrders = [
  {
    _id: "68711a00e92dffc38b81f4e9",
    user_id: "68613a7c3eadd5866807c9bd",
    restaurant_id: "68613b9d3eadd5866807c9c4",
    items: [
      {
        product_id: "6862ab522a8ef4cd7a02b4ae",
        product_name: "Pizza Truyền Thống",
        product_image: "http://localhost:3000/uploads/Pizza2.png",
        quantity: 2,
        price: 129,
        _id: "68711a00e92dffc38b81f4ea"
      },
      {
        product_id: "6862ac3f2a8ef4cd7a02b4af",
        product_name: "Sushi Roll",
        product_image: "http://localhost:3000/uploads/CaliforniaRoll.png",
        quantity: 2,
        price: 80,
        _id: "68711a00e92dffc38b81f4eb"
      }
    ],
    total_amount: 410.26,
    status: "Delivered",
    payment_method: "COD",
    address_id: "68668124a0b4d1e256b0104d",
    bank_id: null,
    shipping_fee: 5,
    discount_amount: 12.74,
    createdAt: "2025-07-11T14:04:48.907Z",
    updatedAt: "2025-07-11T14:08:40.565Z",
    __v: 0
  },
  {
    _id: "68711a00e92dffc38b81f4e8",
    user_id: "68613a7c3eadd5866807c9bd",
    restaurant_id: "68613b9d3eadd5866807c9c4",
    items: [
      {
        product_id: "6862ab522a8ef4cd7a02b4ae",
        product_name: "Burger Deluxe",
        product_image: "http://localhost:3000/uploads/Burger.png",
        quantity: 1,
        price: 89,
        _id: "68711a00e92dffc38b81f4ec"
      }
    ],
    total_amount: 89.00,
    status: "Pending",
    payment_method: "Credit Card",
    address_id: "68668124a0b4d1e256b0104d",
    bank_id: null,
    shipping_fee: 5,
    discount_amount: 0,
    createdAt: "2025-07-11T15:30:48.907Z",
    updatedAt: "2025-07-11T15:30:48.907Z",
    __v: 0
  }
];

const mockUsers = [
  {
    rating: 0,
    num_reviews: 0,
    _id: "68613a7c3eadd5866807c9bd",
    name: "Viet Cuong",
    email: "hai123@gmail.com",
    phone: "3242312115",
    password_hash: "hai123@",
    role: "User",
    avatar_url: "http://localhost:3000/uploads/1751829799027-307883799.jpg",
    __v: 0,
    gender: "Nữ"
  }
];

const mockProducts = [
  {
    _id: "6860ff185399615a4feeb6a5",
    description: "Set 3 bánh pizza mini với phô mai béo ngậy, cà chua tươi và lá húng thơm.",
    image_url: "http://localhost:3000/uploads/Pizza1.png",
    name: "Set Pizza Mini",
    price: 119,
    rating: 4.5,
    restaurant_id: "686139b63eadd5866807c9b9",
    status: true,
    purchases: 23,
    updatedAt: "2025-07-11T14:04:48.875Z",
    num_reviews: 2
  },
  {
    _id: "6862ab522a8ef4cd7a02b4ae",
    description: "Pizza truyền thống với phô mai, cà chua và lá húng.",
    image_url: "http://localhost:3000/uploads/Burger.png",
    name: "Pizza Truyền Thống",
    price: 129,
    rating: 4.8,
    restaurant_id: "686139b63eadd5866807c9b9",
    status: true,
    purchases: 45,
    updatedAt: "2025-07-11T14:04:48.875Z",
    num_reviews: 5
  },
  {
    _id: "6862ac3f2a8ef4cd7a02b4af",
    description: "Sushi roll với cá hồi tươi và rau củ.",
    image_url: "http://localhost:3000/uploads/CaliforniaRoll.png",
    name: "Sushi Roll",
    price: 80,
    rating: 4.2,
    restaurant_id: "686139b63eadd5866807c9b9",
    status: true,
    purchases: 12,
    updatedAt: "2025-07-11T14:04:48.875Z",
    num_reviews: 3
  }
];

const mockReviews = [
  {
    _id: "686e97c2140fdcc131e9241d",
    entity_id: {
      _id: "6860ff185399615a4feeb6a5",
      description: "Set 3 bánh pizza mini với phô mai béo ngậy, cà chua tươi và lá húng thơm.",
      image_url: "http://localhost:3000/uploads/Pizza1.png",
      name: "Set Pizza Mini",
      restaurant_id: "686139b63eadd5866807c9b9"
    },
    entity_type: "Product",
    user_id: {
      _id: "68613a9f3eadd5866807c9c2",
      name: "Thuy Lieu 1",
      avatar_url: "http://localhost:3000/uploads/AVT.jpg"
    },
    rating: 4.5,
    comment: "Tuong doi",
    createdAt: "2025-07-09T16:24:34.036Z",
    __v: 0
  }
];

const mockVouchers = [
  {
    _id: "687b326229219aa989731519",
    code: "HOTDEAL2025",
    description: "Giảm 10% cho đơn hàng trên 50k",
    discount_type: "percentage",
    discount_value: 10,
    min_order_amount: 50000,
    max_discount_amount: 25,
    start_date: "2025-07-01T00:00:00.000Z",
    end_date: "2025-07-31T23:59:59.000Z",
    usage_limit: 100,
    used_count: 0,
    user_specific: false,
    active: true,
    createdAt: "2025-07-19T05:51:30.903Z",
    updatedAt: "2025-07-19T05:51:30.903Z",
    __v: 0
  }
];

export const mockDashboardService = {
  getOrders: async () => {
    return mockOrders;
  },

  getUsers: async () => {
    return mockUsers;
  },

  getProducts: async () => {
    return mockProducts;
  },

  getReviews: async () => {
    return mockReviews;
  },

  getVouchers: async () => {
    return mockVouchers;
  },

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

export default mockDashboardService; 