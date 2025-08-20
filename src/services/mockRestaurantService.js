const mockRestaurants = [
  {
    _id: "686139b63eadd5866807c9b9",
    name: "Pizza Compali",
    address: "Đống Đa, Hà Nội",
    phone: "0962724321",
    description: "Chuyên món ăn pizza từ Pháp",
    createdAt: "2025-07-01T08:00:00.000Z",
    updatedAt: "2025-07-19T09:00:00.000Z"
  },
  {
    _id: "686139b63eadd5866807c9ba",
    name: "Nhà hàng Sushi Tokyo",
    address: "Ba Đình, Hà Nội",
    phone: "0987654321",
    description: "Chuyên món ăn Nhật Bản truyền thống",
    createdAt: "2025-07-02T10:00:00.000Z",
    updatedAt: "2025-07-18T15:30:00.000Z"
  },
  {
    _id: "686139b63eadd5866807c9bb",
    name: "Quán Phở Việt",
    address: "Hoàn Kiếm, Hà Nội",
    phone: "0912345678",
    description: "Phở truyền thống Việt Nam",
    createdAt: "2025-07-03T12:00:00.000Z",
    updatedAt: "2025-07-17T14:20:00.000Z"
  },
  {
    _id: "686139b63eadd5866807c9bc",
    name: "Nhà hàng BBQ Hàn Quốc",
    address: "Cầu Giấy, Hà Nội",
    phone: "0977888999",
    description: "BBQ và món ăn Hàn Quốc chính gốc",
    createdAt: "2025-07-04T09:00:00.000Z",
    updatedAt: "2025-07-16T16:45:00.000Z"
  },
  {
    _id: "686139b63eadd5866807c9bd",
    name: "Quán Cà Phê Sài Gòn",
    address: "Hai Bà Trưng, Hà Nội",
    phone: "0933444555",
    description: "Cà phê và bánh ngọt Sài Gòn",
    createdAt: "2025-07-05T11:00:00.000Z",
    updatedAt: "2025-07-15T13:15:00.000Z"
  }
];

export const mockRestaurantService = {
  getRestaurants: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockRestaurants;
  },

  getRestaurantById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const restaurant = mockRestaurants.find(r => r._id === id);
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    return restaurant;
  },

  createRestaurant: async (restaurantData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newRestaurant = {
      _id: `rest_${Date.now()}`,
      ...restaurantData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockRestaurants.push(newRestaurant);
    return newRestaurant;
  },

  updateRestaurant: async (id, restaurantData) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const index = mockRestaurants.findIndex(r => r._id === id);
    if (index === -1) {
      throw new Error('Restaurant not found');
    }
    
    mockRestaurants[index] = {
      ...mockRestaurants[index],
      ...restaurantData,
      updatedAt: new Date().toISOString()
    };
    
    return mockRestaurants[index];
  },

  deleteRestaurant: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockRestaurants.findIndex(r => r._id === id);
    if (index === -1) {
      throw new Error('Restaurant not found');
    }
    
    const deletedRestaurant = mockRestaurants.splice(index, 1)[0];
    return { message: 'Restaurant deleted successfully', deletedRestaurant };
  },

  validateRestaurant: (data) => {
    const errors = {};
    
    if (!data.name || data.name.trim() === '') {
      errors.name = 'Tên nhà hàng là bắt buộc';
    }
    
    if (!data.address || data.address.trim() === '') {
      errors.address = 'Địa chỉ là bắt buộc';
    }
    
    if (!data.phone || data.phone.trim() === '') {
      errors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(data.phone.replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (!data.description || data.description.trim() === '') {
      errors.description = 'Mô tả là bắt buộc';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  formatRestaurant: (restaurant) => {
    return {
      ...restaurant,
      formattedCreatedAt: new Date(restaurant.createdAt).toLocaleDateString('vi-VN'),
      formattedUpdatedAt: new Date(restaurant.updatedAt).toLocaleDateString('vi-VN')
    };
  }
};

export default mockRestaurantService; 