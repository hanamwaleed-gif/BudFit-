import React, { useState } from 'react';
import { 
  Wallet, 
  PlusCircle, 
  Scan, 
  BarChart3, 
  Calendar, 
  List, 
  CreditCard, 
  Sparkles, 
  Settings, 
  TrendingUp, 
  Layers,
  Repeat,
  Target,
  Gift,
  LogOut,
  Sliders,
  Users,
  User as UserIcon,
  ChevronDown,
  Globe,
  MoreVertical,
  X
} from 'lucide-react';
import { ARCHETYPES } from '../data/archetypes';
import { FXRates, UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeArchetypeId: string;
  onSelectArchetype: (id: string) => void;
  primaryCurrency: string;
  onCurrencyChange: (curr: string) => void;
  fxRates: FXRates;
  onOpenAddTransaction: () => void;
  onOpenReceiptOcr: () => void;
  onOpenSettings: () => void;
  onOpenWrapped: () => void;
  onOpenCommunity?: () => void;
  user?: UserProfile | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeArchetypeId,
  onSelectArchetype,
  primaryCurrency,
  onCurrencyChange,
  onOpenAddTransaction,
  onOpenReceiptOcr,
  onOpenSettings,
  onOpenWrapped,
  onOpenCommunity,
  user,
  onLogout
}) => {
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navTabs = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'ai-plan', label: 'AI Plan', icon: Sparkles },
    { id: 'ledger', label: 'Ledger', icon: List },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
    { id: 'goals', label: 'Savings Plan', icon: Target },
    { id: 'breakdown', label: 'Analytics', icon: TrendingUp },
    { id: 'simulator', label: 'Simulator', icon: Sliders },
    { id: 'ai-insights', label: 'AI Advisor', icon: Sparkles, hasPulse: true }
  ];

  const currentArchetype = ARCHETYPES[activeArchetypeId];

  return (
    <header className="bg-[#1B333F] text-white border-b border-[#2B4F60]/40 sticky top-0 z-30 shadow-md w-full">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Logo & Title */}
        <div 
          className="flex items-center space-x-2 cursor-pointer shrink-0 group" 
          onClick={() => setActiveTab('overview')}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#2B4F60] to-[#142832] border border-white/20 flex items-center justify-center shadow-xs group-hover:border-[#D98B6F] transition">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-[#D98B6F]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight leading-none flex items-center space-x-1">
              <span className="text-[#a6748a]">bud</span>
              <span className="text-white">fit</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] text-white/60 font-sans tracking-wide mt-0.5 hidden xs:block">
              AI Wealth Engine
            </p>
          </div>
        </div>

        {/* Desktop / Tablet Actions (hidden on mobile, visible on sm and up) */}
        <div className="hidden md:flex items-center space-x-2 shrink-0">
          {/* Persona & Currency Compact Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowQuickSettings(!showQuickSettings)}
              className="flex items-center space-x-1.5 bg-[#142832] hover:bg-[#223E4B] text-white/90 border border-white/15 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
              title="Change Persona or Currency"
            >
              <Layers className="w-3.5 h-3.5 text-[#D98B6F]" />
              <span className="text-[11px] font-bold text-[#EAD3CB]">
                {currentArchetype?.name || 'Persona'}
              </span>
              <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/80 font-mono">
                {primaryCurrency}
              </span>
              <ChevronDown className="w-3 h-3 text-white/60" />
            </button>

            {/* Desktop Quick Settings Dropdown */}
            {showQuickSettings && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-[#1B333F] border border-white/20 rounded-2xl shadow-xl p-3 z-50 text-xs space-y-3"
                onMouseLeave={() => setShowQuickSettings(false)}
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 flex items-center space-x-1">
                    <Layers className="w-3 h-3 text-[#D98B6F]" />
                    <span>Select Persona Profile</span>
                  </label>
                  <select
                    value={activeArchetypeId}
                    onChange={(e) => {
                      onSelectArchetype(e.target.value);
                      setShowQuickSettings(false);
                    }}
                    className="w-full bg-[#142832] text-[#EAD3CB] font-semibold p-2 rounded-xl border border-white/15 focus:outline-none cursor-pointer"
                  >
                    {Object.values(ARCHETYPES).map((arch) => (
                      <option key={arch.id} value={arch.id} className="bg-[#1B333F] text-white">
                        {arch.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 pt-1 border-t border-white/10">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 flex items-center space-x-1">
                    <Globe className="w-3 h-3 text-[#4F8683]" />
                    <span>Base Currency</span>
                  </label>
                  <select
                    value={primaryCurrency}
                    onChange={(e) => {
                      onCurrencyChange(e.target.value);
                      setShowQuickSettings(false);
                    }}
                    className="w-full bg-[#142832] text-[#EAD3CB] font-semibold p-2 rounded-xl border border-white/15 focus:outline-none cursor-pointer"
                  >
                    <option value="EGP" className="bg-[#1B333F] text-white">EGP (£E)</option>
                    <option value="USD" className="bg-[#1B333F] text-white">USD ($)</option>
                    <option value="EUR" className="bg-[#1B333F] text-white">EUR (€)</option>
                    <option value="SAR" className="bg-[#1B333F] text-white">SAR (﷼)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Smart Receipt OCR Button */}
          <button
            onClick={onOpenReceiptOcr}
            className="flex items-center space-x-1 bg-[#2B4F60] hover:bg-[#223E4B] text-white px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-white/15 transition cursor-pointer"
            title="Scan Receipt with AI OCR"
          >
            <Scan className="w-3.5 h-3.5 text-[#D98B6F]" />
            <span className="text-xs">Scan</span>
          </button>

          {/* Primary Action: + Add Entry */}
          <button
            onClick={onOpenAddTransaction}
            className="flex items-center space-x-1 bg-[#845460] hover:bg-[#6A414B] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer shrink-0"
            title="Add Transaction"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#EAD3CB]" />
            <span>+ Add</span>
          </button>

          {/* Community Squad Icon */}
          {onOpenCommunity && (
            <button
              onClick={onOpenCommunity}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/15 transition cursor-pointer"
              title="Goal Squad & Community"
            >
              <Users className="w-3.5 h-3.5 text-[#EAD3CB]" />
            </button>
          )}

          {/* Wrapped Icon */}
          <button
            onClick={onOpenWrapped}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/15 transition cursor-pointer"
            title="Year in Review Wrapped"
          >
            <Gift className="w-3.5 h-3.5 text-[#EAD3CB]" />
          </button>

          {/* Settings Icon */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition cursor-pointer"
            title="Settings & Backup"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* User Profile / Logout */}
          {user && (
            <div className="flex items-center space-x-1 pl-1.5 border-l border-white/15">
              <button
                onClick={onLogout}
                className="p-1.5 hover:bg-rose-900/50 text-rose-300 hover:text-white rounded-lg transition cursor-pointer"
                title={`Logged in as ${user.fullName} • Log Out`}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Action Controls (< md breakpoint) */}
        <div className="flex md:hidden items-center space-x-1.5 shrink-0">
          {/* Mobile + Add Button */}
          <button
            onClick={onOpenAddTransaction}
            className="flex items-center space-x-1 bg-[#845460] hover:bg-[#6A414B] text-white px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer shrink-0"
            title="Add Entry"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#EAD3CB]" />
            <span>+ Add</span>
          </button>

          {/* Mobile Scan Button */}
          <button
            onClick={onOpenReceiptOcr}
            className="p-1.5 bg-[#2B4F60] text-white rounded-xl border border-white/15 transition cursor-pointer shrink-0"
            title="Scan Receipt"
          >
            <Scan className="w-4 h-4 text-[#D98B6F]" />
          </button>

          {/* Mobile More / Options Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-1.5 bg-[#142832] text-white border border-white/15 rounded-xl transition cursor-pointer shrink-0 flex items-center justify-center"
              title="More Actions & Persona Settings"
            >
              {showMobileMenu ? <X className="w-4 h-4 text-white" /> : <MoreVertical className="w-4 h-4 text-white/90" />}
            </button>

            {/* Mobile Dropdown Sheet */}
            {showMobileMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-[#1B333F] border border-white/20 rounded-2xl shadow-2xl p-4 z-50 text-xs space-y-3.5">
                {/* Persona Profile & Currency Picker */}
                <div className="space-y-2 bg-[#142832] p-2.5 rounded-xl border border-white/10">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 flex items-center space-x-1">
                      <Layers className="w-3 h-3 text-[#D98B6F]" />
                      <span>Persona Profile</span>
                    </label>
                    <select
                      value={activeArchetypeId}
                      onChange={(e) => {
                        onSelectArchetype(e.target.value);
                      }}
                      className="w-full bg-[#1B333F] text-[#EAD3CB] font-bold p-1.5 rounded-lg border border-white/15 focus:outline-none cursor-pointer"
                    >
                      {Object.values(ARCHETYPES).map((arch) => (
                        <option key={arch.id} value={arch.id} className="bg-[#1B333F] text-white">
                          {arch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 pt-1.5 border-t border-white/10">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 flex items-center space-x-1">
                      <Globe className="w-3 h-3 text-[#4F8683]" />
                      <span>Base Currency</span>
                    </label>
                    <select
                      value={primaryCurrency}
                      onChange={(e) => {
                        onCurrencyChange(e.target.value);
                      }}
                      className="w-full bg-[#1B333F] text-[#EAD3CB] font-bold p-1.5 rounded-lg border border-white/15 focus:outline-none cursor-pointer"
                    >
                      <option value="EGP" className="bg-[#1B333F] text-white">EGP (£E)</option>
                      <option value="USD" className="bg-[#1B333F] text-white">USD ($)</option>
                      <option value="EUR" className="bg-[#1B333F] text-white">EUR (€)</option>
                      <option value="SAR" className="bg-[#1B333F] text-white">SAR (﷼)</option>
                    </select>
                  </div>
                </div>

                {/* Quick Menu Actions */}
                <div className="space-y-1.5 pt-1">
                  {onOpenCommunity && (
                    <button
                      onClick={() => {
                        onOpenCommunity();
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center space-x-2.5 p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium text-left transition"
                    >
                      <Users className="w-4 h-4 text-[#EAD3CB]" />
                      <span>Goal Squad & Community</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onOpenWrapped();
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center space-x-2.5 p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium text-left transition"
                  >
                    <Gift className="w-4 h-4 text-[#EAD3CB]" />
                    <span>Annual Wrapped</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenSettings();
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center space-x-2.5 p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium text-left transition"
                  >
                    <Settings className="w-4 h-4 text-white/80" />
                    <span>App Settings & Backup</span>
                  </button>
                </div>

                {/* User Info & Logout */}
                {user && (
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-white/80">
                      <UserIcon className="w-3.5 h-3.5 text-[#D98B6F]" />
                      <span className="font-semibold truncate max-w-[140px]">{user.fullName}</span>
                    </div>
                    {onLogout && (
                      <button
                        onClick={() => {
                          onLogout();
                          setShowMobileMenu(false);
                        }}
                        className="text-rose-300 hover:text-white text-xs font-bold flex items-center space-x-1 bg-rose-950/40 px-2 py-1 rounded-lg border border-rose-800/40"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Log Out</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Segmented Navigation Tabs Bar */}
      <nav className="bg-[#142832]/95 border-t border-white/10 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto no-scrollbar py-1.5">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#845460] text-white shadow-xs border border-white/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-white/60'}`} />
                <span>{tab.label}</span>
                {tab.hasPulse && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#EAD3CB]' : 'bg-[#D98B6F]'} animate-pulse`}></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};


