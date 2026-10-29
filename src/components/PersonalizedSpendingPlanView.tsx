import React, { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  Calendar, 
  TrendingUp, 
  PieChart, 
  ShieldCheck, 
  DollarSign, 
  ShoppingBag, 
  Utensils, 
  Car, 
  Home, 
  Tv, 
  ChevronRight, 
  AlertCircle, 
  ArrowUpRight, 
  RefreshCw,
  CheckCircle2,
  Lock,
  Zap,
  Award
} from 'lucide-react';
import { UserProfile, AIPersonalizedSpendingPlan, FinancialGoal } from '../types';

interface PersonalizedSpendingPlanViewProps {
  user: UserProfile;
  goals: FinancialGoal[];
  currency: string;
  onUpdatePlan?: (plan: AIPersonalizedSpendingPlan) => void;
}

export const PersonalizedSpendingPlanView: React.FC<PersonalizedSpendingPlanViewProps> = ({
  user,
  goals,
  currency,
  onUpdatePlan
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const primaryGoal = user.primaryGoal;
  const plan = user.aiSpendingPlan;

  const handleRecomputePlan = async () => {
    setIsRefreshing(true);
    try {
      const resp = await fetch('/api/ai/personalized-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyIncome: 65000,
          currency: currency,
          primaryGoal: primaryGoal,
          subscriptionsTotal: 3000,
          liquidAccountsTotal: 100000
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.plan && onUpdatePlan) {
          onUpdatePlan(data.plan);
        }
      }
    } catch (err) {
      console.error('Failed to recalculate AI plan:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!plan) {
    return (
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-8 text-center space-y-4">
        <Target className="w-12 h-12 text-[#2B4F60] mx-auto opacity-40" />
        <h3 className="text-lg font-serif font-bold text-[#1B333F]">No AI Personalized Plan Found</h3>
        <p className="text-xs text-[#5B6E75] max-w-md mx-auto">
          Complete your onboarding goal questionnaire to generate a weekly spending allowance tailored to your net worth or savings goals.
        </p>
        <button
          onClick={handleRecomputePlan}
          className="bg-[#2B4F60] text-white px-5 py-2.5 rounded-xl font-semibold text-xs inline-flex items-center space-x-2 shadow-xs cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#D98B6F]" />
          <span>Generate AI Spending Plan</span>
        </button>
      </div>
    );
  }

  const categoryIcons: Record<string, any> = {
    groceries: ShoppingBag,
    housing: Home,
    transport: Car,
    diningOut: Utensils,
    entertainment: Tv,
    shopping: ShoppingBag,
    utilities: Zap,
    goalSavingsOrDebt: Target
  };

  const categoryNames: Record<string, string> = {
    groceries: 'Groceries & Household',
    housing: 'Housing & Utilities',
    transport: 'Commute & Fuel',
    diningOut: 'Dining Out & Delivery',
    entertainment: 'Leisure & Entertainment',
    shopping: 'Shopping & Apparel',
    utilities: 'Internet & Mobile Bills',
    goalSavingsOrDebt: 'Direct Goal Allocation'
  };

  return (
    <div className="space-y-6 text-xs text-[#22323A]">
      {/* Top Banner: Goal Context & Headline */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(43,79,96,0.12)] pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-[#FAF6F2] border border-[rgba(43,79,96,0.12)] px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#D98B6F]" />
              <span className="text-[10px] font-bold text-[#2B4F60] uppercase tracking-wider">
                AI Goal-Driven Strategy
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1B333F]">
              {plan.strategyTitle}
            </h2>
            <p className="text-xs text-[#5B6E75]">
              Target Goal: <span className="font-semibold text-[#1B333F]">{primaryGoal?.title || 'Financial Milestone'}</span> ({primaryGoal?.targetAmount?.toLocaleString()} {currency})
            </p>
          </div>

          <button
            onClick={handleRecomputePlan}
            disabled={isRefreshing}
            className="self-start md:self-auto bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#1B333F] border border-[rgba(43,79,96,0.15)] font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#845460] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Recalculate AI Plan</span>
          </button>
        </div>

        {/* Executive Summary */}
        <p className="text-xs text-[#5B6E75] leading-relaxed">
          {plan.strategySummary}
        </p>
      </div>

      {/* Main KPI Cards: Weekly Cap & Monthly Reserve */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weekly Spending Cap */}
        <div className="bg-[#2B4F60] text-white rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <DollarSign className="w-24 h-24 text-white" />
          </div>
          <span className="text-[11px] text-teal-200 font-semibold uppercase tracking-wider block">
            Weekly Spending Limit
          </span>
          <div className="flex items-baseline space-x-2 font-mono">
            <span className="text-3xl font-bold">{plan.weeklySpendingLimit.toLocaleString()}</span>
            <span className="text-xs text-teal-100">{currency} / week</span>
          </div>
          <p className="text-[11px] text-teal-100/80">
            Maximum total weekly allowance across all non-goal categories to guarantee hitting your milestone on time.
          </p>
        </div>

        {/* Monthly Spending Cap */}
        <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-6 shadow-sm space-y-3">
          <span className="text-[11px] text-[#5B6E75] font-semibold uppercase tracking-wider block">
            Monthly Spending Cap
          </span>
          <div className="flex items-baseline space-x-2 font-mono text-[#1B333F]">
            <span className="text-3xl font-bold">{plan.monthlySpendingLimit.toLocaleString()}</span>
            <span className="text-xs text-[#5B6E75]">{currency} / month</span>
          </div>
          <p className="text-[11px] text-[#5B6E75]">
            Calculated allowable monthly budget ceiling for living and discretionary spending.
          </p>
        </div>

        {/* Dedicated Goal Contribution */}
        <div className="bg-[#FAF6F2] border border-[#4F8683]/30 rounded-3xl p-6 shadow-sm space-y-3">
          <span className="text-[11px] text-[#4F8683] font-bold uppercase tracking-wider block flex items-center space-x-1">
            <Target className="w-3.5 h-3.5" />
            <span>Monthly Goal Contribution</span>
          </span>
          <div className="flex items-baseline space-x-2 font-mono text-[#1B333F]">
            <span className="text-3xl font-bold text-[#4F8683]">
              {plan.recommendedSavingsOrDebtMonthly.toLocaleString()}
            </span>
            <span className="text-xs text-[#5B6E75]">{currency} / month</span>
          </div>
          <p className="text-[11px] text-[#5B6E75]">
            Set aside <span className="font-mono font-bold text-[#1B333F]">{plan.recommendedSavingsOrDebtWeekly.toLocaleString()} {currency}/week</span> directly toward your goal.
          </p>
        </div>
      </div>

      {/* Category Division Section */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-4">
        <div className="flex items-center justify-between border-b border-[rgba(43,79,96,0.12)] pb-3">
          <div>
            <h3 className="text-sm font-serif font-bold text-[#1B333F] flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-[#845460]" />
              <span>AI Category Division & Weekly Allowances</span>
            </h3>
            <p className="text-[11px] text-[#5B6E75]">
              Exact category caps determined by the AI to align with your personal timeline
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(plan.categoryBreakdown).map(([catKey, detailsObj]) => {
            const details = detailsObj as { monthly: number; weekly: number; percentage: number };
            const IconComp = categoryIcons[catKey] || DollarSign;
            const label = categoryNames[catKey] || catKey;
            const isGoalCat = catKey === 'goalSavingsOrDebt';

            return (
              <div 
                key={catKey}
                className={`p-4 rounded-2xl border transition ${
                  isGoalCat 
                    ? 'bg-teal-50/60 border-teal-200' 
                    : 'bg-[#FAF6F2]/60 border-[rgba(43,79,96,0.12)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-xl ${isGoalCat ? 'bg-teal-100 text-teal-800' : 'bg-white text-[#2B4F60] border border-[rgba(43,79,96,0.1)]'}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-[#1B333F] block">{label}</span>
                      <span className="text-[10px] text-[#5B6E75] font-mono">{details.percentage}% of Monthly Net Income</span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-sm font-bold text-[#1B333F] block">{details.weekly.toLocaleString()} {currency}</span>
                    <span className="text-[10px] text-[#5B6E75]">/ week</span>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[rgba(43,79,96,0.1)]">
                  <div 
                    className={`h-full ${isGoalCat ? 'bg-[#4F8683]' : 'bg-[#2B4F60]'}`}
                    style={{ width: `${Math.min(100, details.percentage * 2.5)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI-Driven Recommendations & Investment Allocations */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-4">
        <div className="border-b border-[rgba(43,79,96,0.12)] pb-3 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-serif font-bold text-[#1B333F] flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[#D98B6F]" />
              <span>AI Investment & High-Yield Strategy Allocations</span>
            </h3>
            <p className="text-[11px] text-[#5B6E75]">
              Recommended financial instruments to accelerate goal attainment and protect against inflation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(plan.investmentRecommendations || []).map((inv) => (
            <div 
              key={inv.id}
              className="p-4 bg-[#FAF6F2] border border-[rgba(43,79,96,0.12)] rounded-2xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    inv.riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {inv.riskLevel} Risk
                  </span>
                  <span className="text-xs font-mono font-bold text-[#2B4F60]">
                    {inv.recommendedAllocationPct}% Allocation
                  </span>
                </div>

                <h4 className="font-serif font-bold text-[#1B333F] text-xs">
                  {inv.title}
                </h4>

                <p className="text-[11px] text-[#5B6E75] leading-relaxed">
                  {inv.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[rgba(43,79,96,0.1)] flex items-center justify-between font-mono">
                <span className="text-[10px] text-[#5B6E75] uppercase">Expected Yield</span>
                <span className="text-xs font-bold text-[#845460]">{inv.expectedYield}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
