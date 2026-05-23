"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { cn } from "@/lib/utils";
import { scaleIn } from "@/lib/animations";

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  gradient?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  prefix = "",
  suffix = "",
  decimals = 2,
  change,
  changeLabel = "vs last month",
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  gradient,
  delay = 0,
}: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <motion.div
      variants={scaleIn}
      custom={delay}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group"
    >
      <Card className={cn(
        "relative overflow-hidden border-border/60 bg-card p-5 h-full",
        "transition-shadow duration-300",
        "hover:shadow-lg hover:shadow-primary/5"
      )}>
        {/* Background gradient */}
        {gradient && (
          <div
            className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
            style={{ background: gradient }}
          />
        )}

        {/* Top Row */}
        <div className="flex items-center justify-between mb-2 relative z-10">
          <p className="text-muted-foreground text-[10px] sm:text-xs font-semibold uppercase tracking-widest truncate mr-2">
            {title}
          </p>
          <div className={cn("w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0", iconBg)}>
            <Icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", iconColor)} />
          </div>
        </div>

        {/* Value */}
        <div className="text-lg sm:text-2xl font-extrabold text-foreground mb-2 relative z-10 truncate">
          <AnimatedCounter
            value={value}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
          />
        </div>

        {/* Change indicator */}
        {change !== undefined && (
          <div className="flex items-center gap-1.5 relative z-10">
            <div className={cn(
              "flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full",
              isPositive
                ? "text-emerald-400 bg-emerald-500/10"
                : "text-rose-400 bg-rose-500/10"
            )}>
              {isPositive
                ? <TrendingUp className="w-3 h-3" />
                : <TrendingDown className="w-3 h-3" />
              }
              {isPositive ? "+" : ""}{change.toFixed(1)}%
            </div>
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
