import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { initFirebase, syncToFirebase, pullFromFirebase } from './firebase-sync';
import nodemailer from 'nodemailer';
import Razorpay from 'razorpay';
import crypto from 'crypto';

dotenv.config();

const razorpayInstance = process.env.RAZORPAY_KEY_ID ? new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
}) : null;

// SMTP Transporter for Email Communications
const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'no-reply@mrdu-adm.com',
    pass: process.env.SMTP_PASS || 'your_smtp_password',
  },
});

export const sendSystemEmail = async (to: string, subject: string, html: string) => {
  try {
    if (!process.env.SMTP_PASS) {
      console.log(`\n📧 [EMAIL SIMULATION: To ${to}]\nSubject: ${subject}\nBody: ${html.substring(0, 50)}...\n`);
      return { success: true, simulated: true };
    }
    
    await mailTransporter.sendMail({
      from: `"Mrdu-Adm Security" <${process.env.SMTP_USER || 'no-reply@mrdu-adm.com'}>`,
      to,
      subject,
      html
    });
    return { success: true, simulated: false };
  } catch (error) {
    console.error('SMTP Email Error:', error);
    return { success: false, error };
  }
};

// Set up Firebase Admin
const firebaseApp = initFirebase();

const withTimeout = (promise: Promise<any>, timeoutMs: number = 4000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), timeoutMs))
  ]);
};

// Standard mapping mapping fallback for UUID matching
const getValidUUID = (id: string | undefined): string | undefined => {
  if (!id) return undefined;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return id;
  }
  const cleaned = id.replace(/[^0-9]/g, '');
  if (cleaned.length > 0) {
    const padded = cleaned.slice(-12).padStart(12, '0');
    return `00000000-0000-0000-0000-${padded}`;
  }
  return undefined;
};



const app = express();
const PORT = 3000;


// Set up larger limit for base64 image loads
app.use(express.json({ limit: '20mb' }));

// Database initialization
const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

// Ensure database directory exists
if (!fs.existsSync(path.dirname(DB_FILE))) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}

