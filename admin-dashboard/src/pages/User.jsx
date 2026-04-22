import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Select, Button } from 'antd';
import userService from '../services/userService';
import assignplanService from '../services/assignplanService';

const User = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [clientStatus, setClientStatus] = useState({});
  const [isAlignPlanModalOpen, setIsAlignPlanModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);


  
  const [selectedClientWorkspaceId, setSelectedClientWorkspaceId] = useState(null);
  const [planType, setPlanType] = useState(''); // 'starter' or 'pro'
  const [starterPlan, setStarterPlan] = useState('');
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);
  
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

const postplans = async (workspaceId) => {
    if (!planType) {
      alert('Please select a plan type');
      return;
    }

    if (planType === 'starter' && !starterPlan) {
      alert('Please select a starter plan tool');
      return;
    }

    setIsSubmittingPlan(true);
    try {
      const planData = {
        planType: planType,
        durationDays: 30,
        amount: 0,
        currency: 'USD',
        reason: 'Manual assignment by admin',
      };

      // Add activeTool for starter plans
      if (planType === 'starter') {
        planData.activeTool = starterPlan;
      }

      console.log('Submitting plan data:', planData);
      const result = await assignplanService.assignPlan(workspaceId, planData);

      if (result.success) {
        alert('Plan assigned successfully!');
        handleCloseAlignPlanModal();
      } else {
        alert('Failed to assign plan: ' + result.error);
      }
    } catch (error) {
      console.error('Error assigning plan:', error);
      alert('An error occurred while assigning the plan');
    } finally {
      setIsSubmittingPlan(false);
    }
  };

  // Handle opening the Align Plan modal
  const handleOpenAlignPlanModal = (clientId) => {
    const client = clients.find(c => c._id === clientId);
    setSelectedClientId(clientId);
    setSelectedClientWorkspaceId(client?.workspaceId);
    setPlanType('');
    setStarterPlan('');
    setIsAlignPlanModalOpen(true);
  };

  const handleAlignPlanSubmit = async () => {
    if (!planType) {
      alert('Please select a plan type');
      return;
    }

    if (planType === 'starter' && !starterPlan) {
      alert('Please select a starter plan tool');
      return;
    }

    await postplans(selectedClientWorkspaceId);
  };

  const handleCloseAlignPlanModal = () => {
    setIsAlignPlanModalOpen(false);
    setSelectedClientId(null);
    setSelectedClientWorkspaceId(null);
    setPlanType('');
    setStarterPlan('');
  };


  
  
  
   

    
  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
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

                        {/* we add the another button */}
                        <button 
                          onClick={() => handleOpenAlignPlanModal(client._id)}
                          className='text-sm font-bold hover:underline cursor-pointer transition-opacity ml-4 text-[#2E73E3]'
                        >
                          Assign Plan
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

      {/* Align Plan Modal */}
      <Modal
        title="Assign Plan"
        open={isAlignPlanModalOpen}
        onCancel={handleCloseAlignPlanModal}
        centered
        width={500}
        footer={[
          <Button key="cancel" onClick={handleCloseAlignPlanModal} disabled={isSubmittingPlan}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleAlignPlanSubmit}
            className="bg-[#2E73E3]"
            loading={isSubmittingPlan}
          >
            Submit
          </Button>,
        ]}
      >
        <div className="space-y-6">
          {/* Plan Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-[#000000] mb-2">
              Select Plan Type
            </label>
            <Select
              placeholder="Choose Starter or Pro"
              value={planType}
              onChange={setPlanType}
              className="w-full"
              options={[
                { label: 'Starter', value: 'starter' },
                { label: 'Pro', value: 'pro' },
              ]}
            />
          </div>

          {/* Starter Plan Tool Selection */}
          {planType === 'starter' && (
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Select Tracker Tool
              </label>
              <Select
                placeholder="Select Tool"
                value={starterPlan}
                onChange={setStarterPlan}
                className="w-full"
                options={[
                  { label: 'Google Tracker', value: 'google_tracker' },
                  { label: 'Meta Tracker', value: 'meta_tracker' },
                ]}
              />
              <p className="text-xs text-gray-500 mt-2">
                Note: Starter plan allows selection of one tracker tool at a time.
              </p>
            </div>
          )}

          {/* Pro Plan Info */}
          {planType === 'pro' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-[#2E73E3] mb-2">Pro Plan</p>
              <p className="text-xs text-gray-600">
                Pro plan includes access to all available tools and features. No tool limitation.
              </p>
            </div>
          )}

          {/* Plan Details */}
          {planType && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-[#000000] mb-3">Plan Details</p>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Plan Type:</span>
                  <span className="font-medium capitalize">{planType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">30 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">$0.00 USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Reason:</span>
                  <span className="font-medium">Manual assignment by admin</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default User;
