import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import userService from '../services/userService';

const formatDateParam = (date) => date.toISOString().split('T')[0];

const formatDisplayDate = (dateValue) => {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toISOString().slice(0, 10);
};

const formatAxisDate = (dateKey) => {
  const date = new Date(`${dateKey}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return dateKey;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const formatMoney = (value, currency = 'USD') => {
  const amount = Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${amount} ${String(currency || 'USD').toUpperCase()}`;
};

const formatPercent = (value) => {
  const percent = Number(value || 0);
  return `${percent > 0 ? '+' : ''}${percent}%`;
};

const formatStatus = (status = '') => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'completed') return 'Success';
  if (normalized === 'pending') return 'Pending';
  if (normalized === 'failed') return 'Failed';
  if (normalized === 'cancelled') return 'Cancelled';
  return status || 'Unknown';
};

const statusClassName = (status = '') => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'completed') return 'bg-[#088740] text-[#FFFFFF]';
  if (normalized === 'pending') return 'bg-[#8CB3DA] text-[#FFFFFF]';
  return 'bg-[#E83D08] text-[#FFFFFF]';
};

const formatPlan = (plan) => {
  const normalized = String(plan || 'none').toLowerCase();
  if (normalized === 'starter') return 'Starter';
  if (normalized === 'pro') return 'Pro';
  if (normalized === 'yearly') return 'Yearly';
  return 'No Plan';
};

const formatTool = (tool) => {
  const normalized = String(tool || '').toLowerCase();
  if (normalized === 'google_tracker') return 'Google Tracker';
  if (normalized === 'meta_tracker') return 'Meta Tracker';
  if (normalized === 'both') return 'Google + Meta';
  return 'N/A';
};

const subscriptionStatusClassName = (status = '', expiresAt = null, planType = '') => {
  const normalized = String(status || '').toLowerCase();
  const plan = String(planType || 'none').toLowerCase();
  const expired = expiresAt ? new Date(expiresAt).getTime() < Date.now() : false;
  if (normalized === 'active' && plan !== 'none' && !expired) return 'bg-[#DCFCE7] text-[#088740]';
  if (expired) return 'bg-[#FFE5E5] text-[#E53E3E]';
  return 'bg-gray-100 text-[#61698A]';
};

const toSpendChartData = (spendOverview) => {
  const dates = spendOverview?.data?.chart?.xAxis?.values || [];
  const totalSeries = spendOverview?.data?.chart?.series?.totalSpend || [];

  return dates.map((date, index) => ({
    date,
    name: formatAxisDate(date),
    value: Number(totalSeries[index] || 0),
  }));
};

