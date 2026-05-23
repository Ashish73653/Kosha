"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Plus,
  Coins,
  Calendar,
  CheckCircle,
  IndianRupee,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newIcon, setNewIcon] = useState("💰");
  const [newDate, setNewDate] = useState("");

  const [activeDepositId, setActiveDepositId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");

  // Fetch goals on mount
  useEffect(() => {
    fetch("/api/goals")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setGoals(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newTarget) return;

    const targetVal = Math.max(0, parseFloat(newTarget));

    fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        target: targetVal,
        icon: newIcon,
        date: newDate,
      }),
    })
      .then((res) => res.json())
      .then((newG) => {
        setGoals([...goals, newG]);
        setNewName("");
        setNewTarget("");
        setNewIcon("💰");
        setNewDate("");
        setShowAddForm(false);
      })
      .catch((err) => console.error("Failed to create goal:", err));
  };

  const handleDeposit = (id: string) => {
    if (!depositAmount) return;
    const amountVal = parseFloat(depositAmount);

    fetch("/api/goals", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, amount: amountVal }),
    })
      .then((res) => res.json())
      .then((updatedG) => {
        setGoals(goals.map((g) => (g.id === id ? updatedG : g)));
        setActiveDepositId(null);
        setDepositAmount("");
      })
      .catch((err) => console.error("Failed to deposit funds:", err));
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this savings goal?")) return;
    fetch(`/api/goals?id=${id}`, { method: "DELETE" })
      .then(() => {
        setGoals(goals.filter((g) => g.id !== id));
      })
      .catch((err) => console.error("Failed to delete goal:", err));
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Savings Goals</h2>
          <p className="text-muted-foreground text-sm mt-0.5">Grow your wealth and achieve milestones</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Goal
        </Button>
      </div>

      {/* Add Goal Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-5 border-border/60 bg-card/50 backdrop-blur-xl">
              <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Goal Name</label>
                  <Input
                    placeholder="e.g. New Car Fund"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className="bg-background/40 border-border/50 focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Target Amount (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newTarget}
                      onChange={(e) => setNewTarget(e.target.value)}
                      required
                      className="pl-9 bg-background/40 border-border/50 focus-visible:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">Emoji Icon</label>
                    <Input
                      placeholder="💰"
                      value={newIcon}
                      onChange={(e) => setNewIcon(e.target.value)}
                      className="bg-background/40 border-border/50 focus-visible:ring-indigo-500 text-center"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">Target Date</label>
                    <Input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="bg-background/40 border-border/50 focus-visible:ring-indigo-500 text-xs"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white border-0">
                    Create
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="border-border/50 hover:bg-accent/40"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-44 bg-muted/20 rounded shimmer" />
          <div className="h-44 bg-muted/30 rounded shimmer" />
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {goals.map((goal, i) => {
            const pct = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
            const isCompleted = goal.current >= goal.target;
            const isDepositing = activeDepositId === goal.id;

            return (
              <motion.div key={goal.id} variants={fadeInUp} custom={i}>
                <Card className="p-5 border-border/60 bg-card/30 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between h-full group hover:border-indigo-500/30 transition-all">
                  {/* Visual completion banner */}
                  {isCompleted && (
                    <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-bl-lg font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Completed
                    </div>
                  )}

                  <div>
                    {/* Top Row: Icon + Name */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-1 bg-background/50 rounded-xl border border-border/30 w-12 h-12 flex items-center justify-center">
                          {goal.icon}
                        </span>
                        <div>
                          <h4 className="font-bold text-foreground text-base">{goal.name}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3.5 h-3.5" /> Target: {goal.date || "No deadline"}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-indigo-400">
                        {pct.toFixed(0)}%
                      </span>
                    </div>

                    {/* Fund Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                        <span>Saved: {formatCurrency(goal.current)}</span>
                        <span>Target: {formatCurrency(goal.target)}</span>
                      </div>
                      <div className="relative h-2 bg-muted/40 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(pct, 100)}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Deposit Actions */}
                  <div className="border-t border-border/40 pt-3 mt-2 flex items-center justify-between">
                    {isDepositing ? (
                      <div className="flex gap-1.5 w-full items-center">
                        <div className="relative flex-1">
                          <IndianRupee className="absolute left-2 top-2 w-3.5 h-3.5 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            className="h-8 pl-6 pr-1 bg-background/50 text-xs"
                          />
                        </div>
                        <Button onClick={() => handleDeposit(goal.id)} size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                          Add
                        </Button>
                        <Button onClick={() => setActiveDepositId(null)} size="sm" variant="ghost" className="h-8 text-xs text-muted-foreground">
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs text-muted-foreground flex-1 min-w-0 truncate mr-2">
                          Remaining: <strong className="text-foreground">{formatCurrency(Math.max(0, goal.target - goal.current))}</strong>
                        </span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!isCompleted && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setActiveDepositId(goal.id)}
                              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 h-8 text-xs px-2"
                            >
                              <Coins className="w-3.5 h-3.5 mr-1" /> Add Funds
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(goal.id)}
                            className="text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 h-8 w-8 p-0 rounded-md"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
          {goals.length === 0 && (
            <div className="col-span-full p-8 text-center text-muted-foreground text-sm">
              No savings goals configured. Click &quot;Create Goal&quot; to set one up.
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
