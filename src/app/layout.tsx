import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PWARegister } from "@/components/providers/pwa-register";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Kosha — Personal Finance",
    template: "%s | Kosha",
  },
  description:
    "Premium personal finance management. Track expenses, manage budgets, set savings goals, and grow your wealth with beautiful insights.",
  keywords: [
    "personal finance",
    "expense tracker",
    "budget management",
    "savings goals",
    "net worth",
    "financial dashboard",
  ],
  authors: [{ name: "Kosha" }],
  creator: "Kosha",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kosha",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kosha.app",
    title: "Kosha — Personal Finance",
    description: "Premium personal finance management with beautiful insights.",
    siteName: "Kosha",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kosha — Personal Finance",
    description: "Premium personal finance management with beautiful insights.",
  },
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png", sizes: "32x32" },
      { url: "/icons/icon-192x192.png", sizes: "192x192" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180" },
    ],
    shortcut: "/icons/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366F1" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A1A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <TooltipProvider>
            {children}
            <PWARegister />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
