// Application service
import { applicationAPI } from '../api/application.api';

export const applicationService = {
  create: async (data) => {
    const response = await applicationAPI.create(data);
    return response.data;
  },

  getById: async (id) => {
    const response = await applicationAPI.getById(id);
    return response.data;
  },

  getByJobSeeker: async () => {
    const response = await applicationAPI.getByJobSeeker();
    return response.data;
  },

  getByJob: async (jobId) => {
    const response = await applicationAPI.getByJob(jobId);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await applicationAPI.updateStatus(id, status);
    return response.data;
  },

  delete: async (id) => {
    await applicationAPI.delete(id);
  },

  saveNote: async (id, note) => {
    const response = await applicationAPI.saveNote(id, note);
    return response.data;
  },
};
