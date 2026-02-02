// Employer API endpoints
import api from './axios.config';

export const employerAPI = {
  getProfile: () => api.get('/employers/profile'),
  updateProfile: (data) => api.put('/employers/profile', data),
  getVerificationStatus: () => api.get('/employers/verification'),
  requestVerification: (data) => api.post('/employers/verification', data),
  // Employer-specific endpoints
  getApplications: () => api.get('/employers/applications'),
  getApplicationsForJob: (jobId) => api.get(`/employers/jobs/${jobId}/applications`),
  getStatistics: () => api.get('/employers/statistics'),
  getAnalytics: () => api.get('/employers/statistics'),
};
