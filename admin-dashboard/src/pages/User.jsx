import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';

const User = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [clientStatus, setClientStatus] = useState({});
  
  // Fetch clients from API
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchClients = async () => {
      setLoading(true);
      try {
        const result = await userService.getAllClients();
        if (result.success) {
          console.log('Clients data received:', result.clients);
          console.log('First client structure:', result.clients[0]);
          setClients(result.clients);
          // Initialize status map for clients
          const statusMap = {};
          result.clients.forEach((client) => {
            statusMap[client._id] = client.status !== false; // true if active, false if deactivated
          });
          setClientStatus(statusMap);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleStatusToggle = async (clientId, workspaceId, currentStatus) => {
    console.log('Toggle called - Client ID:', clientId, 'Workspace ID:', workspaceId, 'Current Status:', currentStatus);
    setProcessingId(clientId);
    try {
      const newStatus = !currentStatus; // Toggle status
      console.log('New Status:', newStatus);
      
      // Use toggleWorkspaceStatus with workspaceId
      const response = await userService.toggleWorkspaceStatus(workspaceId, newStatus);
      
      console.log('Response received:', response);
      
      if (response.success) {
        // Toggle the status in local state
        setClientStatus((prevStatus) => ({
          ...prevStatus,
          [clientId]: newStatus,
        }));
        console.log('Success - status toggled');
      } else {
        console.log('Failed - error:', response.message);
      }
    } catch (err) {
      console.error('Catch error:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-sm text-[#61698A]">
                    Loading clients...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-sm text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-sm text-[#61698A]">
                    {searchQuery ? 'No matching clients found.' : 'No clients found.'}
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const isActive = clientStatus[client._id] !== false;
                  return (
                    <tr key={client._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm">
                        <button 
                          onClick={() => navigate(`/user-details/${client._id}`)}
                          className="text-[#2E73E3] hover:underline cursor-pointer font-medium"
                        >
                          {client.name}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-sm text-[#61698A]">{client.email}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-[#CDE5FB] text-[#2E73E3] capitalize">
                          {client.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                          isActive 
                            ? 'bg-[#CDE5FB] text-[#2E73E3]' 
                            : 'bg-[#FFE5E5] text-[#E53E3E]'
                        }`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => handleStatusToggle(client._id, client.workspaceId, isActive)}
                          disabled={processingId === client._id}
                          className={`text-sm font-bold hover:underline cursor-pointer transition-opacity ${
                            processingId === client._id 
                              ? 'opacity-50 cursor-not-allowed' 
                              : ''
                          } ${isActive ? 'text-[#000000]' : 'text-[#2E73E3]'}`}
                        >
                          {processingId === client._id 
                            ? 'Processing...' 
                            : (isActive ? 'Revoke' : 'Activate')
                          }
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default User;
