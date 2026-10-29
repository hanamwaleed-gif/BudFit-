import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  MessageSquare, 
  Share2, 
  Award, 
  Flame, 
  Send, 
  Target, 
  ThumbsUp,
  Zap,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Building2,
  Laptop,
  Palmtree,
  Lock,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { UserProfile, CommunityPost, AccountabilityChallenge, GoalSquad, GoalChatMessage } from '../types';

interface CommunityHubProps {
  user: UserProfile;
  currency: string;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({ user, currency }) => {
  const [activeTab, setActiveTab] = useState<'squads' | 'feed' | 'challenges'>('squads');
  const [selectedSquadId, setSelectedSquadId] = useState<string>('squad_debt');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSquadFeed, setFilterSquadFeed] = useState<string>('all');
  
  // Feed form
  const [newPostText, setNewPostText] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'milestone' | 'tip' | 'challenge' | 'question'>('milestone');
  const [isPosting, setIsPosting] = useState(false);

  // Group chat input
  const [chatInput, setChatInput] = useState('');

  // Define Goal Squads
  const [squads, setSquads] = useState<GoalSquad[]>([
    {
      id: 'squad_debt',
      name: 'Debt-Free Strikers',
      description: 'Members actively liquidating credit cards, auto loans & personal debt.',
      iconName: 'CreditCard',
      goalType: 'debt',
      membersCount: 342,
      activeSprintText: 'Avalanche Debt Elimination Sprint',
      tags: ['Credit Cards', 'Car Loans', 'High Interest Payoff']
    },
    {
      id: 'squad_stocks',
      name: 'Stock & Equities Compounders',
      description: 'EGX 30 index, S&P 500 ETFs, Thndr stock portfolios & dividend growth.',
      iconName: 'TrendingUp',
      goalType: 'stock_investments',
      membersCount: 512,
      activeSprintText: 'Weekly Stock DCA & Portfolio Compounding',
      tags: ['EGX 30', 'S&P 500', 'Thndr', 'ETFs']
    },
    {
      id: 'squad_realestate',
      name: 'Real Estate & Down Payment Builders',
      description: 'Villa & home down payments, land escrow & property installments.',
      iconName: 'Building2',
      goalType: 'big_purchase',
      membersCount: 289,
      activeSprintText: 'Property Escrow Accumulation',
      tags: ['Property', 'Home Down Payment', 'Escrow']
    },
    {
      id: 'squad_emergency',
      name: 'Emergency Cushion & Liquidity Guard',
      description: '3-6 month living buffers, high-yield bank CDs (18.5%), & T-Bills.',
      iconName: 'ShieldCheck',
      goalType: 'net_worth',
      membersCount: 620,
      activeSprintText: '6-Month Runway Sprint',
      tags: ['18.5% CDs', 'T-Bills', 'Liquid Reserve']
    },
    {
      id: 'squad_tech',
      name: 'Tech & Career Gear Upgrade',
      description: 'Laptops, work setups, study tablets, and professional gear funds.',
      iconName: 'Laptop',
      goalType: 'big_purchase',
      membersCount: 195,
      activeSprintText: 'Hardware & Tech Asset Savings',
      tags: ['MacBook', 'iPad', 'Freelance Tools']
    },
    {
      id: 'squad_vacation',
      name: 'Sahel & Vacation Sprint',
      description: 'Saving for Sahel summer trips, travel & experience funds without debt.',
      iconName: 'Palmtree',
      goalType: 'lifestyle',
      membersCount: 230,
      activeSprintText: 'Summer Travel Savings',
      tags: ['Sahel 2026', 'Travel Buffer', 'Cash Paid']
    }
  ]);

