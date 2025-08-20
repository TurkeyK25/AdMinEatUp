const mockNotifications = [
  {
    _id: "notif_1",
    type: "new_user",
    title: "Người dùng mới đăng ký",
    message: "Nguyễn Văn A đã đăng ký tài khoản mới",
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 phút trước
    data: {
      userId: "user_123",
      userName: "Nguyễn Văn A",
      userEmail: "nguyenvana@gmail.com"
    }
  },
  {
    _id: "notif_2",
    type: "new_review",
    title: "Đánh giá mới",
    message: "Có đánh giá mới cho sản phẩm Pizza Margherita",
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 phút trước
    data: {
      reviewId: "review_456",
      productName: "Pizza Margherita",
      rating: 4.5,
      comment: "Pizza rất ngon!"
    }
  },
  {
    _id: "notif_3",
    type: "new_order",
    title: "Đơn hàng mới",
    message: "Đơn hàng #12345 đã được đặt",
    isRead: true,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 phút trước
    data: {
      orderId: "order_12345",
      orderAmount: 150000,
      customerName: "Trần Thị B"
    }
  },
  {
    _id: "notif_4",
    type: "order_cancelled",
    title: "Đơn hàng bị hủy",
    message: "Đơn hàng #12344 đã bị hủy bởi khách hàng",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 giờ trước
    data: {
      orderId: "order_12344",
      customerName: "Lê Văn C",
      reason: "Khách hàng hủy"
    }
  },
  {
    _id: "notif_5",
    type: "order_delivered",
    title: "Đơn hàng đã giao",
    message: "Đơn hàng #12343 đã được giao thành công",
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 giờ trước
    data: {
      orderId: "order_12343",
      customerName: "Phạm Thị D",
      deliveryTime: new Date().toISOString()
    }
  },
  {
    _id: "notif_6",
    type: "low_stock",
    title: "Sản phẩm sắp hết hàng",
    message: "Sản phẩm Sushi Roll chỉ còn 5 đơn vị trong kho",
    isRead: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 giờ trước
    data: {
      productId: "prod_789",
      productName: "Sushi Roll",
      currentStock: 5,
      minStock: 10
    }
  },
  {
    _id: "notif_7",
    type: "new_user",
    title: "Người dùng mới đăng ký",
    message: "Phạm Văn E đã đăng ký tài khoản mới",
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 ngày trước
    data: {
      userId: "user_124",
      userName: "Phạm Văn E",
      userEmail: "phamvane@gmail.com"
    }
  }
];

export const mockNotificationService = {
  getNotifications: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockNotifications;
  },

  markAsRead: async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const notification = mockNotifications.find(n => n._id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
    return { message: 'Đã đánh dấu đã đọc' };
  },

  markAllAsRead: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockNotifications.forEach(notification => {
      notification.isRead = true;
    });
    return { message: 'Đã đánh dấu tất cả đã đọc' };
  },

  deleteNotification: async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = mockNotifications.findIndex(n => n._id === notificationId);
    if (index !== -1) {
      mockNotifications.splice(index, 1);
    }
    return { message: 'Đã xóa thông báo' };
  },

  formatNotification: (notification) => {
    return {
      ...notification,
      formattedTime: new Date(notification.createdAt).toLocaleString('vi-VN'),
      timeAgo: getTimeAgo(notification.createdAt)
    };
  },

  getUnreadCount: (notifications) => {
    return notifications.filter(notification => !notification.isRead).length;
  }
};

// Helper function để tính thời gian trước
const getTimeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return 'Vừa xong';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} phút trước`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} giờ trước`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ngày trước`;
  }
};

export default mockNotificationService; 