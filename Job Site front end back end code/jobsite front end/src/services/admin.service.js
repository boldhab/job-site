import { adminAPI } from '../api/admin.api';

export const adminService = {
  // Employers
  getPendingEmployers: async () => {
    const response = await adminAPI.getPendingEmployers();
    return response.data;
  },

  getApprovedEmployers: async () => {
    const response = await adminAPI.getApprovedEmployers();
    return response.data;
  },

  getAllEmployers: async () => {
    const response = await adminAPI.getAllEmployers();
    return response.data;
  },

  approveEmployer: async (id) => {
    const response = await adminAPI.approveEmployer(id);
    return response.data;
  },

  rejectEmployer: async (id, reason) => {
    const response = await adminAPI.rejectEmployer(id, reason);
    return response.data;
  },

  searchEmployers: async (companyName) => {
    const response = await adminAPI.searchEmployers(companyName);
    return response.data;
  },

  // Users
  getAllUsers: async (params) => {
    const response = await adminAPI.getAllUsers(params);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await adminAPI.getUserById(id);
    return response.data;
  },

  getUsersByRole: async (role) => {
    const response = await adminAPI.getUsersByRole(role);
    return response.data;
  },

  activateUser: async (id) => {
    const response = await adminAPI.activateUser(id);
    return response.data;
  },

  deactivateUser: async (id) => {
    const response = await adminAPI.deactivateUser(id);
    return response.data;
  },

  deleteUser: async (id) => {
    await adminAPI.deleteUser(id);
  },

  searchUsers: async (email) => {
    const response = await adminAPI.searchUsers(email);
    return response.data;
  },

  // Jobs
  getPendingJobs: async () => {
    const response = await adminAPI.getPendingJobs();
    return response.data;
  },

  getJobsByStatus: async (status, params) => {
    const response = await adminAPI.getJobsByStatus(status, params);
    return response.data;
  },

  approveJob: async (id) => {
    const response = await adminAPI.approveJob(id);
    return response.data;
  },

  rejectJob: async (id, reason) => {
    const response = await adminAPI.rejectJob(id, reason);
    return response.data;
  },

  // Moderation Logs
  getJobModerationLogs: async (jobId) => {
    const response = await adminAPI.getJobModerationLogs(jobId);
    return response.data;
  },

  getAllModerationLogs: async () => {
    const response = await adminAPI.getAllModerationLogs();
    return response.data;
  },

  // Statistics
  getStatistics: async () => {
    const response = await adminAPI.getStatistics();
    return response.data;
  },
};

export default adminService;