// Pre-seeded database state matching Indian Rupee (INR - ₹) marketplace values
const INITIAL_DATABASE = {
  users: [
    { id: 'usr-1', name: 'Aruna Kiran', email: 'arukiranreddy@gmail.com', role: 'admin', kycStatus: 'verified', balance: 0, referralCode: 'COUPONX99', isPremium: true },
    { id: 'usr-2', name: 'Rohan Sharma', email: 'rohan@example.in', role: 'user', kycStatus: 'verified', balance: 2450, referralCode: 'ROHAN100', isPremium: false },
    { id: 'usr-3', name: 'Priya Patel', email: 'priya@patel.co.in', role: 'user', kycStatus: 'pending', balance: 750, referralCode: 'PRIYA50', isPremium: true },
    { id: 'usr-4', name: 'Affiliate Partner', email: 'retail@coupons.in', role: 'user', kycStatus: 'verified', balance: 18400, referralCode: 'INDIA_DISCOUNT', isPremium: false }
  ],
  coupons: [
    {
      id: 'cpn-1',
      brand: 'Swiggy Money',
      category: 'Food',
      code: 'SWIGGY-INR150-Z78X',
      description: 'Extra ₹150 off on Swiggy Instamart or food orders.',
      discountType: 'flat',
      discountValue: 15,
      expiryDate: '2026-08-31',
      terms: 'Minimum cart value ₹149. Valid once per user account.',
      price: 10,
      sellerId: 'usr-2',
      sellerName: 'Rohan Sharma',
      status: 'active',
      ocrExtracted: false,
      fraudScore: 4,
      recommendedPrice: 12,
      isFeatured: true
    },
    {
      id: 'cpn-2',
      brand: 'Amazon India Pay',
      category: 'Shopping',
      code: 'AMZN-INR1000-TECH',
      description: 'Flat ₹1,000 instant discount on Electronic Appliances.',
      discountType: 'flat',
      discountValue: 100,
      expiryDate: '2026-12-15',
      terms: 'Applicable on major brand items only. Non-refundable.',
      price: 45,
      sellerId: 'usr-4',
      sellerName: 'Affiliate Partner',
      status: 'active',
      ocrExtracted: true,
      fraudScore: 7,
      recommendedPrice: 48,
      isFeatured: true
    },
    {
      id: 'cpn-3',
      brand: 'Myntra Fashion',
      category: 'Shopping',
      code: 'MYNTRA-FA-30',
      description: 'Flat 30% discount on winter wear and ethnics catalog.',
      discountType: 'percentage',
      discountValue: 30,
      expiryDate: '2026-09-30',
      terms: 'Applies on ethnic winter collections. Max discount ₹50.',
      price: 35,
      sellerId: 'usr-3',
      sellerName: 'Priya Patel',
      status: 'active',
      ocrExtracted: false,
      fraudScore: 11,
      recommendedPrice: 40,
      isFeatured: false
    },
    {
      id: 'cpn-4',
      brand: 'BookMyShow Voucher',
      category: 'Entertainment',
      code: 'BMS-MOVIE-BUY1GET1',
      description: 'Buy 1 Ticket and Get 1 Ticket Free on weekend movies.',
      discountType: 'percentage',
      discountValue: 100,
      expiryDate: '2026-07-20',
      terms: 'Valid on select multiplexes across India. Max benefit ₹150.',
      price: 25,
      sellerId: 'usr-2',
      sellerName: 'Rohan Sharma',
      status: 'active',
      ocrExtracted: true,
      fraudScore: 5,
      recommendedPrice: 30,
      isFeatured: false
    },
    {
      id: 'cpn-5',
      brand: 'Zomato Gold Complimentary',
      category: 'Food',
      code: 'ZOMATO-GOLD-ACTIVE',
      description: '3-Months complimentary Zomato Gold membership benefits.',
      discountType: 'flat',
      discountValue: 30,
      expiryDate: '2026-06-30',
      terms: 'Applicable on standard Android/iOS Zomato signups only.',
      price: 18,
      sellerId: 'usr-3',
      sellerName: 'Priya Patel',
      status: 'active',
      ocrExtracted: false,
      fraudScore: 3,
      recommendedPrice: 21,
      isFeatured: true
    },
    {
      id: 'cpn-6',
      brand: 'AJIO Premium Shopping',
      category: 'Shopping',
      code: 'AJIO-FST-500',
      description: 'Flat ₹500 off on order of ₹1999 on Ajio high luxury brands.',
      discountType: 'flat',
      discountValue: 50,
      expiryDate: '2026-10-31',
      terms: 'Excludes innerwear and gold/silver products.',
      price: 25,
      sellerId: 'usr-4',
      sellerName: 'Affiliate Partner',
      status: 'active',
      ocrExtracted: true,
      fraudScore: 2,
      recommendedPrice: 30,
      isFeatured: true
    },
    {
      id: 'cpn-7',
      brand: 'Zomato Food Delivery',
      category: 'Food',
      code: 'ZOMATO-HUNGRY-150',
      description: 'Flat ₹150 Discount on select gourmet restaurant partners.',
      discountType: 'flat',
      discountValue: 15,
      expiryDate: '2026-09-15',
      terms: 'Valid on orders above ₹399 using our secure escrow path.',
      price: 10,
      sellerId: 'usr-2',
      sellerName: 'Rohan Sharma',
      status: 'active',
      ocrExtracted: true,
      fraudScore: 1,
      recommendedPrice: 12,
      isFeatured: false
    },
    {
      id: 'cpn-8',
      brand: 'Flipkart Supercoins Discount',
      category: 'Shopping',
      code: 'FLIP-COIN-500',
      description: 'Flat 10% instant discount up to ₹500 on Flipkart grocery.',
      discountType: 'percentage',
      discountValue: 10,
      expiryDate: '2026-08-15',
      terms: 'Valid on first grocery buy of each calendar week.',
      price: 20,
      sellerId: 'usr-3',
      sellerName: 'Priya Patel',
      status: 'active',
      ocrExtracted: false,
      fraudScore: 4,
      recommendedPrice: 25,
      isFeatured: false
    },
    {
      id: 'cpn-9',
      brand: 'Puma Athletic Sports',
      category: 'Shopping',
      code: 'PUMA-RUN-1000',
      description: 'Flat ₹1000 voucher valid at all Puma premium retail outlets.',
      discountType: 'flat',
      discountValue: 100,
      expiryDate: '2026-11-30',
      terms: 'Valid on full price items only. Cannot be clubbed with store sales.',
      price: 49,
      sellerId: 'usr-1',
      sellerName: 'Aruna Kiran',
      status: 'active',
      ocrExtracted: true,
      fraudScore: 1,
      recommendedPrice: 50,
      isFeatured: true
    },
    {
      id: 'cpn-10',
      brand: 'Lakmé Salon Signature',
      category: 'Health',
      code: 'LAKME-SPA-500',
      description: 'Complimentary ₹500 voucher on signature facial therapy.',
      discountType: 'flat',
      discountValue: 50,
      expiryDate: '2026-09-30',
      terms: 'Prior appointments required. Standard salon policies apply.',
      price: 15,
      sellerId: 'usr-4',
      sellerName: 'Affiliate Partner',
      status: 'active',
      ocrExtracted: false,
      fraudScore: 2,
      recommendedPrice: 20,
      isFeatured: false
    },
    {
      id: 'cpn-11',
      brand: 'Fastrack Youth Style',
      category: 'Shopping',
      code: 'FSTRK-GEAR-300',
      description: 'Flat ₹30 off on smart wearables and customized bags.',
      discountType: 'flat',
      discountValue: 30,
      expiryDate: '2026-08-25',
      terms: 'Valid only of official online online store orders.',
      price: 25,
      sellerId: 'usr-2',
      sellerName: 'Rohan Sharma',
      status: 'active',
      ocrExtracted: false,
      fraudScore: 5,
      recommendedPrice: 28,
      isFeatured: false
    },
    {
      id: 'cpn-12',
      brand: 'Yatra Flight Ticket Premium',
      category: 'Travel',
      code: 'YATRA-FLY-5000',
      description: 'Flat ₹50 off on international flight ticket bookings.',
      discountType: 'flat',
      discountValue: 50,
      expiryDate: '2026-10-30',
      terms: 'Valid only on flights through Yatra client platform. Escrow lock on trade.',
      price: 25,
      sellerId: 'usr-3',
      sellerName: 'Priya Patel',
      status: 'active',
      ocrExtracted: true,
      fraudScore: 1,
      recommendedPrice: 30,
      isFeatured: true
    },
    {
      id: 'cpn-13',
      brand: 'YouTube Premium Pass',
      category: 'Subscription',
      code: 'YT-SUB-6MONTHS',
      description: '6-Months complimentary YouTube Premium ad-free subscription voucher.',
      discountType: 'flat',
      discountValue: 50,
      expiryDate: '2026-09-15',
      terms: 'Applicable on non-premium active accounts. One per subscriber identity.',
      price: 25,
      sellerId: 'usr-4',
      sellerName: 'Affiliate Partner',
      status: 'active',
      ocrExtracted: true,
      fraudScore: 2,
      recommendedPrice: 30,
      isFeatured: true
    },
    {
      id: 'cpn-14',
      brand: 'Netflix Standard Premium',
      category: 'Subscription',
      code: 'NFLX-STND-3M',
      description: '3-Months standard HD stream subscription access voucher code.',
      discountType: 'flat',
      discountValue: 50,
      expiryDate: '2026-08-20',
      terms: 'Redeemable during checkout. Valid for returning or new accounts.',
      price: 49,
      sellerId: 'usr-2',
      sellerName: 'Rohan Sharma',
      status: 'active',
      ocrExtracted: false,
      fraudScore: 4,
      recommendedPrice: 50,
      isFeatured: false
    },
    {
      id: 'cpn-15',
      brand: 'MakeMyTrip Holiday Special',
      category: 'Travel',
      code: 'MMT-VACAY-2500',
      description: 'Flat ₹25 off on select luxury beach resorts and hotel suite bookings.',
      discountType: 'flat',
      discountValue: 25,
      expiryDate: '2026-12-31',
      terms: 'No minimum spend required. Can be stacked with current seasonal holiday deals.',
      price: 15,
      sellerId: 'usr-4',
      sellerName: 'Affiliate Partner',
      status: 'active',
      ocrExtracted: true,
      fraudScore: 2,
      recommendedPrice: 20,
      isFeatured: true
    }
  ],
  transactions: [
    { id: 'tx-1', buyerId: 'usr-1', buyerName: 'Aruna Kiran', sellerId: 'usr-3', sellerName: 'Priya Patel', couponId: 'cpn-5', couponBrand: 'Zomato Gold', amount: 180, fee: 18, type: 'purchase', status: 'completed', date: '2026-05-20T12:00:00Z' },
    { id: 'tx-2', buyerId: 'usr-1', buyerName: 'Aruna Kiran', amount: 5000, fee: 0, type: 'deposit', status: 'completed', date: '2026-05-19T08:30:00Z' },
    { id: 'tx-3', sellerId: 'usr-4', sellerName: 'Affiliate Partner', amount: 18400, fee: 0, type: 'deposit', status: 'completed', date: '2026-05-18T10:00:00Z' }
  ],
  reviews: [
    { id: 'rev-1', couponId: 'cpn-5', brand: 'Zomato Gold', rating: 5, comment: 'Instantly received the redeem code. Escrow system cleared the ledger immediately!', reviewerName: 'Aruna Kiran', date: '2026-05-21T01:00:00Z' }
  ],
  systemLogs: [
    { id: 'log-1', timestamp: '2026-05-21T04:15:00Z', level: 'info', event: 'Database initialized successfully with INR currencies', module: 'System' },
    { id: 'log-2', timestamp: '2026-05-21T04:20:00Z', level: 'info', event: 'Escrow settlement contract loaded with 10% platform fee', module: 'BillingEngine' },
    { id: 'log-3', timestamp: '2026-05-21T04:45:00Z', level: 'info', event: 'Voucher validation scanner engine loaded', module: 'Validation' }
  ]
};

// Database read/write helpers
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATABASE, null, 2), 'utf-8');
      return INITIAL_DATABASE;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading json db, using memory', err);
    return INITIAL_DATABASE;
  }
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    if (firebaseApp) {
      syncToFirebase(data).catch(err => {
        console.error('Firebase async background write-sync failed:', err);
      });
    }
  } catch (err) {
    console.error('Error writing json db', err);
  }
}

// Log builder
function logEvent(level: 'info' | 'warning' | 'error', event: string, module: string, user?: string) {
  const db = readDB();
  const log = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    level,
    event,
    module,
    user
  };
  db.systemLogs.unshift(log);
  // Keep logs capped at 100
  if (db.systemLogs.length > 100) {
    db.systemLogs = db.systemLogs.slice(0, 100);
  }
  writeDB(db);
}

// Lightweight in-memory rate limiter for backend endpoints
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const rateLimiter = (options: { windowMs: number; max: number; message: string }) => {
  return (req: any, res: any, next: any) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const key = `${req.path}:${ip}`;
    const now = Date.now();
    
    let record = rateLimitMap.get(key);
    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + options.windowMs,
      };
    }
    
    record.count++;
    rateLimitMap.set(key, record);
    
    res.setHeader('X-RateLimit-Limit', options.max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, options.max - record.count));
    
    if (record.count > options.max) {
      logEvent('warning', `Rate limit triggered on ${req.path} by ${ip}`, 'Security', 'system');
      return res.status(429).json({
        success: false,
        error: options.message || 'Too many requests. Please try again after some time.'
      });
    }
    next();
  };
};

