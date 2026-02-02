// Job service
import { jobAPI } from '../api/job.api';

export const jobService = {
  getAll: async (params) => {
    const response = await jobAPI.getAll(params);
    return response.data;
  },
  getMyJobs: async () => {
    const response = await jobAPI.getMyJobs();
    return response.data;
  },
  
  getById: async (id) => {
    const response = await jobAPI.getById(id);
    return response.data;
  },
  
  create: async (data) => {
    const response = await jobAPI.create(data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await jobAPI.update(id, data);
    return response.data;
  },
  
  delete: async (id) => {
    await jobAPI.delete(id);
  },
  
  search: async (params) => {
    const response = await jobAPI.search(params);
    return response.data;
  },
  getPending: async () => {
    const response = await (await import('../api/job.api')).adminJobAPI.getPending();
    console.log(response)
    return response.data;
  },
  approve: async (id) => {
    const response = await (await import('../api/job.api')).adminJobAPI.approve(id);
    return response.data;
  },
  reject: async (id, reason) => {
    const response = await (await import('../api/job.api')).adminJobAPI.reject(id, reason);
    return response.data;
  },
  getStatistics: async () => {
    const response = await (await import('../api/job.api')).adminJobAPI.getStatistics();
    
    return response.data;
  },
};
