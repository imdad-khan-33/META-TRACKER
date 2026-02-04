const Support = () => {
  const supportStats = [
    { 
      title: 'Technical Issues', 
      count: '0', 
      subtitle: 'Active technical support requests',
      textColor: 'text-green-600'
    },
    { 
      title: 'Errors', 
      count: '0', 
      subtitle: 'System errors report',
      textColor: 'text-blue-600'
    },
    { 
      title: 'Other Inquiries', 
      count: '0', 
      subtitle: 'General feedbacks',
      textColor: 'text-purple-600'
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <h1 className="text-xl md:text-2xl lg:text-[28px] font-bold text-[#000000] mb-2">Support & Contact</h1>
      <p className="text-sm text-[#000000] mb-6">Manage your customer inquiries, feedbacks & technical issues.</p>
      
      {/* Support Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {supportStats.map((stat, index) => (
          <div 
            key={index} 
            className="p-6 rounded-lg border"
            style={{ backgroundColor: '#CDE5FB', borderColor: '#CDE5FB' }}
          >
            <h3 className="text-sm font-semibold text-[#000000] mb-2">{stat.title}</h3>
            <p className="text-4xl font-bold text-[#000000] mb-2">{stat.count}</p>
            <p className="text-[16px] font-medium leading-[24px] tracking-[0px] text-[#0AD966]">{stat.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Support;
