import { useState, useMemo, useRef, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import authService from './services/authService'
import { ChevronDown, Menu, X, LogOut, Lock } from 'lucide-react'
import logo from './assets/admin-logo.svg'

// Import Pages
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AcceptInvite from './pages/AcceptInvite'
import ChangePassword from './pages/ChangePassword'
import Dashboard from './pages/Dashboard'
import User from './pages/User'
import UserDetails from './pages/UserDetails'
import Roles from './pages/Roles'
import Support from './pages/Support'

function AppRoutes() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef(null)
  
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get user info - dependency on location ensures refresh after login
  const currentUser = useMemo(() => authService.getCurrentUser(), [location.pathname])
  const userName = currentUser?.name || 'Super Admin'
  const userRole = currentUser?.role || 'Admin'
  const userEmail = currentUser?.email || ''

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    authService.logout()
    navigate('/')
  }

  return (
    <Routes>
      {/* Public Routes - No Header/Sidebar */}
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />
      
      {/* Dashboard Routes - With Header/Sidebar */}
      <Route path="/*" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-white">
            {/* Header - Full Width at Top */}
            <header className="border-b border-[#D9EAFD] px-4 md:px-8 py-4 flex items-center justify-between bg-white shadow-sm sticky top-0 z-20">
              <div className="flex items-center gap-2 md:gap-4">
                {/* Mobile Menu Toggle */}
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                
                <img src={logo} alt="Track Bridge Logo" className="h-8 md:h-10 w-auto" />
              </div>
              
              <div className="flex items-center gap-2 md:gap-4">
                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-lg transition-colors focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#E0E7FF] flex items-center justify-center text-[#2E73E3] font-bold text-sm border-2 border-white shadow-sm">
                      {(userName && userName.length > 0) ? userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-[#000000] leading-tight">{userName}</p>
                      <p className="text-[11px] text-gray-500 font-medium capitalize leading-tight">{userRole}</p>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50 transform origin-top-right transition-all">
                      <div className="px-4 py-3 border-b border-gray-50 bg-gray-[2px]">
                        <p className="text-sm font-semibold text-gray-900">{userName}</p>
                        {userEmail && <p className="text-xs text-gray-500 truncate mt-0.5">{userEmail}</p>}
                      </div>
                      
                      <div className="py-1">
                        <Link 
                          to="/change-password" 
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2E73E3] transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Lock size={16} className="text-gray-400" />
                          <span className="font-medium">Change Password</span>
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-50 mt-1 pt-1">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut size={16} />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Content Area with Sidebar */}
            <div className="flex">
              {/* Sidebar - Hidden on mobile, visible on desktop */}
              <div className={`
                fixed left-0 z-30 
                transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 transition-transform duration-300 ease-in-out
                top-[73px] md:top-[81px] h-[calc(100vh-73px)] md:h-[calc(100vh-81px)]
              `}>
                <Sidebar closeSidebar={() => setSidebarOpen(false)} />
              </div>

              {/* Overlay for mobile */}
              {sidebarOpen && (
                <div 
                  className="fixed inset-0 bg-white bg-opacity-80 z-20 lg:hidden top-[73px] md:top-[81px]"
                  onClick={() => setSidebarOpen(false)}
                />
              )}

              {/* Main Content with Routes - Add left margin for sidebar on desktop */}
              <main className="flex-1 p-4 md:p-6 lg:p-8 w-full lg:ml-64">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/user" element={<User />} />
                  <Route path="/user-details/:id" element={<UserDetails />} />
                  <Route path="/roles" element={<Roles />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/change-password" element={<ChangePassword />} />
                </Routes>
              </main>
            </div>
          </div>
        </ProtectedRoute>
      } />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App