const UserDetails = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [spendOverview, setSpendOverview] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [spendLoading, setSpendLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUserDetails = async () => {
      try {
        setDetailsLoading(true);
        const response = await userService.getPlatformClientDetails(userId);

        if (!isMounted) return;

        if (response.success && response.data) {
          setDetails(response.data);
          setError(null);
        } else {
          setError(response.message || 'Failed to load user details');
        }
      } finally {
        if (isMounted) {
          setDetailsLoading(false);
        }
      }
    };

    if (userId) {
      fetchUserDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [userId]);

  useEffect(() => {
    let isMounted = true;
    const workspaceId = details?.workspace?.id;

    const fetchSpendData = async () => {
      try {
        setSpendLoading(true);

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000));

        const response = await userService.getSpendOverview(
          workspaceId,
          formatDateParam(startDate),
          formatDateParam(endDate),
          'all'
        );

        if (!isMounted) return;

        if (response.success) {
          setSpendOverview(response);
        } else {
          setSpendOverview(null);
        }
      } finally {
        if (isMounted) {
          setSpendLoading(false);
        }
      }
    };

    if (workspaceId) {
      fetchSpendData();
    }

    return () => {
      isMounted = false;
    };
  }, [details?.workspace?.id]);

  const transactionSummary = details?.transactionSummary || {};
  const transactions = details?.transactions || [];
  const spendCurrency = spendOverview?.data?.cards?.currency || 'USD';
  const chartData = useMemo(() => toSpendChartData(spendOverview), [spendOverview]);

  const totalAdSpend = spendOverview?.data?.cards?.totalAdSpend || 0;
  const googleAdsSpend = spendOverview?.data?.cards?.googleAdsSpend || 0;
  const metaAdsSpend = spendOverview?.data?.cards?.metaAdsSpend || 0;
  const overviewAmount = spendOverview?.data?.overview?.totalSpend || 0;
  const percentageChange = spendOverview?.data?.overview?.changePercent || 0;
  const userName = details?.user?.name || 'User';
  const workspace = details?.workspace || {};
  const subscriptionStatus = workspace.subscriptionStatus || 'none';
  const planType = workspace.planType || 'none';
  const planStatusLabel = subscriptionStatusClassName(subscriptionStatus, workspace.subscriptionExpiresAt, planType).includes('text-[#088740]')
    ? 'Active'
    : (workspace.subscriptionExpiresAt && new Date(workspace.subscriptionExpiresAt).getTime() < Date.now() ? 'Expired' : 'Inactive');

  if (detailsLoading) {
    return <div className="max-w-6xl mx-auto py-8 text-center">Loading user details...</div>;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/user')}
          className="mb-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-[#000000]" />
        </button>
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/user')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-[#000000]" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl lg:text-[28px] font-bold text-[#000000]">User Details</h1>
          <p className="text-sm text-[#61698A]">{userName} {details?.user?.email ? `- ${details.user.email}` : ''}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#D9EAFD] shadow-sm p-5 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-sm text-[#61698A] mb-1">Current Subscription</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold text-[#0D141C]">{formatPlan(planType)}</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold ${subscriptionStatusClassName(subscriptionStatus, workspace.subscriptionExpiresAt, planType)}`}>
                {planStatusLabel}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full lg:w-auto">
            <div>
              <p className="text-xs text-[#61698A]">Active Tool</p>
              <p className="text-sm font-semibold text-[#0D141C]">{formatTool(workspace.activeTool)}</p>
            </div>
            <div>
              <p className="text-xs text-[#61698A]">Start Date</p>
              <p className="text-sm font-semibold text-[#0D141C]">{formatDisplayDate(workspace.subscriptionStartedAt || workspace.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-[#61698A]">End Date</p>
              <p className="text-sm font-semibold text-[#0D141C]">{formatDisplayDate(workspace.subscriptionExpiresAt || workspace.trialEndsAt)}</p>
            </div>
            <div>
              <p className="text-xs text-[#61698A]">Workspace</p>
              <p className="text-sm font-semibold text-[#0D141C]">{workspace.status === false ? 'Inactive' : 'Active'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-[#CDE5FB] p-5 rounded-lg border border-[#D9EAFD]">
          <h3 className="font-medium text-[#0D141C] mb-2 text-[15px]">Total Ad Spend</h3>
          <p className="font-bold text-[#000000] text-[24px] leading-[30px]">
            {spendLoading ? 'Loading...' : formatMoney(totalAdSpend, spendCurrency)}
          </p>
        </div>
        <div className="bg-[#CDE5FB] p-5 rounded-lg border border-[#D9EAFD]">
          <h3 className="font-medium text-[#0D141C] mb-2 text-[15px]">Google Ads Spend</h3>
          <p className="font-bold text-[#000000] text-[24px] leading-[30px]">
            {spendLoading ? 'Loading...' : formatMoney(googleAdsSpend, spendCurrency)}
          </p>
        </div>
        <div className="bg-[#CDE5FB] p-5 rounded-lg border border-[#D9EAFD]">
          <h3 className="font-medium text-[#0D141C] mb-2 text-[15px]">Meta Ads Spend</h3>
          <p className="font-bold text-[#000000] text-[24px] leading-[30px]">
            {spendLoading ? 'Loading...' : formatMoney(metaAdsSpend, spendCurrency)}
          </p>
        </div>
        <div className="bg-[#CDE5FB] p-5 rounded-lg border border-[#D9EAFD]">
          <h3 className="font-medium text-[#0D141C] mb-2 text-[15px]">Transactions</h3>
          <p className="font-bold text-[#000000] text-[24px] leading-[30px]">
            {transactionSummary.totalTransactions || 0}
          </p>
        </div>
        <div className="bg-[#CDE5FB] p-5 rounded-lg border border-[#D9EAFD]">
          <h3 className="font-medium text-[#0D141C] mb-2 text-[15px]">Paid Amount</h3>
          <p className="font-bold text-[#000000] text-[24px] leading-[30px]">
            {formatMoney(transactionSummary.totalAmountUsd, 'USD')}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-[#D9EAFD] shadow-sm mb-8">
        <div className="mb-4">
          <h3 className="font-medium text-[#0D141C] text-[16px] leading-[24px]">Spend Overview</h3>
          <p className="font-bold text-[#0D141C] text-[32px] leading-[40px]">
            {spendLoading ? 'Loading...' : formatMoney(overviewAmount, spendCurrency)}
          </p>
          <p className="text-sm text-[#61698A] mt-1">
            Last 30 Days{' '}
            <span className={`font-bold ${Number(percentageChange) >= 0 ? 'text-[#0AD966]' : 'text-red-500'}`}>
              {spendLoading ? 'Loading...' : formatPercent(percentageChange)}
            </span>
          </p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
              <Tooltip
                formatter={(value) => [formatMoney(value, spendCurrency), 'Spend']}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.date || label}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4D7399"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#4D7399' }}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#A9ADC1', fontSize: 14, fontWeight: 500 }}
                interval="preserveStartEnd"
                minTickGap={24}
                dy={10}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-4">
        <h2 className="text-xl font-bold text-[#000000]">Transaction History</h2>
        <p className="text-sm text-[#61698A]">
          {transactionSummary.completedTransactions || 0} completed of {transactionSummary.totalTransactions || 0} total
        </p>
      </div>

      <div className="bg-white rounded-lg border border-[#CFDBE8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-[#F7FAFC]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Plan</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Gateway</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 px-4 text-center text-sm text-[#61698A]">
                    No transactions found for this user.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-[#CFDBE8] bg-[#F7FAFC] hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-[#4D7399]">{formatDisplayDate(transaction.date)}</td>
                    <td className="py-4 px-4 text-sm text-[#0D141C]">{transaction.planLabel || '-'}</td>
                    <td className="py-4 px-4 text-sm text-[#0D141C]">{transaction.paymentGatewayLabel || '-'}</td>
                    <td className="py-4 px-4 text-sm text-[#4D7399]">{formatMoney(transaction.amountUsd, 'USD')}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center justify-center px-4 h-8 rounded-lg text-xs font-bold ${statusClassName(transaction.status)}`}>
                        {formatStatus(transaction.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
