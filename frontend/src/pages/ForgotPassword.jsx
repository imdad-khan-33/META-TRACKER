import { Link } from 'react-router-dom'

export const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Forgot Password Form */}
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="font-bold text-3xl text-gray-900 mb-3">
              Forgot your password?
            </h1>
            <p className="text-sm text-gray-600">
              Enter the email associated with your account and we'll send you instructions to reset your password.
            </p>
          </div>

          <form className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Send Reset Link Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Send Reset Link
            </button>

            {/* Back to Login Link */}
            <div className="text-center">
              <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Back to Login
              </Link>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}
