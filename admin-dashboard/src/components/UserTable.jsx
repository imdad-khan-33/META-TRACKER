import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import userService from '../services/userService';

const UserTable = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [clientStatus, setClientStatus] = useState({});

  // Fetch users from API
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const result = await userService.getAllClients();
        if (result.success) {
          // Limit to first 10 for dashboard preview
          const limitedClients = result.clients.slice(0, 10);
          setClients(limitedClients);
          
          // Initialize status map
          const statusMap = {};
          limitedClients.forEach((client) => {
            statusMap[client._id] = client.status !== false;
          });
          setClientStatus(statusMap);
        }
      } catch (err) {
        console.error('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleStatusToggle = async (clientId, workspaceId, currentStatus) => {
    setProcessingId(clientId);
    try {
      const newStatus = !currentStatus;
      // Use toggleWorkspaceStatus with workspaceId
      const response = await userService.toggleWorkspaceStatus(workspaceId, newStatus);
      
      if (response.success) {
        setClientStatus((prevStatus) => ({
          ...prevStatus,
          [clientId]: newStatus,
        }));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setProcessingId(null);
    }
  };

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
            {loading ? (
              <tr>
                <td colSpan="6" className="px-3 md:px-6 py-8 text-center text-sm text-[#61698A]">
                  Loading...
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-3 md:px-6 py-8 text-center text-sm text-[#61698A]">
                  No clients found
                </td>
              </tr>
            ) : (
              clients.map((client) => {
                const isActive = clientStatus[client._id] !== false;
                return (
                  <tr key={client._id} className="hover:bg-gray-50 transition-colors text-[#000000] text-[12px] md:text-[14px]">
                    <td className="px-3 md:px-4 py-3 md:py-4">{client.name}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4">{client.plan || 'N/A'}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4">{client.startDate || 'N/A'}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4">{client.endDate || 'N/A'}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className={`px-2 md:px-4 py-1 rounded-[6px] text-[10px] md:text-[12px] font-bold ${
                        isActive 
                          ? 'bg-[#CDE5FB] text-[#3B82F6]' 
                          : 'bg-[#FFE5E5] text-[#E53E3E]'
                      }`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <button 
                        onClick={() => handleStatusToggle(client._id, client.workspaceId, isActive)}
                        disabled={processingId === client._id}
                        className={`font-bold cursor-pointer hover:underline text-[10px] md:text-[12px] transition-opacity ${
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
  );
};

export default UserTable;
