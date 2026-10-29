import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Trash2, 
  CheckCircle2, 
  Layers, 
  Sparkles
} from 'lucide-react';
import { Rule } from '../types';

interface AutoCatRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: Rule[];
  onAddRule: (rule: Rule) => void;
  onDeleteRule: (id: string) => void;
  onApplyRulesToAll: () => void;
}

export const AutoCatRulesModal: React.FC<AutoCatRulesModalProps> = ({
  isOpen,
  onClose,
  rules,
  onAddRule,
  onDeleteRule,
  onApplyRulesToAll
}) => {
  const [ruleName, setRuleName] = useState('');
  const [merchantMatch, setMerchantMatch] = useState('');
  const [category, setCategory] = useState('groceries');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName || !merchantMatch) return;

    onAddRule({
      id: `rule_${Date.now()}`,
      name: ruleName,
      merchantMatch,
      category,
      categoryGroup: 'living',
      priority: 10,
      isActive: true
    });

    setRuleName('');
    setMerchantMatch('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1B333F]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[rgba(43,79,96,0.15)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[rgba(43,79,96,0.12)] pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#845460]" />
            <h3 className="text-lg font-serif font-medium text-[#1B333F]">Auto-Categorization Rule Engine</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#5B6E75] hover:text-[#1B333F] rounded-lg bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Rules List */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {rules.map((rule) => (
            <div key={rule.id} className="p-3 bg-[#FAF6F2] rounded-xl border border-[rgba(43,79,96,0.12)] flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#1B333F]">{rule.name}</div>
                <div className="text-[10px] text-[#5B6E75] font-mono">
                  Pattern: <span className="text-[#845460]">{rule.merchantMatch}</span> → <span className="text-[#4F8683] uppercase">{rule.category}</span>
                </div>
              </div>
              <button
                onClick={() => onDeleteRule(rule.id)}
                className="p-1.5 text-[#5B6E75] hover:text-[#D98B6F] rounded-lg hover:bg-[#EAD3CB]/50 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Create Rule Form */}
        <form onSubmit={handleAdd} className="space-y-3 pt-3 border-t border-[rgba(43,79,96,0.12)]">
          <h4 className="font-semibold text-[#1B333F]">Create New Rule</h4>
          <div>
            <label className="text-[#5B6E75] block mb-1 font-semibold">Rule Name</label>
            <input
              type="text"
              placeholder="e.g. Auto-tag Supermarket"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#845460]"
            />
          </div>

          <div>
            <label className="text-[#5B6E75] block mb-1 font-semibold">Merchant Keywords (pipe separated)</label>
            <input
              type="text"
              placeholder="e.g. carrefour|seoudi|metro"
              value={merchantMatch}
              onChange={(e) => setMerchantMatch(e.target.value)}
              className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] font-mono focus:outline-none focus:border-[#845460]"
            />
          </div>

          <div>
            <label className="text-[#5B6E75] block mb-1 font-semibold">Assign Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] capitalize focus:outline-none focus:border-[#845460] cursor-pointer"
            >
              <option value="groceries">Groceries</option>
              <option value="dining">Dining Out</option>
              <option value="utilities">Utilities</option>
              <option value="transport">Transport</option>
              <option value="subscriptions">Subscriptions</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2B4F60] hover:bg-[#1B333F] text-white font-semibold py-2.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            Add Categorization Rule
          </button>
        </form>

        <button
          onClick={onApplyRulesToAll}
          className="w-full bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#845460] font-semibold py-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] transition flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#845460]" />
          <span>Apply Rules to Existing Ledger</span>
        </button>
      </div>
    </div>
  );
};
