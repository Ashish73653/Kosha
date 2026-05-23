// ─── Core Types for Kosha Finance App ─────────────────────────────────────────

export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";
export type CategoryType = "INCOME" | "EXPENSE";
export type Period = "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
export type BillingCycle = "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
export type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELLED";

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: Date | string;
  categoryId: string | null;
  category?: Category | null;
  notes?: string | null;
  recurring: boolean;
  createdAt: Date | string;
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: Period;
  categoryId: string | null;
  category?: Category | null;
  startDate: Date | string;
  endDate?: Date | string | null;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date | string | null;
  icon: string;
  color: string;
  completed: boolean;
  createdAt: Date | string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  nextBillingDate: Date | string;
  category?: string | null;
  logo?: string | null;
  status: SubscriptionStatus;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  savingsRate: number;
  netWorth: number;
}

// ─── Chart Data ────────────────────────────────────────────────────────────────
export interface ChartDataPoint {
  name: string;
  value: number;
  income?: number;
  expenses?: number;
}

// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
