"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Plus,
  Tv,
  Music,
  Cloud,
  Code,
  Trash2,
  Calendar,
  Sparkles,
  IndianRupee,
  Info,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const serviceIcons: Record<string, any> = {
  Netflix: Tv,
  Spotify: Music,
  AWS: Cloud,
  GitHub: Code,
  iCloud: Cloud,
};

const serviceColors: Record<string, string> = {
  Netflix: "#E50914",
  Spotify: "#1DB954",
  AWS: "#FF9900",
  GitHub: "#6366F1",
  iCloud: "#0EA5E9",
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newInterval, setNewInterval] = useState("monthly");
  const [newCategory, setNewCategory] = useState("Entertainment");
  const [newDate, setNewDate] = useState("");

  // Fetch subscriptions from database on mount
  useEffect(() => {
    fetch("/api/subscriptions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSubscriptions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAmount) return;

    const amountVal = Math.max(0, parseFloat(newAmount));

    fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        amount: amountVal,
        interval: newInterval,
        date: newDate,
        category: newCategory,
      }),
    })
      .then((res) => res.json())
      .then((newSub) => {
        setSubscriptions([...subscriptions, newSub]);
        setNewName("");
        setNewAmount("");
        setNewDate("");
        setShowAddForm(false);
      })
      .catch((err) => console.error("Failed to add subscription:", err));
  };

  const handleDelete = (id: string) => {
    fetch(`/api/subscriptions?id=${id}`, { method: "DELETE" })
      .then(() => {
        setSubscriptions(subscriptions.filter((s) => s.id !== id));
      })
      .catch((err) => console.error("Failed to delete subscription:", err));
  };

  // Calculate total monthly spending on subscriptions
  const totalMonthlyCost = subscriptions.reduce((sum, sub) => {
    if (sub.interval === "yearly") {
      return sum + sub.amount / 12;
    }
    return sum + sub.amount;
  }, 0);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Subscriptions</h2>
          <p className="text-muted-foreground text-sm mt-0.5">Keep track of your recurring services and bills</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Subscription
        </Button>
      </div>

      {/* Subscription Analytics Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6 border-border/60 bg-card/40 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-purple-950/10 to-transparent pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Total Monthly Cost</p>
              <h3 className="text-3xl font-extrabold text-indigo-400">{formatCurrency(totalMonthlyCost)}</h3>
              <p className="text-xs text-muted-foreground">
                Equates to {formatCurrency(totalMonthlyCost * 12)} per year
              </p>
            </div>
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 justify-around border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-6">
              <div className="text-center sm:text-left">
                <p className="text-xs text-muted-foreground mb-1">Active Subscriptions</p>
                <p className="text-xl font-bold text-foreground">{subscriptions.length}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs text-muted-foreground mb-1">Avg Subscription Cost</p>
                <p className="text-xl font-bold text-foreground">
                  {subscriptions.length > 0 ? formatCurrency(totalMonthlyCost / subscriptions.length) : formatCurrency(0)}
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs text-muted-foreground mb-1">Next Payment Due</p>
                <p className="text-xl font-bold text-foreground flex items-center justify-center sm:justify-start gap-1">
                  <Calendar className="w-4 h-4 text-indigo-400" /> June 1st
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Add Subscription Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-5 border-border/60 bg-card/50 backdrop-blur-xl">
              <form onSubmit={handleAddSubscription} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Service Name</label>
                  <Input
                    placeholder="e.g. Netflix, AWS"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className="bg-background/40 border-border/50 focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Cost (₹)</label>
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
                <div className="grid grid-cols-2 gap-2 md:col-span-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">Billing Cycle</label>
                    <Select value={newInterval} onValueChange={(val) => val && setNewInterval(val)}>
                      <SelectTrigger className="bg-background/40 border-border/50">
                        <SelectValue placeholder="Interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">Billing Date</label>
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
                    Add
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

      {/* Subscriptions Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-36 bg-muted/20 rounded shimmer" />
          <div className="h-36 bg-muted/30 rounded shimmer" />
          <div className="h-36 bg-muted/20 rounded shimmer" />
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {subscriptions.map((sub, i) => {
            const iconName = Object.keys(serviceIcons).find(k => sub.name.toLowerCase().includes(k.toLowerCase())) || "Default";
            const Icon = serviceIcons[iconName] || CreditCard;
            const color = serviceColors[iconName] || "#8B5CF6";

            return (
              <motion.div key={sub.id} variants={fadeInUp} custom={i}>
                <Card className="p-5 border-border/60 bg-card/30 backdrop-blur-xl h-full flex flex-col justify-between hover:border-indigo-500/30 transition-all relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 -mr-12 -mt-12 rounded-full blur-2xl pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
                        >
                          <Icon className="w-5 h-5" style={{ color }} />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-sm">{sub.name}</h4>
                          <Badge variant="secondary" className="bg-muted/40 text-[10px] text-muted-foreground border-0 px-1.5 py-0 h-auto">
                            {sub.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-base text-foreground">{formatCurrency(sub.amount)}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">per {sub.interval === "monthly" ? "month" : "year"}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 bg-background/30 p-2.5 rounded-xl border border-border/30">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Next Billing:
                        </span>
                        <span className="text-foreground font-semibold">{sub.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/40 pt-3 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Info className="w-3 h-3 text-indigo-400" /> Automatic renew
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(sub.id)}
                      className="text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 h-8 rounded-md"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
          {subscriptions.length === 0 && (
            <div className="col-span-full p-8 text-center text-muted-foreground text-sm">
              No active subscriptions. Click &quot;Add Subscription&quot; to register one.
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
