export type KycStatus = 'unverified' | 'pending' | 'verified';
export type CouponStatus = 'pending' | 'active' | 'sold' | 'rejected';
export type TransactionType = 'purchase' | 'withdrawal' | 'deposit' | 'payout' | 'commission';
export type LogLevel = 'info' | 'warning' | 'error';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  kycStatus: KycStatus;
  balance: number;
  referralCode: string;
  referredBy?: string;
  avatar?: string;
  isPremium?: boolean;
}

export interface Coupon {
  id: string;
  brand: string;
  code: string; // Encrypted/hidden till purchased!
  description?: string;
  category: string;
  discountType: 'flat' | 'percentage';
  discountValue: number;
  expiryDate: string;
  terms: string;
  price: number;
  sellerId: string;
  sellerName: string;
  status: CouponStatus;
  image?: string;
  ocrExtracted: boolean;
  fraudScore: number; // 0 to 100 risk score
  fraudReason?: string;
  recommendedPrice?: number;
  isFeatured?: boolean;
}

export interface Transaction {
  id: string;
  buyerId?: string;
  buyerName?: string;
  sellerId?: string;
  sellerName?: string;
  couponId?: string;
  couponBrand?: string;
  amount: number;
  fee: number; // Marketplace commission (e.g., 10%)
  type: TransactionType;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  referenceUpiOrBank?: string;
  gateway?: string;
}

export interface Review {
  id: string;
  couponId?: string;
  brand: string;
  rating: number;
  comment: string;
  reviewerName: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'support';
  text: string;
  timestamp: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  event: string;
  module: string;
  user?: string;
}

export interface BrandStats {
  brand: string;
  listingsCount: number;
  avgDiscount: number;
  successRate: number;
}

export interface PriceAlert {
  id: string;
  userId: string;
  brand: string;
  maxPrice: number;
}

