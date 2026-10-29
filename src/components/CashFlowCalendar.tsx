import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  AlertCircle, 
  PlusCircle, 
  X, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck
} from 'lucide-react';
import { Transaction, Budget, CalendarDay } from '../types';
import { CalendarEngine } from '../services/CalendarEngine';

interface CashFlowCalendarProps {
  transactions: Transaction[];
  budget: Budget;
  primaryCurrency: string;
  onAddTransactionForDate: (dateStr: string) => void;
}

export const CashFlowCalendar: React.FC<CashFlowCalendarProps> = ({
  transactions,
  budget,
  primaryCurrency,
  onAddTransactionForDate
}) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  const gridData = useMemo(() => {
    return CalendarEngine.generateMonthGrid(viewDate, transactions, 80000);
  }, [viewDate, transactions]);

  const navigateMonth = (direction: -1 | 1) => {
    const next = new Date(viewDate);
    next.setMonth(next.getMonth() + direction);
    setViewDate(next);
  };

  const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Month totals
  const monthTransactions = useMemo(() => {
    const y = viewDate.getFullYear();
    const m = String(viewDate.getMonth() + 1).padStart(2, '0');
    const prefix = `${y}-${m}`;
    return transactions.filter(t => t.date && t.date.startsWith(prefix));
  }, [viewDate, transactions]);

  const monthIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthExpenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netCashFlow = monthIncome - monthExpenses;

  return (
    <div className="space-y-6">
      {/* Calendar Header Card */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-[#EAD3CB] text-[#845460] rounded-2xl border border-[rgba(43,79,96,0.12)]">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-medium text-[#1B333F] tracking-tight">{monthName}</h2>
              <p className="text-xs text-[#5B6E75] font-sans">
                Monthly Budget: <strong className="text-[#2B4F60] font-mono">{budget?.monthlyLimit?.toLocaleString() || '45,000'} {primaryCurrency}</strong>
              </p>
            </div>
          </div>

          {/* Month Navigation Controls */}
          <div className="flex items-center space-x-2 bg-[#FAF6F2] p-1.5 rounded-xl border border-[rgba(43,79,96,0.12)]">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-[#EAD3CB]/50 text-[#5B6E75] rounded-lg transition cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewDate(new Date())}
              className="px-3 py-1 bg-[#2B4F60] hover:bg-[#1B333F] text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-[#EAD3CB]/50 text-[#5B6E75] rounded-lg transition cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Monthly Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-[rgba(43,79,96,0.12)] text-xs">
          <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[rgba(43,79,96,0.12)]">
            <span className="text-[#5B6E75] font-semibold">Total Income</span>
            <span className="text-sm font-bold text-[#4F8683] font-mono block mt-0.5">
              +{monthIncome.toLocaleString()} {primaryCurrency}
            </span>
          </div>
          <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[rgba(43,79,96,0.12)]">
            <span className="text-[#5B6E75] font-semibold">Total Expenses</span>
            <span className="text-sm font-bold text-[#D98B6F] font-mono block mt-0.5">
              -{monthExpenses.toLocaleString()} {primaryCurrency}
            </span>
          </div>
          <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[rgba(43,79,96,0.12)]">
            <span className="text-[#5B6E75] font-semibold">Net Cash Flow</span>
            <span className={`text-sm font-bold font-mono block mt-0.5 ${netCashFlow >= 0 ? 'text-[#2B4F60]' : 'text-[#845460]'}`}>
              {netCashFlow >= 0 ? '+' : ''}{netCashFlow.toLocaleString()} {primaryCurrency}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs text-[#5B6E75] px-1 gap-2">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4F8683]"></span>
            <span>Payday / Income</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D98B6F]"></span>
            <span>Bill Due / Fawry</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2B4F60]"></span>
            <span>Today</span>
          </span>
        </div>
        <span className="text-[#5B6E75] text-[11px]">Click any date to inspect daily liquidity or add transaction</span>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)]">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 border-b border-[rgba(43,79,96,0.12)] bg-[#FAF6F2] text-[#2B4F60] text-xs font-semibold text-center py-2.5">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>

        {/* Days Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-[rgba(43,79,96,0.12)] bg-white">
          {gridData.map((day) => {
            return (
              <div
                key={day.dateString}
                onClick={() => setSelectedDay(day)}
                className={`min-h-[100px] p-2 transition cursor-pointer flex flex-col justify-between hover:bg-[#FAF6F2] ${
                  day.isToday ? 'bg-[#2B4F60]/5 ring-1 ring-[#2B4F60]' : day.isWeekend ? 'bg-[#FAF6F2]/50' : ''
                }`}
              >
                {/* Cell Header: Day number + Badges */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold font-mono px-1.5 py-0.5 rounded ${
                      day.isToday
                        ? 'bg-[#2B4F60] text-white'
                        : 'text-[#1B333F]'
                    }`}
                  >
                    {day.dayNumber}
                  </span>

                  <div className="flex items-center space-x-1">
                    {day.isPayday && (
                      <span className="w-2 h-2 rounded-full bg-[#4F8683]" title="Payday Entry"></span>
                    )}
                    {day.hasBillDue && (
                      <span className="w-2 h-2 rounded-full bg-[#D98B6F] animate-pulse" title="Bill Due / Utility"></span>
                    )}
                  </div>
                </div>

                {/* Transactions Activity Preview */}
                <div className="my-1 space-y-1">
                  {day.incomeTotal > 0 && (
                    <div className="text-[10px] font-bold text-[#4F8683] font-mono truncate bg-[#BDC7C9]/30 border border-[#4F8683]/20 px-1 py-0.5 rounded">
                      +{day.incomeTotal.toLocaleString()}
                    </div>
                  )}
                  {day.expenseTotal > 0 && (
                    <div className="text-[10px] font-bold text-[#D98B6F] font-mono truncate bg-[#EAD3CB]/40 border border-[#D98B6F]/20 px-1 py-0.5 rounded">
                      -{day.expenseTotal.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Cell Footer: End of Day Forecast Balance */}
                <div className="text-[10px] font-mono text-[#5B6E75] text-right truncate">
                  <span>Bal: </span>
                  <span className="font-semibold text-[#1B333F]">
                    {Math.round(day.balance).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Transactions Drawer Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 bg-[#1B333F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[rgba(43,79,96,0.15)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(43,79,96,0.12)] pb-3">
              <div>
                <h3 className="text-lg font-serif font-medium text-[#1B333F]">
                  Cash Flow for {selectedDay.date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </h3>
                <p className="text-xs text-[#5B6E75] font-sans">
                  Forecast Balance: <strong className="text-[#2B4F60] font-mono">{Math.round(selectedDay.balance).toLocaleString()} {primaryCurrency}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-1.5 text-[#5B6E75] hover:text-[#1B333F] rounded-lg bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List Day Transactions */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {selectedDay.transactions.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#5B6E75]">
                  No transactions recorded on this date.
                </div>
              ) : (
                selectedDay.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-[#FAF6F2] rounded-xl border border-[rgba(43,79,96,0.12)] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-[#1B333F]">{tx.merchant}</div>
                      <div className="text-[10px] text-[#5B6E75] capitalize">{tx.category} • {tx.paymentMethod || 'Card'}</div>
                    </div>
                    <div className={`font-mono font-bold text-sm ${tx.type === 'income' ? 'text-[#4F8683]' : 'text-[#1B333F]'}`}>
                      {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()} {primaryCurrency}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-[rgba(43,79,96,0.12)] pt-3">
              <button
                onClick={() => {
                  const dateStr = selectedDay.dateString;
                  setSelectedDay(null);
                  onAddTransactionForDate(dateStr);
                }}
                className="w-full flex items-center justify-center space-x-2 bg-[#2B4F60] hover:bg-[#1B333F] text-white font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-[#D98B6F]" />
                <span>Add Transaction on {selectedDay.dateString}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