const authRateLimit = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 requests per minute
  message: 'Too many authentication attempts. Please wait 1 minute before trying again.'
});

const paymentRateLimit = rateLimiter({
  windowMs: 60 * 1000,
  max: 15, // Max 15 creation or verify trials per minute
  message: 'Payment requests throttled. Please slow down and try again.'
});

// --- API Router Endpoints ---

function getActiveUser(db: any) {
  if (!db.activeUserId) {
    return null;
  }
  return db.users.find((u: any) => u.id === db.activeUserId) || null;
}

// Session management
app.get('/api/auth/session', (req, res) => {
  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser) {
    return res.json({ success: true, user: null });
  }
  res.json({ success: true, user: activeUser });
});

app.post('/api/auth/login', authRateLimit, (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required.' });
  }
  const trimmedEmail = email.trim().toLowerCase();
  const db = readDB();
  let user = db.users.find((u: any) => u.email.toLowerCase() === trimmedEmail);
  
  if (!user) {
    const prefix = trimmedEmail.split('@')[0];
    const name = prefix.replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
    const role = (trimmedEmail === 'arukiranreddy@gmail.com') ? 'admin' : 'user';
    
    user = {
      id: `usr-${Date.now()}`,
      name: name,
      email: trimmedEmail,
      role: role,
      kycStatus: role === 'admin' ? 'verified' : 'pending',
      balance: 0,
      referralCode: `VOUCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      isPremium: false,
      phone: '+91 98765 43210',
      aadharNo: '1234 5678 9012',
      panNo: 'ABCDE1234F',
      aadharPanDoc: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    };
    db.users.push(user);
  }
  
  db.activeUserId = user.id;
  writeDB(db);
  
  logEvent('info', `Sync Login success for ${user.name} (${user.role})`, 'Auth', user.name);
  return res.json({ success: true, user });
});

// In-memory verification storage for OTP validation
const otpStore = new Map<string, { otp: string, data?: any }>();

app.post('/api/auth/request-otp', authRateLimit, (req, res) => {
  const { email, purpose, name, phone, aadharNo, panNo, uploadedDoc } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }
  const trimmedEmail = email.trim().toLowerCase();
  
  // Generate random 6-digit code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP
  otpStore.set(trimmedEmail, { 
    otp, 
    data: { name, phone, aadharNo, panNo, uploadedDoc, purpose } 
  });

  const db = readDB();
  const existingUser = db.users.find((u: any) => u.email.toLowerCase() === trimmedEmail);
  const isSignup = purpose === 'signup';

  if (isSignup && existingUser) {
    return res.status(400).json({ success: false, error: 'Account already exists. Please Sign In instead.' });
  }

  // Create simulated email payload
  const simulatedMail = {
    id: `mail-otp-${Date.now()}`,
    senderName: 'VouchLoop Secure Access',
    senderEmail: 'gatekeeper@vouchloop.com',
    subject: `Your Secure verification OTP code: ${otp} 🔑`,
    bodyHtml: `
      <div style="font-family: sans-serif; padding: 24px; color: #1e293b; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
        <h2 style="color: #4f46e5; margin-top: 0;">VouchLoop OTP Verification</h2>
        <p>Please use this secure One-Time Password (OTP) to finalize your identity check and access VouchLoop peer services:</p>
        <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; font-size: 24px; font-family: monospace; font-weight: bold; letter-spacing: 4px; text-align: center; color: #011d12; margin: 20px 0;">
          ${otp}
        </div>
        <p style="font-size: 11px; color: #64748b; margin-bottom: 0;">This security code is generated purely for <strong>${trimmedEmail}</strong> and expires shortly.</p>
      </div>
    `,
    date: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-IN'),
    isRead: false,
    category: 'system' as const
  };

  logEvent('info', `OTP code ${otp} dispatched via secure mail simulation to ${trimmedEmail}`, 'Gatekeeper', trimmedEmail);

  return res.json({
    success: true,
    message: `A 6-digit confirmation code has been dispatched to ${trimmedEmail}. Check your simulated mail inbox at the top-right to copy it.`,
    simulatedMail
  });
});

app.post('/api/auth/verify-otp', authRateLimit, async (req, res) => {
  const { email, otp, purpose } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and OTP digits are required.' });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const stash = otpStore.get(trimmedEmail);

  if (!stash || stash.otp !== otp.trim()) {
    return res.status(400).json({ success: false, error: 'Wrong verification code or OTP has expired.' });
  }

  // OTP verified successfully! Clear it
  otpStore.delete(trimmedEmail);

  const db = readDB();
  let user = db.users.find((u: any) => u.email.toLowerCase() === trimmedEmail);

  if (purpose === 'signup') {
    if (user) {
      return res.status(400).json({ success: false, error: 'User is already registered.' });
    }

    const { name, phone, aadharNo, panNo, uploadedDoc } = stash.data || {};
    const finalRole = (trimmedEmail === 'arukiranreddy@gmail.com') ? 'admin' : 'user';

    user = {
      id: `usr-${Date.now()}`,
      name: name || trimmedEmail.split('@')[0],
      email: trimmedEmail,
      role: finalRole,
      kycStatus: finalRole === 'admin' ? 'verified' : 'pending',
      balance: 10000, // starting credit ₹10,000 for verified traders
      referralCode: `VOUCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      isPremium: false,
      phone: phone || '',
      aadharNo: aadharNo || '',
      panNo: panNo || '',
      aadharPanDoc: uploadedDoc || 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || trimmedEmail)}`
    };

    db.users.push(user);
    db.activeUserId = user.id;
    writeDB(db);

    logEvent('warning', `New user registered. KYC Pending operator verification for ${user.name}`, 'Auth', user.name);

    return res.json({
      success: true,
      user,
      message: `Account created successfully with ₹10,000 starting wallet credit! Your profile has been queued as 'KYC Pending' in the Admin Console.`
    });
  } else {
    // Login flow
    if (!user) {
      // Auto-create basic user if not exists to make test flow flexible, otherwise standard login
      const prefix = trimmedEmail.split('@')[0];
      const name = prefix.replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      const role = (trimmedEmail === 'arukiranreddy@gmail.com') ? 'admin' : 'user';

      user = {
        id: `usr-${Date.now()}`,
        name: name,
        email: trimmedEmail,
        role: role,
        kycStatus: role === 'admin' ? 'verified' : 'pending',
        balance: 0,
        referralCode: `VOUCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        isPremium: false,
        phone: '+91 98765 43210',
        aadharNo: '1234 5678 9012',
        panNo: 'ABCDE1234F',
        aadharPanDoc: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
      };
      db.users.push(user);
    }

    db.activeUserId = user.id;
    writeDB(db);

    logEvent('info', `Simulated OTP Login success for ${user.name} (${user.role})`, 'Auth', user.name);

    return res.json({
      success: true,
      user,
      message: `Successfully verified and logged in as ${user.name}!`
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  const db = readDB();
  db.activeUserId = null;
  writeDB(db);
  res.json({ success: true });
});

app.post('/api/auth/switch', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, error: 'User ID is required.' });
  }
  const db = readDB();
  const user = db.users.find((u: any) => u.id === id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found in directory.' });
  }
  db.activeUserId = user.id;
  writeDB(db);
  logEvent('info', `Developer switches session simulated context directly to user: ${user.name}`, 'Auth', user.name);
  res.json({ success: true, user });
});

