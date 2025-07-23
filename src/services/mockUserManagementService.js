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
    avatar_url: "uploads/1751829799027-307883799.jpg",
    __v: 0,
    gender: "Nữ",
    block: false
  },
  {
    rating: 4.5,
    num_reviews: 12,
    _id: "68613a7c3eadd5866807c9be",
    name: "Nguyen Van A",
    email: "nguyenvana@gmail.com",
    phone: "0987654321",
    password_hash: "password123",
    role: "User",
    avatar_url: "uploads/avatar1.jpg",
    __v: 0,
    gender: "Nam",
    block: false
  },
  {
    rating: 3.8,
    num_reviews: 8,
    _id: "68613a7c3eadd5866807c9bf",
    name: "Tran Thi B",
    email: "tranthib@gmail.com",
    phone: "0912345678",
    password_hash: "password456",
    role: "User",
    avatar_url: "uploads/avatar2.jpg",
    __v: 0,
    gender: "Nữ",
    block: true
  },
  {
    rating: 4.2,
    num_reviews: 15,
    _id: "68613a7c3eadd5866807c9c0",
    name: "Le Van C",
    email: "levanc@gmail.com",
    phone: "0977888999",
    password_hash: "password789",
    role: "User",
    avatar_url: "uploads/avatar3.jpg",
    __v: 0,
    gender: "Nam",
    block: false
  },
  {
    rating: 4.7,
    num_reviews: 20,
    _id: "68613a7c3eadd5866807c9c1",
    name: "Pham Thi D",
    email: "phamthid@gmail.com",
    phone: "0933444555",
    password_hash: "password101",
    role: "User",
    avatar_url: "uploads/avatar4.jpg",
    __v: 0,
    gender: "Nữ",
    block: false
  }
];

export const mockUserManagementService = {
  getUsers: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers;
  },

  getUserById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const user = mockUsers.find(u => u._id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  toggleUserBlock: async (id, blockStatus) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const userIndex = mockUsers.findIndex(u => u._id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Set block status based on parameter
    mockUsers[userIndex].block = blockStatus;
    
    return {
      message: blockStatus ? 'Đã chặn người dùng.' : 'Đã mở khóa người dùng.',
      user: mockUsers[userIndex]
    };
  },

  formatUser: (user) => {
    return {
      ...user,
      formattedCreatedAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A',
      formattedUpdatedAt: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('vi-VN') : 'N/A',
      statusText: user.block ? 'Đã khóa' : 'Hoạt động',
      statusColor: user.block ? 'error' : 'success'
    };
  },

  getAvatarUrl: (avatarUrl) => {
    if (!avatarUrl) return null;
    if (avatarUrl.startsWith('http')) return avatarUrl;
    return `http://localhost:3000/${avatarUrl}`;
  },

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

export default mockUserManagementService; 