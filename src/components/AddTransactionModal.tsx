import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlusCircle, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  Tag, 
  CreditCard,
  Calendar
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { CATEGORY_GROUPS } from '../data/categoryData';
import { CategoryEngine } from '../services/CategoryEngine';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTransaction: (tx: Transaction) => void;
  primaryCurrency: string;
  initialTransaction?: Transaction | null;
  defaultDate?: string | null;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSaveTransaction,
  primaryCurrency,
  initialTransaction,
  defaultDate
}) => {
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [categoryGroup, setCategoryGroup] = useState('living');
  const [category, setCategory] = useState('groceries');
  const [paymentMethod, setPaymentMethod] = useState('Telda Card');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [isBillDue, setIsBillDue] = useState(false);
  const [isPayday, setIsPayday] = useState(false);

  const categoryEngine = new CategoryEngine();

  useEffect(() => {
    if (initialTransaction) {
      setMerchant(initialTransaction.merchant);
      setAmount(String(initialTransaction.amount));
      setType(initialTransaction.type);
      setCategoryGroup(initialTransaction.categoryGroup || 'living');
      setCategory(initialTransaction.category || 'groceries');
      setPaymentMethod(initialTransaction.paymentMethod || 'Card');
      setDate(initialTransaction.date || new Date().toISOString().split('T')[0]);
      setDescription(initialTransaction.description || '');
      setIsRecurring(!!initialTransaction.isRecurring);
      setIsBillDue(!!initialTransaction.isBillDue);
      setIsPayday(!!initialTransaction.isPayday);
    } else {
      setMerchant('');
      setAmount('');
      setType('expense');
      setDate(defaultDate || new Date().toISOString().split('T')[0]);
      setDescription('');
      setIsRecurring(false);
      setIsBillDue(false);
      setIsPayday(false);
    }
  }, [initialTransaction, defaultDate, isOpen]);

  // Auto-categorize when merchant name changes
  const handleMerchantChange = (val: string) => {
    setMerchant(val);
    if (!initialTransaction && val.length >= 3) {
      const match = categoryEngine.categorize(val);
      if (match.confidence === 'high') {
        setCategoryGroup(match.categoryGroup);
        setCategory(match.category);
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant || !amount) return;

    const tx: Transaction = {
      id: initialTransaction ? initialTransaction.id : `tx_${Date.now()}`,
      merchant,
      amount: parseFloat(amount) || 0,
      currency: primaryCurrency,
      type,
      categoryGroup,
      category,
      paymentMethod,
      date,
      description,
      isRecurring,
      isBillDue,
      isPayday,
      tags: [category, paymentMethod]
    };

    onSaveTransaction(tx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1B333F]/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[rgba(43,79,96,0.15)] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Sticky Header with Prominent Exit 'X' Button */}
        <div className="sticky top-0 bg-white z-20 p-4 border-b border-[rgba(43,79,96,0.12)] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-serif font-medium text-[#1B333F]">
              {initialTransaction ? 'Edit Transaction Entry' : 'Log New Transaction'}
            </h3>
            <p className="text-[11px] text-[#5B6E75] font-sans">Record cash flow or account movement</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5B6E75] hover:text-[#1B333F] bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 rounded-xl border border-[rgba(43,79,96,0.12)] transition shrink-0 flex items-center justify-center cursor-pointer"
            title="Close (Exit)"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#2B4F60]" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs overflow-y-auto flex-1">
          {/* Entry Type Selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 font-semibold rounded-xl border transition cursor-pointer ${
                type === 'expense' ? 'bg-[#EAD3CB] border-[#D98B6F] text-[#6A414B]' : 'bg-[#FAF6F2] border-[rgba(43,79,96,0.12)] text-[#5B6E75]'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 font-semibold rounded-xl border transition cursor-pointer ${
                type === 'income' ? 'bg-[#BDC7C9]/60 border-[#4F8683] text-[#2B4F60]' : 'bg-[#FAF6F2] border-[rgba(43,79,96,0.12)] text-[#5B6E75]'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setType('transfer')}
              className={`py-2 font-semibold rounded-xl border transition cursor-pointer ${
                type === 'transfer' ? 'bg-[#2B4F60]/10 border-[#2B4F60] text-[#1B333F]' : 'bg-[#FAF6F2] border-[rgba(43,79,96,0.12)] text-[#5B6E75]'
              }`}
            >
              Transfer
            </button>
          </div>

          {/* Merchant */}
          <div>
            <label className="text-[#5B6E75] font-semibold block mb-1">Merchant / Source Name</label>
            <input
              type="text"
              placeholder="e.g. Carrefour, Talabat, InstaPay, Salary..."
              value={merchant}
              onChange={(e) => handleMerchantChange(e.target.value)}
              required
              className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#845460]"
            />
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[#5B6E75] font-semibold block mb-1">Amount ({primaryCurrency})</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] font-mono font-bold text-sm focus:outline-none focus:border-[#845460]"
              />
            </div>

            <div>
              <label className="text-[#5B6E75] font-semibold block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] font-mono focus:outline-none focus:border-[#845460]"
              />
            </div>
          </div>

          {/* Category Group & Subcategory */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[#5B6E75] font-semibold block mb-1">Category Group</label>
              <select
                value={categoryGroup}
                onChange={(e) => setCategoryGroup(e.target.value)}
                className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#845460] cursor-pointer"
              >
                {Object.keys(CATEGORY_GROUPS).map((groupKey) => (
                  <option key={groupKey} value={groupKey}>
                    {CATEGORY_GROUPS[groupKey].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[#5B6E75] font-semibold block mb-1">Subcategory</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] capitalize focus:outline-none focus:border-[#845460] cursor-pointer"
              >
                {CATEGORY_GROUPS[categoryGroup]?.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-[#5B6E75] font-semibold block mb-1">Payment Method / Account</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#845460] cursor-pointer"
            >
              <option value="InstaPay">InstaPay Instant Transfer</option>
              <option value="Telda Card">Telda Digital Mastercard</option>
              <option value="CIB Card">CIB Everyday Debit</option>
              <option value="Vodafone Cash">Vodafone Cash Wallet</option>
              <option value="NBE Debit">NBE Debit Card</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center space-x-2 text-[#22323A] cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded border-[rgba(43,79,96,0.2)] text-[#2B4F60] focus:ring-0"
              />
              <span>Recurring Subscription</span>
            </label>

            <label className="flex items-center space-x-2 text-[#22323A] cursor-pointer">
              <input
                type="checkbox"
                checked={isBillDue}
                onChange={(e) => setIsBillDue(e.target.checked)}
                className="rounded border-[rgba(43,79,96,0.2)] text-[#D98B6F] focus:ring-0"
              />
              <span>Bill Due Entry</span>
            </label>

            <label className="flex items-center space-x-2 text-[#22323A] cursor-pointer">
              <input
                type="checkbox"
                checked={isPayday}
                onChange={(e) => setIsPayday(e.target.checked)}
                className="rounded border-[rgba(43,79,96,0.2)] text-[#4F8683] focus:ring-0"
              />
              <span>Payday / Income</span>
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="text-[#5B6E75] font-semibold block mb-1">Notes / Description</label>
            <input
              type="text"
              placeholder="e.g. Smart meter recharge, team dinner..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#FAF6F2] text-[#1B333F] p-2 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#845460]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2B4F60] hover:bg-[#1B333F] text-white font-semibold py-3 rounded-xl text-xs shadow-xs transition cursor-pointer mt-3"
          >
            {initialTransaction ? 'Update Entry' : 'Save Entry to Ledger'}
          </button>
        </form>
      </div>
    </div>
  );
};
