import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Lock,
  Unlock,
  Plus,
  Copy,
  Calendar,
  CreditCard,
  QrCode,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { User, Transaction, Coupon } from '../types';

const renderBrandLogo = (brandName: string) => {
  const normalized = brandName ? brandName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
  
  if (normalized.includes('amazon')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-amber-500/30 flex flex-col items-center justify-center font-black select-none flex-shrink-0 relative overflow-hidden">
        <span className="text-[10px] text-white tracking-tighter leading-none font-sans">amazon</span>
        <span className="text-[11px] text-[#FF9900] leading-none -mt-0.5 font-bold">↵</span>
      </div>
    );
  }
  
  if (normalized.includes('flipkart')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#2874f0] border border-blue-400/20 flex flex-col items-center justify-center font-extrabold text-white select-none flex-shrink-0 relative">
        <span className="text-[9px] tracking-tight leading-none uppercase">Flipkart</span>
        <span className="text-[8px] text-yellow-300 font-black leading-none mt-0.5">★</span>
      </div>
    );
  }
  
  if (normalized.includes('ajio')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1b1c1e] to-[#402026] border border-rose-900/30 flex items-center justify-center font-black text-rose-100 select-none flex-shrink-0">
        <span className="text-xs uppercase tracking-widest font-serif scale-y-110">AJIO</span>
      </div>
    );
  }
  
  if (normalized.includes('swiggy')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-orange-500 border border-orange-400/20 flex items-center justify-center font-black text-white select-none flex-shrink-0">
        <span className="text-sm tracking-tighter italic font-serif">S</span>
      </div>
    );
  }
  
  if (normalized.includes('zomato')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#e23744] border border-red-500/20 flex items-center justify-center font-black text-white select-none flex-shrink-0">
        <span className="text-xs tracking-tighter lowercase font-bold">zomato</span>
      </div>
    );
  }
  
  if (normalized.includes('myntra')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-500 to-amber-400 border border-pink-400/20 flex items-center justify-center font-black text-white select-none flex-shrink-0 shadow-xs">
        <span className="text-sm tracking-tighter font-serif">M</span>
      </div>
    );
  }
  
  if (normalized.includes('bookmyshow') || normalized.includes('bms')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#EC1C24] border border-red-600/25 flex flex-col items-center justify-center font-extrabold text-white select-none flex-shrink-0">
        <span className="text-[8px] uppercase tracking-tighter leading-none">BMyS</span>
        <span className="text-[8px] leading-none mt-0.5">🎟️</span>
      </div>
    );
  }

  if (normalized.includes('puma')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-black border border-zinc-800 flex items-center justify-center font-extrabold text-white select-none flex-shrink-0">
        <span className="text-[8px] tracking-widest uppercase font-mono">PUMA</span>
      </div>
    );
  }

  if (normalized.includes('lakme')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800/40 flex items-center justify-center font-serif text-[9px] tracking-widest font-bold text-amber-200 uppercase select-none flex-shrink-0">
        LAKMÉ
      </div>
    );
  }

  if (normalized.includes('fastrack')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex flex-col items-center justify-center font-black select-none flex-shrink-0">
        <span className="text-[8px] tracking-tighter uppercase leading-none text-yellow-500">FAST</span>
        <span className="text-[8px] tracking-widest uppercase leading-none text-white font-black">RCK</span>
      </div>
    );
  }

  if (normalized.includes('yatra')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 border border-red-400/20 flex flex-col items-center justify-center font-black text-white select-none flex-shrink-0 relative">
        <span className="text-[10px] tracking-tighter uppercase leading-none italic font-serif">yatra</span>
        <span className="text-[9px] leading-none mt-0.5">✈️</span>
      </div>
    );
  }

  // General fallback
  const displayChar = brandName.trim() ? brandName.trim().charAt(0).toUpperCase() : 'V';
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-black text-base select-none flex-shrink-0 shadow-xs">
      {displayChar}
    </div>
  );
};

