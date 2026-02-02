// User API endpoints
import api from './axios.config';

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data), // Uses AuthController
  deactivateAccount: () => api.put('/users/deactivate'),
};