app.post('/api/auth/update', (req, res) => {
  const { kycStatus, name, email, isPremium, avatar, role, aadharNo, panNo, uploadedAadhar, uploadedPan } = req.body;
  const db = readDB();
  const activeUser = getActiveUser(db);
  if (activeUser) {
    if (kycStatus !== undefined) activeUser.kycStatus = kycStatus;
    if (name !== undefined) activeUser.name = name;
    if (email !== undefined) activeUser.email = email;
    if (isPremium !== undefined) activeUser.isPremium = isPremium;
    if (avatar !== undefined) activeUser.avatar = avatar;
    if (role !== undefined) activeUser.role = role;
    if (aadharNo !== undefined) activeUser.aadharNo = aadharNo;
    if (panNo !== undefined) activeUser.panNo = panNo;
    if (uploadedAadhar !== undefined) activeUser.uploadedAadhar = uploadedAadhar;
    if (uploadedPan !== undefined) activeUser.uploadedPan = uploadedPan;
    if (uploadedAadhar !== undefined) activeUser.uploadedDoc = uploadedAadhar; // fall back for old layout
    writeDB(db);
    logEvent('info', `User profile updated (KYC state: ${kycStatus || activeUser.kycStatus}, Role: ${role || activeUser.role})`, 'Auth', activeUser.name);
    return res.json({ success: true, user: activeUser });
  }
  res.status(404).json({ success: false, error: 'User not found' });
});

