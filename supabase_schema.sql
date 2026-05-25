-- ============================================================================
-- CouponX Peer-to-Peer Coupon & Voucher Resale Marketplace
-- Supabase / PostgreSQL Enterprise Database Schema
-- Currency: Indian Rupee (INR - ₹)
-- ============================================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create User KYC status enum
CREATE TYPE kyc_status_enum AS ENUM ('unverified', 'pending', 'verified');

-- Create Coupon status enum
CREATE TYPE coupon_status_enum AS ENUM ('pending', 'active', 'sold', 'rejected');

-- Create Transaction type enum
CREATE TYPE transaction_type_enum AS ENUM ('purchase', 'withdrawal', 'deposit', 'payout', 'commission');

-- ==========================================
-- 1. USERS TABLE
-- ==========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    kyc_status kyc_status_enum NOT NULL DEFAULT 'unverified',
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    referred_by_code VARCHAR(50),
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. COUPON CATEGORIES TABLE
-- ==========================================
CREATE TABLE coupon_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. COUPONS TABLE (VOUCHERS)
-- ==========================================
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand VARCHAR(150) NOT NULL,
    category_id INTEGER REFERENCES coupon_categories(id) ON DELETE SET NULL,
    category_name VARCHAR(100) NOT NULL, -- Cached category name for fast reads
    code VARCHAR(500) NOT NULL, -- Masked/encrypted; visible only to verified buyer after escrow transaction
    description TEXT,
    discount_type VARCHAR(50) NOT NULL CHECK (discount_type IN ('flat', 'percentage')),
    discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value > 0),
    expiry_date DATE NOT NULL,
    terms TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0), -- Listed price in INR
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_name VARCHAR(255) NOT NULL,
    status coupon_status_enum NOT NULL DEFAULT 'pending',
    image_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    fraud_risk_score INTEGER DEFAULT 0 CHECK (fraud_risk_score BETWEEN 0 AND 100),
    risk_reason TEXT,
    recommended_price DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. TRANSACTIONS TABLE (LEDGER)
-- ==========================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    buyer_name VARCHAR(255),
    seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
    seller_name VARCHAR(255),
    coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
    coupon_brand VARCHAR(150),
    amount DECIMAL(15, 2) NOT NULL CHECK (amount >= 0), -- Total trade amount in ₹
    fee DECIMAL(15, 2) NOT NULL DEFAULT 0.00 CHECK (fee >= 0), -- Platform commission (typically 10% in INR)
    tx_type transaction_type_enum NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    reference_upi_or_bank VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 5. REVIEWS & RATINGS TABLE
-- ==========================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
    brand VARCHAR(150) NOT NULL,
    reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewer_name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 6. AUDIT LOGS TABLE (SECURITY COMPLIANCE)
-- ==========================================
CREATE TABLE system_audit_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(50) NOT NULL DEFAULT 'info' CHECK (level IN ('info', 'warning', 'error')),
    event_message TEXT NOT NULL,
    module VARCHAR(100) NOT NULL,
    triggered_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- INDEXING FOR PERFORMANCE OPTIMIZATION
-- ==========================================
CREATE INDEX idx_coupons_status ON coupons(status);
CREATE INDEX idx_coupons_brand ON coupons(brand);
CREATE INDEX idx_coupons_category ON coupons(category_name);
CREATE INDEX idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX idx_transactions_seller ON transactions(seller_id);
CREATE INDEX idx_users_email ON users(email);

-- ==========================================
-- 7. SEED DATA (STANDARD INDIAN RETAILERS & DEALS)
-- ==========================================

-- Populate Categories
INSERT INTO coupon_categories (name, description) VALUES
('Shopping', 'E-commerce fashion, lifestyle, and electronic store vouchers'),
('Food', 'Online food order and restaurant vouchers (Zomato, Swiggy, etc.)'),
('Travel', 'Cab bookings, flights, hotel stays, and bus coupons'),
('Entertainment', 'Movie tickets, events, concert bookings, and activity vouchers'),
('Subscription', 'OTT platforms, music apps, courses, and digital subscriptions'),
('Health', 'Pharmacies, fitness passes, full-body health checkup cards');

