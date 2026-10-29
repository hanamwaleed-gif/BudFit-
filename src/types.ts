export type TransactionType = 'income' | 'expense' | 'transfer';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface LocationInfo {
  lat: number;
  lng: number;
  placeName: string;
}

export interface Transaction {
  id: string;
  userId?: string;
  amount: number;
  currency: string;
  merchant: string;
  category: string;
  subCategory?: string;
  categoryGroup: 'utilities' | 'living' | 'savings' | 'income' | 'subscriptions' | string;
  description?: string;
  date: string; // ISO string YYYY-MM-DD or full timestamp
  type: TransactionType;
  paymentMethod?: string;
  accountId?: string;
  isRecurring?: boolean;
  recurrencePeriod?: 'weekly' | 'monthly' | 'yearly';
  previousAmount?: number; // for detecting price increases
  tags: string[];
  location?: LocationInfo;
  receiptUrl?: string;
  isBillDue?: boolean;
  isPayday?: boolean;
  confidence?: ConfidenceLevel;
}

export interface Account {
  id: string;
  userId?: string;
  name: string;
  type: 'bank' | 'wallet' | 'investment' | 'credit' | 'cash';
  subtype: 'checking' | 'savings' | 'instapay' | 'telda' | 'cib' | 'nbe' | 'vodafone_cash' | 'cash' | 'thndr';
  bankName: string;
  accountNumber: string;
  currency: string;
  balance: number;
  availableBalance: number;
  creditLimit?: number;
  interestRate?: number;
  lastSynced?: string;
  isActive: boolean;
  tags?: string[];
  color?: string;
}

export interface CategoryItem {
  id: string;
  label: string;
  icon: string;
}

export interface CategoryGroupDef {
  label: string;
  icon: string;
  color: string;
  categories: CategoryItem[];
}

export interface Budget {
  id: string;
  userId?: string;
  name: string;
  currency: string;
  monthlyLimit: number;
  categoryLimits: Record<string, number>;
  startDate: string;
  endDate: string;
  isActive: boolean;
  notifications?: {
    lowBalance?: boolean;
    overspending?: boolean;
  };
}

export interface Rule {
  id: string;
  userId?: string;
  name: string;
  merchantMatch: string; // Comma-separated or regex pipe 'carrefour|seoudi'
  category: string;
  categoryGroup: string;
  priority: number;
  amountRange?: {
    min: number;
    max: number;
  };
  isActive: boolean;
}

export interface CalendarDay {
  date: Date;
  dateString: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  balance: number;
  transactions: Transaction[];
  incomeTotal: number;
  expenseTotal: number;
  hasBillDue: boolean;
  isPayday: boolean;
  isWeekend: boolean;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
  action?: string;
  actionType?: 'set_budget' | 'cancel_subscription' | 'review_category';
  category?: string;
  isRead: boolean;
  isActioned: boolean;
  createdAt: string;
}

export type GoalPriority = 'high' | 'medium' | 'low';
export type GoalHorizon = 'short-term' | 'medium-term' | 'long-term' | 'recurring-obligation';
export type AllocationStrategy = 'equal' | 'tapered' | 'goal-weighted';

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate: string;
  category: string;
  color: string;
  isCompleted: boolean;
  priority?: GoalPriority;
  horizon?: GoalHorizon;
  autoReallocate?: boolean;
  expectedMonthlyContrib?: number;
  annualInterestReturn?: number;
  inflationAdjusted?: boolean;
  notes?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  archetypeId: string;
  avatarUrl?: string;
  createdAt: string;
  riskTolerance?: 'conservative' | 'balanced' | 'aggressive';
  lifeStage?: 'student' | 'young_pro' | 'family' | 'pre_retirement';
  financialLiteracy?: 'basic' | 'intermediate' | 'advanced';
  incomeType?: 'fixed' | 'variable_freelance' | 'bonus_heavy';
  emergencyBufferMonths?: number;
  primaryGoal?: UserGoalSelection;
  aiSpendingPlan?: AIPersonalizedSpendingPlan;
}

export type PrimaryGoalType = 'net_worth' | 'big_purchase' | 'loan_payoff' | 'stock_investments' | 'other';

export interface UserGoalSelection {
  type: PrimaryGoalType;
  title: string;
  targetAmount: number;
  targetTimeframeMonths: number;
  targetDate?: string;
  purchaseCategory?: 'house' | 'car' | 'wedding' | 'education' | 'business' | 'gadgets' | 'other';
  loanType?: 'credit_card' | 'personal_loan' | 'car_loan' | 'student_loan' | 'mortgage' | 'multiple';
  loanInterestRate?: number;
  customReason?: string;
}

export interface CategoryPlanDetail {
  weekly: number;
  monthly: number;
  percentage: number;
}

export interface AIPersonalizedSpendingPlan {
  weeklySpendingLimit: number;
  monthlySpendingLimit: number;
  recommendedSavingsOrDebtMonthly: number;
  recommendedSavingsOrDebtWeekly: number;
  timeframeToReachGoalMonths: number;
  categoryBreakdown: {
    groceries: CategoryPlanDetail;
    housing: CategoryPlanDetail;
    transport: CategoryPlanDetail;
    diningOut: CategoryPlanDetail;
    entertainment: CategoryPlanDetail;
    shopping: CategoryPlanDetail;
    utilities: CategoryPlanDetail;
    goalSavingsOrDebt: CategoryPlanDetail;
  };
  strategyTitle: string;
  strategySummary: string;
  investmentRecommendations: Array<{
    id: string;
    title: string;
    description: string;
    expectedYield: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    recommendedAllocationPct: number;
    icon: string;
  }>;
}

export interface GoalSquad {
  id: string;
  name: string;
  description: string;
  iconName: string;
  goalType: string;
  membersCount: number;
  activeSprintText: string;
  tags: string[];
}

export interface GoalChatMessage {
  id: string;
  squadId: string;
  senderName: string;
  senderAvatar?: string;
  senderGoalTitle: string;
  senderProgressPct: number;
  message: string;
  timestamp: string;
  isCurrentUser?: boolean;
}

export interface CommunityPost {
  id: string;
  squadId?: string;
  userName: string;
  userAvatar?: string;
  timeAgo: string;
  goalTitle: string;
  goalProgressPct: number;
  category: 'milestone' | 'tip' | 'challenge' | 'question';
  content: string;
  clapsCount: number;
  boostsCount: number;
  hasClapped?: boolean;
  hasBoosted?: boolean;
  commentsCount: number;
  badgeUnlocked?: string;
}

export interface AccountabilityChallenge {
  id: string;
  title: string;
  description: string;
  participantsCount: number;
  daysRemaining: number;
  targetCategory: string;
  targetGoalText: string;
  userProgressPct: number;
  isJoined?: boolean;
}

export interface SubscriptionItem {
  id: string;
  name: string;
  merchant: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  category: string;
  status: 'active' | 'trial' | 'flagged_price_increase';
  previousAmount?: number;
}

export interface Archetype {
  id: string;
  name: string;
  currency: string;
  locale: 'EG' | 'US' | 'EU';
  description: string;
  preset: {
    accounts: Account[];
    transactions: Transaction[];
    budget: Budget;
    rules: Rule[];
    goals: FinancialGoal[];
    userProfile?: Partial<UserProfile>;
  };
}

export interface ReceiptScanResult {
  merchant: string;
  total: number;
  currency: string;
  items: Array<{ name: string; price: number }>;
  date: string;
  category: string;
  subCategory: string;
  categoryGroup: string;
  paymentMethod?: string;
}

export interface FXRates {
  [currency: string]: number;
}