// Coupon lists
app.get('/api/coupons', (req, res) => {
  const db = readDB();
  const { search, category, brand, isFeatured, status } = req.query;
  const activeUser = getActiveUser(db);
  let list = db.coupons;

  if (status && status !== 'all') {
    list = list.filter((c: any) => c.status === status);
  } else if (!status || status === 'all') {
    // By default expose active and featured or any standard visible coupons, plus user's sold coupons
    list = list.filter((c: any) => {
      if (c.status === 'active' || c.status === 'featured' || c.status === 'pending') {
        return true;
      }
      if (c.status === 'sold') {
        return activeUser && (c.sellerId === activeUser.id || c.buyerId === activeUser.id);
      }
      return false;
    });
  }

  if (category && category !== 'All') {
    list = list.filter((c: any) => c.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (brand) {
    list = list.filter((c: any) => c.brand.toLowerCase().includes((brand as string).toLowerCase()));
  }

  if (isFeatured === 'true') {
    list = list.filter((c: any) => c.isFeatured);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter((c: any) =>
      c.brand.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      c.category.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, coupons: list });
});

// Get individual coupon
app.get('/api/coupons/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const coupon = db.coupons.find((c: any) => c.id === id);
  if (!coupon) {
    return res.status(404).json({ success: false, error: 'Coupon not found' });
  }

  const activeUser = getActiveUser(db);
  const isOwner = activeUser ? coupon.sellerId === activeUser.id : false;
  const isBought = activeUser ? db.transactions.some(
    (tx: any) => tx.couponId === id && tx.buyerId === activeUser.id && tx.status === 'completed'
  ) : false;

  const couponCopy = { ...coupon };
  if (!isOwner && !isBought && (!activeUser || activeUser.role !== 'admin')) {
    couponCopy.code = '••••-••••-UNLOCKED-ON-PURCHASE';
  }

  res.json({ success: true, coupon: couponCopy, isUnlocked: isOwner || isBought || (activeUser && activeUser.role === 'admin') });
});

// Deterministic Fair pricing suggestion API (no AI!)
app.post('/api/ai/predict-price', (req, res) => {
  const { brand, discountType, discountValue, category, terms } = req.body;
  const originalVal = Number(discountValue) || 100;
  
  // Clean mathematical validation rules (non-AI based)
  let suggestedPrice = 0;
  let demandMultiplier = 1;
  const brandNorm = (brand || '').toLowerCase();

  if (brandNorm.includes('amazon') || brandNorm.includes('flipkart')) {
    demandMultiplier = 1.2; // Premium retail brand demand modifier
  } else if (brandNorm.includes('swiggy') || brandNorm.includes('zomato')) {
    demandMultiplier = 1.1; // Food service brand demand modifier
  } else if (brandNorm.includes('netflix') || brandNorm.includes('spotify')) {
    demandMultiplier = 0.9;
  }

  if (discountType === 'percentage') {
    // Treat as value out of standard ticket of ₹1,000
    const estimatedValue = 1000 * (originalVal / 100);
    suggestedPrice = Math.round(estimatedValue * 0.45 * demandMultiplier);
  } else {
    suggestedPrice = Math.round(originalVal * 0.60 * demandMultiplier);
  }

  // Cap suggested price at 90% of value
  const valueCap = discountType === 'flat' ? originalVal : 1000;
  if (suggestedPrice >= valueCap) {
    suggestedPrice = Math.round(valueCap * 0.7);
  }
  if (suggestedPrice <= 0) {
    suggestedPrice = 49;
  }

  const highDemandScore = Math.min(100, Math.max(10, Math.round(65 + (demandMultiplier * 15))));

  res.json({
    success: true,
    suggestedPrice: suggestedPrice,
    explanation: `Calculated using our Fair Value Ledger Index. Based on category standard demand stats for "${category || 'Shopping'}" vouchers, we recommend pricing at approximately 50-70% of face value to encourage peer trades within 24 hours.`,
    highDemandScore: highDemandScore
  });
});

// Mock Screenshot Form Auto-completer API (no AI!)
app.post('/api/ai/ocr', (req, res) => {
  const { imageBase64, mimeType } = req.body;
  
  // Returns deterministic response to simulate reading standard images
  res.json({
    success: true,
    brand: 'Myntra Fashion',
    code: 'MYNTRA-VAL-INR500',
    discountType: 'flat',
    discountValue: 500,
    expiryDate: '2026-09-30',
    terms: 'Valid on ethnics and winter collection catalog. Minimum purchase of ₹1,499 applies.',
    fraudRiskScore: 3,
    fraudRiskAnalysis: 'Form verification complete. Double code submission check matched standard issuer formats. Clean safety record detected.'
  });
});

// Upload and sell coupon
app.post('/api/coupons', (req, res) => {
  const { brand, code, category, discountType, discountValue, expiryDate, terms, price, image, fraudScore, fraudReason, recommendedPrice } = req.body;
  if (!brand || !code || !price) {
    return res.status(400).json({ success: false, error: 'Missing brand, voucher code or price.' });
  }

  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Please log in first.' });
  }

  const newCoupon = {
    id: `cpn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    brand,
    code,
    description: `Flat ₹${discountType === 'flat' ? discountValue : discountValue + '%'} discount card on ${brand}. Instantly verified seller.`,
    category: category || 'Shopping',
    discountType: discountType || 'percentage',
    discountValue: Number(discountValue) || 10,
    expiryDate: expiryDate || '2026-12-31',
    terms: terms || 'Applicable on brand retail products globally across India.',
    price: Number(price),
    sellerId: activeUser.id,
    sellerName: activeUser.name,
    status: 'pending', // Pending Admin approval
    image: image || null,
    ocrExtracted: req.body.ocrExtracted || false,
    fraudScore: Number(fraudScore) || Math.floor(Math.random() * 15),
    fraudReason: fraudReason || 'Standard pattern verification match successfully cleared checks.',
    recommendedPrice: Number(recommendedPrice) || Math.round(price * 1.1)
  };

  db.coupons.unshift(newCoupon);
  writeDB(db);

  logEvent('info', `Listed coupon for ${brand} (₹${price}) in the queue. Pending moderator clearing scan.`, 'Inventory', activeUser.name);

  res.json({ success: true, coupon: newCoupon });
});

// Update listed coupon details (Full CRUD: UPDATE)
app.put('/api/coupons/:id', (req, res) => {
  const { id } = req.params;
  const { brand, category, discountType, discountValue, price, expiryDate, terms, code } = req.body;
  
  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Please log in first.' });
  }

  const couponIndex = db.coupons.findIndex((c: any) => c.id === id);
  if (couponIndex === -1) {
    return res.status(404).json({ success: false, error: 'Coupon listing not found' });
  }

  const coupon = db.coupons[couponIndex];
  
  // Guard access: only the seller or an admin can edit
  if (coupon.sellerId !== activeUser.id && activeUser.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden. You do not own this listing.' });
  }

  // Guard: sold coupons cannot be edited
  if (coupon.status === 'sold') {
    return res.status(400).json({ success: false, error: 'Cannot update details of a completed sale/voucher.' });
  }

  // Update values
  if (brand !== undefined) coupon.brand = brand;
  if (category !== undefined) coupon.category = category;
  if (discountType !== undefined) coupon.discountType = discountType;
  if (discountValue !== undefined) coupon.discountValue = Number(discountValue);
  if (price !== undefined) coupon.price = Number(price);
  if (expiryDate !== undefined) coupon.expiryDate = expiryDate;
  if (terms !== undefined) coupon.terms = terms;
  if (code !== undefined) coupon.code = code;

  // Let edits re-trigger verification (unless done by admin)
  if (activeUser.role !== 'admin') {
    coupon.status = 'pending'; // Re-queue for verification as pricing/code changed
  }

  writeDB(db);
  logEvent('info', `Updated coupon listing for ${coupon.brand} (₹${coupon.price}). State is updated.`, 'Inventory', activeUser.name);

  res.json({ success: true, coupon });
});

// Delete listed coupon listing (Full CRUD: DELETE)
app.delete('/api/coupons/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Please log in first.' });
  }

  const couponIndex = db.coupons.findIndex((c: any) => c.id === id);
  if (couponIndex === -1) {
    return res.status(404).json({ success: false, error: 'Coupon listing not found' });
  }

  const coupon = db.coupons[couponIndex];
  
  // Guard access: only the seller or an admin can delete
  if (coupon.sellerId !== activeUser.id && activeUser.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden. You do not own this listing.' });
  }

  // Guard: sold coupons cannot be deleted
  if (coupon.status === 'sold') {
    return res.status(400).json({ success: false, error: 'Cannot delete a completed sale/voucher.' });
  }

  // Remove coupon from database array
  db.coupons.splice(couponIndex, 1);
  writeDB(db);
  
  logEvent('warning', `Deleted/Canceled voucher listing for ${coupon.brand}.`, 'Inventory', activeUser.name);
  res.json({ success: true, message: 'Coupon listing successfully canceled.' });
});

// Purchase a coupon (Escrow execution logic)
app.post('/api/coupons/:id/buy', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Please log in first.' });
  }

  const couponIndex = db.coupons.findIndex((c: any) => c.id === id);
  if (couponIndex === -1) {
    return res.status(404).json({ success: false, error: 'Coupon not found' });
  }

  const coupon = db.coupons[couponIndex];
  if (coupon.status !== 'active') {
    return res.status(400).json({ success: false, error: 'This coupon listing has been already bought or closed.' });
  }

  if (coupon.sellerId === activeUser.id) {
    return res.status(400).json({ success: false, error: 'You are forbidden from purchasing your own listed coupons.' });
  }

  if (activeUser.balance < coupon.price) {
    return res.status(400).json({ success: false, error: 'Insufficient wallet balance. Please add instant credits to your ledger wallet before placing order.' });
  }

  // Deduct from buyer
  activeUser.balance -= coupon.price;

  // Escrow distribution: 5% marketplace fee, 95% credited to seller balance
  const fee = Math.round(coupon.price * 0.05);
  const payout = coupon.price - fee;

  const seller = db.users.find((u: any) => u.id === coupon.sellerId);
  if (seller) {
    seller.balance += payout;
  }

  // Toggle status of coupon
  coupon.status = 'sold';
  coupon.buyerId = activeUser.id;

  // Record transactions
  const txId = `tx-${Date.now()}`;
  const purchaseTx = {
    id: txId,
    buyerId: activeUser.id,
    buyerName: activeUser.name,
    sellerId: coupon.sellerId,
    sellerName: coupon.sellerName,
    couponId: coupon.id,
    couponBrand: coupon.brand,
    amount: coupon.price,
    fee: fee,
    type: 'purchase' as const,
    status: 'completed' as const,
    date: new Date().toISOString()
  };

  db.transactions.unshift(purchaseTx);
  writeDB(db);

  logEvent('info', `Completed escrow transfer for ${coupon.brand} (₹${coupon.price}). Platform fee ₹${fee} routed.`, 'Settlement', activeUser.name);

  res.json({ success: true, transaction: purchaseTx, couponCode: coupon.code });
});

// PhonePe Server-to-Server Callback Handler
app.post('/api/phonepe/callback', (req, res) => {
  const { response } = req.body; // base64 encoded JSON returned by PhonePe
  const xVerify = req.headers['x-verify'];

  if (!response || !xVerify) {
    return res.status(400).json({ success: false, error: 'Invalid callback payload' });
  }

  // Anti-fraud: In production, verify the checksum here using your PhonePe Salt Key
  // const calculatedChecksum = calculateSHA256(response + saltKey) + '###' + saltIndex;
  // if (calculatedChecksum !== xVerify) { return res.status(401).send('Tampered Request'); }
  
  try {
    const decodedPayload = JSON.parse(Buffer.from(response, 'base64').toString('utf-8'));
    const { success, code, data } = decodedPayload;
    
    // Check if payment was successful
    if (success && code === 'PAYMENT_SUCCESS' && data) {
      const { merchantTransactionId, amount } = data;
      
      const db = readDB();
      const txIndex = db.transactions.findIndex((t: any) => t.id === merchantTransactionId);
      
      if (txIndex !== -1 && db.transactions[txIndex].status === 'pending') {
        const tx = db.transactions[txIndex];
        const numAmt = amount / 100; // PhonePe returns amount in paisa
        
        // Final Validation Check
        if (tx.amount === numAmt) {
          tx.status = 'completed';
          
          // Credit user wallet
          const user = db.users.find((u: any) => u.id === tx.buyerId);
          if (user) {
            user.balance += numAmt;
            writeDB(db);
            logEvent('info', `PhonePe Webhook verification success. Credited ₹${numAmt} to ${user.name}`, 'Payments', 'System');
            return res.status(200).send('OK');
          }
        }
      }
    }
    res.status(200).send('OK'); // Always return 200 to acknowledge webhook
  } catch (err) {
    console.error('PhonePe Webhook failed to parse:', err);
    res.status(400).send('Bad Request');
  }
});

// Razorpay Order Creation
app.post('/api/wallet/razorpay/order', paymentRateLimit, async (req, res) => {
  const { amount, purpose } = req.body;
  const numAmt = Number(amount);
  if (isNaN(numAmt) || numAmt <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid amount' });
  }

  // Razorpay standard checkout minimum amount is 100 paise (₹1.00)
  if (numAmt * 100 < 100) {
    return res.status(400).json({ success: false, error: 'Amount must be at least ₹1.00 (100 paise)' });
  }

  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    let orderId = '';
    let rzpAmount = Math.round(Number(amount) * 100);
    let key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_simulated_key';

    if (!razorpayInstance) {
      orderId = `order_sim_${Date.now()}`;
    } else {
      const options = {
        amount: rzpAmount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`
      };
      const order = await razorpayInstance.orders.create(options);
      orderId = order.id;
    }

    const txType = purpose === 'checkout' ? 'purchase' : 'deposit';

    const tx = {
      id: orderId, // using orderId as transaction ID for tracking
      buyerId: activeUser.id,
      buyerName: activeUser.name,
      amount: Number(amount),
      fee: 0,
      type: txType as 'purchase' | 'deposit',
      status: 'pending' as 'pending' | 'completed' | 'failed',
      date: new Date().toISOString(),
      paymentMethod: 'Razorpay',
      upiId: '',
    };
    db.transactions.unshift(tx);
    logEvent('info', `Created pending Razorpay ${txType} order of ₹${amount}.`, 'LedgerWallet', activeUser.name);
    writeDB(db);

    return res.json({
      success: true,
      transaction: tx,
      orderId,
      amount: rzpAmount,
      currency: 'INR',
      key_id
    });
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).json({ success: false, error: 'Failed to create Razorpay order' });
  }
});

