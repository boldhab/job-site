import { aiAPI } from '../api/ai.api';

export const aiService = {
    chat: async (message) => {
        const response = await aiAPI.chat(message);
        return response.data;
    },
    optimizeJob: async (title, industry) => {
        const response = await aiAPI.optimizeJob(title, industry);
        return response.data;
    },
    analyzeMyCV: async () => {
        const response = await aiAPI.analyzeMyCV();
        return response.data;
    },
    getMatchScore: async (jobId) => {
        const response = await aiAPI.getMatchScore(jobId);
        return response.data;
    },
};
