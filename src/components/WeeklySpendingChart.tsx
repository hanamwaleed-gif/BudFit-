import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';
import { Transaction } from '../types';

interface WeeklySpendingChartProps {
  transactions: Transaction[];
  primaryCurrency: string;
}

export const WeeklySpendingChart: React.FC<WeeklySpendingChartProps> = ({ transactions, primaryCurrency }) => {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

  const weeklyData = useMemo(() => {
    const weeks = [];
    const now = new Date();
    const currentDay = now.getDay() || 7; // Monday = 1 ... Sunday = 7

    for (let week = 0; week < 4; week++) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - currentDay - week * 7 + 1);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekTx = transactions.filter(t => {
        if (!t.date) return false;
        const d = new Date(t.date);
        return d >= weekStart && d <= weekEnd && t.type === 'expense';
      });

      const daysLabel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dailyData = daysLabel.map((dayLabel, idx) => {
        const dayDate = new Date(weekStart);
        dayDate.setDate(weekStart.getDate() + idx);
        const dateStr = dayDate.toISOString().split('T')[0];

        const dayTx = weekTx.filter(t => t.date && t.date.startsWith(dateStr));
        const spending = dayTx.reduce((sum, t) => sum + t.amount, 0);

        return {
          day: dayLabel,
          dateStr,
          spending,
          count: dayTx.length
        };
      });

      const totalSpent = weekTx.reduce((sum, t) => sum + t.amount, 0);

      // Category breakdown for this week
      const catMap: Record<string, number> = {};
      weekTx.forEach(t => {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      });
      const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];

      weeks.push({
        weekNum: week + 1,
        rangeLabel: `${weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
        totalSpent,
        dailyAverage: Math.round(totalSpent / 7),
        dailyData,
        topCategoryName: topCat ? topCat[0] : 'None',
        topCategoryAmount: topCat ? topCat[1] : 0
      });
    }

    return weeks;
  }, [transactions]);

  const activeWeek = weeklyData[selectedWeekIndex] || weeklyData[0];
  const peakDayObj = activeWeek?.dailyData ? [...activeWeek.dailyData].sort((a, b) => b.spending - a.spending)[0] : null;

  return (
    <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-serif font-medium text-[#1B333F] flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-[#845460]" />
            <span>Weekly Category Spend</span>
          </h3>
          <p className="text-xs text-[#5B6E75] mt-0.5 font-sans">
            {activeWeek?.rangeLabel}
          </p>
        </div>

        {/* Week Switcher */}
        <div className="flex items-center space-x-2 bg-[#FAF6F2] border border-[rgba(43,79,96,0.13)] rounded-xl p-1">
          <button
            onClick={() => setSelectedWeekIndex(prev => Math.min(weeklyData.length - 1, prev + 1))}
            disabled={selectedWeekIndex >= weeklyData.length - 1}
            className="p-1.5 hover:bg-[#EAD3CB]/50 disabled:opacity-40 rounded-lg text-[#2B4F60] transition cursor-pointer"
            title="Previous Week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-[#845460] font-mono px-2">
            Week {activeWeek?.weekNum} {selectedWeekIndex === 0 ? '(Current)' : ''}
          </span>
          <button
            onClick={() => setSelectedWeekIndex(prev => Math.max(0, prev - 1))}
            disabled={selectedWeekIndex <= 0}
            className="p-1.5 hover:bg-[#EAD3CB]/50 disabled:opacity-40 rounded-lg text-[#2B4F60] transition cursor-pointer"
            title="Next Week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activeWeek?.dailyData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(43,79,96,0.12)" />
            <XAxis dataKey="day" stroke="#5B6E75" fontSize={11} tickLine={false} />
            <YAxis stroke="#5B6E75" fontSize={11} tickLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#1B333F] p-3 rounded-xl shadow-lg border border-white/10 text-xs text-white">
                      <div className="font-semibold text-[#BDC7C9]">{data.day} ({data.dateStr})</div>
                      <div className="text-sm font-bold text-[#EAD3CB] font-mono mt-1">
                        {data.spending.toLocaleString()} {primaryCurrency}
                      </div>
                      <div className="text-[10px] text-white/60 mt-0.5">{data.count} transactions logged</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="spending" fill="#845460" radius={[6, 6, 2, 2]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-[rgba(43,79,96,0.1)]">
        <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[rgba(43,79,96,0.12)]">
          <span className="text-[10px] text-[#5B6E75] block uppercase font-bold tracking-wider">Week Total</span>
          <span className="text-sm font-bold text-[#1B333F] font-mono mt-0.5 block">
            {activeWeek?.totalSpent.toLocaleString()} {primaryCurrency}
          </span>
        </div>

        <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[rgba(43,79,96,0.12)]">
          <span className="text-[10px] text-[#5B6E75] block uppercase font-bold tracking-wider">Daily Average</span>
          <span className="text-sm font-bold text-[#4F8683] font-mono mt-0.5 block">
            {activeWeek?.dailyAverage.toLocaleString()} {primaryCurrency}
          </span>
        </div>

        <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[rgba(43,79,96,0.12)]">
          <span className="text-[10px] text-[#5B6E75] block uppercase font-bold tracking-wider">Peak Day</span>
          <span className="text-sm font-bold text-[#D98B6F] font-mono mt-0.5 block">
            {peakDayObj?.day || 'N/A'} ({peakDayObj?.spending.toLocaleString()} {primaryCurrency})
          </span>
        </div>

        <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[rgba(43,79,96,0.12)]">
          <span className="text-[10px] text-[#5B6E75] block uppercase font-bold tracking-wider">Top Category</span>
          <span className="text-sm font-bold text-[#845460] mt-0.5 block capitalize truncate">
            {activeWeek?.topCategoryName}
          </span>
        </div>
      </div>
    </div>
  );
};
