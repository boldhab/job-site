import { userAPI } from '../api/user.api';

export const userService = {
    getProfile: async () => {
        const response = await userAPI.getProfile();
        return response.data;
    },

    updateProfile: async (data) => {
        const response = await userAPI.updateProfile(data);
        return response.data;
    },

    deactivateAccount: async () => {
        const response = await userAPI.deactivateAccount();
        return response.data;
    },
};
