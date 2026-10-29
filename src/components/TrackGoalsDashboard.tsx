import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Clock, 
  Calendar, 
  Zap, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  ShieldCheck, 
  Flame, 
  ArrowRight, 
  ChevronRight, 
  Activity,
  Plus,
  BarChart3,
  Check,
  RotateCcw
} from 'lucide-react';
import { FinancialGoal, UserProfile } from '../types';

interface TrackGoalsDashboardProps {
  goals: FinancialGoal[];
  primaryCurrency: string;
  user?: UserProfile | null;
  onDepositGoal: (goalId: string, amount: number) => void;
  onOpenAddGoal: () => void;
}

export const TrackGoalsDashboard: React.FC<TrackGoalsDashboardProps> = ({
  goals,
  primaryCurrency,
  user,
  onDepositGoal,
  onOpenAddGoal
}) => {
  // Deposit modal state
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState<FinancialGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('1000');

  // Daily boost simulator slider
  const [dailyBoost, setDailyBoost] = useState<number>(100);

  // Filter selection
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Mock daily contribution activity (last 28 days)
  const [activityHistory, setActivityHistory] = useState([
    { id: 'act_1', date: 'Today', goalTitle: goals[0]?.title || 'Emergency Cushion', amount: 1500, type: 'deposit' },
    { id: 'act_2', date: 'Yesterday', goalTitle: goals[1]?.title || 'Stock Portfolio', amount: 800, type: 'deposit' },
    { id: 'act_3', date: '3 days ago', goalTitle: goals[0]?.title || 'Emergency Cushion', amount: 2000, type: 'deposit' },
    { id: 'act_4', date: '5 days ago', goalTitle: goals[2]?.title || 'Tech Upgrade', amount: 1200, type: 'deposit' }
  ]);

  // Calculate App Join Days
  const getDaysSinceJoin = (): number => {
    if (!user?.createdAt) return 42; // default fallback demo 42 days
    const joinDate = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 30;
  };

  const daysActive = getDaysSinceJoin();

  // Financial aggregates
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
  const totalRemainingDistance = Math.max(0, totalTarget - totalSaved);

  // Daily velocity
  const avgDailyPace = daysActive > 0 ? Math.round(totalSaved / daysActive) : 0;
  const avgWeeklyPace = avgDailyPace * 7;
  const avgMonthlyPace = avgDailyPace * 30;

  // Filtered goals
  const filteredGoals = goals.filter(g => {
    if (categoryFilter === 'all') return true;
    return g.category.toLowerCase().includes(categoryFilter.toLowerCase());
  });

  // Calculate days remaining to target date
  const getDaysRemaining = (targetDateStr: string): number => {
    if (!targetDateStr) return 180;
    const target = new Date(targetDateStr);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const handleQuickDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalForDeposit) return;

    const amt = parseFloat(depositAmount) || 0;
    if (amt <= 0) return;

    onDepositGoal(selectedGoalForDeposit.id, amt);

    // Add to local activity history
    setActivityHistory([
      {
        id: `act_${Date.now()}`,
        date: 'Just now',
        goalTitle: selectedGoalForDeposit.title,
        amount: amt,
        type: 'deposit'
      },
      ...activityHistory
    ]);

    setSelectedGoalForDeposit(null);
  };

  return (
    <div className="space-y-6 text-xs text-[#22323A]">
      {/* Top Banner: Day-to-Day Progress Summary */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-5 sm:p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(43,79,96,0.12)] pb-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#FAF6F2] border border-[rgba(43,79,96,0.12)] px-3 py-1 rounded-full mb-1">
              <Activity className="w-3.5 h-3.5 text-[#845460]" />
              <span className="text-[10px] font-bold text-[#845460] uppercase tracking-wider">
                Day-to-Day Goal Velocity Dashboard
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1B333F]">
              Your Capital Progress Since Joining BudFit
            </h2>
            <p className="text-xs text-[#5B6E75]">
              Real-time daily savings velocity, goal distance countdowns, and automated pace forecasting.
            </p>
          </div>

          <button
            onClick={onOpenAddGoal}
            className="bg-[#2B4F60] hover:bg-[#1B333F] text-white px-4 py-2.5 rounded-xl font-semibold text-xs inline-flex items-center space-x-2 shadow-xs transition cursor-pointer self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-[#D98B6F]" />
            <span>Create New Savings Target</span>
          </button>
        </div>

        {/* Core Stat Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {/* Days Active */}
          <div className="bg-[#FAF6F2] border border-[rgba(43,79,96,0.1)] rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[#5B6E75]">
              <span className="text-[11px] font-semibold">Joined BudFit</span>
              <Calendar className="w-3.5 h-3.5 text-[#4F8683]" />
            </div>
            <div className="text-lg font-bold font-mono text-[#1B333F]">
              {daysActive} <span className="text-xs font-normal text-[#5B6E75]">Days Active</span>
            </div>
            <div className="text-[10px] text-[#4F8683] font-semibold">
              🔥 18-Day Active Deposit Streak
            </div>
          </div>

          {/* Capital Saved */}
          <div className="bg-[#FAF6F2] border border-[rgba(43,79,96,0.1)] rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[#5B6E75]">
              <span className="text-[11px] font-semibold">Total Goal Capital</span>
              <Target className="w-3.5 h-3.5 text-[#845460]" />
            </div>
            <div className="text-lg font-bold font-mono text-[#1B333F]">
              {totalSaved.toLocaleString()} <span className="text-xs font-normal text-[#5B6E75]">{primaryCurrency}</span>
            </div>
            <div className="text-[10px] text-[#845460] font-semibold">
              {overallPct}% of {totalTarget.toLocaleString()} {primaryCurrency} Total
            </div>
          </div>

          {/* Daily Pace */}
          <div className="bg-[#FAF6F2] border border-[rgba(43,79,96,0.1)] rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[#5B6E75]">
              <span className="text-[11px] font-semibold">Daily Savings Pace</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-lg font-bold font-mono text-emerald-800">
              +{avgDailyPace.toLocaleString()} <span className="text-xs font-normal text-[#5B6E75]">{primaryCurrency}/day</span>
            </div>
            <div className="text-[10px] text-[#5B6E75]">
              ~{avgMonthlyPace.toLocaleString()} {primaryCurrency} monthly velocity
            </div>
          </div>

          {/* Remaining Distance */}
          <div className="bg-[#FAF6F2] border border-[rgba(43,79,96,0.1)] rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[#5B6E75]">
              <span className="text-[11px] font-semibold">Distance to Complete</span>
              <Clock className="w-3.5 h-3.5 text-[#D98B6F]" />
            </div>
            <div className="text-lg font-bold font-mono text-[#1B333F]">
              {totalRemainingDistance.toLocaleString()} <span className="text-xs font-normal text-[#5B6E75]">{primaryCurrency}</span>
            </div>
            <div className="text-[10px] text-[#D98B6F] font-semibold">
              Distance remaining across {goals.length} goals
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between items-center text-[11px] font-semibold">
            <span className="text-[#1B333F]">Overall Capital Accumulation Distance</span>
            <span className="text-[#845460] font-mono font-bold">{overallPct}% Reached</span>
          </div>
          <div className="w-full bg-[#FAF6F2] h-3 rounded-full overflow-hidden p-0.5 border border-[rgba(43,79,96,0.12)]">
            <div 
              className="h-full bg-gradient-to-r from-[#2B4F60] via-[#4F8683] to-[#845460] rounded-full transition-all duration-500"
              style={{ width: `${overallPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Goal Distance Analytics Grid ("How Far Away Are You From Your Goals?") */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif font-bold text-base text-[#1B333F] flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#845460]" />
              <span>Goal Distance & Daily Velocity Breakdown</span>
            </h3>
            <p className="text-xs text-[#5B6E75]">
              Exact countdowns, daily required savings, and pace status for each active goal.
            </p>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto">
            <span className="text-[10px] font-bold text-[#5B6E75] uppercase">Filter:</span>
            {['all', 'emergency', 'debt', 'stock', 'work', 'lifestyle'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-full font-semibold text-[10px] capitalize transition cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#2B4F60] text-white'
                    : 'bg-white border border-[rgba(43,79,96,0.12)] text-[#5B6E75] hover:text-[#1B333F]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Goals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.map((goal) => {
            const goalPct = goal.targetAmount > 0 
              ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) 
              : 0;

            const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
            const daysLeft = getDaysRemaining(goal.targetDate);
            const requiredDaily = daysLeft > 0 ? Math.ceil(remainingAmount / daysLeft) : 0;

            // Estimate current pace (based on expected monthly or avg daily contribution)
            const currentDailyPace = goal.expectedMonthlyContrib 
              ? Math.round(goal.expectedMonthlyContrib / 30) 
              : Math.round(avgDailyPace / (goals.length || 1));

            const isAhead = currentDailyPace >= requiredDaily && remainingAmount > 0;
            const isCompleted = goal.isCompleted || goalPct >= 100;

            return (
              <div 
                key={goal.id}
                className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-5 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-4 flex flex-col justify-between"
              >
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: goal.color || '#2B4F60' }}></span>
                        <h4 className="font-serif font-bold text-[#1B333F] text-sm">{goal.title}</h4>
                      </div>
                      <span className="text-[10px] text-[#5B6E75] font-semibold block mt-0.5">
                        Category: {goal.category} • Target Date: {goal.targetDate}
                      </span>
                    </div>

                    {isCompleted ? (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 shrink-0">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Completed!</span>
                      </span>
                    ) : isAhead ? (
                      <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 shrink-0">
                        <Zap className="w-3 h-3 text-blue-600" />
                        <span>Ahead of Pace</span>
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 shrink-0">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Needs Boost</span>
                      </span>
                    )}
                  </div>

                  {/* Distance Metrics Box */}
                  <div className="bg-[#FAF6F2] border border-[rgba(43,79,96,0.1)] rounded-2xl p-3 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-[10px] text-[#5B6E75] font-semibold uppercase">Current Balance</div>
                      <div className="font-mono font-bold text-[#1B333F] text-sm">
                        {goal.currentAmount.toLocaleString()} <span className="text-[10px] text-[#5B6E75]">{primaryCurrency}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-[#5B6E75] font-semibold uppercase">Distance Remaining</div>
                      <div className="font-mono font-bold text-[#845460] text-sm">
                        {remainingAmount.toLocaleString()} <span className="text-[10px] text-[#5B6E75]">{primaryCurrency}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pace Analytics & Progress */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-[#5B6E75]">{goalPct}% Covered</span>
                      <span className="font-bold text-[#2B4F60]">{daysLeft} Days Remaining</span>
                    </div>

                    <div className="w-full bg-[#FAF6F2] h-2.5 rounded-full overflow-hidden border border-[rgba(43,79,96,0.12)]">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${goalPct}%`, backgroundColor: goal.color || '#2B4F60' }}
                      ></div>
                    </div>
                  </div>

                  {/* Required Daily Pace vs Current Daily Pace */}
                  {!isCompleted && (
                    <div className="bg-white border border-[rgba(43,79,96,0.1)] p-2.5 rounded-xl flex items-center justify-between text-[11px]">
                      <div>
                        <div className="text-[#5B6E75]">Required Daily Pace</div>
                        <div className="font-mono font-bold text-[#1B333F]">
                          {requiredDaily.toLocaleString()} {primaryCurrency}/day
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[#5B6E75]">Current Daily Pace</div>
                        <div className="font-mono font-bold text-emerald-800">
                          {currentDailyPace.toLocaleString()} {primaryCurrency}/day
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <button
                    onClick={() => setSelectedGoalForDeposit(goal)}
                    className="w-full bg-[#2B4F60] hover:bg-[#1B333F] text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D98B6F]" />
                    <span>Log Daily Progress Deposit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Pace Simulator & Daily Log Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Daily Pace Booster Simulator */}
        <div className="lg:col-span-7 bg-[#FAF6F2] border border-[rgba(43,79,96,0.13)] rounded-3xl p-5 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-[#845460]">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-serif font-bold text-base text-[#1B333F]">
                Goal Accelerator: "What if I save more daily?"
              </h3>
            </div>
            <p className="text-xs text-[#5B6E75]">
              Drag the slider to see how increasing daily savings speeds up your target dates!
            </p>
          </div>

          {/* Slider */}
          <div className="space-y-2 bg-white border border-[rgba(43,79,96,0.12)] p-4 rounded-2xl">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#1B333F]">Daily Boost Amount:</span>
              <span className="font-mono font-bold text-base text-[#2B4F60]">
                +{dailyBoost} {primaryCurrency} / day
              </span>
            </div>

            <input
              type="range"
              min={20}
              max={1000}
              step={20}
              value={dailyBoost}
              onChange={(e) => setDailyBoost(parseInt(e.target.value) || 0)}
              className="w-full accent-[#2B4F60] cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-[#5B6E75] font-mono">
              <span>+20 {primaryCurrency}</span>
              <span>+500 {primaryCurrency}</span>
              <span>+1,000 {primaryCurrency}</span>
            </div>
          </div>

          {/* Forecast Results */}
          <div className="bg-white border border-[#2B4F60]/20 rounded-2xl p-4 space-y-3">
            <div className="text-xs font-bold text-[#1B333F] flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-[#D98B6F]" />
              <span>Accelerated Goal Impact:</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[rgba(43,79,96,0.1)]">
                <div className="text-[10px] text-[#5B6E75]">Extra Monthly Accumulation</div>
                <div className="font-mono font-bold text-emerald-800 text-sm">
                  +{(dailyBoost * 30).toLocaleString()} {primaryCurrency}
                </div>
              </div>

              <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[rgba(43,79,96,0.1)]">
                <div className="text-[10px] text-[#5B6E75]">Time Saved Across Goals</div>
                <div className="font-mono font-bold text-[#845460] text-sm">
                  ~{Math.round((dailyBoost * 365) / (totalRemainingDistance > 0 ? totalRemainingDistance / 12 : 1))} Months Faster
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#5B6E75] italic">
              💡 Tip: Saving an extra <span className="font-bold text-[#1B333F]">{dailyBoost} {primaryCurrency}/day</span> can be unlocked by trimming 1 unused subscription or dining out 1 less time per week!
            </p>
          </div>
        </div>

        {/* Daily Progress Activity Feed */}
        <div className="lg:col-span-5 bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-5 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[rgba(43,79,96,0.12)] pb-3">
              <h3 className="font-serif font-bold text-sm text-[#1B333F] flex items-center space-x-1.5">
                <BarChart3 className="w-4 h-4 text-[#4F8683]" />
                <span>Recent Daily Contributions</span>
              </h3>
              <span className="text-[10px] bg-[#FAF6F2] text-[#5B6E75] px-2 py-0.5 rounded-full font-mono">
                Log History
              </span>
            </div>

            <div className="space-y-2.5 my-3">
              {activityHistory.map(act => (
                <div 
                  key={act.id}
                  className="bg-[#FAF6F2] border border-[rgba(43,79,96,0.1)] p-3 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                      +
                    </div>
                    <div>
                      <div className="font-bold text-[#1B333F] text-xs">{act.goalTitle}</div>
                      <div className="text-[10px] text-[#5B6E75]">{act.date}</div>
                    </div>
                  </div>

                  <div className="font-mono font-bold text-emerald-800 text-xs">
                    +{act.amount.toLocaleString()} {primaryCurrency}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setSelectedGoalForDeposit(goals[0] || null)}
            className="w-full bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#1B333F] border border-[rgba(43,79,96,0.15)] py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            + Add Today's Daily Contribution
          </button>
        </div>
      </div>

      {/* QUICK DEPOSIT MODAL */}
      {selectedGoalForDeposit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[rgba(43,79,96,0.15)] shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[rgba(43,79,96,0.12)] pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-[#1B333F]">
                  Log Daily Deposit
                </h3>
                <p className="text-xs text-[#5B6E75]">
                  Goal: <span className="font-semibold text-[#2B4F60]">{selectedGoalForDeposit.title}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedGoalForDeposit(null)}
                className="text-[#5B6E75] hover:text-[#1B333F] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickDepositSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1B333F]">
                  Deposit Amount ({primaryCurrency})
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full bg-[#FAF6F2] text-[#1B333F] font-mono text-base font-bold p-3 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#2B4F60]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 2500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt.toString())}
                    className="bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#1B333F] p-2 rounded-xl text-xs font-semibold border border-[rgba(43,79,96,0.12)] cursor-pointer"
                  >
                    +{amt} {primaryCurrency}
                  </button>
                ))}
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGoalForDeposit(null)}
                  className="flex-1 bg-[#FAF6F2] hover:bg-gray-200 text-[#1B333F] py-2.5 rounded-xl font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#2B4F60] hover:bg-[#1B333F] text-white py-2.5 rounded-xl font-semibold text-xs cursor-pointer shadow-xs"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
