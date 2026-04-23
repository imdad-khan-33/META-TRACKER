import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileTextOutlined } from "@ant-design/icons";
import authService from '../services/authService';
import dashboardIcon from '../assets/dashboardicon.svg';
import userIcon from '../assets/uil_user.svg';
import rolesIconInner from '../assets/rolesicon-inner.svg';
import rolesIconOuter from '../assets/rolesicon-outer.svg';
import supportIcon from '../assets/support-icon.svg';
import logoutIcon from '../assets/logout-icon.svg';

import { MailOutlined } from "@ant-design/icons";
import { CrownOutlined } from "@ant-design/icons";

// Custom Roles Icon Component that combines inner and outer SVGs
const RolesIcon = () => (
  <div className="relative w-5 h-5 flex items-center justify-center">
    <img src={rolesIconInner} alt="Roles Inner" className="absolute w-6 h-6" />
    <img src={rolesIconOuter} alt="Roles Outer" className="absolute w-2 h-2.5" />
  </div>
);

const Sidebar = ({ closeSidebar, collapsed = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get current user to check role
  const currentUser = authService.getCurrentUser();
  const userRole = currentUser?.role?.toLowerCase();

  const handleLogout = () => {
    // Clear authentication data
    authService.logout();
    // Redirect to login page
    navigate('/');
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: dashboardIcon,
      isCustom: true,
      path: "/dashboard",
    },
    { name: "User", icon: userIcon, isCustom: true, path: "/user" },
    {
      name: "Landing Page",
      iconComponent: (
        <FileTextOutlined style={{ fontSize: "20px", color: "#fff" }} />
      ),
      isCustom: true,
      path: "/landing-pages/builder",
    },
    {
      name: "Roles",
      icon: "roles",
      isCustom: false,
      path: "/roles",
      allowedRoles: ["super_admin", "admin", "platform_staff"],
    },
    { name: "Support", icon: supportIcon, isCustom: true, path: "/support" },
    {
      name: "Contact Us",
      iconComponent: <MailOutlined style={{ fontSize: "20px", color: "#fff" }} />,
      isCustom: true,
      path: "/contact-us",
    },
    {
      name: "Subscription",
      iconComponent: <CrownOutlined style={{ fontSize: "20px", color: "#fff" }} />,
      isCustom: true,
      path: "/subscription",
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    // If item has allowedRoles, check if user's role is in the list
    if (item.allowedRoles) {
      return item.allowedRoles.includes(userRole);
    }
    // If no allowedRoles specified, show to everyone
    return true;
  });

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} h-full bg-[#084B8A] text-white flex flex-col overflow-y-auto transition-all duration-300`}>
      {/* Sidebar Content */}
      <div className="flex-1 py-6">
        {/* Menu Items */}
        <nav className={`space-y-2 ${collapsed ? 'px-3' : 'px-4'}`}>
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeSidebar}
                title={collapsed ? item.name : undefined}
                className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/20 shadow-lg' 
                    : 'hover:bg-white/10'
                }`}
              >
                {item.name === 'Roles' ? (
                  <RolesIcon />
                ) : item.iconComponent ? (
                  <div className="w-5 h-5 flex items-center justify-center text-white">
                    {item.iconComponent}
                  </div>
                ) : (
                  <div className="w-5 h-5 flex items-center justify-center">
                    <img src={item.icon} alt={item.name} className="w-5 h-5 object-contain" />
                  </div>
                )}
                {!collapsed && (
                  <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', lineHeight: '21px', letterSpacing: '0px' }}>
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button at Bottom */}
      <div className={collapsed ? 'p-3' : 'p-4'}>
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`cursor-pointer w-full flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-lg hover:bg-white/10 transition-all duration-200`}
        >
          <img src={logoutIcon} alt="Logout" className="w-6 h-6" />
          {!collapsed && (
            <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', lineHeight: '21px', letterSpacing: '0px' }}>
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
