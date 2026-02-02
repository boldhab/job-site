// Authentication service
import { authAPI } from '../api/auth.api';

export const authService = {
  login: async (credentials) => {
    const response = await authAPI.login(credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await authAPI.register(userData);
    return response.data;
  },

  logout: async () => {
    await authAPI.logout();
  },

  forgotPassword: async (email) => {
    const response = await authAPI.forgotPassword(email);
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await authAPI.resetPassword(token, password);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await authAPI.changePassword({ currentPassword, newPassword });
    return response.data;
  },
};
