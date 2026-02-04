import { Link, useLocation, useNavigate } from 'react-router-dom';
import dashboardIcon from '../assets/dashboardicon.svg';
import userIcon from '../assets/uil_user.svg';
import rolesIconInner from '../assets/rolesicon-inner.svg';
import rolesIconOuter from '../assets/rolesicon-outer.svg';
import supportIcon from '../assets/support-icon.svg';
import logoutIcon from '../assets/logout-icon.svg';

// Custom Roles Icon Component that combines inner and outer SVGs
const RolesIcon = () => (
  <div className="relative w-5 h-5 flex items-center justify-center">
    <img src={rolesIconInner} alt="Roles Inner" className="absolute w-6 h-6" />
    <img src={rolesIconOuter} alt="Roles Outer" className="absolute w-2 h-2.5" />
  </div>
);

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Redirect to login page
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', icon: dashboardIcon, isCustom: true, path: '/dashboard' },
    { name: 'User', icon: userIcon, isCustom: true, path: '/user' },
    { name: 'Roles', icon: 'roles', isCustom: false, path: '/roles' }, 
    { name: 'Support', icon: supportIcon, isCustom: true, path: '/support' },
  ];

  return (
    <div className="w-64 lg:w-64 sticky top-[73px] md:top-[81px] h-[calc(100vh-73px)] md:h-[calc(100vh-81px)] bg-[#2E73E3] text-white flex flex-col overflow-y-auto">
      {/* Sidebar Content */}
      <div className="flex-1 py-6">
        {/* Menu Items */}
        <nav className="space-y-2 px-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/20 shadow-lg' 
                    : 'hover:bg-white/10'
                }`}
              >
                {item.name === 'Roles' ? (
                  <RolesIcon />
                ) : (
                  <div className="w-5 h-5 flex items-center justify-center">
                    <img src={item.icon} alt={item.name} className="w-5 h-5 object-contain" />
                  </div>
                )}
                <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', lineHeight: '21px', letterSpacing: '0px' }}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button at Bottom */}
      <div className="p-4">
        <button onClick={handleLogout} className=" cursor-pointer  w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200">
          <img src={logoutIcon} alt="Logout" className="w-6 h-6" />
          <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', lineHeight: '21px', letterSpacing: '0px' }}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
