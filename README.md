# Kosha 💎 — Premium Personal Finance Web App

A futuristic, premium personal finance management app built with the latest web technologies.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com)

---

## ✨ Features

- 📊 **Financial Dashboard** — Real-time overview with animated charts
- 💰 **Transaction Tracking** — Income, expenses, and transfers
- 🎯 **Budget Management** — Smart budgets with visual progress tracking
- 🏆 **Savings Goals** — Set and track financial milestones
- 💳 **Subscription Tracker** — Never miss a recurring charge
- 📈 **Analytics** — Deep spending pattern insights
- 🌍 **Net Worth Tracking** — Assets, liabilities, and investments
- 🔄 **Recurring Payments** — Automated tracking
- 🌙 **Dark / Light Mode** — Premium themes
- 📱 **PWA** — Install on Android/iOS, works offline

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animations | Framer Motion 12 |
| 3D | React Three Fiber + Three.js |
| Database | SQLite (dev) / PostgreSQL (prod) + Prisma 7 |
| Auth | NextAuth.js v5 |
| Charts | Recharts 3 |
| State | Zustand |
| PWA | Custom Service Worker |
| Deployment | Vercel |

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd kosha

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Generate Prisma client & migrate database
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Demo Login
Use the demo button on the login page — any email/password works in dev mode.

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login & Register pages
│   ├── (dashboard)/      # Protected dashboard routes
│   ├── api/              # API routes
│   ├── offline/          # PWA offline fallback
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── manifest.ts       # PWA manifest
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard components
│   ├── charts/           # Recharts wrappers
│   ├── three/            # Three.js / R3F components
│   ├── shared/           # Shared components
│   └── providers/        # Context providers
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── db.ts             # Prisma client
│   ├── utils.ts          # Utility functions
│   └── animations.ts     # Framer Motion variants
└── types/
    └── index.ts          # TypeScript types
```

## 🌐 Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel dashboard
3. Set environment variables:
   - `DATABASE_URL` — PostgreSQL connection string
   - `AUTH_SECRET` — Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` — Your production URL
4. Deploy!

For production PostgreSQL, update `prisma/schema.prisma` datasource provider to `postgresql` and update `prisma.config.ts` with your PostgreSQL URL.

## 🎨 Design System

The Kosha design system is built on:
- **Colors**: Electric Indigo (#6366F1) primary, Emerald accent, Space Dark background
- **Typography**: Inter (variable font)
- **Glass**: Backdrop blur + transparency layers
- **Animations**: 60fps GPU-accelerated via Framer Motion
- **3D**: Ambient particle fields via React Three Fiber

## 📱 PWA Installation

- **Android**: Open in Chrome → "Add to Home Screen"
- **iOS**: Open in Safari → Share → "Add to Home Screen"

---

Built with ♥ by the Kosha team.
