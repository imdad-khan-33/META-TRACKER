import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()
  
  const menuItems = [
    { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { name: 'Projects', icon: '📁', path: '/projects' },
    { name: 'Landing Pages', icon: '📄', path: '/landing-pages' },
    { name: 'Integration', icon: '🔗', path: '/integrations' },
    { name: 'Lead Management', icon: '👥', path: '/lead-management' },
    { name: 'Analytics', icon: '📈', path: '/analytics' },
    { name: 'Settings', icon: '⚙️', path: '/settings' },
  ]

  return (
    <div 
      className="w-[280px] flex flex-col justify-between shrink-0"
      style={{ 
        backgroundColor: '#2E73E3',
        height: 'calc(100vh - 65px)',
        position: 'sticky',
        top: '65px'
      }}
    >
      <div className="p-4">
        {/* Menu Items */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-white ${
                location.pathname === item.path
                  ? 'bg-white/20 font-semibold'
                  : 'hover:bg-white/10'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <Link
          to="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white"
        >
          <span className="text-lg">🚪</span>
          <span className="text-sm">Logout</span>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