  // Initial group chat messages per squad
  const [chatMessages, setChatMessages] = useState<GoalChatMessage[]>([
    {
      id: 'msg_1',
      squadId: 'squad_debt',
      senderName: 'Fatima N.',
      senderGoalTitle: 'Credit Card Freedom',
      senderProgressPct: 100,
      message: '🎉 Down to 0 EGP balance! Applied my entire freelance bonus straight to my 24% card balance.',
      timestamp: '10:14 AM'
    },
    {
      id: 'msg_2',
      squadId: 'squad_debt',
      senderName: 'Nour El-Din',
      senderGoalTitle: 'BMW 520i Loan Payoff',
      senderProgressPct: 68,
      message: 'Great work Fatima! I just automated an extra 5,000 EGP payment toward my 19.5% BMW loan.',
      timestamp: '10:22 AM'
    },
    {
      id: 'msg_3',
      squadId: 'squad_debt',
      senderName: 'Omar Al-Masri',
      senderGoalTitle: 'CIB Platinum Card Payoff',
      senderProgressPct: 62,
      message: 'Using BudFit\'s Debt Avalanche strategy saved me 1,800 EGP in interest this month alone.',
      timestamp: '11:05 AM'
    },
    {
      id: 'msg_4',
      squadId: 'squad_stocks',
      senderName: 'Omar Al-Masri',
      senderGoalTitle: 'EGX 30 & US Tech Portfolio',
      senderProgressPct: 55,
      message: 'Deposited 12,000 EGP into Thndr EGX 30 ETF today. Steady weekly dollar cost averaging!',
      timestamp: '09:30 AM'
    },
    {
      id: 'msg_5',
      squadId: 'squad_stocks',
      senderName: 'Alex Chen',
      senderGoalTitle: 'S&P 500 VOO Growth Fund',
      senderProgressPct: 62,
      message: 'Automated $1,500/month into Fidelity VOO index. Dividend reinvestment turned on!',
      timestamp: '10:00 AM'
    },
    {
      id: 'msg_6',
      squadId: 'squad_realestate',
      senderName: 'Nour El-Din',
      senderGoalTitle: 'New Cairo Villa Down Payment',
      senderProgressPct: 62,
      message: 'Reached 1.12M EGP in my pre-construction villa escrow fund! Staying disciplined.',
      timestamp: 'Yesterday'
    },
    {
      id: 'msg_7',
      squadId: 'squad_emergency',
      senderName: 'Kareem S.',
      senderGoalTitle: '6-Month Living Reserve',
      senderProgressPct: 75,
      message: 'Renewed my 18.5% CIB Certificates. Guaranteed monthly coupon yield is solid.',
      timestamp: '8:45 AM'
    },
    {
      id: 'msg_8',
      squadId: 'squad_tech',
      senderName: 'Youssef & Malak',
      senderGoalTitle: 'iPad Air & Pencil Fund',
      senderProgressPct: 66,
      message: 'Almost there! Tutoring income added 2,800 EGP this week toward university study tablet.',
      timestamp: 'Yesterday'
    }
  ]);

