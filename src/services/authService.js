import { apiClient } from './apiClient';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await apiClient.post('/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  validateToken: async () => {
    try {
      const response = await apiClient.get('/validate-token');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Local storage helpers
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return !!getUser();
}; 