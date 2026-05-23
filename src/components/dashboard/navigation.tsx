"use client";

import { useState, useEffect, ComponentType } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowUpDown,
  Target,
  PieChart,
  CreditCard,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  Bell,
  Search,
  Sun,
  Moon,
  LogOut,
  User,
  Wallet,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface NavigationItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  shortLabel?: string;
  badge?: number | string;
}

const navItems: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/dashboard/transactions", icon: ArrowUpDown },
  { label: "Budgets", href: "/dashboard/budgets", icon: Target },
  { label: "Goals", href: "/dashboard/goals", icon: Wallet },
  { label: "Subscriptions", href: "/dashboard/subscriptions", icon: CreditCard, shortLabel: "Subs" },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

const bottomItems: NavigationItem[] = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
}

export function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 border-r border-border/60 bg-sidebar overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border/40 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="ml-2.5 font-bold text-lg gradient-text whitespace-nowrap"
            >
              Kosha
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse Toggle */}
      <div className={cn("px-2 pt-3 pb-2", collapsed ? "flex justify-center" : "flex justify-end")}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCollapse(!collapsed)}
          className="w-7 h-7 rounded-md hover:bg-accent"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
        </Button>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 2 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "relative flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-colors cursor-pointer group",
                  collapsed && "justify-center",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <Icon className={cn("w-5 h-5 flex-shrink-0 relative z-10", isActive && "text-primary")} />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium relative z-10 flex-1 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {!collapsed && item.badge && (
                  <Badge className="relative z-10 bg-primary/20 text-primary border-0 text-[10px] px-1.5 py-0.5 h-auto">
                    {item.badge}
                  </Badge>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="px-2 pb-4 space-y-0.5 border-t border-border/40 pt-3">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 2 }}
                className={cn(
                  "flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-colors cursor-pointer",
                  collapsed && "justify-center",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.aside>
  );
}

// ─── Top Navigation Bar ────────────────────────────────────────────────────────
interface TopNavProps {
  sidebarCollapsed: boolean;
  title: string;
  onSearchClick?: () => void;
}

interface DbNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function TopNav({ sidebarCollapsed, title, onSearchClick }: TopNavProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<DbNotification[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    const savedRead = localStorage.getItem("kosha_read_notifications");
    let initialReadIds: string[] = [];
    if (savedRead) {
      try {
        initialReadIds = JSON.parse(savedRead);
      } catch (e) {
        console.error(e);
      }
    }
    
    setTimeout(() => {
      setMounted(true);
      if (initialReadIds.length > 0) {
        setReadIds(initialReadIds);
      }
    }, 0);

    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch((err) => console.error("Failed to fetch notifications:", err));
  }, []);

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    const newReadIds = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(newReadIds);
    localStorage.setItem("kosha_read_notifications", JSON.stringify(newReadIds));
  };

  const markAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      const newReadIds = [...readIds, id];
      setReadIds(newReadIds);
      localStorage.setItem("kosha_read_notifications", JSON.stringify(newReadIds));
    }
  };

  const isDark = theme === "dark";

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 border-b border-border/60 bg-background/80 backdrop-blur-xl flex items-center px-4 gap-4 transition-all duration-300",
        "left-0",
        sidebarCollapsed ? "lg:left-[72px]" : "lg:left-[240px]"
      )}
    >
      {/* Title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-foreground lg:block hidden">{title}</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <Button
          variant="outline"
          size="sm"
          onClick={onSearchClick}
          className="hidden md:flex items-center gap-2 w-56 justify-start text-muted-foreground border-border/50 bg-muted/30 hover:bg-muted/60"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs">Search... </span>
          <kbd className="ml-auto text-[10px] bg-background border border-border rounded px-1.5 py-0.5">⌘K</kbd>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative w-9 h-9 p-0 rounded-full flex items-center justify-center hover:bg-accent transition-colors text-foreground">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-[8px] font-bold text-white flex items-center justify-center border-2 border-background">
                {unreadCount}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2 max-h-[360px] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground px-2 py-1.5 border-b border-border/40 mb-1">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    markAllAsRead();
                  }}
                  className="text-[10px] text-primary hover:underline cursor-pointer bg-transparent border-0 p-0"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="space-y-1">
              {notifications.map((n) => {
                const isRead = readIds.includes(n.id);
                return (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={cn(
                      "text-xs p-2.5 rounded-lg flex flex-col gap-0.5 transition-colors cursor-pointer",
                      isRead ? "hover:bg-accent/30 opacity-70" : "bg-primary/5 hover:bg-primary/10 border-l-2 border-primary"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn("font-semibold text-foreground", !isRead && "font-bold text-primary")}>
                        {n.title}
                      </span>
                      {!isRead && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                    </div>
                    <span className="text-muted-foreground text-[10px] leading-relaxed">{n.message}</span>
                  </div>
                );
              })}
              {notifications.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-6">
                  No new notifications.
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="w-9 h-9"
        >
          {mounted ? (
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="w-4 h-4" />
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="w-9 h-9 p-0 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
            <Avatar className="w-8 h-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                KU
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="cursor-pointer">
              <User className="w-4 h-4 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// ─── Mobile Bottom Nav ─────────────────────────────────────────────────────────
export function MobileBottomNav() {
  const pathname = usePathname();
  const mobileItems = navItems.slice(0, 5);

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 35, delay: 0.2 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/10 safe-bottom"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {mobileItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-colors min-w-[52px]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveNav"
                      className="absolute inset-0 -m-2 bg-primary/15 rounded-xl"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.shortLabel || item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
