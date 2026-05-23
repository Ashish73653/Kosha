"use client";

import { useEffect, useState, useRef, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  ArrowUpDown,
  Target,
  Wallet,
  CreditCard,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Sparkles,
  Command,
  Download,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommandItem {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  category: "Navigation" | "Actions" | "Preferences";
  action: () => void;
  shortcut?: string[];
}

const handleExportData = (onOpenChange: (open: boolean) => void) => {
  const exportData = {
    exportedAt: new Date().toISOString(),
    transactions: [
      { description: "Morning Coffee", amount: -4.50, category: "Food" },
      { description: "Salary Deposit", amount: 5200.00, category: "Income" },
      { description: "Amazon Purchase", amount: -89.99, category: "Shopping" },
    ]
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `kosha_backup_${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  onOpenChange(false);
};

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle Command Palette with Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setSearch("");
        setSelectedIndex(0);
        inputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  const commands: CommandItem[] = [
    // Navigation
    { id: "nav-dash", label: "Go to Dashboard", icon: LayoutDashboard, category: "Navigation", action: () => { router.push("/dashboard"); onOpenChange(false); } },
    { id: "nav-tx", label: "Go to Transactions", icon: ArrowUpDown, category: "Navigation", action: () => { router.push("/dashboard/transactions"); onOpenChange(false); } },
    { id: "nav-budgets", label: "Go to Budgets", icon: Target, category: "Navigation", action: () => { router.push("/dashboard/budgets"); onOpenChange(false); } },
    { id: "nav-goals", label: "Go to Savings Goals", icon: Wallet, category: "Navigation", action: () => { router.push("/dashboard/goals"); onOpenChange(false); } },
    { id: "nav-subs", label: "Go to Subscriptions", icon: CreditCard, category: "Navigation", action: () => { router.push("/dashboard/subscriptions"); onOpenChange(false); } },
    { id: "nav-analytics", label: "Go to Analytics", icon: BarChart3, category: "Navigation", action: () => { router.push("/dashboard/analytics"); onOpenChange(false); } },
    { id: "nav-settings", label: "Go to Settings", icon: Settings, category: "Navigation", action: () => { router.push("/dashboard/settings"); onOpenChange(false); } },

    // Actions
    { id: "action-export", label: "Export Financial Data (JSON)", icon: Download, category: "Actions", action: () => handleExportData(onOpenChange) },

    // Preferences
    { id: "pref-dark", label: "Switch to Dark Mode", icon: Moon, category: "Preferences", action: () => { setTheme("dark"); onOpenChange(false); } },
    { id: "pref-light", label: "Switch to Light Mode", icon: Sun, category: "Preferences", action: () => { setTheme("light"); onOpenChange(false); } },
    { id: "pref-sys", label: "Switch to System Theme", icon: Settings, category: "Preferences", action: () => { setTheme("system"); onOpenChange(false); } },
  ];

  // Filtering
  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  // Keyboard navigation inside list
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredCommands, selectedIndex]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/70 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            ref={containerRef}
            className="relative w-full max-w-[600px] mx-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden flex flex-col h-[400px]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 border-b border-border/40 h-14 flex-shrink-0">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none border-none py-3"
              />
              <Badge variant="secondary" className="bg-muted/50 text-[10px] text-muted-foreground flex gap-0.5 items-center px-1.5 py-0.5 border-0">
                <Command className="w-3 h-3" />
                <span>K</span>
              </Badge>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
              {filteredCommands.length > 0 ? (
                // Group commands by category
                ["Navigation", "Actions", "Preferences"].map((cat) => {
                  const items = filteredCommands.filter((cmd) => cmd.category === cat);
                  if (items.length === 0) return null;

                  return (
                    <div key={cat} className="space-y-1 mb-3">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 py-1">
                        {cat}
                      </p>
                      {items.map((cmd) => {
                        const globalIdx = filteredCommands.findIndex((c) => c.id === cmd.id);
                        const isSelected = globalIdx === selectedIndex;
                        const Icon = cmd.icon;

                        return (
                          <div
                            key={cmd.id}
                            onClick={() => cmd.action()}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors text-sm",
                              isSelected
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/40 border border-transparent"
                            )}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium flex-1">{cmd.label}</span>
                            {isSelected && (
                              <Badge variant="secondary" className="bg-primary/20 text-[10px] text-primary border-0 px-1.5 py-0 h-auto">
                                Enter
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                  <Sparkles className="w-8 h-8 mb-2 text-indigo-400/50" />
                  <p className="text-sm">No commands found matching &quot;{search}&quot;</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 h-10 border-t border-border/40 bg-muted/20 flex-shrink-0 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                Use <kbd className="border border-border/60 px-1 rounded">↑↓</kbd> to navigate, <kbd className="border border-border/60 px-1 rounded">Enter</kbd> to select
              </span>
              <span>ESC to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
