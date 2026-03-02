import { useState } from 'react';
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  RotateCcw,
  DollarSign,
  ChevronDown,
  Crown,
  Package,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

/* ── Mock Data ── */
const revenueData = [
  { name: 'Jan', revenue: 12400, orders: 320 },
  { name: 'Feb', revenue: 18200, orders: 410 },
  { name: 'Mar', revenue: 15800, orders: 380 },
  { name: 'Apr', revenue: 22100, orders: 490 },
  { name: 'May', revenue: 19600, orders: 460 },
  { name: 'Jun', revenue: 25400, orders: 520 },
  { name: 'Jul', revenue: 28900, orders: 580 },
  { name: 'Aug', revenue: 24700, orders: 510 },
  { name: 'Sep', revenue: 31200, orders: 640 },
  { name: 'Oct', revenue: 27800, orders: 590 },
  { name: 'Nov', revenue: 35600, orders: 710 },
  { name: 'Dec', revenue: 42300, orders: 820 },
];

const categoryData = [
  { name: 'Electronics', value: 38, color: '#3b82f6' },
  { name: 'Clothing', value: 24, color: '#8b5cf6' },
  { name: 'Accessories', value: 18, color: '#ec4899' },
  { name: 'Home & Garden', value: 12, color: '#10b981' },
  { name: 'Sports', value: 8, color: '#f59e0b' },
];

const topProducts = [
  { name: 'Wireless Headphones Pro', units: 342, revenue: 85158, bg: 'from-blue-500 to-cyan-500' },
  { name: 'Smart Fitness Watch', units: 289, revenue: 57511, bg: 'from-violet-500 to-purple-500' },
  { name: 'Premium Leather Bag', units: 215, revenue: 19243, bg: 'from-amber-500 to-orange-500' },
  { name: 'Running Shoes Ultra', units: 198, revenue: 31482, bg: 'from-emerald-500 to-teal-500' },
  { name: 'Bluetooth Speaker Mini', units: 176, revenue: 14063, bg: 'from-pink-500 to-rose-500' },
];

const topCustomers = [
  { name: 'Robert Davis', email: 'robert.d@email.com', spent: 8920, avatar: 'RD', bg: 'from-sky-500 to-blue-500' },
  { name: 'Michael Brown', email: 'michael.b@email.com', spent: 6746, avatar: 'MB', bg: 'from-amber-500 to-orange-500' },
  { name: 'Sarah Wilson', email: 'sarah.w@email.com', spent: 4281, avatar: 'SW', bg: 'from-pink-500 to-rose-500' },
  { name: 'James Martinez', email: 'james.m@email.com', spent: 3120, avatar: 'JM', bg: 'from-blue-500 to-cyan-500' },
  { name: 'David Kim', email: 'david.k@email.com', spent: 2651, avatar: 'DK', bg: 'from-indigo-500 to-blue-500' },
];

const dateRanges = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year'];

