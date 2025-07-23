// Mock authentication service for testing
// Sử dụng khi API chưa sẵn sàng

const mockUser = {
  _id: '686139b63eadd5866807c9b9',
  name: 'Luong Hong Minh',
  email: 'minh05@gmail.com',
  phone: '0901573816',
  role: 'Owner',
  avatar_url: 'uploads/1752597286970-68185224.jpg',
  gender: 'Nam',
  rating: 4.83,
  num_reviews: 3,
  createdAt: '2024-12-15T10:30:00.000Z'
};

export const mockAuthService = {
  login: async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation for Owner role with real data
    if (credentials.email === 'minh05@gmail.com' && credentials.password_hash === 'minh05@') {
      return {
        success: true,
        message: 'Đăng nhập thành công!',
        user: mockUser,
        token: 'mock-jwt-token-12345'
      };
    } else {
      throw new Error('Email hoặc mật khẩu không đúng');
    }
  },

  logout: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      message: 'Đăng xuất thành công!'
    };
  },

  getCurrentUser: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUser;
  },

  validateToken: async (token) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return token === 'mock-jwt-token-12345';
  }
};

export default mockAuthService; 