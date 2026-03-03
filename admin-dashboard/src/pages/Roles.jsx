import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import switchActive from '../assets/3D Switch.svg';
import switchInactive from '../assets/3D Switch (1).svg';
import userService from '../services/userService';

const Roles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('viewer');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({ email: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');
  const [platformUsers, setPlatformUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [togglingUserId, setTogglingUserId] = useState(null); // Track which user is being toggled

  // Fetch platform users on component mount
  useEffect(() => {
    fetchPlatformUsers();
  }, []);

  const fetchPlatformUsers = async () => {
    setFetchingUsers(true);
    try {
      const result = await userService.getPlatformUsers();
      if (result.success) {
        setPlatformUsers(result.users);
      } else {
        console.error('Failed to fetch platform users:', result.message);
      }
    } catch (error) {
      console.error('Error fetching platform users:', error);
    } finally {
      setFetchingUsers(false);
    }
  };

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCreateUser = async () => {
    // Reset messages
    setErrors({ email: '' });
    setSuccess('');
    setApiError('');

    // Validation
    let hasError = false;

    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      hasError = true;
    } else if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      hasError = true;
    }

    // If validation fails, don't proceed
    if (hasError) return;

    setLoading(true);

    try {
      // Call API
      const result = await userService.inviteUser(email, plan);

      if (result.success) {
        setSuccess(result.message);
        // Refresh platform users list
        await fetchPlatformUsers();
        // Reset form after 1.5 seconds
        setTimeout(() => {
          setEmail('');
          setPlan('viewer');
          setErrors({ email: '' });
          setSuccess('');
          setIsModalOpen(false);
        }, 1500);
      } else {
        setApiError(result.message);
      }
    } catch {
      setApiError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle user active status (enable/disable)
  const handleToggleUserStatus = async (userId, currentStatus) => {
    // Prevent multiple clicks
    if (togglingUserId) return;
    
    try {
      console.log(`🔄 Toggling user status for ID: ${userId}`);
      
      // Set loading state
      setTogglingUserId(userId);
      
      // Optimistic UI update
      setPlatformUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, active: !user.active } : user
        )
      );

      const result = await userService.togglePlatformUserStatus(userId);

      if (result.success) {
        console.log('✅ User status toggled successfully');
        // Optionally show a success message
        // You can add a toast notification here if you have one
      } else {
        // Revert the optimistic update on failure
        setPlatformUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, active: currentStatus } : user
          )
        );
        console.error('Failed to toggle user status:', result.message);
        alert(result.message || 'Failed to update user status');
      }
    } catch (error) {
      // Revert the optimistic update on error
      setPlatformUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, active: currentStatus } : user
        )
      );
      console.error('Error toggling user status:', error);
      alert('An error occurred while updating user status');
    } finally {
      // Clear loading state
      setTogglingUserId(null);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId, userName) => {
    // Confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${userName}?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      console.log(`🗑️ Deleting user: ${userName} (ID: ${userId})`);

      const result = await userService.deleteUser(userId);

      if (result.success) {
        console.log('✅ User deleted successfully');
        
        // Remove user from the list
        setPlatformUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        
        // Show success message (you can replace with toast notification)
        alert(result.message || 'User deleted successfully');
      } else {
        console.error('Failed to delete user:', result.message);
        alert(result.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user');
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <h1 className="text-xl md:text-2xl lg:text-[28px] font-bold text-[#000000] mb-6">Role Management</h1>
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#000000]">User Profiles</h2>
        <button 
          onClick={() => {
            setIsModalOpen(true);
            setIsDropdownOpen(false);
          }}
          className="bg-[#CDE5FB] cursor-pointer text-[#000000] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#b0d5f8] transition-colors duration-200">
          + Create User
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg border border-[#D9EAFD] shadow-sm">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">User Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Active</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Action</th>
              </tr>
            </thead>
            <tbody>
              {fetchingUsers ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center">
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-8 w-8 text-[#2E73E3]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="ml-3 text-gray-600">Loading platform users...</span>
                    </div>
                  </td>
                </tr>
              ) : platformUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No platform users found. Invite users to get started.
                  </td>
                </tr>
              ) : (
                platformUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-[#61698A]">{user.name}</td>
                    <td className="py-4 px-4 text-sm text-[#61698A]">{user.email}</td>
                    <td className="py-4 px-4 text-sm text-[#61698A] capitalize">{user.role}</td>
                    <td className="py-4 px-4">
                      <button 
                        className="focus:outline-none group relative"
                        onClick={() => handleToggleUserStatus(user.id, user.active)}
                        disabled={togglingUserId === user.id}
                      >
                        <div className="relative">
                          {/* Loading spinner overlay */}
                          {togglingUserId === user.id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-full z-10">
                              <svg className="animate-spin h-5 w-5 text-[#2E73E3]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </div>
                          )}
                          
                          <img 
                            src={user.active ? switchActive : switchInactive} 
                            alt={user.active ? "Active" : "Inactive"} 
                            className={`w-12 h-[26px] object-contain cursor-pointer transition-all duration-300 ease-in-out transform ${
                              togglingUserId === user.id 
                                ? 'opacity-50 scale-100' 
                                : 'group-hover:scale-110 group-active:scale-95'
                            }`}
                          />
                          
                          {/* Smooth fade transition overlay */}
                          <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150 rounded-full"></div>
                        </div>
                        
                        {/* Tooltip on hover */}
                        {togglingUserId !== user.id && (
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-20">
                            {user.active ? 'Click to disable' : 'Click to enable'}
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <button 
                        className="text-[#E83D08] text-sm font-medium hover:text-red-700 transition-colors duration-200 cursor-pointer"
                        onClick={() => handleDeleteUser(user.id, user.name)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md border-2 border-gray-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-[#000000]">Create New User</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm font-medium">{success}</p>
                </div>
              )}

              {/* Error Message */}
              {apiError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{apiError}</p>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    // Clear error when user starts typing
                    if (errors.email) {
                      setErrors({ ...errors, email: '' });
                    }
                  }}
                  placeholder="Enter email address"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Role Dropdown */}
              <div className="relative">
                <label className="block text-sm font-semibold text-[#000000] mb-2">
                  Role
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer flex justify-between items-center text-left"
                  >
                    <span className="capitalize">{plan}</span>
                    <ChevronDown size={20} className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                      {['viewer', 'admin'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setPlan(option);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors capitalize
                            ${plan === option ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}
                          `}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-[#2E73E3] rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Create User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
