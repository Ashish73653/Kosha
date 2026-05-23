"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Plus,
  Coffee,
  ShoppingBag,
  Home,
  Car,
  Film,
  Zap,
  Edit2,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const categoryIcons: Record<string, any> = {
  "Food & Dining": Coffee,
  "Shopping": ShoppingBag,
  "Transport": Car,
  "Entertainment": Film,
  "Utilities": Zap,
  "Housing": Home,
};

const categoryColors: Record<string, string> = {
  "Food & Dining": "#10B981",
  "Shopping": "#6366F1",
  "Transport": "#0EA5E9",
  "Entertainment": "#F59E0B",
  "Utilities": "#EF4444",
  "Housing": "#EC4899",
};

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLimit, setNewLimit] = useState("");

  // Fetch budgets from API on mount
  useEffect(() => {
    fetch("/api/budgets")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBudgets(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleStartEdit = (id: string, limit: number) => {
    setEditingId(id);
    setEditLimit(limit.toString());
  };

  const handleSaveEdit = (id: string, name: string) => {
    if (!editLimit) return;
    const newLimitVal = Math.max(0, parseFloat(editLimit));

    fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, limit: newLimitVal }),
    })
      .then((res) => res.json())
      .then((updatedB) => {
        setBudgets(budgets.map((b) => (b.id === id ? { ...b, limit: updatedB.limit } : b)));
        setEditingId(null);
      })
      .catch((err) => console.error("Failed to update budget:", err));
  };

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newLimit) return;

    const limitVal = Math.max(0, parseFloat(newLimit));
    const isExist = budgets.some((b) => b.name.toLowerCase() === newName.toLowerCase());
    if (isExist) {
      alert("Budget for this category already exists!");
      return;
    }

    fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, limit: limitVal }),
    })
      .then((res) => res.json())
      .then((newB) => {
        setBudgets([...budgets, newB]);
        setNewName("");
        setNewLimit("");
        setShowAddForm(false);
      })
      .catch((err) => console.error("Failed to create budget:", err));
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;
    fetch(`/api/budgets?id=${id}`, { method: "DELETE" })
      .then(() => {
        setBudgets(budgets.filter((b) => b.id !== id));
      })
      .catch((err) => console.error("Failed to delete budget:", err));
  };

  // Compute overall stats
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Budgets</h2>
          <p className="text-muted-foreground text-sm mt-0.5">Control your monthly spending limits</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Budget
        </Button>
      </div>

      {/* Overall Budget Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <Card className="p-6 border-border/60 bg-card/40 backdrop-blur-xl relative z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-purple-950/10 to-transparent pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Total Monthly Budget</p>
              <h3 className="text-3xl font-extrabold text-foreground">{formatCurrency(totalSpent)} / <span className="text-muted-foreground text-2xl font-medium">{formatCurrency(totalLimit)}</span></h3>
              <p className="text-xs text-muted-foreground">
                You have spent {overallPercentage.toFixed(1)}% of your monthly budget
              </p>
            </div>
            <div className="md:col-span-2 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Monthly Budget Progress</span>
                <span className={overallPercentage > 85 ? "text-rose-400 font-bold" : "text-indigo-400"}>
                  {overallPercentage.toFixed(0)}%
                </span>
              </div>
              <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(overallPercentage, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Create Budget Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-5 border-border/60 bg-card/50 backdrop-blur-xl">
              <form onSubmit={handleAddBudget} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Category Name</label>
                  <Select value={newName} onValueChange={(val) => val && setNewName(val)} required>
                    <SelectTrigger className="bg-background/40 border-border/50">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(categoryColors).map((name) => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Monthly Limit (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newLimit}
                      onChange={(e) => setNewLimit(e.target.value)}
                      required
                      className="pl-9 bg-background/40 border-border/50 focus-visible:ring-indigo-500"
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

      {/* Budgets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-40 bg-muted/20 rounded shimmer" />
          <div className="h-40 bg-muted/30 rounded shimmer" />
          <div className="h-40 bg-muted/20 rounded shimmer" />
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {budgets.map((budget, i) => {
            const Icon = categoryIcons[budget.name] || Target;
            const color = categoryColors[budget.name] || "#8B5CF6";
            const pct = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
            const isOver = pct >= 100;
            const isWarning = pct >= 80 && pct < 100;
            const isEditing = editingId === budget.id;

            return (
              <motion.div key={budget.id} variants={fadeInUp} custom={i}>
                <Card className="p-5 border-border/60 bg-card/30 backdrop-blur-xl h-full flex flex-col justify-between hover:border-indigo-500/30 transition-all relative overflow-hidden group">
                  {/* Floating warning indicator */}
                  {isOver && (
                    <div className="absolute top-0 right-0 bg-rose-500/20 text-rose-400 text-[10px] px-2 py-0.5 rounded-bl-lg font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Overlimit
                    </div>
                  )}
                  {isWarning && (
                    <div className="absolute top-0 right-0 bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded-bl-lg font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Critical (80%+)
                    </div>
                  )}

                  <div>
                    {/* Category Details */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm">{budget.name}</h4>
                        <p className="text-xs text-muted-foreground">Remaining: {formatCurrency(Math.max(0, budget.limit - budget.spent))}</p>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground font-medium">Spent: {formatCurrency(budget.spent)}</span>
                        <span className="text-foreground font-bold">{pct.toFixed(0)}%</span>
                      </div>
                      <div className="relative h-2 bg-muted/40 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute left-0 top-0 h-full rounded-full"
                          style={{
                            backgroundColor: isOver ? "#EF4444" : isWarning ? "#F59E0B" : color,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(pct, 100)}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Edit Form / Controls */}
                  <div className="border-t border-border/40 pt-3 flex items-center justify-between">
                    {isEditing ? (
                      <div className="flex gap-1.5 w-full items-center">
                        <div className="relative flex-1">
                          <IndianRupee className="absolute left-2 top-2 w-3.5 h-3.5 text-muted-foreground" />
                          <Input
                            type="number"
                            size={5}
                            value={editLimit}
                            onChange={(e) => setEditLimit(e.target.value)}
                            className="h-8 pl-6 pr-1 bg-background/50 text-xs"
                          />
                        </div>
                        <Button onClick={() => handleSaveEdit(budget.id, budget.name)} size="sm" className="h-8 bg-indigo-600 text-white text-xs">
                          Save
                        </Button>
                        <Button onClick={() => setEditingId(null)} size="sm" variant="ghost" className="h-8 text-xs text-muted-foreground">
                          X
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs text-muted-foreground">
                          Limit: <strong className="text-foreground">{formatCurrency(budget.limit)}</strong>
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartEdit(budget.id, budget.limit)}
                            className="text-muted-foreground hover:text-indigo-400 h-7 text-xs px-2"
                          >
                            <Edit2 className="w-3 h-3 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(budget.id)}
                            className="text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 h-7 w-7 p-0 rounded-md"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
          {budgets.length === 0 && (
            <div className="col-span-full p-8 text-center text-muted-foreground text-sm">
              No budgets configured. Click &quot;Create Budget&quot; to configure one.
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
