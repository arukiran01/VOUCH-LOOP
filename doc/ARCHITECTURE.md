# VouchLoop Full-Stack Architecture Guide

This document outlines the architecture for deploying VouchLoop across platforms as requested (Flutter for Mobile, React for Web, Supabase for backend, PhonePe for Payments, Gemini for AI).

## 1. Tech Stack Overview

- **Mobile Frontend:** Flutter (Dart) using GetX or Riverpod for State Management.
- **Web Frontend:** React (TypeScript) with Tailwind CSS (Current environment setup).
- **Backend & Database:** Supabase (PostgreSQL, Auth, Storage).
- **AI Integration:** Google AI Studio (Gemini 1.5 Pro/Flash).
- **Payment Gateway:** PhonePe Business API.
- **Push Notifications:** Firebase Cloud Messaging (FCM).

## 2. API Architecture (Supabase)

Supabase handles the core API layer. Below is the mapping:

### Authentication (Supabase Auth)
- Mobile OTP / Email / Google OAuth.
- JWT session is sent to PhonePe and internal functions.
- Supabase RLS (Row Level Security) restricts user data access.

### Core Database (PostgreSQL)
The schema has been mapped explicitly in `supabase_schema.sql` at the root of the project, including:
- `users`: Core profile and wallet linking.
- `wallets` & `wallet_transactions`: Double-entry accounting for tracking wallet balance.
- `offers` & `gift_cards`: Main catalogue tables.
- `referrals`: Table linking `referrer_id` and `referred_user` with rewards tracking.
- `withdrawals`: Ledger for UPI and Bank withdrawals.

## 3. PhonePe Integration Flow

1. **Top Up Request:** User enters amount and selects Top Up.
2. **Server-Side Signature:** Supabase Edge Function creates PhonePe payload (`merchantId`, `transactionId`, `amount`, `callbackUrl`).
3. **App Redirect:** User redirects to the PhonePe UPI Intent / Web gateway.
4. **Webhook:** PhonePe triggers Supabase Webhook (Edge Function) with `X-VERIFY` hash.
5. **Wallet Credited:** If successful, Edge function verifies X-VERIFY hash, updates `payments` table, inserts into `wallet_transactions`, and increases `wallets.balance`.

## 4. Wallet System Architecture

- **Cashback Engine:** When a user clicks an offer, create tracking link. When tracking pixel fires (via affiliate network), credit `pending` cashback. After return period (30-90 days), change to `completed`.
- **Referral Engine:** Whenever a referred user transaction status changes to `completed`, calculate 10% commission, and credit referrer's wallet.
- **Withdrawals:** Deduct from wallet immediately and mark status as `processing`. Admin verifies and initiates payout via PhonePe Payouts API.

## 5. Gemini AI Integration (Google AI Studio)

- **Use Case:** Shopping Assistant, Deal recommendations, Customer Support.
- **Implementation:** 
  - Define custom system instructions for Gemini: *"You are VouchLoop AI. Only suggest current database offers."*
  - Use **Function Calling** (Tools) to allow Gemini to execute `search_offers_by_category` or `get_highest_cashback()`.
  *(In the current React build, this is simulated using the AIAssistant widget component in `/src/components/AIAssistant.tsx`)*.

## 6. Security & Folder Structure (Flutter)

```
lib/
├── core/
│   ├── network/ (Supabase clients, PhonePe Interceptors)
│   ├── theme/
│   ├── utils/
├── data/
│   ├── models/
│   ├── repositories/
├── features/
│   ├── auth/ (Login, OTP)
│   ├── home/ (Dashboard, AI widgets)
│   ├── wallet/ (Withdraw, Passbook)
│   ├── referrals/
│   ├── stores/
└── main.dart
```

### Security implementation
- **Row Level Security (RLS) in Supabase:**
  - `wallets`: `SELECT`, `UPDATE` only where `auth.uid() == user_id`.
  - `wallet_transactions`: `SELECT` where `auth.uid() == user_id`. Insertions allowed only via secure Supabase Edge Functions.
- **API Keys:** PhonePe Secrets and Gemini API Keys must NEVER be exposed in the frontend. All logic resides in Supabase Edge Functions.

## 7. Production Deployment Guide

**Web (React):**
- Deploy via Vercel, Netlify, or Firebase Hosting.
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

**Mobile (Flutter):**
- Use Fastlane for CD/CI.
- Android: Build `.aab` for Play Store.
- iOS: Build `.ipa` for App Store.
- App configurations in `Info.plist` (iOS) and `AndroidManifest.xml` (Android).
