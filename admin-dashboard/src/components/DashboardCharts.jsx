import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { ChevronDown } from 'lucide-react';
import calendarIcon from '../assets/calendericon.svg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const lineData = [
  { name: 'Jan', value: 3000 },
  { name: 'Feb', value: 4500 },
  { name: 'Mar', value: 3500 },
  { name: 'Apr', value: 5000 },
  { name: 'May', value: 4000 },
  { name: 'Jun', value: 6000 },
  { name: 'Jul', value: 4800 },
];



const DashboardCharts = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Sales Over Time */}
      <div className="bg-white p-4 md:p-6 rounded-[8px] border border-[#D9EAFD] shadow-sm">
        {/* Header with Title and Date Filters */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 md:mb-6 gap-4">
          <div className="flex-1">
            <h3 className="text-[#000000] font-bold text-[16px] md:text-[18px] mb-1">Sales Over Time</h3>
            <div className="flex flex-col gap-1">
              <span className="text-[32px] font-bold text-[#000000] leading-[40px] tracking-[0px]">$123,456</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[#A9ADC1] text-[14px] md:text-[16px] font-medium">Last 30 Days</span>
                <span className="text-[#0AD966] text-[14px] md:text-[16px] font-bold">+15%</span>
              </div>
            </div>
          </div>
          
          {/* Date Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Start Date"
              dateFormat="dd/MM/yyyy"
              customInput={
                <button 
                  className="flex items-center gap-2 bg-white rounded-lg text-xs font-medium text-[#000000] hover:bg-gray-50 transition-colors duration-200"
                  style={{ padding: '8px 16px', border: '1px solid #CDE5FB' }}
                >
                  <img src={calendarIcon} alt="Calendar" className="w-3.5 h-4" />
                  {startDate ? startDate.toLocaleDateString() : 'Start Date'}
                  <ChevronDown size={14} />
                </button>
              }
            />
            
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="End Date"
              dateFormat="dd/MM/yyyy"
              minDate={startDate}
              customInput={
                <button 
                  className="flex items-center gap-2 bg-white rounded-lg text-xs font-medium text-[#000000] hover:bg-gray-50 transition-colors duration-200"
                  style={{ padding: '8px 16px', border: '1px solid #CDE5FB' }}
                >
                  <img src={calendarIcon} alt="Calendar" className="w-3.5 h-4" />
                  {endDate ? endDate.toLocaleDateString() : 'End Date'}
                  <ChevronDown size={14} />
                </button>
              }
            />
          </div>
        </div>
        <div className="h-[200px] md:h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8A9AB0" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, fill: '#8A9AB0' }}
              />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#A9ADC1', fontSize: 14, fontWeight: 500 }}
                dy={10}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plan Performance */}
      <div className="bg-white p-4 md:p-6 rounded-[8px] border border-[#D9EAFD] shadow-sm">
        <div className="mb-4 md:mb-6">
          <h3 className="text-[#000000] font-bold text-[16px] md:text-[18px] mb-1">Plan Performance</h3>
          <div className="flex flex-col gap-1">
            <span className="text-[32px] font-bold text-[#000000] leading-[40px] tracking-[0px]">$123,456</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[#000000] text-[14px] md:text-[16px] font-medium">Last 30 Days</span>
              <span className="text-[#10B981] text-[14px] md:text-[16px] font-bold">+10%</span>
            </div>
          </div>
        </div>
        <div className="space-y-6 mt-8">
          {[
            { name: 'Basic', value: 38 },
            { name: 'Pro', value: 33 },
            { name: 'Enterprise', value: 1 },
            { name: 'Premium', value: 48 },
          ].map((item, index) => (
            <div key={index} className="flex items-center">
              <span className="w-20 md:w-28 text-[13px] md:text-[15px] font-bold text-[#9EA1BA]">{item.name}</span>
              <div className="flex-1 flex items-center">
                <div 
                  className="h-7 bg-[#C4C4C4] relative" 
                  style={{ width: `${item.value}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-[2.5px] bg-[#000000]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