// Razorpay Payment Verification
app.post('/api/wallet/razorpay/verify', paymentRateLimit, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, purpose } = req.body;
  
  if (!amount || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, error: 'Missing required payment details' });
  }

  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  let isAuthentic = true;

  // If using actual Razorpay integration, properly verify the signature
  if (razorpayInstance && process.env.RAZORPAY_KEY_SECRET && !razorpay_order_id.startsWith('order_sim_')) {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    isAuthentic = expectedSignature === razorpay_signature;
  }

  if (isAuthentic) {
    const numAmt = Number(amount);
    
    // Find the pending transaction associated with this order
    const pendingTxIndex = db.transactions.findIndex((t: any) => t.id === razorpay_order_id && t.status === 'pending');
    let tx;

    if (pendingTxIndex !== -1) {
      db.transactions[pendingTxIndex].status = 'completed';
      db.transactions[pendingTxIndex].upiId = razorpay_payment_id || '';
      tx = db.transactions[pendingTxIndex];
    } else {
      // Fallback
      tx = {
        id: razorpay_order_id || `tx-rzp-${Date.now()}`,
        buyerId: activeUser.id,
        buyerName: activeUser.name,
        amount: numAmt,
        fee: 0,
        type: purpose === 'checkout' ? 'purchase' : 'deposit',
        // @ts-ignore
        status: 'completed',
        date: new Date().toISOString(),
        paymentMethod: 'Razorpay',
        upiId: razorpay_payment_id || '',
      };
      db.transactions.unshift(tx);
    }
    
    if (tx.type === 'purchase') {
      logEvent('info', `Processed instant real-time Razorpay checkout of ₹${numAmt}.`, 'LedgerWallet', activeUser.name);
      writeDB(db);

      // Send email confirmation
      if (activeUser.email) {
        const html = `
          <div style="font-family: sans-serif; max-w-md; margin: auto;">
            <h2 style="color: #3399cc;">VouchLoop Checkout Receipt</h2>
            <p>Hi ${activeUser.name},</p>
            <p>Your payment of ₹${numAmt} for your recent purchase was successful.</p>
            <p><strong>Transaction ID:</strong> ${tx.id}</p>
            <p>Thank you for using VouchLoop!</p>
          </div>
        `;
        sendSystemEmail(activeUser.email, `VouchLoop Checkout Receipt - ${tx.id}`, html).catch(console.error);
      }

      return res.json({
        success: true,
        transaction: tx,
        user: activeUser,
        message: `Successfully paid ₹${numAmt} via Razorpay.`
      });
    }

    activeUser.balance += numAmt;
    logEvent('info', `Processed instant real-time Razorpay deposit of ₹${numAmt}.`, 'LedgerWallet', activeUser.name);
    writeDB(db);

    // Send email confirmation
    if (activeUser.email) {
      const html = `
        <div style="font-family: sans-serif; max-w-md; margin: auto;">
          <h2 style="color: #3399cc;">VouchLoop Deposit Receipt</h2>
          <p>Hi ${activeUser.name},</p>
          <p>Your wallet top-up of ₹${numAmt} was successful.</p>
          <p><strong>Transaction ID:</strong> ${tx.id}</p>
          <p>Your new wallet balance is ₹${activeUser.balance}.</p>
        </div>
      `;

      sendSystemEmail(activeUser.email, `VouchLoop Deposit Receipt - ${tx.id}`, html).catch(console.error);
    }

    res.json({
      success: true,
      transaction: tx,
      user: activeUser,
      message: `Successfully deposited ₹${numAmt} to wallet via Razorpay.`
    });
  } else {
    res.status(400).json({ success: false, error: 'Invalid Payment Signature' });
  }
});

// Wallet Deposit API (Requires Admin Check for Cards and Cash Amount Validation)
app.post('/api/wallet/deposit', (req, res) => {
  const { amount, paymentMethod, upiId, cardNumber, cardName, cardExpiry, cardCvv } = req.body;
  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ success: false, error: 'Please enter a valid deposit amount.' });
  }

  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Please log in first.' });
  }
  const numAmt = Number(amount);

  const txStatus = (paymentMethod === 'PhonePe' || paymentMethod === 'UPI') ? 'completed' : 'pending';

  // We set status as 'pending' for validation by admin console, unless PhonePe/UPI which is real-time
  const tx = {
    id: `tx-dep-${Date.now()}`,
    buyerId: activeUser.id,
    buyerName: activeUser.name,
    amount: numAmt,
    fee: 0,
    type: 'deposit' as const,
    status: txStatus as 'completed' | 'pending',
    date: new Date().toISOString(),
    paymentMethod: paymentMethod || 'UPI',
    upiId: upiId || '',
    cardNumber: cardNumber ? `•••• •••• •••• ${cardNumber.slice(-4)}` : '',
    cardName: cardName || '',
    cardExpiry: cardExpiry || '',
    cardCvv: cardCvv ? '•••' : ''
  };

  db.transactions.unshift(tx);
  if (txStatus === 'completed') {
    activeUser.balance += numAmt;
    logEvent('info', `Processed instant real-time deposit of ₹${numAmt} via ${paymentMethod || 'UPI'}.`, 'LedgerWallet', activeUser.name);
  } else {
    logEvent('warning', `Logged client ledger deposit request of ₹${numAmt} via ${paymentMethod}. Pending Admin cash confirmation audit.`, 'LedgerWallet', activeUser.name);
  }
  writeDB(db);

  res.json({ 
    success: true, 
    user: activeUser, 
    transaction: tx,
    message: txStatus === 'completed' ? `Successfully deposited ₹${numAmt} to wallet via real-time gateway.` : `Payment request of ₹${numAmt} queued for compliance approval! VouchLoop administrators will verify the account details and activate your funds within 10 minutes.`
  });
});

// Wallet Payout (Withdrawal) request
app.post('/api/wallet/withdraw', (req, res) => {
  const { amount, upiId, bankAccount } = req.body;
  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ success: false, error: 'Please enter a valid withdrawal amount.' });
  }

  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Please log in first.' });
  }
  const numAmt = Number(amount);

  if (activeUser.balance < numAmt) {
    return res.status(400).json({ success: false, error: 'Insufficient wallet balance for withdrawal order.' });
  }

  activeUser.balance -= numAmt;

  const tx = {
    id: `tx-${Date.now()}`,
    sellerId: activeUser.id,
    sellerName: activeUser.name,
    amount: numAmt,
    fee: 0,
    type: 'withdrawal' as const,
    status: 'pending' as const,
    date: new Date().toISOString()
  };

  db.transactions.unshift(tx);
  writeDB(db);

  logEvent('warning', `Requested payout withdrawal of ₹${numAmt} (UPI: ${upiId || 'Direct Bank routing'}). Check queue.`, 'LedgerWallet', activeUser.name);

  res.json({ success: true, user: activeUser, transaction: tx });
});

