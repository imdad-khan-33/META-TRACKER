import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

const Dashboard = () => {
  const stats = [
    { title: 'Total Visits', value: '12,345', change: '+12%', positive: true },
    { title: 'Total Clicks', value: '8,765', change: '+8%', positive: true },
    { title: 'Subscriptions', value: '3,456', change: '+12%', positive: true },
    { title: 'Unsubscriptions', value: '1,234', change: '-3%', positive: false },
  ]

  const projects = [
    { id: 1, name: 'Project Alpha', visits: 87, clicks: 25, client: 'Client A', subscriptions: 'Subscribers', unsubscriptions: 'Unsubscribers', platform: 'Google Ads', status: 'Active' },
    { id: 2, name: 'Project Alpha', visits: 87, clicks: 25, client: 'Client A', subscriptions: 'Subscribers', unsubscriptions: 'Unsubscribers', platform: 'Google Ads', status: 'Active' },
    { id: 3, name: 'Project Alpha', visits: 87, clicks: 25, client: 'Client A', subscriptions: 'Subscribers', unsubscriptions: 'Unsubscribers', platform: 'Google Ads', status: 'Inactive' },
    { id: 4, name: 'Project Alpha', visits: 87, clicks: 25, client: 'Client A', subscriptions: 'Subscribers', unsubscriptions: 'Unsubscribers', platform: 'Google Ads', status: 'Active' },
    { id: 5, name: 'Project Alpha', visits: 87, clicks: 25, client: 'Client A', subscriptions: 'Subscribers', unsubscriptions: 'Unsubscribers', platform: 'Google Ads', status: 'Active' },
    { id: 6, name: 'Project Alpha', visits: 87, clicks: 25, client: 'Client A', subscriptions: 'Subscribers', unsubscriptions: 'Unsubscribers', platform: 'Google Ads', status: 'Active' },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <div className="flex pt-[65px]">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
        {/* Page Header with Title and Date Filters */}
        <div className="flex items-center justify-between mb-6 pt-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              📅 Start Date ▼
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              📅 End Date ▼
            </button>
          </div>
        </div>

        {/* Stats Cards Container with Blue Border */}
        <div className="border-2 border-blue-400 rounded-lg mb-8" style={{ backgroundColor: '#E3F2FD' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg"
              >
                <h3 className="text-sm text-gray-600 mb-2">{stat.title}</h3>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <span
                    className={`text-sm font-medium ${
                      stat.positive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Google Ads vs Meta Ads
              </h3>
              <p className="text-3xl font-bold text-gray-900">+15%</p>
              <p className="text-sm text-gray-600">Last 30 Days • +15%</p>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                📅 Start Date ▼
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                📅 End Date ▼
              </button>
            </div>
          </div>
          {/* Chart */}
          <div className="h-64 flex items-end justify-center">
            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              <path
                d="M 0 100 Q 50 60, 100 80 Q 150 100, 200 70 Q 250 90, 300 100 Q 350 120, 400 60 Q 450 80, 500 90 Q 550 70, 600 100"
                fill="none"
                stroke="#5B8DEE"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Projects</h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div>
              <table className="w-full">
                <thead className="bg-white border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Visits</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Clicks</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscribers</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Unsubscribers</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Platform</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.visits}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.clicks}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{project.client}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.subscriptions}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.unsubscriptions}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{project.platform}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          project.status === 'Active' 
                            ? 'bg-gray-100 text-gray-700' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
