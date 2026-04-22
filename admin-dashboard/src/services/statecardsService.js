import api from "../utils/api";

// Helper function to format date to YYYY-MM-DD
const formatDate = (date) => {
    if (!date) return '';
    
    // If it's already a string in YYYY-MM-DD format, return as is
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
    }
    
    // If it's a Date object or date string, convert to YYYY-MM-DD
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

const statecardsService = {
    getStats: async (workspaceId, startDate, endDate) => {
        try {
            // Format dates to ensure YYYY-MM-DD format
            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);
            
            console.log('Sending API request with dates:', formattedStartDate, formattedEndDate);
            
            const res = await api.get(`api/auth/platform/dashboard?startDate=${formattedStartDate}&endDate=${formattedEndDate}&workspaceId=${workspaceId}`);
            // res.data is already the API response with success and data properties
            return res.data;
        } catch (error) {
            console.error('Error fetching stats:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default statecardsService;