import api from './axios.config';

const API_URL = '/ai';

export const aiAPI = {
    chat: (message) => api.post(`${API_URL}/chat`, { message }),
    optimizeJob: (title, industry) => api.post(`${API_URL}/optimize-job`, { title, industry }),
    analyzeMyCV: () => api.get(`${API_URL}/analyze-my-cv`),
    getMatchScore: (jobId) => api.get(`${API_URL}/match-score/${jobId}`),
};
