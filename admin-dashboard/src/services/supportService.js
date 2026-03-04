import api from '../utils/api';

const supportService = {
  // Get contact submissions with pagination
  getContactSubmissions: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/api/support?page=${page}&limit=${limit}`);

      // API returns: { success: true, data: { items: [...], pagination: {...} } }
      const submissions = response.data?.data?.items || [];
      const pagination = response.data?.data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 };

      return {
        success: true,
        submissions,
        pagination,
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to fetch contact submissions:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contact submissions',
        submissions: [],
        error: error,
      };
    }
  },

  // Delete a contact submission
  deleteContactSubmission: async (id) => {
    try {
      const response = await api.delete(`/api/support/${id}`);
      return {
        success: true,
        message: response.data.message || 'Submission deleted successfully',
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to delete submission:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete submission',
        error: error,
      };
    }
  },
};

export default supportService;
