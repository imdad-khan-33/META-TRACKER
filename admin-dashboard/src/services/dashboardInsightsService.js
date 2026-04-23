import api from '../utils/api';

const formatDate = (date) => {
  if (!date) return '';

  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) {
    return '';
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const dashboardInsightsService = {
  getRevenueInsights: async (startDate, endDate) => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      const params = {};

      if (formattedStartDate && formattedEndDate) {
        params.startDate = formattedStartDate;
        params.endDate = formattedEndDate;
      }

      const response = await api.get('/api/auth/platform/dashboard/revenue-insights', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard insights:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard insights',
        data: null,
        error,
      };
    }
  },
};

export default dashboardInsightsService;
