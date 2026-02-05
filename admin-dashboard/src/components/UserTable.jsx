import { useNavigate } from 'react-router-dom';

const UserTable = () => {
  const navigate = useNavigate();
  const users = [
    { name: 'Liam Carter', plan: 'Pro', start: '2023-01-15', end: '2024-01-15', status: 'Active' },
    { name: 'Olivia Bennett', plan: 'Basic', start: '2023-02-20', end: '2024-02-20', status: 'Active' },
    { name: 'Noah Thompson', plan: 'Enterprise', start: '2023-03-25', end: '2024-03-25', status: 'Active' },
    { name: 'Ava Harper', plan: 'Premium', start: '2023-04-30', end: '2024-04-30', status: 'Active' },
    { name: 'Ethan Parker', plan: 'Pro', start: '2023-05-05', end: '2024-05-05', status: 'Active' },
    { name: 'Isabella Foster', plan: 'Basic', start: '2023-06-10', end: '2024-06-10', status: 'Active' },
    { name: 'Mason Reed', plan: 'Enterprise', start: '2023-07-15', end: '2024-07-15', status: 'Active' },
    { name: 'Sophia Hayes', plan: 'Premium', start: '2023-08-20', end: '2024-08-20', status: 'Active' },
   
  ];

  return (
    <div className="bg-[#FFFFFF] rounded-[8px] border border-[#D9EAFD] shadow-sm overflow-hidden">
      {/* View More Button - Moved to Top */}
      <div className="flex justify-end px-4 md:px-6 py-3 md:py-4 border-b border-[#D9EAFD]">
        <button 
          onClick={() => {
            window.scrollTo(0, 0);
            navigate('/user');
          }}
          className=" cursor-pointer  bg-[#2E73E3] text-white px-4 md:px-6 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-[#2563EB] transition-colors duration-200 shadow-sm">
          View More
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[640px]">
          <thead>
            <tr className="border-b border-[#D9EAFD] text-[#000000] text-[11px] md:text-[13px] font-medium">
              <th className="px-3 md:px-6 py-3 md:py-4">Name</th>
              <th className="px-3 md:px-6 py-3 md:py-4">Plan</th>
              <th className="px-3 md:px-6 py-3 md:py-4">Start Date</th>
              <th className="px-3 md:px-6 py-3 md:py-4">End Date</th>
              <th className="px-3 md:px-6 py-3 md:py-4">Status</th>
              <th className="px-3 md:px-6 py-3 md:py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2E73E3]">
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors text-[#000000] text-[12px] md:text-[14px]">
                <td className="px-3 md:px-4 py-3 md:py-4">{user.name}</td>
                <td className="px-3 md:px-6 py-3 md:py-4">{user.plan}</td>
                <td className="px-3 md:px-6 py-3 md:py-4">{user.start}</td>
                <td className="px-3 md:px-6 py-3 md:py-4">{user.end}</td>
                <td className="px-3 md:px-6 py-3 md:py-4">
                  <span className="bg-[#CDE5FB] text-[#3B82F6] px-2 md:px-4 py-1 rounded-[6px] text-[10px] md:text-[12px] font-bold">
                    {user.status}
                  </span>
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4">
                  <button className="   font-bold text-[#000000] cursor-pointer hover:underline text-[10px] md:text-[12px]">
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
