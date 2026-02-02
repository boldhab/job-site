import api from './axios.config';

// Admin API endpoints
export const adminAPI = {
  // Employers
  getPendingEmployers: () => api.get('/admin/employers/pending'),
  getApprovedEmployers: () => api.get('/admin/employers/approved'),
  getAllEmployers: () => api.get('/admin/employers'),
  approveEmployer: (id) => api.put(`/admin/employers/${id}/approve`),
  rejectEmployer: (id, reason) => api.put(`/admin/employers/${id}/reject`, { reason }),
  searchEmployers: (companyName) => api.get('/admin/employers/search', { params: { companyName } }),

  // Users
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  getUsersByRole: (role) => api.get(`/admin/users/role/${role}`),
  activateUser: (id) => api.put(`/admin/users/${id}/activate`),
  deactivateUser: (id) => api.put(`/admin/users/${id}/deactivate`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  searchUsers: (email) => api.get('/admin/users/search', { params: { email } }),

  // Jobs (Moderation)
  getPendingJobs: () => api.get('/admin/jobs/pending'),
  getJobsByStatus: (status, params) => api.get(`/jobs/admin/status/${status}`, { params }),
  approveJob: (id) => api.put(`/admin/jobs/${id}/approve`),
  rejectJob: (id, reason) => api.put(`/admin/jobs/${id}/reject`, { reason }),

  // Moderation Logs
  getJobModerationLogs: (jobId) => api.get(`/admin/moderation-logs/job/${jobId}`),
  getAllModerationLogs: () => api.get('/admin/moderation-logs'),

  // Statistics
  getStatistics: () => api.get('/admin/statistics'),
};

export default adminAPI;
