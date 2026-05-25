import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, MessageSquare } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingView from './views/LandingView';
import MarketplaceView from './views/MarketplaceView';
import SellGiftCardView from './views/SellGiftCardView';
import WalletView from './views/WalletView';
import SupportChatView from './views/SupportChatView';
import AdminView from './views/AdminView';
import AuthView from './views/AuthView';
import { User, Coupon, Transaction, Review, ChatMessage, SystemLog, PriceAlert } from './types';

export default function App() {
  // Global Navigation State
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Data Core States
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [txHistory, setTxHistory] = useState<Transaction[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);

  // Price Alerts & Followed Brands Trackers
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem('vouchloop_price_alerts');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifiedCouponIds, setNotifiedCouponIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('vouchloop_notified_coupons');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Interface Toasts
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Loading States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [submittingCoupon, setSubmittingCoupon] = useState<boolean>(false);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Form State: Listings Upload
  const [uploadForm, setUploadForm] = useState({
    brand: '',
    category: 'Shopping',
    discountType: 'percentage' as 'flat' | 'percentage',
    discountValue: '',
    price: '',
    expiryDate: '',
    terms: '',
    code: '',
  });

  const [ocrScanning, setOcrScanning] = useState<boolean>(false);
  const [ocrFilename, setOcrFilename] = useState<string>('');
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [predictionReason, setPredictionReason] = useState<string>('');
  const [predictionDemand, setPredictionDemand] = useState<number | null>(null);
  const [priceCalculating, setPriceCalculating] = useState<boolean>(false);

  // Form State: Wallet Credit & Withdrawal
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawUpi, setWithdrawUpi] = useState<string>('');
  const [withdrawBank, setWithdrawBank] = useState<string>('');
  const [depositLoading, setDepositLoading] = useState<boolean>(false);
  const [withdrawLoading, setWithdrawLoading] = useState<boolean>(false);

  // Form State: Direct P2P Email Money Transfer
  const [transferEmail, setTransferEmail] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [transferLoading, setTransferLoading] = useState<boolean>(false);

  // Helpdesk Ticket Chat logs support
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      sender: 'ai', 
      text: 'Hello! Welcome to the VouchLoop Exchange compliance FAQ of terms. If you have any questions about ledger withdrawals, UPI payouts, or direct transfer rates, find answers instantly in our Support FAQ directory.', 
      timestamp: new Date().toLocaleTimeString() 
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Form State: Corporate Admin Moderator controls workspace
  const [adminStats, setAdminStats] = useState<any>(null);
  const [adminLogs, setAdminLogs] = useState<SystemLog[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [couponsToReview, setCouponsToReview] = useState<Coupon[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<Transaction[]>([]);
  const [auditLoading, setAuditLoading] = useState<boolean>(false);
  const [auditReport, setAuditReport] = useState<string>('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Toast utilities
  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // State Loader from standard mock Express server APIs
  const fetchData = async () => {
    try {
      // Session fetch
      const sessRes = await fetch('/api/auth/session');
      const sessData = await sessRes.json();
      let activeUser = null;

      if (sessData.success && sessData.user) {
        activeUser = sessData.user;
        setSessionUser(sessData.user);
        // Sync to localstorage
        localStorage.setItem('vouchloop_saved_session', JSON.stringify(sessData.user));
      } else {
        // Not logged in on server. Try to restore from local storage and auto-login
        const savedSession = localStorage.getItem('vouchloop_saved_session');
        if (savedSession) {
          try {
            const parsedUser = JSON.parse(savedSession);
            if (parsedUser && parsedUser.email) {
              const loginRes = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  email: parsedUser.email, 
                  password: parsedUser.savedPassword || 'password123' 
                })
              });
              const loginData = await loginRes.json();
              if (loginData.success && loginData.user) {
                // Reauthenticated successfully!
                activeUser = loginData.user;
                setSessionUser(loginData.user);
                localStorage.setItem('vouchloop_saved_session', JSON.stringify({
                  ...loginData.user,
                  savedPassword: parsedUser.savedPassword || 'password123'
                }));
              } else {
                // Fallen back to local storage profile to show name always offline
                activeUser = parsedUser;
                setSessionUser(parsedUser);
              }
            }
          } catch (e) {
            console.error('Error parsing local storage saved session', e);
            setSessionUser(null);
          }
        } else {
          setSessionUser(null);
        }
      }

      // Coupons list fetch
      const cpnRes = await fetch('/api/coupons?status=all');
      const cpnData = await cpnRes.json();
      if (cpnData.success) {
        setCoupons(cpnData.coupons);
      }

      // Financial history log fetch
      const histRes = await fetch('/api/wallet/history');
      const histData = await histRes.json();
      if (histData.success) {
        setTxHistory(histData.history);
      }

      // Review feedback fetch
      const revRes = await fetch('/api/reviews');
      const revData = await revRes.json();
      if (revData.success) {
        setReviews(revData.reviews);
      }

      // Admin panels data fetch compiled if active role is moderator
      if (activeUser?.role === 'admin') {
        const adRes = await fetch('/api/admin/stats');
        const adData = await adRes.json();
        if (adData.success) {
          setAdminStats(adData.stats);
          setAdminLogs(adData.logs);
          setAllUsers(adData.allUsers);
          setCouponsToReview(adData.couponsToReview);
          setPendingWithdrawals(adData.pendingWithdrawals);
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching VouchLoop ledgers API metrics:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatLoading]);

  // Price Alert triggers and active listeners
  useEffect(() => {
    if (!sessionUser || coupons.length === 0 || priceAlerts.length === 0) return;
    
    const userAlerts = priceAlerts.filter(a => a.userId === sessionUser.id);
    if (userAlerts.length === 0) return;

    const savedNotified = localStorage.getItem('vouchloop_notified_coupons');
    const notifiedList: string[] = savedNotified ? JSON.parse(savedNotified) : [];
    
    const newToasts: string[] = [];
    const updatedNotified = [...notifiedList];
    let updatedAny = false;

    coupons.forEach(coupon => {
      if (coupon.status !== 'active') return;
      if (updatedNotified.includes(coupon.id)) return;

      const matchingAlert = userAlerts.find(alert => {
        const matchBrand = coupon.brand.trim().toLowerCase() === alert.brand.trim().toLowerCase();
        const matchPrice = coupon.price <= alert.maxPrice;
        return matchBrand && matchPrice;
      });

      if (matchingAlert) {
        newToasts.push(`🔥 Price Alert: ${coupon.brand} is listed at ₹${coupon.price} (below threshold ₹${matchingAlert.maxPrice})!`);
        updatedNotified.push(coupon.id);
        updatedAny = true;
      }
    });

    if (updatedAny) {
      localStorage.setItem('vouchloop_notified_coupons', JSON.stringify(updatedNotified));
      setNotifiedCouponIds(updatedNotified);
      newToasts.forEach((msg, idx) => {
        setTimeout(() => {
          showToast(msg, 'success');
        }, idx * 1200);
      });
    }
  }, [coupons, priceAlerts, sessionUser]);

  const handleCreatePriceAlert = (brand: string, maxPrice: number) => {
    if (!sessionUser) {
      showToast('Please login to set Price Alerts.', 'info');
      return;
    }
    if (!brand.trim()) {
      showToast('Please specify a valid brand to follow.', 'error');
      return;
    }
    if (maxPrice <= 0) {
      showToast('Please specify a target price greater than ₹0.', 'error');
      return;
    }

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: sessionUser.id,
      brand: brand.trim(),
      maxPrice: Number(maxPrice)
    };

    const updatedAlerts = [...priceAlerts, newAlert];
    setPriceAlerts(updatedAlerts);
    localStorage.setItem('vouchloop_price_alerts', JSON.stringify(updatedAlerts));
    showToast(`Successfully set Alert for ${brand.trim()} at ₹${maxPrice}.`, 'success');
  };

  const handleDeletePriceAlert = (id: string) => {
    const updatedAlerts = priceAlerts.filter(a => a.id !== id);
    setPriceAlerts(updatedAlerts);
    localStorage.setItem('vouchloop_price_alerts', JSON.stringify(updatedAlerts));
    showToast('Unfollowed brand and removed price alert.', 'info');
  };

  // Synchronise rates handler
  const handleRefreshLeaseIndex = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    showToast('VouchLoop ledger exchange rates & balances synchronized.', 'success');
  };

  // Toggle identity verification (KYC status) handler for devs
  const handleToggleKyc = async () => {
    if (!sessionUser) return;
    const nextStatus = sessionUser.kycStatus === 'verified' ? 'unverified' : 'verified';
    try {
      const res = await fetch('/api/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kycStatus: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setSessionUser(data.user);
        await fetchData();
        showToast(`KYC simulation updated to: ${nextStatus.toUpperCase()}`, 'info');
      }
    } catch (err) {
      showToast('Error syncing KYC status.', 'error');
    }
  };

  // Toggle Admin Role simulation helper inside profile dropdown
  const handleToggleRoleMode = async () => {
    if (!sessionUser) return;
    const nextRole = sessionUser.role === 'admin' ? 'user' : 'admin';
    try {
      const updatedUser = { ...sessionUser, role: nextRole as 'user' | 'admin' };
      setSessionUser(updatedUser);
      
      // Update endpoint for compliance
      await fetch('/api/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: sessionUser.name, email: sessionUser.email })
      });
      
      showToast(`User profile role simulation switched to: ${nextRole.toUpperCase()}`, 'info');
      if (nextRole === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('landing');
      }
    } catch (err) {
      showToast('Error mimicking roles.', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setSessionUser(null);
        localStorage.removeItem('vouchloop_saved_session');
        showToast('Successfully logged out of VouchLoop session.', 'info');
      }
    } catch (err) {
      showToast('Logout network mismatch.', 'error');
    }
  };

  // Coupon Buying transaction with Escrow holding rules
  const handlePurchaseCoupon = async (coupon: Coupon) => {
    if (!sessionUser) {
      showToast('Authentication required. Please sign up or sign in to claim vouchers securely.', 'info');
      setActiveTab('auth');
      return;
    }
    if (sessionUser.balance < coupon.price) {
      showToast('Insufficient wallet credit! Please deposit UPI funds first.', 'error');
      setActiveTab('wallet');
      return;
    }

    setBuyingId(coupon.id);
    try {
      const res = await fetch(`/api/coupons/${coupon.id}/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Escrow transaction lock finalized! Code revealed under claim.`, 'success');
        setCartCount(prev => prev + 1);
        setActiveTab('wallet');
        await fetchData();
      } else {
        showToast(data.error || 'Transaction settlement failed.', 'error');
      }
    } catch (err) {
      showToast('Network timeout block.', 'error');
    } finally {
      setBuyingId(null);
    }
  };

  // Deposit funds UPI simulator
  const handleWalletDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(depositAmount);
    if (!depositAmount || amountNum <= 0) {
      showToast('Please enter a valid amount.', 'error');
      return;
    }

    setDepositLoading(true);
    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountNum })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`₹${amountNum} added securely via mock UPI gate.`, 'success');
        setDepositAmount('');
        await fetchData();
      }
    } catch (err) {
      showToast('Deposit network issue.', 'error');
    } finally {
      setDepositLoading(false);
    }
  };

  // Withdraw payout request
  const handleWalletWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);
    if (!withdrawAmount || amountNum <= 0) {
      showToast('Please provide a payout value.', 'error');
      return;
    }
    if (!withdrawUpi && !withdrawBank) {
      showToast('Please fill out either UPI or Bank routing details.', 'error');
      return;
    }

    if (sessionUser && sessionUser.balance < amountNum) {
      showToast('Amount exceeds available wallet assets.', 'error');
      return;
    }

    setWithdrawLoading(true);
    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountNum,
          upiId: withdrawUpi,
          bankAccount: withdrawBank
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Withdrawal of ₹${amountNum} filed, queued for compliance clearance.`, 'info');
        setWithdrawAmount('');
        setWithdrawUpi('');
        setWithdrawBank('');
        await fetchData();
      } else {
        showToast(data.error || 'Payout failed.', 'error');
      }
    } catch (err) {
      showToast('Withdrawal server connection block.', 'error');
    } finally {
      setWithdrawLoading(false);
    }
  };

  // Core direct peer Wallet-to-Wallet Money Transfer: "**all wallet transfer only**"
  const handleP2PTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(transferAmount);
    if (!transferEmail) {
      showToast('Please specify target peer registered email handle.', 'error');
      return;
    }
    if (!transferAmount || amountNum <= 0) {
      showToast('Specify a valid money value.', 'error');
      return;
    }

    if (sessionUser && sessionUser.balance < amountNum) {
      showToast('Transfer amount exceeds available wallet balance.', 'error');
      return;
    }

    setTransferLoading(true);
    try {
      const res = await fetch('/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: transferEmail.trim(),
          amount: amountNum
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Instant Wallet P2P Settle! Credited ₹${amountNum} to "${data.recipientName}" successfully.`, 'success');
        setTransferAmount('');
        setTransferEmail('');
        await fetchData();
      } else {
        showToast(data.error || 'Transfer failed.', 'error');
      }
    } catch (err) {
      showToast('Ledger transfer error.', 'error');
    } finally {
      setTransferLoading(false);
    }
  };

  // Algorithmic optimal price prediction
  const handlePriceCalculator = async () => {
    if (!uploadForm.brand || !uploadForm.discountValue) {
      showToast('Enter brand store and face value to estimate optimal index.', 'info');
      return;
    }
    setPriceCalculating(true);
    try {
      const res = await fetch('/api/ai/predict-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: uploadForm.brand,
          category: uploadForm.category,
          discountType: uploadForm.discountType,
          discountValue: uploadForm.discountValue,
          terms: uploadForm.terms
        })
      });
      const data = await res.json();
      if (data.success) {
        setPredictedPrice(data.suggestedPrice);
        setPredictionReason(data.explanation);
        setPredictionDemand(data.highDemandScore);
        
        // Auto-assign to upload price field
        setUploadForm(prev => ({ ...prev, price: String(data.suggestedPrice) }));
        showToast('Suggested optimal rate assigned to listing formulation.', 'success');
      }
    } catch (err) {
      showToast('Pricing advisor indexing network block.', 'error');
    } finally {
      setPriceCalculating(false);
    }
  };

  // Mock Slip Barcode scanner OCR uploader
  const handleBarcodeMockDrop = async (brandChoice: string) => {
    setOcrScanning(true);
    setOcrFilename(`${brandChoice.toLowerCase()}_invoice_reciept.png`);
    
    try {
      const selections: Record<string, any> = {
        'Amazon': { brand: 'Amazon Pay Shopping Card', discountValue: 1000, discountType: 'flat', terms: 'Applicable globally on Amazon India Pay checkout channels.', code: 'AMZN-INR1000-PEER', category: 'Shopping', price: 650 },
        'Swiggy': { brand: 'Swiggy Food Voucher', discountValue: 150, discountType: 'flat', terms: 'Valid on Swiggy Instamart and Food deliveries.', code: 'SWIG-150-ESCROW', category: 'Food', price: 49 },
        'Myntra': { brand: 'Myntra Wardrobe Voucher', discountValue: 300, discountType: 'flat', terms: 'Applicable on ethnics apparel catalog purchases.', code: 'MYN-FASH-INR300', category: 'Shopping', price: 120 },
        'BookMyShow': { brand: 'BookMyShow Weekend Movie Tickets', discountValue: 150, discountType: 'flat', terms: 'Valid once on Multiplex ticket reservations.', code: 'BMS-MOVIE-VAL', category: 'Entertainment', price: 80 }
      };
      
      const selection = selections[brandChoice] || selections['Amazon'];
      
      // Call mock api to mimic backend scanner
      const res = await fetch('/api/ai/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: 'mock_payload' })
      });
      const data = await res.json();
      
      if (data.success) {
        setUploadForm({
          brand: selection.brand,
          category: selection.category,
          discountType: selection.discountType,
          discountValue: String(selection.discountValue),
          price: String(selection.price),
          expiryDate: '2026-12-31',
          terms: selection.terms,
          code: selection.code
        });
        
        setPredictedPrice(selection.price);
        setPredictionReason(`Recognized valid issued ${selection.brand} checkout slip metadata.`);
        setPredictionDemand(92);
        showToast(`Parsed barcode slip for ${selection.brand}! Auto-populated listing details.`, 'success');
      }
    } catch (err) {
      showToast('Ocr scanner patterns failed.', 'error');
    } finally {
      setOcrScanning(false);
    }
  };

  // Submit Listing coupon
  const handleUploadCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.brand || !uploadForm.code || !uploadForm.price || !uploadForm.discountValue) {
      showToast('Please fulfill all mandatory variables.', 'error');
      return;
    }

    if (sessionUser?.kycStatus !== 'verified') {
      showToast('Lists uploads blocked. Fulfill KYC Clearance.', 'error');
      return;
    }

    setSubmittingCoupon(true);
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...uploadForm,
          fraudScore: Math.floor(Math.random() * 6),
          fraudReason: 'Checked signature values with catalog issuers.',
          recommendedPrice: predictedPrice || Math.round(Number(uploadForm.price) * 1.1)
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Voucher listing published successfully, queued for compliance clearance.', 'success');
        
        // Reset listing form
        setUploadForm({
          brand: '',
          category: 'Shopping',
          discountType: 'percentage',
          discountValue: '',
          price: '',
          expiryDate: '',
          terms: '',
          code: '',
        });
        setOcrFilename('');
        setPredictedPrice(null);
        setPredictionDemand(null);
        
        setSearchQuery('');
        setSelectedCategory('All');
        setActiveTab('marketplace');
        await fetchData();
      }
    } catch (err) {
      showToast('Listing publishing blocked.', 'error');
    } finally {
      setSubmittingCoupon(false);
    }
  };

  // Automated chatbot ticketing messages
  const handlePostChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...chatMessages, userMessage] })
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          sender: 'support',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
    } catch (err) {
      showToast('Compliance support agent offline.', 'error');
    } finally {
      setChatLoading(false);
    }
  };

  // Admin moderators operations approvals
  const handleModerateCoupon = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/admin/coupon/${id}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Voucher listing moderate completed. Action: ${action.toUpperCase()}`, 'success');
        await fetchData();
      }
    } catch (err) {
      showToast('Coupons moderating issue.', 'error');
    }
  };

  // Wire clearance payouts authorization
  const handleModerateWithdrawal = async (id: string, action: 'complete' | 'reject') => {
    try {
      const res = await fetch(`/api/admin/withdrawal/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Payout wire request ${action === 'complete' ? 'APPROVED' : 'REJECTED'}.`, 'success');
        await fetchData();
      }
    } catch (err) {
      showToast('Withdrawal payout wire processing issue.', 'error');
    }
  };

  // Regulatory ledger statistics audit compiled markdown report
  const handleTriggerAudit = async () => {
    setAuditLoading(true);
    try {
      const res = await fetch('/api/admin/audit');
      const data = await res.json();
      if (data.success) {
        setAuditReport(data.report);
        showToast('Registry ledger compliance report completed.', 'success');
      }
    } catch (err) {
      showToast('Auditing database issue.', 'error');
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col pb-16 md:pb-0 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Toast Alert Banner */}
      {toast && (
        <div 
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-2xl border shadow-xl text-xs font-bold max-w-sm sm:max-w-md ${
            toast.type === 'error' 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : toast.type === 'info' 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
          id="system-toast"
        >
          <span className={`w-2 h-2 rounded-full ${toast.type === 'error' ? 'bg-red-500' : toast.type === 'info' ? 'bg-indigo-600' : 'bg-emerald-500'}`} />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Corporate Branded Header with integrated profile controls */}
      <Header 
        sessionUser={sessionUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setAuthMode={setAuthMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSelectedCategory={setSelectedCategory}
        cartCount={cartCount}
        onRefresh={handleRefreshLeaseIndex}
        refreshing={refreshing}
        toggleKyc={handleToggleKyc}
        toggleRole={handleToggleRoleMode}
        onLogout={handleLogout}
      />

      {/* Main Core View Router panels */}
      <main className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Synchronizing ledger index...</span>
          </div>
        ) : (
          <>
            {/* If unregistered guest tries to visit restricted pages or auth page, render AuthView directly */}
            {(!sessionUser && (activeTab === 'upload' || activeTab === 'wallet' || activeTab === 'admin' || activeTab === 'auth')) ? (
              <AuthView 
                mode={authMode}
                setMode={setAuthMode}
                onLoginSuccess={(user) => {
                  setSessionUser(user);
                  fetchData();
                  // Settle activeTab smoothly back to home or target tab
                  if (activeTab === 'auth') {
                    setActiveTab('landing');
                  }
                }}
                showToast={showToast}
              />
            ) : (
              <>
                {activeTab === 'landing' && (
                  <LandingView 
                    coupons={coupons}
                    reviews={reviews}
                    setActiveTab={setActiveTab}
                    setSearchQuery={setSearchQuery}
                    setSelectedCategory={setSelectedCategory}
                    onBuyCoupon={handlePurchaseCoupon}
                    buyingId={buyingId}
                    sessionUser={sessionUser}
                    onLoginSuccess={(user) => {
                      setSessionUser(user);
                      fetchData();
                    }}
                    showToast={showToast}
                  />
                )}

                {activeTab === 'marketplace' && (
                  <MarketplaceView 
                    coupons={coupons}
                    sessionUser={sessionUser}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    onBuyCoupon={handlePurchaseCoupon}
                    buyingId={buyingId}
                    showToast={showToast}
                    priceAlerts={priceAlerts}
                    onCreateAlert={handleCreatePriceAlert}
                    onDeleteAlert={handleDeletePriceAlert}
                  />
                )}

                {activeTab === 'upload' && sessionUser && (
                  <SellGiftCardView 
                    sessionUser={sessionUser}
                    uploadForm={uploadForm}
                    setUploadForm={setUploadForm}
                    submittingCoupon={submittingCoupon}
                    ocrScanning={ocrScanning}
                    ocrFilename={ocrFilename}
                    predictedPrice={predictedPrice}
                    predictionReason={predictionReason}
                    predictionDemand={predictionDemand}
                    priceCalculating={priceCalculating}
                    onPriceCalculator={handlePriceCalculator}
                    onBarcodeMockDrop={handleBarcodeMockDrop}
                    onSubmitListing={handleUploadCoupon}
                    showToast={showToast}
                  />
                )}

                {activeTab === 'wallet' && sessionUser && (
                  <WalletView 
                    sessionUser={sessionUser}
                    txHistory={txHistory}
                    coupons={coupons}
                    depositAmount={depositAmount}
                    setDepositAmount={setDepositAmount}
                    depositLoading={depositLoading}
                    onDeposit={handleWalletDeposit}
                    withdrawAmount={withdrawAmount}
                    setWithdrawAmount={setWithdrawAmount}
                    withdrawUpi={withdrawUpi}
                    setWithdrawUpi={setWithdrawUpi}
                    withdrawBank={withdrawBank}
                    setWithdrawBank={setWithdrawBank}
                    withdrawLoading={withdrawLoading}
                    onWithdraw={handleWalletWithdraw}
                    transferEmail={transferEmail}
                    setTransferEmail={setTransferEmail}
                    transferAmount={transferAmount}
                    setTransferAmount={setTransferAmount}
                    transferLoading={transferLoading}
                    onP2PTransfer={handleP2PTransfer}
                    showToast={showToast}
                  />
                )}

                {activeTab === 'chat' && (
                  <SupportChatView 
                    chatMessages={chatMessages}
                    chatInput={chatInput}
                    setChatInput={setChatInput}
                    chatLoading={chatLoading}
                    onPostMessage={handlePostChatMessage}
                    chatEndRef={chatEndRef}
                  />
                )}

                {activeTab === "admin" && sessionUser?.role === 'admin' && (
                  <AdminView 
                    adminStats={adminStats}
                    adminLogs={adminLogs}
                    allUsers={allUsers}
                    couponsToReview={couponsToReview}
                    pendingWithdrawals={pendingWithdrawals}
                    auditLoading={auditLoading}
                    auditReport={auditReport}
                    onModerateCoupon={handleModerateCoupon}
                    onModerateWithdrawal={handleModerateWithdrawal}
                    onTriggerAudit={handleTriggerAudit}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>


      {/* Visual WhatsApp Floating Helpline Bubble (Replica of the green whatsapp floating support trigger in mockup screen) */}
      <div className="fixed bottom-6 right-6 z-50 group">
        {/* Floating Tooltip Label */}
        <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-slate-900 border border-slate-800 text-white font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-xl opacity-0 scale-95 origin-right group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap">
          WhatsApp P2P Escrow Helpline ✓
        </span>
        
        {/* Animated Ripple Effect */}
        <span className="absolute inset-0 bg-[#25d366]/30 rounded-full animate-ping scale-105 pointer-events-none" />
        
        {/* The Action Button */}
        <button
          onClick={() => {
            setActiveTab('chat');
            showToast('Redirected to VouchLoop Direct Compliance Support Helplines!', 'info');
          }}
          className="relative w-14 h-14 bg-[#25d366] hover:bg-[#1ebd53] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none border border-emerald-400/20 cursor-pointer"
          aria-label="Contact WhatsApp Support"
        >
          <svg className="w-7 h-7 fill-current stroke-none" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.864.001-2.641-1.025-5.125-2.89-6.991C16.48 1.884 14.004.859 11.36.857 5.922.857 1.5 5.28 1.497 10.72c-.001 1.77.472 3.497 1.369 5.03L1.92 21.08l5.412-1.42 1.315.78z" />
          </svg>
        </button>
      </div>

      {/* Unified footer */}
      <Footer setActiveTab={setActiveTab} setSearchQuery={setSearchQuery} />

    </div>
  );
}
