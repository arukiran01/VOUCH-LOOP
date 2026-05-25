import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
}

export default function Footer({ setActiveTab, setSearchQuery }: FooterProps) {
  return (
    <footer className="bg-zinc-950 text-zinc-400 text-xs border-t border-zinc-800 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div 
              onClick={() => { setActiveTab('landing'); setSearchQuery(''); }}
              className="flex items-center gap-2 cursor-pointer text-white"
            >
              <div className="p-1.5 bg-indigo-650 text-white rounded-lg">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <span className="text-base font-black tracking-tight">
                VouchLoop
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-normal">
              India's premier high-end peer exchange escrow network for brand gift cards and digital cashback vouchers. Safe trades, guaranteed settlements.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-[10px] uppercase tracking-wider">Exchange Links</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button 
                  onClick={() => { setActiveTab('marketplace'); setSearchQuery(''); }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Buy Gift Cards
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('upload')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Sell Unused Cards
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('wallet')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  My Wallet Ledger
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-[11px] text-zinc-500 font-sans flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="font-heading tracking-tight">© 2026 VouchLoop Inc. All rights reserved. Registered P2P protocol terms apply.</span>
        </div>
      </div>
    </footer>
  );
}
