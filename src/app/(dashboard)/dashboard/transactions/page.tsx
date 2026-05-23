"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Coffee,
  ShoppingBag,
  Home,
  Car,
  TrendingUp,
  Trash2,
  Tag,
  Briefcase,
  IndianRupee,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const categories = ["All", "Food", "Income", "Shopping", "Housing", "Transport", "Utilities", "Other"];

const categoryIcons: Record<string, any> = {
  Food: Coffee,
  Income: TrendingUp,
  Shopping: ShoppingBag,
  Housing: Home,
  Transport: Car,
  Utilities: Trash2,
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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);

  // New Transaction Form State
  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState("Food");
  const [newType, setNewType] = useState("expense");

  // Fetch transactions from database on mount
  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTransactions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter Logic
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === "all" || tx.type === selectedType;
    const matchesCategory = selectedCategory === "All" || tx.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc || !newAmount) return;

    const parsedAmount = Math.abs(parseFloat(newAmount));
    const finalAmount = newType === "expense" ? -parsedAmount : parsedAmount;

    fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parsedAmount,
        type: newType,
        description: newDesc,
        category: newCategory,
      }),
    })
      .then((res) => res.json())
      .then((newTx) => {
        setTransactions([newTx, ...transactions]);
        setNewDesc("");
        setNewAmount("");
        setShowAddForm(false);
      })
      .catch((err) => console.error("Failed to add transaction:", err));
  };

  const handleDelete = (id: string) => {
    fetch(`/api/transactions?id=${id}`, { method: "DELETE" })
      .then(() => {
        setTransactions(transactions.filter((t) => t.id !== id));
      })
      .catch((err) => console.error("Failed to delete transaction:", err));
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transactions</h2>
          <p className="text-muted-foreground text-sm mt-0.5">Manage and track your cashflow details</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Add Transaction Form Panel */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-5 border-border/60 bg-card/60 backdrop-blur-xl">
              <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Description</label>
                  <Input
                    placeholder="e.g. Netflix Subscription"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    required
                    className="bg-background/40 border-border/50 focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Amount (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      required
                      className="pl-9 bg-background/40 border-border/50 focus-visible:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">Type</label>
                    <Select value={newType} onValueChange={(val) => val && setNewType(val)}>
                      <SelectTrigger className="bg-background/40 border-border/50">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">Category</label>
                    <Select value={newCategory} onValueChange={(val) => val && setNewCategory(val)}>
                      <SelectTrigger className="bg-background/40 border-border/50">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c !== "All").map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white border-0">
                    Save
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

      {/* Filters Bar */}
      <Card className="p-4 border-border/60 bg-card/40 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Box */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/30 border-border/40 focus-visible:ring-indigo-500 w-full"
            />
          </div>

          <div className="flex flex-row gap-2 w-full md:w-auto">
            {/* Filter by Type */}
            <div className="w-1/2 md:w-36">
              <Select value={selectedType} onValueChange={(val) => val && setSelectedType(val)}>
                <SelectTrigger className="bg-background/30 border-border/40 w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expenses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter by Category */}
            <div className="w-1/2 md:w-40">
              <Select value={selectedCategory} onValueChange={(val) => val && setSelectedCategory(val)}>
                <SelectTrigger className="bg-background/30 border-border/40 w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <Card className="border-border/60 overflow-hidden">
        {loading ? (
          <div className="p-12 space-y-4">
            <div className="h-6 w-full bg-muted/30 rounded shimmer" />
            <div className="h-6 w-full bg-muted/20 rounded shimmer" />
            <div className="h-6 w-full bg-muted/30 rounded shimmer" />
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/20 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="p-4">Transaction</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Amount</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => {
                    const Icon = categoryIcons[tx.category] || Tag;
                    const color = categoryColors[tx.category] || "#6B7280";
                    const isIncome = tx.amount > 0;
                    return (
                      <tr key={tx.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
                            >
                              <Icon className="w-4 h-4" style={{ color }} />
                            </div>
                            <span className="font-medium text-foreground text-sm">{tx.description}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className="bg-muted/40 text-muted-foreground border-0 text-xs px-2 py-0.5">
                            {tx.category}
                          </Badge>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">
                          {formatDate(new Date(tx.date), "long")}
                        </td>
                        <td className={`p-4 text-right font-bold text-sm ${isIncome ? "text-emerald-400" : "text-foreground"}`}>
                          {isIncome ? "+" : ""}{formatCurrency(tx.amount)}
                        </td>
                        <td className="p-4 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(tx.id)}
                            className="text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 w-8 h-8 rounded-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View Stack (Responsive) */}
            <div className="block md:hidden divide-y divide-border/20">
              {filteredTransactions.map((tx) => {
                const Icon = categoryIcons[tx.category] || Tag;
                const color = categoryColors[tx.category] || "#6B7280";
                const isIncome = tx.amount > 0;
                return (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{tx.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <span>{tx.category}</span>
                          <span>•</span>
                          <span>{formatDate(new Date(tx.date), "relative")}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-sm ${isIncome ? "text-emerald-400" : "text-foreground"}`}>
                        {isIncome ? "+" : ""}{formatCurrency(tx.amount)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(tx.id)}
                        className="text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 w-8 h-8 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              {filteredTransactions.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No transactions found.
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
