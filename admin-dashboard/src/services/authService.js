import api from '../utils/api';

// Auth service for handling authentication operations
const authService = {
  // Login function
  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      console.log('Login Response:', response.data); // Debug log

      // Handle different response formats
      const responseData = response.data;
      let token = null;
      let userData = null;

      // Check for token in different possible locations
      if (responseData.token) {
        token = responseData.token;
      } else if (responseData.data?.token) {
        token = responseData.data.token;
      } else if (responseData.accessToken) {
        token = responseData.accessToken;
      } else if (responseData.data?.accessToken) {
        token = responseData.data.accessToken;
      }

      // Check for user data in different possible locations
      if (responseData.user) {
        userData = responseData.user;
      } else if (responseData.data?.user) {
        userData = responseData.data.user;
      } else if (responseData.data) {
        // Sometimes the entire data object is the user
        userData = responseData.data;
      }

      // Store token if found
      if (token) {
        localStorage.setItem('authToken', token);
        console.log('Token saved to localStorage:', token); // Debug log
      } else {
        console.warn('No token found in response!'); // Warning log
      }
      
      // Store user data if found
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('User data saved to localStorage:', userData); // Debug log
      } else {
        console.warn('No user data found in response!'); // Warning log
      }

      return {
        success: true,
        data: responseData,
        token: token,
        user: userData,
      };
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message); // Error log
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
        error: error,
      };
    }
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('authToken');
  },
};

export default authService;
