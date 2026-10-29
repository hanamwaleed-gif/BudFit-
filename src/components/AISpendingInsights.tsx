import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  RefreshCw, 
  ArrowRight,
  MessageSquare,
  Send,
  Bot,
  User,
  Lightbulb,
  Trash2,
  ShieldCheck,
  Zap,
  ChevronRight
} from 'lucide-react';
import { AIInsight, Transaction, Budget } from '../types';

interface AISpendingInsightsProps {
  insights: AIInsight[];
  transactions: Transaction[];
  budget: Budget;
  primaryCurrency: string;
  onRefreshInsights: () => void;
  onApplyInsightAction?: (insight: AIInsight) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AISpendingInsights: React.FC<AISpendingInsightsProps> = ({
  insights,
  transactions,
  budget,
  primaryCurrency,
  onRefreshInsights,
  onApplyInsightAction
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'audits'>('chat');
  const [loadingAudit, setLoadingAudit] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'ai',
      text: `Hello! I am your BudFit AI Financial Advisor Chatbot. I've analyzed your current monthly budget limit (${budget.monthlyLimit.toLocaleString()} ${primaryCurrency}) and recent ${transactions.length} transactions. Ask me anything about your cash flow, savings strategy, or spending habits!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isSending, setIsSending] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeSubTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, activeSubTab]);

  const handleRunAiAudit = async () => {
    setLoadingAudit(true);
    await onRefreshInsights();
    setLoadingAudit(false);
  };

  const handleSendMessage = async (msgText?: string) => {
    const textToSend = msgText || inputMsg;
    if (!textToSend.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!msgText) setInputMsg('');
    setIsSending(true);

    try {
      const response = await fetch('/api/ai/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: messages.map(m => ({ sender: m.sender, text: m.text })),
          transactions: transactions.slice(0, 20),
          budget,
          currency: primaryCurrency
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: ChatMessage = {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: data.reply || "I've reviewed your question. Let's keep optimizing your savings buffer!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.error('Chat request error:', err);
      // Fallback response
      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: `Based on your budget of ${budget.monthlyLimit.toLocaleString()} ${primaryCurrency}, tracking daily expenses and setting cap limits on dining and subscriptions will preserve your savings buffer effectively.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const samplePrompts = [
    "Am I on track for my monthly budget?",
    "Where am I spending the most money?",
    "How can I save 5,000 EGP more this month?",
    "Audit my subscriptions and recurring bills"
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-[#1B333F] border border-[#2B4F60] rounded-2xl p-5 sm:p-6 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-white/10 text-[#EAD3CB] rounded-2xl border border-white/20 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse text-[#D98B6F]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#2B4F60] text-[#EAD3CB] font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10">
                Gemini 3.6 Flash Powered
              </span>
            </div>
            <h2 className="text-xl font-serif font-medium tracking-wide mt-1">AI Financial Advisor Command</h2>
            <p className="text-xs text-[#BDC7C9] font-sans">
              Interactive chatbot consultation & real-time spending anomaly detection
            </p>
          </div>
        </div>

        {/* Navigation Mode Switcher */}
        <div className="flex items-center bg-[#142832] p-1 rounded-xl border border-white/15 shrink-0 self-start sm:self-center">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'chat'
                ? 'bg-[#845460] text-white shadow-xs'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#EAD3CB]" />
            <span>AI Chatbot</span>
          </button>

          <button
            onClick={() => setActiveSubTab('audits')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'audits'
                ? 'bg-[#845460] text-white shadow-xs'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#EAD3CB]" />
            <span>Automated Audits ({insights.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: AI Advisor Interactive Chatbot */}
      {activeSubTab === 'chat' && (
        <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl shadow-[0_1px_3px_rgba(27,51,63,0.04)] flex flex-col h-[560px] overflow-hidden">
          {/* Chat Window Top Bar */}
          <div className="bg-[#FAF6F2] border-b border-[rgba(43,79,96,0.1)] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#1B333F] text-white flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#D98B6F]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#1B333F]">AI Financial Assistant</h3>
                <p className="text-[10px] text-[#4F8683] font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4F8683] animate-pulse"></span>
                  <span>Context Loaded ({transactions.length} Txns • {primaryCurrency})</span>
                </p>
              </div>
            </div>

            {messages.length > 1 && (
              <button
                onClick={() => setMessages([messages[0]])}
                className="text-[11px] text-[#845460] hover:text-[#6A414B] font-semibold flex items-center space-x-1 p-1 rounded transition cursor-pointer"
                title="Clear Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            )}
          </div>

          {/* Messages Stream Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-[#FAF6F2]/30">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 max-w-[88%] sm:max-w-[80%] ${
                    isUser ? 'ml-auto flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-[#845460] text-white'
                        : 'bg-[#1B333F] text-[#EAD3CB] border border-[#2B4F60]'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-[#D98B6F]" />}
                  </div>

                  <div
                    className={`rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-[#845460] text-white rounded-tr-none'
                        : 'bg-white border border-[rgba(43,79,96,0.13)] text-[#1B333F] rounded-tl-none space-y-1'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div
                      className={`text-[9px] mt-1 font-mono text-right ${
                        isUser ? 'text-white/70' : 'text-[#8FA0A2]'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-center space-x-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-xl bg-[#1B333F] text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-[#D98B6F] animate-spin" />
                </div>
                <div className="bg-white border border-[rgba(43,79,96,0.13)] rounded-2xl rounded-tl-none p-3 text-xs text-[#5B6E75] flex items-center space-x-2 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#845460] animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-[#4F8683] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#D98B6F] animate-bounce [animation-delay:0.4s]"></span>
                  <span className="font-medium text-[11px] ml-1">Analyzing cash flow...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-[#FAF6F2]/80 border-t border-[rgba(43,79,96,0.08)] overflow-x-auto no-scrollbar flex items-center space-x-2">
            <span className="text-[10px] font-bold text-[#845460] uppercase tracking-wider shrink-0 flex items-center space-x-1">
              <Lightbulb className="w-3 h-3" />
              <span>Ask AI:</span>
            </span>
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isSending}
                className="bg-white hover:bg-[#EAD3CB]/40 text-[#1B333F] border border-[rgba(43,79,96,0.15)] px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition cursor-pointer hover:border-[#845460] active:scale-95 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[rgba(43,79,96,0.12)] flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={`Ask AI Advisor about your budget, savings, or spending in ${primaryCurrency}...`}
              disabled={isSending}
              className="flex-1 bg-[#FAF6F2] border border-[rgba(43,79,96,0.15)] rounded-xl px-3.5 py-2.5 text-xs text-[#1B333F] placeholder-[#8FA0A2] focus:outline-none focus:ring-2 focus:ring-[#2B4F60] transition"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim() || isSending}
              className="bg-[#2B4F60] hover:bg-[#1B333F] disabled:opacity-40 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition active:scale-95 cursor-pointer shrink-0"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5 text-[#EAD3CB]" />
            </button>
          </form>
        </div>
      )}

      {/* SUB-VIEW 2: Automated AI Audits & Insights Grid */}
      {activeSubTab === 'audits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#5B6E75] font-medium">
              Showing {insights.length} real-time spending anomalies and optimization recommendations:
            </p>

            <button
              onClick={handleRunAiAudit}
              disabled={loadingAudit}
              className="flex items-center space-x-1.5 bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#1B333F] border border-[rgba(43,79,96,0.15)] px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#2B4F60] ${loadingAudit ? 'animate-spin' : ''}`} />
              <span>Re-run Audit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => {
              const isWarning = insight.type === 'warning';
              const isSuccess = insight.type === 'success';

              return (
                <div
                  key={insight.id}
                  className={`bg-white border rounded-2xl p-5 shadow-[0_1px_2px_rgba(27,51,63,0.04),0_8px_24px_rgba(27,51,63,0.06)] space-y-3 relative overflow-hidden transition ${
                    isWarning
                      ? 'border-[#D98B6F]'
                      : isSuccess
                      ? 'border-[#4F8683]'
                      : 'border-[#2B4F60]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`p-2 rounded-xl text-sm ${
                          isWarning
                            ? 'bg-[#EAD3CB] text-[#6A414B]'
                            : isSuccess
                            ? 'bg-[#BDC7C9]/50 text-[#4F8683]'
                            : 'bg-[#FAF6F2] text-[#2B4F60]'
                        }`}
                      >
                        {isWarning ? <AlertTriangle className="w-5 h-5 text-[#D98B6F]" /> : isSuccess ? <CheckCircle2 className="w-5 h-5 text-[#4F8683]" /> : <Info className="w-5 h-5 text-[#2B4F60]" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-serif font-medium text-[#1B333F]">{insight.title}</h3>
                        <span className="text-[10px] text-[#5B6E75] uppercase font-mono">{insight.category}</span>
                      </div>
                    </div>

                    <span className="text-[10px] text-[#8FA0A2] font-mono">
                      {new Date(insight.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-[#22323A] leading-relaxed bg-[#FAF6F2] p-3 rounded-xl border border-[rgba(43,79,96,0.12)]">
                    {insight.description}
                  </p>

                  {insight.action && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => onApplyInsightAction && onApplyInsightAction(insight)}
                        className="flex items-center space-x-1.5 bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 text-[#2B4F60] font-semibold text-xs px-3 py-1.5 rounded-xl border border-[rgba(43,79,96,0.15)] transition cursor-pointer"
                      >
                        <span>{insight.action}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#845460]" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
