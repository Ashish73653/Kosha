import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Currency Formatting ──────────────────────────────────────────────────────
export function formatCurrency(
  amount: number,
  currency = "INR",
  compact = false
): string {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  if (compact && Math.abs(amount) >= 1000) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ─── Date Formatting ─────────────────────────────────────────────────────────
export function formatDate(date: Date | string, format: "short" | "long" | "relative" = "short"): string {
  const d = new Date(date);

  if (format === "relative") {
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  if (format === "long") {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Percentage ───────────────────────────────────────────────────────────────
export function formatPercentage(value: number, decimals = 1): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

// ─── Clamping Progress ────────────────────────────────────────────────────────
export function clampProgress(value: number, max: number): number {
  return Math.min(Math.max((value / max) * 100, 0), 100);
}

// ─── Color from String ────────────────────────────────────────────────────────
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 65%, 55%)`;
}

// ─── Transaction Color ────────────────────────────────────────────────────────
export function getTransactionColor(type: string): string {
  switch (type) {
    case "INCOME":
      return "text-emerald-400";
    case "EXPENSE":
      return "text-rose-400";
    case "TRANSFER":
      return "text-sky-400";
    default:
      return "text-muted-foreground";
  }
}

// ─── Random ID ────────────────────────────────────────────────────────────────
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// ─── Debounce ─────────────────────────────────────────────────────────────────
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
