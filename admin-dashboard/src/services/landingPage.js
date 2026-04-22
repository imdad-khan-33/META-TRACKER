import api from '../utils/api';

const landingPageService = {
    /**
     * Get all landing pages
     */
    getLandingPages: async () => {
        try {
            const response = await api.get('/api/landing-pages');
            return { success: true, data: response.data?.data || response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch landing pages', data: [] };
        }
    },

    /**
     * Get a single landing page by ID
     * @param {string} id
     */
    getLandingPage: async (id) => {
        try {
            const response = await api.get(`/api/landing-pages/${id}`);
            return { success: true, data: response.data?.data || response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch landing page' };
        }
    },

    /**
     * Create a new landing page
     * @param {Object} data { name, html, config }
     */
    createLandingPage: async (data) => {
        try {
            const response = await api.post('/api/landing-pages', data);
            return { success: true, data: response.data?.data || response.data, message: response.data?.message || 'Landing page created successfully' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to create landing page' };
        }
    },

    /**
     * Update a landing page
     * @param {string} id
     * @param {Object} data { name, html, config, status }
     */
    updateLandingPage: async (id, data) => {
        try {
            const response = await api.patch(`/api/landing-pages/${id}`, data);
            return { success: true, data: response.data?.data || response.data, message: response.data?.message || 'Landing page updated successfully' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to update landing page' };
        }
    },

    /**
     * Delete a landing page
     * @param {string} id
     */
    deleteLandingPage: async (id) => {
        try {
            const response = await api.delete(`/api/landing-pages/${id}`);
            return { success: true, data: response.data?.data || response.data, message: response.data?.message || 'Landing page deleted successfully' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to delete landing page' };
        }
    },
};

export default landingPageService;
