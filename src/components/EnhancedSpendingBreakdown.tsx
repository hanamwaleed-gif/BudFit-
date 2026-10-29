import React, { useState, useMemo } from 'react';
import { 
  PieChart as PieChartIcon, 
  TrendingUp, 
  AlertCircle, 
  Layers, 
  BarChart2, 
  Calendar,
  Filter
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction, Budget } from '../types';
import { CATEGORY_GROUPS, DEFAULT_CATEGORY_COLORS } from '../data/categoryData';

interface EnhancedSpendingBreakdownProps {
  transactions: Transaction[];
  budget: Budget;
  primaryCurrency: string;
}

export const EnhancedSpendingBreakdown: React.FC<EnhancedSpendingBreakdownProps> = ({
  transactions,
  budget,
  primaryCurrency
}) => {
  const [timeRange, setTimeRange] = useState<'this_month' | 'last_30_days' | 'all'>('this_month');

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    if (timeRange === 'this_month') {
      const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      return transactions.filter(t => t.date && t.date.startsWith(prefix) && t.type === 'expense');
    }
    if (timeRange === 'last_30_days') {
      const past30 = new Date();
      past30.setDate(now.getDate() - 30);
      return transactions.filter(t => {
        if (!t.date || t.type !== 'expense') return false;
        return new Date(t.date) >= past30;
      });
    }
    return transactions.filter(t => t.type === 'expense');
  }, [transactions, timeRange]);

  // Aggregate by category
  const categoryData = useMemo(() => {
    const catMap: Record<string, number> = {};
    filteredTransactions.forEach(t => {
      const cat = t.category || 'other';
      catMap[cat] = (catMap[cat] || 0) + t.amount;
    });

    const colors = ['#2B4F60', '#845460', '#D98B6F', '#4F8683', '#8FA0A2', '#6A414B', '#1B333F'];

    return Object.entries(catMap)
      .map(([name, value], idx) => ({
        name,
        value,
        color: DEFAULT_CATEGORY_COLORS[name] || colors[idx % colors.length]
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const totalExpenseSum = categoryData.reduce((sum, c) => sum + c.value, 0);

  // Time trend data for Area Chart
  const trendData = useMemo(() => {
    const dateMap: Record<string, number> = {};
    filteredTransactions.forEach(t => {
      if (!t.date) return;
      const dateKey = t.date.split('T')[0];
      dateMap[dateKey] = (dateMap[dateKey] || 0) + t.amount;
    });

    return Object.entries(dateMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, amount]) => ({
        date: date.substring(5), // MM-DD
        amount
      }));
  }, [filteredTransactions]);

  // Category limits checks
  const categoryLimits = budget?.categoryLimits || {
    groceries: 8000,
    utilities: 4000,
    dining: 6000,
    transport: 4000,
    subscriptions: 3500
  };

  return (
    <div className="space-y-6">
      {/* Header & Time Filters */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-medium text-[#1B333F] flex items-center space-x-2">
            <PieChartIcon className="w-6 h-6 text-[#845460]" />
            <span>Spending Analytics & Distribution</span>
          </h2>
          <p className="text-xs text-[#5B6E75] font-sans">
            Total Expense in period: <strong className="text-[#2B4F60] font-mono">{totalExpenseSum.toLocaleString()} {primaryCurrency}</strong>
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center space-x-2 bg-[#FAF6F2] p-1.5 rounded-xl border border-[rgba(43,79,96,0.12)] text-xs">
          <button
            onClick={() => setTimeRange('this_month')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              timeRange === 'this_month' ? 'bg-[#2B4F60] text-white shadow-xs' : 'text-[#5B6E75] hover:text-[#1B333F]'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeRange('last_30_days')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              timeRange === 'last_30_days' ? 'bg-[#2B4F60] text-white shadow-xs' : 'text-[#5B6E75] hover:text-[#1B333F]'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              timeRange === 'all' ? 'bg-[#2B4F60] text-white shadow-xs' : 'text-[#5B6E75] hover:text-[#1B333F]'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Main Grid: Pie Chart + Area Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Distribution Chart */}
        <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] space-y-4">
          <h3 className="text-base font-serif font-medium text-[#1B333F]">Category Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const pct = totalExpenseSum > 0 ? Math.round((data.value / totalExpenseSum) * 100) : 0;
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-xl border border-[rgba(43,79,96,0.15)] text-xs text-[#22323A]">
                          <div className="font-semibold capitalize text-[#1B333F]">{data.name}</div>
                          <div className="text-sm font-bold text-[#2B4F60] font-mono mt-1">
                            {data.value.toLocaleString()} {primaryCurrency} ({pct}%)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Chips List */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[rgba(43,79,96,0.12)]">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center space-x-1.5 bg-[#FAF6F2] px-2.5 py-1 rounded-lg border border-[rgba(43,79,96,0.12)] text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                <span className="capitalize text-[#5B6E75] font-medium">{cat.name}:</span>
                <span className="font-bold text-[#1B333F] font-mono">{cat.value.toLocaleString()} {primaryCurrency}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Spending Trend Area Chart */}
        <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] space-y-4">
          <h3 className="text-base font-serif font-medium text-[#1B333F]">Daily Expense Velocity Trend</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F8683" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4F8683" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(43,79,96,0.12)" opacity={0.8} />
                <XAxis dataKey="date" stroke="#5B6E75" fontSize={11} tickLine={false} />
                <YAxis stroke="#5B6E75" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-xl border border-[rgba(43,79,96,0.15)] text-xs text-[#22323A]">
                          <div className="font-semibold text-[#5B6E75]">Date: {data.date}</div>
                          <div className="text-sm font-bold text-[#4F8683] font-mono mt-1">
                            {data.amount.toLocaleString()} {primaryCurrency}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="amount" stroke="#4F8683" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Budget Threshold Guard Progress Bars */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] space-y-4">
        <h3 className="text-base font-serif font-medium text-[#1B333F]">Category Budget Limits & Thresholds</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categoryLimits).map(([catKey, limitVal]) => {
            const limit = Number(limitVal) || 1;
            const spent = categoryData.find(c => c.name.toLowerCase() === catKey.toLowerCase())?.value || 0;
            const pct = Math.min(100, Math.round((spent / limit) * 100));

            return (
              <div key={catKey} className="bg-[#FAF6F2] border border-[rgba(43,79,96,0.12)] p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1B333F] capitalize">{catKey}</span>
                  <span className={`font-mono font-bold ${pct >= 100 ? 'text-[#D98B6F]' : pct >= 80 ? 'text-[#845460]' : 'text-[#4F8683]'}`}>
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#EAD3CB]/40 h-2 rounded-full overflow-hidden border border-[rgba(43,79,96,0.1)]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pct >= 100 ? 'bg-[#D98B6F]' : pct >= 80 ? 'bg-[#845460]' : 'bg-[#4F8683]'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[11px] text-[#5B6E75] font-mono">
                  <span>Spent: {spent.toLocaleString()}</span>
                  <span>Limit: {limit.toLocaleString()} {primaryCurrency}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
