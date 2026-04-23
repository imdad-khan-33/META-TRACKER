import { BadgePlus, LogIn, Search, ShieldOff, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Select, Button } from 'antd';
import userService from '../services/userService';
import assignplanService from '../services/assignplanService';

const formatPlan = (plan) => {
  const normalized = String(plan || 'none').toLowerCase();
  if (normalized === 'pro') return 'Pro';
  if (normalized === 'starter') return 'Starter';
  if (normalized === 'yearly') return 'Yearly';
  return 'No Plan';
};

const planClassName = (plan) => {
  const normalized = String(plan || 'none').toLowerCase();
  if (normalized === 'none' || !normalized) return 'bg-gray-100 text-[#61698A]';
  return 'bg-[#DCFCE7] text-[#088740]';
};

const formatTool = (tool) => {
  const normalized = String(tool || '').toLowerCase();
  if (normalized === 'google_tracker') return 'Google';
  if (normalized === 'meta_tracker') return 'Meta';
  if (normalized === 'both') return 'Google + Meta';
  return 'N/A';
};

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const isPlanActive = (client) => {
  const workspace = client.workspace || {};
  const status = String(workspace.subscriptionStatus || '').toLowerCase();
  const plan = String(workspace.planType || client.planType || client.plan || 'none').toLowerCase();
  const expiresAt = workspace.endDate || workspace.subscriptionExpiresAt;
  const isExpired = expiresAt ? new Date(expiresAt).getTime() < Date.now() : false;

  return status === 'active' && plan !== 'none' && !isExpired;
};

const User = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [impersonatingId, setImpersonatingId] = useState(null);
  const [clientStatus, setClientStatus] = useState({});
  const [isAlignPlanModalOpen, setIsAlignPlanModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);


  
  const [selectedClientWorkspaceId, setSelectedClientWorkspaceId] = useState(null);
  const [planType, setPlanType] = useState('');
  const [starterPlan, setStarterPlan] = useState('');
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);
  const clientDashboardUrl =
    import.meta.env.VITE_CLIENT_DASHBOARD_URL || 'http://localhost:5173';

  const handlePlanTypeChange = (value) => {
    setPlanType(value);
    if (value !== 'starter') {
      setStarterPlan('');
    }
  };
  
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
            statusMap[client._id] = client.workspace?.status !== false; // true if active, false if deactivated
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

  const handleImpersonate = async (client) => {
    const confirmed = window.confirm(`Login as ${client.name || client.email}? You will be redirected to the client dashboard.`);
    if (!confirmed) return;

    setImpersonatingId(client._id);
    try {
      const result = await userService.impersonateUser(client._id);

      if (!result.success || !result.token || !result.user) {
        alert(result.message || 'Failed to impersonate user');
        return;
      }

      const impersonatedUser = {
        ...result.user,
        impersonated: true,
        superAdminReturnUrl: window.location.origin,
      };

      const target = new URL('/impersonate', clientDashboardUrl);
      target.searchParams.set('token', result.token);
      target.searchParams.set('user', JSON.stringify(impersonatedUser));

      window.location.href = target.toString();
    } catch (err) {
      console.error('Impersonation error:', err);
      alert('An error occurred while impersonating the user');
    } finally {
      setImpersonatingId(null);
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
        durationDays: planType === 'yearly' ? 365 : 30,
        amount: 0,
        currency: 'USD',
        reason: 'Manual assignment by admin',
      };

      // Add activeTool for starter plans
      if (planType === 'starter') {
        planData.activeTool = starterPlan;
      } else {
        planData.activeTool = 'both';
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
    <div className="w-full max-w-none mx-auto">
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
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000] w-[15%]">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000] w-[24%]">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000] w-[9%]">Plan</th>
            
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000] w-[11%]">Expires</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000] w-[8%]">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000] w-[33%]">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-sm text-[#61698A]">
                    Loading clients...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-sm text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-sm text-[#61698A]">
                    {searchQuery ? 'No matching clients found.' : 'No clients found.'}
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const isActive = clientStatus[client._id] !== false;
                  const workspace = client.workspace || {};
                  const planType = workspace.planType || client.planType || client.plan;
                  return (
                    <tr key={client._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm align-middle">
                        <button 
                          onClick={() => navigate(`/user-details/${client._id}`)}
                          className="text-[#2E73E3] hover:underline cursor-pointer font-medium truncate block max-w-full"
                        >
                          {client.name}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#61698A] align-middle truncate">{client.email}</td>
                      <td className="py-3 px-4 align-middle">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${planClassName(planType)}`}>
                          {formatPlan(planType)}
                        </span>
                      </td>
                      
                      <td className="py-3 px-4 text-sm text-[#61698A] align-middle">{formatDate(workspace.endDate)}</td>
                      <td className="py-3 px-4 align-middle">
                        <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                          isActive 
                            ? 'bg-[#CDE5FB] text-[#2E73E3]' 
                            : 'bg-[#FFE5E5] text-[#E53E3E]'
                        }`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 align-middle">
                        <div className="flex flex-nowrap items-center gap-2">
                        <button 
                          onClick={() => handleStatusToggle(client._id, client.workspaceId, isActive)}
                          disabled={processingId === client._id}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
                            processingId === client._id 
                              ? 'opacity-50 cursor-not-allowed' 
                              : ''
                          } ${isActive ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100' : 'border-blue-200 bg-blue-50 text-[#2E73E3] hover:bg-blue-100'}`}
                        >
                          {isActive ? <ShieldOff size={14} /> : <UserCheck size={14} />}
                          {processingId === client._id 
                            ? 'Processing...' 
                            : (isActive ? 'Revoke' : 'Activate')
                          }
                        </button>

                        {/* we add the another button */}
                        <button 
                          onClick={() => handleOpenAlignPlanModal(client._id)}
                          className='inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-xs font-bold text-[#2E73E3] cursor-pointer transition-all hover:bg-blue-50 whitespace-nowrap'
                        >
                          <BadgePlus size={14} />
                          Assign Plan
                        </button>

                        <button
                          onClick={() => handleImpersonate(client)}
                          disabled={impersonatingId === client._id}
                          className={`inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs font-bold text-[#088740] cursor-pointer transition-all hover:bg-green-100 whitespace-nowrap ${
                            impersonatingId === client._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <LogIn size={14} />
                          {impersonatingId === client._id ? 'Logging in...' : 'Impersonate'}
                        </button>
                        </div>
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
              placeholder="Choose a plan"
              value={planType}
              onChange={handlePlanTypeChange}
              className="w-full"
              options={[
                { label: 'Starter', value: 'starter' },
                { label: 'Pro', value: 'pro' },
                { label: 'Yearly', value: 'yearly' },
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

          {/* Full Access Plan Info */}
          {(planType === 'pro' || planType === 'yearly') && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-[#2E73E3] mb-2">
                {planType === 'yearly' ? 'Yearly Plan' : 'Pro Plan'}
              </p>
              <p className="text-xs text-gray-600">
                This plan includes access to all available tools and features. No tool limitation.
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
                  <span className="font-medium">{planType === 'yearly' ? '365 days' : '30 days'}</span>
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
