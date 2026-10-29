import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  CreditCard, 
  Tv, 
  Music, 
  Bot, 
  Dumbbell, 
  Wifi, 
  DollarSign, 
  PiggyBank, 
  ShieldAlert, 
  Plus, 
  Trash2,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Target,
  Home,
  Car,
  Heart,
  Briefcase,
  TrendingUp,
  Award,
  PieChart,
  HelpCircle,
  Sliders,
  Clock,
  Loader2,
  AlertCircle,
  LineChart,
  Edit3
} from 'lucide-react';
import { UserProfile, Account, FinancialGoal, Transaction, Budget, PrimaryGoalType, UserGoalSelection, AIPersonalizedSpendingPlan } from '../types';

export interface QuestionnaireResult {
  user: UserProfile;
  primaryCurrency: string;
  accounts: Account[];
  budget: Budget;
  transactions: Transaction[];
  goals: FinancialGoal[];
  spendingPlan?: AIPersonalizedSpendingPlan;
}

interface OnboardingQuestionnaireProps {
  onComplete: (result: QuestionnaireResult) => void;
  onCancel: () => void;
  initialEmail?: string;
  initialName?: string;
}

export interface DebtItem {
  id: string;
  title: string;
  debtType: 'credit_card' | 'personal_loan' | 'car_loan' | 'student_loan' | 'mortgage' | 'other';
  amount: number;
  interestRate: number;
  timeframeMonths: number;
}

export interface PurchaseItem {
  id: string;
  title: string;
  category: 'house' | 'car' | 'wedding' | 'education' | 'gadgets' | 'other';
  amount: number;
  timeframeMonths: number;
}

