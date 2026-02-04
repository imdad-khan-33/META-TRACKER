import { Link } from 'react-router-dom'

export const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white overflow-y-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full flex flex-col items-center">
        
        {/* Forgot Password Header */}
        <div className="mb-10 text-center flex flex-col items-center px-4">
          <h1 className="font-bold text-3xl text-gray-900 mb-4">
            Forgot your password?
          </h1>
          <p className="text-base text-gray-600 w-full max-w-[868px] text-center leading-relaxed">
            Enter the email associated with your account and we'll send you instructions to reset your password.
          </p>
        </div>

        <form className="space-y-6 flex flex-col items-center w-full px-4">
          {/* Email Input */}
          <div className="w-full max-w-[480px]">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base placeholder-gray-500"
            />
          </div>

          {/* Send Reset Link Button */}
          <button
            type="submit"
            className="w-full max-w-[480px] sm:w-auto sm:px-8 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
          >
            Send Reset Link
          </button>

          {/* Back to Login Link */}
          <div className="text-center mt-4">
            <Link to="/login" className="text-gray-500 hover:text-gray-700 font-medium">
              Back to Login
            </Link>
          </div>
        </form>

      </div>
    </div>
  )
}
