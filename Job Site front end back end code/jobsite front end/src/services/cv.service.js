import { cvAPI } from '../api/cv.api';

export const cvService = {
    upload: async (formData) => {
        const response = await cvAPI.upload(formData);
        return response.data;
    },

    getMyCVs: async () => {
        const response = await cvAPI.getMyCVs();
        return response.data;
    },

    delete: async (id) => {
        await cvAPI.delete(id);
    },

    setDefault: async (id) => {
        const response = await cvAPI.setDefault(id);
        return response.data;
    },

    updateMetadata: async (id, metadata) => {
        const response = await cvAPI.updateMetadata(id, metadata);
        return response.data;
    },

    download: async (id, fileName = 'resume.pdf') => {
        try {
            const response = await cvAPI.download(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            throw error;
        }
    },
};
