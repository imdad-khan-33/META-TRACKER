const StatCard = ({ title, value, change, isPositive }) => (



  <div className="bg-[#CDE5FB] p-4 md:p-5 rounded-[12px] flex flex-col gap-1 shadow-sm">
    <span className="text-[#000000] text-[12px] md:text-[14px] font-medium">{title}</span>
    <span className="text-[24px] font-bold text-[#000000] leading-[30px] tracking-[0px]">{value}</span>
    <span className={`text-[12px] md:text-[14px] font-bold ${isPositive ? 'text-[#0AD966]' : 'text-red-500'}`}>
      {change}
    </span>
  </div>
);


import { useState, useEffect } from 'react';
import statecardsService from '../services/statecardsService';

const StatCards = ({ startDate = '2026-03-18', endDate = '2026-04-19' }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [startDate, endDate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const workspaceId = user?.workspaceId || '';
      
      console.log('📊 StatCards - Fetching stats with dates:', { startDate, endDate, workspaceId });
      
      const response = await statecardsService.getStats(workspaceId, startDate, endDate);
      
      console.log('📊 StatCards - API response:', response);
      
      if (response.success && response.data?.cards) {
        const { cards, currency } = response.data;
        
        const formattedStats = [
          { 
            title: 'Total Subscriptions', 
            value: cards.totalSubscriptions.value,
            change: `${cards.totalSubscriptions.changePercent > 0 ? '+' : ''}${cards.totalSubscriptions.changePercent}%`,
            isPositive: cards.totalSubscriptions.changePercent >= 0
          },
          { 
            title: 'Customers', 
            value: cards.customers.value,
            change: `${cards.customers.changePercent > 0 ? '+' : ''}${cards.customers.changePercent}%`,
            isPositive: cards.customers.changePercent >= 0
          },
          { 
            title: 'Revenue', 
            value: `${cards.revenue.value} ${currency}`,
            change: `${cards.revenue.changePercent > 0 ? '+' : ''}${cards.revenue.changePercent}%`,
            isPositive: cards.revenue.changePercent >= 0
          },
          { 
            title: 'New Subscriptions', 
            value: cards.newSubscriptions.value,
            change: `${cards.newSubscriptions.changePercent > 0 ? '+' : ''}${cards.newSubscriptions.changePercent}%`,
            isPositive: cards.newSubscriptions.changePercent >= 0
          },
        ];
        
        setStats(formattedStats);
        setError(null);
      } else {
        console.error('📊 StatCards - Response structure issue:', response);
        setError('Failed to fetch stats');
      }
    } catch (err) {
      console.error('📊 StatCards - Error fetching stats:', err);
      setError(`Error loading statistics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatCards;
