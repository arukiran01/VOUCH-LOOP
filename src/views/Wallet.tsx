import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, ShieldCheck, CreditCard, Building2, Smartphone } from 'lucide-react';
import { Transaction } from '../types';
import { RazorpayButton } from '../components/RazorpayButton';
import useSWR, { mutate } from 'swr';
import { TransactionHistory } from '../components/TransactionHistory';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Wallet() {
  const { user, walletBalance, addFunds, deductFunds, transactions, addTransaction, addNotification, syncSession } = useAppContext();
  const [addAmount, setAddAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showPhonePe, setShowPhonePe] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [withdrawMode, setWithdrawMode] = useState<'bank' | 'upi'>('upi');
  const [dbTransactions, setDbTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const pollIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Use SWR to query and automatically synchronize wallet ledger state
  const { data: walletData, mutate: refetchWallet } = useSWR('/api/wallet/history', fetcher, {
    refreshInterval: isPolling ? 1500 : 8000, // poll rapidly on topup check signature
    onSuccess: (data) => {
      if (data.success && Array.isArray(data.history)) {
        setDbTransactions(data.history);
      }
    }
  });

  const startPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    setIsPolling(true);
    let attempts = 0;
    const maxAttempts = 8;

    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      try {
        await syncSession();
        const res = await fetch('/api/wallet/history');
        const data = await res.json();
        if (data.success) {
          setDbTransactions(data.history);
        }
      } catch (err) {
        console.error("Wallet polling error:", err);
      }

      if (attempts >= maxAttempts) {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        setIsPolling(false);
      }
    }, 2000);
  };

  React.useEffect(() => {
    if (user) {
      fetch('/api/wallet/history')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setDbTransactions(data.history);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  React.useEffect(() => {
    if (!user) return;
    const periodicInterval = setInterval(async () => {
      try {
        await syncSession();
        const res = await fetch('/api/wallet/history');
        const data = await res.json();
        if (data.success) {
          setDbTransactions(data.history);
        }
      } catch (err) {
        console.error("Periodic balance sync failed:", err);
      }
    }, 10000);

    return () => {
      clearInterval(periodicInterval);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [user]);

  if (!user) return null;

  const handleAddMoney = () => {
    if (parseFloat(addAmount) > 0) {
      setShowPhonePe(true);
      setShowWithdraw(false);
    }
  };

  const handleTopupSuccess = (transaction: any) => {
    const amount = parseFloat(addAmount);
    addFunds(amount);
    
    // Trigger immediate SWR mutation to re-fetch the user's wallet balance & transaction history
    setIsPolling(true);
    refetchWallet();
    syncSession();

    const newTx = transaction || {
      id: `TRX-${Math.floor(Math.random() * 1000000)}`,
      type: 'deposit',
      amount: amount,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      description: 'Wallet Top-up via Razorpay'
    };
    setDbTransactions(prev => [newTx, ...prev]);
    addNotification({
      title: "Deposit Successful",
      desc: `₹${amount.toFixed(2)} has been instantly credited to your wallet.`,
      type: "success"
    });
    setAddAmount('');
    setShowPhonePe(false);

    // Active polling to sync local storage balance with backend db
    startPolling();

    // Stop high frequency polling after 6 seconds as SWR wraps up verification
    setTimeout(() => {
      setIsPolling(false);
    }, 6000);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount) || walletBalance;
    if (amount < 250) {
      alert('Minimum withdrawal amount is ₹250');
      return;
    }
    if (amount > walletBalance) {
      alert('Insufficient available balance for withdrawal');
      return;
    }
    
    setProcessing(true);
    setTimeout(() => {
      deductFunds(amount);
      const newTx = {
        id: `TRX-${Math.floor(Math.random() * 10000)}`,
        type: 'withdraw',
        amount: amount,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        status: 'pending',
        description: `Withdrawal to ${withdrawMode.toUpperCase()}`
      };
      setDbTransactions(prev => [newTx, ...prev]);
      addNotification({
        title: "Withdrawal Requested",
        desc: `Your withdrawal of ₹${amount.toFixed(2)} to ${withdrawMode.toUpperCase()} is pending processing.`,
        type: "info"
      });
      setProcessing(false);
      setShowWithdraw(false);
      setWithdrawAmount('');
      alert('Withdrawal request submitted! It will be processed within 24 hours.');
    }, 2000);
  };

  const recentTransactions = dbTransactions.filter(t => t.type === 'deposit' || t.type === 'withdraw').slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <div className="bg-teal-100 p-3 rounded-full text-teal-600">
          <WalletIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Wallet</h1>
          <p className="text-gray-500">Manage your P2P Voucher funds and Escrow</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-gray-400 text-sm font-medium mb-1">Total Available Balance</p>
            <h2 className="text-4xl font-bold mb-4">₹{walletBalance.toFixed(2)}</h2>
            
            <div className="grid grid-cols-2 gap-2 mb-6 text-sm">
               <div className="bg-white/10 p-2 rounded">
                 <p className="text-gray-400 text-xs">Vouchers Sold</p>
                 <p className="font-semibold">₹{(walletBalance * 0.6).toFixed(2)}</p>
               </div>
               <div className="bg-white/10 p-2 rounded">
                 <p className="text-gray-400 text-xs">Referral Fees</p>
                 <p className="font-semibold">₹{(walletBalance * 0.4).toFixed(2)}</p>
               </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Add Money to Wallet</label>
                <div className="flex bg-gray-800 rounded-lg overflow-hidden border border-gray-700 focus-within:border-teal-500 transition-colors">
                  <span className="px-3 flex items-center text-gray-400">₹</span>
                  <input 
                    type="number" 
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    className="w-full bg-transparent border-none py-2 outline-none text-white font-medium"
                    placeholder="1000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleAddMoney}
                  disabled={!addAmount || parseFloat(addAmount) <= 0}
                  className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:bg-gray-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center text-sm"
                >
                  <ArrowDownLeft className="w-4 h-4 mr-1" /> Top Up
                </button>
                <button 
                  onClick={() => { setShowWithdraw(true); setShowPhonePe(false); }}
                  disabled={walletBalance < 250 || user.kycStatus === 'unverified'}
                  className="w-full bg-transparent border border-gray-500 hover:border-white disabled:opacity-50 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center text-sm"
                >
                  Withdraw <ArrowUpRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              {user.kycStatus === 'unverified' && (
                 <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200 text-xs text-center flex flex-col gap-2">
                   <p className="flex items-center justify-center gap-1"><ShieldCheck className="w-4 h-4" /> KYC Verification Required</p>
                   <Link to="/kyc" className="underline hover:text-white transition">Verify Now to Withdraw</Link>
                 </div>
              )}
              {walletBalance < 250 && user.kycStatus !== 'unverified' && <p className="text-xs text-gray-400 text-center mt-2">Min. withdrawal: ₹250</p>}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {showPhonePe && (
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-[#3399cc] p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-wide">Razorpay</span>
                  <span className="bg-white/20 text-xs px-2 py-0.5 rounded">Checkout</span>
                </div>
                <span className="font-medium">₹{addAmount}</span>
              </div>
              <div className="p-6 h-64 flex flex-col justify-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-gray-500" />
                  </div>
                </div>
                <h3 className="text-center font-bold text-gray-800 mb-2">Secure Payment Check</h3>
                <p className="text-center text-sm text-gray-500 mb-6">You are adding ₹{addAmount} to your VouchLoop wallet using Razorpay Payment Gateway.</p>
                <div className="flex flex-col gap-2">
                  <RazorpayButton
                    amount={parseFloat(addAmount)}
                    user={user}
                    onSuccess={handleTopupSuccess}
                    className="w-full bg-[#3399cc] hover:bg-[#287aa2] text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    Pay ₹{addAmount} with Razorpay
                  </RazorpayButton>
                  <button onClick={() => setShowPhonePe(false)} className="w-full text-gray-500 text-sm hover:text-gray-700 font-medium py-2">
                    Cancel Checkout
                  </button>
                </div>
              </div>
            </div>
          )}

          {showWithdraw && (
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Withdraw to Bank / UPI</h3>
              <div className="flex border border-gray-200 rounded-lg p-1 mb-6">
                <button 
                  onClick={() => setWithdrawMode('upi')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md flex justify-center items-center gap-2 transition-colors ${withdrawMode === 'upi' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <Smartphone className="w-4 h-4" /> UPI ID
                </button>
                <button 
                  onClick={() => setWithdrawMode('bank')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md flex justify-center items-center gap-2 transition-colors ${withdrawMode === 'bank' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <Building2 className="w-4 h-4" /> Bank Account
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Withdraw</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                    <input type="number" 
                      value={withdrawAmount} 
                      onChange={(e) => setWithdrawAmount(e.target.value)} 
                      className="w-full border-gray-300 rounded-lg pl-8 p-2 border focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none" 
                      placeholder={`Enter amount (max ₹${walletBalance})`} 
                    />
                  </div>
                </div>
                {withdrawMode === 'upi' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                    <input type="text" className="w-full border-gray-300 rounded-lg p-2 border focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none" placeholder="example@okhdfcbank" />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                      <input type="text" className="w-full border-gray-300 rounded-lg p-2 border focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none" placeholder="Enter Account Number" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                      <input type="text" className="w-full border-gray-300 rounded-lg p-2 border focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none" placeholder="Enter IFSC" />
                    </div>
                  </>
                )}
              </div>

              <button 
                onClick={handleWithdraw}
                disabled={processing || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                className="w-full bg-gray-900 hover:bg-black disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
              >
                {processing ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>Send to {withdrawMode === 'upi' ? 'UPI' : 'Bank'}</>
                )}
              </button>
              <button onClick={() => setShowWithdraw(false)} className="w-full mt-3 text-gray-500 text-sm hover:text-gray-700 font-medium py-2">
                Cancel
              </button>
            </div>
          )}

          <TransactionHistory />
        </div>
      </div>
    </div>
  );
}
