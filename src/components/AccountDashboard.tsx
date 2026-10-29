import React, { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  PlusCircle, 
  RefreshCw, 
  ArrowUpRight, 
  ShieldCheck, 
  Landmark, 
  Smartphone,
  ExternalLink,
  Layers
} from 'lucide-react';
import { Account, Transaction } from '../types';
import { OpenBankingView } from './OpenBankingView';

interface AccountDashboardProps {
  accounts: Account[];
  primaryCurrency: string;
  onOpenOpenBanking?: () => void;
  onAddAccount: () => void;
  onSyncNewTransactions?: (newTx: Transaction[]) => void;
}

export const AccountDashboard: React.FC<AccountDashboardProps> = ({
  accounts,
  primaryCurrency,
  onOpenOpenBanking,
  onAddAccount,
  onSyncNewTransactions
}) => {
  const [subTab, setSubTab] = useState<'accounts' | 'banking'>('accounts');
  const totalBalanceSum = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-serif font-medium text-[#1B333F] flex items-center space-x-2">
              <CreditCard className="w-6 h-6 text-[#845460]" />
              <span>Accounts, Wallets & Banking Feeds</span>
            </h2>
          </div>
          <p className="text-xs text-[#5B6E75] font-sans mt-1">
            Total Combined Balance: <strong className="text-[#2B4F60] font-mono text-sm">{totalBalanceSum.toLocaleString()} {primaryCurrency}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Sub Tab Switcher */}
          <div className="flex bg-[#FAF6F2] p-1 rounded-2xl border border-[rgba(43,79,96,0.12)]">
            <button
              onClick={() => setSubTab('accounts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                subTab === 'accounts'
                  ? 'bg-[#2B4F60] text-white shadow-xs'
                  : 'text-[#5B6E75] hover:text-[#1B333F]'
              }`}
            >
              My Accounts
            </button>
            <button
              onClick={() => setSubTab('banking')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
                subTab === 'banking'
                  ? 'bg-[#2B4F60] text-white shadow-xs'
                  : 'text-[#5B6E75] hover:text-[#1B333F]'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#D98B6F]" />
              <span>Banking Feeds</span>
            </button>
          </div>

          <button
            onClick={onAddAccount}
            className="flex items-center space-x-1.5 bg-[#2B4F60] hover:bg-[#1B333F] text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-[#D98B6F]" />
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {subTab === 'banking' ? (
        <OpenBankingView
          onSyncNewTransactions={onSyncNewTransactions || (() => {})}
          primaryCurrency={primaryCurrency}
        />
      ) : (
        /* Account Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((acc) => {
            const isWallet = acc.type === 'wallet';

            return (
              <div
                key={acc.id}
                className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] relative overflow-hidden group hover:border-[#845460] transition space-y-4"
                style={{
                  borderTop: `4px solid ${acc.color || '#2B4F60'}`
                }}
              >
                {/* Card Top */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF6F2] flex items-center justify-center border border-[rgba(43,79,96,0.12)] text-[#1B333F]">
                      {isWallet ? <Smartphone className="w-5 h-5 text-[#845460]" /> : <Landmark className="w-5 h-5 text-[#2B4F60]" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#1B333F]">{acc.name}</h3>
                      <p className="text-[11px] text-[#5B6E75]">{acc.bankName}</p>
                    </div>
                  </div>

                  <span className="bg-[#FAF6F2] text-[#2B4F60] border border-[rgba(43,79,96,0.12)] px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold">
                    {acc.subtype}
                  </span>
                </div>

                {/* Balance */}
                <div className="bg-[#FAF6F2] p-4 rounded-xl border border-[rgba(43,79,96,0.12)]">
                  <span className="text-[10px] text-[#5B6E75] uppercase tracking-wider block font-bold">Available Balance</span>
                  <div className="text-2xl font-bold text-[#1B333F] font-mono mt-1 tracking-tight">
                    {acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xs font-normal text-[#5B6E75]">{acc.currency || primaryCurrency}</span>
                  </div>
                </div>

                {/* Account Number & Status */}
                <div className="flex items-center justify-between text-xs text-[#5B6E75] font-mono pt-2">
                  <span>{acc.accountNumber}</span>
                  <button 
                    onClick={() => setSubTab('banking')}
                    className="flex items-center text-[#4F8683] hover:underline text-[10px] font-sans font-semibold cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    <span>Sync Feed</span>
                  </button>
                </div>

                {/* Tags */}
                {acc.tags && acc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {acc.tags.map(t => (
                      <span key={t} className="bg-[#FAF6F2] text-[#5B6E75] text-[10px] px-2 py-0.5 rounded border border-[rgba(43,79,96,0.12)] font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
