import React, { useState } from 'react';
import { Share2, Copy, Users, Gift, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Referrals() {
  const { walletBalance } = useAppContext();
  const [copied, setCopied] = useState(false);
  const referralCode = "VOUCH2026AI";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Sparkles className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Refer & Earn Lifelong</h1>
          <p className="text-teal-100 max-w-lg mb-6">
            Invite your friends to VouchLoop. You both get ₹50 on sign up, and you earn 10% of their voucher transaction fees forever!
          </p>
          
          <div className="bg-white rounded-xl p-4 flex items-center justify-between max-w-md shadow-xl">
            <div className="px-4">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Your Referral Code</p>
              <p className="text-2xl font-bold text-gray-900 font-mono tracking-widest">{referralCode}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                <Copy className="w-5 h-5" />
              </button>
              <button className="p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                <span className="font-semibold hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
          {copied && <p className="text-green-300 font-medium mt-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></div> Code copied to clipboard!</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">12 Friends</h3>
          <p className="text-sm text-gray-500">Joined using your code</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">₹1,240</h3>
          <p className="text-sm text-gray-500">Total Referral Earnings</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
            <Gift className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Gold Tier</h3>
          <p className="text-sm text-gray-500">10% recurring commission</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-6">How it works</h2>
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="absolute left-12 top-12 bottom-12 w-0.5 bg-gray-100 hidden md:block"></div>
        <div className="space-y-8 relative">
          <div className="flex gap-6 items-start">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center z-10 shrink-0 outline outline-4 outline-white">1</div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Share your code</h4>
              <p className="text-gray-500 leading-relaxed">Send your unique referral code or link to your friends via WhatsApp, Telegram, or any other platform.</p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center z-10 shrink-0 outline outline-4 outline-white">2</div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Friends join & shop</h4>
              <p className="text-gray-500 leading-relaxed">Your friends sign up and make their first purchase. You both instantly get a ₹50 bonus credited to your wallets.</p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center z-10 shrink-0 outline outline-4 outline-white">3</div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Earn forever</h4>
              <p className="text-gray-500 leading-relaxed">Every time your referred friend buys or sells a voucher, you get a 10% bonus from the transaction fee for life.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
