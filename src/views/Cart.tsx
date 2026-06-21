import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ShoppingCart, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { db as firestoreDB } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function Cart() {
  const { user, cart, removeFromCart, clearCart, walletBalance, addFunds, deductFunds, addTransaction, addPurchasedVouchers, addNotification } = useAppContext();
  const navigate = useNavigate();
  const [purchasing, setPurchasing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastTxId, setLastTxId] = useState('');

  const total = cart.reduce((acc, current) => acc + (current.price * current.quantity), 0);

  const processCartPurchase = () => {
    deductFunds(total);
    
    // Complete the transaction logic for cart items
    const txId = `TRX-${Math.floor(Math.random() * 10000)}`;
    setLastTxId(txId);
    
    cart.forEach(item => {
      const brandName = item.type === 'giftcard' ? (item.item as any).brand : 'Offer';
      addTransaction({
        id: `TRXI-${Math.floor(Math.random() * 100000)}`,
        type: 'purchase',
        brand: brandName,
        amount: item.price * item.quantity,
        value: item.item.value ? item.item.value * item.quantity : undefined,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
        paymentMethod: 'Wallet'
      });
    });
    
    const purchasedVouchers = cart.filter(i => i.type === 'giftcard').map(i => i.item);
    if (purchasedVouchers.length > 0) {
      addPurchasedVouchers(purchasedVouchers);
    }

    addNotification({
      title: "Purchase Successful",
      desc: `You successfully purchased ${cart.length} item(s) for ₹${total.toFixed(2)}.`,
      type: "success"
    });

    clearCart();
    setPurchasing(false);
    setSuccess(true);
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/auth', { state: { from: '/cart' } });
      return;
    }

    if (walletBalance >= total) {
      processCartPurchase();
    } else {
      const deficit = total - walletBalance;
      setPurchasing(true);
      try {
        const orderRes = await fetch('/api/wallet/razorpay/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: deficit, purpose: 'deposit' })
        });
        const orderData = await orderRes.json();

        if (!orderData.success) throw new Error(orderData.error || 'Failed to create order');

        // Setup dual-safe success handler
        let hasCompleted = false;
        let unsubscribe: (() => void) | null = null;

        const triggerSuccessTransition = () => {
          if (hasCompleted) return;
          hasCompleted = true;
          addFunds(deficit);
          processCartPurchase();
          if (unsubscribe) {
            try {
              unsubscribe();
            } catch (err) {
              console.warn("Unsubscribe error:", err);
            }
          }
        };

        // Setup Firestore listener for payment status with error boundary
        unsubscribe = onSnapshot(doc(firestoreDB, "transactions", orderData.orderId), (docSnap) => {
          if (docSnap.exists()) {
            const txStatus = docSnap.data().status;
            if (txStatus === 'completed') {
              triggerSuccessTransition();
            } else if (txStatus === 'failed') {
              setPurchasing(false);
              alert("Payment failed.");
              if (unsubscribe) unsubscribe();
            }
          }
        }, (err) => {
          console.warn("Firestore listener restricted or offline. Relying on API verification.", err);
        });

        const options = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "VouchLoop",
          description: "Fund Wallet & Checkout",
          image: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg",
          order_id: orderData.orderId,
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch('/api/wallet/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature || 'simulated_sig',
                  amount: deficit,
                  purpose: 'deposit'
                })
              });
              const verifyData = await verifyRes.json();
              if (!verifyData.success) {
                throw new Error(verifyData.error || 'Payment verification failed');
              }
              // Immediately complete transaction upon successful direct API verification
              triggerSuccessTransition();
            } catch (err: any) {
              setPurchasing(false);
              alert('Verification Error: ' + err.message);
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
          },
          theme: {
            color: "#3399cc"
          },
          modal: {
            ondismiss: function() {
              setPurchasing(false);
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
          setPurchasing(false);
        });
        rzp1.open();
      } catch (e: any) {
        alert("Error initializing checkout: " + e.message);
        setPurchasing(false);
      }
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4 relative overflow-hidden">
        {/* Fintech ambient glow background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-teal-500/10 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-400/20 rounded-full blur-[100px] -z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        <motion.div 
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center border border-gray-100 relative overflow-hidden"
        >
          {/* Top accent line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 to-green-500 origin-left"
          />

          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-green-100 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-green-100"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
            >
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </motion.div>
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight"
          >
            Payment Successful
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 mb-8 text-sm"
          >
            Your voucher has been added securely to your digital ledger.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="bg-gray-50 p-5 rounded-2xl text-left border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between text-sm mb-3 items-center">
              <span className="text-gray-500 font-medium">Amount Paid</span>
              <span className="font-bold text-gray-900 text-lg">₹{total.toFixed(2)}</span>
            </div>
            <div className="h-px w-full bg-gray-200 mb-3" />
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-500 font-medium">Transaction ID</span>
              <span className="font-mono text-xs font-bold text-gray-700 bg-gray-200 px-2 py-1 rounded">{lastTxId}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 flex justify-center space-x-3"
          >
            <button onClick={() => navigate('/dashboard')} className="flex-1 bg-white border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-50 transition">
              View History
            </button>
            <button onClick={() => navigate('/my-vouchers')} className="flex-1 bg-teal-600 text-white font-medium py-2 rounded-lg hover:bg-teal-700 transition">
              My Coupons
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any gift cards or offers to your cart yet.</p>
        <Link to="/gift-cards" className="bg-teal-600 text-white px-6 py-2 rounded-full font-medium hover:bg-teal-700 transition">
          Browse Gift Cards
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-700">Items ({cart.length})</h3>
              <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium">Clear All</button>
            </div>
            <div className="divide-y divide-gray-100">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={item.id} 
                    className="p-4 flex gap-4"
                  >
                    <div className="w-20 h-16 bg-gray-100 rounded border flex items-center justify-center flex-shrink-0">
                      {(item.item as any).logo ? (
                        <img src={(item.item as any).logo} alt="Brand" className="max-h-10 max-w-[80%] object-contain" />
                      ) : (
                        <div className="font-bold text-gray-400 text-xs text-center border-dashed border-2 border-gray-300 w-full h-full flex items-center justify-center">OFFER</div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-gray-800">
                          {item.type === 'giftcard' ? (item.item as any).brand : (item.item as any).title}
                        </h4>
                        <p className="font-bold">₹{item.price.toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center mt-3 font-medium"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white border rounded-xl shadow-sm p-6 sticky top-24">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm text-gray-600 mb-4 border-b pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-teal-600 font-medium">
                <span>Estimated Cashback</span>
                <span>+ ₹{(total * 0.05).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-800 mb-6">
              <span>Total to Pay</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <div className="mb-6 border-b pb-4">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">Payment Method</h4>
              <div className="bg-gray-50 border rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">Wallet balance</span>
                  <span className="font-bold text-gray-900">₹{walletBalance.toFixed(2)}</span>
                </div>
                {walletBalance >= total ? (
                  <div className="text-xs text-green-600 bg-green-50 border border-green-105 rounded-lg p-2.5 flex items-center mt-2 font-medium">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                    Fully Covered by Wallet Balance
                  </div>
                ) : (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                      <span>Amount from Wallet</span>
                      <span>₹{walletBalance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-[#3399cc] mb-3">
                      <span>Top-up via Razorpay (UPI/Card)</span>
                      <span>₹{(total - walletBalance).toFixed(2)}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 bg-blue-50/50 border border-blue-105 rounded-lg p-2">
                      Pay securely via Razorpay to instantly fund your wallet and complete checkout.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={purchasing}
              className={`relative w-full text-white font-bold py-3 rounded-lg transition-all duration-300 flex justify-center items-center group disabled:opacity-80 overflow-hidden shadow-lg ${walletBalance >= total ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20' : 'bg-[#3399cc] hover:bg-[#287aa2] shadow-[#3399cc]/20'}`}
            >
              {purchasing ? (
                 <>
                   <motion.div 
                     initial={{ width: 0 }} 
                     animate={{ width: "100%" }} 
                     transition={{ duration: 1.5 }}
                     className="absolute inset-0 bg-[#3399cc]"
                   />
                   <span className="relative z-10">Processing securely...</span>
                 </>
              ) : (
                <span className="relative z-10 flex items-center justify-center w-full">
                  {walletBalance >= total ? (
                    <>Pay ₹{total.toFixed(2)} via Wallet <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                  ) : (
                    <>Pay ₹{(total - walletBalance).toFixed(2)} via Razorpay <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
