"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  ArrowUpRight,
  Coffee,
  ShoppingBag,
  Home,
  Car,
  Plus,
  ArrowDownRight,
  Tag,
  Briefcase,
  Zap,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { CashFlowChart, SpendingByCategoryChart, MonthlyExpensesChart } from "@/components/charts/finance-charts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { staggerContainer } from "@/lib/animations";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const categoryIcons: Record<string, any> = {
  Food: Coffee,
  Income: TrendingUp,
  Shopping: ShoppingBag,
  Housing: Home,
  Transport: Car,
  Utilities: Zap,
  Other: Tag,
};

const categoryColors: Record<string, string> = {
  Food: "#F59E0B",
  Income: "#10B981",
  Shopping: "#6366F1",
  Housing: "#EC4899",
  Transport: "#0EA5E9",
  Utilities: "#EF4444",
  Other: "#6B7280",
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard summary stats from API
  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="h-10 w-1/4 bg-muted/30 rounded shimmer" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-28 bg-muted/20 rounded shimmer" />
          <div className="h-28 bg-muted/30 rounded shimmer" />
          <div className="h-28 bg-muted/20 rounded shimmer" />
          <div className="h-28 bg-muted/30 rounded shimmer" />
        </div>
        <div className="h-64 bg-muted/10 rounded shimmer" />
      </div>
    );
  }

  const stats = data?.stats || {
    netWorth: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0,
    incomeChange: 0,
    expenseChange: 0,
  };

  const recentTransactions = data?.recentTransactions || [];
  const budgets = data?.budgets || [];
  const goals = data?.goals || [];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground">Good evening, Kosha 👋</h2>
          <p className="text-muted-foreground text-sm mt-0.5">Here&apos;s your live financial overview</p>
        </div>
        <Button
          size="sm"
          onClick={() => router.push("/dashboard/transactions")}
          className="hidden sm:flex bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Transaction
        </Button>
      </motion.div>

      {/* ── Stat Cards ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Net Worth"
          value={stats.netWorth}
          prefix="₹"
          decimals={0}
          icon={TrendingUp}
          iconColor="text-indigo-400"
          iconBg="bg-indigo-500/10"
          gradient="linear-gradient(135deg, #6366F1, #8B5CF6)"
        />
        <StatCard
          title="Monthly Income"
          value={stats.monthlyIncome}
          prefix="₹"
          decimals={0}
          change={stats.incomeChange}
          icon={Wallet}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          gradient="linear-gradient(135deg, #10B981, #059669)"
        />
        <StatCard
          title="Monthly Expenses"
          value={stats.monthlyExpenses}
          prefix="₹"
          decimals={0}
          change={stats.expenseChange}
          icon={TrendingDown}
          iconColor="text-rose-400"
          iconBg="bg-rose-500/10"
          gradient="linear-gradient(135deg, #F43F5E, #E11D48)"
        />
        <StatCard
          title="Savings Rate"
          value={stats.savingsRate}
          suffix="%"
          decimals={1}
          icon={Target}
          iconColor="text-sky-400"
          iconBg="bg-sky-500/10"
          gradient="linear-gradient(135deg, #0EA5E9, #0284C7)"
        />
      </motion.div>

      {/* ── Charts Row ── */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CashFlowChart />
        </div>
        <SpendingByCategoryChart />
      </div>

      {/* ── Bottom Section ── */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="p-5 border-border/60 h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">Recent Transactions</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Last 5 transactions</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/transactions")}
                className="text-xs text-primary hover:text-primary"
              >
                View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="space-y-1">
              {recentTransactions.map((tx: any, i: number) => {
                const Icon = categoryIcons[tx.category] || Tag;
                const color = categoryColors[tx.category] || "#6B7280";
                const isIncome = tx.amount > 0;
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.06 }}
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer group"
                    onClick={() => router.push("/dashboard/transactions")}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(new Date(tx.date), "relative")}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-sm font-bold", isIncome ? "text-emerald-400" : "text-foreground")}>
                        {isIncome ? "+" : ""}{formatCurrency(tx.amount)}
                      </p>
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 border-0 bg-muted/60"
                      >
                        {tx.category}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
              {recentTransactions.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No recent transactions. Add some in the Transactions tab!
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Side Column */}
        <div className="space-y-4">
          {/* Budget Overview */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="p-5 border-border/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-sm">Budgets</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/dashboard/budgets")}
                  className="text-xs text-primary hover:text-primary h-auto p-0"
                >
                  Manage
                </Button>
              </div>
              <div className="space-y-3.5">
                {budgets.map((budget: any, i: number) => {
                  const pct = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
                  const isWarning = pct > 80;
                  const color = categoryColors[budget.name] || "#6366F1";
                  return (
                    <motion.div
                      key={budget.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 + i * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-foreground">{budget.name}</span>
                        <span className={cn("text-xs font-semibold", isWarning ? "text-amber-400" : "text-muted-foreground")}>
                          {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                        </span>
                      </div>
                      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="absolute left-0 top-0 h-full rounded-full"
                          style={{ backgroundColor: isWarning ? "#F59E0B" : color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(pct, 100)}%` }}
                          transition={{ delay: 0.8 + i * 0.05, duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
                {budgets.length === 0 && (
                  <div className="text-center text-muted-foreground text-xs p-4">
                    No budgets configured.
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Savings Goals */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="p-5 border-border/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-sm">Goals</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/dashboard/goals")}
                  className="text-xs text-primary hover:text-primary h-auto p-0"
                >
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {goals.map((goal: any, i: number) => {
                  const pct = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                  return (
                    <motion.div
                      key={goal.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.07 }}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="text-lg">{goal.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{goal.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                          </p>
                        </div>
                        <span className="text-xs font-bold" style={{ color: goal.color }}>
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="absolute left-0 top-0 h-full rounded-full"
                          style={{ backgroundColor: goal.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(pct, 100)}%` }}
                          transition={{ delay: 0.9 + i * 0.07, duration: 0.9, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
                {goals.length === 0 && (
                  <div className="text-center text-muted-foreground text-xs p-4">
                    No savings goals set.
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Monthly Expenses Bar Chart */}
      <div className="grid lg:grid-cols-2 gap-4">
        <MonthlyExpensesChart />

        {/* Net Worth Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="p-5 border-border/60 h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-48 h-48 orb bg-indigo-600/10 -mr-16 -mt-16" />

            <div className="relative z-10">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1">Net Worth</p>
              <p className="text-4xl font-bold gradient-text mb-1">{formatCurrency(stats.netWorth)}</p>
              <div className="flex items-center gap-2 mb-6">
                <span className={stats.incomeChange >= 0 ? "text-emerald-400 text-sm font-semibold flex items-center gap-1" : "text-rose-400 text-sm font-semibold flex items-center gap-1"}>
                  {stats.incomeChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />} 
                  {stats.incomeChange >= 0 ? "+" : ""}{stats.incomeChange.toFixed(0)}%
                </span>
                <span className="text-muted-foreground text-xs">this month</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Assets", value: formatCurrency(stats.netWorth > 0 ? stats.netWorth : 0), color: "text-emerald-400", bg: "bg-emerald-500/10" },
                  { label: "Liabilities", value: formatCurrency(stats.netWorth < 0 ? Math.abs(stats.netWorth) : 0), color: "text-rose-400", bg: "bg-rose-500/10" },
                  { label: "Monthly Income", value: formatCurrency(stats.monthlyIncome), color: "text-sky-400", bg: "bg-sky-500/10" },
                  { label: "Monthly Expenses", value: formatCurrency(stats.monthlyExpenses), color: "text-amber-400", bg: "bg-amber-500/10" },
                ].map((item) => (
                  <div key={item.label} className={`${item.bg} rounded-xl p-3`}>
                    <p className="text-muted-foreground text-xs mb-1">{item.label}</p>
                    <p className={`font-bold text-sm ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Mobile FAB */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.8, stiffness: 400, damping: 25 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push("/dashboard/transactions")}
        className="lg:hidden fixed bottom-24 right-4 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
}
