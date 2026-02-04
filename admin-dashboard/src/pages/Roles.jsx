import switchActive from '../assets/3D Switch.svg';
import switchInactive from '../assets/3D Switch (1).svg';

const Roles = () => {
  const userProfiles = [
    { name: 'IMDAD', email: 'example@gmail.com', plan: 'admin', active: true, action: 'Remove' },
    { name: 'MAAZ', email: 'running@gmail.com', plan: 'user', active: false, action: 'Remove' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <h1 className="text-xl md:text-2xl lg:text-[28px] font-bold text-[#000000] mb-6">Role Management</h1>
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#000000]">User Profiles</h2>
        <button className="bg-[#CDE5FB]  cursor-pointer  text-[#000000] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#b0d5f8] transition-colors duration-200">
          + Create User
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg border border-[#D9EAFD] shadow-sm">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">User Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Plan</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Active</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Action</th>
              </tr>
            </thead>
            <tbody>
              {userProfiles.map((user, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-[#61698A]">{user.name}</td>
                  <td className="py-4 px-4 text-sm text-[#61698A]">{user.email}</td>
                  <td className="py-4 px-4 text-sm text-[#61698A]">{user.plan}</td>
                  <td className="py-4 px-4">
                    <button className="focus:outline-none">
                      <img 
                        src={user.active ? switchActive : switchInactive} 
                        alt={user.active ? "Active" : "Inactive"} 
                        className="w-12 h-[26px] object-contain cursor-pointer transition-transform hover:scale-105"
                      />
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-[#E83D08] text-sm font-medium hover:text-red-700">
                      {user.action}
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

export default Roles;
