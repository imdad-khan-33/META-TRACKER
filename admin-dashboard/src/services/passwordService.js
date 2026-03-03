import api from '../utils/api';

const passwordService = {
  // Forgot Password - Send reset email
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/api/auth/forgot-password', {
        email,
      });

      return {
        success: true,
        message: response.data.message || 'Reset link sent to your email',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reset email',
        error: error,
      };
    }
  },

  // Reset Password - Set new password with token
  resetPassword: async (token, newPassword, confirmPassword) => {
    try {
      const response = await api.post('/api/auth/reset-password', {
        token,
        newPassword,
        confirmPassword,
      });

      return {
        success: true,
        message: response.data.message || 'Password reset successfully',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password',
        error: error,
      };
    }
  },

  // Change Password - For logged-in users
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    try {
      const response = await api.post('/api/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      return {
        success: true,
        message: response.data.message || 'Password changed successfully',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password',
        error: error,
      };
    }
  },
};

export default passwordService;
