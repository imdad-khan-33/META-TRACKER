import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import switchActive from '../assets/3D Switch.svg';
import switchInactive from '../assets/3D Switch (1).svg';

const Roles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('user');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({ email: '' });

  const userProfiles = [
    { name: 'IMDAD', email: 'example@gmail.com', plan: 'admin', active: true, action: 'Remove' },
    { name: 'MAAZ', email: 'running@gmail.com', plan: 'user', active: false, action: 'Remove' },
  ];

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCreateUser = () => {
    // Reset errors
    setErrors({ email: '' });

    // Validation
    let hasError = false;

    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      hasError = true;
    } else if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      hasError = true;
    }

    // If validation fails, don't proceed
    if (hasError) return;

    // Handle user creation logic here
    console.log('Creating user:', { email, plan });
    
    // Reset form and close modal
    setEmail('');
    setPlan('user');
    setErrors({ email: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <h1 className="text-xl md:text-2xl lg:text-[28px] font-bold text-[#000000] mb-6">Role Management</h1>
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#000000]">User Profiles</h2>
        <button 
          onClick={() => {
            setIsModalOpen(true);
            setIsDropdownOpen(false);
          }}
          className="bg-[#CDE5FB]  cursor-pointer  text-[#000000] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#b0d5f8] transition-colors duration-200">
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

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md border-2 border-gray-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-[#000000]">Create New User</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    // Clear error when user starts typing
                    if (errors.email) {
                      setErrors({ ...errors, email: '' });
                    }
                  }}
                  placeholder="Enter email address"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Plan Dropdown */}
              <div className="relative">
                <label className="block text-sm font-semibold text-[#000000] mb-2">
                  Plan
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer flex justify-between items-center text-left"
                  >
                    <span className="capitalize">{plan}</span>
                    <ChevronDown size={20} className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                      {['user', 'admin'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setPlan(option);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors capitalize
                            ${plan === option ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}
                          `}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 text-sm font-medium text-white bg-[#2E73E3] rounded-lg hover:bg-[#2563EB] transition-colors">
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