-- Seed Users
INSERT INTO users (id, name, email, role, kyc_status, balance, referral_code, is_premium) VALUES
('8a12e3fb-ac21-4f35-9cd7-48f1ea21b8c1', 'Aruna Kiran', 'arukiranreddy@gmail.com', 'admin', 'verified', 5000.00, 'COUPONX99', TRUE),
('dc7190f8-c2b6-4ac9-8cf7-21b6a12bda72', 'Rohan Sharma', 'rohan@example.in', 'user', 'verified', 2450.00, 'ROHAN100', FALSE),
('fd81a29d-40c2-48df-8926-cd00e2b92131', 'Priya Patel', 'priya@patel.co.in', 'user', 'pending', 750.00, 'PRIYA50', TRUE),
('5197dcd0-e902-4fc8-80df-9db87cf7a1f5', 'Affiliate Partner', 'retail@coupons.in', 'user', 'verified', 18400.00, 'INDIA_DISCOUNT', FALSE);

-- Seed Coupons
INSERT INTO coupons (brand, category_name, code, description, discount_type, discount_value, expiry_date, terms, price, seller_id, seller_name, status, is_featured, fraud_risk_score, recommended_price) VALUES
('Swiggy Money', 'Food', 'SWIGGY-INR150-Z78X', 'Extra ₹150 off on Swiggy Instamart or select gourmet restaurants.', 'flat', 150.00, '2026-08-31', 'Minimum cart value ₹499. One-time code per registered account.', 49.00, 'dc7190f8-c2b6-4ac9-8cf7-21b6a12bda72', 'Rohan Sharma', 'active', TRUE, 4, 55.00),
('Amazon India Pay', 'Shopping', 'AMZN-INR1000-TECH', '₹1,000 off on select Electronic Appliances on Amazon India.', 'flat', 1000.00, '2026-12-15', 'Applicable on major home electronics only. Non-refundable.', 650.00, '5197dcd0-e902-4fc8-80df-9db87cf7a1f5', 'Affiliate Partner', 'active', TRUE, 7, 700.00),
('Myntra Fashion', 'Shopping', 'MYNTRA-FA-30', 'Flat 30% off on premium winter wear & ethnic catalog collections.', 'percentage', 30.00, '2026-09-30', 'Valid across premium selection category. Max discount up to ₹500.', 120.00, 'fd81a29d-40c2-48df-8926-cd00e2b92131', 'Priya Patel', 'active', FALSE, 11, 150.00),
('BookMyShow Voucher', 'Entertainment', 'BMS-MOVIE-BUY1GET1', 'Buy 1 Ticket and Get 1 Ticket Free on weekend movie schedules.', 'percentage', 100.00, '2026-07-20', 'Applicable on select multiplex and cinemas across India. Max limit ₹150.', 80.00, 'dc7190f8-c2b6-4ac9-8cf7-21b6a12bda72', 'Rohan Sharma', 'active', FALSE, 5, 95.00),
('Zomato Gold', 'Food', 'ZOMATO-GOLD-PRO', '3-Months complimentary access to Zomato Gold hospitality catalog benefits.', 'flat', 300.00, '2026-06-30', 'Only for new premium club signups. Applicable on Android/iOS.', 180.00, 'fd81a29d-40c2-48df-8926-cd00e2b92131', 'Priya Patel', 'active', FALSE, 14, 210.00);

-- Seed Transactions
INSERT INTO transactions (buyer_id, buyer_name, seller_id, seller_name, coupon_brand, amount, fee, tx_type, status) VALUES
('8a12e3fb-ac21-4f35-9cd7-48f1ea21b8c1', 'Aruna Kiran', '5197dcd0-e902-4fc8-80df-9db87cf7a1f5', 'Affiliate Partner', 'Amazon Pay India', 650.00, 65.00, 'purchase', 'completed'),
('8a12e3fb-ac21-4f35-9cd7-48f1ea21b8c1', 'Aruna Kiran', NULL, NULL, NULL, 5000.00, 0.00, 'deposit', 'completed'),
('dc7190f8-c2b6-4ac9-8cf7-21b6a12bda72', 'Rohan Sharma', NULL, NULL, NULL, 2450.00, 0.00, 'deposit', 'completed');

-- Seed Reviews
INSERT INTO reviews (brand, reviewer_name, rating, comment) VALUES
('Zomato Gold', 'Aruna Kiran', 5, 'Clean escrow verification. Code worked immediately on my Zomato app!');

-- Seed Logs
INSERT INTO system_audit_logs (level, event_message, module, triggered_by) VALUES
('info', 'Database migrated to Supabase compliant relational models.', 'Migration', 'System'),
('info', 'Switched marketplace trading currency standard exclusively to Indian Rupees (INR - ₹)', 'Billing', 'Compliance'),
('info', 'Strict sandbox active. Safe peer escrow contract loaded.', 'EscrowEngine', 'System');
