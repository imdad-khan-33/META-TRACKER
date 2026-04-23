import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';
import calendarIcon from '../assets/calendericon.svg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dashboardInsightsService from '../services/dashboardInsightsService';

const PLAN_ORDER = ['starter', 'pro', 'yearly'];

const formatMoney = (value, currency = 'PKR') => {
  const amount = Number(value || 0).toLocaleString();
  return `${amount} ${String(currency || 'PKR').toUpperCase()}`;
};

const formatChange = (value) => {
  const change = Number(value || 0);
  return `${change > 0 ? '+' : ''}${change}%`;
};

const formatAxisDate = (dateKey) => {
  const date = new Date(`${dateKey}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return dateKey;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const toChartData = (salesOverTime) => {
  const dates = salesOverTime?.chart?.xAxis?.values || [];
  const revenue = salesOverTime?.chart?.series?.revenue || [];

  return dates.map((date, index) => ({
    date,
    name: formatAxisDate(date),
    value: Number(revenue[index] || 0),
  }));
};

const orderPlans = (plans = []) => {
  const planMap = new Map(plans.map((plan) => [plan.planType, plan]));

  return PLAN_ORDER.map((planType) => {
    const plan = planMap.get(planType);
    return {
      planType,
      label: plan?.label || (planType === 'yearly' ? 'Yearly' : planType.charAt(0).toUpperCase() + planType.slice(1)),
      revenue: Number(plan?.revenue || 0),
      subscriptions: Number(plan?.subscriptions || 0),
      sharePercent: Number(plan?.sharePercent || 0),
    };
  });
};

const DashboardCharts = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ((startDate && !endDate) || (!startDate && endDate)) {
      return;
    }

    let isMounted = true;

    const fetchInsights = async () => {
      try {
        setLoading(true);
        const response = await dashboardInsightsService.getRevenueInsights(startDate, endDate);

        if (!isMounted) return;

        if (response.success && response.data) {
          setInsights(response.data);
          setError(null);
        } else {
          setError(response.message || 'Failed to fetch dashboard insights');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInsights();

    return () => {
      isMounted = false;
    };
  }, [startDate, endDate]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date && endDate && date > endDate) {
      setEndDate(null);
    }
  };

  const salesOverTime = insights?.salesOverTime;
  const planPerformance = insights?.planPerformance;
  const currency = insights?.currency || 'PKR';
  const lineData = useMemo(() => toChartData(salesOverTime), [salesOverTime]);
  const planData = useMemo(() => orderPlans(planPerformance?.plans), [planPerformance]);
  const salesChange = Number(salesOverTime?.changePercent || 0);
  const planChange = Number(planPerformance?.changePercent || 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-4 md:p-6 rounded-[8px] border border-[#D9EAFD] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 md:mb-6 gap-4">
          <div className="flex-1">
            <h3 className="text-[#000000] font-bold text-[16px] md:text-[18px] mb-1">Sales Over Time</h3>
            <div className="flex flex-col gap-1">
              <span className="text-[32px] font-bold text-[#000000] leading-[40px] tracking-[0px]">
                {loading ? 'Loading...' : formatMoney(salesOverTime?.totalRevenue, currency)}
              </span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[#A9ADC1] text-[14px] md:text-[16px] font-medium">
                  {salesOverTime?.periodLabel || 'Last 30 Days'}
                </span>
                <span className={`text-[14px] md:text-[16px] font-bold ${salesChange >= 0 ? 'text-[#0AD966]' : 'text-red-500'}`}>
                  {formatChange(salesChange)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              placeholderText="Start Date"
              dateFormat="dd/MM/yyyy"
              customInput={
                <button
                  type="button"
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
                  type="button"
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

        {error ? (
          <div className="h-[200px] md:h-[250px] flex items-center justify-center text-red-500 text-sm">
            {error}
          </div>
        ) : (
          <div className="h-[200px] md:h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                <Tooltip
                  formatter={(value) => [formatMoney(value, currency), 'Revenue']}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.date || label}
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
                  interval="preserveStartEnd"
                  minTickGap={24}
                  dy={10}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-white p-4 md:p-6 rounded-[8px] border border-[#D9EAFD] shadow-sm">
        <div className="mb-4 md:mb-6">
          <h3 className="text-[#000000] font-bold text-[16px] md:text-[18px] mb-1">Plan Performance</h3>
          <div className="flex flex-col gap-1">
            <span className="text-[32px] font-bold text-[#000000] leading-[40px] tracking-[0px]">
              {loading ? 'Loading...' : formatMoney(planPerformance?.totalRevenue, currency)}
            </span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[#000000] text-[14px] md:text-[16px] font-medium">
                {planPerformance?.periodLabel || 'Last 30 Days'}
              </span>
              <span className={`text-[14px] md:text-[16px] font-bold ${planChange >= 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
                {formatChange(planChange)}
              </span>
            </div>
          </div>
        </div>

        {error ? (
          <div className="h-[220px] flex items-center justify-center text-red-500 text-sm">
            {error}
          </div>
        ) : (
          <div className="space-y-6 mt-8">
            {planData.map((item) => (
              <div key={item.planType} className="flex items-center">
                <span className="w-20 md:w-28 text-[13px] md:text-[15px] font-bold text-[#9EA1BA]">{item.label}</span>
                <div className="flex-1 flex items-center min-w-0">
                  <div className="flex-1 min-w-0">
                    <div
                      className="h-7 bg-[#C4C4C4] relative"
                      title={`${item.subscriptions} subscriptions, ${formatMoney(item.revenue, currency)}`}
                      style={{ width: `${Math.max(item.sharePercent, item.revenue > 0 ? 2 : 0)}%` }}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-[2.5px] bg-[#000000]" />
                    </div>
                  </div>
                  <span className="ml-3 w-12 text-[12px] font-semibold text-[#9EA1BA] text-right">{item.sharePercent}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCharts;
