import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Tag, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Voucher } from '../types';

export default function SellGiftCard() {
  const { user, addVoucher, addNotification } = useAppContext();
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [brand, setBrand] = useState('Amazon');
  const [value, setValue] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const vValue = parseFloat(value);
    const vPrice = parseFloat(price);
    
    const newVoucher: Voucher = {
      id: `v_${Math.random().toString(36).substr(2, 9)}`,
      brand,
      logo: '', // Usually based on brand
      value: vValue,
      sellingPrice: vPrice,
      discountPercentage: Math.round(((vValue - vPrice) / vValue) * 100),
      category: 'Shopping',
      sellerId: user.id,
      sellerName: user.name,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending' // Admin needs to approve
    };
    
    addVoucher(newVoucher);
    addNotification({
      title: "Voucher Listed",
      desc: `Your ${brand} voucher has been successfully listed for sale.`,
      type: "success"
    });

    setSuccess(true);
    setTimeout(() => {
      navigate('/dashboard'); 
    }, 3000);
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
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight"
          >
            Gift Card Submitted
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 mb-8 text-sm"
          >
            Securely uploaded to our escrow vault. Pending QA review.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="bg-gray-50 p-5 rounded-2xl text-left border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-500 font-medium">Tracking ID</span>
              <span className="font-mono text-xs font-bold text-gray-700 bg-gray-200 px-2 py-1 rounded">REQ-{Math.floor(Math.random() * 10000)}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 flex justify-center"
          >
            <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ x: "-100%" }}
                 animate={{ x: "100%" }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                 className="w-full h-full bg-teal-500"
               />
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4 flex items-center justify-center gap-2">
           <Tag className="w-8 h-8 text-teal-600" /> Sell Unused Gift Cards
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Convert your unused brand vouchers into cash. List them safely on VouchLoop and get paid directly in your wallet once purchased by another user.
        </p>
      </div>

      <div className="bg-white border rounded-xl shadow-lg p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
              <select 
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              >
                <option>Amazon</option>
                <option>Flipkart</option>
                <option>Myntra</option>
                <option>Swiggy</option>
                <option>Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Value (₹)</label>
              <input
                type="number"
                required
                min="1"
                max="50"
                value={value}
                onChange={e => setValue(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="e.g. 50"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹)</label>
              <input
                type="number"
                required
                min="1"
                max="50"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="e.g. 45 (Set lower than card value to sell faster)"
              />
              <p className="text-xs text-gray-500 mt-1">We recommend setting the selling price at least 5-10% below the actual value.</p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-medium text-sm text-gray-900 mb-3">Voucher Details (Private, revealed only to buyer)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Code</label>
                <input
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm font-mono"
                  placeholder="XXXX-XXXX-XXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN (if applicable)</label>
                <input
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm font-mono"
                  placeholder="XXXX"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-md flex items-start gap-3">
            <div className="text-blue-500 mt-0.5">ℹ️</div>
            <p className="text-sm text-blue-800">
              By listing this card, you agree to our <Link to="/terms" className="underline">Seller Terms</Link>. Verified cards sell 3x faster. Funds will be locked in escrow until the buyer confirms validity.
            </p>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
          >
            {user ? 'List Gift Card on Marketplace' : 'Login to Sell Gift Card'}
          </button>
        </form>
      </div>
    </div>
  );
}
