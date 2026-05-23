"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Sidebar, TopNav, MobileBottomNav } from "@/components/dashboard/navigation";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { pageTransition } from "@/lib/animations";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/transactions": "Transactions",
  "/dashboard/budgets": "Budgets",
  "/dashboard/goals": "Savings Goals",
  "/dashboard/subscriptions": "Subscriptions",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings": "Settings",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />

      {/* Top Navigation */}
      <TopNav
        sidebarCollapsed={collapsed}
        title={title}
        onSearchClick={() => setCommandPaletteOpen(true)}
      />

      {/* Command Palette */}
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300 pt-16 pb-20 lg:pb-6 min-h-screen",
          "lg:pl-[240px]",
          collapsed && "lg:pl-[72px]"
        )}
      >
        <motion.div
          key={pathname}
          variants={pageTransition}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="h-full p-4 sm:p-6 lg:p-8"
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </div>
  );
}
