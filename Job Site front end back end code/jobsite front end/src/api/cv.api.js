// CV API endpoints
import api from './axios.config';

export const cvAPI = {
  upload: (formData) => api.post('/cvs/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMyCVs: () => api.get('/cvs'),
  getById: (id) => api.get(`/cvs/${id}`),
  delete: (id) => api.delete(`/cvs/${id}`),
  setDefault: (id) => api.put(`/cvs/${id}/default`),
  updateMetadata: (id, metadata) => api.put(`/cvs/${id}/metadata`, metadata),
  download: (id) => api.get(`/cvs/${id}/download`, { responseType: 'blob' }),
};
