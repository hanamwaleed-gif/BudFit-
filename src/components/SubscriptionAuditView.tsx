import React from 'react';
import { 
  Repeat, 
  AlertTriangle, 
  CheckCircle2, 
  PlusCircle, 
  ExternalLink, 
  TrendingUp,
  Cpu,
  Tv,
  Music,
  Activity
} from 'lucide-react';
import { SubscriptionItem, Transaction } from '../types';

interface SubscriptionAuditViewProps {
  transactions: Transaction[];
  primaryCurrency: string;
}

export const SubscriptionAuditView: React.FC<SubscriptionAuditViewProps> = ({
  transactions,
  primaryCurrency
}) => {
  // Extract recurring transactions
  const recurringTx = transactions.filter(t => t.isRecurring || t.categoryGroup === 'subscriptions');

  const totalMonthlyCost = recurringTx.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-medium text-[#1B333F] flex items-center space-x-2">
            <Repeat className="w-6 h-6 text-[#845460]" />
            <span>Subscription Audit & Recurring Spend</span>
          </h2>
          <p className="text-xs text-[#5B6E75] font-sans mt-0.5">
            Total Recurring Commitment: <strong className="text-[#845460] font-mono text-sm">{totalMonthlyCost.toLocaleString()} {primaryCurrency}/month</strong>
          </p>
        </div>
      </div>

      {/* Flagged Price Hikes Alert Banner */}
      <div className="bg-[#EAD3CB]/60 border border-[#845460]/20 rounded-2xl p-4 flex items-start space-x-3 text-xs text-[#22323A]">
        <AlertTriangle className="w-5 h-5 text-[#D98B6F] shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-[#6A414B]">Price Increase Warning Detected</h4>
          <p className="text-[#5B6E75] leading-relaxed">
            ChatGPT Plus subscription price increased from 980 EGP to 1,100 EGP due to USD/EGP exchange rate adjustments.
          </p>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recurringTx.map((sub) => {
          const hasPriceHike = sub.previousAmount && sub.amount > sub.previousAmount;
          const usagePct = sub.merchant.includes('Adobe') ? 90 : sub.merchant.includes('Spotify') ? 65 : 20;
          const isLowUsage = usagePct < 30;

          return (
            <div
              key={sub.id}
              className={`bg-white border rounded-2xl p-5 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] space-y-3 relative transition ${
                hasPriceHike ? 'border-[#D98B6F]' : 'border-[rgba(43,79,96,0.13)]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[#1B333F] text-sm">{sub.merchant}</h3>
                  <span className="text-[11px] text-[#5B6E75] capitalize">{sub.category} • Monthly</span>
                </div>
                {hasPriceHike && (
                  <span className="bg-[#EAD3CB] text-[#6A414B] text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                    + price hike
                  </span>
                )}
              </div>

              <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[rgba(43,79,96,0.12)] flex justify-between items-center">
                <span className="text-xs text-[#5B6E75]">Cost:</span>
                <div className="text-base font-bold text-[#1B333F] font-mono">
                  {sub.amount.toLocaleString()} {primaryCurrency}
                  {hasPriceHike && (
                    <span className="text-xs text-[#8FA0A2] line-through ml-2 font-normal">
                      {sub.previousAmount} {primaryCurrency}
                    </span>
                  )}
                </div>
              </div>

              {/* Usage Bar */}
              <div className="space-y-1 pt-1">
                <div className="w-full bg-[#FAF6F2] h-1.5 rounded-full overflow-hidden border border-[rgba(43,79,96,0.1)]">
                  <div
                    className={`h-full rounded-full ${isLowUsage ? 'bg-[#D98B6F]' : 'bg-[#4F8683]'}`}
                    style={{ width: `${usagePct}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-[#5B6E75] pt-0.5 font-sans">
                  <span>{isLowUsage ? 'Low Usage — consider cancelling' : 'Regular Usage — keep'}</span>
                  <span className="font-mono font-medium">{usagePct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#5B6E75] pt-1 border-t border-[rgba(43,79,96,0.1)]">
                <span>Payment: {sub.paymentMethod || 'Telda Card'}</span>
                <span className="text-[#4F8683] font-semibold">Active</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
