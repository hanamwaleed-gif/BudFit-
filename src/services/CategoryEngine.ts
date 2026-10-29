import { Transaction, Rule } from '../types';
import { CATEGORY_GROUPS } from '../data/categoryData';

export class CategoryEngine {
  private rules: Rule[];

  constructor(rules: Rule[] = []) {
    this.rules = [...rules].sort((a, b) => b.priority - a.priority);
  }

  public updateRules(rules: Rule[]) {
    this.rules = [...rules].sort((a, b) => b.priority - a.priority);
  }

  public categorize(merchant: string, amount: number = 0): {
    category: string;
    categoryGroup: string;
    subCategory: string;
    confidence: 'high' | 'medium' | 'low';
  } {
    const cleanMerchant = merchant.toLowerCase().trim();

    // 1. Check user defined rules
    for (const rule of this.rules) {
      if (!rule.isActive) continue;
      const matches = rule.merchantMatch.split('|').map(m => m.trim().toLowerCase());
      if (matches.some(pattern => pattern && cleanMerchant.includes(pattern))) {
        return {
          category: rule.category,
          categoryGroup: rule.categoryGroup,
          subCategory: this.findSubCategoryLabel(rule.category),
          confidence: 'high'
        };
      }
    }

    // 2. Default Egyptian & Global Keyword Matcher
    if (/carrefour|seoudi|alfa market|metro|kheir zaman|gourmet|hyperone|luLu/i.test(cleanMerchant)) {
      return { category: 'groceries', categoryGroup: 'living', subCategory: 'Groceries & Supermarket', confidence: 'high' };
    }
    if (/talabat|elmenus|cinnabon|starbucks|costa|mcdonald|kfc|pizza|tbsp|bakery|restaurant|cafe|coffee/i.test(cleanMerchant)) {
      return { category: 'dining', categoryGroup: 'living', subCategory: 'Dining Out & Delivery', confidence: 'high' };
    }
    if (/eehc|electricity|fawry|water bill|gas bill|we telecom|vodafone bill|orange bill|etisalat bill/i.test(cleanMerchant)) {
      return { category: 'utilities', categoryGroup: 'utilities', subCategory: 'Essential Utilities', confidence: 'high' };
    }
    if (/uber|careem|swvl|gas station|chillout|totalenergies|taqa|petrol|fuel|bus|metro ticket/i.test(cleanMerchant)) {
      return { category: 'transport', categoryGroup: 'living', subCategory: 'Transport / Uber / Fuel', confidence: 'high' };
    }
    if (/netflix|spotify|anghami|shahid|chatgpt|openai|github|aws|google cloud|apple\.com|youtube/i.test(cleanMerchant)) {
      return { category: 'saas', categoryGroup: 'subscriptions', subCategory: 'Subscriptions & Software', confidence: 'high' };
    }
    if (/pharmacy|el ezaby|seif pharmacy|19011|hospital|doctor|clinic|lab/i.test(cleanMerchant)) {
      return { category: 'healthcare', categoryGroup: 'living', subCategory: 'Healthcare & Pharmacy', confidence: 'high' };
    }
    if (/salary|payroll|deposit|invoice|client|toptal|upwork|freelance|stipend|allowance/i.test(cleanMerchant)) {
      return { category: 'salary', categoryGroup: 'income', subCategory: 'Monthly Salary', confidence: 'high' };
    }

    return {
      category: 'other',
      categoryGroup: 'living',
      subCategory: 'General Expenses',
      confidence: 'low'
    };
  }

  private findSubCategoryLabel(categoryId: string): string {
    for (const groupKey in CATEGORY_GROUPS) {
      const group = CATEGORY_GROUPS[groupKey];
      const found = group.categories.find(c => c.id === categoryId);
      if (found) return found.label;
    }
    return 'General';
  }

  public applyRulesToTransactions(transactions: Transaction[]): Transaction[] {
    return transactions.map(t => {
      const match = this.categorize(t.merchant, t.amount);
      if (match.confidence === 'high' || !t.category) {
        return {
          ...t,
          category: match.category,
          categoryGroup: match.categoryGroup,
          subCategory: match.subCategory,
          confidence: match.confidence
        };
      }
      return t;
    });
  }
}
