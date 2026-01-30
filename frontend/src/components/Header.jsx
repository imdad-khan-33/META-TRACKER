const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-[65px] bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl">📊</span>
        <h1 className="text-lg font-semibold text-gray-900">Track Bridge</h1>
      </div>

      {/* Right Side - User Info */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Last 30 Days</span>
        <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
          I
        </div>
      </div>
    </div>
  )
}

export default Header
