import { profileAPI } from '../api/profile.api';

export const profileService = {
    getProfile: async () => {
        const response = await profileAPI.getProfile();
        return response.data;
    },

    getJobSeekerProfile: async () => {
        const response = await profileAPI.getJobSeekerProfile();
        return response.data;
    },

    updateJobSeekerProfile: async (data) => {
        const response = await profileAPI.updateJobSeekerProfile(data);
        return response.data;
    },

    getStatistics: async () => {
        const response = await profileAPI.getStatistics();
        return response.data;
    },
};
