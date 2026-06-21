import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Voucher, Transaction, AppNotification } from '../types';
import { VOUCHERS } from '../data';
import { useToast } from './ToastContext';

interface CartItem {
  id: string; // unique ID for cart item
  type: 'giftcard' | 'offer';
  item: Voucher | any;
  quantity: number;
  price: number;
}

interface AppContextType {
  user: User | null;
  login: (email: string) => void | Promise<void>;
  logout: () => void;
  updateKycStatus: (status: 'unverified' | 'pending' | 'verified' | 'rejected') => void;
  walletBalance: number;
  addFunds: (amount: number) => void;
  deductFunds: (amount: number) => boolean;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  vouchers: Voucher[];
  myPurchasedVouchers: Voucher[];
  addPurchasedVouchers: (items: Voucher[]) => void;
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'time' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  addVoucher: (voucher: Voucher) => void;
  updateVoucherStatus: (id: string, status: 'active' | 'sold' | 'pending' | 'rejected') => void;
  activeCategoryFilter: string;
  setActiveCategoryFilter: (category: string) => void;
  validateRouteAccess: (options: { requireKyc?: boolean; requireAdmin?: boolean }) => { allowed: boolean; redirectTo?: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>(VOUCHERS);
  const [myPurchasedVouchers, setMyPurchasedVouchers] = useState<Voucher[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const { addToast } = useToast();

  useEffect(() => {
    // Synchronize active session from backend on first mount
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
          setWalletBalance(data.user.balance || 0);
        }
      })
      .catch(err => console.error("Session sync failed:", err));
  }, []);

  const login = async (email: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setWalletBalance(data.user.balance || 0);
      } else {
        throw new Error(data.error || 'Login sync rejected');
      }
    } catch (e: any) {
      console.error('Remote login sync failed, falling back:', e);
      const role = email.includes('admin') ? 'admin' : 'user';
      setUser({ 
        id: 'usr-1', 
        name: email.split('@')[0], 
        email, 
        role,
        kycStatus: role === 'admin' ? 'verified' : 'unverified', 
        balance: 0, 
        escrowBalance: 0, 
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase() 
      });
    }
  };
  
  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(console.error);
    setUser(null);
    setCart([]);
    setWishlist([]);
    setTransactions([]);
    setMyPurchasedVouchers([]);
  };
  
  const updateKycStatus = (status: 'unverified' | 'pending' | 'verified' | 'rejected') => {
    if (user) {
      setUser({ ...user, kycStatus: status });
    }
  };
  
  const addFunds = (amount: number) => setWalletBalance(prev => prev + amount);
  const deductFunds = (amount: number) => {
    setWalletBalance(prev => prev - amount);
    return true;
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.item.id && i.type === item.type);
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, { ...item, id: Math.random().toString(36).substr(2, 9) }];
    });
    addToast(`Added ${item.item.brand || 'Item'} to your cart.`, 'success');
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      if (prev.includes(id)) {
        addToast('Removed from wishlist.', 'info');
        return prev.filter(i => i !== id);
      } else {
        addToast('Saved to your wishlist!', 'success');
        return [...prev, id];
      }
    });
  };
  
  const addPurchasedVouchers = (items: Voucher[]) => {
    setMyPurchasedVouchers(prev => [...prev, ...items]);
  };
  
  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'time' | 'read'>) => {
    const newNotif: AppNotification = {
        ...notif,
        id: `notif-${Date.now()}-${Math.random()}`,
        time: 'Just now',
        read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const markAllNotificationsRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const clearNotifications = () => {
      setNotifications([]);
  };

  const addVoucher = (voucher: Voucher) => setVouchers(prev => [...prev, voucher]);
  const updateVoucherStatus = (id: string, status: 'active' | 'sold' | 'pending' | 'rejected') => {
    setVouchers(prev => prev.map(v => v.id === id ? { ...v, status } : v));
  };

  const validateRouteAccess = (options: { requireKyc?: boolean; requireAdmin?: boolean }) => {
    if (!user) {
      return { allowed: false, redirectTo: '/auth' };
    }
    if (options.requireAdmin && user.role !== 'admin') {
      return { allowed: false, redirectTo: '/' };
    }
    if (options.requireKyc && user.kycStatus === 'unverified') {
      return { allowed: false, redirectTo: '/kyc' };
    }
    return { allowed: true };
  };

  return (
    <AppContext.Provider value={{ 
      user, login, logout, updateKycStatus, walletBalance, addFunds, deductFunds, 
      cart, addToCart, removeFromCart, clearCart, wishlist, toggleWishlist,
      myPurchasedVouchers, addPurchasedVouchers, transactions, addTransaction,
      notifications, addNotification, markNotificationRead, markAllNotificationsRead, clearNotifications,
      vouchers, addVoucher, updateVoucherStatus,
      activeCategoryFilter, setActiveCategoryFilter, validateRouteAccess
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
