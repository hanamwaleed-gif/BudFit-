import React, { useState } from 'react';
import { 
  Target, 
  PlusCircle, 
  CheckCircle2, 
  TrendingUp, 
  X,
  PiggyBank,
  Award,
  Sparkles,
  Zap,
  ArrowRight,
  Filter,
  ShieldCheck,
  Flame,
  BarChart2,
  Percent,
  Clock,
  Activity
} from 'lucide-react';
import { FinancialGoal, GoalPriority, GoalHorizon, AllocationStrategy, AchievementBadge, UserProfile } from '../types';
import { MultiGoalOptimizer } from './MultiGoalOptimizer';
import { TrackGoalsDashboard } from './TrackGoalsDashboard';

interface FinancialGoalsProps {
  goals: FinancialGoal[];
  primaryCurrency: string;
  user?: UserProfile | null;
  onAddGoal: (goal: FinancialGoal) => void;
  onDepositGoal: (goalId: string, amount: number) => void;
  onAutoReallocate?: (strategy: AllocationStrategy) => void;
}

export const FinancialGoals: React.FC<FinancialGoalsProps> = ({
  goals,
  primaryCurrency,
  user,
  onAddGoal,
  onDepositGoal,
  onAutoReallocate
}) => {
  const [viewTab, setViewTab] = useState<'track' | 'manage'>('track');
  const [showAddModal, setShowAddModal] = useState(false);
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('5000');
  const [allocationStrategy, setAllocationStrategy] = useState<AllocationStrategy>('goal-weighted');

  // Filter & Search states
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [horizonFilter, setHorizonFilter] = useState<string>('all');

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('50000');
  const [newCategory, setNewCategory] = useState('Emergency Reserve');
  const [newPriority, setNewPriority] = useState<GoalPriority>('high');
  const [newHorizon, setNewHorizon] = useState<GoalHorizon>('short-term');
  const [newDate, setNewDate] = useState('2026-12-31');
  const [newInterest, setNewInterest] = useState('18.5');
  const [newInflationAdjusted, setNewInflationAdjusted] = useState(true);

  // Gamification Badges
  const badges: AchievementBadge[] = [
    {
      id: 'bdg_emergency',
      title: 'Emergency Guard',
      description: 'Built a 6-month liquid cushion reserve',
      icon: '🛡️',
      unlocked: goals.some(g => g.category.toLowerCase().includes('emergency') && (g.currentAmount / g.targetAmount) >= 0.7)
    },
    {
      id: 'bdg_streak',
      title: '3-Month Streak Master',
      description: 'Consistent goal deposits for 90 days',
      icon: '🔥',
      unlocked: true
    },
    {
      id: 'bdg_gear',
      title: 'Work Gear Champion',
      description: 'Fully funded technology & productivity gear',
      icon: '💻',
      unlocked: goals.some(g => g.category.toLowerCase().includes('work') && g.currentAmount >= g.targetAmount)
    },
    {
      id: 'bdg_100k',
      title: 'Capital Milestone 100k',
      description: 'Accumulated 100,000+ in goal reserves',
      icon: '🏆',
      unlocked: goals.reduce((sum, g) => sum + g.currentAmount, 0) >= 100000
    }
  ];

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositGoalId) return;
    onDepositGoal(depositGoalId, parseFloat(depositAmount) || 0);
    setDepositGoalId(null);
  };

  const handleCreateGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    onAddGoal({
      id: `goal_${Date.now()}`,
      title: newTitle,
      targetAmount: parseFloat(newTarget) || 10000,
      currentAmount: 0,
      currency: primaryCurrency,
      targetDate: newDate,
      category: newCategory,
      color: '#4F8683',
      isCompleted: false,
      priority: newPriority,
      horizon: newHorizon,
      autoReallocate: true,
      annualInterestReturn: parseFloat(newInterest) || 0,
      inflationAdjusted: newInflationAdjusted
    });
    setNewTitle('');
    setShowAddModal(false);
  };

  // Filtered Goals
  const filteredGoals = goals.filter((g) => {
    if (priorityFilter !== 'all' && g.priority !== priorityFilter) return false;
    if (horizonFilter !== 'all' && g.horizon !== horizonFilter) return false;
    return true;
  });

  const totalSavedAllGoals = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTargetAllGoals = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallPct = totalTargetAllGoals > 0 ? Math.round((totalSavedAllGoals / totalTargetAllGoals) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top View Mode Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-[rgba(43,79,96,0.13)] p-2.5 rounded-2xl shadow-xs gap-2">
        <div className="flex bg-[#FAF6F2] p-1 rounded-xl border border-[rgba(43,79,96,0.12)]">
          <button
            onClick={() => setViewTab('track')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
              viewTab === 'track'
                ? 'bg-[#2B4F60] text-white shadow-xs'
                : 'text-[#5B6E75] hover:text-[#1B333F]'
            }`}
          >
            <Activity className="w-4 h-4 text-[#D98B6F]" />
            <span>Track Goals Day-to-Day</span>
          </button>

          <button
            onClick={() => setViewTab('manage')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
              viewTab === 'manage'
                ? 'bg-[#2B4F60] text-white shadow-xs'
                : 'text-[#5B6E75] hover:text-[#1B333F]'
            }`}
          >
            <Target className="w-4 h-4 text-[#EAD3CB]" />
            <span>Goal Portfolio & Allocator</span>
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#1B333F] border border-[rgba(43,79,96,0.15)] px-3.5 py-2 rounded-xl font-semibold text-xs inline-flex items-center space-x-1.5 transition cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#D98B6F]" />
          <span>+ Add Savings Target</span>
        </button>
      </div>

      {viewTab === 'track' ? (
        <TrackGoalsDashboard
          goals={goals}
          primaryCurrency={primaryCurrency}
          user={user}
          onDepositGoal={onDepositGoal}
          onOpenAddGoal={() => setShowAddModal(true)}
        />
      ) : (
        <>
          {/* Top Banner Header */}
          <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-serif font-medium text-[#1B333F] flex items-center space-x-2">
                  <Target className="w-6 h-6 text-[#845460]" />
                  <span>Smart Goal Engine & Dynamic Capital Allocation</span>
                </h2>
              </div>
              <p className="text-xs text-[#5B6E75] font-sans mt-0.5">
                Prioritized capital reserves, goal-weighting algorithms, and inflation-adjusted forecasts.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-1.5 bg-[#2B4F60] hover:bg-[#1B333F] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#D98B6F]" />
                <span>New Savings Target</span>
              </button>
            </div>
          </div>

      {/* Overview Stats & Behavioral Nudge */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Total Capital Reserve Card */}
        <div className="md:col-span-5 bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-5 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-[#5B6E75]">Total Capital Saved Across Goals</span>
            <span className="bg-[#EAD3CB] text-[#845460] font-mono font-bold px-2 py-0.5 rounded text-[11px]">
              {overallPct}% Completed
            </span>
          </div>

          <div className="flex items-baseline space-x-2 font-mono">
            <span className="text-2xl font-bold text-[#1B333F]">{totalSavedAllGoals.toLocaleString()}</span>
            <span className="text-xs text-[#5B6E75] font-semibold">{primaryCurrency}</span>
            <span className="text-xs text-[#5B6E75] pl-2">/ {totalTargetAllGoals.toLocaleString()} {primaryCurrency}</span>
          </div>

          <div className="w-full bg-[#FAF6F2] h-2.5 rounded-full overflow-hidden p-0.5 border border-[rgba(43,79,96,0.12)]">
            <div
              className="h-full rounded-full bg-[#4F8683] transition-all duration-500"
              style={{ width: `${overallPct}%` }}
            ></div>
          </div>
        </div>

        {/* Dynamic Allocation Engine & Strategy Controls */}
        <div className="md:col-span-7 bg-[#FAF6F2] border border-[rgba(43,79,96,0.13)] rounded-2xl p-5 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-medium text-[#1B333F] flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-[#D98B6F]" />
              <span>Dynamic Monthly Allocation Strategy</span>
            </span>
            <span className="text-[10px] text-[#5B6E75] font-mono">Weighted Auto-Split</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => {
                setAllocationStrategy('goal-weighted');
                if (onAutoReallocate) onAutoReallocate('goal-weighted');
              }}
              className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                allocationStrategy === 'goal-weighted'
                  ? 'bg-white border-[#2B4F60] text-[#1B333F] font-bold shadow-xs'
                  : 'bg-white/60 border-transparent text-[#5B6E75] hover:bg-white'
              }`}
            >
              <span className="block font-semibold">Goal-Weighted</span>
              <span className="text-[9px] text-[#5B6E75] block">High Priority = 3x</span>
            </button>

            <button
              onClick={() => {
                setAllocationStrategy('tapered');
                if (onAutoReallocate) onAutoReallocate('tapered');
              }}
              className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                allocationStrategy === 'tapered'
                  ? 'bg-white border-[#2B4F60] text-[#1B333F] font-bold shadow-xs'
                  : 'bg-white/60 border-transparent text-[#5B6E75] hover:bg-white'
              }`}
            >
              <span className="block font-semibold">Tapered Strategy</span>
              <span className="text-[9px] text-[#5B6E75] block">Aggressive early</span>
            </button>

            <button
              onClick={() => {
                setAllocationStrategy('equal');
                if (onAutoReallocate) onAutoReallocate('equal');
              }}
              className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                allocationStrategy === 'equal'
                  ? 'bg-white border-[#2B4F60] text-[#1B333F] font-bold shadow-xs'
                  : 'bg-white/60 border-transparent text-[#5B6E75] hover:bg-white'
              }`}
            >
              <span className="block font-semibold">Equal Split</span>
              <span className="text-[9px] text-[#5B6E75] block">1/N per goal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gamification & Milestone Badges */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-5 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-3">
        <span className="text-xs font-serif font-medium text-[#1B333F] flex items-center space-x-1.5">
          <Award className="w-4 h-4 text-[#845460]" />
          <span>Behavioral Milestones & Achievements</span>
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3 rounded-xl border transition flex items-center space-x-2.5 ${
                b.unlocked
                  ? 'bg-[#FAF6F2] border-[rgba(43,79,96,0.15)] text-[#1B333F]'
                  : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
              }`}
            >
              <span className="text-2xl">{b.icon}</span>
              <div>
                <span className="text-xs font-semibold block leading-tight">{b.title}</span>
                <span className="text-[10px] text-[#5B6E75] block leading-tight mt-0.5">{b.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtering Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[rgba(43,79,96,0.13)] rounded-xl p-3 shadow-xs text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-[#2B4F60]" />
          <span className="font-semibold text-[#1B333F]">Filter Goals:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#FAF6F2] border border-[rgba(43,79,96,0.15)] rounded-lg px-2.5 py-1 text-[#1B333F] font-semibold focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Horizon filter */}
          <select
            value={horizonFilter}
            onChange={(e) => setHorizonFilter(e.target.value)}
            className="bg-[#FAF6F2] border border-[rgba(43,79,96,0.15)] rounded-lg px-2.5 py-1 text-[#1B333F] font-semibold focus:outline-none"
          >
            <option value="all">All Horizons</option>
            <option value="short-term">Short-Term (&lt; 1 yr)</option>
            <option value="medium-term">Medium-Term (1-3 yrs)</option>
            <option value="long-term">Long-Term (3+ yrs)</option>
            <option value="recurring-obligation">Recurring Obligation</option>
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

          return (
            <div
              key={goal.id}
              className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] space-y-4 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-1.5 mb-1">
                      {goal.priority === 'high' && (
                        <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                          HIGH
                        </span>
                      )}
                      {goal.priority === 'medium' && (
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                          MEDIUM
                        </span>
                      )}
                      {goal.horizon && (
                        <span className="bg-[#FAF6F2] text-[#5B6E75] text-[9px] font-mono px-1.5 py-0.2 rounded border border-[rgba(43,79,96,0.12)] capitalize">
                          {goal.horizon.replace('-', ' ')}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-serif font-medium text-[#1B333F]">{goal.title}</h3>
                    <span className="text-[11px] text-[#5B6E75] capitalize block mt-0.5">
                      {goal.category} • Target Date: {goal.targetDate}
                    </span>
                  </div>

                  <span className="bg-[#EAD3CB]/60 text-[#6A414B] font-mono font-bold px-2.5 py-1 rounded-md text-xs shrink-0">
                    {pct}%
                  </span>
                </div>

                {/* Return / Inflation tags */}
                <div className="flex items-center space-x-2 text-[10px] text-[#5B6E75] font-mono pt-1">
                  {goal.annualInterestReturn && goal.annualInterestReturn > 0 ? (
                    <span className="text-[#4F8683] font-bold flex items-center space-x-0.5">
                      <Percent className="w-3 h-3" />
                      <span>{goal.annualInterestReturn}% APY</span>
                    </span>
                  ) : null}
                  {goal.inflationAdjusted && (
                    <span className="bg-teal-50 text-teal-800 px-1.5 py-0.2 rounded">
                      Inflation Guarded
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-[#FAF6F2] h-2.5 rounded-full overflow-hidden p-0.5 border border-[rgba(43,79,96,0.12)]">
                  <div
                    className="h-full rounded-full bg-[#4F8683] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#4F8683] font-bold">{goal.currentAmount.toLocaleString()} {primaryCurrency}</span>
                  <span className="text-[#5B6E75]">{goal.targetAmount.toLocaleString()} {primaryCurrency}</span>
                </div>
              </div>

              <button
                onClick={() => setDepositGoalId(goal.id)}
                className="w-full bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#2B4F60] font-semibold py-2.5 rounded-xl text-xs transition border border-[rgba(43,79,96,0.15)] flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <PiggyBank className="w-4 h-4 text-[#845460]" />
                <span>Deposit Funds</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Multi-Goal Optimization Engine */}
      <MultiGoalOptimizer
        goals={filteredGoals}
        user={{} as any}
        currency={primaryCurrency}
        monthlyAvailableSavings={25000}
        onUpdateGoals={(updated) => {
          // Update goal targets or expected monthly contributions
        }}
      />

      {/* Deposit Modal */}
      {depositGoalId && (
        <div className="fixed inset-0 z-50 bg-[#1B333F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleDepositSubmit} className="bg-white border border-[rgba(43,79,96,0.15)] rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[rgba(43,79,96,0.12)] pb-2.5">
              <h3 className="font-serif font-medium text-[#1B333F] text-base">Deposit Funds into Goal</h3>
              <button type="button" onClick={() => setDepositGoalId(null)} className="text-[#5B6E75] hover:text-[#1B333F] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#5B6E75] block mb-1">Deposit Amount ({primaryCurrency})</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] font-mono font-bold focus:outline-none focus:border-[#845460]"
              />
            </div>

            <button type="submit" className="w-full bg-[#4F8683] hover:bg-[#4F8683]/90 text-white font-semibold py-2.5 rounded-xl text-xs cursor-pointer shadow-xs">
              Confirm Deposit
            </button>
          </form>
        </div>
      )}
        </>
      )}

      {/* Create New Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#1B333F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateGoalSubmit} className="bg-white border border-[rgba(43,79,96,0.15)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[rgba(43,79,96,0.12)] pb-2.5">
              <h3 className="font-serif font-medium text-[#1B333F] text-base">Create New Savings Target</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-[#5B6E75] hover:text-[#1B333F] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#5B6E75] block mb-1">Goal Name</label>
              <input
                type="text"
                placeholder="e.g. Retirement Reserve, Medical Guard"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] text-xs focus:outline-none focus:border-[#845460]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#5B6E75] block mb-1">Target Amount ({primaryCurrency})</label>
                <input
                  type="number"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] font-mono font-bold text-xs focus:outline-none focus:border-[#845460]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5B6E75] block mb-1">Target Deadline</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] text-xs focus:outline-none focus:border-[#845460]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#5B6E75] block mb-1">Priority Level</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as GoalPriority)}
                  className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] text-xs font-medium focus:outline-none"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5B6E75] block mb-1">Time Horizon</label>
                <select
                  value={newHorizon}
                  onChange={(e) => setNewHorizon(e.target.value as GoalHorizon)}
                  className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] text-xs font-medium focus:outline-none"
                >
                  <option value="short-term">Short-Term (&lt;1 yr)</option>
                  <option value="medium-term">Medium-Term (1-3 yrs)</option>
                  <option value="long-term">Long-Term (3+ yrs)</option>
                  <option value="recurring-obligation">Recurring Obligation</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#5B6E75] block mb-1">Annual Return / Interest (%)</label>
                <input
                  type="number"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-5">
                <input
                  type="checkbox"
                  id="infl_chk"
                  checked={newInflationAdjusted}
                  onChange={(e) => setNewInflationAdjusted(e.target.checked)}
                  className="w-4 h-4 accent-[#2B4F60]"
                />
                <label htmlFor="infl_chk" className="text-xs font-medium text-[#1B333F] cursor-pointer">
                  Inflation Adjustment Guard
                </label>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#2B4F60] hover:bg-[#1B333F] text-white font-semibold py-2.5 rounded-xl text-xs cursor-pointer shadow-xs">
              Create Goal
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
