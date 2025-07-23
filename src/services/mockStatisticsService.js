// Mock statistics service với dữ liệu thực tế
const mockDashboardStats = {
  totalOrders: 5,
  totalRevenue: 0,
  orderStats: {
    completed: 3,
    pendingAndProcessing: 0,
    cancelled: 2
  },
  totalProducts: 4,
  totalReviews: 8,
  revenueByDate: {
    "2025-07-14": 0,
    "2025-07-15": 0,
    "2025-07-16": 0,
    "2025-07-17": 0,
    "2025-07-18": 0,
    "2025-07-19": 0,
    "2025-07-20": 0
  },
  recentOrders: [
    {
      "_id": "68711a00e92dffc38b81f4e5",
      "total_amount": 235.74,
      "status": "Cancelled",
      "order_date": "2025-07-11T14:04:48.837Z"
    },
    {
      "_id": "686e9b02de11aa1f0eb56540",
      "total_amount": 241.26,
      "status": "Cancelled",
      "order_date": "2025-07-09T16:38:26.234Z"
    },
    {
      "_id": "686e951000d9ff9ae50557d1",
      "total_amount": 235.74,
      "status": "Rated",
      "order_date": "2025-07-09T16:13:04.506Z"
    },
    {
      "_id": "686abc162a25c6100da70345",
      "total_amount": 425.03,
      "status": "Rated",
      "order_date": "2025-07-06T18:10:30.411Z"
    },
    {
      "_id": "686aab7649f2e7035e1ad22f",
      "total_amount": 246.91,
      "status": "Rated",
      "order_date": "2025-07-06T16:59:34.667Z"
    }
  ]
};

const mockRevenueData = {
  totalRevenue: 907.68,
  todayRevenue: 0,
  totalOrders: 3,
  revenueByDate: {
    "2025-07-06": 246.91,
    "2025-07-07": 425.03,
    "2025-07-09": 235.74
  },
  topProducts: [
    {
      "name": "Pizza Rau Củ",
      "quantity": 51,
      "total": 5049,
      "image": "uploads/Veggie.png"
    },
    {
      "name": "Set Pizza Mini",
      "quantity": 23,
      "total": 2737,
      "image": "uploads/Pizza1.png"
    },
    {
      "name": "Thit nguoi da xanh 11",
      "quantity": 6,
      "total": 156,
      "image": "uploads/1751735461790-282813997.jpg"
    },
    {
      "name": "Pizza",
      "quantity": 0,
      "total": 0,
      "image": "uploads/1751476002988.jpg"
    }
  ]
};

const mockOrderSummary = {
  message: "Thống kê tổng số đơn hàng theo từng khoảng thời gian.",
  data: {
    week: {
      totalOrders: 0,
      restaurants: []
    },
    month: {
      totalOrders: 6,
      restaurants: [
        {
          restaurant_id: "686139b63eadd5866807c9b9",
          restaurant_name: "Unknown",
          orderCount: 3
        },
        {
          restaurant_id: "68613b9d3eadd5866807c9c4",
          restaurant_name: "Unknown",
          orderCount: 3
        }
      ]
    },
    quarter: {
      totalOrders: 6,
      restaurants: [
        {
          restaurant_id: "686139b63eadd5866807c9b9",
          restaurant_name: "Unknown",
          orderCount: 3
        },
        {
          restaurant_id: "68613b9d3eadd5866807c9c4",
          restaurant_name: "Unknown",
          orderCount: 3
        }
      ]
    },
    year: {
      totalOrders: 6,
      restaurants: [
        {
          restaurant_id: "686139b63eadd5866807c9b9",
          restaurant_name: "Unknown",
          orderCount: 3
        },
        {
          restaurant_id: "68613b9d3eadd5866807c9c4",
          restaurant_name: "Unknown",
          orderCount: 3
        }
      ]
    }
  }
};

export const mockStatisticsService = {
  getDashboardStatsByRestaurant: async (restaurantId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockDashboardStats;
  },

  getRevenueByRestaurant: async (restaurantId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockRevenueData;
  },

  getOrderCountSummary: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockOrderSummary;
  },

  formatChartData: (data) => {
    return {
      revenueData: data.revenueByDate ? Object.entries(data.revenueByDate).map(([date, value]) => ({
        date,
        revenue: value
      })) : [],
      orderStats: data.orderStats ? [
        { name: 'Hoàn thành', value: data.orderStats.completed, color: '#4caf50' },
        { name: 'Đang xử lý', value: data.orderStats.pendingAndProcessing, color: '#ff9800' },
        { name: 'Đã hủy', value: data.orderStats.cancelled, color: '#f44336' }
      ] : [],
      topProducts: data.topProducts || []
    };
  }
};

export default mockStatisticsService; 