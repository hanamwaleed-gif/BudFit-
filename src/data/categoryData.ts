import { CategoryGroupDef } from '../types';

export const CATEGORY_GROUPS: Record<string, CategoryGroupDef> = {
  utilities: {
    label: 'Essential Utilities',
    icon: 'Zap',
    color: '#EF4444', // Red-500
    categories: [
      { id: 'electricity', label: 'Electricity', icon: 'Zap' },
      { id: 'water', label: 'Water', icon: 'Droplet' },
      { id: 'gas', label: 'Gas', icon: 'Flame' },
      { id: 'internet', label: 'Internet / Fiber', icon: 'Wifi' },
      { id: 'phone', label: 'Mobile / Phone Bill', icon: 'Phone' },
      { id: 'property_tax', label: 'Property Tax', icon: 'Landmark' },
      { id: 'municipal', label: 'Municipal / Fawry Fees', icon: 'Building' }
    ]
  },
  living: {
    label: 'Daily Living',
    icon: 'ShoppingBag',
    color: '#06B6D4', // Cyan-500
    categories: [
      { id: 'groceries', label: 'Groceries & Supermarket', icon: 'ShoppingCart' },
      { id: 'household_supplies', label: 'Household Supplies', icon: 'Package' },
      { id: 'transport', label: 'Transport / Uber / Fuel', icon: 'Bus' },
      { id: 'dining', label: 'Dining Out & Delivery', icon: 'Utensils' },
      { id: 'entertainment', label: 'Entertainment & Gaming', icon: 'Film' },
      { id: 'clothing', label: 'Clothing & Fashion', icon: 'Shirt' },
      { id: 'healthcare', label: 'Healthcare & Pharmacy', icon: 'Heart' },
      { id: 'education', label: 'Education & Courses', icon: 'BookOpen' }
    ]
  },
  subscriptions: {
    label: 'Subscriptions & Software',
    icon: 'RefreshCw',
    color: '#8B5CF6', // Purple-500
    categories: [
      { id: 'streaming', label: 'Video Streaming (Netflix/Shahid)', icon: 'Tv' },
      { id: 'music', label: 'Music (Spotify/Anghami)', icon: 'Music' },
      { id: 'saas', label: 'SaaS & AI Tools (ChatGPT/GitHub)', icon: 'Cpu' },
      { id: 'gym', label: 'Gym & Fitness Membership', icon: 'Activity' },
      { id: 'cloud', label: 'Cloud Storage & Hosting', icon: 'Cloud' }
    ]
  },
  savings: {
    label: 'Savings & Investments',
    icon: 'PiggyBank',
    color: '#10B981', // Emerald-500
    categories: [
      { id: 'savings_acc', label: 'High Yield Savings', icon: 'Banknote' },
      { id: 'investment', label: 'Stocks, ETFs & Gold', icon: 'TrendingUp' },
      { id: 'retirement', label: 'Retirement & Certificates', icon: 'Clock' },
      { id: 'emergency', label: 'Emergency Fund', icon: 'Shield' }
    ]
  },
  income: {
    label: 'Income & Revenue',
    icon: 'ArrowDownLeft',
    color: '#22C55E', // Green-500
    categories: [
      { id: 'salary', label: 'Monthly Salary', icon: 'Briefcase' },
      { id: 'freelance', label: 'Freelance & Client Invoices', icon: 'Laptop' },
      { id: 'investment_yield', label: 'Dividends & Interest Yield', icon: 'Coins' },
      { id: 'allowance', label: 'Family Allowance / Transfer', icon: 'Gift' }
    ]
  }
};

export const DEFAULT_CATEGORY_COLORS: Record<string, string> = {
  groceries: '#10B981',
  utilities: '#EF4444',
  transport: '#F59E0B',
  dining: '#EC4899',
  entertainment: '#8B5CF6',
  subscriptions: '#6366F1',
  shopping: '#06B6D4',
  healthcare: '#F43F5E',
  education: '#3B82F6',
  savings: '#059669',
  income: '#16A34A',
  other: '#6B7280'
};
