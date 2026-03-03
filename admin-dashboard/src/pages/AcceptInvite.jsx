import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import userService from '../services/userService';
import logo from '../assets/admin-logo.svg';
import { Eye, EyeOff } from 'lucide-react';

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Log token on component mount
  useEffect(() => {
    console.log('🔗 Accept Invite Page Loaded');
    console.log('Current URL:', window.location.href);
    console.log('Token from URL:', token || 'NO TOKEN FOUND');
    
    if (!token) {
      setError('Invalid or missing invitation token');
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    console.log(' Accept Invite Form Submitted');
    console.log('Form Data:', { fullName: formData.fullName, password: '***', confirmPassword: '***' });
    console.log('Token from URL:', token ? 'Present' : 'Missing');

    // Validation
    if (!formData.fullName || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      console.warn(' Validation failed: Missing fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      console.warn(' Validation failed: Password too short');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      console.warn(' Validation failed: Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid or missing invitation token');
      console.error(' No token found in URL');
      return;
    }

    setLoading(true);
    console.log(' Calling userService.acceptInvite...');

    try {
      const result = await userService.acceptInvite(
        token,
        formData.fullName,
        formData.password,
        formData.confirmPassword
      );

      console.log(' Result from userService:', result);

      if (result.success) {
        setSuccess('Account created successfully! Redirecting to login page...');
        console.log('Invitation accepted successfully');
        console.log('Email for login:', result.data?.email);
        
        // CRITICAL: Clear ALL authentication data to ensure user must login manually
        localStorage.clear(); // Clear everything
        sessionStorage.clear(); // Clear session storage too
        
        // Explicitly remove specific auth keys (belt and suspenders approach)
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        
        console.log('Cleared ALL auth data from localStorage and sessionStorage');
        console.log('User MUST login manually now');
        
        setTimeout(() => {
          console.log('Redirecting to login page...');
          console.log('User should NOT be logged in automatically');
          navigate('/', { replace: true }); // Use replace to prevent back navigation
        }, 2000);
      } else {
        setError(result.message);
        console.error('Failed to accept invitation:', result.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('❌ Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Track Bridge" className="h-12" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#000000] mb-2">
            Accept Invitation
          </h1>
          <p className="text-sm text-gray-600">
            Complete your account setup to join the platform
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{success}</p>
            <p className="text-green-600 text-xs mt-1">Redirecting to login...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#000000] mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E73E3] focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#000000] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E73E3] focus:border-transparent"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#000000] mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E73E3] focus:border-transparent"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2E73E3] text-white py-3 rounded-lg font-medium hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Accept Invitation'
            )}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            By accepting this invitation, you will be able to access the platform with the role assigned by the administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
