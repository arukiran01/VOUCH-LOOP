-- ============================================================================
-- VouchLoop Peer-to-Peer Voucher & Gift Card Marketplace
-- Supabase / PostgreSQL Enterprise Database Schema
-- Currency: Indian Rupee (INR - ₹)
-- ============================================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create User KYC status enum
CREATE TYPE kyc_status_enum AS ENUM ('unverified', 'pending', 'verified', 'rejected');

-- Create Voucher status enum
CREATE TYPE voucher_status_enum AS ENUM ('pending_verification', 'active', 'sold', 'rejected', 'expired');

-- ==========================================
-- 1. USERS TABLE
-- ==========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    kyc_status kyc_status_enum NOT NULL DEFAULT 'unverified',
    kyc_document_url TEXT,
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    referred_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. WALLETS TABLE
-- ==========================================
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    escrow_balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. WALLET_TRANSACTIONS TABLE
-- ==========================================
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'voucher_sale', 'voucher_purchase', 'escrow_hold', 'escrow_release', 'refund')),
    status VARCHAR(50) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. VOUCHER_CATEGORIES TABLE
-- ==========================================
CREATE TABLE voucher_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 5. VOUCHERS TABLE (P2P LISTINGS)
-- ==========================================
CREATE TABLE vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand VARCHAR(150) NOT NULL,
    category_id INTEGER REFERENCES voucher_categories(id) ON DELETE SET NULL,
    value DECIMAL(10, 2) NOT NULL CHECK (value > 0),
    selling_price DECIMAL(10, 2) NOT NULL CHECK (selling_price >= 0 AND selling_price <= value),
    code VARCHAR(500) NOT NULL, -- Encrypted/Hidden until purchased
    pin VARCHAR(100), -- Encrypted/Hidden
    expiry_date DATE NOT NULL,
    status voucher_status_enum NOT NULL DEFAULT 'pending_verification',
    fraud_risk_score INTEGER DEFAULT 0 CHECK (fraud_risk_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 6. VOUCHER_ORDERS TABLE (ESCROW TRANSACTIONS)
-- ==========================================
CREATE TABLE voucher_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    voucher_id UUID NOT NULL REFERENCES vouchers(id),
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'escrow_locked' CHECK (status IN ('escrow_locked', 'completed', 'disputed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ==========================================
-- 7. REFERRALS TABLE
-- ==========================================
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reward DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 8. PAYMENTS TABLE (PHONEPE)
-- ==========================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    payment_method VARCHAR(100) NOT NULL DEFAULT 'PhonePe',
    phonepe_transaction_id VARCHAR(255) UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 9. WITHDRAWALS TABLE
-- ==========================================
CREATE TABLE withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    bank_account VARCHAR(255),
    upi_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Categories
INSERT INTO voucher_categories (name, icon) VALUES
('Shopping', 'shopping-bag'),
('Food & Dining', 'utensils'),
('Travel', 'plane'),
('Entertainment', 'film'),
('Electronics', 'smartphone'),
('Beauty', 'sparkles');
