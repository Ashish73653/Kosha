"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Download,
  Moon,
  Sun,
  Laptop,
  Mail,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface CustomWindow extends Window {
  deferredPrompt?: {
    prompt: () => void;
    userChoice: Promise<{ outcome: string }>;
  } | null;
}
// ..
export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [weeklySummaries, setWeeklySummaries] = useState(false);
  const [securityMfa, setSecurityMfa] = useState(false);

  const [installable, setInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isStandaloneMode = window.matchMedia("(display-mode: standalone)").matches ||
        !!(window.navigator as Navigator & { standalone?: boolean }).standalone;
      const hasPrompt = !!(window as CustomWindow & typeof globalThis).deferredPrompt;

      setTimeout(() => {
        if (isStandaloneMode) {
          setIsStandalone(true);
        }
        if (hasPrompt) {
          setInstallable(true);
        }
      }, 0);

      const handleInstallable = () => setInstallable(true);
      const handleInstalled = () => {
        setInstallable(false);
        setIsStandalone(true);
      };

      window.addEventListener("pwa-installable", handleInstallable);
      window.addEventListener("appinstalled", handleInstalled);

      return () => {
        window.removeEventListener("pwa-installable", handleInstallable);
        window.removeEventListener("appinstalled", handleInstalled);
      };
    }
  }, []);

  const handleInstallApp = async () => {
    const promptEvent = (window as CustomWindow & typeof globalThis).deferredPrompt;
    if (!promptEvent) return;
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    console.log(`PWA installation outcome: ${outcome}`);
    (window as CustomWindow & typeof globalThis).deferredPrompt = null;
    setInstallable(false);
  };

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.name) setName(data.name);
        if (data.email) setEmail(data.email);
        if (data.currency) setCurrency(data.currency);
      })
      .catch((err) => {
        console.error("Failed to load user settings:", err);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, currency }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Settings saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`Error: ${data.error || "Failed to save"}`);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setMessage(`Error: ${error.message || "Something went wrong"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    // Generate dummy transactions file for download
    const exportData = {
      user: { name, email, currency },
      exportedAt: new Date().toISOString(),
      transactions: [
        { description: "Morning Coffee", amount: -4.50, category: "Food" },
        { description: "Salary Deposit", amount: 5200.00, category: "Income" },
        { description: "Amazon Purchase", amount: -89.99, category: "Shopping" },
        { description: "Rent Payment", amount: -1800.00, category: "Housing" },
        { description: "Uber Ride", amount: -24.50, category: "Transport" },
      ]
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kosha_financial_data_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground text-sm mt-0.5">Customize your profile, preferences, and security</p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Profile Settings */}
        <motion.div variants={fadeInUp}>
          <Card className="p-5 border-border/60 bg-card/30 backdrop-blur-xl">
            <div className="flex items-center gap-2.5 mb-5 border-b border-border/40 pb-3">
              <User className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-foreground text-base">Profile Details</h3>
            </div>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/40 border-border/50 focus-visible:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-background/40 border-border/50 focus-visible:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Primary Currency</label>
                <Select value={currency} onValueChange={(val) => val && setCurrency(val)}>
                  <SelectTrigger className="bg-background/40 border-border/50">
                    <SelectValue placeholder="INR" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 md:col-span-2 gap-2">
                <span className={cn("text-xs font-semibold", message.startsWith("Error") ? "text-rose-400" : "text-emerald-400")}>
                  {message}
                </span>
                <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 px-6 w-full sm:w-auto">
                  {saving ? "Saving..." : "Save Details"}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Display Settings */}
        <motion.div variants={fadeInUp}>
          <Card className="p-5 border-border/60 bg-card/30 backdrop-blur-xl">
            <div className="flex items-center gap-2.5 mb-5 border-b border-border/40 pb-3">
              <Sun className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-foreground text-base">Display Preferences</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm text-foreground">Color Theme</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Choose how Kosha appears on your device</p>
              </div>
              <div className="flex gap-2 bg-background/50 border border-border/40 rounded-xl p-1 w-full sm:w-auto">
                {[
                  { name: "light", icon: Sun, label: "Light" },
                  { name: "dark", icon: Moon, label: "Dark" },
                  { name: "system", icon: Laptop, label: "System" },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = theme === t.name;
                  return (
                    <button
                      key={t.name}
                      onClick={() => setTheme(t.name)}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                          : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notifications Settings */}
        <motion.div variants={fadeInUp}>
          <Card className="p-5 border-border/60 bg-card/30 backdrop-blur-xl">
            <div className="flex items-center gap-2.5 mb-5 border-b border-border/40 pb-3">
              <Bell className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-foreground text-base">Notification Preferences</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Budget Alerts</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Notify me when I reach 80% or 100% of my budgets</p>
                </div>
                <Switch checked={budgetAlerts} onCheckedChange={setBudgetAlerts} />
              </div>
              <div className="flex items-center justify-between border-t border-border/20 pt-4">
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Weekly Summaries</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Receive a weekly email breakdown of spending and saving progress</p>
                </div>
                <Switch checked={weeklySummaries} onCheckedChange={setWeeklySummaries} />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Security & Data Settings */}
        <motion.div variants={fadeInUp}>
          <Card className="p-5 border-border/60 bg-card/30 backdrop-blur-xl">
            <div className="flex items-center gap-2.5 mb-5 border-b border-border/40 pb-3">
              <Shield className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-foreground text-base">Security & Data Management</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Two-Factor Authentication (2FA)</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Enhance account security with MFA codes</p>
                </div>
                <Switch checked={securityMfa} onCheckedChange={setSecurityMfa} />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/20 pt-4">
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Export Financial Data</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Download your financial transactions and profile data as JSON</p>
                </div>
                <Button
                  onClick={handleExportData}
                  variant="outline"
                  className="border-border/50 hover:bg-accent/40 w-full sm:w-auto"
                >
                  <Download className="w-4 h-4 mr-2 text-indigo-400" /> Export Data
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Application Setup (PWA Install Card) */}
        <motion.div variants={fadeInUp}>
          <Card className="p-5 border-border/60 bg-card/30 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-purple-950/10 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2.5 mb-5 border-b border-border/40 pb-3">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-foreground text-base">Application Setup</h3>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-sm text-foreground">
                  {isStandalone ? "Kosha App Installed ✅" : "Install Kosha App"}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isStandalone
                    ? "You are currently running the native PWA version of Kosha with full offline support."
                    : "Install Kosha directly on your device home screen for fullscreen access, faster load times, and offline support."}
                </p>
              </div>
              {!isStandalone && (
                <Button
                  onClick={handleInstallApp}
                  disabled={!installable}
                  className={cn(
                    "border-0 px-6 w-full sm:w-auto text-white font-semibold transition-all",
                    installable
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <Download className="w-4 h-4 mr-2" /> {installable ? "Install App" : "Installer Ready"}
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