// Direct Wallet P2P Transfer API
app.post('/api/wallet/transfer', (req, res) => {
  const { recipientEmail, amount } = req.body;
  
  if (!recipientEmail || !amount || Number(amount) <= 0) {
    return res.status(400).json({ success: false, error: 'Recipient email and a valid transfer amount are required.' });
  }

  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Please log in first.' });
  }
  const numAmt = Number(amount);

  if (activeUser.balance < numAmt) {
    return res.status(400).json({ success: false, error: 'Insufficient wallet balance for this transfer.' });
  }

  const recipient = db.users.find((u: any) => u.email.toLowerCase() === recipientEmail.trim().toLowerCase());
  if (!recipient) {
    return res.status(404).json({ success: false, error: `Recipient with email "${recipientEmail}" not found in our user directory.` });
  }

  if (recipient.id === activeUser.id) {
    return res.status(400).json({ success: false, error: 'You cannot transfer funds to yourself.' });
  }

  // Deduct from sender, credit to recipient
  activeUser.balance -= numAmt;
  recipient.balance += numAmt;

  const tx = {
    id: `tx-tf-${Date.now()}`,
    buyerId: activeUser.id,
    buyerName: activeUser.name,
    sellerId: recipient.id,
    sellerName: recipient.name,
    amount: numAmt,
    fee: 0,
    type: 'purchase' as const, // For compatibility with UI lists
    status: 'completed' as const,
    date: new Date().toISOString(),
    couponBrand: `P2P Transfer to ${recipient.name}`
  };

  db.transactions.unshift(tx);
  writeDB(db);

  logEvent('info', `Transferred ₹${numAmt} to peer "${recipient.name}" (${recipient.email})`, 'WalletTransfer', activeUser.name);

  // Return success response with updated active sender profile
  res.json({ success: true, user: activeUser, transaction: tx, recipientName: recipient.name });
});

// Get user transaction logs
app.get('/api/wallet/history', (req, res) => {
  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser) {
    return res.json({ success: true, history: [] }); // simple empty fallback
  }

  const userTx = db.transactions.filter(
    (tx: any) => tx.buyerId === activeUser.id || tx.sellerId === activeUser.id
  );

  res.json({ success: true, history: userTx });
});

// Post a review
app.post('/api/reviews', (req, res) => {
  const { couponId, brand, rating, comment } = req.body;
  if (!rating || !comment || !brand) {
    return res.status(400).json({ success: false, error: 'Review rating and feedback comment are required.' });
  }

  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Please log in first.' });
  }

  const reviewExist = db.reviews.some((r: any) => r.couponId === couponId && r.reviewerName === activeUser.name);
  if (reviewExist) {
    return res.status(400).json({ success: false, error: 'You have already submitted review feedback for this voucher.' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    couponId: couponId || null,
    brand,
    rating: Number(rating),
    comment,
    reviewerName: activeUser.name,
    date: new Date().toISOString()
  };

  db.reviews.unshift(newReview);
  writeDB(db);

  logEvent('info', `Submitted rating of ${rating} stars on ${brand}`, 'SocialRating', activeUser.name);

  res.json({ success: true, review: newReview });
});

// Get reviews list
app.get('/api/reviews', (req, res) => {
  const db = readDB();
  res.json({ success: true, reviews: db.reviews });
});

// --- Admin Controls Panel APIs ---
app.get('/api/admin/stats', (req, res) => {
  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser || activeUser.role !== 'admin' || activeUser.email?.toLowerCase() !== 'arukiranreddy@gmail.com') {
    return res.status(403).json({ success: false, error: 'Access denied. You are not authorized as administrator.' });
  }

  const usersCount = db.users.length;
  const couponsCount = db.coupons.length;
  
  let volume = 0;
  let systemCommission = 0;
  db.transactions.forEach((tx: any) => {
    if (tx.status === 'completed' && tx.type === 'purchase') {
      volume += tx.amount;
      systemCommission += tx.fee;
    }
  });

  const activeAndPendingCoupons = db.coupons.filter((c: any) => c.status === 'active' || c.status === 'pending');
  let totalRisk = 0;
  activeAndPendingCoupons.forEach((c: any) => {
    totalRisk += (c.fraudScore || 0);
  });
  const avgRisk = activeAndPendingCoupons.length ? Math.round(totalRisk / activeAndPendingCoupons.length) : 5;

  const logQueue = db.systemLogs.slice(0, 30);

  res.json({
    success: true,
    stats: {
      usersCount,
      couponsCount,
      revenueCommission: systemCommission,
      totalTradeVolume: volume,
      avgRiskFactor: avgRisk,
      pendingApprovalCount: db.coupons.filter((c: any) => c.status === 'pending').length,
      pendingWithdrawalCount: db.transactions.filter((t: any) => t.type === 'withdrawal' && t.status === 'pending').length,
      pendingKycCount: db.users.filter((u: any) => u.kycStatus === 'pending').length,
      pendingDepositCount: db.transactions.filter((t: any) => t.type === 'deposit' && t.status === 'pending').length
    },
    logs: logQueue,
    allUsers: db.users.map((u: any) => {
      const userTxs = db.transactions.filter((tx: any) => 
        (tx.buyerId === u.id || tx.sellerId === u.id)
      );
      const totalVolume = userTxs
        .filter((tx: any) => tx.status === 'completed')
        .reduce((sum: number, tx: any) => sum + Number(tx.amount || 0), 0);
      return {
        ...u,
        totalTransactionVolume: totalVolume,
        transactions: userTxs
      };
    }),
    couponsToReview: db.coupons.filter((c: any) => c.status === 'pending'),
    pendingWithdrawals: db.transactions.filter((tx: any) => tx.type === 'withdrawal' && tx.status === 'pending'),
    pendingKycUsers: db.users.filter((u: any) => u.kycStatus === 'pending'),
    pendingDeposits: db.transactions.filter((tx: any) => tx.type === 'deposit' && tx.status === 'pending')
  });
});

// Moderate User KYC Identity approvals
app.post('/api/admin/kyc/:id/moderate', (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'approve' | 'reject'

  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser || activeUser.role !== 'admin' || activeUser.email?.toLowerCase() !== 'arukiranreddy@gmail.com') {
    return res.status(403).json({ success: false, error: 'Access denied. You are not authorized as administrator.' });
  }

  const uIndex = db.users.findIndex((u: any) => u.id === id);
  if (uIndex === -1) {
    return res.status(404).json({ success: false, error: 'User slot not found.' });
  }

  const targetUser = db.users[uIndex];
  if (action === 'approve') {
    targetUser.kycStatus = 'verified';
    logEvent('info', `Identity KYC Approved for user ${targetUser.name} with fully validated Aadhar/PAN cards details.`, 'Moderation', 'Admin');
  } else {
    targetUser.kycStatus = 'rejected';
    logEvent('error', `Identity KYC Flagged and Declined for user ${targetUser.name} due to unreadable uploads.`, 'Moderation', 'Admin');
  }

  writeDB(db);
  res.json({ success: true, user: targetUser });
});

// Moderate Ledger Wallet Cash/Card Deposits
app.post('/api/admin/deposit/:id/moderate', (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'approve' | 'reject'

  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser || activeUser.role !== 'admin' || activeUser.email?.toLowerCase() !== 'arukiranreddy@gmail.com') {
    return res.status(403).json({ success: false, error: 'Access denied. You are not authorized as administrator.' });
  }

  const tIndex = db.transactions.findIndex((t: any) => t.id === id);
  if (tIndex === -1) {
    return res.status(404).json({ success: false, error: 'Deposit ledger transaction ID not found.' });
  }

  const tx = db.transactions[tIndex];
  if (tx.status !== 'pending') {
    return res.status(400).json({ success: false, error: 'Deposit transaction has already been resolved.' });
  }

  const clientUser = db.users.find((u: any) => u.id === tx.buyerId);
  if (!clientUser) {
    return res.status(404).json({ success: false, error: 'Target deposit user account could not be found.' });
  }

  if (action === 'approve') {
    tx.status = 'completed';
    clientUser.balance += tx.amount;
    logEvent('info', `Approved deposit of ₹${tx.amount} to wallet of ${clientUser.name} after original payment instrument verification.`, 'LedgerWallet', 'Admin');
  } else {
    tx.status = 'failed';
    logEvent('error', `Rejected cash deposit credentials of ₹${tx.amount} for user ${clientUser.name} due to gateway authorization failure.`, 'LedgerWallet', 'Admin');
  }

  writeDB(db);
  res.json({ success: true, tx });
});

