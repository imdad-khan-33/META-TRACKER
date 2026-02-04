const StatCard = ({ title, value, change, isPositive }) => (
  <div className="bg-[#CDE5FB] p-4 md:p-5 rounded-[12px] flex flex-col gap-1 shadow-sm">
    <span className="text-[#000000] text-[12px] md:text-[14px] font-medium">{title}</span>
    <span className="text-[24px] font-bold text-[#000000] leading-[30px] tracking-[0px]">{value}</span>
    <span className={`text-[12px] md:text-[14px] font-bold ${isPositive ? 'text-[#0AD966]' : 'text-red-500'}`}>
      {change}
    </span>
  </div>
);

const StatCards = () => {
  const stats = [
    { title: 'Total Subscriptions', value: '1,234', change: '+12%', isPositive: true },
    { title: 'Customers', value: '1,024', change: '+10%', isPositive: true },
    { title: 'Revenue', value: '$123,456', change: '+15%', isPositive: true },
    { title: 'New Subscriptions', value: '123', change: '+5%', isPositive: true },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatCards;
