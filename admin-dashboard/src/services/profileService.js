import api from '../utils/api';

const profileService = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/api/auth/profile');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile',
        error: error,
      };
    }
  },

  // Update user profile (if needed in future)
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/auth/profile', profileData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile',
        error: error,
      };
    }
  },
};

export default profileService;
