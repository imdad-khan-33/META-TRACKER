import { Search } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const navigate = useNavigate();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const users = [
    { name: 'Liam Carter', plan: 'Pro', startDate: '2022-01-15', endDate: '2024-01-15', status: 'Active' },
    { name: 'Olivia Bennett', plan: 'Basic', startDate: '2022-02-20', endDate: '2024-02-10', status: 'Active' },
    { name: 'Noah Thompson', plan: 'Enterprise', startDate: '2023-03-25', endDate: '2024-03-25', status: 'Active' },
    { name: 'Ava Harper', plan: 'Premium', startDate: '2022-04-10', endDate: '2024-04-10', status: 'Active' },
    { name: 'Ethan Rivera', plan: 'Pro', startDate: '2022-05-05', endDate: '2024-05-05', status: 'Active' },
    { name: 'Sophia Foster', plan: 'Basic', startDate: '2023-06-12', endDate: '2024-06-12', status: 'Active' },
    { name: 'Mason Reed', plan: 'Enterprise', startDate: '2023-07-18', endDate: '2024-07-18', status: 'Active' },
    { name: 'Isabella Hayes', plan: 'Premium', startDate: '2022-08-22', endDate: '2024-08-22', status: 'Active' },
    { name: 'Alexander Gutierrez', plan: 'Pro', startDate: '2023-09-30', endDate: '2024-09-30', status: 'Active' },
    { name: 'Mia Brooks', plan: 'Basic', startDate: '2023-10-14', endDate: '2024-10-14', status: 'Active' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <h1 className="text-xl md:text-2xl lg:text-[28px] font-bold text-[#000000] mb-6">User</h1>
      
      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search Users"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg border border-[#D9EAFD] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Plan</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Start Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">End Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm">
                    <button 
                      onClick={() => navigate(`/user-details/${index}`)}
                      className="text-[#2E73E3] hover:underline cursor-pointer font-medium"
                    >
                      {user.name}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-sm text-[#61698A]">{user.plan}</td>
                  <td className="py-4 px-4 text-sm text-[#61698A]">{user.startDate}</td>
                  <td className="py-4 px-4 text-sm text-[#61698A]">{user.endDate}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-[#CDE5FB] text-[#2E73E3]">
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-[#000000] text-sm font-bold hover:underline">
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default User;
