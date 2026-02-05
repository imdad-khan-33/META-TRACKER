import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ad-spends');

  // Sample spend data for chart
  const spendData = [
    { month: 'Jan', value: 8000 },
    { month: 'Feb', value: 10000 },
    { month: 'Mar', value: 7500 },
    { month: 'Apr', value: 9000 },
    { month: 'May', value: 11000 },
    { month: 'Jun', value: 13000 },
    { month: 'Jul', value: 12000 },
  ];

  // Sample transaction data
  const transactions = [
    { date: '2024-07-15', platform: 'Google Ads', amount: '$500', status: 'Success' },
    { date: '2024-07-10', platform: 'Meta Ads', amount: '$300', status: 'Success' },
    { date: '2024-07-05', platform: 'Google Ads', amount: '$200', status: 'Pending' },
    { date: '2024-06-30', platform: 'Meta Ads', amount: '$150', status: 'Failed' },
    { date: '2024-06-25', platform: 'Google Ads', amount: '$400', status: 'Success' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/user')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-[#000000]" />
        </button>
        <h1 className="text-xl md:text-2xl lg:text-[28px] font-bold text-[#000000]">User Details</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('ad-spends')}
          className={`text-sm font-medium transition-colors ${
            activeTab === 'ad-spends'
              ? 'bg-white text-[#2E4258] border-[#CDE5FB]'
              : 'bg-transparent text-[#2E4258] border-[#CDE5FB] hover:border-[#b0d5f8]'
          }`}
          style={{
            paddingTop: '10px',
            paddingBottom: '10px',
            paddingLeft: '56px',
            paddingRight: '56px',
            borderRadius: '10px',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          ad spends
        </button>
        <button
          onClick={() => setActiveTab('deducted-charges')}
          className={`text-sm font-medium transition-colors ${
            activeTab === 'deducted-charges'
              ? 'bg-white text-[#2E4258] border-[#CDE5FB]'
              : 'bg-transparent text-[#2E4258] border-[#CDE5FB] hover:border-[#b0d5f8]'
          }`}
          style={{
            paddingTop: '10px',
            paddingBottom: '10px',
            paddingLeft: '56px',
            paddingRight: '56px',
            borderRadius: '10px',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          deducted charges
        </button>
      </div>

      {/* Spend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#CDE5FB] p-6 rounded-lg border border-[#D9EAFD]">
          <h3 className="font-medium text-[#0D141C] mb-2" style={{ fontFamily: 'Inter', fontSize: '16px', lineHeight: '24px', letterSpacing: '0px' }}>Total Ad Spend</h3>
          <p className="font-bold text-[#000000]" style={{ fontFamily: 'Inter', fontSize: '24px', lineHeight: '30px', letterSpacing: '0px' }}>0</p>
        </div>
        <div className="bg-[#CDE5FB] p-6 rounded-lg border border-[#D9EAFD]">
          <h3 className="font-medium text-[#0D141C] mb-2" style={{ fontFamily: 'Inter', fontSize: '16px', lineHeight: '24px', letterSpacing: '0px' }}>Google Ads Spend</h3>
          <p className="font-bold text-[#000000]" style={{ fontFamily: 'Inter', fontSize: '24px', lineHeight: '30px', letterSpacing: '0px' }}>0</p>
        </div>
        <div className="bg-[#CDE5FB] p-6 rounded-lg border border-[#D9EAFD]">
          <h3 className="font-medium text-[#0D141C] mb-2" style={{ fontFamily: 'Inter', fontSize: '16px', lineHeight: '24px', letterSpacing: '0px' }}>Meta Ads Spend</h3>
          <p className="font-bold text-[#000000]" style={{ fontFamily: 'Inter', fontSize: '24px', lineHeight: '30px', letterSpacing: '0px' }}>0</p>
        </div>
      </div>

      {/* Spend Overview Chart */}
      <div className="bg-white p-6 rounded-lg border border-[#D9EAFD] shadow-sm mb-8">
        <div className="mb-4">
          <h3 className="font-medium text-[#0D141C]" style={{ fontFamily: 'Inter', fontSize: '16px', lineHeight: '24px', letterSpacing: '0px' }}>Spend Overview</h3>
          <p className="font-bold text-[#0D141C]" style={{ fontFamily: 'Inter', fontSize: '32px', lineHeight: '40px', letterSpacing: '0px' }}>$12,500</p>
          <p className="text-sm text-[#61698A] mt-1">Last 30 Days <span className="text-[#0AD966] font-bold">+15%</span></p>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spendData} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
              <Tooltip 
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
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#A9ADC1', fontSize: 14, fontWeight: 500 }}
                dy={10}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction History */}
      <h2 className="text-xl font-bold text-[#000000] mb-4">Transaction History</h2>
      
      <div className="bg-white rounded-lg border border-[#CFDBE8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-[#CFDBE8]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Platform</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-b border-[#CFDBE8] bg-[#F7FAFC] hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-[#4D7399]">{transaction.date}</td>
                  <td className="py-4 px-4 text-sm text-[#0D141C]">{transaction.platform}</td>
                  <td className="py-4 px-4 text-sm text-[#4D7399]">{transaction.amount}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center justify-center px-4 h-8 w-[145px] rounded-lg text-xs font-bold ${
                      transaction.status === 'Success' ? 'bg-[#088740] text-[#FFFFFF] cursor-pointer' :
                      transaction.status === 'Pending' ? 'bg-[#8CB3DA] text-[#FFFFFF] cursor-pointer' :
                      'bg-[#E83D08] text-[#FFFFFF] cursor-pointer'
                    }`}>
                      {transaction.status}
                    </span>
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

export default UserDetails;
