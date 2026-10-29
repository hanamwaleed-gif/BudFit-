import React, { useState, useMemo } from 'react';
import { 
  List, 
  Search, 
  Filter, 
  Download, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Tag, 
  ArrowUpDown, 
  CheckCircle2, 
  X,
  CreditCard
} from 'lucide-react';
import { Transaction } from '../types';

interface SpendingLedgerProps {
  transactions: Transaction[];
  primaryCurrency: string;
  onOpenAddTransaction: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const SpendingLedger: React.FC<SpendingLedgerProps> = ({
  transactions,
  primaryCurrency,
  onOpenAddTransaction,
  onEditTransaction,
  onDeleteTransaction
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  // Filter & Search Logic
  const filteredTx = useMemo(() => {
    return transactions.filter((t) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesMerchant = t.merchant.toLowerCase().includes(query);
        const matchesDesc = (t.description || '').toLowerCase().includes(query);
        const matchesCat = (t.category || '').toLowerCase().includes(query);
        if (!matchesMerchant && !matchesDesc && !matchesCat) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && t.category !== selectedCategory) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && t.type !== selectedType) {
        return false;
      }

      // Payment method filter
      if (selectedPaymentMethod !== 'all' && t.paymentMethod !== selectedPaymentMethod) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') return (b.date || '').localeCompare(a.date || '');
      if (sortBy === 'date_asc') return (a.date || '').localeCompare(b.date || '');
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      if (sortBy === 'amount_asc') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, searchQuery, selectedCategory, selectedType, selectedPaymentMethod, sortBy]);

  // Unique categories list
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach(t => { if (t.category) set.add(t.category); });
    return Array.from(set);
  }, [transactions]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Merchant', 'Amount', 'Currency', 'Category', 'Type', 'Payment Method', 'Description'];
    const rows = filteredTx.map(t => [
      t.id,
      t.date,
      `"${t.merchant.replace(/"/g, '""')}"`,
      t.amount,
      t.currency || primaryCurrency,
      t.category,
      t.type,
      t.paymentMethod || '',
      `"${(t.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `budfit_ledger_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-medium text-[#1B333F] flex items-center space-x-2">
            <List className="w-6 h-6 text-[#845460]" />
            <span>Spending Ledger</span>
          </h2>
          <p className="text-xs text-[#5B6E75] font-sans mt-0.5">
            Showing <strong className="text-[#1B333F] font-mono">{filteredTx.length}</strong> of {transactions.length} entries
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#2B4F60] px-3.5 py-2 rounded-xl text-xs font-semibold border border-[rgba(43,79,96,0.15)] transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#4F8683]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddTransaction}
            className="flex items-center space-x-1.5 bg-[#2B4F60] hover:bg-[#1B333F] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#D98B6F]" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-4 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-[#8FA0A2] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search merchant, description, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF6F2] text-[#22323A] pl-9 pr-3 py-2 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#845460]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#FAF6F2] text-[#22323A] px-3 py-2 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#845460] capitalize cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat} className="capitalize">{cat}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#FAF6F2] text-[#22323A] px-3 py-2 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#845460] cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
            <option value="transfer">Transfers Only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-[#FAF6F2] text-[#22323A] px-3 py-2 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#845460] cursor-pointer"
          >
            <option value="date_desc">Sort: Newest First</option>
            <option value="date_asc">Sort: Oldest First</option>
            <option value="amount_desc">Sort: Highest Amount</option>
            <option value="amount_asc">Sort: Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F2] text-[#5B6E75] uppercase text-[10.5px] font-bold border-b border-[rgba(43,79,96,0.13)]">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Merchant / Source</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(43,79,96,0.1)] text-[#22323A]">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#5B6E75]">
                    No transactions match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#FAF6F2]/70 transition">
                    <td className="p-3.5 font-mono text-[#5B6E75] whitespace-nowrap">{tx.date}</td>
                    <td className="p-3.5 font-semibold text-[#1B333F]">
                      <div>{tx.merchant}</div>
                      {tx.description && <div className="text-[11px] text-[#5B6E75] font-normal">{tx.description}</div>}
                    </td>
                    <td className="p-3.5">
                      <span className="bg-[#EAD3CB]/60 text-[#6A414B] px-2.5 py-1 rounded-full capitalize text-[11px] font-semibold">
                        {tx.category || 'General'}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#5B6E75]">
                      <span className="flex items-center space-x-1">
                        <CreditCard className="w-3.5 h-3.5 text-[#8FA0A2]" />
                        <span>{tx.paymentMethod || 'Card'}</span>
                      </span>
                    </td>
                    <td className={`p-3.5 text-right font-mono font-bold text-sm whitespace-nowrap ${tx.type === 'income' ? 'text-[#4F8683]' : 'text-[#D98B6F]'}`}>
                      {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {primaryCurrency}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="p-1.5 text-[#5B6E75] hover:text-[#2B4F60] rounded-lg hover:bg-[#FAF6F2] transition cursor-pointer"
                          title="Edit Entry"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(tx.id)}
                          className="p-1.5 text-[#5B6E75] hover:text-[#D98B6F] rounded-lg hover:bg-[#FAF6F2] transition cursor-pointer"
                          title="Delete Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
