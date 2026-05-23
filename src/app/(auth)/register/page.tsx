"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles, ArrowRight, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const name = (e.currentTarget.querySelector("#name") as HTMLInputElement)?.value || "";
    const email = (e.currentTarget.querySelector("#email") as HTMLInputElement)?.value || "";
    const password = (e.currentTarget.querySelector("#password") as HTMLInputElement)?.value || "";

    try {
      // 1. Send register request
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // 2. Auto login
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created, but automatic sign-in failed. Please log in manually.");
        setLoading(false);
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4 py-12">
      <div className="absolute top-1/3 right-1/4 w-64 h-64 orb bg-purple-600/15 animate-[pulse-glow_4s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/3 left-1/4 w-48 h-48 orb bg-indigo-600/10 animate-[pulse-glow_5s_ease-in-out_infinite_1.5s]" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl">
          <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">Kosha</span>
          </motion.div>

          <motion.div variants={fadeInUp} className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
            <p className="text-muted-foreground text-sm mt-1">Start your financial journey today — free forever</p>
          </motion.div>

          {error && (
            <motion.div
              variants={fadeInUp}
              className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-medium"
            >
              {error}
            </motion.div>
          )}

          <motion.form variants={staggerContainer} onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={fadeInUp} className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="name" placeholder="Alex Johnson" className="pl-9 h-11 bg-muted/30 border-border/50" />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-9 h-11 bg-muted/30 border-border/50" />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="pl-9 pr-10 h-11 bg-muted/30 border-border/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/25 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>Create Account <ArrowRight className="ml-2 w-4 h-4" /></>
                )}
              </Button>
            </motion.div>
          </motion.form>

          <motion.p variants={fadeInUp} className="mt-4 text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </motion.p>

          <motion.p variants={fadeInUp} className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
