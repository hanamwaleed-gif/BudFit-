import React, { useState } from 'react';
import { 
  Gift, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Award, 
  Sparkles, 
  TrendingUp, 
  ShoppingBag,
  PartyPopper,
  Calendar
} from 'lucide-react';
import { Transaction } from '../types';

interface SpendingWrappedModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  primaryCurrency: string;
}

export const SpendingWrappedModal: React.FC<SpendingWrappedModalProps> = ({
  isOpen,
  onClose,
  transactions,
  primaryCurrency
}) => {
  const [timeframeMode, setTimeframeMode] = useState<'yearly' | 'monthly'>('yearly');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [slide, setSlide] = useState(0);

  if (!isOpen) return null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filter transactions based on selected timeframe
  const filteredTransactions = transactions.filter(t => {
    if (!t.date) return true;
    const d = new Date(t.date);
    if (isNaN(d.getTime())) return true;
    
    if (timeframeMode === 'yearly') {
      return d.getFullYear() === selectedYear;
    } else {
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    }
  });

  // Calculate Wrapped statistics
  const totalSpent = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = Math.max(0, totalIncome - totalSpent);
  const savingsRatePct = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Top merchant
  const merchantMap: Record<string, number> = {};
  filteredTransactions.filter(t => t.type === 'expense').forEach(t => {
    merchantMap[t.merchant] = (merchantMap[t.merchant] || 0) + t.amount;
  });
  const topMerchant = Object.entries(merchantMap).sort((a, b) => b[1] - a[1])[0];

  // Top Category
  const categoryMap: Record<string, number> = {};
  filteredTransactions.filter(t => t.type === 'expense').forEach(t => {
    const catName = t.category || 'General';
    categoryMap[catName] = (categoryMap[catName] || 0) + t.amount;
  });
  const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

  const currentPeriodLabel = timeframeMode === 'yearly' 
    ? `${selectedYear} Year in Review` 
    : `${monthNames[selectedMonth]} ${selectedYear} Monthly Wrap`;

  const slides = [
    {
      title: timeframeMode === 'yearly' ? "BudFit Annual Wrapped" : "BudFit Monthly Wrapped",
      subtitle: currentPeriodLabel,
      content: (
        <div className="text-center space-y-4 py-4">
          <div className="w-16 h-16 rounded-3xl bg-[#EAD3CB] border border-[#845460]/20 mx-auto flex items-center justify-center shadow-md animate-bounce">
            <Gift className="w-8 h-8 text-[#845460]" />
          </div>
          <h3 className="text-2xl font-serif font-medium text-[#1B333F]">
            {timeframeMode === 'yearly' ? `Your ${selectedYear} Financial Journey!` : `${monthNames[selectedMonth]} Performance!`}
          </h3>
          <p className="text-xs text-[#5B6E75] max-w-xs mx-auto font-sans">
            You logged <strong className="text-[#2B4F60] font-mono">{filteredTransactions.length} transactions</strong> in this {timeframeMode === 'yearly' ? 'year' : 'month'}.
          </p>
        </div>
      )
    },
    {
      title: "Inflow vs Outflow",
      subtitle: "Capital Flow Summary",
      content: (
        <div className="space-y-3 py-2 text-center">
          <div className="bg-[#FAF6F2] p-3.5 rounded-2xl border border-[rgba(43,79,96,0.12)] space-y-0.5">
            <span className="text-[10px] text-[#5B6E75] uppercase font-bold tracking-wider">Total Revenue Inflow</span>
            <div className="text-2xl font-bold text-[#4F8683] font-mono">
              +{totalIncome.toLocaleString()} {primaryCurrency}
            </div>
          </div>

          <div className="bg-[#FAF6F2] p-3.5 rounded-2xl border border-[rgba(43,79,96,0.12)] space-y-0.5">
            <span className="text-[10px] text-[#5B6E75] uppercase font-bold tracking-wider">Total Expenses Outflow</span>
            <div className="text-2xl font-bold text-[#D98B6F] font-mono">
              -{totalSpent.toLocaleString()} {primaryCurrency}
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-200 p-3 rounded-2xl flex justify-between items-center text-xs text-teal-900 font-semibold px-4">
            <span>Net Retained Savings</span>
            <span className="font-mono font-bold text-teal-800">+{netSavings.toLocaleString()} {primaryCurrency} ({savingsRatePct}%)</span>
          </div>
        </div>
      )
    },
    {
      title: "Top Category & Favorite Merchant",
      subtitle: "Where your money was spent",
      content: (
        <div className="space-y-3 py-2">
          <div className="bg-[#FAF6F2] p-4 rounded-2xl border border-[rgba(43,79,96,0.12)] flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#EAD3CB] border border-[#845460]/20 flex items-center justify-center text-[#845460] shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#5B6E75] uppercase font-bold block">Top Spending Category</span>
              <h4 className="text-base font-serif font-bold text-[#1B333F] capitalize">{topCategory ? topCategory[0] : 'N/A'}</h4>
              <p className="text-xs font-bold text-[#D98B6F] font-mono">
                {topCategory ? topCategory[1].toLocaleString() : 0} {primaryCurrency}
              </p>
            </div>
          </div>

          <div className="bg-[#FAF6F2] p-4 rounded-2xl border border-[rgba(43,79,96,0.12)] flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#FAF6F2] border border-[rgba(43,79,96,0.2)] flex items-center justify-center text-[#2B4F60] shrink-0">
              <Award className="w-5 h-5 text-[#845460]" />
            </div>
            <div>
              <span className="text-[10px] text-[#5B6E75] uppercase font-bold block">Top Favorite Merchant</span>
              <h4 className="text-base font-serif font-bold text-[#1B333F]">{topMerchant ? topMerchant[0] : 'N/A'}</h4>
              <p className="text-xs font-bold text-[#2B4F60] font-mono">
                {topMerchant ? topMerchant[1].toLocaleString() : 0} {primaryCurrency}
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#1B333F]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[rgba(43,79,96,0.15)] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-[#5B6E75] hover:text-[#1B333F] rounded-lg bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 transition cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        {/* Timeframe Mode Switcher: Yearly vs Monthly */}
        <div className="pr-10 space-y-2">
          <div className="flex bg-[#FAF6F2] p-1 rounded-xl border border-[rgba(43,79,96,0.12)]">
            <button
              onClick={() => { setTimeframeMode('yearly'); setSlide(0); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                timeframeMode === 'yearly' ? 'bg-[#2B4F60] text-white shadow-xs' : 'text-[#5B6E75] hover:text-[#1B333F]'
              }`}
            >
              Yearly Wrap ('26)
            </button>
            <button
              onClick={() => { setTimeframeMode('monthly'); setSlide(0); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                timeframeMode === 'monthly' ? 'bg-[#2B4F60] text-white shadow-xs' : 'text-[#5B6E75] hover:text-[#1B333F]'
              }`}
            >
              Monthly Wrap
            </button>
          </div>

          {timeframeMode === 'monthly' && (
            <div className="flex items-center space-x-2 pt-1">
              <Calendar className="w-4 h-4 text-[#845460]" />
              <select
                value={selectedMonth}
                onChange={(e) => { setSelectedMonth(Number(e.target.value)); setSlide(0); }}
                className="bg-[#FAF6F2] text-[#1B333F] text-xs font-semibold p-1.5 rounded-lg border border-[rgba(43,79,96,0.12)] focus:outline-none focus:border-[#2B4F60] w-full"
              >
                {monthNames.map((name, idx) => (
                  <option key={name} value={idx}>{name} {selectedYear}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <span className="text-[10px] font-bold text-[#845460] tracking-wider uppercase font-mono">
            {timeframeMode.toUpperCase()} STORY {slide + 1} OF {slides.length}
          </span>
          <h2 className="text-lg font-serif font-medium text-[#1B333F]">{slides[slide].title}</h2>
          <p className="text-xs text-[#5B6E75] font-sans">{slides[slide].subtitle}</p>
        </div>

        <div>{slides[slide].content}</div>

        <div className="flex justify-between items-center border-t border-[rgba(43,79,96,0.12)] pt-4">
          <button
            onClick={() => setSlide(prev => Math.max(0, prev - 1))}
            disabled={slide === 0}
            className="p-2 bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 disabled:opacity-30 rounded-xl text-[#2B4F60] border border-[rgba(43,79,96,0.12)] cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {slide < slides.length - 1 ? (
            <button
              onClick={() => setSlide(prev => prev + 1)}
              className="bg-[#2B4F60] hover:bg-[#1B333F] text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-1 cursor-pointer shadow-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="bg-[#4F8683] hover:bg-[#4F8683]/90 text-white font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-xs"
            >
              Done!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
