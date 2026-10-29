import React, { useState } from 'react';
import { 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Landmark, 
  Smartphone, 
  Zap, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Transaction } from '../types';

interface OpenBankingViewProps {
  onSyncNewTransactions: (newTx: Transaction[]) => void;
  primaryCurrency: string;
}

export const OpenBankingView: React.FC<OpenBankingViewProps> = ({
  onSyncNewTransactions,
  primaryCurrency
}) => {
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const providers = [
    {
      id: 'instapay',
      name: 'InstaPay Instant Network (IPN)',
      type: 'National Payment Network',
      bankName: 'Central Bank of Egypt',
      status: 'Connected',
      lastSynced: 'Just now',
      color: '#10B981',
      icon: Zap
    },
    {
      id: 'telda',
      name: 'Telda Digital Mastercard',
      type: 'Neobank & Digital Wallet',
      bankName: 'Telda Financial',
      status: 'Connected',
      lastSynced: '5 mins ago',
      color: '#8B5CF6',
      icon: Smartphone
    },
    {
      id: 'cib',
      name: 'CIB Egypt Open Banking',
      type: 'Commercial Bank',
      bankName: 'Commercial International Bank',
      status: 'Connected',
      lastSynced: '1 hour ago',
      color: '#003366',
      icon: Landmark
    },
    {
      id: 'nbe',
      name: 'NBE Al Ahly Net Feed',
      type: 'National Bank',
      bankName: 'National Bank of Egypt',
      status: 'Connected',
      lastSynced: '2 hours ago',
      color: '#15803D',
      icon: Landmark
    },
    {
      id: 'vodafone_cash',
      name: 'Vodafone Cash Wallet Feed',
      type: 'Mobile Wallet',
      bankName: 'Vodafone Egypt',
      status: 'Connected',
      lastSynced: 'Today',
      color: '#E11D48',
      icon: Smartphone
    }
  ];

  const handleSyncProvider = async (providerId: string) => {
    setSyncingProvider(providerId);
    setSyncStatus(null);
    try {
      const res = await fetch('/api/open-banking/fetch-feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: providerId })
      });
      const data = await res.json();
      if (data.transactions && data.transactions.length > 0) {
        onSyncNewTransactions(data.transactions);
        setSyncStatus(`Successfully synced ${data.transactions.length} new entries from ${providerId.toUpperCase()}`);
      }
    } catch (err: any) {
      setSyncStatus('Failed to sync bank feed');
    } finally {
      setSyncingProvider(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1B333F] flex items-center space-x-2">
            <RefreshCw className="w-6 h-6 text-[#845460]" />
            <span>Open Banking & Egyptian Fintech Feeds</span>
          </h2>
          <p className="text-xs text-[#5B6E75] font-sans">
            Real-time automated transaction sync with InstaPay, Telda, CIB, NBE & Vodafone Cash
          </p>
        </div>
      </div>

      {syncStatus && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((prov) => {
          const Icon = prov.icon;
          const isSyncing = syncingProvider === prov.id;

          return (
            <div
              key={prov.id}
              className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-4 relative overflow-hidden group hover:border-[#2B4F60] transition"
              style={{ borderTop: `4px solid ${prov.color}` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF6F2] flex items-center justify-center border border-[rgba(43,79,96,0.12)] text-[#1B333F]">
                    <Icon className="w-5 h-5 text-[#2B4F60]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1B333F]">{prov.name}</h3>
                    <p className="text-[11px] text-[#5B6E75]">{prov.bankName}</p>
                  </div>
                </div>

                <span className="bg-[#FAF6F2] text-[#4F8683] border border-[rgba(43,79,96,0.12)] px-2 py-0.5 rounded text-[10px] font-bold">
                  {prov.status}
                </span>
              </div>

              <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[rgba(43,79,96,0.12)] text-xs flex justify-between text-[#5B6E75] font-mono">
                <span>Last Refreshed:</span>
                <span className="font-semibold text-[#1B333F]">{prov.lastSynced}</span>
              </div>

              <button
                onClick={() => handleSyncProvider(prov.id)}
                disabled={isSyncing}
                className="w-full bg-[#2B4F60] hover:bg-[#1B333F] text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-2 border border-transparent shadow-xs cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#EAD3CB] ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing Feed...' : 'Sync Live Feed Now'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
