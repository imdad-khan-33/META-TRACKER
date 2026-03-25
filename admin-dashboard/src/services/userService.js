import api from '../utils/api';

const userService = {
  // Invite user to platform
  inviteUser: async (email, role) => {
    try {
      const response = await api.post('/api/auth/platform/invite', {
        email,
        role,
      });

      return {
        success: true,
        message: response.data.message || 'User invited successfully',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to invite user',
        error: error,
      };
    }
  },

  // Accept invitation - User sets up account
  acceptInvite: async (token, name, password, confirmPassword) => {
    try {
      console.log(' Accept Invite API Call Started');
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('Name:', name);
      console.log('Password:', password ? '***' : 'Missing');
      console.log('Confirm Password:', confirmPassword ? '***' : 'Missing');

      const response = await api.post('/api/auth/accept-invite', {
        name,
        password,
        confirmPassword,
      }, {
        params: { token }
      });

      console.log(' Accept Invite API Success:', response.data);

      return {
        success: true,
        message: response.data.message || 'Account created successfully',
        data: response.data,
      };
    } catch (error) {
      console.error('Accept Invite API Error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to accept invitation',
        error: error,
      };
    }
  },

  // Get all platform users
  getPlatformUsers: async () => {
    try {
      console.log(' Fetching Platform Users...');
    
      const response = await api.get('/api/auth/platform-users');

      console.log(' Platform Users Fetched Successfully:', response.data);

      return {
        success: true,
        users: response.data.users || [],
        data: response.data,
      };
    } catch (error) {
      console.error(' Failed to fetch platform users:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch platform users',
        users: [],
        error: error,
      };
    }
  },

  // Get all clients
  getAllClients: async () => {
    try {
      const response = await api.get('/api/auth/all-clients');
      return {
        success: true,
        clients: response.data?.clients || [],
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to fetch clients:', error.response?.data || error.message);
      return {
        success: true,
        message: error.response?.data?.message || 'Failed to fetch clients',
        clients: [],
        error: error,
      };
    }
  },

  // Toggle platform user active status (enable/disable)
  togglePlatformUserStatus: async (userId) => {
    try {
      console.log(' Toggling Platform User Status...');
      console.log('User ID:', userId);
      
      const response = await api.post(`/api/auth/platform/toggle-disable-user/${userId}`);
      console.log(' User Status Toggled Successfully:', response.data);

      return {
        success: true,
        message: response.data.message || 'User status updated successfully',
        data: response.data,
      };
    } catch (error) {
      console.error(' Failed to toggle user status:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to toggle user status',
        error: error,
      };
    }
  },

  // Toggle workspace status (activate/deactivate user)
  toggleWorkspaceStatus: async (workspaceId, status) => {
    try {
      console.log('Toggling Workspace Status...');
      console.log('Workspace ID:', workspaceId);
      console.log('Status:', status);
      
      // Correct endpoint from backend
      const response = await api.patch(
        `api/auth/platform/workspaces/${workspaceId}/status=${status}`
      );

      console.log('Workspace Status Updated Successfully:', response.data);

      return {
        success: true,
        message: response.data.message || 'Workspace status updated successfully',
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to toggle workspace status:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to toggle workspace status',
        error: error,
      };
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      console.log(' Deleting User...');
      console.log('User ID:', userId);
      
      const response = await api.delete(`/api/auth/delete-user/${userId}`);

      console.log(' User Deleted Successfully:', response.data);

      return {
        success: true,
        message: response.data.message || 'User deleted successfully',
        data: response.data,
      };
    } catch (error) {
      console.error(' Failed to delete user:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user',
        error: error,
      };
    }
  },

  // Update workspace status (activate/deactivate)
  updateWorkspaceStatus: async (workspaceId, status) => {
    try {
      console.log('Updating Workspace Status...');
      console.log('Workspace ID:', workspaceId);
      console.log('Status:', status);
      
      // Try POST method instead of PUT
      const response = await api.post(`/api/auth/platform/workspaces/${workspaceId}/status`, {}, {
        params: {
          status: status,
        }
      });

      console.log('Workspace Status Updated Successfully:', response.data);

      return {
        success: true,
        message: response.data.message || 'Workspace status updated successfully',
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to update workspace status:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update workspace status',
        error: error,
      };
    }
  },

  // Get spend overview for a workspace
  getSpendOverview: async (workspaceId, startDate, endDate, platform = 'all') => {
    try {
      const response = await api.get(
        `/api/projects/platform/workspaces/${workspaceId}/spend-overview`,
        {
          params: {
            startDate: startDate,
            endDate: endDate,
            platform: platform
          }
        }
      );

      // API returns { success: true, data: { cards: {...}, chart: {...}, ... } }
      // Return it as-is to avoid double-nesting
      return response.data;
    } catch (error) {
      console.error('Failed to fetch spend overview:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch spend overview',
        data: null,
        error: error,
      };
    }
  },
};

export default userService;
