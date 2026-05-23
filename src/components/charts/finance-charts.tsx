"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, TrendingUp, IndianRupee } from "lucide-react";

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 border border-white/10 shadow-xl">
      <p className="text-xs text-muted-foreground mb-1.5 font-medium">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-semibold text-foreground">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Loading Skeleton ──────────────────────────────────────────────────────────
function ChartSkeleton({ height = 240 }: { height?: number }) {
  return (
    <Card className="p-5 border-border/60">
      <div className="space-y-2 mb-6">
        <div className="h-4 w-1/4 bg-muted/60 rounded shimmer" />
        <div className="h-3 w-1/3 bg-muted/40 rounded shimmer" />
      </div>
      <div className="w-full bg-muted/20 rounded-xl shimmer" style={{ height }} />
    </Card>
  );
}

// ─── Cash Flow Area Chart ─────────────────────────────────────────────────────
export function CashFlowChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/charts")
      .then((res) => res.json())
      .then((d) => {
        if (d?.cashFlow) setData(d.cashFlow);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <ChartSkeleton height={240} />;

  const hasData = data.some((d) => d.income > 0 || d.expenses > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="p-5 border-border/60 relative overflow-hidden h-full">
        <div className="mb-4">
          <h3 className="font-semibold text-foreground">Cash Flow</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Income vs Expenses — Last 6 months</p>
        </div>

        {hasData ? (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 10%)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#incomeGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#10B981", strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#6366F1"
                strokeWidth={2}
                fill="url(#expenseGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#6366F1", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[240px] flex flex-col items-center justify-center bg-muted/10 rounded-xl border border-dashed border-border/60 p-4">
            <IndianRupee className="w-8 h-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-semibold text-foreground">No cash flow data</p>
            <p className="text-xs text-muted-foreground mt-1 text-center max-w-[240px]">
              Add some income or expense transactions to populate the cashflow graph.
            </p>
          </div>
        )}

        {hasData && (
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Income
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Expenses
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

// ─── Spending by Category Pie ──────────────────────────────────────────────────
export function SpendingByCategoryChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/charts")
      .then((res) => res.json())
      .then((d) => {
        if (d?.spendingByCategory) setData(d.spendingByCategory);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <ChartSkeleton height={180} />;

  const hasData = data.length > 0 && data[0].value > 0;
  const totalVal = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="p-5 border-border/60 h-full">
        <div className="mb-4">
          <h3 className="font-semibold text-foreground">Spending Breakdown</h3>
          <p className="text-xs text-muted-foreground mt-0.5">This month by category</p>
        </div>

        {hasData ? (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.9} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0];
                    return (
                      <div className="glass rounded-xl px-3 py-2 border border-white/10">
                        <p className="text-xs font-semibold">{d.name}</p>
                        <p className="text-sm font-bold" style={{ color: d.payload.color }}>
                          {formatCurrency(d.value as number)}
                        </p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5 w-full">
              {data.map((item) => {
                const pct = totalVal > 0 ? ((item.value / totalVal) * 100).toFixed(0) : "0";
                return (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground flex-1 truncate">{item.name}</span>
                    <span className="text-xs font-semibold text-foreground">{formatCurrency(item.value)}</span>
                    <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-[180px] flex flex-col items-center justify-center bg-muted/10 rounded-xl border border-dashed border-border/60 p-4">
            <BarChart3 className="w-7 h-7 text-muted-foreground/60 mb-2" />
            <p className="text-xs font-semibold text-foreground">No spending recorded</p>
            <p className="text-[10px] text-muted-foreground mt-1 text-center max-w-[200px]">
              Categories will populate automatically as you add expenses.
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

// ─── Monthly Bar Chart ────────────────────────────────────────────────────────
export function MonthlyExpensesChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/charts")
      .then((res) => res.json())
      .then((d) => {
        if (d?.cashFlow) {
          const barData = d.cashFlow.map((cf: any) => ({
            month: cf.name,
            amount: cf.expenses,
          }));
          setData(barData);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <ChartSkeleton height={180} />;

  const hasData = data.some((d) => d.amount > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="p-5 border-border/60 h-full">
        <div className="mb-4">
          <h3 className="font-semibold text-foreground">Monthly Expenses</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Last 6 months trend</p>
        </div>

        {hasData ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 10%)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[180px] flex flex-col items-center justify-center bg-muted/10 rounded-xl border border-dashed border-border/60 p-4">
            <TrendingUp className="w-7 h-7 text-muted-foreground/60 mb-2" />
            <p className="text-xs font-semibold text-foreground">No monthly trend</p>
            <p className="text-[10px] text-muted-foreground mt-1 text-center max-w-[200px]">
              Add expense transactions to chart your monthly spending history.
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
