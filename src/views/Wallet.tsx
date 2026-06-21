import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, ShieldCheck, CreditCard, Building2, Smartphone } from 'lucide-react';
import { Transaction } from '../types';

export default function Wallet() {
  const { user, walletBalance, addFunds, deductFunds, transactions, addTransaction, addNotification } = useAppContext();
  const [addAmount, setAddAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showPhonePe, setShowPhonePe] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [withdrawMode, setWithdrawMode] = useState<'bank' | 'upi'>('upi');
  const [dbTransactions, setDbTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (!user) return null;

  const handleAddMoney = () => {
    if (parseFloat(addAmount) > 0) {
      handleRazorpayPay();
    }
  };

  const [processingState, setProcessingState] = useState<'idle' | 'initiating' | 'authenticating' | 'success'>('idle');

  const handleRazorpayPay = async () => {
    setProcessing(true);
    setProcessingState('initiating');

    try {
      // 1. Create order on server
      const orderRes = await fetch('/api/wallet/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: addAmount, purpose: 'deposit' })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      setProcessingState('idle');

      // 2. Configure Razorpay checkout options
      const options = {
        key: orderData.key_id, // Enter the Key ID generated from the Dashboard
        amount: orderData.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: orderData.currency,
        name: "VouchLoop",
        description: "Wallet Deposit",
        image: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg", // Logo placeholder
        order_id: orderData.orderId, 
        handler: async function (response: any) {
          setProcessingState('authenticating');
          // 3. Verify payment on server
          try {
            const verifyRes = await fetch('/api/wallet/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || 'simulated_sig',
                amount: addAmount
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              setProcessingState('success');
              
              setTimeout(() => {
                const amount = parseFloat(addAmount);
                addFunds(amount);
                const newTx = verifyData.transaction || {
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
                setProcessing(false);
                setProcessingState('idle');
              }, 1000);
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (err: any) {
             setProcessing(false);
             setProcessingState('idle');
             alert('Verification Error: ' + err.message);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            setProcessingState('idle');
          }
        }
      };

      if (orderData.orderId.startsWith('order_sim_')) {
        setTimeout(() => {
           options.handler({
             razorpay_payment_id: 'pay_sim_' + Date.now(),
             razorpay_order_id: orderData.orderId,
             razorpay_signature: 'sim_sig'
           });
        }, 1000);
        return;
      }

      // @ts-ignore
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response: any){
        alert('Payment failed: ' + response.error.description);
        setProcessing(false);
        setProcessingState('idle');
      });
      rzp1.open();
    } catch (e: any) {
      alert("Error initializing checkout: " + e.message);
      setProcessing(false);
      setProcessingState('idle');
    }
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
                {processingState === 'idle' && (
                  <>
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-gray-500" />
                      </div>
                    </div>
                    <h3 className="text-center font-bold text-gray-800 mb-2">Secure Payment Check</h3>
                    <p className="text-center text-sm text-gray-500 mb-6">You are adding ₹{addAmount} to your VouchLoop wallet using Razorpay Payment Gateway.</p>
                    <button 
                      onClick={handleRazorpayPay}
                      disabled={processing}
                      className="w-full bg-[#3399cc] hover:bg-[#287aa2] text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      Pay ₹{addAmount} with Razorpay
                    </button>
                    <button onClick={() => setShowPhonePe(false)} className="w-full mt-3 text-gray-500 text-sm hover:text-gray-700 font-medium py-2">
                      Cancel Checkout
                    </button>
                  </>
                )}
                
                {processingState === 'initiating' && (
                  <div className="flex flex-col items-center justify-center animate-in fade-in">
                    <div className="w-12 h-12 border-4 border-[#5f259f] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="font-semibold text-gray-800 text-center">Opening Gateway...</p>
                    <p className="text-xs text-gray-500 text-center mt-2">Please do not refresh</p>
                  </div>
                )}
                
                {processingState === 'authenticating' && (
                  <div className="flex flex-col items-center justify-center animate-in fade-in">
                    <div className="bg-teal-50 text-teal-600 p-3 rounded-full mb-4">
                      <ShieldCheck className="w-8 h-8 animate-pulse" />
                    </div>
                    <p className="font-semibold text-gray-800 text-center">Processing Payment</p>
                    <p className="text-xs text-gray-500 text-center mt-2">Awaiting confirmation from Razorpay...</p>
                  </div>
                )}
                
                {processingState === 'success' && (
                  <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95">
                    <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="font-bold text-gray-800 text-xl text-center">Payment Successful!</p>
                    <p className="text-sm text-gray-500 text-center mt-2">₹{addAmount} has been credited to your wallet.</p>
                  </div>
                )}
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

          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Recent Transactions</h3>
            {loading ? (
               <div className="flex justify-center items-center py-8">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
               </div>
            ) : recentTransactions.length === 0 ? (
               <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>No recent activity</p>
               </div>
            ) : (
               <div className="space-y-4">
                 {recentTransactions.map(trx => (
                   <div key={trx.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                     <div className="flex items-center gap-3">
                       <div className={`p-2 rounded ${trx.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                         {trx.type === 'deposit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                       </div>
                       <div>
                         <p className="font-medium text-gray-800">{trx.description}</p>
                         <p className="text-xs text-gray-500">{trx.date}</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className={`font-bold ${trx.type === 'deposit' ? 'text-green-600' : 'text-gray-900'}`}>
                         {trx.type === 'deposit' ? '+' : '-'}₹{trx.amount.toFixed(2)}
                       </p>
                       <p className="text-xs text-gray-500 capitalize">{trx.status}</p>
                     </div>
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
