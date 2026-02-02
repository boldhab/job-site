// Profile API endpoints
import api from './axios.config';

export const profileAPI = {
    getProfile: () => api.get('/profile'),
    getJobSeekerProfile: () => api.get('/profile/job-seeker'),
    updateJobSeekerProfile: (data) => api.put('/profile/job-seeker', data),
    getStatistics: () => api.get('/job-seekers/statistics'),
};
