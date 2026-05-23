"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Percent,
  Calendar,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { CashFlowChart, SpendingByCategoryChart, MonthlyExpensesChart } from "@/components/charts/finance-charts";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Financial Analytics</h2>
          <p className="text-muted-foreground text-sm mt-0.5">Deep insights into your cashflow and spending habits</p>
        </div>
      </div>

      {/* Analytics Insights Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { title: "Avg. Transaction Size", value: "₹450", desc: "For the last 30 days", icon: Zap, color: "text-indigo-400", bg: "bg-indigo-500/10" },
          { title: "Peak Spending Day", value: "Friday", desc: "Usually between 6 PM - 9 PM", icon: Calendar, color: "text-purple-400", bg: "bg-purple-500/10" },
          { title: "Savings Rate Trend", value: "+4.2%", desc: "Increase from last month", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { title: "Fixed Costs Ratio", value: "48%", desc: "Of total monthly spending", icon: Percent, color: "text-rose-400", bg: "bg-rose-500/10" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.title} variants={fadeInUp} custom={i}>
              <Card className="p-4 border-border/60 bg-card/30 backdrop-blur-xl h-full flex flex-col justify-between hover:border-indigo-500/20 transition-all">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.title}</span>
                  <div className={`p-1.5 rounded-lg ${item.bg}`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowChart />
        </div>
        <div>
          <SpendingByCategoryChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyExpensesChart />

        {/* Dynamic Insights Panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="p-6 border-border/60 bg-card/30 backdrop-blur-xl h-full relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-purple-950/10 to-transparent pointer-events-none" />
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-foreground">Smart Insights</h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">Subscriptions Under Control</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Your subscription spending decreased by ₹1,000 this month after removing inactive memberships.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                    <ArrowDownRight className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">Food & Dining Threshold</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      You are close to exceeding your Food & Dining budget. Try cooking at home to save an estimated ₹1,500 next week.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <Info className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">Investments Matching Plan</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Your automatic investment contribution successfully compound-interest-hedged your monthly utility bills.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border/40 pt-4 mt-6 text-center text-xs text-muted-foreground">
              Insights update dynamically relative to transaction changes.
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
