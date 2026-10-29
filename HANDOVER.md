# BudFit - Project Handover Document

**Project Name:** BudFit  
**Subtitle:** AI Financial Command & Liquidity Guard  
**Last Updated:** August 2026  

---

## 1. Executive Summary

**BudFit** is a full-stack, AI-enhanced personal financial management platform tailored for modern professionals, freelancers, and multi-currency users. It delivers real-time cash flow visibility, intelligent liquidity alerts, automated transaction categorization, subscription audit tools, algorithmic multi-goal optimization, social accountability, and Gemini AI-driven financial coaching.

---

## 2. Key Architecture & Tech Stack

- **Frontend Framework:** React 18 with Vite
- **Styling & Design System:** Tailwind CSS v4, Lucide React Icons, warm-neutral luxury aesthetic (`#FAF6F2` canvas, `#2B4F60` deep slate-teal, `#845460` mauve/plum accents, `#D98B6F` warm terracotta) with Playfair Display headings and Plus Jakarta Sans body typography
- **Data Visualization:** Recharts for analytics, spending breakdowns, and weekly category trends
- **Backend Runtime:** Node.js Express server (`server.ts`) bundled with `esbuild`
- **AI Integration:** `@google/genai` (Server-side Gemini API) for personalized spending plans, AI financial coaching, and smart receipt OCR parsing
- **Data & Persistence Engine:** 
  - `BackupManager`: LocalStorage persistence with JSON import/export and auto-seed fallback
  - Multi-Currency FX Engine (EGP, USD, EUR, SAR) with live/mock rate conversions
  - Archetype Engine (`archetypes.ts`) supporting preset profiles (e.g., Tech Freelancer, Corporate Executive) and custom user questionnaire setups

---

## 3. Application Navigation Structure

The main navigation bar is organized in the following order:

1. **Dashboard** (`/overview`): Financial health score, net worth tracking, monthly spending ceiling, quick actions, and recent activity.
2. **My AI Plan** (`/ai-plan`): Personalized AI spending plan with weekly/monthly category budgets and recommended financial growth instruments (Treasury Bills, High-Yield Savings, Gold Certificates).
3. **Cash Flow Calendar** (`/calendar`): Interactive daily/monthly timeline mapping upcoming bills, subscription renewals, and income entries.
4. **Analytics** (`/breakdown`): Detailed category spending analysis, merchant distributions, and historical trends.
5. **Ledger** (`/ledger`): Transaction history ledger with multi-column filtering, category tags, search, and manual transaction controls.
6. **Saving Plan** (`/goals`): Multi-goal tracker with an embedded **Algorithmic Multi-Goal Optimizer** (Goal-Weighted, Debt-First Tapered, Equal Split).
7. **Accounts & Wallets** (`/accounts`): Account & digital wallet manager with an embedded **Banking Feeds** sub-tab for open banking API sync (InstaPay, Telda, CIB, NBE, Vodafone Cash).
8. **Subscriptions** (`/subscriptions`): Subscription audit view tracking recurring services, spending impact, and cancellation recommendations.
9. **What-If Simulator** (`/simulator`): Scenario simulator testing financial changes (income adjustments, major purchases, subscription drops).
10. **AI Advisor** (`/ai-insights`): Generative AI financial assistant for custom queries, cash flow advisory, and risk detection.

---

## 4. Quick Access Header Actions

- **Community Hub Modal** (`Users` Icon): Quick-access header button opening the Community Hub overlay for milestone progress updates, financial tips, community claps/boosts, and group accountability sprints (*30-Day Coffee Shop Cap*, *Subscription Purge Sprint*, *50k Emergency Buffer Sprint*).
- **Spending Wrapped** (`Gift` Icon): Annual financial review ("Wrapped '26") showcasing top merchants, budget streaks, and milestone achievements.
- **Smart Receipt OCR** (`Camera` Icon): AI-powered receipt scanning modal parsing merchant, date, total amount, and line items.
- **Rules & Auto-Categorization**: Custom transaction keyword auto-categorization rules manager.
- **Settings & Archetype Selector**: Currency configuration, dark mode toggle, and persona switching.

---

## 5. Core Modules & Component Directory

