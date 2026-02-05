import { useState } from 'react';
import StatCards from '../components/StatCards';
import DashboardCharts from '../components/DashboardCharts';
import UserTable from '../components/UserTable';
import { ChevronDown } from 'lucide-react';
import calendarIcon from '../assets/calendericon.svg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Dashboard = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="max-w-[1400px] mx-auto">
      <h1 className="text-xl md:text-2xl lg:text-[28px] font-bold text-[#000000] mb-4">Dashboard</h1>
      
      {/* Date Filter Buttons */}
      <div className="flex flex-wrap gap-[10px] mb-6 md:mb-8">
        <div className="relative">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Start Date"
            dateFormat="dd/MM/yyyy"
            customInput={
              <button 
                className="flex items-center justify-center gap-[10px] bg-white rounded-[10px] text-sm font-medium text-[#000000] hover:bg-gray-50 transition-colors duration-200 w-full sm:w-[234px] h-[40px] border border-[#CDE5FB]"
              >
                <img src={calendarIcon} alt="Calendar" className="w-[15px] h-[17px]" />
                {startDate ? startDate.toLocaleDateString() : 'Start Date'}
                <ChevronDown size={16} />
              </button>
            }
          />
        </div>
        
        <div className="relative">
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="End Date"
            dateFormat="dd/MM/yyyy"
            minDate={startDate}
            customInput={
              <button 
                className="flex items-center justify-center gap-[10px] bg-white rounded-[10px] text-sm font-medium text-[#000000] hover:bg-gray-50 transition-colors duration-200 w-full sm:w-[234px] h-[40px] border border-[#CDE5FB]"
              >
                <img src={calendarIcon} alt="Calendar" className="w-[15px] h-[17px]" />
                {endDate ? endDate.toLocaleDateString() : 'End Date'}
                <ChevronDown size={16} />
              </button>
            }
          />
        </div>
      </div>
      
      <StatCards />
      <DashboardCharts />
      <UserTable />
    </div>
  );
};

export default Dashboard;