export const OnboardingQuestionnaire: React.FC<OnboardingQuestionnaireProps> = ({
  onComplete,
  onCancel,
  initialEmail = '',
  initialName = ''
}) => {
  const [step, setStep] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisChecklist, setAnalysisChecklist] = useState<number>(0);

  // Step 1: User Credentials & Currency
  const [fullName, setFullName] = useState(initialName || '');
  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState('');
  const [currency, setCurrency] = useState('EGP');
  const [incomeType, setIncomeType] = useState<'fixed' | 'variable_freelance' | 'bonus_heavy'>('fixed');

  // Step 2: Goal Selection Options (Multi-Goal Selection!)
  const [selectedGoalTypes, setSelectedGoalTypes] = useState<PrimaryGoalType[]>(['net_worth']);

  // Specific goal configurations
  // 1. Net Worth Goal
  const [netWorthTarget, setNetWorthTarget] = useState<number>(500000);
  const [netWorthTimeframeMonths, setNetWorthTimeframeMonths] = useState<number>(24);

  // 2. Multiple Big Purchases List
  const [purchasesList, setPurchasesList] = useState<PurchaseItem[]>([
    {
      id: 'purch_1',
      title: 'Down Payment for Apartment in New Cairo',
      category: 'house',
      amount: 250000,
      timeframeMonths: 18
    }
  ]);

  // 3. Multiple Debts / Loans List
  const [debtsList, setDebtsList] = useState<DebtItem[]>([
    {
      id: 'debt_1',
      title: 'CIB Platinum Credit Card Balance',
      debtType: 'credit_card',
      amount: 25000,
      interestRate: 24,
      timeframeMonths: 12
    },
    {
      id: 'debt_2',
      title: 'Personal Bank Loan',
      debtType: 'personal_loan',
      amount: 45000,
      interestRate: 18,
      timeframeMonths: 18
    }
  ]);

  // 4. Stock Investments / Assets Goal
  const [stockTargetAmount, setStockTargetAmount] = useState<number>(300000);
  const [stockTimeframeMonths, setStockTimeframeMonths] = useState<number>(24);
  const [stockAssetTypes, setStockAssetTypes] = useState<string>('US Stocks, EGX Index, ETFs & Gold');
  const [stockExpectedYield, setStockExpectedYield] = useState<number>(22);

  // 5. Custom Goal
  const [customGoalReason, setCustomGoalReason] = useState('Build a FIRE retirement fund & emergency safety buffer');
  const [customTargetAmount, setCustomTargetAmount] = useState<number>(150000);
  const [customTimeframeMonths, setCustomTimeframeMonths] = useState<number>(12);

  // Step 3: Income, Subscriptions & Balances
  const [monthlyIncome, setMonthlyIncome] = useState<number>(65000);
  const [bankBalance, setBankBalance] = useState<number>(85000);
  const [instaPayBalance, setInstaPayBalance] = useState<number>(12500);
  const [cashBalance, setCashBalance] = useState<number>(4500);
  const [bankName, setBankName] = useState('CIB Commercial International Bank');

  const [selectedSubs, setSelectedSubs] = useState<Array<{ id: string; name: string; amount: number; category: string }>>([
    { id: 'sub_netflix', name: 'Netflix Premium', amount: 320, category: 'entertainment' },
    { id: 'sub_spotify', name: 'Spotify Family', amount: 110, category: 'entertainment' },
    { id: 'sub_chatgpt', name: 'ChatGPT Plus (OpenAI)', amount: 1050, category: 'utilities' },
    { id: 'sub_gym', name: 'Gold Gym Club', amount: 1800, category: 'fitness' }
  ]);

  // Step 4: AI Plan Result State & Review/Edit Mode
  const [generatedPlan, setGeneratedPlan] = useState<AIPersonalizedSpendingPlan | null>(null);
  const [isEditingPlan, setIsEditingPlan] = useState<boolean>(false);

  // Multi-Goal Helpers
  const toggleGoalType = (type: PrimaryGoalType) => {
    setSelectedGoalTypes(prev => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev; // Keep at least one goal
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Debt item helpers
  const addDebtItem = () => {
    const newItem: DebtItem = {
      id: `debt_${Date.now()}`,
      title: `Additional Loan #${debtsList.length + 1}`,
      debtType: 'personal_loan',
      amount: 15000,
      interestRate: 20,
      timeframeMonths: 12
    };
    setDebtsList(prev => [...prev, newItem]);
  };

  const removeDebtItem = (id: string) => {
    if (debtsList.length <= 1) return;
    setDebtsList(prev => prev.filter(d => d.id !== id));
  };

  const updateDebtItem = (id: string, field: keyof DebtItem, value: any) => {
    setDebtsList(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  // Purchase item helpers
  const addPurchaseItem = () => {
    const newItem: PurchaseItem = {
      id: `purch_${Date.now()}`,
      title: `Upcoming Asset #${purchasesList.length + 1}`,
      category: 'car',
      amount: 80000,
      timeframeMonths: 12
    };
    setPurchasesList(prev => [...prev, newItem]);
  };

  const removePurchaseItem = (id: string) => {
    if (purchasesList.length <= 1) return;
    setPurchasesList(prev => prev.filter(p => p.id !== id));
  };

  const updatePurchaseItem = (id: string, field: keyof PurchaseItem, value: any) => {
    setPurchasesList(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const toggleSub = (subId: string) => {
    setSelectedSubs(prev => prev.filter(s => s.id !== subId));
  };

  // Summary calculation for selected goals
  const getAggregatedGoalSelection = (): UserGoalSelection => {
    let totalTarget = 0;
    let maxTimeframe = 12;
    const parts: string[] = [];

    if (selectedGoalTypes.includes('net_worth')) {
      totalTarget += netWorthTarget;
      maxTimeframe = Math.max(maxTimeframe, netWorthTimeframeMonths);
      parts.push(`Net Worth Target (${netWorthTarget.toLocaleString()} ${currency})`);
    }

    if (selectedGoalTypes.includes('big_purchase')) {
      const sumPurchases = purchasesList.reduce((acc, p) => acc + (p.amount || 0), 0);
      totalTarget += sumPurchases;
      const maxPurchTime = Math.max(...purchasesList.map(p => p.timeframeMonths || 12));
      maxTimeframe = Math.max(maxTimeframe, maxPurchTime);
      parts.push(`${purchasesList.length} Major Purchase(s) (${sumPurchases.toLocaleString()} ${currency})`);
    }

    if (selectedGoalTypes.includes('loan_payoff')) {
      const sumDebts = debtsList.reduce((acc, d) => acc + (d.amount || 0), 0);
      totalTarget += sumDebts;
      const maxDebtTime = Math.max(...debtsList.map(d => d.timeframeMonths || 12));
      maxTimeframe = Math.max(maxTimeframe, maxDebtTime);
      parts.push(`Pay Off ${debtsList.length} Loan/Debt(s) (${sumDebts.toLocaleString()} ${currency})`);
    }

    if (selectedGoalTypes.includes('stock_investments')) {
      totalTarget += stockTargetAmount;
      maxTimeframe = Math.max(maxTimeframe, stockTimeframeMonths);
      parts.push(`Stock Portfolio Target (${stockTargetAmount.toLocaleString()} ${currency})`);
    }

    if (selectedGoalTypes.includes('other')) {
      totalTarget += customTargetAmount;
      maxTimeframe = Math.max(maxTimeframe, customTimeframeMonths);
      parts.push(`Custom Target (${customTargetAmount.toLocaleString()} ${currency})`);
    }

    const primaryType = selectedGoalTypes[0] || 'net_worth';

    return {
      type: primaryType,
      title: parts.join(' + ') || 'Multi-Goal Strategy',
      targetAmount: totalTarget,
      targetTimeframeMonths: maxTimeframe,
      customReason: `Integrated multi-goal plan covering: ${parts.join(', ')}`
    };
  };

  // Handle Analysis Simulation with Progress & Checklist
  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisChecklist(0);

    const goalSel = getAggregatedGoalSelection();
    const subsTotal = selectedSubs.reduce((sum, s) => sum + s.amount, 0);
    const totalLiquid = bankBalance + instaPayBalance + cashBalance;

    // Simulate animated loading steps
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        const next = prev + 5;
        if (next >= 25 && next < 50) setAnalysisChecklist(1);
        else if (next >= 50 && next < 75) setAnalysisChecklist(2);
        else if (next >= 75 && next < 95) setAnalysisChecklist(3);
        else if (next >= 100) setAnalysisChecklist(4);
        return Math.min(100, next);
      });
    }, 120);

    try {
      const resp = await fetch('/api/ai/personalized-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyIncome,
          currency,
          primaryGoal: goalSel,
          subscriptionsTotal: subsTotal,
          liquidAccountsTotal: totalLiquid
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.plan) {
          setTimeout(() => {
            clearInterval(interval);
            setGeneratedPlan(data.plan);
            setIsAnalyzing(false);
            setStep(4);
          }, 2500);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to fetch AI plan from server API, generating client fallback plan:', err);
    }

    // Fallback Plan Calculation
    const monthlyGoalSavings = Math.min(monthlyIncome * 0.45, Math.ceil(goalSel.targetAmount / goalSel.targetTimeframeMonths));
    const monthlySpendingLimit = Math.max(1000, monthlyIncome - monthlyGoalSavings);
    const weeklySpendingLimit = Math.round(monthlySpendingLimit / 4.33);
    const weeklyGoalSavings = Math.round(monthlyGoalSavings / 4.33);

    const calcCat = (pct: number) => ({
      monthly: Math.round(monthlyIncome * pct),
      weekly: Math.round((monthlyIncome * pct) / 4.33),
      percentage: Math.round(pct * 100)
    });

    const fallbackPlan: AIPersonalizedSpendingPlan = {
      weeklySpendingLimit,
      monthlySpendingLimit,
      recommendedSavingsOrDebtMonthly: monthlyGoalSavings,
      recommendedSavingsOrDebtWeekly: weeklyGoalSavings,
      timeframeToReachGoalMonths: Math.ceil(goalSel.targetAmount / (monthlyGoalSavings || 1)),
      categoryBreakdown: {
        housing: calcCat(0.28),
        groceries: calcCat(0.18),
        transport: calcCat(0.10),
        diningOut: calcCat(0.08),
        entertainment: calcCat(0.05),
        shopping: calcCat(0.08),
        utilities: calcCat(0.05),
        goalSavingsOrDebt: {
          monthly: monthlyGoalSavings,
          weekly: weeklyGoalSavings,
          percentage: Math.round((monthlyGoalSavings / monthlyIncome) * 100)
        }
      },
      strategyTitle: 'Multi-Goal Wealth & Liquidity Acceleration Plan',
      strategySummary: `Tailored plan designed for your targets (${goalSel.title}). Setting aside ${monthlyGoalSavings.toLocaleString()} ${currency}/month (${weeklyGoalSavings.toLocaleString()} ${currency}/week) keeps your goals on track while maintaining a safe weekly cap of ${weeklySpendingLimit.toLocaleString()} ${currency}/week.`,
      investmentRecommendations: [
        {
          id: 'inv_1',
          title: 'High-Yield Bank Certificates (CDs)',
          description: 'Lock in guaranteed fixed yield for short-to-medium term liquidity.',
          expectedYield: '18.5% - 21.0% APY',
          riskLevel: 'Low',
          recommendedAllocationPct: 40,
          icon: 'ShieldCheck'
        },
        {
          id: 'inv_2',
          title: 'Stock Market ETFs & Index Funds',
          description: 'Broad equity market accumulation for compounding growth.',
          expectedYield: '18.0% - 24.0% CAGR',
          riskLevel: 'Medium',
          recommendedAllocationPct: 35,
          icon: 'TrendingUp'
        },
        {
          id: 'inv_3',
          title: 'Treasury Bills & Money Market Funds',
          description: 'Liquid cash reserves providing upfront yield.',
          expectedYield: '22.0% - 24.5% Net APY',
          riskLevel: 'Low',
          recommendedAllocationPct: 25,
          icon: 'PieChart'
        }
      ]
    };

    setTimeout(() => {
      clearInterval(interval);
      setGeneratedPlan(fallbackPlan);
      setIsAnalyzing(false);
      setStep(4);
    }, 2500);
  };

  // Live editing category allocations in Step 4
  const updateCategoryAllocation = (catKey: string, newMonthlyValue: number) => {
    if (!generatedPlan) return;
    const weekly = Math.round(newMonthlyValue / 4.33);
    const percentage = Math.round((newMonthlyValue / monthlyIncome) * 100);

    const updatedBreakdown = {
      ...generatedPlan.categoryBreakdown,
      [catKey]: { monthly: newMonthlyValue, weekly, percentage }
    };

    // Re-sum total monthly & weekly limits
    const totalCatMonthly = Object.entries(updatedBreakdown)
      .filter(([k]) => k !== 'goalSavingsOrDebt')
      .reduce((sum, [, v]) => sum + (v as { monthly: number }).monthly, 0);

    const newWeeklyLimit = Math.round(totalCatMonthly / 4.33);

    setGeneratedPlan({
      ...generatedPlan,
      monthlySpendingLimit: totalCatMonthly,
      weeklySpendingLimit: newWeeklyLimit,
      categoryBreakdown: updatedBreakdown
    });
  };

  // Final confirmation & launch
  const handleFinish = () => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const primaryGoal = getAggregatedGoalSelection();

    const planToUse = generatedPlan || {
      weeklySpendingLimit: Math.round((monthlyIncome * 0.6) / 4.33),
      monthlySpendingLimit: Math.round(monthlyIncome * 0.6),
      recommendedSavingsOrDebtMonthly: Math.round(monthlyIncome * 0.4),
      recommendedSavingsOrDebtWeekly: Math.round((monthlyIncome * 0.4) / 4.33),
      timeframeToReachGoalMonths: primaryGoal.targetTimeframeMonths,
      categoryBreakdown: {
        groceries: { monthly: Math.round(monthlyIncome * 0.20), weekly: Math.round((monthlyIncome * 0.20) / 4.33), percentage: 20 },
        housing: { monthly: Math.round(monthlyIncome * 0.28), weekly: Math.round((monthlyIncome * 0.28) / 4.33), percentage: 28 },
        transport: { monthly: Math.round(monthlyIncome * 0.10), weekly: Math.round((monthlyIncome * 0.10) / 4.33), percentage: 10 },
        diningOut: { monthly: Math.round(monthlyIncome * 0.08), weekly: Math.round((monthlyIncome * 0.08) / 4.33), percentage: 8 },
        entertainment: { monthly: Math.round(monthlyIncome * 0.05), weekly: Math.round((monthlyIncome * 0.05) / 4.33), percentage: 5 },
        shopping: { monthly: Math.round(monthlyIncome * 0.08), weekly: Math.round((monthlyIncome * 0.08) / 4.33), percentage: 8 },
        utilities: { monthly: Math.round(monthlyIncome * 0.05), weekly: Math.round((monthlyIncome * 0.05) / 4.33), percentage: 5 },
        goalSavingsOrDebt: { monthly: Math.round(monthlyIncome * 0.16), weekly: Math.round((monthlyIncome * 0.16) / 4.33), percentage: 16 }
      },
      strategyTitle: 'Custom Multi-Goal Plan',
      strategySummary: `Tailored plan created for ${primaryGoal.title}.`,
      investmentRecommendations: []
    };

    const user: UserProfile = {
      id: `usr_${Date.now()}`,
      email: email || 'user@budfit.ai',
      fullName: fullName || 'BudFit User',
      archetypeId: 'custom_onboarding',
      createdAt: new Date().toISOString(),
      incomeType,
      primaryGoal,
      aiSpendingPlan: planToUse
    };

    const generatedAccounts: Account[] = [
      {
        id: 'acc_bank_1',
        name: bankName,
        type: 'bank',
        subtype: 'checking',
        bankName: bankName,
        accountNumber: '**** ' + Math.floor(1000 + Math.random() * 9000),
        balance: bankBalance,
        availableBalance: bankBalance,
        currency: currency,
        isActive: true,
        color: '#2B4F60'
      },
      {
        id: 'acc_wallet_1',
        name: 'InstaPay / Mobile Wallet',
        type: 'wallet',
        subtype: 'instapay',
        bankName: 'InstaPay National Network',
        accountNumber: 'instapay@bank',
        balance: instaPayBalance,
        availableBalance: instaPayBalance,
        currency: currency,
        isActive: true,
        color: '#845460'
      },
      {
        id: 'acc_cash_1',
        name: 'Physical Cash / Vault',
        type: 'cash',
        subtype: 'cash',
        bankName: 'Physical Cash',
        accountNumber: 'CASH-VAULT',
        balance: cashBalance,
        availableBalance: cashBalance,
        currency: currency,
        isActive: true,
        color: '#4F8683'
      }
    ];

    const generatedBudget: Budget = {
      id: `bud_${Date.now()}`,
      name: `${currency} Personalized AI Spending Budget`,
      monthlyLimit: planToUse.monthlySpendingLimit,
      currency: currency,
      categoryLimits: {
        groceries: planToUse.categoryBreakdown.groceries.monthly,
        housing: planToUse.categoryBreakdown.housing.monthly,
        transport: planToUse.categoryBreakdown.transport.monthly,
        dining: planToUse.categoryBreakdown.diningOut.monthly,
        subscriptions: selectedSubs.reduce((acc, curr) => acc + curr.amount, 0) + 1000,
        shopping: planToUse.categoryBreakdown.shopping.monthly,
        wellness: planToUse.categoryBreakdown.entertainment.monthly
      },
      startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(),
      isActive: true
    };

    const generatedTransactions: Transaction[] = [
      {
        id: `tx_income_${Date.now()}`,
        date: todayStr,
        merchant: incomeType === 'fixed' ? 'Monthly Payroll Income' : 'Client Retainers & Revenue',
        amount: monthlyIncome,
        currency: currency,
        category: 'income',
        categoryGroup: 'income',
        type: 'income',
        accountId: 'acc_bank_1',
        tags: ['income', 'payroll']
      },
      ...selectedSubs.map((sub, idx) => ({
        id: `tx_sub_${idx}_${Date.now()}`,
        date: todayStr,
        merchant: sub.name,
        amount: sub.amount,
        currency: currency,
        category: 'subscriptions',
        categoryGroup: 'subscriptions',
        type: 'expense' as const,
        accountId: 'acc_bank_1',
        isRecurring: true,
        recurrencePeriod: 'monthly' as const,
        tags: ['subscription', sub.category]
      }))
    ];

    // Generate Financial Goal entries for each selected goal
    const generatedGoals: FinancialGoal[] = [];

    if (selectedGoalTypes.includes('net_worth')) {
      generatedGoals.push({
        id: `goal_nw_${Date.now()}`,
        title: `Reach ${netWorthTarget.toLocaleString()} ${currency} Net Worth`,
        targetAmount: netWorthTarget,
        currentAmount: Math.round(bankBalance * 0.4),
        currency: currency,
        targetDate: new Date(now.getFullYear(), now.getMonth() + netWorthTimeframeMonths, 1).toISOString().split('T')[0],
        category: 'savings',
        color: '#2B4F60',
        isCompleted: false,
        priority: 'high',
        horizon: netWorthTimeframeMonths <= 12 ? 'short-term' : 'medium-term',
        autoReallocate: true,
        expectedMonthlyContrib: Math.round(planToUse.recommendedSavingsOrDebtMonthly * 0.4),
        annualInterestReturn: 18.5,
        notes: 'Primary Net Worth Target'
      });
    }

    if (selectedGoalTypes.includes('big_purchase')) {
      purchasesList.forEach((p, idx) => {
        generatedGoals.push({
          id: `goal_purch_${idx}_${Date.now()}`,
          title: p.title || 'Major Purchase Target',
          targetAmount: p.amount,
          currentAmount: Math.round(p.amount * 0.1),
          currency: currency,
          targetDate: new Date(now.getFullYear(), now.getMonth() + (p.timeframeMonths || 12), 1).toISOString().split('T')[0],
          category: 'purchase',
          color: '#845460',
          isCompleted: false,
          priority: 'high',
          horizon: (p.timeframeMonths || 12) <= 12 ? 'short-term' : 'medium-term',
          autoReallocate: true,
          expectedMonthlyContrib: Math.round(p.amount / (p.timeframeMonths || 12)),
          notes: `Purchase category: ${p.category}`
        });
      });
    }

    if (selectedGoalTypes.includes('loan_payoff')) {
      debtsList.forEach((d, idx) => {
        generatedGoals.push({
          id: `goal_debt_${idx}_${Date.now()}`,
          title: d.title || 'Loan Payoff',
          targetAmount: d.amount,
          currentAmount: 0,
          currency: currency,
          targetDate: new Date(now.getFullYear(), now.getMonth() + (d.timeframeMonths || 12), 1).toISOString().split('T')[0],
          category: 'debt',
          color: '#D98B6F',
          isCompleted: false,
          priority: 'high',
          horizon: (d.timeframeMonths || 12) <= 12 ? 'short-term' : 'medium-term',
          autoReallocate: true,
          expectedMonthlyContrib: Math.round(d.amount / (d.timeframeMonths || 12)),
          annualInterestReturn: d.interestRate,
          notes: `Debt type: ${d.debtType} @ ${d.interestRate}% interest`
        });
      });
    }

    if (selectedGoalTypes.includes('stock_investments')) {
      generatedGoals.push({
        id: `goal_stocks_${Date.now()}`,
        title: `Stock & Assets Portfolio (${stockTargetAmount.toLocaleString()} ${currency})`,
        targetAmount: stockTargetAmount,
        currentAmount: Math.round(stockTargetAmount * 0.15),
        currency: currency,
        targetDate: new Date(now.getFullYear(), now.getMonth() + stockTimeframeMonths, 1).toISOString().split('T')[0],
        category: 'investment',
        color: '#4F8683',
        isCompleted: false,
        priority: 'high',
        horizon: stockTimeframeMonths <= 12 ? 'short-term' : 'medium-term',
        autoReallocate: true,
        expectedMonthlyContrib: Math.round(stockTargetAmount / stockTimeframeMonths),
        annualInterestReturn: stockExpectedYield,
        notes: `Asset Mix: ${stockAssetTypes}`
      });
    }

    if (selectedGoalTypes.includes('other')) {
      generatedGoals.push({
        id: `goal_custom_${Date.now()}`,
        title: customGoalReason.slice(0, 35) || 'Personal Goal',
        targetAmount: customTargetAmount,
        currentAmount: 0,
        currency: currency,
        targetDate: new Date(now.getFullYear(), now.getMonth() + customTimeframeMonths, 1).toISOString().split('T')[0],
        category: 'savings',
        color: '#2B4F60',
        isCompleted: false,
        priority: 'medium',
        horizon: 'medium-term',
        autoReallocate: true,
        expectedMonthlyContrib: Math.round(customTargetAmount / customTimeframeMonths),
        notes: customGoalReason
      });
    }

    onComplete({
      user,
      primaryCurrency: currency,
      accounts: generatedAccounts,
      budget: generatedBudget,
      transactions: generatedTransactions,
      goals: generatedGoals,
      spendingPlan: planToUse
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF6F2] text-[#22323A] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#EAD3CB]/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-2xl w-full z-10 space-y-6 my-auto py-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2B4F60] via-[#845460] to-[#D98B6F] shadow-xs mb-1">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">
            <span className="text-[#845460] font-serif font-bold">bud</span>
            <span className="text-[#1B333F] font-serif font-bold">fit</span>
            <span className="text-[#5B6E75] text-xl font-medium font-sans ml-2">Account Setup & Goals</span>
          </h2>
          <p className="text-xs text-[#5B6E75]">
            Set up your targets, multi-debt profile, and generate a customizable AI spending plan
          </p>
        </div>

        {/* Wizard Progress Bar */}
        {!isAnalyzing && (
          <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-4 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#1B333F]">
              <span className="text-[#845460] font-bold">Step {step} of 4</span>
              <span className="text-[#5B6E75]">
                {step === 1 && 'Credentials & Currency'}
                {step === 2 && 'Financial Goal Options'}
                {step === 3 && 'Cash Flow & Accounts'}
                {step === 4 && 'AI Spending & Budget Review'}
              </span>
            </div>
            <div className="w-full bg-[#FAF6F2] h-2 rounded-full overflow-hidden border border-[rgba(43,79,96,0.12)]">
              <div 
                className="bg-gradient-to-r from-[#2B4F60] via-[#845460] to-[#D98B6F] h-full transition-all duration-300 ease-out"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* LOADING & AI ANALYSIS SCREEN (Satisfies Request #1) */}
        {isAnalyzing ? (
          <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-8 animate-fade-in">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#2B4F60]/20 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-[#845460] border-r-[#2B4F60] border-b-[#D98B6F] border-l-[#4F8683] animate-spin"></div>
              <div className="w-16 h-16 rounded-2xl bg-[#2B4F60] flex items-center justify-center shadow-lg text-white">
                <Sparkles className="w-8 h-8 text-[#EAD3CB] animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="bg-[#EAD3CB] text-[#845460] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                AI Financial Engine Active
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#1B333F]">
                Analyzing Financial Profile & Building Plan...
              </h3>
              <p className="text-xs text-[#5B6E75] max-w-md mx-auto">
                Synthesizing your income, multi-goal requirements, debt interest schedules, and liquid account balances.
              </p>
            </div>

            {/* Animated Progress Bar */}
            <div className="max-w-md mx-auto space-y-2">
              <div className="flex justify-between items-center text-xs font-mono font-bold text-[#2B4F60]">
                <span>Processing Model Data</span>
                <span>{analysisProgress}%</span>
              </div>
              <div className="w-full bg-[#FAF6F2] h-3 rounded-full overflow-hidden border border-[rgba(43,79,96,0.15)]">
                <div 
                  className="bg-gradient-to-r from-[#2B4F60] via-[#845460] to-[#D98B6F] h-full transition-all duration-150 ease-out"
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Real-time Checklist Indicators */}
            <div className="max-w-md mx-auto text-left space-y-2.5 text-xs bg-[#FAF6F2] p-4 rounded-2xl border border-[rgba(43,79,96,0.12)]">
              <div className={`flex items-center space-x-2 transition-opacity ${analysisChecklist >= 1 ? 'opacity-100 text-[#1B333F] font-semibold' : 'opacity-40 text-[#5B6E75]'}`}>
                {analysisChecklist >= 1 ? <CheckCircle2 className="w-4 h-4 text-[#4F8683] shrink-0" /> : <Loader2 className="w-4 h-4 animate-spin text-[#845460] shrink-0" />}
                <span>Auditing monthly cash flow & liquid account balances</span>
              </div>
              <div className={`flex items-center space-x-2 transition-opacity ${analysisChecklist >= 2 ? 'opacity-100 text-[#1B333F] font-semibold' : 'opacity-40 text-[#5B6E75]'}`}>
                {analysisChecklist >= 2 ? <CheckCircle2 className="w-4 h-4 text-[#4F8683] shrink-0" /> : <Loader2 className="w-4 h-4 animate-spin text-[#845460] shrink-0" />}
                <span>Calculating multi-debt payoff schedules & compound interest</span>
              </div>
              <div className={`flex items-center space-x-2 transition-opacity ${analysisChecklist >= 3 ? 'opacity-100 text-[#1B333F] font-semibold' : 'opacity-40 text-[#5B6E75]'}`}>
                {analysisChecklist >= 3 ? <CheckCircle2 className="w-4 h-4 text-[#4F8683] shrink-0" /> : <Loader2 className="w-4 h-4 animate-spin text-[#845460] shrink-0" />}
                <span>Auditing recurring subscriptions & fixed monthly overhead</span>
              </div>
              <div className={`flex items-center space-x-2 transition-opacity ${analysisChecklist >= 4 ? 'opacity-100 text-[#1B333F] font-semibold' : 'opacity-40 text-[#5B6E75]'}`}>
                {analysisChecklist >= 4 ? <CheckCircle2 className="w-4 h-4 text-[#4F8683] shrink-0" /> : <Loader2 className="w-4 h-4 animate-spin text-[#845460] shrink-0" />}
                <span>Synthesizing AI weekly spending allowance & category caps</span>
              </div>
            </div>
          </div>
        ) : (
          /* MAIN WIZARD CARD */
          <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-6 sm:p-8 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] space-y-6">
            
            {/* STEP 1: Basic Identity & Base Currency */}
            {step === 1 && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-[rgba(43,79,96,0.12)] pb-3">
                  <h3 className="text-sm font-serif font-medium text-[#1B333F] flex items-center space-x-2">
                    <User className="w-4 h-4 text-[#845460]" />
                    <span>Account Credentials & Base Currency</span>
                  </h3>
                  <p className="text-[#5B6E75] text-[11px] mt-0.5">Define your name, login, and preferred tracking currency</p>
                </div>

                <div>
                  <label className="text-[#1B333F] font-semibold block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#5B6E75] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Omar Al-Masri"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#FAF6F2] text-[#1B333F] pl-9 pr-3 py-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#2B4F60] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#1B333F] font-semibold block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#5B6E75] absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="omar@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FAF6F2] text-[#1B333F] pl-9 pr-3 py-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#2B4F60] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#1B333F] font-semibold block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#5B6E75] absolute left-3 top-3" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#FAF6F2] text-[#1B333F] pl-9 pr-3 py-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#2B4F60] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[#1B333F] font-semibold block mb-1">Primary Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#2B4F60] font-semibold"
                    >
                      <option value="EGP">EGP (Egyptian Pound)</option>
                      <option value="USD">USD ($ United States Dollar)</option>
                      <option value="EUR">EUR (€ Euro)</option>
                      <option value="SAR">SAR (Saudi Riyal)</option>
                      <option value="AED">AED (UAE Dirham)</option>
                      <option value="GBP">GBP (£ British Pound)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[#1B333F] font-semibold block mb-1">Income Structure</label>
                    <select
                      value={incomeType}
                      onChange={(e) => setIncomeType(e.target.value as any)}
                      className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#2B4F60] font-medium"
                    >
                      <option value="fixed">Salary (Fixed Monthly)</option>
                      <option value="variable_freelance">Freelance / Variable Revenue</option>
                      <option value="bonus_heavy">Bonus / Commission Heavy</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Goal Selection Options (Satisfies Requests #3, #5, #6!) */}
            {step === 2 && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-[rgba(43,79,96,0.12)] pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-serif font-medium text-[#1B333F] flex items-center space-x-2">
                      <Target className="w-4 h-4 text-[#D98B6F]" />
                      <span>Financial Goals (Select Multiple Allowed)</span>
                    </h3>
                    <p className="text-[#5B6E75] text-[11px] mt-0.5">Select one or multiple financial targets for BudFit to optimize.</p>
                  </div>
                  <span className="text-[10px] bg-[#EAD3CB] text-[#845460] font-mono font-bold px-2 py-0.5 rounded-full">
                    {selectedGoalTypes.length} Selected
                  </span>
                </div>

                {/* Goal Selection Cards Grid (Multi-Selectable!) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 1. Net Worth Goal */}
                  <button
                    type="button"
                    onClick={() => toggleGoalType('net_worth')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 relative ${
                      selectedGoalTypes.includes('net_worth')
                        ? 'bg-[#2B4F60]/5 border-[#2B4F60] text-[#1B333F] font-bold shadow-xs'
                        : 'bg-[#FAF6F2] border-[rgba(43,79,96,0.12)] text-[#5B6E75] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-[#2B4F60]">
                        <TrendingUp className="w-4 h-4 shrink-0" />
                        <span className="font-semibold text-xs text-[#1B333F]">Reach Target Net Worth</span>
                      </div>
                      <input type="checkbox" checked={selectedGoalTypes.includes('net_worth')} readOnly className="rounded text-[#2B4F60]" />
                    </div>
                    <p className="text-[10px] text-[#5B6E75]">Target overall capital accumulation over time.</p>
                  </button>

                  {/* 2. Big Purchases (Supports Multiple!) */}
                  <button
                    type="button"
                    onClick={() => toggleGoalType('big_purchase')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 relative ${
                      selectedGoalTypes.includes('big_purchase')
                        ? 'bg-[#845460]/5 border-[#845460] text-[#1B333F] font-bold shadow-xs'
                        : 'bg-[#FAF6F2] border-[rgba(43,79,96,0.12)] text-[#5B6E75] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-[#845460]">
                        <Home className="w-4 h-4 shrink-0" />
                        <span className="font-semibold text-xs text-[#1B333F]">Major Purchases ({purchasesList.length})</span>
                      </div>
                      <input type="checkbox" checked={selectedGoalTypes.includes('big_purchase')} readOnly className="rounded text-[#845460]" />
                    </div>
                    <p className="text-[10px] text-[#5B6E75]">Save for a house, car, wedding, or equipment.</p>
                  </button>

                  {/* 3. Pay Off Loans & Debts (Supports Multiple!) */}
                  <button
                    type="button"
                    onClick={() => toggleGoalType('loan_payoff')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 relative ${
                      selectedGoalTypes.includes('loan_payoff')
                        ? 'bg-rose-50 border-rose-400 text-[#1B333F] font-bold shadow-xs'
                        : 'bg-[#FAF6F2] border-[rgba(43,79,96,0.12)] text-[#5B6E75] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-rose-700">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span className="font-semibold text-xs text-[#1B333F]">Pay Off Debts ({debtsList.length})</span>
                      </div>
                      <input type="checkbox" checked={selectedGoalTypes.includes('loan_payoff')} readOnly className="rounded text-rose-600" />
                    </div>
                    <p className="text-[10px] text-[#5B6E75]">Eliminate credit cards, bank loans, or car financing.</p>
                  </button>

                  {/* 4. Stock Investments & Portfolio Assets (Satisfies Request #5) */}
                  <button
                    type="button"
                    onClick={() => toggleGoalType('stock_investments')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 relative ${
                      selectedGoalTypes.includes('stock_investments')
                        ? 'bg-[#4F8683]/10 border-[#4F8683] text-[#1B333F] font-bold shadow-xs'
                        : 'bg-[#FAF6F2] border-[rgba(43,79,96,0.12)] text-[#5B6E75] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-[#4F8683]">
                        <LineChart className="w-4 h-4 shrink-0" />
                        <span className="font-semibold text-xs text-[#1B333F]">Stock Investments & Assets</span>
                      </div>
                      <input type="checkbox" checked={selectedGoalTypes.includes('stock_investments')} readOnly className="rounded text-[#4F8683]" />
                    </div>
                    <p className="text-[10px] text-[#5B6E75]">Track stock portfolios, ETFs, EGX, US equities & gold.</p>
                  </button>

                  {/* 5. Custom / FIRE Goal */}
                  <button
                    type="button"
                    onClick={() => toggleGoalType('other')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 sm:col-span-2 relative ${
                      selectedGoalTypes.includes('other')
                        ? 'bg-[#2B4F60]/5 border-[#2B4F60] text-[#1B333F] font-bold shadow-xs'
                        : 'bg-[#FAF6F2] border-[rgba(43,79,96,0.12)] text-[#5B6E75] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-[#2B4F60]">
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span className="font-semibold text-xs text-[#1B333F]">Custom / FIRE / Emergency Cushion</span>
                      </div>
                      <input type="checkbox" checked={selectedGoalTypes.includes('other')} readOnly className="rounded text-[#2B4F60]" />
                    </div>
                    <p className="text-[10px] text-[#5B6E75]">Retirement fund, emergency buffer, or custom personal target.</p>
                  </button>
                </div>

                {/* DYNAMIC GOAL CONFIGURATION PANELS */}
                <div className="space-y-4 pt-2">
                  {/* 1. Net Worth Inputs */}
                  {selectedGoalTypes.includes('net_worth') && (
                    <div className="p-4 bg-[#FAF6F2] border border-[rgba(43,79,96,0.13)] rounded-2xl space-y-3">
                      <h4 className="font-serif font-medium text-[#1B333F] text-xs flex items-center space-x-1.5">
                        <TrendingUp className="w-4 h-4 text-[#2B4F60]" />
                        <span>Net Worth Target Setup</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[#5B6E75] block mb-1 font-semibold">Target Net Worth ({currency})</label>
                          <input
                            type="number"
                            value={netWorthTarget}
                            onChange={(e) => setNetWorthTarget(Number(e.target.value))}
                            className="w-full bg-white text-[#2B4F60] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[#5B6E75] block mb-1 font-semibold">Timeframe (Months)</label>
                          <input
                            type="number"
                            value={netWorthTimeframeMonths}
                            onChange={(e) => setNetWorthTimeframeMonths(Number(e.target.value))}
                            className="w-full bg-white text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Major Purchases List Inputs (Satisfies Request #3 for Big Purchases) */}
                  {selectedGoalTypes.includes('big_purchase') && (
                    <div className="p-4 bg-[#FAF6F2] border border-[rgba(43,79,96,0.13)] rounded-2xl space-y-3">
                      <div className="flex justify-between items-center border-b border-[rgba(43,79,96,0.1)] pb-2">
                        <h4 className="font-serif font-medium text-[#1B333F] text-xs flex items-center space-x-1.5">
                          <Home className="w-4 h-4 text-[#845460]" />
                          <span>Major Purchases List ({purchasesList.length})</span>
                        </h4>
                        <button
                          type="button"
                          onClick={addPurchaseItem}
                          className="bg-[#845460] hover:bg-[#6A414B] text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Another Purchase</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {purchasesList.map((p, index) => (
                          <div key={p.id} className="p-3 bg-white rounded-xl border border-[rgba(43,79,96,0.12)] space-y-2 relative">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-[#845460] text-[11px]">Purchase #{index + 1}</span>
                              {purchasesList.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removePurchaseItem(p.id)}
                                  className="text-[#5B6E75] hover:text-rose-600 transition p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-[#5B6E75] font-semibold block mb-0.5">Title / Description</label>
                                <input
                                  type="text"
                                  value={p.title}
                                  onChange={(e) => updatePurchaseItem(p.id, 'title', e.target.value)}
                                  className="w-full bg-[#FAF6F2] text-[#1B333F] p-2 rounded-lg border border-[rgba(43,79,96,0.12)] font-medium"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-[#5B6E75] font-semibold block mb-0.5">Category</label>
                                <select
                                  value={p.category}
                                  onChange={(e) => updatePurchaseItem(p.id, 'category', e.target.value)}
                                  className="w-full bg-[#FAF6F2] text-[#1B333F] p-2 rounded-lg border border-[rgba(43,79,96,0.12)] font-medium"
                                >
                                  <option value="house">House Down Payment</option>
                                  <option value="car">Car Purchase</option>
                                  <option value="wedding">Wedding / Family Event</option>
                                  <option value="education">Education / Degree</option>
                                  <option value="gadgets">Tech Equipment</option>
                                  <option value="other">Other Asset</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-[#5B6E75] font-semibold block mb-0.5">Price / Target ({currency})</label>
                                <input
                                  type="number"
                                  value={p.amount}
                                  onChange={(e) => updatePurchaseItem(p.id, 'amount', Number(e.target.value))}
                                  className="w-full bg-[#FAF6F2] text-[#845460] p-2 rounded-lg border border-[rgba(43,79,96,0.12)] font-mono font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-[#5B6E75] font-semibold block mb-0.5">Timeframe (Months)</label>
                                <input
                                  type="number"
                                  value={p.timeframeMonths}
                                  onChange={(e) => updatePurchaseItem(p.id, 'timeframeMonths', Number(e.target.value))}
                                  className="w-full bg-[#FAF6F2] text-[#1B333F] p-2 rounded-lg border border-[rgba(43,79,96,0.12)] font-mono font-bold"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Debts & Loans List Inputs (Satisfies Request #3 for Multiple Debts) */}
                  {selectedGoalTypes.includes('loan_payoff') && (
                    <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center border-b border-rose-200 pb-2">
                        <h4 className="font-serif font-medium text-rose-950 text-xs flex items-center space-x-1.5">
                          <ShieldAlert className="w-4 h-4 text-rose-700" />
                          <span>Debts & Loans Payoff List ({debtsList.length})</span>
                        </h4>
                        <button
                          type="button"
                          onClick={addDebtItem}
                          className="bg-rose-700 hover:bg-rose-800 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Another Debt / Loan</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {debtsList.map((d, index) => (
                          <div key={d.id} className="p-3 bg-white rounded-xl border border-rose-200 space-y-2 relative shadow-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-rose-800 text-[11px]">Debt / Loan #{index + 1}</span>
                              {debtsList.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeDebtItem(d.id)}
                                  className="text-[#5B6E75] hover:text-rose-600 transition p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-[#5B6E75] font-semibold block mb-0.5">Debt Name / Lender</label>
                                <input
                                  type="text"
                                  value={d.title}
                                  onChange={(e) => updateDebtItem(d.id, 'title', e.target.value)}
                                  className="w-full bg-[#FAF6F2] text-[#1B333F] p-2 rounded-lg border border-[rgba(43,79,96,0.12)] font-medium"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-[#5B6E75] font-semibold block mb-0.5">Debt Type</label>
                                <select
                                  value={d.debtType}
                                  onChange={(e) => updateDebtItem(d.id, 'debtType', e.target.value)}
                                  className="w-full bg-[#FAF6F2] text-[#1B333F] p-2 rounded-lg border border-[rgba(43,79,96,0.12)] font-medium"
                                >
                                  <option value="credit_card">Credit Card Debt</option>
                                  <option value="personal_loan">Personal Bank Loan</option>
                                  <option value="car_loan">Car Financing</option>
                                  <option value="student_loan">Student Loan</option>
                                  <option value="mortgage">Mortgage Loan</option>
                                  <option value="other">Other Debt</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[10px] text-[#5B6E75] font-semibold block mb-0.5">Balance ({currency})</label>
                                <input
                                  type="number"
                                  value={d.amount}
                                  onChange={(e) => updateDebtItem(d.id, 'amount', Number(e.target.value))}
                                  className="w-full bg-[#FAF6F2] text-rose-800 p-2 rounded-lg border border-[rgba(43,79,96,0.12)] font-mono font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-[#5B6E75] font-semibold block mb-0.5">Interest (% APY)</label>
                                <input
                                  type="number"
                                  value={d.interestRate}
                                  onChange={(e) => updateDebtItem(d.id, 'interestRate', Number(e.target.value))}
                                  className="w-full bg-[#FAF6F2] text-rose-700 p-2 rounded-lg border border-[rgba(43,79,96,0.12)] font-mono font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-[#5B6E75] font-semibold block mb-0.5">Payoff Months</label>
                                <input
                                  type="number"
                                  value={d.timeframeMonths}
                                  onChange={(e) => updateDebtItem(d.id, 'timeframeMonths', Number(e.target.value))}
                                  className="w-full bg-[#FAF6F2] text-[#1B333F] p-2 rounded-lg border border-[rgba(43,79,96,0.12)] font-mono font-bold"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Stock Investments Inputs (Satisfies Request #5) */}
                  {selectedGoalTypes.includes('stock_investments') && (
                    <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-3">
                      <h4 className="font-serif font-medium text-teal-950 text-xs flex items-center space-x-1.5">
                        <LineChart className="w-4 h-4 text-[#4F8683]" />
                        <span>Stock Investments & Asset Portfolio Setup</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[#5B6E75] block mb-1 font-semibold">Portfolio Target ({currency})</label>
                          <input
                            type="number"
                            value={stockTargetAmount}
                            onChange={(e) => setStockTargetAmount(Number(e.target.value))}
                            className="w-full bg-white text-[#4F8683] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[#5B6E75] block mb-1 font-semibold">Target Months</label>
                          <input
                            type="number"
                            value={stockTimeframeMonths}
                            onChange={(e) => setStockTimeframeMonths(Number(e.target.value))}
                            className="w-full bg-white text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] font-mono font-bold"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[#5B6E75] block mb-1 font-semibold">Preferred Asset Mix</label>
                          <input
                            type="text"
                            value={stockAssetTypes}
                            onChange={(e) => setStockAssetTypes(e.target.value)}
                            className="w-full bg-white text-[#1B333F] p-2 rounded-xl border border-[rgba(43,79,96,0.15)] font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-[#5B6E75] block mb-1 font-semibold">Expected Annual Yield (%)</label>
                          <input
                            type="number"
                            value={stockExpectedYield}
                            onChange={(e) => setStockExpectedYield(Number(e.target.value))}
                            className="w-full bg-white text-[#4F8683] p-2 rounded-xl border border-[rgba(43,79,96,0.15)] font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. Custom Goal Inputs */}
                  {selectedGoalTypes.includes('other') && (
                    <div className="p-4 bg-[#FAF6F2] border border-[rgba(43,79,96,0.13)] rounded-2xl space-y-3">
                      <h4 className="font-serif font-medium text-[#1B333F] text-xs">Custom Goal Details</h4>
                      <div>
                        <label className="text-[#5B6E75] block mb-1 font-semibold">Specify Your Personal Reason / Goal</label>
                        <textarea
                          rows={2}
                          value={customGoalReason}
                          onChange={(e) => setCustomGoalReason(e.target.value)}
                          className="w-full bg-white text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] font-medium mb-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[#5B6E75] block mb-1 font-semibold">Target Capital Needed ({currency})</label>
                          <input
                            type="number"
                            value={customTargetAmount}
                            onChange={(e) => setCustomTargetAmount(Number(e.target.value))}
                            className="w-full bg-white text-[#4F8683] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[#5B6E75] block mb-1 font-semibold">Timeframe (Months)</label>
                          <input
                            type="number"
                            value={customTimeframeMonths}
                            onChange={(e) => setCustomTimeframeMonths(Number(e.target.value))}
                            className="w-full bg-white text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: Income, Subscriptions & Liquidity Balances */}
            {step === 3 && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-[rgba(43,79,96,0.12)] pb-3">
                  <h3 className="text-sm font-serif font-medium text-[#1B333F] flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-[#4F8683]" />
                    <span>Monthly Cash Flow & Bank Balances</span>
                  </h3>
                  <p className="text-[#5B6E75] text-[11px] mt-0.5">Provide income and active accounts so the AI can calculate realistic weekly caps.</p>
                </div>

                <div>
                  <label className="text-[#1B333F] font-semibold block mb-1">Net Monthly Income ({currency})</label>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full bg-[#FAF6F2] text-[#4F8683] text-base font-bold p-3 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#4F8683] font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#1B333F] font-semibold block mb-1">Main Bank Balance ({currency})</label>
                    <input
                      type="number"
                      value={bankBalance}
                      onChange={(e) => setBankBalance(Number(e.target.value))}
                      className="w-full bg-[#FAF6F2] text-[#2B4F60] font-bold p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[#1B333F] font-semibold block mb-1">InstaPay / Mobile Wallet ({currency})</label>
                    <input
                      type="number"
                      value={instaPayBalance}
                      onChange={(e) => setInstaPayBalance(Number(e.target.value))}
                      className="w-full bg-[#FAF6F2] text-[#845460] font-bold p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] font-mono"
                    />
                  </div>
                </div>

                {/* Subscriptions */}
                <div className="p-3 bg-[#FAF6F2] border border-[rgba(43,79,96,0.12)] rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#1B333F] flex items-center space-x-1">
                      <Tv className="w-3.5 h-3.5 text-[#845460]" />
                      <span>Active Subscriptions & Recurring Bills</span>
                    </span>
                    <span className="text-[10px] text-[#5B6E75] font-mono">
                      Total: {selectedSubs.reduce((acc, s) => acc + s.amount, 0).toLocaleString()} {currency}/mo
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {selectedSubs.map((sub) => (
                      <div key={sub.id} className="p-2 bg-white rounded-lg flex items-center justify-between border border-[rgba(43,79,96,0.1)]">
                        <span className="font-medium text-[#1B333F]">{sub.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-[#845460] text-xs">{sub.amount} {currency}</span>
                          <button type="button" onClick={() => toggleSub(sub.id)} className="text-[#5B6E75] hover:text-rose-600 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: AI Plan Result & Review/Edit Mode (Satisfies Request #2) */}
            {step === 4 && generatedPlan && (
              <div className="space-y-5 text-xs">
                <div className="border-b border-[rgba(43,79,96,0.12)] pb-3 flex justify-between items-center">
                  <div>
                    <span className="bg-[#EAD3CB] text-[#845460] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                      AI Studio Generated Spending Plan
                    </span>
                    <h3 className="text-base font-serif font-medium text-[#1B333F] mt-1 flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-[#D98B6F]" />
                      <span>{generatedPlan.strategyTitle}</span>
                    </h3>
                  </div>

                  {/* Toggle Edit Plan Mode */}
                  <button
                    type="button"
                    onClick={() => setIsEditingPlan(!isEditingPlan)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition cursor-pointer ${
                      isEditingPlan
                        ? 'bg-[#845460] text-white border-[#845460]'
                        : 'bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#2B4F60] border-[rgba(43,79,96,0.15)]'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingPlan ? 'Lock Edits' : 'Edit Plan Allocations'}</span>
                  </button>
                </div>

                {/* Weekly Spending Cap Showcase */}
                <div className="bg-[#2B4F60] text-white rounded-2xl p-5 space-y-3 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-teal-200 font-semibold uppercase tracking-wider block">
                      Target Weekly Spending Allowance
                    </span>
                    {isEditingPlan && <span className="text-[10px] text-teal-200 font-mono">Editable Mode</span>}
                  </div>

                  <div className="flex items-baseline space-x-2 font-mono">
                    {isEditingPlan ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={generatedPlan.weeklySpendingLimit}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setGeneratedPlan({
                              ...generatedPlan,
                              weeklySpendingLimit: val,
                              monthlySpendingLimit: Math.round(val * 4.33)
                            });
                          }}
                          className="bg-white/10 text-white text-2xl font-bold p-1 rounded border border-white/20 w-36 font-mono"
                        />
                        <span className="text-sm font-semibold">{currency} / week</span>
                      </div>
                    ) : (
                      <>
                        <span className="text-3xl font-bold">{generatedPlan.weeklySpendingLimit.toLocaleString()}</span>
                        <span className="text-sm font-semibold">{currency} / week</span>
                      </>
                    )}
                  </div>

                  <p className="text-[11px] text-teal-100/90 leading-relaxed font-sans">
                    {generatedPlan.strategySummary}
                  </p>
                </div>

                {/* Category Breakdown Table / Editable Grid */}
                <div className="bg-[#FAF6F2] border border-[rgba(43,79,96,0.13)] rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-serif font-medium text-[#1B333F] text-xs">
                      Category Division {isEditingPlan ? '(Adjust Monthly Amounts Below)' : ''}
                    </span>
                    <span className="text-[10px] text-[#5B6E75] font-mono">
                      Monthly Total: {generatedPlan.monthlySpendingLimit.toLocaleString()} {currency}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-[11px]">
                    {/* Groceries */}
                    <div className="bg-white p-2.5 rounded-xl border border-[rgba(43,79,96,0.1)]">
                      <span className="text-[#5B6E75] text-[10px] block font-sans font-semibold mb-0.5">Groceries</span>
                      {isEditingPlan ? (
                        <input
                          type="number"
                          value={generatedPlan.categoryBreakdown.groceries.monthly}
                          onChange={(e) => updateCategoryAllocation('groceries', Number(e.target.value))}
                          className="w-full bg-[#FAF6F2] text-[#1B333F] font-bold text-center rounded p-1 border border-[rgba(43,79,96,0.15)]"
                        />
                      ) : (
                        <span className="font-bold text-[#1B333F]">{generatedPlan.categoryBreakdown.groceries.weekly.toLocaleString()} {currency}/wk</span>
                      )}
                    </div>

                    {/* Transport */}
                    <div className="bg-white p-2.5 rounded-xl border border-[rgba(43,79,96,0.1)]">
                      <span className="text-[#5B6E75] text-[10px] block font-sans font-semibold mb-0.5">Transport</span>
                      {isEditingPlan ? (
                        <input
                          type="number"
                          value={generatedPlan.categoryBreakdown.transport.monthly}
                          onChange={(e) => updateCategoryAllocation('transport', Number(e.target.value))}
                          className="w-full bg-[#FAF6F2] text-[#1B333F] font-bold text-center rounded p-1 border border-[rgba(43,79,96,0.15)]"
                        />
                      ) : (
                        <span className="font-bold text-[#1B333F]">{generatedPlan.categoryBreakdown.transport.weekly.toLocaleString()} {currency}/wk</span>
                      )}
                    </div>

                    {/* Dining Out */}
                    <div className="bg-white p-2.5 rounded-xl border border-[rgba(43,79,96,0.1)]">
                      <span className="text-[#5B6E75] text-[10px] block font-sans font-semibold mb-0.5">Dining Out</span>
                      {isEditingPlan ? (
                        <input
                          type="number"
                          value={generatedPlan.categoryBreakdown.diningOut.monthly}
                          onChange={(e) => updateCategoryAllocation('diningOut', Number(e.target.value))}
                          className="w-full bg-[#FAF6F2] text-[#1B333F] font-bold text-center rounded p-1 border border-[rgba(43,79,96,0.15)]"
                        />
                      ) : (
                        <span className="font-bold text-[#1B333F]">{generatedPlan.categoryBreakdown.diningOut.weekly.toLocaleString()} {currency}/wk</span>
                      )}
                    </div>

                    {/* Goal Savings */}
                    <div className="bg-teal-50 border border-teal-200 p-2.5 rounded-xl">
                      <span className="text-teal-800 text-[10px] block font-sans font-bold mb-0.5">Goal Savings</span>
                      <span className="font-bold text-teal-900">{generatedPlan.recommendedSavingsOrDebtWeekly.toLocaleString()} {currency}/wk</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Controls (Satisfies Request #4 for Exact Symmetrical Buttons!) */}
            <div className="flex items-center justify-between pt-4 border-t border-[rgba(43,79,96,0.12)]">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="w-36 sm:w-48 h-11 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#1B333F] border border-[rgba(43,79,96,0.15)] transition cursor-pointer shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-36 sm:w-48 h-11 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 text-[#5B6E75] hover:text-[#1B333F] bg-[#FAF6F2] border border-transparent transition cursor-pointer shrink-0"
                >
                  <span>Back to Login</span>
                </button>
              )}

              {step === 1 && (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-36 sm:w-48 h-11 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 bg-[#2B4F60] hover:bg-[#1B333F] text-white shadow-xs transition cursor-pointer shrink-0"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 text-[#D98B6F]" />
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-36 sm:w-48 h-11 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 bg-[#2B4F60] hover:bg-[#1B333F] text-white shadow-xs transition cursor-pointer shrink-0"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 text-[#D98B6F]" />
                </button>
              )}

              {step === 3 && (
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  className="w-36 sm:w-48 h-11 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 bg-[#2B4F60] hover:bg-[#1B333F] text-white shadow-xs transition cursor-pointer shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-[#D98B6F]" />
                  <span>Generate AI Plan</span>
                </button>
              )}

              {step === 4 && (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-36 sm:w-48 h-11 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 bg-[#4F8683] hover:bg-[#4F8683]/90 text-white shadow-xs transition cursor-pointer shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Build Dashboard</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