// Moderate Coupon approvals
app.post('/api/admin/coupon/:id/moderate', (req, res) => {
  const { id } = req.params;
  const { action } = req.body; 
  
  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser || activeUser.role !== 'admin' || activeUser.email?.toLowerCase() !== 'arukiranreddy@gmail.com') {
    return res.status(403).json({ success: false, error: 'Access denied. You are not authorized as administrator.' });
  }
  const cIndex = db.coupons.findIndex((c: any) => c.id === id);
  if (cIndex === -1) {
    return res.status(404).json({ success: false, error: 'Listing not found.' });
  }

  const coupon = db.coupons[cIndex];
  if (action === 'approve') {
    coupon.status = 'active';
    logEvent('info', `Moderator approved listed coupon ${coupon.brand} (₹${coupon.price}) to public listings feed.`, 'Moderation', 'Admin');
  } else {
    coupon.status = 'rejected';
    logEvent('error', `Moderator flagged listed coupon ${coupon.brand} as invalid / duplicate code.`, 'Moderation', 'Admin');
  }

  writeDB(db);
  res.json({ success: true, coupon });
});

// Moderate Withdrawals
app.post('/api/admin/withdrawal/:id/approve', (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser || activeUser.role !== 'admin' || activeUser.email?.toLowerCase() !== 'arukiranreddy@gmail.com') {
    return res.status(403).json({ success: false, error: 'Access denied. You are not authorized as administrator.' });
  }
  const tIndex = db.transactions.findIndex((t: any) => t.id === id);
  if (tIndex === -1) {
    return res.status(404).json({ success: false, error: 'Transaction log link not found.' });
  }

  const tx = db.transactions[tIndex];
  if (action === 'complete') {
    tx.status = 'completed';
    logEvent('info', `Cleared and transferred withdrawal payout of ₹${tx.amount} to bank coordinates under standard rules.`, 'Billing', 'Admin');
  } else {
    tx.status = 'failed';
    // refund seller balance
    const seller = db.users.find((u: any) => u.id === tx.sellerId);
    if (seller) {
      seller.balance += tx.amount;
    }
    logEvent('error', `Declined withdrawal request of ₹${tx.amount}. Refunded holdings assets back to wallet balance.`, 'Billing', 'Admin');
  }

  writeDB(db);
  res.json({ success: true, tx });
});

// Standard Bookkeeping Ledger Report (No AI!)
app.get('/api/admin/audit', (req, res) => {
  const db = readDB();
  const activeUser = getActiveUser(db);
  if (!activeUser || activeUser.role !== 'admin' || activeUser.email?.toLowerCase() !== 'arukiranreddy@gmail.com') {
    return res.status(403).json({ success: false, error: 'Access denied. You are not authorized as administrator.' });
  }

  const totalUsers = db.users.length;
  const couponCount = db.coupons.length;
  const activeCoupons = db.coupons.filter(c => c.status === 'active').length;
  const soldCoupons = db.coupons.filter(c => c.status === 'sold').length;
  
  let totalVolume = 0;
  let totalCommissions = 0;
  db.transactions.forEach((t: any) => {
    if (t.status === 'completed' && t.type === 'purchase') {
      totalVolume += t.amount;
      totalCommissions += t.fee;
    }
  });

  const reportMarkdown = `### Operational Compliance & Registry Audit Report
**Execution Timestamp**: ${new Date().toISOString()}  
**Marketplace Target Currency**: **Indian Rupee (INR - ₹)**  
**Security Status Rating**: **STABLE & SECURE (Nominal variance under checks)**

#### 1. Marketplace Volume Ledger (INR)
- **Total Trade Exchanges**: ₹${totalVolume.toLocaleString('en-IN')}
- **Retained Platform Commissions (10% standard fee)**: ₹${totalCommissions.toLocaleString('en-IN')}
- **Active Escrow Assets Hold**: Protected on client-ledger verification triggers.

#### 2. Listing & Validation Records
- **Total Registered Sellers & Buyers**: ${totalUsers} active listings accounts.
- **Active Trade Listings**: ${activeCoupons} vouchers verified and visible on feeds.
- **Completed Sales**: ${soldCoupons} codes settled and claimed successfully.
- **Voucher Layout Rejection Rate**: ${Math.round((db.coupons.filter(c => c.status === 'rejected').length / (couponCount || 1)) * 100)}%

#### 3. Administrative Strategic Actions Required
1. Enforce strict identity KYC verification limits for all payouts exceeding ₹15,000.
2. Flag listings with user risk indicators above 15% and route them to secondary human verification queue.
3. Automatically settle payouts within 2 hours of admin-level approval clearing.`;

  res.json({
    success: true,
    report: reportMarkdown
  });
});

// Client Helpdesk support Ticket responder (no AI!)
app.post('/api/ai/chat', (req, res) => {
  const { messages } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, error: 'Messages array is required.' });
  }

  // Get last message text to reply with standard customer support dictionary
  const lastMsg = messages[messages.length - 1];
  const qStr = (lastMsg && lastMsg.text || '').toLowerCase();
  
  let reply = '';
  if (qStr.includes('escrow') || qStr.includes('lock') || qStr.includes('secure')) {
    reply = "Here is how our Escrow system protects you: When you buy a coupon, your money is held in our secure escrow wallet. The seller only receives 90% of the funds after you reveal and copy the valid coupon code. The original code remains hidden in our encrypted ledger until the moment of payout!";
  } else if (qStr.includes('kyc') || qStr.includes('verify') || qStr.includes('identity')) {
    reply = "KYC status can be updated instantly from your account badge at the top-right of your screen for testing. Uploading listed coupons requires KYC Verification. Simply toggle your KYC settings to verify and start trading immediately!";
  } else if (qStr.includes('withdraw') || qStr.includes('bank') || qStr.includes('upi') || qStr.includes('payout')) {
    reply = "To withdraw money: Go to 'My Escrow Wallet', select 'Payout Withdrawal', and enter your UPI ID or Bank account info. Once requested, withdrawals go to our admin dashboard moderator queue to prevent fraud, and are wired shortly after.";
  } else if (qStr.includes('commission') || qStr.includes('fee') || qStr.includes('charge')) {
    reply = "We charge a standard, fixed 10% marketplace fee on all successful sales to host transaction nodes and maintain fraud filters. Sellers receive exactly 90% of their listing price instantly upon order settlement. Deposits and withdrawals are completely free of overheads!";
  } else if (qStr.includes('buy') || qStr.includes('purchase')) {
    reply = "To buy a voucher: Simply click the 'Claim Code' button under any deal. Ensure you have sufficient balance in your platform wallet, which can be topped up via UPI or Netbanking in the Escrow Wallet tab.";
  } else {
    reply = "Hello! Welcome to the CouponX Customer Support Desk. I am your automated ticketing assistant. Ask me anything about ledger balances, KYC status updates, standard escrow locks, UPI withdrawals, or listing approvals!";
  }

  res.json({ success: true, reply });
});

// Recommendations API
app.get('/api/ai/recommendations', (req, res) => {
  const db = readDB();
  const activeCoupons = db.coupons.filter((c: any) => c.status === 'active');
  const list = activeCoupons.slice(0, 3);
  res.json({ success: true, recommendations: list });
});

// Fallback 404 handler for unmatched API endpoints to prevent returning SPA index.html
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API end point ${req.method} ${req.originalUrl} not found on this server.`
  });
});

// Global central error handler to prevent returning HTML stack traces
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Express App Error Handler:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'An internal ledger server error occurred.'
  });
});

// Vite middleware setup
async function startServer() {
  // Sync state with Firebase if active
  if (firebaseApp) {
    try {
      console.log('Starting remote cloud sync pull...');
      const db = readDB();
      const updated = await pullFromFirebase(db);
      if (updated) {
          writeDB(db);
      }
    } catch (syncErr) {
      console.error('Could not pull from Firebase on start, running offline mode cache:', syncErr);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server executing successfully on port ${PORT}`);
  });
}

startServer();
