# ClipX SaaS MVP

ClipX is an AI-powered SaaS that turns long-form videos into viral, short-form clips. This repository contains the MVP implemented exactly according to the requirements, architecture, and design specifications.

## Features

- **Futuristic & Premium UI**: Built with Next.js 14+, Tailwind CSS, and shadcn/ui. Features Apple-like glassmorphism, precise blur utilities, dark theme by default, and `lucide-react` icons.
- **Authentication**: Fully implemented Supabase Auth with Row Level Security (RLS) policies. Includes Login, Signup, Password Reset, and secure sessions via Next.js Middleware.
- **Credit System**: A server-side secure credit system tracking balances per user with ledger history. Implements free tier monthly refills and deducts credits for processing vs exporting.
- **Billing & Subscriptions**: Stripe integrated APIs for checkouts, customer billing portal, and Webhooks handling subscription events asynchronously.
- **Jobs & Processing Architecture**: Robust API layer including `/api/jobs/create` and mock background worker hooks. Safe inputs validation via `zod`.
- **Full Dashboard Lifecycle**:
  - App Overview
  - Clips Gallery & Editor
  - Pricing & Account Settings
  - Global Upgrade triggers

## Tech Stack

- **Framework**: Next.js 16.x App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS (custom dark theme, borders, layout)
- **UI Components**: `shadcn/ui` + `framer-motion` (implied base) + `lucide-react`
- **Database + Auth**: Supabase
- **Payments**: Stripe

## Getting Started

### 1. Configure Environment Variables
Copy `.env.example` to `.env` and fill out your keys:
```bash
cp .env.example .env.local
```
You will need:
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`

### 2. Database Setup
The database schema migration is located in `supabase/migrations/001_schema.sql`.
Run this SQL script in your Supabase SQL editor to create all required tables, Enable RLS, and set up the Auth Triggers.

### 3. Install and Run
```bash
# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

You're ready to go viral! 🚀