interface WalletViewProps {
  sessionUser: User | null;
  txHistory: Transaction[];
  coupons: Coupon[];
  depositAmount: string;
  setDepositAmount: (val: string) => void;
  depositLoading: boolean;
  onDeposit: (e: React.FormEvent) => void;
  withdrawAmount: string;
  setWithdrawAmount: (val: string) => void;
  withdrawUpi: string;
  setWithdrawUpi: (val: string) => void;
  withdrawBank: string;
  setWithdrawBank: (val: string) => void;
  withdrawLoading: boolean;
  onWithdraw: (e: React.FormEvent) => void;
  
  // Peer Transfer Actions
  transferEmail: string;
  setTransferEmail: (val: string) => void;
  transferAmount: string;
  setTransferAmount: (val: string) => void;
  transferLoading: boolean;
  onP2PTransfer: (e: React.FormEvent) => void;
  
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function WalletView({
  sessionUser,
  txHistory,
  coupons,
  depositAmount,
  setDepositAmount,
  depositLoading,
  onDeposit,
  withdrawAmount,
  setWithdrawAmount,
  withdrawUpi,
  setWithdrawUpi,
  withdrawBank,
  setWithdrawBank,
  withdrawLoading,
  onWithdraw,
  transferEmail,
  setTransferEmail,
  transferAmount,
  setTransferAmount,
  transferLoading,
  onP2PTransfer,
  showToast
}: WalletViewProps) {

  // Ledger Filters
  const [filterType, setFilterType] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Payment gateways
  const [selectedGateway, setSelectedGateway] = useState<'stripe' | 'razorpay'>('stripe');
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [checkoutProcessing, setCheckoutProcessing] = useState<boolean>(false);
  
  // Card Details for Stripe Simulator
  const [stripeCardName, setStripeCardName] = useState<string>('');
  const [stripeCardNum, setStripeCardNum] = useState<string>('');
  const [stripeCardExpiry, setStripeCardExpiry] = useState<string>('');
  const [stripeCardCvc, setStripeCardCvc] = useState<string>('');

  // Razorpay simulator
  const [razorpayUpiId, setRazorpayUpiId] = useState<string>('');
  const [countdownSeconds, setCountdownSeconds] = useState<number>(300);

  // Verification & Unlocking States for purchased vouchers
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [activeUnlockingItem, setActiveUnlockingItem] = useState<Coupon | null>(null);
  const [verificationStep, setVerificationStep] = useState<number>(1);
  const [verificationProgress, setVerificationProgress] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Parse unlocked vouchers list from localStore on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('unlocked_vouchers');
      if (stored) {
        setUnlockedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Razorpay Timer Simulator
  useEffect(() => {
    let timer: any;
    if (showCheckoutModal && selectedGateway === 'razorpay' && countdownSeconds > 0) {
      timer = setInterval(() => {
        setCountdownSeconds(prev => prev - 1);
      }, 1000);
    } else {
      setCountdownSeconds(300);
    }
    return () => clearInterval(timer);
  }, [showCheckoutModal, selectedGateway]);

  // Identify cards bought by this user
  const purchasedCoupons = coupons.filter(coupon => {
    return txHistory.some(tx => 
      tx.type === 'purchase' && 
      tx.buyerId === sessionUser?.id && 
      tx.couponId === coupon.id
    );
  });

  const getCounterpartyText = (tx: Transaction) => {
    if (!sessionUser) return '';
    if (tx.type === 'deposit') {
      return tx.referenceUpiOrBank ? `Ref: ${tx.referenceUpiOrBank}` : 'Linked Settle Topup';
    }
    if (tx.type === 'withdrawal') {
      return 'Instant Payout Wire';
    }
    const isBuyer = tx.buyerId === sessionUser.id;
    if (isBuyer) {
      return tx.sellerName ? `Bought from peer: ${tx.sellerName}` : 'Market Escrow';
    } else {
      return tx.buyerName ? `Sold to peer: ${tx.buyerName}` : 'Market Escrow Release';
    }
  };

  const filteredTxHistory = txHistory.filter(tx => {
    if (filterType !== 'all' && tx.type !== filterType) {
      return false;
    }
    if (startDate) {
      const sDate = new Date(startDate);
      sDate.setHours(0, 0, 0, 0);
      const txDate = new Date(tx.date);
      if (txDate < sDate) return false;
    }
    if (endDate) {
      const eDate = new Date(endDate);
      eDate.setHours(23, 59, 59, 999);
      const txDate = new Date(tx.date);
      if (txDate > eDate) return false;
    }
    return true;
  });

  const preseededPeers = [
    { name: 'Rohan Sharma', email: 'rohan@example.in' },
    { name: 'Priya Patel', email: 'priya@patel.co.in' },
    { name: 'Affiliate Bulk', email: 'retail@coupons.in' }
  ];

  const handleShortcutClick = (email: string) => {
    setTransferEmail(email);
    showToast(`Recipient email assigned: ${email}`, 'info');
  };

  const handleDepositTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = Number(depositAmount);
    if (!depositAmount || amountVal <= 0) {
      showToast('Please specify a valid numeric value.', 'error');
      return;
    }
    if (amountVal < 100) {
      showToast('Minimum deposit amount is ₹100.', 'info');
      return;
    }
    
    // Autofill simulated card details
    setStripeCardName(sessionUser?.name || 'Verified Trader');
    setStripeCardNum('4242 •••• •••• 4242');
    setStripeCardExpiry('12/29');
    setStripeCardCvc('884');
    setRazorpayUpiId(sessionUser ? `${sessionUser.email.split('@')[0]}@okhdfcbank` : 'trader@paytm');
    setShowCheckoutModal(true);
  };

  const handleSecureCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutProcessing(true);
    
    setTimeout(async () => {
      try {
        const res = await fetch('/api/wallet/deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount: Number(depositAmount),
            gateway: selectedGateway,
            reference: selectedGateway === 'stripe' ? 'ch_st_live_' + Math.random().toString(36).substring(2, 9) : 'pay_rz_inr_' + Math.random().toString(36).substring(2, 9)
          })
        });
        const data = await res.json();
        
        if (data.success) {
          showToast(`₹${Number(depositAmount).toLocaleString('en-IN')} added via ${selectedGateway === 'stripe' ? 'Stripe' : 'Razorpay'}!`, 'success');
          setDepositAmount('');
          setShowCheckoutModal(false);
          onDeposit(new Event('submit') as any);
        } else {
          showToast(data.error || 'Payment declined.', 'error');
        }
      } catch (err) {
        showToast('Gateway connection error.', 'error');
      } finally {
        setCheckoutProcessing(false);
      }
    }, 1800);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    showToast('Code copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 3000);
  };

  const startUnlockingFlow = (coupon: Coupon) => {
    setActiveUnlockingItem(coupon);
    setVerificationStep(1);
    setVerificationProgress(0);
  };

  const executeCheckingStep = () => {
    if (verificationStep === 1) {
      setVerificationStep(2);
      setVerificationProgress(40);
      showToast('Connecting to brand API servers...', 'info');
    } else if (verificationStep === 2) {
      setVerificationStep(3);
      setVerificationProgress(80);
      showToast('Analyzing code balance integrity...', 'info');
    } else if (verificationStep === 3) {
      if (activeUnlockingItem) {
        const updated = [...unlockedIds, activeUnlockingItem.id];
        setUnlockedIds(updated);
        localStorage.setItem('unlocked_vouchers', JSON.stringify(updated));
        
        showToast('Voucher cleared & escrow payout distributed to seller!', 'success');
      }
      setActiveUnlockingItem(null);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Page Title */}
      <div className="flex flex-col border-b border-zinc-150/60 pb-5">
        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Financial Ledger</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your Assets Portfolio</h1>
        <p className="text-xs text-slate-500 mt-1">
          Top up funds, process instant bank payouts, convert voucher pins, or transfer liquidity.
        </p>
      </div>

      {/* Main Grid: Header Balance Spotlight + Actions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Balance Card Section */}
        <div className="bg-zinc-950 text-white p-6 rounded-3xl border border-zinc-850 flex flex-col justify-between min-h-[160px] relative overflow-hidden shadow-md">
          <div className="space-y-1 z-10 text-left">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest block">Available Cash Balance</span>
            <p className="text-3xl font-black tracking-tight text-white leading-none">
              ₹{sessionUser?.balance?.toLocaleString('en-IN') || '0'}.00
            </p>
          </div>

          <div className="border-t border-zinc-900 pt-3 z-10 flex justify-between items-center text-[10px] text-zinc-400">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Settle Guarantee Core Active</span>
            </div>
            <Wallet className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        </div>

        {/* Deposit Quick Form */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/60 flex flex-col justify-between text-left">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-450 tracking-wider">Topup Wallet Funds</h3>
            <form onSubmit={handleDepositTrigger} className="space-y-3">
              <input 
                type="number"
                placeholder="Enter value e.g. 500"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 font-medium"
              />
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl block transition-all cursor-pointer"
              >
                Topup Balance (₹)
              </button>
            </form>
          </div>
        </div>

        {/* Peer-to-Peer Wallet Transfer */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/60 flex flex-col justify-between text-left">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-450 tracking-wider">P2P Wallet Transfer</h3>
            <form onSubmit={onP2PTransfer} className="space-y-2">
              <input 
                type="email"
                placeholder="Target email handle"
                value={transferEmail}
                onChange={(e) => setTransferEmail(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 text-slate-800 text-xs px-3 py-1.5 rounded-lg focus:outline-none font-medium"
              />
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="number"
                  placeholder="Sum (₹)"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 text-slate-800 text-xs px-3 py-1.5 rounded-lg focus:outline-none font-medium"
                />
                <button 
                  type="submit"
                  disabled={transferLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 text-white font-bold text-xs py-1.5 rounded-lg transition-all"
                >
                  Send
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {preseededPeers.map(peer => (
                <button
                  key={peer.email}
                  type="button"
                  onClick={() => handleShortcutClick(peer.email)}
                  className="bg-zinc-50 border border-zinc-150 rounded-lg px-2 py-1 text-[9px] font-bold text-slate-600 hover:bg-zinc-100"
                >
                  {peer.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Grid: Cash Withdrawal Form + Purchased Voucher Unlocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        
        {/* Cash Withdrawal Form */}
        <div className="bg-white border border-zinc-200/60 p-6 sm:p-8 rounded-3xl text-left space-y-5">
          <h2 className="text-xs font-bold uppercase text-slate-450 tracking-wider">Withdraw Cash Assets</h2>
          <form onSubmit={onWithdraw} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                Withdrawal Value (₹) <span className="text-rose-500">*</span>
              </label>
              <input 
                type="number"
                placeholder="Value e.g. 1000"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                required
                className="w-full bg-zinc-50 border border-zinc-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                  UPI Wallet QR ID
                </label>
                <input 
                  type="text"
                  placeholder="e.g. peer@paytm"
                  value={withdrawUpi}
                  onChange={(e) => setWithdrawUpi(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none font-medium font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                  Bank Account/IFSC
                </label>
                <input 
                  type="text"
                  placeholder="AC NO •••• HDFC"
                  value={withdrawBank}
                  onChange={(e) => setWithdrawBank(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none font-medium"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={withdrawLoading}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-950 text-white font-bold text-xs rounded-xl transition-all"
            >
              {withdrawLoading ? 'Processing Wire Wire...' : 'Initiate Bank Transfer'}
            </button>
          </form>
        </div>

        {/* Claimed Purchased Voucher Tokens */}
        <div className="bg-white border border-zinc-200/60 p-6 sm:p-8 rounded-3xl text-left space-y-4">
          <h2 className="text-xs font-bold uppercase text-slate-450 tracking-wider">Unverified Claimed Vouchers</h2>
          <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Verify newly purchased voucher codes to release locked escrow funds directly to peer sellers.
          </p>

          {purchasedCoupons.length === 0 ? (
            <div className="text-center py-10 bg-zinc-50 border border-zinc-200/60 rounded-2xl flex flex-col justify-center items-center">
              <p className="text-xs font-bold text-slate-600">No active claimed vouchers located.</p>
              <p className="text-[10px] text-slate-400 max-w-[150px] mt-0.5">Voucher tokens bought in Marketplace will load here.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[290px] overflow-y-auto scrollbar-none pr-1">
              {purchasedCoupons.map((coupon) => {
                const isCleared = unlockedIds.includes(coupon.id);

                return (
                  <div 
                    key={coupon.id}
                    className="p-4 bg-zinc-50 border border-zinc-200/50 rounded-2xl space-y-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {renderBrandLogo(coupon.brand)}
                        <div className="overflow-hidden">
                          <span className="font-extrabold text-slate-800 text-xs block truncate">{coupon.brand}</span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {coupon.id}</span>
                        </div>
                      </div>

                      {isCleared ? (
                        <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                          Escrow Released
                        </span>
                      ) : (
                        <span className="bg-amber-50 border border-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                          Verification Hold
                        </span>
                      )}
                    </div>

                    {!isCleared ? (
                      <button 
                        onClick={() => startUnlockingFlow(coupon)}
                        className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 text-indigo-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Launch Verification Check
                      </button>
                    ) : (
                      <div className="bg-white border border-zinc-200/60 p-2.5 rounded-xl flex items-center justify-between gap-2.5 text-xs font-mono">
                        <span className="font-black text-slate-800 tracking-wider break-all select-all">{coupon.code}</span>
                        <button 
                          onClick={() => handleCopyCode(coupon.id, coupon.code)}
                          className="text-indigo-600 hover:text-indigo-700 font-bold p-1 text-[10px] flex-shrink-0"
                        >
                          {copiedId === coupon.id ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Transaction History Logs */}
      <div className="space-y-4 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-xs font-bold uppercase text-slate-450 tracking-wider">Chronological Transaction History</h2>
          
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-[10.5px] font-bold ${
                filterType === 'all' ? 'bg-zinc-900 text-white' : 'bg-zinc-50 border border-zinc-150/60 text-slate-600'
              }`}
            >
              All Logs
            </button>
            <button
              onClick={() => setFilterType('deposit')}
              className={`px-3 py-1 rounded-lg text-[10.5px] font-bold ${
                filterType === 'deposit' ? 'bg-zinc-900 text-white' : 'bg-zinc-50 border border-zinc-150/60 text-slate-600'
              }`}
            >
              Deposits
            </button>
            <button
              onClick={() => setFilterType('withdrawal')}
              className={`px-3 py-1 rounded-lg text-[10.5px] font-bold ${
                filterType === 'withdrawal' ? 'bg-zinc-900 text-white' : 'bg-zinc-50 border border-zinc-150/60 text-slate-600'
              }`}
            >
              Bank Wires
            </button>
            <button
              onClick={() => setFilterType('purchase')}
              className={`px-3 py-1 rounded-lg text-[10.5px] font-bold ${
                filterType === 'purchase' ? 'bg-zinc-900 text-white' : 'bg-zinc-50 border border-zinc-150/60 text-slate-600'
              }`}
            >
              Vouchers
            </button>
          </div>
        </div>

        {filteredTxHistory.length === 0 ? (
          <div className="text-center py-10 bg-zinc-50 border border-zinc-200/60 rounded-3xl max-w-sm mx-auto">
            <Clock className="w-8 h-8 text-zinc-350 mx-auto mb-2" />
            <p className="text-xs font-bold text-zinc-650">No transaction records logged.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-200/60 rounded-2xl bg-white shadow-xs">
            <table className="min-w-full divide-y divide-zinc-200 text-xs">
              <thead className="bg-[#fcfbfb]">
                <tr className="text-slate-500 font-bold">
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-left">Log Action</th>
                  <th className="px-5 py-3 text-left">Reference Details</th>
                  <th className="px-5 py-3 text-right">Sum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-normal">
                {filteredTxHistory.map((tx) => {
                  const isDepositPlus = tx.type === 'deposit' || (tx.type === 'purchase' && tx.sellerId === sessionUser?.id);

                  return (
                    <tr key={tx.id} className="hover:bg-zinc-50/50 text-slate-800">
                      <td className="px-5 py-3.5 text-slate-450 font-mono whitespace-nowrap">
                        {tx.date ? tx.date.split('T')[0] : '2026-05-24'}
                      </td>
                      <td className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px]">
                        <span className={`px-2 py-0.5 rounded ${
                          tx.type === 'deposit' 
                            ? 'bg-emerald-50 text-emerald-800' 
                            : tx.type === 'withdrawal'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-indigo-50 text-indigo-800'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[11px] font-semibold text-slate-600">
                        {getCounterpartyText(tx)}
                      </td>
                      <td className={`px-5 py-3.5 text-right font-bold text-sm whitespace-nowrap ${
                        isDepositPlus ? 'text-emerald-600' : 'text-slate-900'
                      }`}>
                        {isDepositPlus ? '+' : '-'} ₹{tx.amount?.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECURE STRIPE & RAZORPAY DEPOSIT DIALOG POPUP */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-zinc-150 overflow-hidden shadow-2xl relative">
            
            {/* Modal Switch Header */}
            <div className="p-6 bg-zinc-950 text-zinc-100 flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Authorization Gateway</span>
                <h3 className="text-base font-black tracking-tight text-white">Topup Cash Escrow</h3>
              </div>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="w-7 h-7 bg-zinc-900 text-zinc-400 hover:text-white rounded-lg flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Gateway Toggle */}
            <div className="grid grid-cols-2 gap-1.5 p-4.5 bg-zinc-50 border-b border-zinc-100 text-xs">
              <button
                type="button"
                onClick={() => setSelectedGateway('stripe')}
                className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedGateway === 'stripe' 
                    ? 'bg-zinc-900 text-white' 
                    : 'bg-white border border-zinc-200 text-slate-600'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Stripe Card Sync</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedGateway('razorpay');
                  setCountdownSeconds(300);
                }}
                className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedGateway === 'razorpay' 
                    ? 'bg-zinc-900 text-white' 
                    : 'bg-white border border-zinc-200 text-slate-600'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Razorpay UPI</span>
              </button>
            </div>

            {/* Simulated Inputs Form */}
            <form onSubmit={handleSecureCheckoutSubmit} className="p-6 space-y-4">
              <div className="bg-zinc-50/50 p-3 rounded-xl border border-zinc-150 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Clear Deposit Value:</span>
                <span className="font-extrabold text-slate-800 text-base">₹{Number(depositAmount).toLocaleString('en-IN')}.00</span>
              </div>

              {selectedGateway === 'stripe' ? (
                <div className="space-y-3 text-left text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cardholder Identifier Name</label>
                    <input 
                      type="text"
                      value={stripeCardName}
                      onChange={(e) => setStripeCardName(e.target.value)}
                      required
                      className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bank Debit Card Number</label>
                    <input 
                      type="text"
                      value={stripeCardNum}
                      onChange={(e) => setStripeCardNum(e.target.value)}
                      required
                      className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-lg focus:outline-none font-mono font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Expiry</label>
                      <input 
                        type="text"
                        value={stripeCardExpiry}
                        onChange={(e) => setStripeCardExpiry(e.target.value)}
                        required
                        className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-lg focus:outline-none font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">CVC Verification Code</label>
                      <input 
                        type="password"
                        value={stripeCardCvc}
                        onChange={(e) => setStripeCardCvc(e.target.value)}
                        required
                        className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-lg focus:outline-none font-mono text-center"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-center text-xs text-left">
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl">
                    <p className="font-medium text-[11px]">Razorpay compliance hold countdown: {Math.floor(countdownSeconds / 60)}:{(countdownSeconds % 60).toString().padStart(2, '0')}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 text-left">Personal UPI Handle Identifier</label>
                    <input 
                      type="text"
                      value={razorpayUpiId}
                      onChange={(e) => setRazorpayUpiId(e.target.value)}
                      required
                      className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-lg focus:outline-none font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={checkoutProcessing}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-950 text-white font-bold text-xs rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {checkoutProcessing ? (
                  <span>Authorizing Secure Transaction...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Authorize Deposit (₹{Number(depositAmount).toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SECURE CHECKLIST & VERIFICATION UNLOCK MULTISTEP DIALOG */}
      {activeUnlockingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-zinc-150 p-6 sm:p-8 space-y-6 text-left relative shadow-2xl">
            <button 
              onClick={() => setActiveUnlockingItem(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 font-bold"
            >
              × Cancel
            </button>

            <div className="space-y-1">
              <span className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest font-mono">Decentralized Escrow Settle</span>
              <h3 className="text-base font-black tracking-tight text-slate-900">Voucher PIN Scan Compliance</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                Physically test the brand coupon card PIN at merchant store to verify the discount balance value.
              </p>
            </div>

            {/* Graphic Verification Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>Validation Checklist Complete</span>
                <span>{verificationProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300" 
                  style={{ width: `${verificationProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
              {verificationStep === 1 && (
                <div className="bg-zinc-50 border border-zinc-150 p-4 rounded-xl space-y-3 font-normal">
                  <span className="font-bold text-slate-800 block">Step 1: Save Voucher Code PIN</span>
                  <p className="text-[11px] text-slate-500">Copy the trade PIN code and apply it on official checkout checkout channel.</p>
                  <div className="bg-white p-2.5 rounded-lg border border-zinc-200 flex items-center justify-between font-mono font-bold">
                    <span className="text-[#1f2937] leading-tight select-all">{activeUnlockingItem.code}</span>
                    <button 
                      onClick={() => handleCopyCode(activeUnlockingItem.id, activeUnlockingItem.code)}
                      className="text-indigo-600 font-bold text-[10px]"
                    >
                      Copy PIN
                    </button>
                  </div>
                </div>
              )}

              {verificationStep === 2 && (
                <div className="bg-zinc-50 border border-zinc-150 p-4 rounded-xl space-y-2 font-normal">
                  <span className="font-bold text-slate-800 block">Step 2: External Balance Match</span>
                  <p className="text-[11px] text-slate-500">Check that the merchant cart registers a face discount reduction matching the listed specifications.</p>
                </div>
              )}

              {verificationStep === 3 && (
                <div className="bg-zinc-50 border border-zinc-150 p-4 rounded-xl space-y-2 font-normal">
                  <span className="font-bold text-slate-800 block">Step 3: Escrow Settlement Clear</span>
                  <p className="text-[11px] text-slate-500">Accept and sign the signature. Released payout lands directly in the counterpart seller balance instantly.</p>
                </div>
              )}
            </div>

            <button
              onClick={executeCheckingStep}
              className="w-full py-3 bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs rounded-xl"
            >
              {verificationStep === 1 ? 'Go to Balance Match' : verificationStep === 2 ? 'Go to Escrow Settle Release' : 'Complete Verification Settle'}
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
