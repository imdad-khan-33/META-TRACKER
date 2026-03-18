import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import loginImage from '../assets/login.png';
import emailIcon from '../assets/email-icon.svg';
import passwordIcon from '../assets/password-icon.svg';
import logo from '../assets/main-logo.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        // Login successful - navigate to dashboard
        navigate('/dashboard');
      } else {
        // Login failed - show error message
        setError(result.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen flex items-center justify-center p-4 bg-white overflow-y-auto lg:overflow-hidden py-12 lg:py-0">
      <div className="flex flex-col lg:flex-row max-w-6xl w-full items-center justify-center gap-6 lg:gap-12">
        
        {/* Left Side - Form */}
        <div className="w-full lg:w-[597px] flex flex-col items-center lg:items-start">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <img src={logo} alt="Track Bridge Logo" className="h-12 w-auto" />
          </div>

          <div className="mb-6">
            <h1 className="font-bold text-3xl text-[#000000] mb-2">
              Admin Login
            </h1>
            <p className="text-[#61698A] text-base">
              Welcome back! Please login to your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 w-full lg:w-[480px]">
            {/* Email Input */}
            <div className="relative w-full">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <img src={emailIcon} alt="Email" className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E73E3] text-base placeholder-gray-500"
              />
            </div>

            {/* Password Input */}
            <div className="relative w-full">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <img src={passwordIcon} alt="Password" className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-12 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E73E3] text-base placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between w-full">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#2E73E3] focus:ring-[#2E73E3]"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-[#2E73E3] hover:text-[#2563EB] font-medium"
              >
                Forgot Password?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#2E73E3] text-white font-medium py-3 rounded-lg transition-all duration-200 text-base mt-5 shadow-md hover:shadow-lg ${
                loading 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:bg-[#2563EB] cursor-pointer'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Log in'
              )}
            </button>

            {/* Info Text */}
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                For admin access only. Please contact support if you need assistance.
              </p>
            </div>
          </form>
        </div>

        {/* Right Side - Image */}
        <div className="flex items-center justify-center overflow-hidden w-full lg:w-[553px] h-[400px] lg:h-[680px] mt-8 lg:mt-0">
          <div className="w-full max-w-[521px] h-full lg:h-[630px] flex items-center justify-center overflow-hidden rounded-lg">
            <img 
              src={loginImage} 
              alt="Admin Dashboard illustration" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
