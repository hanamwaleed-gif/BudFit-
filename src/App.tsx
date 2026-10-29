import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { CashFlowCalendar } from './components/CashFlowCalendar';
import { EnhancedSpendingBreakdown } from './components/EnhancedSpendingBreakdown';
import { SpendingLedger } from './components/SpendingLedger';
import { AccountDashboard } from './components/AccountDashboard';
import { SubscriptionAuditView } from './components/SubscriptionAuditView';
import { OpenBankingView } from './components/OpenBankingView';
import { FinancialGoals } from './components/FinancialGoals';
import { PersonalizedSpendingPlanView } from './components/PersonalizedSpendingPlanView';
import { CommunityHub } from './components/CommunityHub';
import { CommunityModal } from './components/CommunityModal';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { AISpendingInsights } from './components/AISpendingInsights';
import { AuthScreen } from './components/AuthScreen';

import { SmartReceiptOcrModal } from './components/SmartReceiptOcrModal';
import { SpendingWrappedModal } from './components/SpendingWrappedModal';
import { SettingsModal } from './components/SettingsModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AutoCatRulesModal } from './components/AutoCatRulesModal';

import { ARCHETYPES } from './data/archetypes';
import { Transaction, Account, Budget, Rule, FinancialGoal, AIInsight, FXRates, ReceiptScanResult, UserProfile } from './types';
import { CategoryEngine } from './services/CategoryEngine';

