// Job API endpoints
import api from './axios.config';

export const jobAPI = {
  // Public jobs (paginated) - backend exposes /jobs/public
  getAll: (params) => api.get('/jobs/public', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  // Search supports multiple params: keyword, location, type, title, page, size, sort
  search: (params) => api.get('/jobs/search', { params }),
  // Employer-specific endpoints: preferred to use /jobs/my-jobs for current employer
  getByEmployer: (employerId) => api.get(`/jobs/employer/${employerId}`),
  getMyJobs: () => api.get('/jobs/my-jobs'),
};

// Admin endpoints
export const adminJobAPI = {
  getPending: () => api.get('/admin/jobs/pending'),
  getByStatus: (status, params) => api.get(`/admin/jobs/status/${status}`, { params }),
  approve: (id) => api.put(`/admin/jobs/${id}/approve`),
  reject: (id, reason) => api.put(`/admin/jobs/${id}/reject`, { reason }),
  getStatistics: () => api.get('/admin/jobs/statistics'),
};