/* ── Metric Card ── */
function MetricCard({ icon: Icon, title, value, change, iconBg, iconColor }) {
  const isPositive = change >= 0;
  return (
    <div className="glass card-hover rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={20} className={iconColor} strokeWidth={2} />
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
          }`}
        >
          {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {isPositive ? '+' : ''}{change}%
        </div>
      </div>
      <p className="text-sm font-medium text-slate-400 mb-0.5">{title}</p>
      <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
    </div>
  );
}

/* ── Custom Tooltip ── */
function CustomTooltip({ active, payload, label, chartMode }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 shadow-lg border border-slate-100">
      <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-800">
        {chartMode === 'revenue'
          ? `$${payload[0].value.toLocaleString()}`
          : `${payload[0].value.toLocaleString()} orders`}
      </p>
    </div>
  );
}

/* ── Main Component ── */
export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [chartMode, setChartMode] = useState('revenue');

  return (
    <div className="px-4 sm:px-6 mt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics & Reports</h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your store performance and growth insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range */}
          <div className="relative">
            <button
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              id="date-range-btn"
            >
              <Calendar size={16} className="text-slate-400" />
              {dateRange}
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${dateDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dateDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDateDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20">
                  {dateRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => { setDateRange(range); setDateDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        range === dateRange
                          ? 'text-primary-600 bg-primary-50 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all active:scale-[0.98]"
            id="export-report-btn"
          >
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricCard
          icon={DollarSign}
          title="Average Order Value"
          value="$68.45"
          change={4.2}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <MetricCard
          icon={ShoppingCart}
          title="Conversion Rate"
          value="3.24%"
          change={1.8}
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
        />
        <MetricCard
          icon={RotateCcw}
          title="Customer Retention"
          value="74.8%"
          change={-2.1}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart (2/3) */}
        <div className="lg:col-span-2 glass rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">Revenue Overview</h2>
              <p className="text-xs text-slate-400 mt-0.5">Monthly performance breakdown</p>
            </div>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
              <button
                onClick={() => setChartMode('revenue')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  chartMode === 'revenue'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setChartMode('orders')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  chartMode === 'orders'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Orders
              </button>
            </div>
          </div>
          <div className="px-4 pt-4 pb-2" style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartMode === 'revenue' ? '#3b82f6' : '#8b5cf6'} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartMode === 'revenue' ? '#3b82f6' : '#8b5cf6'} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  tickFormatter={(v) => chartMode === 'revenue' ? `$${v / 1000}k` : v}
                  dx={-8}
                />
                <Tooltip content={<CustomTooltip chartMode={chartMode} />} />
                <Area
                  type="monotone"
                  dataKey={chartMode}
                  stroke={chartMode === 'revenue' ? '#3b82f6' : '#8b5cf6'}
                  strokeWidth={2.5}
                  fill="url(#chartGradient)"
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Doughnut (1/3) */}
        <div className="glass rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">Sales by Category</h2>
            <p className="text-xs text-slate-400 mt-0.5">Revenue distribution</p>
          </div>
          <div className="px-4 pt-2" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    fontSize: '13px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="px-6 pb-5 space-y-2.5">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs font-medium text-slate-600">{cat.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-700">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Products */}
        <div className="glass rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">Top Selling Products</h2>
              <p className="text-xs text-slate-400 mt-0.5">Best performers this period</p>
            </div>
            <Package size={18} className="text-slate-300" />
          </div>
          <div className="divide-y divide-slate-50">
            {topProducts.map((product, idx) => (
              <div key={product.name} className="flex items-center gap-4 px-6 py-3.5 table-row-hover">
                <span className="text-xs font-bold text-slate-300 w-5 text-center">
                  {idx === 0 ? <Crown size={16} className="text-amber-400 mx-auto" /> : `#${idx + 1}`}
                </span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${product.bg} flex items-center justify-center shrink-0`}>
                  <Package size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{product.name}</p>
                  <p className="text-xs text-slate-400">{product.units} units sold</p>
                </div>
                <p className="text-sm font-bold text-slate-800">
                  ${product.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="glass rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">Top Customers</h2>
              <p className="text-xs text-slate-400 mt-0.5">Highest lifetime value</p>
            </div>
            <Crown size={18} className="text-slate-300" />
          </div>
          <div className="divide-y divide-slate-50">
            {topCustomers.map((customer, idx) => (
              <div key={customer.name} className="flex items-center gap-4 px-6 py-3.5 table-row-hover">
                <span className="text-xs font-bold text-slate-300 w-5 text-center">
                  {idx === 0 ? <Crown size={16} className="text-amber-400 mx-auto" /> : `#${idx + 1}`}
                </span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${customer.bg} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {customer.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{customer.name}</p>
                  <p className="text-xs text-slate-400 truncate">{customer.email}</p>
                </div>
                <p className="text-sm font-bold text-slate-800">
                  ${customer.spent.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