export default function App() {
  const defaultArchetype = ARCHETYPES['egyptian-tech-freelancer'];

  // Auth User state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('budfit_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  // State Management with LocalStorage persistence
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activeArchetypeId, setActiveArchetypeId] = useState<string>('egyptian-tech-freelancer');
  const [primaryCurrency, setPrimaryCurrency] = useState<string>('EGP');

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('budfit_transactions');
    return saved ? JSON.parse(saved) : defaultArchetype.preset.transactions;
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('budfit_accounts');
    return saved ? JSON.parse(saved) : defaultArchetype.preset.accounts;
  });

  const [budget, setBudget] = useState<Budget>(() => {
    const saved = localStorage.getItem('budfit_budget');
    return saved ? JSON.parse(saved) : defaultArchetype.preset.budget;
  });

  const [rules, setRules] = useState<Rule[]>(() => {
    const saved = localStorage.getItem('budfit_rules');
    return saved ? JSON.parse(saved) : defaultArchetype.preset.rules;
  });

  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    const saved = localStorage.getItem('budfit_goals');
    return saved ? JSON.parse(saved) : defaultArchetype.preset.goals;
  });

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      id: 'ins_1',
      type: 'warning',
      title: 'High Dining Out Velocity (Talabat)',
      description: 'You spent 3,400 EGP on Talabat delivery in the last 7 days. At this pace, dining out will exceed your budget by 40%.',
      action: 'Set Dining Limit',
      category: 'dining',
      isRead: false,
      isActioned: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ins_2',
      type: 'info',
      title: 'Subscription Price Increase Detected',
      description: 'ChatGPT Plus subscription auto-renewed at 1,100 EGP (up from 980 EGP due to FX fluctuation).',
      action: 'Audit Subscriptions',
      category: 'subscriptions',
      isRead: false,
      isActioned: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ins_3',
      type: 'success',
      title: 'Sahel Vacation Goal Milestone',
      description: 'Deposit of 15,000 EGP reached 70% of your North Coast Summer trip target!',
      action: 'View Goal',
      category: 'savings',
      isRead: false,
      isActioned: false,
      createdAt: new Date().toISOString()
    }
  ]);

  const [fxRates, setFxRates] = useState<FXRates>({
    USD: 1,
    EGP: 48.5,
    EUR: 0.92,
    GBP: 0.79,
    SAR: 3.75
  });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [defaultModalDate, setDefaultModalDate] = useState<string | null>(null);
  const [isReceiptOcrOpen, setIsReceiptOcrOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWrappedOpen, setIsWrappedOpen] = useState(false);
  const [isAutoCatRulesOpen, setIsAutoCatRulesOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('budfit_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budfit_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('budfit_budget', JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('budfit_rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('budfit_goals', JSON.stringify(goals));
  }, [goals]);

  // Fetch FX rates on load
  useEffect(() => {
    fetch('/api/fx-rates')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setFxRates(data);
      })
      .catch(err => console.error('FX fetch error:', err));
  }, []);

  // Switch Archetypes
  const handleSelectArchetype = (archetypeId: string) => {
    const arch = ARCHETYPES[archetypeId];
    if (!arch) return;
    setActiveArchetypeId(archetypeId);
    setPrimaryCurrency(arch.currency);
    setTransactions(arch.preset.transactions);
    setAccounts(arch.preset.accounts);
    setBudget(arch.preset.budget);
    setRules(arch.preset.rules);
    setGoals(arch.preset.goals);

    if (arch.preset.userProfile) {
      setCurrentUser(prevUser => {
        const updated: UserProfile = {
          id: prevUser?.id || `usr_demo_${archetypeId}`,
          email: arch.preset.userProfile?.email || prevUser?.email || 'user@budfit.ai',
          fullName: arch.preset.userProfile?.fullName || prevUser?.fullName || arch.name,
          archetypeId: archetypeId,
          createdAt: prevUser?.createdAt || new Date().toISOString(),
          ...arch.preset.userProfile
        };
        localStorage.setItem('budfit_auth_user', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Add / Edit Transaction Handlers
  const handleSaveTransaction = (tx: Transaction) => {
    if (editingTransaction) {
      setTransactions(prev => prev.map(item => item.id === tx.id ? tx : item));
      setEditingTransaction(null);
    } else {
      setTransactions(prev => [tx, ...prev]);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Receipt OCR Handler
  const handleReceiptExtracted = (result: ReceiptScanResult) => {
    const newTx: Transaction = {
      id: `tx_receipt_${Date.now()}`,
      merchant: result.merchant,
      amount: result.total,
      currency: result.currency || primaryCurrency,
      category: result.category,
      categoryGroup: result.categoryGroup || 'living',
      subCategory: result.subCategory,
      date: result.date || new Date().toISOString().split('T')[0],
      type: 'expense',
      paymentMethod: result.paymentMethod || 'Telda Card',
      tags: ['Receipt OCR', result.category]
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // Sync Open Banking Feed
  const handleSyncNewTransactions = (newTxList: Transaction[]) => {
    setTransactions(prev => [...newTxList, ...prev]);
  };

  // Goals deposit
  const handleDepositGoal = (goalId: string, amount: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, currentAmount: g.currentAmount + amount };
      }
      return g;
    }));
  };

  // Refresh AI Insights via server endpoint
  const handleRefreshAiInsights = async () => {
    try {
      const res = await fetch('/api/ai/spending-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions,
          budget,
          currency: primaryCurrency
        })
      });
      const data = await res.json();
      if (data.insights && data.insights.length > 0) {
        setAiInsights(data.insights);
      }
    } catch (err) {
      console.error('Failed to query server AI insights:', err);
    }
  };

  // Apply Rules to All Ledger
  const handleApplyRulesToAll = () => {
    const engine = new CategoryEngine(rules);
    const updated = engine.applyRulesToTransactions(transactions);
    setTransactions(updated);
    setIsAutoCatRulesOpen(false);
  };

  // App State object for JSON backup export
  const fullAppState = {
    transactions,
    accounts,
    budget,
    rules,
    goals,
    activeArchetypeId,
    primaryCurrency
  };

  const handleRestoreImportState = (importedData: any) => {
    if (importedData.transactions) setTransactions(importedData.transactions);
    if (importedData.accounts) setAccounts(importedData.accounts);
    if (importedData.budget) setBudget(importedData.budget);
    if (importedData.rules) setRules(importedData.rules);
    if (importedData.goals) setGoals(importedData.goals);
    if (importedData.primaryCurrency) setPrimaryCurrency(importedData.primaryCurrency);
  };

  const handleLogin = (user: UserProfile, customData?: any) => {
    let finalUser = user;
    if (user.archetypeId && ARCHETYPES[user.archetypeId]?.preset?.userProfile) {
      finalUser = {
        ...ARCHETYPES[user.archetypeId].preset.userProfile,
        ...user
      };
    }
    setCurrentUser(finalUser);
    localStorage.setItem('budfit_auth_user', JSON.stringify(finalUser));

    if (customData) {
      if (customData.primaryCurrency) setPrimaryCurrency(customData.primaryCurrency);
      if (customData.accounts) {
        setAccounts(customData.accounts);
        localStorage.setItem('budfit_accounts', JSON.stringify(customData.accounts));
      }
      if (customData.budget) {
        setBudget(customData.budget);
        localStorage.setItem('budfit_budget', JSON.stringify(customData.budget));
      }
      if (customData.transactions) {
        setTransactions(customData.transactions);
        localStorage.setItem('budfit_transactions', JSON.stringify(customData.transactions));
      }
      if (customData.goals) {
        setGoals(customData.goals);
        localStorage.setItem('budfit_goals', JSON.stringify(customData.goals));
      }
    } else if (user.archetypeId && ARCHETYPES[user.archetypeId]) {
      handleSelectArchetype(user.archetypeId);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('budfit_auth_user');
  };

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FAF6F2] text-[#22323A] font-sans selection:bg-[#EAD3CB] selection:text-[#6A414B]">
      {/* Top Header & Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeArchetypeId={activeArchetypeId}
        onSelectArchetype={handleSelectArchetype}
        primaryCurrency={primaryCurrency}
        onCurrencyChange={setPrimaryCurrency}
        fxRates={fxRates}
        onOpenAddTransaction={() => {
          setEditingTransaction(null);
          setDefaultModalDate(null);
          setIsAddModalOpen(true);
        }}
        onOpenReceiptOcr={() => setIsReceiptOcrOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWrapped={() => setIsWrappedOpen(true)}
        onOpenCommunity={() => setIsCommunityOpen(true)}
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* Main App Content View Switcher */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewDashboard
            transactions={transactions}
            accounts={accounts}
            budget={budget}
            aiInsights={aiInsights}
            primaryCurrency={primaryCurrency}
            onOpenAddTransaction={() => {
              setEditingTransaction(null);
              setDefaultModalDate(null);
              setIsAddModalOpen(true);
            }}
            onOpenReceiptOcr={() => setIsReceiptOcrOpen(true)}
            onOpenOpenBanking={() => setActiveTab('accounts')}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'calendar' && (
          <CashFlowCalendar
            transactions={transactions}
            budget={budget}
            primaryCurrency={primaryCurrency}
            onAddTransactionForDate={(dateStr) => {
              setEditingTransaction(null);
              setDefaultModalDate(dateStr);
              setIsAddModalOpen(true);
            }}
          />
        )}

        {activeTab === 'breakdown' && (
          <EnhancedSpendingBreakdown
            transactions={transactions}
            budget={budget}
            primaryCurrency={primaryCurrency}
          />
        )}

        {activeTab === 'ledger' && (
          <SpendingLedger
            transactions={transactions}
            primaryCurrency={primaryCurrency}
            onOpenAddTransaction={() => {
              setEditingTransaction(null);
              setDefaultModalDate(null);
              setIsAddModalOpen(true);
            }}
            onEditTransaction={(tx) => {
              setEditingTransaction(tx);
              setIsAddModalOpen(true);
            }}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'accounts' && (
          <AccountDashboard
            accounts={accounts}
            primaryCurrency={primaryCurrency}
            onSyncNewTransactions={handleSyncNewTransactions}
            onAddAccount={() => {
              const newAcc: Account = {
                id: `acc_${Date.now()}`,
                name: 'New Digital Wallet',
                type: 'wallet',
                subtype: 'telda',
                bankName: 'Fintech Provider',
                accountNumber: '•••• 7710',
                currency: primaryCurrency,
                balance: 10000,
                availableBalance: 10000,
                isActive: true,
                color: '#10B981'
              };
              setAccounts(prev => [...prev, newAcc]);
            }}
          />
        )}

        {activeTab === 'subscriptions' && (
          <SubscriptionAuditView
            transactions={transactions}
            primaryCurrency={primaryCurrency}
          />
        )}

        {activeTab === 'openbanking' && (
          <OpenBankingView
            onSyncNewTransactions={handleSyncNewTransactions}
            primaryCurrency={primaryCurrency}
          />
        )}

        {activeTab === 'ai-plan' && (
          <PersonalizedSpendingPlanView
            user={currentUser}
            goals={goals}
            currency={primaryCurrency}
            onUpdatePlan={(updatedPlan) => {
              const updatedUser = { ...currentUser, aiSpendingPlan: updatedPlan };
              setCurrentUser(updatedUser);
              localStorage.setItem('budfit_auth_user', JSON.stringify(updatedUser));
            }}
          />
        )}

        {activeTab === 'community' && (
          <CommunityHub
            user={currentUser}
            currency={primaryCurrency}
          />
        )}

        {activeTab === 'goals' && (
          <FinancialGoals
            goals={goals}
            primaryCurrency={primaryCurrency}
            user={currentUser}
            onAddGoal={(g) => setGoals(prev => [...prev, g])}
            onDepositGoal={handleDepositGoal}
          />
        )}

        {activeTab === 'simulator' && (
          <ScenarioSimulator
            goals={goals}
            budget={budget}
            transactions={transactions}
            primaryCurrency={primaryCurrency}
            userProfile={currentUser}
          />
        )}

        {activeTab === 'ai-insights' && (
          <AISpendingInsights
            insights={aiInsights}
            transactions={transactions}
            budget={budget}
            primaryCurrency={primaryCurrency}
            onRefreshInsights={handleRefreshAiInsights}
          />
        )}
      </main>

      {/* Modals Container */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
          setDefaultModalDate(null);
        }}
        onSaveTransaction={handleSaveTransaction}
        primaryCurrency={primaryCurrency}
        initialTransaction={editingTransaction}
        defaultDate={defaultModalDate}
      />

      <SmartReceiptOcrModal
        isOpen={isReceiptOcrOpen}
        onClose={() => setIsReceiptOcrOpen(false)}
        onReceiptExtracted={handleReceiptExtracted}
        primaryCurrency={primaryCurrency}
      />

      <SpendingWrappedModal
        isOpen={isWrappedOpen}
        onClose={() => setIsWrappedOpen(false)}
        transactions={transactions}
        primaryCurrency={primaryCurrency}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        primaryCurrency={primaryCurrency}
        onCurrencyChange={setPrimaryCurrency}
        activeArchetypeId={activeArchetypeId}
        onSelectArchetype={handleSelectArchetype}
        appState={fullAppState}
        onRestoreImportState={handleRestoreImportState}
      />

      <AutoCatRulesModal
        isOpen={isAutoCatRulesOpen}
        onClose={() => setIsAutoCatRulesOpen(false)}
        rules={rules}
        onAddRule={(r) => setRules(prev => [...prev, r])}
        onDeleteRule={(id) => setRules(prev => prev.filter(r => r.id !== id))}
        onApplyRulesToAll={handleApplyRulesToAll}
      />

      <CommunityModal
        isOpen={isCommunityOpen}
        onClose={() => setIsCommunityOpen(false)}
        user={currentUser || ({} as any)}
        currency={primaryCurrency}
      />
    </div>
  );
}
