import StatCards from '../components/StatCards';
import DashboardCharts from '../components/DashboardCharts';
import UserTable from '../components/UserTable';
import { ChevronDown } from 'lucide-react';
import calendarIcon from '../assets/calendericon.svg';

const Dashboard = () => {
  return (
    <div className="max-w-[1400px] mx-auto">
      <h1 className="text-xl md:text-2xl lg:text-[28px] font-bold text-[#000000] mb-4">Dashboard</h1>
      
      {/* Date Filter Buttons */}
      <div className="flex flex-wrap gap-[10px] mb-6 md:mb-8">
        <button 
          className="flex items-center justify-center gap-[10px] bg-white rounded-[10px] text-sm font-medium text-[#000000] hover:bg-gray-50 transition-colors duration-200 w-full sm:w-[234px] h-[40px] border border-[#CDE5FB]"
        >
          <img src={calendarIcon} alt="Calendar" className="w-[15px] h-[17px]" />
          Start Date
          <ChevronDown size={16} />
        </button>
        
        <button 
          className="flex items-center justify-center gap-[10px] bg-white rounded-[10px] text-sm font-medium text-[#000000] hover:bg-gray-50 transition-colors duration-200 w-full sm:w-[234px] h-[40px] border border-[#CDE5FB]"
        >
          <img src={calendarIcon} alt="Calendar" className="w-[15px] h-[17px]" />
          End Date
          <ChevronDown size={16} />
        </button>
      </div>
      
      <StatCards />
      <DashboardCharts />
      <UserTable />
    </div>
  );
};

export default Dashboard;
