export interface VoucherCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Voucher {
  id: string;
  brand: string;
  logo: string;
  value: number;
  sellingPrice: number;
  discountPercentage: number;
  category: string;
  sellerId: string;
  sellerName: string;
  expiryDate: string;
  status: 'active' | 'sold' | 'pending' | 'rejected';
  description?: string;
  rating?: number;
  reviewCount?: number;
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'deposit' | 'withdraw' | 'settlement';
  brand?: string;
  amount: number;
  value?: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'success' | 'kyc' | 'info' | 'warning' | 'error';
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  balance: number;
  escrowBalance: number;
  referralCode: string;
}
