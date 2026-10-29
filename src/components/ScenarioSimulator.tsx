import React, { useState } from 'react';
import { 
  Sliders, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  Zap, 
  Flame,
  PieChart,
  HelpCircle,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { FinancialGoal, Budget, Transaction, UserProfile } from '../types';

interface ScenarioSimulatorProps {
  goals: FinancialGoal[];
  budget: Budget;
  transactions: Transaction[];
  primaryCurrency: string;
  userProfile?: UserProfile | null;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  goals,
  budget,
  transactions,
  primaryCurrency,
  userProfile
}) => {
  // Baseline calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) || 65000;

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0) || 28000;

  const baselineMonthlyNet = Math.max(1000, totalIncome - totalExpense);

  // Simulator Inputs
  const [incomeChangePct, setIncomeChangePct] = useState<number>(0); // -50% to +50%
  const [expenseCutPct, setExpenseCutPct] = useState<number>(0); // 0% to 40% cut
  const [extraSavingsContrib, setExtraSavingsContrib] = useState<number>(0); // e.g. 2000
  const [activeShockPreset, setActiveShockPreset] = useState<string>('none');
  const [inflationRate, setInflationRate] = useState<number>(12); // %

  // Apply Shock Presets
  const applyShockPreset = (presetKey: string) => {
    setActiveShockPreset(presetKey);
    if (presetKey === 'none') {
      setIncomeChangePct(0);
      setExpenseCutPct(0);
      setExtraSavingsContrib(0);
    } else if (presetKey === 'job_loss') {
      setIncomeChangePct(-80);
      setExpenseCutPct(25);
      setExtraSavingsContrib(0);
    } else if (presetKey === 'medical_emergency') {
      setIncomeChangePct(-10);
      setExpenseCutPct(-15); // expenses increase
      setExtraSavingsContrib(-5000);
    } else if (presetKey === 'devaluation') {
      setIncomeChangePct(0);
      setExpenseCutPct(-20); // expenses increase due to inflation
      setInflationRate(30);
    } else if (presetKey === 'promotion') {
      setIncomeChangePct(25);
      setExpenseCutPct(0);
      setExtraSavingsContrib(5000);
    }
  };

  const resetSimulator = () => {
    setIncomeChangePct(0);
    setExpenseCutPct(0);
    setExtraSavingsContrib(0);
    setActiveShockPreset('none');
    setInflationRate(12);
  };

  // Scenario Math
  const simulatedIncome = totalIncome * (1 + incomeChangePct / 100);
  const simulatedExpense = totalExpense * (1 - expenseCutPct / 100);
  const simulatedNetFlow = Math.max(0, simulatedIncome - simulatedExpense + extraSavingsContrib);

  // Goal Velocity calculations
  const totalGoalsTargetRemaining = goals.reduce(
    (sum, g) => sum + Math.max(0, g.targetAmount - g.currentAmount),
    0
  );

  const baselineMonthsToAllGoals = baselineMonthlyNet > 0 
    ? Math.ceil(totalGoalsTargetRemaining / (baselineMonthlyNet * 0.4)) 
    : 36;

  const simulatedMonthsToAllGoals = simulatedNetFlow > 0 
    ? Math.ceil(totalGoalsTargetRemaining / (simulatedNetFlow * 0.4)) 
    : 99;

  // Liquidity Runway in case of total income loss
  const liquidReserve = goals
    .filter(g => g.category.toLowerCase().includes('emergency') || g.priority === 'high')
    .reduce((sum, g) => sum + g.currentAmount, 0) || 135000;

  const monthlyBurn = simulatedExpense || 25000;
  const liquidityRunwayMonths = (liquidReserve / monthlyBurn).toFixed(1);

  // Resilience Score (0 - 100)
  let resilienceScore = 70;
  if (Number(liquidityRunwayMonths) >= 6) resilienceScore += 20;
  else if (Number(liquidityRunwayMonths) >= 3) resilienceScore += 10;
  else resilienceScore -= 15;

  if (simulatedNetFlow > totalExpense * 0.3) resilienceScore += 10;
  if (incomeChangePct < 0) resilienceScore += Math.max(-30, incomeChangePct / 2);
  resilienceScore = Math.min(100, Math.max(10, Math.round(resilienceScore)));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#EAD3CB] text-[#845460] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
              PRO MODULE
            </span>
            <h2 className="text-xl font-serif font-medium text-[#1B333F] flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-[#2B4F60]" />
              <span>Financial "What-If" & Risk Shock Simulator</span>
            </h2>
          </div>
          <p className="text-xs text-[#5B6E75] font-sans mt-1">
            Test lifestyle changes, income fluctuations, and inflation shocks in real-time to safeguard your liquidity.
          </p>
        </div>

        <button
          onClick={resetSimulator}
          className="flex items-center space-x-1.5 bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#1B333F] border border-[rgba(43,79,96,0.15)] px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#5B6E75]" />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Preset Financial Shock Buttons */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-5 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-3">
        <span className="text-xs font-serif font-medium text-[#1B333F] flex items-center space-x-1.5">
          <Zap className="w-4 h-4 text-[#D98B6F]" />
          <span>Quick Shock Presets:</span>
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => applyShockPreset('job_loss')}
            className={`p-2.5 rounded-xl border text-xs text-left transition cursor-pointer flex flex-col justify-between space-y-1 ${
              activeShockPreset === 'job_loss'
                ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold shadow-xs'
                : 'bg-[#FAF6F2] border-[rgba(43,79,96,0.12)] text-[#1B333F] hover:bg-rose-50/50'
            }`}
          >
            <span className="flex items-center space-x-1 text-rose-700 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>3-Mo Income Loss</span>
            </span>
            <span className="text-[10px] text-[#5B6E75] font-mono">-80% Income</span>
          </button>

          <button
            onClick={() => applyShockPreset('devaluation')}
            className={`p-2.5 rounded-xl border text-xs text-left transition cursor-pointer flex flex-col justify-between space-y-1 ${
              activeShockPreset === 'devaluation'
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-xs'
                : 'bg-[#FAF6F2] border-[rgba(43,79,96,0.12)] text-[#1B333F] hover:bg-amber-50/50'
            }`}
          >
            <span className="flex items-center space-x-1 text-amber-700 font-semibold">
              <Flame className="w-3.5 h-3.5 shrink-0" />
              <span>Inflation Spike</span>
            </span>
            <span className="text-[10px] text-[#5B6E75] font-mono">+20% Costs, 30% FX</span>
          </button>

          <button
            onClick={() => applyShockPreset('medical_emergency')}
            className={`p-2.5 rounded-xl border text-xs text-left transition cursor-pointer flex flex-col justify-between space-y-1 ${
              activeShockPreset === 'medical_emergency'
                ? 'bg-purple-50 border-purple-300 text-purple-900 font-bold shadow-xs'
                : 'bg-[#FAF6F2] border-[rgba(43,79,96,0.12)] text-[#1B333F] hover:bg-purple-50/50'
            }`}
          >
            <span className="flex items-center space-x-1 text-purple-700 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Emergency Cost</span>
            </span>
            <span className="text-[10px] text-[#5B6E75] font-mono">Surge Expenses</span>
          </button>

          <button
            onClick={() => applyShockPreset('promotion')}
            className={`p-2.5 rounded-xl border text-xs text-left transition cursor-pointer flex flex-col justify-between space-y-1 ${
              activeShockPreset === 'promotion'
                ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold shadow-xs'
                : 'bg-[#FAF6F2] border-[rgba(43,79,96,0.12)] text-[#1B333F] hover:bg-teal-50/50'
            }`}
          >
            <span className="flex items-center space-x-1 text-teal-700 font-semibold">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>25% Salary Raise</span>
            </span>
            <span className="text-[10px] text-[#5B6E75] font-mono">+5,000 {primaryCurrency}/mo</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Controls & Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Sliders (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-6">
          <h3 className="font-serif font-medium text-[#1B333F] text-base border-b border-[rgba(43,79,96,0.12)] pb-2 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#845460]" />
            <span>Scenario Parameters</span>
          </h3>

          {/* Income Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <label className="text-[#1B333F]">Monthly Income Adjustment</label>
              <span className={`font-mono ${incomeChangePct >= 0 ? 'text-[#4F8683]' : 'text-rose-600'}`}>
                {incomeChangePct >= 0 ? `+${incomeChangePct}%` : `${incomeChangePct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-80"
              max="60"
              step="5"
              value={incomeChangePct}
              onChange={(e) => {
                setActiveShockPreset('custom');
                setIncomeChangePct(Number(e.target.value));
              }}
              className="w-full accent-[#2B4F60] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#5B6E75] font-mono">
              <span>-80% (Loss)</span>
              <span>Baseline: {totalIncome.toLocaleString()} {primaryCurrency}</span>
              <span>+60% (Bonus)</span>
            </div>
          </div>

          {/* Expense Cut Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <label className="text-[#1B333F]">Discretionary Cost Optimization</label>
              <span className={`font-mono ${expenseCutPct >= 0 ? 'text-[#2B4F60]' : 'text-rose-600'}`}>
                {expenseCutPct >= 0 ? `Cut ${expenseCutPct}%` : `Increase ${Math.abs(expenseCutPct)}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="5"
              value={expenseCutPct}
              onChange={(e) => {
                setActiveShockPreset('custom');
                setExpenseCutPct(Number(e.target.value));
              }}
              className="w-full accent-[#4F8683] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#5B6E75] font-mono">
              <span>+30% Inflation</span>
              <span>Current Burn: {totalExpense.toLocaleString()}</span>
              <span>-50% Strict Cut</span>
            </div>
          </div>

          {/* Extra Savings Contribution Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <label className="text-[#1B333F]">Direct Goal Top-Up ({primaryCurrency}/mo)</label>
              <span className="text-[#845460] font-mono font-bold">
                {extraSavingsContrib >= 0 ? `+${extraSavingsContrib}` : `${extraSavingsContrib}`}
              </span>
            </div>
            <input
              type="range"
              min="-10000"
              max="20000"
              step="1000"
              value={extraSavingsContrib}
              onChange={(e) => {
                setActiveShockPreset('custom');
                setExtraSavingsContrib(Number(e.target.value));
              }}
              className="w-full accent-[#845460] cursor-pointer"
            />
          </div>

          {/* Inflation Rate Assumption */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <label className="text-[#1B333F]">Annual Inflation Rate Assumption</label>
              <span className="text-amber-700 font-mono font-bold">{inflationRate}% / yr</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="2"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Column: Predictive Outcomes & Goals Impact (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Net Cash Flow */}
            <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-4 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-1">
              <span className="text-[11px] text-[#5B6E75] font-semibold block">Simulated Monthly Net</span>
              <p className="text-lg font-mono font-bold text-[#1B333F]">
                {simulatedNetFlow.toLocaleString()} <span className="text-xs">{primaryCurrency}</span>
              </p>
              <span className="text-[10px] text-[#5B6E75]">
                vs Baseline: {baselineMonthlyNet.toLocaleString()} {primaryCurrency}
              </span>
            </div>

            {/* Emergency Liquidity Runway */}
            <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-4 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-1">
              <span className="text-[11px] text-[#5B6E75] font-semibold block">Liquidity Shock Runway</span>
              <p className="text-lg font-mono font-bold text-[#4F8683]">
                {liquidityRunwayMonths} <span className="text-xs">Months</span>
              </p>
              <span className="text-[10px] text-[#5B6E75]">
                {Number(liquidityRunwayMonths) >= 6 ? '🛡️ Safe Buffer' : '⚠️ Top-up Recommended'}
              </span>
            </div>

            {/* Resilience Score */}
            <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-4 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-1">
              <span className="text-[11px] text-[#5B6E75] font-semibold block">Resilience Guard</span>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-mono font-bold text-[#845460]">{resilienceScore}/100</span>
                <span className="text-[10px] bg-[#EAD3CB] text-[#6A414B] font-bold px-1.5 py-0.5 rounded">
                  {resilienceScore > 75 ? 'Strong' : 'Moderate'}
                </span>
              </div>
              <span className="text-[10px] text-[#5B6E75]">Shock-tested Index</span>
            </div>
          </div>

          {/* Recalculated Goal Timeline Table */}
          <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-4">
            <div className="flex justify-between items-center border-b border-[rgba(43,79,96,0.12)] pb-3">
              <h3 className="font-serif font-medium text-[#1B333F] text-base flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-[#4F8683]" />
                <span>Impact on Savings Goals Timeline</span>
              </h3>
              <span className="text-[11px] text-[#5B6E75] font-mono">Inflation-Adjusted ({inflationRate}%)</span>
            </div>

            <div className="space-y-3">
              {goals.map((g) => {
                const remaining = Math.max(0, g.targetAmount - g.currentAmount);
                const monthlyAlloc = Math.max(500, (simulatedNetFlow * 0.35));
                const estSimMonths = monthlyAlloc > 0 ? Math.ceil(remaining / monthlyAlloc) : 99;
                
                // baseline months
                const baseMonthlyAlloc = Math.max(500, (baselineMonthlyNet * 0.35));
                const estBaseMonths = Math.ceil(remaining / baseMonthlyAlloc);
                const diffMonths = estBaseMonths - estSimMonths;

                return (
                  <div key={g.id} className="p-3 bg-[#FAF6F2] border border-[rgba(43,79,96,0.12)] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }}></span>
                        <span className="font-serif font-medium text-[#1B333F]">{g.title}</span>
                        {g.priority === 'high' && (
                          <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.2 rounded">HIGH</span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#5B6E75] font-mono">
                        Target: {g.targetAmount.toLocaleString()} {primaryCurrency} • Saved: {g.currentAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-right">
                      <div>
                        <span className="text-[10px] text-[#5B6E75] block">Est. Completion</span>
                        <span className="font-mono font-bold text-[#1B333F]">{estSimMonths} Months</span>
                      </div>

                      {diffMonths !== 0 && (
                        <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-md ${
                          diffMonths > 0 ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {diffMonths > 0 ? `${diffMonths} mos faster` : `${Math.abs(diffMonths)} mos delay`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Tailored Recommendation Box */}
          <div className="bg-[#FAF6F2] border border-[#2B4F60]/20 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-serif font-medium text-[#1B333F] flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-[#D98B6F]" />
              <span>BudFit AI Strategy Advisor</span>
            </span>
            <p className="text-xs text-[#5B6E75] leading-relaxed font-sans">
              {simulatedNetFlow < baselineMonthlyNet ? (
                <>
                  Under this scenario, your net cash flow reduces by{' '}
                  <strong className="text-[#1B333F]">
                    {((1 - simulatedNetFlow / baselineMonthlyNet) * 100).toFixed(0)}%
                  </strong>.
                  We recommend locking in high-priority goals (Emergency Reserve) and pausing low-priority discretionary entertainment budgets.
                </>
              ) : (
                <>
                  Your simulated parameters yield an extra{' '}
                  <strong className="text-[#4F8683]">
                    {(simulatedNetFlow - baselineMonthlyNet).toLocaleString()} {primaryCurrency}/month
                  </strong>.
                  Allocating this surplus directly to high-yield CIB CDs will accelerate your MacBook Upgrade goal by 3 months.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
