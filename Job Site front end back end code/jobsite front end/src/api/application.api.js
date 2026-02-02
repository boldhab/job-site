// Application API endpoints
import api from './axios.config';

export const applicationAPI = {
  create: (data) => api.post('/applications', data),
  getById: (id) => api.get(`/applications/${id}`),
  getByJobSeeker: () => api.get('/applications/my-applications'),
  getByJob: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
  saveNote: (id, note) => api.put(`/applications/${id}/notes`, { note }),
  delete: (id) => api.delete(`/applications/${id}`),
};
