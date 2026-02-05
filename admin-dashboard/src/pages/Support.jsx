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

      {/* Contact Submissions Table */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-[#000000] mb-4">Contact Submissions</h2>
        
        <div className="bg-white rounded-lg border border-[#D9EAFD] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: 'Admin',
                    email: 'example@gmail.com',
                    category: 'Other',
                    message: 'Test',
                    date: '04/02/26'
                  },
                  {
                    name: 'John Doe',
                    email: 'john@example.com',
                    category: 'Technical',
                    message: 'Login issue',
                    date: '03/02/26'
                  },
                  {
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    category: 'Error',
                    message: 'Payment failed',
                    date: '02/02/26'
                  }
                ].map((submission, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-[#61698A]">{submission.name}</td>
                    <td className="py-4 px-4 text-sm text-[#61698A]">{submission.email}</td>
                    <td className="py-4 px-4 text-sm text-[#61698A]">{submission.category}</td>
                    <td className="py-4 px-4 text-sm text-[#61698A]">{submission.date}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-[#CDE5FB] cursor-pointer  text-[#000000] text-xs font-medium rounded hover:bg-[#b0d5f8] transition-colors">
                          View
                        </button>
                        <button className="px-3 py-1 bg-[#FBD2CD] cursor-pointer text-[#000000] text-xs font-medium rounded hover:bg-[#ffd0d0] transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination - Uncomment when needed */}
          {/* 
          <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 gap-4">
            <div className="text-sm text-[#61698A]">
              Showing <span className="font-semibold text-[#000000]">1</span> to <span className="font-semibold text-[#000000]">3</span> of <span className="font-semibold text-[#000000]">3</span> entries
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                className="px-3 py-1.5 text-sm font-medium text-[#61698A] bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                <button className="px-3 py-1.5 text-sm font-medium text-white bg-[#2E73E3] border border-[#2E73E3] rounded hover:bg-[#2563EB] transition-colors">
                  1
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-[#61698A] bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                  2
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-[#61698A] bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                  3
                </button>
              </div>
              
              <button 
                className="px-3 py-1.5 text-sm font-medium text-[#61698A] bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
          */}
        </div>
      </div>
    </div>
  );
};

export default Support;
