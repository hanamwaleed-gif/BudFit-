import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  Scan, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Transaction, Account, Budget, AIInsight } from '../types';
import { WeeklySpendingChart } from './WeeklySpendingChart';

interface OverviewDashboardProps {
  transactions: Transaction[];
  accounts: Account[];
  budget: Budget;
  aiInsights: AIInsight[];
  primaryCurrency: string;
  onOpenAddTransaction: () => void;
  onOpenReceiptOcr: () => void;
  onOpenOpenBanking: () => void;
  onNavigateTab: (tab: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  transactions,
  accounts,
  budget,
  aiInsights,
  primaryCurrency,
  onOpenAddTransaction,
  onOpenReceiptOcr,
  onOpenOpenBanking,
  onNavigateTab
}) => {
  // 1. Calculate Total Liquid Balance across accounts
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  // 2. Current Month Income & Expenses
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const currentMonthTx = transactions.filter(t => t.date && t.date.startsWith(currentMonthStr));

  const monthlyIncome = currentMonthTx
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = currentMonthTx
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netCashFlow = monthlyIncome - monthlyExpense;
  const savingsRate = monthlyIncome > 0 ? Math.max(0, Math.round(((monthlyIncome - monthlyExpense) / monthlyIncome) * 100)) : 0;

  // 3. Budget Velocity & Burn Rate
  const budgetLimit = budget?.monthlyLimit || 45000;
  const budgetSpentPct = Math.min(100, Math.round((monthlyExpense / budgetLimit) * 100));
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemaining = daysInMonth - currentDay;

  const dailyBurnRate = currentDay > 0 ? Math.round(monthlyExpense / currentDay) : 0;
  const projectedTotalExpense = Math.round(monthlyExpense + dailyBurnRate * daysRemaining);
  const isVelocityWarning = projectedTotalExpense > budgetLimit;

  return (
    <div className="space-y-6">
      {/* Top Welcome Greeting Banner */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(27,51,63,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#FAF6F2] border border-[rgba(43,79,96,0.12)] text-[#845460] font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              {now.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            <span className="text-[#5B6E75] text-xs">• AI Liquidity Guard: <strong className="text-[#4F8683] font-bold">Optimal</strong></span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1B333F] mt-1">
            Financial Health Command Center
          </h2>
          <p className="text-xs text-[#5B6E75] font-sans mt-0.5">
            Real-time cash flow monitoring, daily safe allowances, and intelligent spending automation.
          </p>
        </div>

        {/* Quick Health Indicator Badge */}
        <div className="flex items-center space-x-2 bg-[#FAF6F2] border border-[rgba(43,79,96,0.12)] px-3.5 py-2 rounded-2xl shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#4F8683] animate-pulse"></div>
          <div className="text-left">
            <div className="text-[10px] font-bold text-[#5B6E75] uppercase tracking-wider">Health Rating</div>
            <div className="text-xs font-bold text-[#1B333F]">82 / 100 • Strong Buffer</div>
          </div>
        </div>
      </div>

      {/* Velocity Alert Ticker if overspending velocity detected */}
      {isVelocityWarning && (
        <div className="bg-[#EAD3CB]/60 border border-[#845460]/20 rounded-2xl p-4 flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#D98B6F]/20 text-[#D98B6F] rounded-xl">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#6A414B]">Liquidity Velocity Alert</h4>
              <p className="text-xs text-[#5B6E75]">
                At your current daily burn rate of <span className="font-semibold text-[#22323A] font-mono">{dailyBurnRate.toLocaleString()} {primaryCurrency}</span>/day, projected monthly spend will hit <span className="font-bold text-[#D98B6F] font-mono">{projectedTotalExpense.toLocaleString()} {primaryCurrency}</span> (exceeding budget limit of {budgetLimit.toLocaleString()} {primaryCurrency}).
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('ai-insights')}
            className="shrink-0 bg-[#845460] hover:bg-[#6A414B] text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs shadow-xs transition cursor-pointer"
          >
            Run AI Audit
          </button>
        </div>
      )}

      {/* Hero 4 KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Liquid Balance */}
        <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-5 shadow-[0_1px_2px_rgba(27,51,63,0.04)] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-[#5B6E75] uppercase tracking-wider">Total Liquid Funds</p>
              <h3 className="text-2xl font-bold text-[#1B333F] mt-1.5 font-mono tracking-tight">
                {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <span className="text-xs text-[#8FA0A2] font-mono">{primaryCurrency}</span>
            </div>
            <div className="p-2.5 bg-[#2B4F60]/10 text-[#2B4F60] rounded-2xl border border-[#2B4F60]/15">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-[#5B6E75] border-t border-[rgba(43,79,96,0.1)] pt-3">
            <span>{accounts.length} Linked Accounts</span>
            <button onClick={() => onNavigateTab('accounts')} className="text-[#2B4F60] hover:underline font-bold flex items-center cursor-pointer">
              Manage <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Monthly Net Cash Flow */}
        <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-5 shadow-[0_1px_2px_rgba(27,51,63,0.04)] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-[#5B6E75] uppercase tracking-wider">Net Monthly Cash Flow</p>
              <h3 className={`text-2xl font-bold mt-1.5 font-mono tracking-tight ${netCashFlow >= 0 ? 'text-[#4F8683]' : 'text-[#D98B6F]'}`}>
                {netCashFlow >= 0 ? '+' : ''}{netCashFlow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <span className="text-xs text-[#5B6E75] font-mono">{primaryCurrency} surplus</span>
            </div>
            <div className={`p-2.5 rounded-2xl border ${netCashFlow >= 0 ? 'bg-[#4F8683]/10 text-[#4F8683] border-[#4F8683]/15' : 'bg-[#D98B6F]/10 text-[#D98B6F] border-[#D98B6F]/15'}`}>
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-[#5B6E75] border-t border-[rgba(43,79,96,0.1)] pt-3">
            <span>In: <strong className="text-[#4F8683]">+{monthlyIncome.toLocaleString()}</strong></span>
            <span>Out: <strong className="text-[#D98B6F]">-{monthlyExpense.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Financial Health Score Hero Badge */}
        <div className="bg-gradient-to-br from-[#1B333F] to-[#2B4F60] rounded-3xl p-5 text-white flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Health Score</p>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="font-serif text-3xl font-bold">82</span>
                <span className="text-xs text-white/70 font-sans">/ 100</span>
              </div>
            </div>
            <span className="bg-[#4F8683] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Strong
            </span>
          </div>
          <p className="text-[11px] text-white/80 mt-2 relative z-10 leading-snug">
            Buffer covers 4.2 months of fixed costs with a steady monthly savings velocity.
          </p>
        </div>

        {/* Daily Allowance Guard */}
        <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-5 shadow-[0_1px_2px_rgba(27,51,63,0.04)] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-[#5B6E75] uppercase tracking-wider">Safe Daily Allowance</p>
              <h3 className="text-2xl font-bold text-[#2B4F60] mt-1.5 font-mono tracking-tight">
                {daysRemaining > 0 ? Math.max(0, Math.round((budgetLimit - monthlyExpense) / daysRemaining)).toLocaleString() : 0}
              </h3>
              <span className="text-xs text-[#5B6E75] font-mono">{primaryCurrency} / day safe</span>
            </div>
            <div className="p-2.5 bg-[#845460]/10 text-[#845460] rounded-2xl border border-[#845460]/15">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-[#5B6E75] border-t border-[rgba(43,79,96,0.1)] pt-3">
            <span>Burn: <strong className="font-mono text-[#1B333F]">{dailyBurnRate.toLocaleString()} {primaryCurrency}/day</strong></span>
            <span className={`font-bold ${isVelocityWarning ? 'text-[#D98B6F]' : 'text-[#4F8683]'}`}>
              {isVelocityWarning ? 'Risk' : 'Safe'}
            </span>
          </div>
        </div>
      </div>

      {/* Budget Burn & Velocity Gauge Progress Bar */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-serif font-bold text-[#1B333F] flex items-center space-x-2">
              <Zap className="w-4 h-4 text-[#D98B6F]" />
              <span>Monthly Liquidity Guard</span>
            </h3>
            <p className="text-xs text-[#5B6E75] font-sans">
              Day {currentDay} of {daysInMonth} ({daysRemaining} days remaining in cycle)
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#5B6E75]">Spent / Limit:</span>
            <div className="text-sm font-bold font-mono text-[#1B333F]">
              {monthlyExpense.toLocaleString()} / {budgetLimit.toLocaleString()} {primaryCurrency}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#FAF6F2] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#BDC7C9]/60 flex">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budgetSpentPct > 90
                ? 'bg-[#D98B6F]'
                : budgetSpentPct > 75
                ? 'bg-[#845460]'
                : 'bg-[#2B4F60]'
            }`}
            style={{ width: `${budgetSpentPct}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-[rgba(43,79,96,0.1)] text-xs">
          <div>
            <span className="text-[#5B6E75] block">Daily Average Burn</span>
            <span className="text-sm font-bold text-[#1B333F] font-mono mt-0.5 block">{dailyBurnRate.toLocaleString()} {primaryCurrency}/day</span>
          </div>
          <div>
            <span className="text-[#5B6E75] block">Projected End-of-Month</span>
            <span className={`text-sm font-bold font-mono mt-0.5 block ${isVelocityWarning ? 'text-[#D98B6F]' : 'text-[#4F8683]'}`}>
              {projectedTotalExpense.toLocaleString()} {primaryCurrency}
            </span>
          </div>
          <div>
            <span className="text-[#5B6E75] block">Safe Daily Allowance</span>
            <span className="text-sm font-bold text-[#2B4F60] font-mono mt-0.5 block">
              {daysRemaining > 0 ? Math.max(0, Math.round((budgetLimit - monthlyExpense) / daysRemaining)).toLocaleString() : 0} {primaryCurrency}/day
            </span>
          </div>
          <div>
            <span className="text-[#5B6E75] block">Guard Status</span>
            <span className={`inline-flex items-center space-x-1 font-semibold mt-0.5 ${isVelocityWarning ? 'text-[#D98B6F]' : 'text-[#4F8683]'}`}>
              {isVelocityWarning ? <AlertTriangle className="w-3.5 h-3.5 mr-1" /> : <ShieldCheck className="w-3.5 h-3.5 mr-1" />}
              <span>{isVelocityWarning ? 'Velocity Risk' : 'Protected'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Weekly Spending Chart & Quick Actions / AI Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Weekly Spending Visualization Chart */}
        <div className="lg:col-span-2">
          <WeeklySpendingChart transactions={transactions} primaryCurrency={primaryCurrency} />
        </div>

        {/* Right 1 Col: Quick Action Hub & AI Insights Ticker */}
        <div className="space-y-6">
          {/* AI Coach Card (Styled matching design board) */}
          <div className="bg-[#EAD3CB] border border-[#845460]/20 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#845460] flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#6A414B]">
                AI Advisor
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#22323A] font-sans">
              {aiInsights[0]?.description || "Your subscriptions grew 15% this quarter. Canceling 2 unused tools would free up E£ 840/mo."}
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onNavigateTab('ai-insights')}
                className="font-sans text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white text-[#6A414B] border border-[#845460]/20 hover:bg-white/80 transition cursor-pointer shadow-2xs"
              >
                Review AI Advisor
              </button>
            </div>
          </div>

          {/* Action Command Hub */}
          <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-5 shadow-[0_1px_2px_rgba(27,51,63,0.04)]">
            <h3 className="text-sm font-serif font-bold text-[#1B333F] mb-3 flex items-center justify-between">
              <span>Quick Actions</span>
              <span className="text-[10px] text-[#2B4F60] font-mono">COMMAND HUB</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenAddTransaction}
                className="flex items-center space-x-2 p-2.5 bg-[#FAF6F2] hover:bg-[#2B4F60] hover:text-white border border-[rgba(43,79,96,0.13)] rounded-2xl text-[#2B4F60] transition text-left group cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#845460] shrink-0 group-hover:text-white transition-colors" />
                <span className="text-xs font-semibold truncate">Add Entry</span>
              </button>

              <button
                onClick={onOpenReceiptOcr}
                className="flex items-center space-x-2 p-2.5 bg-[#FAF6F2] hover:bg-[#2B4F60] hover:text-white border border-[rgba(43,79,96,0.13)] rounded-2xl text-[#2B4F60] transition text-left group cursor-pointer"
              >
                <Scan className="w-4 h-4 text-[#D98B6F] shrink-0 group-hover:text-white transition-colors" />
                <span className="text-xs font-semibold truncate">Scan Receipt</span>
              </button>

              <button
                onClick={onOpenOpenBanking}
                className="flex items-center space-x-2 p-2.5 bg-[#FAF6F2] hover:bg-[#2B4F60] hover:text-white border border-[rgba(43,79,96,0.13)] rounded-2xl text-[#2B4F60] transition text-left group cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-[#2B4F60] shrink-0 group-hover:text-white transition-colors" />
                <span className="text-xs font-semibold truncate">Banking Feed</span>
              </button>

              <button
                onClick={() => onNavigateTab('calendar')}
                className="flex items-center space-x-2 p-2.5 bg-[#FAF6F2] hover:bg-[#2B4F60] hover:text-white border border-[rgba(43,79,96,0.13)] rounded-2xl text-[#2B4F60] transition text-left group cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#4F8683] shrink-0 group-hover:text-white transition-colors" />
                <span className="text-xs font-semibold truncate">Cash Flow</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table Preview */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-serif font-bold text-[#1B333F]">Recent Activity Ledger</h3>
            <p className="text-xs text-[#5B6E75]">Latest real-time entries across linked accounts</p>
          </div>
          <button
            onClick={() => onNavigateTab('ledger')}
            className="text-xs font-bold text-[#2B4F60] hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>View Full Ledger</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-[rgba(43,79,96,0.13)] rounded-2xl overflow-hidden">
            <thead className="bg-[#FAF6F2] text-[#5B6E75] uppercase font-bold text-[10px] tracking-wider border-b border-[rgba(43,79,96,0.13)]">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Merchant</th>
                <th className="p-3">Category</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(43,79,96,0.1)] text-[#22323A]">
              {transactions.slice(0, 6).map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FAF6F2]/70 transition">
                  <td className="p-3 font-mono text-[#5B6E75] whitespace-nowrap">{tx.date}</td>
                  <td className="p-3 font-bold text-[#1B333F]">
                    {tx.merchant}
                    {tx.isRecurring && (
                      <span className="ml-2 text-[10px] bg-[#EAD3CB] text-[#6A414B] px-1.5 py-0.5 rounded font-mono font-medium">
                        Recurring
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="bg-[#FAF6F2] text-[#2B4F60] border border-[rgba(43,79,96,0.15)] px-2.5 py-0.5 rounded-full capitalize text-[11px] font-medium">
                      {tx.category || 'General'}
                    </span>
                  </td>
                  <td className="p-3 text-[#5B6E75]">{tx.paymentMethod || 'Card'}</td>
                  <td className={`p-3 text-right font-mono font-bold whitespace-nowrap ${tx.type === 'income' ? 'text-[#4F8683]' : 'text-[#D98B6F]'}`}>
                    {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {primaryCurrency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
