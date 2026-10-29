import React, { useState } from 'react';
import { Wallet, Sparkles, ArrowRight, Lock, Mail, User, ShieldCheck, Layers, ClipboardList } from 'lucide-react';
import { UserProfile } from '../types';
import { ARCHETYPES } from '../data/archetypes';
import { OnboardingQuestionnaire, QuestionnaireResult } from './OnboardingQuestionnaire';

interface AuthScreenProps {
  onLogin: (user: UserProfile, customData?: QuestionnaireResult) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState('egyptian-tech-freelancer');
  const [error, setError] = useState('');

  if (showQuestionnaire) {
    return (
      <OnboardingQuestionnaire
        initialEmail={email}
        initialName={fullName}
        onCancel={() => setShowQuestionnaire(false)}
        onComplete={(result) => {
          onLogin(result.user, result);
        }}
      />
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    const user: UserProfile = {
      id: `usr_${Date.now()}`,
      email: email.trim(),
      fullName: fullName.trim() || email.split('@')[0] || 'Omar Al-Masri',
      archetypeId: selectedArchetype,
      createdAt: new Date().toISOString()
    };

    onLogin(user);
  };

  const handleDemoLogin = (archId = 'egyptian-tech-freelancer', name = 'Omar Al-Masri', demoEmail = 'omar@budfit.ai') => {
    const user: UserProfile = {
      id: `usr_demo_${archId}`,
      email: demoEmail,
      fullName: name,
      archetypeId: archId,
      createdAt: new Date().toISOString()
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F2] text-[#22323A] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient pastel glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#BDC7C9]/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#EAD3CB]/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2B4F60] border border-[rgba(255,255,255,0.15)] shadow-md mb-2">
            <Wallet className="w-7 h-7 text-[#EAD3CB]" />
          </div>
          <h1 className="text-4xl font-serif font-medium tracking-tight">
            <span className="text-[#845460] font-serif font-bold">bud</span>
            <span className="text-[#1B333F] font-serif font-medium">fit</span>
          </h1>
          <p className="text-xs text-[#5B6E75] font-sans">
            AI Financial Command & Liquidity Guard
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-6 sm:p-8 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] space-y-6">
          {/* Auth Tab Switcher */}
          <div className="flex bg-[#FAF6F2] p-1 rounded-xl border border-[rgba(43,79,96,0.12)]">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                mode === 'login' ? 'bg-[#2B4F60] text-white shadow-xs' : 'text-[#5B6E75] hover:text-[#1B333F]'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                mode === 'signup' ? 'bg-[#2B4F60] text-white shadow-xs' : 'text-[#5B6E75] hover:text-[#1B333F]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="p-3 bg-[#EAD3CB]/50 border border-[#845460]/30 text-[#845460] text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="text-[#1B333F] font-semibold block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#5B6E75] absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Omar Al-Masri"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-[#FAF6F2] text-[#1B333F] pl-9 pr-3 py-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#2B4F60] font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[#1B333F] font-semibold block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#5B6E75] absolute left-3 top-3" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#FAF6F2] text-[#1B333F] pl-9 pr-3 py-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#2B4F60] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[#1B333F] font-semibold block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#5B6E75] absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#FAF6F2] text-[#1B333F] pl-9 pr-3 py-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#2B4F60] font-mono"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-[#1B333F] font-semibold block mb-1 flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-[#845460]" />
                    <span>Select Preset Archetype</span>
                  </label>
                  <select
                    value={selectedArchetype}
                    onChange={(e) => setSelectedArchetype(e.target.value)}
                    className="w-full bg-[#FAF6F2] text-[#1B333F] p-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#2B4F60] font-semibold"
                  >
                    {Object.values(ARCHETYPES).map((arch) => (
                      <option key={arch.id} value={arch.id}>
                        {arch.name} ({arch.currency})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3.5 bg-[#FAF6F2] border border-[rgba(43,79,96,0.13)] rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-[#1B333F] font-semibold text-xs">
                    <ClipboardList className="w-4 h-4 text-[#845460] shrink-0" />
                    <span>Prefer a Custom Tailored Setup?</span>
                  </div>
                  <p className="text-[11px] text-[#5B6E75] leading-relaxed">
                    Answer a 4-step questionnaire (income, subscriptions, bills, savings goal) to build a personalized account.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowQuestionnaire(true)}
                    className="w-full bg-[#2B4F60] hover:bg-[#1B333F] text-white font-semibold py-2 rounded-xl text-xs shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D98B6F]" />
                    <span>Start Account Questionnaire</span>
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#2B4F60] hover:bg-[#1B333F] text-white font-semibold py-3 rounded-xl text-xs shadow-xs transition active:scale-[0.98] flex items-center justify-center space-x-2 mt-2 cursor-pointer"
            >
              <span>{mode === 'login' ? 'Authenticate & Enter' : 'Create budfit Account'}</span>
              <ArrowRight className="w-4 h-4 text-[#D98B6F]" />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-4 border-t border-[rgba(43,79,96,0.12)] text-center space-y-3">
            <p className="text-[11px] text-[#5B6E75] font-semibold">Or log in instantly with demo profiles:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('egyptian-tech-freelancer', 'Omar Al-Masri', 'omar.tech@budfit.ai')}
                className="w-full bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#1B333F] border border-[rgba(43,79,96,0.12)] hover:border-[#845460]/40 p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition group cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6.5 h-6.5 rounded-full bg-[#BDC7C9] text-[#2B4F60] flex items-center justify-center text-[10px] font-bold shrink-0">
                    OA
                  </div>
                  <div className="text-left min-w-0">
                    <div className="text-[#1B333F] font-semibold text-xs truncate">Omar Al-Masri</div>
                    <div className="text-[10px] text-[#5B6E75] truncate">Tech Freelancer (EGP)</div>
                  </div>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-[#845460] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('cairo-corporate-exec', 'Nour El-Din', 'nour.exec@budfit.ai')}
                className="w-full bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#1B333F] border border-[rgba(43,79,96,0.12)] hover:border-[#845460]/40 p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition group cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6.5 h-6.5 rounded-full bg-[#EAD3CB] text-[#845460] flex items-center justify-center text-[10px] font-bold shrink-0">
                    NE
                  </div>
                  <div className="text-left min-w-0">
                    <div className="text-[#1B333F] font-semibold text-xs truncate">Nour El-Din</div>
                    <div className="text-[10px] text-[#5B6E75] truncate">Corporate Exec (EGP/USD)</div>
                  </div>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-[#845460] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('global-tech-engineer', 'Alex Chen', 'alex.chen@budfit.ai')}
                className="w-full bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#1B333F] border border-[rgba(43,79,96,0.12)] hover:border-[#845460]/40 p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition group cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6.5 h-6.5 rounded-full bg-[#2B4F60] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    AC
                  </div>
                  <div className="text-left min-w-0">
                    <div className="text-[#1B333F] font-semibold text-xs truncate">Alex Chen</div>
                    <div className="text-[10px] text-[#5B6E75] truncate">Tech Engineer (USD)</div>
                  </div>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-[#845460] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('student-part-time-intern', 'Youssef & Malak', 'student@budfit.ai')}
                className="w-full bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#1B333F] border border-[rgba(43,79,96,0.12)] hover:border-[#845460]/40 p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition group cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6.5 h-6.5 rounded-full bg-[#4F8683] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    YM
                  </div>
                  <div className="text-left min-w-0">
                    <div className="text-[#1B333F] font-semibold text-xs truncate">Youssef & Malak</div>
                    <div className="text-[10px] text-[#5B6E75] truncate">Student & Intern (EGP)</div>
                  </div>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-[#845460] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-center space-x-2 text-[11px] text-[#5B6E75] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#4F8683]" />
          <span>Encrypted Local State & Multi-Currency FX Guard</span>
        </div>
      </div>
    </div>
  );
};
