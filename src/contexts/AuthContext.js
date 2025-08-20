import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from 'src/services/authService.js';
import { mockAuthService } from 'src/services/mockAuthService.js'; // Uncomment để sử dụng mock

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chọn service để sử dụng (real API hoặc mock)
  const authServiceToUse = authService; // Sử dụng mockAuthService để test với dữ liệu thực tế

  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập chưa khi component mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authServiceToUse.login(credentials);
      
      // Lưu thông tin user vào localStorage
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 