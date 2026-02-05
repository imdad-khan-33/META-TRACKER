import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { ChevronDown, Menu, X } from 'lucide-react'
import logo from './assets/admin-logo.svg'


// Import Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import User from './pages/User'
import UserDetails from './pages/UserDetails'
import Roles from './pages/Roles'
import Support from './pages/Support'


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Router>
      <Routes>
        {/* Login Route - No Header/Sidebar */}
        <Route path="/" element={<Login />} />
        
        {/* Dashboard Routes - With Header/Sidebar */}
        <Route path="/*" element={
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
                <span className="text-sm font-medium text-[#000000] cursor-pointer hover:text-[#2E73E3] transition-colors">
                  Super Admin
                </span>
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
                </Routes>
              </main>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App

