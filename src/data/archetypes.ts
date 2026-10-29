import { Archetype } from '../types';

export const ARCHETYPES: Record<string, Archetype> = {
  'egyptian-tech-freelancer': {
    id: 'egyptian-tech-freelancer',
    name: 'Omar Al-Masri (EGP)',
    currency: 'EGP',
    locale: 'EG',
    description: 'Tech professional with USD & EGP CIB accounts, InstaPay transfers, Telda wallet, Thndr stock investments, Sahel vacation fund, and CIB credit card debt payoff.',
    preset: {
      userProfile: {
        id: 'usr_demo_egyptian-tech-freelancer',
        email: 'omar.tech@budfit.ai',
        fullName: 'Omar Al-Masri',
        archetypeId: 'egyptian-tech-freelancer',
        incomeType: 'variable_freelance',
        riskTolerance: 'balanced',
        lifeStage: 'young_pro',
        financialLiteracy: 'advanced',
        primaryGoal: {
          type: 'net_worth',
          title: 'Net Worth 1M EGP + CIB Credit Card Payoff + EGX Stock Portfolio',
          targetAmount: 1000000,
          targetTimeframeMonths: 24,
          customReason: 'Building 1M EGP net worth while liquidating 24% credit card debt and building EGX/US equities stock portfolio'
        },
        aiSpendingPlan: {
          weeklySpendingLimit: 8000,
          monthlySpendingLimit: 35000,
          recommendedSavingsOrDebtMonthly: 30000,
          recommendedSavingsOrDebtWeekly: 6928,
          timeframeToReachGoalMonths: 24,
          categoryBreakdown: {
            groceries: { monthly: 8000, weekly: 1848, percentage: 12 },
            housing: { monthly: 10000, weekly: 2309, percentage: 15 },
            transport: { monthly: 4000, weekly: 924, percentage: 6 },
            diningOut: { monthly: 5000, weekly: 1155, percentage: 8 },
            entertainment: { monthly: 3000, weekly: 693, percentage: 5 },
            shopping: { monthly: 3000, weekly: 693, percentage: 5 },
            utilities: { monthly: 2000, weekly: 462, percentage: 3 },
            goalSavingsOrDebt: { monthly: 30000, weekly: 6928, percentage: 46 }
          },
          strategyTitle: 'USD/EGP Yield Maximization & High-Interest Debt Liquidation',
          strategySummary: 'Automated strategy allocating 30,000 EGP/month toward 18.5% CIB Certificates, 24% credit card debt elimination, and EGX 30 index compounding to reach 1,000,000 EGP Net Worth.',
          investmentRecommendations: [
            {
              id: 'rec_1',
              title: 'CIB High-Yield Certificates (CDs)',
              description: '18.5% annual guaranteed coupon payout for emergency liquidity reserve.',
              expectedYield: '18.5% APY',
              riskLevel: 'Low',
              recommendedAllocationPct: 40,
              icon: 'ShieldCheck'
            },
            {
              id: 'rec_2',
              title: 'EGX 30 Index Fund & Gold ETFs (Thndr)',
              description: 'Diversified equity exposure hedging against FX inflation.',
              expectedYield: '22.0% CAGR',
              riskLevel: 'Medium',
              recommendedAllocationPct: 35,
              icon: 'TrendingUp'
            },
            {
              id: 'rec_3',
              title: 'Egyptian Treasury Bills (T-Bills)',
              description: 'Short-term government backed debt instruments with upfront yield.',
              expectedYield: '24.5% Net APY',
              riskLevel: 'Low',
              recommendedAllocationPct: 25,
              icon: 'Zap'
            }
          ]
        }
      },
      accounts: [
        {
          id: 'acc_cib_egp',
          name: 'CIB Everyday Savings',
          type: 'bank',
          subtype: 'cib',
          bankName: 'Commercial International Bank (CIB)',
          accountNumber: '•••• 8912',
          currency: 'EGP',
          balance: 84500,
          availableBalance: 84500,
          isActive: true,
          color: '#003366',
          tags: ['Main Bank', 'Salary']
        },
        {
          id: 'acc_instapay',
          name: 'InstaPay Instant Transfer',
          type: 'wallet',
          subtype: 'instapay',
          bankName: 'Central Bank of Egypt (IPN)',
          accountNumber: 'user@instapay',
          currency: 'EGP',
          balance: 14200,
          availableBalance: 14200,
          isActive: true,
          color: '#10B981',
          tags: ['Fast P2P', 'Instant']
        },
        {
          id: 'acc_telda',
          name: 'Telda Digital Mastercard',
          type: 'wallet',
          subtype: 'telda',
          bankName: 'Telda Financial',
          accountNumber: '•••• 4410',
          currency: 'EGP',
          balance: 5300,
          availableBalance: 5300,
          isActive: true,
          color: '#8B5CF6',
          tags: ['Online Shopping', 'Subscriptions']
        },
        {
          id: 'acc_thndr',
          name: 'Thndr EGX & US Stock Brokerage',
          type: 'investment',
          subtype: 'thndr',
          bankName: 'Thndr Capital',
          accountNumber: 'TH-99201',
          currency: 'EGP',
          balance: 45000,
          availableBalance: 45000,
          isActive: true,
          color: '#2563EB',
          tags: ['Stock Portfolio', 'EGX30']
        },
        {
          id: 'acc_cib_usd',
          name: 'CIB USD Freelance Account',
          type: 'bank',
          subtype: 'cib',
          bankName: 'CIB Wealth',
          accountNumber: 'USD •••• 9921',
          currency: 'USD',
          balance: 2450,
          availableBalance: 2450,
          isActive: true,
          color: '#F59E0B',
          tags: ['USD Revenue', 'Remote Work']
        }
      ],
      transactions: [
        {
          id: 'tx_eg_1',
          amount: 65000,
          currency: 'EGP',
          merchant: 'Toptal Remote Client Payment',
          category: 'freelance',
          categoryGroup: 'income',
          description: 'Monthly frontend development retainer contract',
          date: '2026-08-01',
          type: 'income',
          paymentMethod: 'CIB USD Wire',
          accountId: 'acc_cib_egp',
          isPayday: true,
          tags: ['Freelance', 'Client Payment']
        },
        {
          id: 'tx_eg_2',
          amount: 4200,
          currency: 'EGP',
          merchant: 'Carrefour Hypermarket',
          category: 'groceries',
          categoryGroup: 'living',
          description: 'Monthly grocery restocking (New Cairo)',
          date: '2026-08-03',
          type: 'expense',
          paymentMethod: 'Telda Card',
          accountId: 'acc_telda',
          tags: ['Groceries', 'Household']
        },
        {
          id: 'tx_eg_3',
          amount: 1250,
          currency: 'EGP',
          merchant: 'Egyptian Electricity Holding (EEHC)',
          category: 'electricity',
          categoryGroup: 'utilities',
          description: 'Smart meter recharge via Fawry',
          date: '2026-08-05',
          type: 'expense',
          paymentMethod: 'InstaPay',
          accountId: 'acc_instapay',
          isBillDue: true,
          tags: ['Utilities', 'Fawry']
        },
        {
          id: 'tx_eg_4',
          amount: 850,
          currency: 'EGP',
          merchant: 'WE Telecom Egypt Home Fiber 200Mbps',
          category: 'internet',
          categoryGroup: 'utilities',
          description: 'Monthly VDSL Fiber Broadband',
          date: '2026-08-06',
          type: 'expense',
          paymentMethod: 'InstaPay',
          accountId: 'acc_instapay',
          isBillDue: true,
          tags: ['Bills', 'Internet']
        },
        {
          id: 'tx_eg_5',
          amount: 1100,
          currency: 'EGP',
          merchant: 'ChatGPT Plus Subscription',
          category: 'saas',
          categoryGroup: 'subscriptions',
          description: '$20 USD AI Developer Plan (Price increased from EGP 980)',
          date: '2026-08-07',
          type: 'expense',
          paymentMethod: 'Telda Card',
          accountId: 'acc_telda',
          isRecurring: true,
          previousAmount: 980,
          recurrencePeriod: 'monthly',
          tags: ['AI Tools', 'Software']
        },
        {
          id: 'tx_eg_6',
          amount: 3400,
          currency: 'EGP',
          merchant: 'Talabat Food & Coffee Delivery',
          category: 'dining',
          categoryGroup: 'living',
          description: 'Team lunches and late night coding snacks',
          date: '2026-08-08',
          type: 'expense',
          paymentMethod: 'InstaPay',
          accountId: 'acc_instapay',
          tags: ['Food', 'Delivery']
        },
        {
          id: 'tx_eg_7',
          amount: 15000,
          currency: 'EGP',
          merchant: 'CIB High-Yield Sahel Savings Fund',
          category: 'savings_acc',
          categoryGroup: 'savings',
          description: 'Automated deposit to Summer Sahel Vacation Goal',
          date: '2026-08-09',
          type: 'transfer',
          paymentMethod: 'CIB Transfer',
          accountId: 'acc_cib_egp',
          tags: ['Savings Goal', 'Sahel']
        },
        {
          id: 'tx_eg_8',
          amount: 1850,
          currency: 'EGP',
          merchant: 'Uber Rides Egypt',
          category: 'transport',
          categoryGroup: 'living',
          description: 'Commutes to Greek Campus & Tagamoa',
          date: '2026-08-09',
          type: 'expense',
          paymentMethod: 'Telda Card',
          accountId: 'acc_telda',
          tags: ['Transport', 'Uber']
        },
        {
          id: 'tx_eg_9',
          amount: 6500,
          currency: 'EGP',
          merchant: 'CIB Platinum Credit Card Payoff',
          category: 'debt',
          categoryGroup: 'debt',
          description: 'Monthly high-interest credit card debt payment',
          date: '2026-08-10',
          type: 'expense',
          paymentMethod: 'InstaPay',
          accountId: 'acc_instapay',
          isBillDue: true,
          tags: ['Credit Card', 'Debt Payoff']
        },
        {
          id: 'tx_eg_10',
          amount: 12000,
          currency: 'EGP',
          merchant: 'Thndr EGX 30 Index Fund Deposit',
          category: 'investments',
          categoryGroup: 'savings',
          description: 'Monthly stock portfolio investment',
          date: '2026-08-11',
          type: 'transfer',
          paymentMethod: 'InstaPay',
          accountId: 'acc_thndr',
          tags: ['Stocks', 'Thndr', 'Investment']
        }
      ],
      budget: {
        id: 'bg_eg_1',
        name: 'Egyptian Freelancer Monthly Budget',
        currency: 'EGP',
        monthlyLimit: 45000,
        categoryLimits: {
          groceries: 8000,
          utilities: 4000,
          dining: 6000,
          transport: 4000,
          subscriptions: 3500,
          entertainment: 5000,
          savings: 15000
        },
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        isActive: true
      },
      rules: [
        {
          id: 'rule_1',
          name: 'Auto-tag Carrefour & Seoudi as Groceries',
          merchantMatch: 'carrefour|seoudi|alfa market|metro',
          category: 'groceries',
          categoryGroup: 'living',
          priority: 10,
          isActive: true
        },
        {
          id: 'rule_2',
          name: 'Auto-tag Talabat & Elmenus as Dining',
          merchantMatch: 'talabat|elmenus|cinnabon|starbucks',
          category: 'dining',
          categoryGroup: 'living',
          priority: 9,
          isActive: true
        },
        {
          id: 'rule_3',
          name: 'Auto-tag Fawry & EEHC as Utilities',
          merchantMatch: 'fawry|eehc|water bill|gas bill|we telecom',
          category: 'utilities',
          categoryGroup: 'utilities',
          priority: 8,
          isActive: true
        }
      ],
      goals: [
        {
          id: 'goal_emergency',
          title: '6-Month Emergency Liquidity Reserve',
          targetAmount: 180000,
          currentAmount: 135000,
          currency: 'EGP',
          targetDate: '2026-10-01',
          category: 'Emergency Reserve',
          color: '#4F8683',
          isCompleted: false,
          priority: 'high',
          horizon: 'short-term',
          autoReallocate: true,
          expectedMonthlyContrib: 15000,
          annualInterestReturn: 18.5,
          inflationAdjusted: true,
          notes: 'High-priority liquid buffer held in CIB 18.5% CDs & InstaPay'
        },
        {
          id: 'goal_debt_cib',
          title: 'CIB Platinum Credit Card Payoff',
          targetAmount: 35000,
          currentAmount: 22000,
          currency: 'EGP',
          targetDate: '2026-09-15',
          category: 'debt',
          color: '#D98B6F',
          isCompleted: false,
          priority: 'high',
          horizon: 'short-term',
          autoReallocate: true,
          expectedMonthlyContrib: 6500,
          annualInterestReturn: 24.0,
          inflationAdjusted: false,
          notes: 'High-priority 24% annual interest card balance elimination'
        },
        {
          id: 'goal_stocks_egx',
          title: 'EGX 30 & US Tech Stock Portfolio',
          targetAmount: 300000,
          currentAmount: 110000,
          currency: 'EGP',
          targetDate: '2027-06-01',
          category: 'investment',
          color: '#2563EB',
          isCompleted: false,
          priority: 'high',
          horizon: 'medium-term',
          autoReallocate: true,
          expectedMonthlyContrib: 12000,
          annualInterestReturn: 22.0,
          inflationAdjusted: true,
          notes: 'Stock Portfolio via Thndr: EGX 30 ETF, Gold Bullion & US Tech Funds'
        },
        {
          id: 'goal_sahel',
          title: 'North Coast (Sahel) Summer Trip',
          targetAmount: 50000,
          currentAmount: 38000,
          currency: 'EGP',
          targetDate: '2026-09-01',
          category: 'Vacation',
          color: '#06B6D4',
          isCompleted: false,
          priority: 'medium',
          horizon: 'short-term',
          autoReallocate: false,
          expectedMonthlyContrib: 6000,
          annualInterestReturn: 0,
          inflationAdjusted: false
        },
        {
          id: 'goal_macbook',
          title: 'MacBook Pro M3 Max Upgrade',
          targetAmount: 120000,
          currentAmount: 85000,
          currency: 'EGP',
          targetDate: '2026-11-15',
          category: 'Work Gear',
          color: '#8B5CF6',
          isCompleted: false,
          priority: 'high',
          horizon: 'medium-term',
          autoReallocate: true,
          expectedMonthlyContrib: 11500,
          annualInterestReturn: 5,
          inflationAdjusted: true
        }
      ]
    }
  },

  'cairo-corporate-exec': {
    id: 'cairo-corporate-exec',
    name: 'Nour El-Din (EGP/USD)',
    currency: 'EGP',
    locale: 'EG',
    description: 'Cairo corporate executive with CIB Private Banking, HSBC USD account, BMW car loan financing, Villa down payment goal, and US equities stock portfolio.',
    preset: {
      userProfile: {
        id: 'usr_demo_cairo-corporate-exec',
        email: 'nour.exec@budfit.ai',
        fullName: 'Nour El-Din',
        archetypeId: 'cairo-corporate-exec',
        incomeType: 'bonus_heavy',
        riskTolerance: 'balanced',
        lifeStage: 'family',
        financialLiteracy: 'advanced',
        primaryGoal: {
          type: 'big_purchase',
          title: 'New Cairo Luxury Villa Down Payment + BMW Loan Payoff + US Equities Stock Portfolio',
          targetAmount: 2500000,
          targetTimeframeMonths: 36,
          customReason: 'Executing executive asset strategy: villa down payment, BMW financing elimination, and $50k US equity compounding.'
        },
        aiSpendingPlan: {
          weeklySpendingLimit: 22000,
          monthlySpendingLimit: 95000,
          recommendedSavingsOrDebtMonthly: 85000,
          recommendedSavingsOrDebtWeekly: 19630,
          timeframeToReachGoalMonths: 36,
          categoryBreakdown: {
            groceries: { monthly: 18000, weekly: 4157, percentage: 10 },
            housing: { monthly: 35000, weekly: 8083, percentage: 19 },
            transport: { monthly: 15000, weekly: 3464, percentage: 8 },
            diningOut: { monthly: 12000, weekly: 2771, percentage: 7 },
            entertainment: { monthly: 8000, weekly: 1848, percentage: 4 },
            shopping: { monthly: 10000, weekly: 2309, percentage: 6 },
            utilities: { monthly: 5000, weekly: 1155, percentage: 3 },
            goalSavingsOrDebt: { monthly: 85000, weekly: 19630, percentage: 47 }
          },
          strategyTitle: 'Executive Wealth Accumulation & Car Loan Payoff Plan',
          strategySummary: 'Directing 85,000 EGP/month into BMW car loan payoff and US equities portfolio while protecting luxury family lifestyle bounds.',
          investmentRecommendations: [
            {
              id: 'rec_exec_1',
              title: 'US Equities & S&P 500 Index (Interactive Brokers)',
              description: 'USD-denominated long-term equity growth fund.',
              expectedYield: '11.5% APY USD',
              riskLevel: 'Medium',
              recommendedAllocationPct: 50,
              icon: 'TrendingUp'
            },
            {
              id: 'rec_exec_2',
              title: 'Egyptian Treasury Bills (T-Bills)',
              description: 'Tax-optimized short-term sovereign paper.',
              expectedYield: '22.5% Net EGP',
              riskLevel: 'Low',
              recommendedAllocationPct: 35,
              icon: 'ShieldCheck'
            },
            {
              id: 'rec_exec_3',
              title: 'Physical Gold Bullion',
              description: 'Inflation hedge and physical currency protection.',
              expectedYield: 'Hedge Yield',
              riskLevel: 'Low',
              recommendedAllocationPct: 15,
              icon: 'Zap'
            }
          ]
        }
      },
      accounts: [
        {
          id: 'acc_cib_private',
          name: 'CIB Private Wealth Banking',
          type: 'bank',
          subtype: 'cib',
          bankName: 'CIB Private',
          accountNumber: '•••• 0019',
          currency: 'EGP',
          balance: 340000,
          availableBalance: 340000,
          isActive: true,
          color: '#1E3A8A',
          tags: ['Executive Bank', 'Wealth']
        },
        {
          id: 'acc_hsbc_usd',
          name: 'HSBC Executive USD Account',
          type: 'bank',
          subtype: 'checking',
          bankName: 'HSBC Egypt',
          accountNumber: 'USD •••• 4422',
          currency: 'USD',
          balance: 12500,
          availableBalance: 12500,
          isActive: true,
          color: '#DC2626',
          tags: ['USD Savings', 'Offshore']
        },
        {
          id: 'acc_ibkr',
          name: 'Interactive Brokers USD Portfolio',
          type: 'investment',
          subtype: 'thndr',
          bankName: 'Interactive Brokers',
          accountNumber: 'U-982012',
          currency: 'USD',
          balance: 48000,
          availableBalance: 48000,
          isActive: true,
          color: '#10B981',
          tags: ['US Stocks', 'S&P 500']
        },
        {
          id: 'acc_instapay_exec',
          name: 'InstaPay Executive Wallet',
          type: 'wallet',
          subtype: 'instapay',
          bankName: 'Central Bank of Egypt (IPN)',
          accountNumber: 'nour@instapay',
          currency: 'EGP',
          balance: 28000,
          availableBalance: 28000,
          isActive: true,
          color: '#059669',
          tags: ['Instant P2P']
        }
      ],
      transactions: [
        {
          id: 'tx_ex_1',
          amount: 180000,
          currency: 'EGP',
          merchant: 'Multinational FMCG Executive Direct Deposit',
          category: 'salary',
          categoryGroup: 'income',
          description: 'Monthly Vice President salary deposit',
          date: '2026-08-01',
          type: 'income',
          paymentMethod: 'CIB Private Wire',
          accountId: 'acc_cib_private',
          isPayday: true,
          tags: ['Executive Salary', 'Primary']
        },
        {
          id: 'tx_ex_2',
          amount: 25000,
          currency: 'EGP',
          merchant: 'BMW Financial Services Auto Financing',
          category: 'debt',
          categoryGroup: 'debt',
          description: 'BMW 520i Monthly Financing Payment',
          date: '2026-08-03',
          type: 'expense',
          paymentMethod: 'CIB Auto Debit',
          accountId: 'acc_cib_private',
          isBillDue: true,
          tags: ['Car Loan', 'BMW']
        },
        {
          id: 'tx_ex_3',
          amount: 12500,
          currency: 'EGP',
          merchant: 'Gourmet Egypt Market',
          category: 'groceries',
          categoryGroup: 'living',
          description: 'Weekly organic groceries & imported goods',
          date: '2026-08-05',
          type: 'expense',
          paymentMethod: 'CIB Card',
          accountId: 'acc_cib_private',
          tags: ['Gourmet', 'Groceries']
        },
        {
          id: 'tx_ex_4',
          amount: 8500,
          currency: 'EGP',
          merchant: 'Gezira Sporting Club & Dining',
          category: 'dining',
          categoryGroup: 'living',
          description: 'Weekend family lunch & clubhouse sports',
          date: '2026-08-07',
          type: 'expense',
          paymentMethod: 'InstaPay',
          accountId: 'acc_instapay_exec',
          tags: ['Club', 'Dining']
        },
        {
          id: 'tx_ex_5',
          amount: 45000,
          currency: 'EGP',
          merchant: 'New Cairo Villa Developer Escrow',
          category: 'savings_acc',
          categoryGroup: 'savings',
          description: 'Monthly Villa Down Payment Goal Deposit',
          date: '2026-08-08',
          type: 'transfer',
          paymentMethod: 'CIB Transfer',
          accountId: 'acc_cib_private',
          tags: ['Villa Goal', 'Real Estate']
        }
      ],
      budget: {
        id: 'bg_ex_1',
        name: 'Executive Monthly Budget',
        currency: 'EGP',
        monthlyLimit: 95000,
        categoryLimits: {
          groceries: 18000,
          utilities: 5000,
          dining: 12000,
          transport: 15000,
          subscriptions: 5000,
          savings: 85000
        },
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        isActive: true
      },
      rules: [
        {
          id: 'rule_ex_1',
          name: 'Auto-tag Gourmet Egypt as Groceries',
          merchantMatch: 'gourmet|seoudi|fresh market',
          category: 'groceries',
          categoryGroup: 'living',
          priority: 10,
          isActive: true
        },
        {
          id: 'rule_ex_2',
          name: 'Auto-tag BMW Financial as Car Loan',
          merchantMatch: 'bmw|auto loan|car loan',
          category: 'debt',
          categoryGroup: 'debt',
          priority: 9,
          isActive: true
        }
      ],
      goals: [
        {
          id: 'goal_villa',
          title: 'New Cairo Luxury Villa Down Payment',
          targetAmount: 1800000,
          currentAmount: 1120000,
          currency: 'EGP',
          targetDate: '2027-12-01',
          category: 'Real Estate',
          color: '#3B82F6',
          isCompleted: false,
          priority: 'high',
          horizon: 'medium-term',
          autoReallocate: true,
          expectedMonthlyContrib: 45000,
          annualInterestReturn: 18.0,
          inflationAdjusted: true,
          notes: 'Pre-construction villa installment reserve in New Cairo'
        },
        {
          id: 'goal_bmw_loan',
          title: 'BMW 520i Financing Loan Payoff',
          targetAmount: 420000,
          currentAmount: 280000,
          currency: 'EGP',
          targetDate: '2026-12-01',
          category: 'debt',
          color: '#D98B6F',
          isCompleted: false,
          priority: 'high',
          horizon: 'short-term',
          autoReallocate: true,
          expectedMonthlyContrib: 25000,
          annualInterestReturn: 19.5,
          notes: 'High-priority 19.5% car financing loan elimination'
        },
        {
          id: 'goal_us_portfolio',
          title: 'US Equities & Tech Stock Portfolio',
          targetAmount: 50000,
          currentAmount: 38000,
          currency: 'USD',
          targetDate: '2027-06-01',
          category: 'investment',
          color: '#10B981',
          isCompleted: false,
          priority: 'high',
          horizon: 'long-term',
          autoReallocate: true,
          expectedMonthlyContrib: 2000,
          annualInterestReturn: 12.0,
          notes: 'Interactive Brokers USD portfolio: S&P 500 (VOO) & Tech ETFs'
        },
        {
          id: 'goal_kids_edu',
          title: 'International School Tuition Reserve',
          targetAmount: 250000,
          currentAmount: 190000,
          currency: 'EGP',
          targetDate: '2026-09-01',
          category: 'Education',
          color: '#2B4F60',
          isCompleted: false,
          priority: 'high',
          horizon: 'short-term',
          autoReallocate: true,
          expectedMonthlyContrib: 15000
        }
      ]
    }
  },

  'global-tech-engineer': {
    id: 'global-tech-engineer',
    name: 'Alex Chen (USD)',
    currency: 'USD',
    locale: 'US',
    description: 'Senior Software Engineer with Chase checking, Fidelity S&P 500 index funds, Tesla auto financing payoff, and California home down payment reserve.',
    preset: {
      userProfile: {
        id: 'usr_demo_global-tech-engineer',
        email: 'alex.chen@budfit.ai',
        fullName: 'Alex Chen',
        archetypeId: 'global-tech-engineer',
        incomeType: 'fixed',
        riskTolerance: 'aggressive',
        lifeStage: 'young_pro',
        financialLiteracy: 'advanced',
        primaryGoal: {
          type: 'stock_investments',
          title: 'California Home Down Payment + S&P 500 Stock Growth + Tesla Financing Payoff',
          targetAmount: 220000,
          targetTimeframeMonths: 24,
          customReason: 'Optimizing US engineering compensation into index compounding, auto debt payoff, and California real estate down payment.'
        },
        aiSpendingPlan: {
          weeklySpendingLimit: 1150,
          monthlySpendingLimit: 4980,
          recommendedSavingsOrDebtMonthly: 4200,
          recommendedSavingsOrDebtWeekly: 970,
          timeframeToReachGoalMonths: 24,
          categoryBreakdown: {
            groceries: { monthly: 800, weekly: 185, percentage: 9 },
            housing: { monthly: 2200, weekly: 508, percentage: 24 },
            transport: { monthly: 650, weekly: 150, percentage: 7 },
            diningOut: { monthly: 500, weekly: 115, percentage: 5 },
            entertainment: { monthly: 300, weekly: 69, percentage: 3 },
            shopping: { monthly: 300, weekly: 69, percentage: 3 },
            utilities: { monthly: 230, weekly: 53, percentage: 2 },
            goalSavingsOrDebt: { monthly: 4200, weekly: 970, percentage: 46 }
          },
          strategyTitle: 'Silicon Valley Wealth Acceleration & Auto Debt Payoff',
          strategySummary: 'Directs $4,200/month into S&P 500 index compounding and Tesla auto loan payoff while maintaining a controlled $1,150/week living allowance.',
          investmentRecommendations: [
            {
              id: 'rec_us_1',
              title: 'Vanguard S&P 500 ETF (VOO)',
              description: 'Core broad-market US equity accumulation.',
              expectedYield: '10.5% Historical CAGR',
              riskLevel: 'Medium',
              recommendedAllocationPct: 60,
              icon: 'TrendingUp'
            },
            {
              id: 'rec_us_2',
              title: 'Treasury Money Market Fund (SPAXX)',
              description: 'High liquidity liquid down payment cash reserve.',
              expectedYield: '5.25% APY',
              riskLevel: 'Low',
              recommendedAllocationPct: 25,
              icon: 'ShieldCheck'
            },
            {
              id: 'rec_us_3',
              title: 'Schwab US Dividend Equity ETF (SCHD)',
              description: 'Dividend compounding for tax efficiency.',
              expectedYield: '3.8% Yield + Capital Growth',
              riskLevel: 'Low',
              recommendedAllocationPct: 15,
              icon: 'Zap'
            }
          ]
        }
      },
      accounts: [
        {
          id: 'acc_chase',
          name: 'Chase Sapphire Checking',
          type: 'bank',
          subtype: 'checking',
          bankName: 'JPMorgan Chase',
          accountNumber: '•••• 1204',
          currency: 'USD',
          balance: 18450,
          availableBalance: 18450,
          isActive: true,
          color: '#1E3A8A',
          tags: ['Primary Checking']
        },
        {
          id: 'acc_fidelity',
          name: 'Fidelity Brokerage (S&P 500)',
          type: 'investment',
          subtype: 'thndr',
          bankName: 'Fidelity Investments',
          accountNumber: '•••• 9081',
          currency: 'USD',
          balance: 62000,
          availableBalance: 62000,
          isActive: true,
          color: '#10B981',
          tags: ['Stock Brokerage', 'VOO']
        },
        {
          id: 'acc_marcus',
          name: 'Marcus High-Yield Savings',
          type: 'bank',
          subtype: 'savings',
          bankName: 'Goldman Sachs Marcus',
          accountNumber: '•••• 7712',
          currency: 'USD',
          balance: 24000,
          availableBalance: 24000,
          isActive: true,
          color: '#2563EB',
          tags: ['Liquid Emergency Buffer']
        }
      ],
      transactions: [
        {
          id: 'tx_us_1',
          amount: 8500,
          currency: 'USD',
          merchant: 'Tech Corp Salary Direct Deposit',
          category: 'salary',
          categoryGroup: 'income',
          description: 'Semi-monthly Software Engineering salary',
          date: '2026-08-01',
          type: 'income',
          paymentMethod: 'ACH Deposit',
          accountId: 'acc_chase',
          isPayday: true,
          tags: ['Salary', 'Primary']
        },
        {
          id: 'tx_us_2',
          amount: 650,
          currency: 'USD',
          merchant: 'Tesla Finance Auto Loan',
          category: 'transport',
          categoryGroup: 'living',
          description: 'Model Y Monthly Payment',
          date: '2026-08-04',
          type: 'expense',
          paymentMethod: 'Auto Debit',
          accountId: 'acc_chase',
          isBillDue: true,
          tags: ['Auto Loan', 'Car']
        },
        {
          id: 'tx_us_3',
          amount: 140,
          currency: 'USD',
          merchant: 'AWS Cloud Hosting',
          category: 'cloud',
          categoryGroup: 'subscriptions',
          description: 'Side project server infrastructure',
          date: '2026-08-06',
          type: 'expense',
          paymentMethod: 'Chase Card',
          accountId: 'acc_chase',
          isRecurring: true,
          tags: ['AWS', 'Cloud']
        },
        {
          id: 'tx_us_4',
          amount: 420,
          currency: 'USD',
          merchant: 'Whole Foods Market',
          category: 'groceries',
          categoryGroup: 'living',
          description: 'Weekly organic groceries restock',
          date: '2026-08-07',
          type: 'expense',
          paymentMethod: 'Chase Card',
          accountId: 'acc_chase',
          tags: ['Whole Foods', 'Groceries']
        },
        {
          id: 'tx_us_5',
          amount: 2500,
          currency: 'USD',
          merchant: 'Fidelity VOO S&P 500 Index Deposit',
          category: 'investments',
          categoryGroup: 'savings',
          description: 'Automated monthly stock investment deposit',
          date: '2026-08-08',
          type: 'transfer',
          paymentMethod: 'ACH Transfer',
          accountId: 'acc_fidelity',
          tags: ['Fidelity', 'S&P 500', 'Stocks']
        }
      ],
      budget: {
        id: 'bg_us_1',
        name: 'USD Engineer Monthly Budget',
        currency: 'USD',
        monthlyLimit: 5500,
        categoryLimits: {
          groceries: 800,
          utilities: 300,
          dining: 600,
          transport: 800,
          subscriptions: 250,
          savings: 2500
        },
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        isActive: true
      },
      rules: [
        {
          id: 'rule_us_1',
          name: 'Auto-tag Whole Foods as Groceries',
          merchantMatch: 'whole foods|trader joe|safeway',
          category: 'groceries',
          categoryGroup: 'living',
          priority: 10,
          isActive: true
        }
      ],
      goals: [
        {
          id: 'goal_house_us',
          title: 'California Home Down Payment Reserve',
          targetAmount: 120000,
          currentAmount: 78000,
          currency: 'USD',
          targetDate: '2027-06-01',
          category: 'Real Estate',
          color: '#3B82F6',
          isCompleted: false,
          priority: 'high',
          horizon: 'medium-term',
          autoReallocate: true,
          expectedMonthlyContrib: 2500,
          annualInterestReturn: 5.25,
          inflationAdjusted: true,
          notes: 'Marcus 5.25% liquid down payment accumulation'
        },
        {
          id: 'goal_tesla_loan',
          title: 'Tesla Model Y Auto Loan Payoff',
          targetAmount: 28000,
          currentAmount: 16500,
          currency: 'USD',
          targetDate: '2026-11-01',
          category: 'debt',
          color: '#D98B6F',
          isCompleted: false,
          priority: 'high',
          horizon: 'short-term',
          autoReallocate: true,
          expectedMonthlyContrib: 950,
          annualInterestReturn: 5.5,
          notes: 'Tesla auto financing elimination'
        },
        {
          id: 'goal_stocks_us',
          title: 'S&P 500 & ETF Stock Growth Fund',
          targetAmount: 100000,
          currentAmount: 62000,
          currency: 'USD',
          targetDate: '2027-12-01',
          category: 'investment',
          color: '#10B981',
          isCompleted: false,
          priority: 'high',
          horizon: 'long-term',
          autoReallocate: true,
          expectedMonthlyContrib: 1500,
          annualInterestReturn: 10.5,
          notes: 'Fidelity VOO & SCHD dividend compounding'
        }
      ]
    }
  },

  'student-part-time-intern': {
    id: 'student-part-time-intern',
    name: 'Youssef & Malak (EGP)',
    currency: 'EGP',
    locale: 'EG',
    description: 'University students with Vodafone Cash wallet, NBE Youth debit card, monthly living stipend, tutoring side income, and student tech gear goals.',
    preset: {
      userProfile: {
        id: 'usr_demo_student-part-time-intern',
        email: 'student@budfit.ai',
        fullName: 'Youssef & Malak',
        archetypeId: 'student-part-time-intern',
        incomeType: 'variable_freelance',
        riskTolerance: 'conservative',
        lifeStage: 'student',
        financialLiteracy: 'intermediate',
        primaryGoal: {
          type: 'big_purchase',
          title: 'iPad Air & Apple Pencil for University Notes + Emergency Cushion',
          targetAmount: 32000,
          targetTimeframeMonths: 10,
          customReason: 'Funding university study tablet and emergency student liquidity buffer from tutoring income.'
        },
        aiSpendingPlan: {
          weeklySpendingLimit: 1200,
          monthlySpendingLimit: 5200,
          recommendedSavingsOrDebtMonthly: 2100,
          recommendedSavingsOrDebtWeekly: 485,
          timeframeToReachGoalMonths: 10,
          categoryBreakdown: {
            groceries: { monthly: 1800, weekly: 415, percentage: 25 },
            housing: { monthly: 1450, weekly: 335, percentage: 20 },
            transport: { monthly: 800, weekly: 185, percentage: 11 },
            diningOut: { monthly: 600, weekly: 138, percentage: 8 },
            entertainment: { monthly: 350, weekly: 81, percentage: 5 },
            shopping: { monthly: 200, weekly: 46, percentage: 3 },
            utilities: { monthly: 200, weekly: 46, percentage: 3 },
            goalSavingsOrDebt: { monthly: 2100, weekly: 485, percentage: 28 }
          },
          strategyTitle: 'Student Budget Discipline & Tech Gear Strategy',
          strategySummary: 'Allocates 2,100 EGP/month from tutoring income toward university study gear and emergency buffer.',
          investmentRecommendations: [
            {
              id: 'rec_st_1',
              title: 'Bank Misr High-Yield Youth Savings Fund',
              description: 'Liquid savings certificate for university students.',
              expectedYield: '17.5% APY',
              riskLevel: 'Low',
              recommendedAllocationPct: 75,
              icon: 'ShieldCheck'
            },
            {
              id: 'rec_st_2',
              title: 'Gold Micro-Coins Savings',
              description: 'Fractional gold coin protection against currency shifts.',
              expectedYield: 'Hedge',
              riskLevel: 'Low',
              recommendedAllocationPct: 25,
              icon: 'Zap'
            }
          ]
        }
      },
      accounts: [
        {
          id: 'acc_voda_cash',
          name: 'Vodafone Cash Wallet',
          type: 'wallet',
          subtype: 'vodafone_cash',
          bankName: 'Vodafone Cash',
          accountNumber: '010 •••• 992',
          currency: 'EGP',
          balance: 3800,
          availableBalance: 3800,
          isActive: true,
          color: '#E11D48',
          tags: ['Mobile Wallet', 'Allowance']
        },
        {
          id: 'acc_nbe_student',
          name: 'NBE Youth Debit Card',
          type: 'bank',
          subtype: 'nbe',
          bankName: 'National Bank of Egypt (NBE)',
          accountNumber: '•••• 1120',
          currency: 'EGP',
          balance: 7200,
          availableBalance: 7200,
          isActive: true,
          color: '#15803D',
          tags: ['Youth Card', 'Bank']
        },
        {
          id: 'acc_telda_student',
          name: 'Telda Student Mastercard',
          type: 'wallet',
          subtype: 'telda',
          bankName: 'Telda Financial',
          accountNumber: '•••• 3319',
          currency: 'EGP',
          balance: 2100,
          availableBalance: 2100,
          isActive: true,
          color: '#8B5CF6',
          tags: ['Online Subscriptions']
        }
      ],
      transactions: [
        {
          id: 'tx_st_1',
          amount: 4500,
          currency: 'EGP',
          merchant: 'Family Allowance Transfer',
          category: 'allowance',
          categoryGroup: 'income',
          description: 'Monthly student living stipend',
          date: '2026-08-01',
          type: 'income',
          paymentMethod: 'Vodafone Cash',
          accountId: 'acc_voda_cash',
          isPayday: true,
          tags: ['Allowance', 'Family']
        },
        {
          id: 'tx_st_2',
          amount: 2800,
          currency: 'EGP',
          merchant: 'High School Math Tutoring',
          category: 'freelance',
          categoryGroup: 'income',
          description: 'Private tutoring 4 sessions',
          date: '2026-08-05',
          type: 'income',
          paymentMethod: 'Cash',
          accountId: 'acc_nbe_student',
          tags: ['Tutoring', 'Side Income']
        },
        {
          id: 'tx_st_3',
          amount: 1450,
          currency: 'EGP',
          merchant: 'Shared Dorm Rent & Utilities',
          category: 'utilities',
          categoryGroup: 'utilities',
          description: 'My share of apartment rent in Tagamoa',
          date: '2026-08-02',
          type: 'expense',
          paymentMethod: 'Vodafone Cash',
          accountId: 'acc_voda_cash',
          isBillDue: true,
          tags: ['Rent', 'Dorm']
        },
        {
          id: 'tx_st_4',
          amount: 65,
          currency: 'EGP',
          merchant: 'Spotify Student Subscription',
          category: 'music',
          categoryGroup: 'subscriptions',
          description: 'Student music plan',
          date: '2026-08-06',
          type: 'expense',
          paymentMethod: 'Telda Card',
          accountId: 'acc_telda_student',
          isRecurring: true,
          recurrencePeriod: 'monthly',
          tags: ['Spotify', 'Music']
        }
      ],
      budget: {
        id: 'bg_st_1',
        name: 'Student Tight Budget',
        currency: 'EGP',
        monthlyLimit: 6000,
        categoryLimits: {
          groceries: 1800,
          utilities: 1500,
          dining: 1200,
          transport: 800,
          subscriptions: 300
        },
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        isActive: true
      },
      rules: [
        {
          id: 'rule_st_1',
          name: 'Auto-tag Spotify as Subscriptions',
          merchantMatch: 'spotify|apple music',
          category: 'subscriptions',
          categoryGroup: 'subscriptions',
          priority: 10,
          isActive: true
        }
      ],
      goals: [
        {
          id: 'goal_ipad',
          title: 'iPad Air & Apple Pencil for University',
          targetAmount: 22000,
          currentAmount: 14500,
          currency: 'EGP',
          targetDate: '2026-10-01',
          category: 'Education',
          color: '#10B981',
          isCompleted: false,
          priority: 'high',
          horizon: 'short-term',
          autoReallocate: true,
          expectedMonthlyContrib: 1500,
          notes: 'Targeting study tablet purchase before midterms'
        },
        {
          id: 'goal_student_buffer',
          title: 'Student Emergency Cushion',
          targetAmount: 10000,
          currentAmount: 6500,
          currency: 'EGP',
          targetDate: '2026-11-01',
          category: 'Emergency Reserve',
          color: '#4F8683',
          isCompleted: false,
          priority: 'medium',
          horizon: 'short-term',
          autoReallocate: true,
          expectedMonthlyContrib: 600
        }
      ]
    }
  }
};
