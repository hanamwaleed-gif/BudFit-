import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Target, 
  PieChart, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw,
  Layers
} from 'lucide-react';
import { FinancialGoal, UserProfile } from '../types';

interface MultiGoalOptimizerProps {
  goals: FinancialGoal[];
  user: UserProfile;
  currency: string;
  monthlyAvailableSavings: number;
  onUpdateGoals: (updatedGoals: FinancialGoal[]) => void;
}

export const MultiGoalOptimizer: React.FC<MultiGoalOptimizerProps> = ({
  goals,
  user,
  currency,
  monthlyAvailableSavings,
  onUpdateGoals
}) => {
  const [strategy, setStrategy] = useState<'weighted' | 'equal' | 'tapered'>('weighted');
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    goals.forEach(g => {
      initial[g.id] = g.priority === 'high' ? 50 : g.priority === 'medium' ? 30 : 20;
    });
    return initial;
  });

  const totalWeight = (Object.values(weights) as number[]).reduce((sum, w) => sum + w, 0) || 1;

  // Calculate algorithmic monthly allocation per goal
  const calculateAllocations = () => {
    return goals.map(goal => {
      let monthlyContrib = 0;
      if (strategy === 'equal') {
        monthlyContrib = Math.round(monthlyAvailableSavings / (goals.length || 1));
      } else if (strategy === 'weighted') {
        const goalWeight = Number(weights[goal.id]) || 20;
        monthlyContrib = Math.round((monthlyAvailableSavings * goalWeight) / totalWeight);
      } else if (strategy === 'tapered') {
        // High urgency / debt payoff gets 60%, rest split
        const isDebt = goal.category === 'debt' || goal.priority === 'high';
        monthlyContrib = isDebt 
          ? Math.round(monthlyAvailableSavings * 0.55) 
          : Math.round((monthlyAvailableSavings * 0.45) / (goals.length - 1 || 1));
      }

      const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
      const monthsToReach = monthlyContrib > 0 ? Math.ceil(remaining / monthlyContrib) : 999;

      return {
        goal,
        monthlyContrib,
        monthsToReach,
        weight: weights[goal.id] || 20
      };
    });
  };

  const allocations = calculateAllocations();

  const handleApplyAllocation = () => {
    const updated = goals.map(g => {
      const alloc = allocations.find(a => a.goal.id === g.id);
      if (alloc) {
        return {
          ...g,
          expectedMonthlyContrib: alloc.monthlyContrib
        };
      }
      return g;
    });

    onUpdateGoals(updated);
  };

  return (
    <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-5 text-xs text-[#22323A]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(43,79,96,0.12)] pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-[#FAF6F2] border border-[rgba(43,79,96,0.12)] px-2.5 py-1 rounded-full mb-1">
            <Sliders className="w-3.5 h-3.5 text-[#2B4F60]" />
            <span className="text-[10px] font-bold text-[#2B4F60] uppercase tracking-wider">
              Algorithmic Multi-Goal Optimizer
            </span>
          </div>
          <h3 className="text-base font-serif font-bold text-[#1B333F]">
            Maximize Progress Across All Financial Goals Simultaneously
          </h3>
          <p className="text-xs text-[#5B6E75]">
            Auto-distribute your monthly net reserve ({monthlyAvailableSavings.toLocaleString()} {currency}/mo) using mathematical optimization algorithms.
          </p>
        </div>

        {/* Strategy Selector */}
        <div className="flex bg-[#FAF6F2] p-1 rounded-2xl border border-[rgba(43,79,96,0.12)] self-start sm:self-auto">
          <button
            onClick={() => setStrategy('weighted')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
              strategy === 'weighted' ? 'bg-[#2B4F60] text-white shadow-xs' : 'text-[#5B6E75]'
            }`}
          >
            Goal-Weighted
          </button>
          <button
            onClick={() => setStrategy('tapered')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
              strategy === 'tapered' ? 'bg-[#2B4F60] text-white shadow-xs' : 'text-[#5B6E75]'
            }`}
          >
            Debt-First Tapered
          </button>
          <button
            onClick={() => setStrategy('equal')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
              strategy === 'equal' ? 'bg-[#2B4F60] text-white shadow-xs' : 'text-[#5B6E75]'
            }`}
          >
            Equal Split
          </button>
        </div>
      </div>

      {/* Goal Allocation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allocations.map(({ goal, monthlyContrib, monthsToReach }) => {
          const progressPct = Math.round((goal.currentAmount / goal.targetAmount) * 100);

          return (
            <div 
              key={goal.id} 
              className="p-4 bg-[#FAF6F2] border border-[rgba(43,79,96,0.12)] rounded-2xl space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-[#1B333F] text-xs block">{goal.title}</span>
                  <span className="text-[10px] text-[#5B6E75] font-mono">
                    Target: {goal.targetAmount.toLocaleString()} {currency}
                  </span>
                </div>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  goal.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {goal.priority || 'medium'} priority
                </span>
              </div>

              {/* Slider for weighted strategy */}
              {strategy === 'weighted' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#5B6E75]">Priority Weight</span>
                    <span className="font-bold text-[#2B4F60]">{weights[goal.id] || 20}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={weights[goal.id] || 20}
                    onChange={(e) => setWeights({ ...weights, [goal.id]: Number(e.target.value) })}
                    className="w-full accent-[#2B4F60] cursor-pointer"
                  />
                </div>
              )}

              {/* Calculated Monthly Contribution & Months */}
              <div className="grid grid-cols-2 gap-2 p-2 bg-white rounded-xl border border-[rgba(43,79,96,0.1)] text-center font-mono">
                <div>
                  <span className="text-[10px] text-[#5B6E75] block font-sans">Monthly Allocation</span>
                  <span className="font-bold text-[#4F8683]">{monthlyContrib.toLocaleString()} {currency}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5B6E75] block font-sans">Est. Time to Goal</span>
                  <span className="font-bold text-[#1B333F]">{monthsToReach < 99 ? `${monthsToReach} mos` : '—'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex justify-end">
        <button
          onClick={handleApplyAllocation}
          className="bg-[#4F8683] hover:bg-[#4F8683]/90 text-white font-semibold px-5 py-2.5 rounded-xl text-xs inline-flex items-center space-x-2 shadow-xs cursor-pointer transition"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Apply Algorithmic Allocation to All Goals</span>
        </button>
      </div>
    </div>
  );
};
