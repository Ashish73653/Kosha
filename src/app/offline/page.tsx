"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WifiOff, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="text-center max-w-md"
      >
        <motion.div variants={scaleIn} className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-muted/50 border border-border/50 flex items-center justify-center">
            <WifiOff className="w-10 h-10 text-muted-foreground" />
          </div>
        </motion.div>

        <motion.h1 variants={fadeInUp} className="text-3xl font-bold text-foreground mb-3">
          You&apos;re Offline
        </motion.h1>

        <motion.p variants={fadeInUp} className="text-muted-foreground mb-8 leading-relaxed">
          It seems you&apos;ve lost your internet connection. Don&apos;t worry — your financial data
          is safely cached and will sync when you&apos;re back online.
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="border-border/50">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
