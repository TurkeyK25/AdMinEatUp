let mockProducts = [
  {
    _id: '6860ff185399615a4feeb6a5',
    description: 'Set 3 bánh pizza mini với phô mai béo ngậy, cà chua tươi và lá húng thơm.',
    image_url: 'uploads/Pizza1.png',
    name: 'Set Pizza Mini',
    price: 119,
    rating: 4.5,
    restaurant_id: '686139b63eadd5866807c9b9',
    status: true,
    purchases: 23,
    updatedAt: '2025-07-11T14:04:48.875Z',
    num_reviews: 2
  }
];

export const mockProductService = {
  getProducts: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts;
  },
  getProductById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProducts.find(p => p._id === id);
  },
  deleteProduct: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockProducts = mockProducts.filter(p => p._id !== id);
    return { success: true };
  }
};

export default mockProductService; 