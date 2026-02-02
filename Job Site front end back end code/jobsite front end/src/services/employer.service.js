// Employer service
import { employerAPI } from '../api/employer.api';

export const employerService = {
  getProfile: async () => {
    const response = await employerAPI.getProfile();
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await employerAPI.updateProfile(data);
    return response.data;
  },

  getVerificationStatus: async () => {
    const response = await employerAPI.getVerificationStatus();
    return response.data;
  },

  requestVerification: async (data) => {
    const response = await employerAPI.requestVerification(data);
    return response.data;
  },

  // Employer-specific
  getApplications: async () => {
    const response = await employerAPI.getApplications();
    return response.data;
  },

  getApplicationsForJob: async (jobId) => {
    const response = await employerAPI.getApplicationsForJob(jobId);
    return response.data;
  },

  getStatistics: async () => {
    const response = await employerAPI.getStatistics();
    return response.data;
  },

  getAnalytics: async () => {
    // alias to statistics
    return await (await import('../api/employer.api')).employerAPI.getAnalytics();
  },
};