| Module / Component | Location | Description |
| :--- | :--- | :--- |
| **Navbar** | `src/components/Navbar.tsx` | Main top navigation bar with tab routing, FX ticker, archetype switcher, and quick header action buttons. |
| **Overview Dashboard** | `src/components/OverviewDashboard.tsx` | Central command dashboard displaying net worth, monthly spending vs ceiling, health score, and recent transactions. |
| **Personalized AI Plan** | `src/components/PersonalizedSpendingPlanView.tsx` | AI-generated weekly and monthly budget breakdown with category limits and strategy recommendations. |
| **Cash Flow Calendar** | `src/components/CashFlowCalendar.tsx` | Interactive calendar mapping upcoming bills, subscription renewals, and salary inflows. |
| **Enhanced Analytics** | `src/components/EnhancedSpendingBreakdown.tsx` | Visual breakdown of spending categories, merchant stats, and income vs expense ratios. |
| **Spending Ledger** | `src/components/SpendingLedger.tsx` | Transaction ledger with search, category filtering, tag management, and add transaction controls. |
| **Financial Goals** | `src/components/FinancialGoals.tsx` | Savings and debt payoff goal manager with progress bars, deposit modal, and multi-goal optimization. |
| **Multi-Goal Optimizer** | `src/components/MultiGoalOptimizer.tsx` | Mathematical allocation algorithm auto-distributing monthly savings across multiple active goals. |
| **Account Dashboard** | `src/components/AccountDashboard.tsx` | Multi-account manager for bank accounts and digital wallets with an integrated Banking Feeds sub-tab. |
| **Open Banking View** | `src/components/OpenBankingView.tsx` | Open banking & Egyptian fintech feed connector for automated sync with InstaPay, Telda, CIB, NBE, and Vodafone Cash. |
| **Subscription Audit** | `src/components/SubscriptionAuditView.tsx` | Subscription manager tracking active recurring bills, usage frequency, and potential savings. |
| **Scenario Simulator** | `src/components/ScenarioSimulator.tsx` | Interactive "What-If" financial projection engine for simulating life events and spending shifts. |
| **AI Advisor** | `src/components/AISpendingInsights.tsx` | Gemini-powered financial coach delivering proactive liquidity alerts and customized recommendations. |
| **Community Hub & Modal** | `src/components/CommunityHub.tsx` / `CommunityModal.tsx` | Social accountability hub for sharing milestones, financial tips, and participating in group sprints. |
| **Smart Receipt OCR** | `src/components/SmartReceiptOcrModal.tsx` | Receipt upload and camera capture modal using Gemini vision AI to auto-extract transaction details. |
| **Onboarding Questionnaire**| `src/components/OnboardingQuestionnaire.tsx` | 4-step wizard setting up user profile, income, spending limits, subscriptions, and financial goals. |
| **Auth Screen** | `src/components/AuthScreen.tsx` | Login and signup screen with quick profile demo switcher and account onboarding launch. |

---

## 6. Recent Refinements & Fixes

1. **Onboarding & Setup Flow Enhancements:**
   - **AI Loading & Analysis Screen:** Built an animated AI analysis screen after Step 3 with live progress bar (0-100%) and real-time checklist indicators auditing cash flow, debt interest schedules, subscriptions, and category caps.
   - **Plan Allocation Review & Edit:** Added interactive live editing capability on Step 4 allowing users to customize weekly/monthly spending limits and individual category allocations before dashboard launch.
   - **Multiple Debts & Major Purchases:** Added "+ Add Another Debt / Loan" and "+ Add Another Major Purchase" controls so users can configure multiple loans or purchase targets with automatic aggregate calculations.
   - **Equal Sized Wizard Navigation Buttons:** Standardized navigation controls across all wizard steps with identical dimensions and styles for "Previous" and "Continue / Generate / Finish" buttons.
   - **Stock Investments & Portfolio Assets Goal:** Added "Stock Investments & Portfolio Assets" goal option (`stock_investments`) with inputs for portfolio target, asset mix (US Stocks, EGX, ETFs, Gold), timeframe, and expected yield.
   - **Multiple Goal Selection:** Enabled multi-selecting financial goals in Step 2 with multi-goal aggregation into dashboard goals and spending plan synthesis.
2. **Monthly & Yearly Spending Wrapped:**
   - Enhanced `SpendingWrappedModal.tsx` with a mode switcher toggle for **Monthly Wrap** (with dropdown month selector) and **Yearly Wrap**, providing customized story slides, top category, top merchant, and net retained savings.
3. **Header Layout & Logo Clean-Up:**
   - Removed the `v2.0` tag next to the `budfit` logo in `Navbar.tsx` to ensure all action controls and the **Logout** button fit comfortably without layout wrapping or text truncation.
4. **Page Tab Re-Ordering:**
   - Re-ordered navigation tabs to strictly match the requested sequence: *Dashboard*, *My AI Plan*, *Cashflow Calendar*, *Analytics*, *Ledger*, *Saving Plan*, *Accounts & Wallets*, *Subscriptions*, *What-If Simulator*, *AI Advisor*.
5. **Embedded Banking Feeds & Community Header Icon:**
   - Integrated Open Banking feeds into a sub-tab inside *Accounts & Wallets*.
   - Added a header icon button opening the Community Hub overlay modal (`CommunityModal.tsx`).

---

## 7. Development & Build Commands

- **Development Server:** `npm run dev` (Runs Express server + Vite middleware on port 3000)
- **Production Build:** `npm run build` (Bundles client SPA and compiles server entry to `dist/server.cjs` via esbuild)
- **Production Start:** `npm start` (Runs `node dist/server.cjs`)
- **Lint Verification:** `npm run lint` (TypeScript compilation check)

---

## 8. Handover Summary

All applet components build cleanly without TypeScript or linter errors. The user interface adheres to a warm, sophisticated neutral design, responsive layout, and full functionality across all 10 core views and overlay tools.