  // Initial mock community posts
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: 'post_1',
      squadId: 'squad_debt',
      userName: 'Fatima N.',
      timeAgo: '2 hours ago',
      goalTitle: 'Credit Card Debt Freedom',
      goalProgressPct: 100,
      category: 'milestone',
      content: '🎉 Just paid off my final 12,500 EGP credit card balance using the Debt Avalanche strategy! Freeing up 3,200 EGP monthly for my house down payment now.',
      clapsCount: 42,
      boostsCount: 18,
      commentsCount: 9,
      badgeUnlocked: 'Debt Liberator'
    },
    {
      id: 'post_2',
      squadId: 'squad_emergency',
      userName: 'Kareem S.',
      timeAgo: '5 hours ago',
      goalTitle: 'Emergency Buffer Sprint',
      goalProgressPct: 75,
      category: 'tip',
      content: '💡 Financial Tip: I audited my recurring subscriptions on BudFit and canceled 3 unused streaming & AI services. Saved 1,850 EGP/month that goes straight into 22% T-Bills!',
      clapsCount: 31,
      boostsCount: 12,
      commentsCount: 4
    },
    {
      id: 'post_3',
      squadId: 'squad_stocks',
      userName: 'Omar Al-Masri',
      timeAgo: '1 day ago',
      goalTitle: 'EGX 30 & US Tech Portfolio',
      goalProgressPct: 60,
      category: 'milestone',
      content: 'Crossed 300,000 EGP in liquid accounts! Sticking strictly to my AI-generated weekly spending cap of 8,500 EGP/week is making a huge difference.',
      clapsCount: 56,
      boostsCount: 24,
      commentsCount: 14,
      badgeUnlocked: 'Capital Milestone 100k'
    },
    {
      id: 'post_4',
      squadId: 'squad_vacation',
      userName: 'Salma T.',
      timeAgo: '2 days ago',
      goalTitle: 'Sahel Summer Vacation Fund',
      goalProgressPct: 85,
      category: 'question',
      content: 'Quick question for the community: Do you prefer keeping short-term vacation savings in high-yield savings accounts or 3-month Treasury Bills?',
      clapsCount: 19,
      boostsCount: 5,
      commentsCount: 11
    }
  ]);

  // Accountability challenges
  const [challenges, setChallenges] = useState<AccountabilityChallenge[]>([
    {
      id: 'chal_1',
      title: '30-Day Coffee Shop & Dining Cap Challenge',
      description: 'Cap specialty coffee and dining out to 2x per week. Save up to 2,500 EGP monthly.',
      participantsCount: 148,
      daysRemaining: 12,
      targetCategory: 'Dining Out',
      targetGoalText: 'Max 2x / week dining',
      userProgressPct: 65,
      isJoined: true
    },
    {
      id: 'chal_2',
      title: 'Subscription Purge Sprint',
      description: 'Audit and trim at least 1 unused subscription service this week.',
      participantsCount: 215,
      daysRemaining: 5,
      targetCategory: 'Subscriptions',
      targetGoalText: '100% active sub audit',
      userProgressPct: 100,
      isJoined: true
    },
    {
      id: 'chal_3',
      title: '50,000 EGP Emergency Reserve Sprint',
      description: 'Community sprint to accumulate a 3-month living expense buffer.',
      participantsCount: 310,
      daysRemaining: 45,
      targetCategory: 'Emergency Reserve',
      targetGoalText: '50k EGP liquidity',
      userProgressPct: 40,
      isJoined: false
    }
  ]);

  // Determine user's primary recommended squad based on user.primaryGoal
  const getUserRecommendedSquadId = (): string => {
    const goalType = user.primaryGoal?.type || '';
    if (goalType === 'debt') return 'squad_debt';
    if (goalType === 'stock_investments' || goalType === 'investment') return 'squad_stocks';
    if (goalType === 'big_purchase') return 'squad_realestate';
    if (goalType === 'emergency_fund' || goalType === 'net_worth') return 'squad_emergency';
    return 'squad_debt';
  };

  const userRecommendedSquadId = getUserRecommendedSquadId();

  const handleClap = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const hasClapped = p.hasClapped;
        return {
          ...p,
          clapsCount: hasClapped ? p.clapsCount - 1 : p.clapsCount + 1,
          hasClapped: !hasClapped
        };
      }
      return p;
    }));
  };

  const handleBoost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const hasBoosted = p.hasBoosted;
        return {
          ...p,
          boostsCount: hasBoosted ? p.boostsCount - 1 : p.boostsCount + 1,
          hasBoosted: !hasBoosted
        };
      }
      return p;
    }));
  };

  const handleSendGroupMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: GoalChatMessage = {
      id: `msg_${Date.now()}`,
      squadId: selectedSquadId,
      senderName: user.fullName || 'BudFit Member',
      senderGoalTitle: user.primaryGoal?.title || 'Financial Goal',
      senderProgressPct: 50,
      message: chatInput,
      timestamp: 'Just now',
      isCurrentUser: true
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    setIsPosting(true);
    setTimeout(() => {
      const newPost: CommunityPost = {
        id: `post_${Date.now()}`,
        squadId: selectedSquadId,
        userName: user.fullName || 'BudFit Member',
        timeAgo: 'Just now',
        goalTitle: user.primaryGoal?.title || 'Financial Milestone',
        goalProgressPct: 50,
        category: newPostCategory,
        content: newPostText,
        clapsCount: 1,
        boostsCount: 1,
        commentsCount: 0,
        hasClapped: true
      };

      setPosts([newPost, ...posts]);
      setNewPostText('');
      setIsPosting(false);
    }, 400);
  };

  const toggleJoinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId) {
        return {
          ...c,
          isJoined: !c.isJoined,
          participantsCount: c.isJoined ? c.participantsCount - 1 : c.participantsCount + 1
        };
      }
      return c;
    }));
  };

  const activeSquad = squads.find(s => s.id === selectedSquadId) || squads[0];
  const squadMessages = chatMessages.filter(m => m.squadId === selectedSquadId);
  const filteredPosts = posts.filter(p => {
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesSquad = filterSquadFeed === 'all' || p.squadId === filterSquadFeed;
    return matchesCategory && matchesSquad;
  });

  const renderSquadIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard': return <CreditCard className="w-4 h-4 text-[#D98B6F]" />;
      case 'TrendingUp': return <TrendingUp className="w-4 h-4 text-[#10B981]" />;
      case 'Building2': return <Building2 className="w-4 h-4 text-[#3B82F6]" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-[#4F8683]" />;
      case 'Laptop': return <Laptop className="w-4 h-4 text-[#8B5CF6]" />;
      case 'Palmtree': return <Palmtree className="w-4 h-4 text-[#F59E0B]" />;
      default: return <Target className="w-4 h-4 text-[#2B4F60]" />;
    }
  };

  return (
    <div className="space-y-5 text-xs text-[#22323A]">
      {/* Header Banner */}
      <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-5 sm:p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(43,79,96,0.12)] pb-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#FAF6F2] border border-[rgba(43,79,96,0.12)] px-3 py-1 rounded-full">
              <Users className="w-3.5 h-3.5 text-[#845460]" />
              <span className="text-[10px] font-bold text-[#845460] uppercase tracking-wider">
                Goal-Grouped Community Hub
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1B333F] mt-1">
              Separated Goal Squads & Accountability Sprints
            </h2>
            <p className="text-xs text-[#5B6E75]">
              Connect with peers who share your exact financial goals — debt payoff, stock investing, home down payments, or emergency cushions.
            </p>
          </div>

          <div className="flex bg-[#FAF6F2] p-1 rounded-2xl border border-[rgba(43,79,96,0.12)] shrink-0">
            <button
              onClick={() => setActiveTab('squads')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'squads'
                  ? 'bg-[#2B4F60] text-white shadow-xs'
                  : 'text-[#5B6E75] hover:text-[#1B333F]'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#EAD3CB]" />
              <span>Goal Squad Chats</span>
            </button>
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-[#2B4F60] text-white shadow-xs'
                  : 'text-[#5B6E75] hover:text-[#1B333F]'
              }`}
            >
              Activity Feed
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'challenges'
                  ? 'bg-[#2B4F60] text-white shadow-xs'
                  : 'text-[#5B6E75] hover:text-[#1B333F]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#D98B6F]" />
              <span>Sprints ({challenges.length})</span>
            </button>
          </div>
        </div>

        {/* Goal Matching Notice */}
        {user.primaryGoal && (
          <div className="bg-[#FAF6F2] border border-[#2B4F60]/20 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#2B4F60] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                ★
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#1B333F] flex items-center space-x-1.5">
                  <span>Your Current Goal:</span>
                  <span className="text-[#2B4F60] italic">"{user.primaryGoal.title}"</span>
                </div>
                <div className="text-[10px] text-[#5B6E75]">
                  Automatically grouped into <span className="font-bold text-[#1B333F]">{squads.find(s => s.id === userRecommendedSquadId)?.name}</span> with matching peers.
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedSquadId(userRecommendedSquadId);
                setActiveTab('squads');
              }}
              className="bg-[#2B4F60] hover:bg-[#1B333F] text-white px-3 py-1.5 rounded-xl font-semibold text-[11px] transition shrink-0 cursor-pointer"
            >
              Jump to Your Goal Squad
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: GOAL SQUADS GROUP CHAT */}
      {activeTab === 'squads' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Squad Channels Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-[11px] font-bold text-[#5B6E75] uppercase tracking-wider px-1">
              Select Goal Squad ({squads.length})
            </div>

            <div className="space-y-2">
              {squads.map(squad => {
                const isSelected = squad.id === selectedSquadId;
                const isUserMatch = squad.id === userRecommendedSquadId;

                return (
                  <button
                    key={squad.id}
                    onClick={() => setSelectedSquadId(squad.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#2B4F60] text-white border-[#2B4F60] shadow-md'
                        : 'bg-white text-[#1B333F] border-[rgba(43,79,96,0.13)] hover:border-[#2B4F60]/40 hover:bg-[#FAF6F2]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/10' : 'bg-[#FAF6F2]'}`}>
                          {renderSquadIcon(squad.iconName)}
                        </div>
                        <div>
                          <div className={`font-bold text-xs flex items-center space-x-1.5 ${isSelected ? 'text-white' : 'text-[#1B333F]'}`}>
                            <span>{squad.name}</span>
                          </div>
                          <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-[#5B6E75]'}`}>
                            {squad.membersCount} Peers Chatting
                          </div>
                        </div>
                      </div>

                      {isUserMatch && (
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-[#EAD3CB] text-[#845460]' : 'bg-[#EAD3CB]/50 text-[#845460]'
                        }`}>
                          ★ Your Match
                        </span>
                      )}
                    </div>

                    <p className={`text-[10.5px] mt-2 line-clamp-2 ${isSelected ? 'text-white/90' : 'text-[#5B6E75]'}`}>
                      {squad.description}
                    </p>

                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {squad.tags.map((tag, i) => (
                        <span
                          key={i}
                          className={`text-[9.5px] px-2 py-0.5 rounded-md font-semibold ${
                            isSelected ? 'bg-white/15 text-white' : 'bg-[#FAF6F2] text-[#5B6E75]'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group Chat Window */}
          <div className="lg:col-span-8 bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-5 shadow-[0_1px_2px_rgba(27,51,63,0.04)] flex flex-col justify-between min-h-[500px]">
            {/* Chat Room Header */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[rgba(43,79,96,0.12)] pb-3 gap-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-2xl bg-[#FAF6F2] border border-[rgba(43,79,96,0.12)]">
                    {renderSquadIcon(activeSquad.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-serif font-bold text-base text-[#1B333F]">
                        {activeSquad.name} Channel
                      </h3>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Live Group Chat
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5B6E75]">
                      Active Sprint: <span className="font-semibold text-[#2B4F60]">{activeSquad.activeSprintText}</span> • {activeSquad.membersCount} Goal Peers
                    </p>
                  </div>
                </div>

                <span className="text-[10px] bg-[#FAF6F2] text-[#5B6E75] px-2.5 py-1 rounded-xl border border-[rgba(43,79,96,0.12)] font-mono self-start sm:self-auto">
                  Separated Chat Room
                </span>
              </div>

              {/* Chat Messages */}
              <div className="space-y-3.5 my-4 max-h-[360px] overflow-y-auto pr-1">
                {squadMessages.length === 0 ? (
                  <div className="text-center py-12 text-[#5B6E75] space-y-2">
                    <MessageSquare className="w-8 h-8 text-[#BDC7C9] mx-auto" />
                    <p className="font-semibold text-xs">No messages in this Goal Squad yet.</p>
                    <p className="text-[11px]">Be the first to share an update or question with fellow goal strivers!</p>
                  </div>
                ) : (
                  squadMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-2xl border transition ${
                        msg.isCurrentUser
                          ? 'bg-[#2B4F60]/5 border-[#2B4F60]/20 ml-6 sm:ml-12'
                          : 'bg-[#FAF6F2] border-[rgba(43,79,96,0.1)] mr-6 sm:mr-12'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-[10px] ${
                            msg.isCurrentUser ? 'bg-[#2B4F60] text-white' : 'bg-[#EAD3CB] text-[#845460]'
                          }`}>
                            {msg.senderName.charAt(0)}
                          </div>
                          <span className="font-bold text-[#1B333F] text-xs">
                            {msg.senderName} {msg.isCurrentUser && '(You)'}
                          </span>
                          <span className="text-[10px] bg-white text-[#4F8683] px-2 py-0.5 rounded-full font-semibold border border-[rgba(43,79,96,0.12)]">
                            🎯 {msg.senderGoalTitle} ({msg.senderProgressPct}%)
                          </span>
                        </div>

                        <span className="text-[10px] text-[#5B6E75] font-mono">{msg.timestamp}</span>
                      </div>

                      <p className="text-xs text-[#22323A] leading-relaxed pl-8">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Send Message Input */}
            <form onSubmit={handleSendGroupMessage} className="pt-3 border-t border-[rgba(43,79,96,0.12)] flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Message ${activeSquad.name} members about your goal...`}
                className="flex-1 bg-[#FAF6F2] text-[#1B333F] px-4 py-2.5 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#2B4F60] text-xs"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="bg-[#2B4F60] hover:bg-[#1B333F] text-white px-4 py-2.5 rounded-xl font-semibold text-xs inline-flex items-center space-x-1.5 shadow-xs cursor-pointer disabled:opacity-50 transition shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-[#D98B6F]" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: COMMUNITY FEED */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {/* Create Post Form */}
          <form onSubmit={handleCreatePost} className="bg-[#FAF6F2] border border-[rgba(43,79,96,0.13)] rounded-2xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-serif font-bold text-[#1B333F] text-xs flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D98B6F]" />
                <span>Share a Milestone Update or Tip to Community</span>
              </span>

              <div className="flex items-center space-x-2">
                <select
                  value={selectedSquadId}
                  onChange={(e) => setSelectedSquadId(e.target.value)}
                  className="bg-white text-[#1B333F] px-2.5 py-1 rounded-xl border border-[rgba(43,79,96,0.12)] font-semibold text-[11px]"
                >
                  {squads.map(s => (
                    <option key={s.id} value={s.id}>
                      Squad: {s.name}
                    </option>
                  ))}
                </select>

                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value as any)}
                  className="bg-white text-[#1B333F] px-2.5 py-1 rounded-xl border border-[rgba(43,79,96,0.12)] font-semibold text-[11px]"
                >
                  <option value="milestone">🎉 Milestone Progress</option>
                  <option value="tip">💡 Financial Tip</option>
                  <option value="question">❓ Question to Community</option>
                  <option value="challenge">🔥 Challenge Update</option>
                </select>
              </div>
            </div>

            <textarea
              rows={2}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder={`Share your progress on "${user.primaryGoal?.title || 'your financial goal'}"...`}
              className="w-full bg-white text-[#1B333F] p-3 rounded-xl border border-[rgba(43,79,96,0.15)] focus:outline-none focus:border-[#2B4F60] font-sans text-xs"
            />

            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#5B6E75] italic">
                Sharing progress with matching goal squads boosts success by 85%!
              </span>

              <button
                type="submit"
                disabled={isPosting || !newPostText.trim()}
                className="bg-[#2B4F60] hover:bg-[#1B333F] text-white px-4 py-2 rounded-xl font-semibold text-xs inline-flex items-center space-x-1.5 shadow-xs cursor-pointer disabled:opacity-50 transition"
              >
                <Send className="w-3.5 h-3.5 text-[#D98B6F]" />
                <span>{isPosting ? 'Posting...' : 'Post Update'}</span>
              </button>
            </div>
          </form>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
            <div className="flex items-center space-x-2 overflow-x-auto">
              <span className="text-[10px] font-bold text-[#5B6E75] uppercase">Post Type:</span>
              {['all', 'milestone', 'tip', 'question', 'challenge'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-full font-semibold text-[11px] capitalize cursor-pointer transition ${
                    filterCategory === cat
                      ? 'bg-[#2B4F60] text-white'
                      : 'bg-white border border-[rgba(43,79,96,0.12)] text-[#5B6E75] hover:text-[#1B333F]'
                  }`}
                >
                  {cat === 'all' ? 'All Types' : cat}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-[#5B6E75] uppercase">Filter Squad:</span>
              <select
                value={filterSquadFeed}
                onChange={(e) => setFilterSquadFeed(e.target.value)}
                className="bg-white text-[#1B333F] px-2.5 py-1 rounded-xl border border-[rgba(43,79,96,0.12)] font-semibold text-[11px]"
              >
                <option value="all">All Goal Squads</option>
                {squads.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map(post => {
              const squadObj = squads.find(s => s.id === post.squadId);

              return (
                <div 
                  key={post.id}
                  className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-5 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-[#EAD3CB] text-[#845460] font-bold flex items-center justify-center text-xs">
                        {post.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-[#1B333F] text-xs">{post.userName}</span>
                          {squadObj && (
                            <span className="bg-[#FAF6F2] text-[#2B4F60] border border-[rgba(43,79,96,0.12)] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              Squad: {squadObj.name}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#5B6E75] font-mono">{post.timeAgo}</span>
                      </div>
                    </div>

                    {post.badgeUnlocked && (
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                        <Award className="w-3 h-3 text-amber-600" />
                        <span>{post.badgeUnlocked}</span>
                      </span>
                    )}
                  </div>

                  {/* Post Goal Banner */}
                  <div className="bg-[#FAF6F2] border border-[rgba(43,79,96,0.1)] rounded-xl p-2.5 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="w-3.5 h-3.5 text-[#4F8683]" />
                      <span className="font-semibold text-[11px] text-[#1B333F]">{post.goalTitle}</span>
                    </div>
                    <div className="flex items-center space-x-2 font-mono text-[11px]">
                      <span className="font-bold text-[#4F8683]">{post.goalProgressPct}% Complete</span>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-xs text-[#22323A] leading-relaxed">
                    {post.content}
                  </p>

                  {/* Controls */}
                  <div className="pt-2 border-t border-[rgba(43,79,96,0.1)] flex items-center justify-between text-[#5B6E75]">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleClap(post.id)}
                        className={`flex items-center space-x-1.5 text-xs cursor-pointer transition ${
                          post.hasClapped ? 'text-[#845460] font-bold' : 'hover:text-[#1B333F]'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{post.clapsCount} Encourage</span>
                      </button>

                      <button 
                        onClick={() => handleBoost(post.id)}
                        className={`flex items-center space-x-1.5 text-xs cursor-pointer transition ${
                          post.hasBoosted ? 'text-[#2B4F60] font-bold' : 'hover:text-[#1B333F]'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{post.boostsCount} Boost</span>
                      </button>

                      <span className="flex items-center space-x-1 text-xs">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{post.commentsCount} Comments</span>
                      </span>
                    </div>

                    <button className="text-[#5B6E75] hover:text-[#1B333F] cursor-pointer">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ACCOUNTABILITY SPRINTS */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.map(chal => (
            <div 
              key={chal.id}
              className="bg-white border border-[rgba(43,79,96,0.13)] rounded-3xl p-5 shadow-[0_1px_2px_rgba(27,51,63,0.04)] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-orange-50 text-orange-800 border border-orange-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <Flame className="w-3 h-3 text-orange-600" />
                    <span>{chal.daysRemaining} days left</span>
                  </span>
                  <span className="text-[10px] text-[#5B6E75] font-mono">
                    {chal.participantsCount} Members
                  </span>
                </div>

                <h3 className="font-serif font-bold text-[#1B333F] text-sm">
                  {chal.title}
                </h3>

                <p className="text-xs text-[#5B6E75] leading-relaxed">
                  {chal.description}
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-[rgba(43,79,96,0.1)]">
                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-[#5B6E75]">Your Progress</span>
                    <span className="font-bold text-[#2B4F60]">{chal.userProgressPct}%</span>
                  </div>
                  <div className="w-full bg-[#FAF6F2] h-2 rounded-full overflow-hidden border border-[rgba(43,79,96,0.1)]">
                    <div className="bg-[#2B4F60] h-full" style={{ width: `${chal.userProgressPct}%` }}></div>
                  </div>
                </div>

                <button
                  onClick={() => toggleJoinChallenge(chal.id)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs ${
                    chal.isJoined
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-[#2B4F60] text-white hover:bg-[#1B333F]'
                  }`}
                >
                  {chal.isJoined ? '✓ Challenge Joined' : 'Join Accountability Challenge'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
