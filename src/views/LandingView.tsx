import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Gift, 
  ShieldCheck, 
  Star, 
  CheckCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Percent,
  Ticket,
  ExternalLink,
  Mail,
  Lock,
  UserPlus,
  LogIn,
  CheckCircle2,
  User
} from 'lucide-react';
import { Coupon, Review, User as UserType } from '../types';
import { INITIAL_USERS } from '../data/mockData';

const renderBrandLogo = (brandName: string) => {
  const normalized = brandName ? brandName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
  
  if (normalized.includes('amazon')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#111] border border-zinc-800 flex flex-col items-center justify-center select-none flex-shrink-0 shadow-sm relative overflow-hidden">
        {/* Amazon logo styling */}
        <span className="text-[10px] text-white tracking-tight font-sans leading-none font-black lowercase">amazon</span>
        <svg className="w-5.5 h-1.5 text-[#FF9900] mt-0.5" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 1.5C5 5.5 19 5.5 22 1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M21 0.8L23 2.5L20 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  
  if (normalized.includes('flipkart')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#2874f0] border border-blue-400/20 flex flex-col items-center justify-center font-extrabold text-white select-none flex-shrink-0 relative overflow-hidden shadow-sm">
        <div className="flex items-center gap-0.5 leading-none">
          <span className="text-[10px] text-white tracking-tighter lowercase italic font-black font-sans">flip</span>
          <span className="text-[10px] text-[#ffe500] tracking-tighter lowercase italic font-black font-sans">kart</span>
        </div>
        <div className="mt-1 w-4 h-3 bg-[#ffe500] rounded-xs relative flex items-center justify-center">
          <span className="text-[6px] text-[#2874f0] font-black leading-none">★</span>
        </div>
      </div>
    );
  }
  
  if (normalized.includes('ajio')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#0e1012] border border-zinc-800 flex items-center justify-center select-none flex-shrink-0 shadow-sm">
        <span className="text-[10px] text-white font-extrabold uppercase tracking-widest scale-y-110 font-mono">AJIO</span>
      </div>
    );
  }
  
  if (normalized.includes('swiggy')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9F33] to-[#FF5600] border border-orange-400/20 flex items-center justify-center select-none flex-shrink-0 shadow-sm relative overflow-hidden">
        <svg className="w-4 h-6 text-white" viewBox="0 0 16 24" fill="currentColor">
          <path d="M4 20C4 20 1 18 1 15C1 12 5 11 5 8C5 5 1 4 1 2C1 0 4 0 7 2C10 4 14 6 14 9C14 12 11 14 11 17C11 20 14 21 14 23C11 23 8 22 4 20Z" fillRule="evenodd" />
        </svg>
      </div>
    );
  }
  
  if (normalized.includes('zomato')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#cb202d] border border-red-500/20 flex flex-col items-center justify-center select-none flex-shrink-0 shadow-sm">
        <span className="text-[11px] text-white tracking-tighter lowercase font-black font-sans leading-none">zomato</span>
        <svg className="w-2.5 h-2.5 text-white mt-1 fill-current" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
    );
  }
  
  if (normalized.includes('myntra')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-white border border-rose-100 flex items-center justify-center font-black select-none flex-shrink-0 shadow-xs relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FF3366] via-[#FF8833] to-[#AA33FF] opacity-10" />
        <span className="text-sm font-black tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-tr from-[#E61C5D] via-[#FF5F1F] to-[#8F00FF] scale-y-115">M</span>
      </div>
    );
  }
  
  if (normalized.includes('bookmyshow') || normalized.includes('bms')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#df1827] border border-red-550/25 flex flex-col items-center justify-center text-white select-none flex-shrink-0 shadow-sm">
        <span className="text-[7.5px] uppercase font-mono font-black tracking-tight leading-none text-red-100">BOOKMY</span>
        <span className="text-[8px] uppercase font-black tracking-widest leading-none mt-0.5 text-zinc-100">SHOW</span>
      </div>
    );
  }

  if (normalized.includes('puma')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-black border border-zinc-900 flex flex-col items-center justify-center text-white select-none flex-shrink-0 shadow-sm">
        <svg className="w-4 h-4 text-white -mb-0.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 5.5l1.5-1.5L22 5.5H19z M4 11.5L5.5 10l5.5 5.5L4 11.5z M18 13.5l-3-3l-7.5 7.5l3.5 3.5L18 13.5z" />
        </svg>
        <span className="text-[7px] tracking-widest uppercase font-black text-white font-mono leading-none mt-1">PUMA</span>
      </div>
    );
  }

  if (normalized.includes('lakme')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#141210] border border-amber-900/35 flex items-center justify-center font-serif text-[8.5px] tracking-widest font-black text-[#D4AF37] uppercase select-none flex-shrink-0 shadow-sm leading-none">
        LAKMÉ
      </div>
    );
  }

  if (normalized.includes('fastrack')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#1a1c1d] border border-zinc-800 flex flex-col items-center justify-center text-yellow-500 select-none flex-shrink-0 shadow-sm">
        <span className="text-[9.5px] tracking-tighter uppercase leading-none font-black text-[#CEEF00]">FAST</span>
        <span className="text-[8.5px] tracking-widest uppercase leading-none text-white font-extrabold -mt-0.5">RCK</span>
      </div>
    );
  }

  if (normalized.includes('yatra')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#ec3832] border border-red-500/25 flex flex-col items-center justify-center text-white select-none flex-shrink-0 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-white/10 translate-x-1.5 -translate-y-1.5" />
        <span className="text-[9.5px] tracking-tight uppercase leading-none italic font-serif font-black">yatra</span>
        <span className="text-[8px] mt-0.5 leading-none opacity-90">✈️</span>
      </div>
    );
  }

  if (normalized.includes('sbi')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00a3e0] to-[#005a9c] border border-cyan-400/20 flex flex-col items-center justify-center text-white select-none flex-shrink-0 relative shadow-sm">
        <span className="text-[10px] tracking-tighter uppercase font-mono font-black leading-none italic">SBI</span>
        <div className="w-2.5 h-2.5 rounded-full border border-white mt-1 relative flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
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

// High fidelity CSS-drawing card render helper mimicking Yatra, Puma, Lakme, Titan
const renderCardGraphic = (brandName: string) => {
  const norm = brandName.toLowerCase();
  if (norm.includes('yatra')) {
    return (
      <div className="h-32 w-full rounded-2xl bg-gradient-to-r from-[#01adb9] to-[#01c6bd] p-3 text-white flex flex-col justify-between relative overflow-hidden shadow-xs border border-teal-500/10 select-none">
        {/* Background confetti/gifts */}
        <div className="absolute top-0 right-0 opacity-20 text-6xl">🎁</div>
        <div className="absolute -left-4 -bottom-4 opacity-10 text-7xl select-none rotate-12">✈️</div>
        
        {/* Header Row */}
        <div className="flex justify-between items-center z-10">
          <div className="flex flex-col items-start leading-none">
            <span className="text-[15px] font-black italic tracking-tighter text-[#ea2e32] bg-white px-2 py-0.5 rounded">yatra</span>
          </div>
          <span className="text-[8px] uppercase tracking-widest font-black font-sans bg-white/20 px-2 py-1 rounded-full backdrop-blur-xs">SPECIAL</span>
        </div>

        {/* Center label */}
        <div className="text-right z-10 pr-2">
          <h4 className="text-[13px] font-black tracking-tight leading-none text-white drop-shadow-xs">TRAVEL</h4>
          <h4 className="text-[17px] font-black tracking-tighter leading-none text-white drop-shadow-sm mt-0.5">GIFT CARD</h4>
        </div>

        {/* Bottom indicators */}
        <div className="flex justify-between items-end z-10">
          <span className="text-[8px] text-teal-100 font-mono tracking-wider">VouchLoop Partner</span>
          <span className="text-[9px] font-black text-[#ea2e32] bg-white px-1.5 py-0.2 rounded font-sans">90% cashback</span>
        </div>
      </div>
    );
  }

  if (norm.includes('puma')) {
    return (
      <div className="h-32 w-full rounded-2xl bg-white p-3 text-zinc-900 flex flex-col justify-between relative overflow-hidden shadow-xs border border-zinc-200 select-none">
        {/* Puma watermark shadow background */}
        <div className="absolute right-2 top-2 w-20 h-20 opacity-[0.06] text-black">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 5.5l1.5-1.5L22 5.5H19z M4 11.5L5.5 10l5.5 5.5L4 11.5z M18 13.5l-3-3l-7.5 7.5l3.5 3.5L18 13.5z" />
          </svg>
        </div>

        {/* Header Row - Branding */}
        <div className="flex justify-between items-start z-10">
          <div className="flex flex-col">
            <div className="text-red-600 font-black tracking-widest text-lg uppercase flex items-center gap-1.5 font-sans leading-none">
              <svg className="w-8 h-8 text-black fill-current" viewBox="0 0 24 24">
                <path d="M19 5.5l1.5-1.5L22 5.5H19z M4 11.5L5.5 10l5.5 5.5L4 11.5z M18 13.5l-3-3l-7.5 7.5l3.5 3.5L18 13.5z" />
              </svg>
              <div className="flex flex-col text-left">
                <span className="text-[17px] leading-none font-black text-red-650 font-sans tracking-tighter">PUMA</span>
                <span className="text-[8px] text-zinc-500 font-medium font-sans mt-0.5">gift card</span>
              </div>
            </div>
          </div>
          <span className="text-[7px] text-zinc-400 font-black border border-zinc-200 px-1.5 py-0.5 rounded tracking-widest uppercase">ORIGINAL</span>
        </div>

        {/* Bottom Slogan row */}
        <div className="flex justify-between items-end z-10 border-t border-zinc-100 pt-1.5 mt-1">
          <span className="text-[8px] font-bold text-zinc-600 font-mono tracking-tight leading-none uppercase max-w-[130px]">THE GIFT THAT FITS EVERYONE</span>
          <div className="w-10 h-3 flex items-center justify-between opacity-40">
            {/* Minimal barcode pattern */}
            <div className="w-[1px] h-full bg-black" />
            <div className="w-1 h-full bg-black" />
            <div className="w-[1px] h-full bg-black" />
            <div className="w-[1px] h-full bg-black" />
            <div className="w-1.5 h-full bg-black" />
            <div className="w-[1px] h-full bg-black" />
          </div>
        </div>
      </div>
    );
  }

  if (norm.includes('lakme') || norm.includes('lakmé')) {
    return (
      <div className="h-32 w-full rounded-2xl bg-gradient-to-r from-[#181310] to-[#251d18] p-3 text-white flex flex-col justify-between relative overflow-hidden shadow-xs border border-amber-900/10 select-none">
        {/* Makeup watermark */}
        <div className="absolute right-1 bottom-1 opacity-15 text-5xl select-none leading-none">💄</div>

        {/* Top brand label */}
        <div className="flex justify-between items-start z-10">
          <div className="flex flex-col items-start">
            <span className="text-[11.5px] font-bold font-serif tracking-[0.2em] leading-none text-[#CCA163]">LAKMÉ SALON</span>
          </div>
          <span className="text-[7px] tracking-widest text-[#CCA163] bg-[#ff116d]/20 px-1.5 py-0.5 rounded font-mono font-bold leading-none">GIFT CARD</span>
        </div>

        {/* Custom Pink Stripe with runway tagline mimicking image */}
        <div className="bg-[#ff116d] text-white py-1 px-2.5 mx-[-12px] my-1 z-10 flex flex-col font-sans">
          <span className="text-[7.5px] font-black tracking-widest uppercase text-center">RUNWAY EXCELLENCE EVERYDAY</span>
        </div>

        {/* Footer info lockup */}
        <div className="flex justify-between items-end z-10">
          <span className="text-[7.5px] text-zinc-400 font-sans font-medium uppercase tracking-wider">Premium Experience</span>
          <span className="text-[8px] font-bold text-[#E5A93B] font-mono">SALON VOUCHER</span>
        </div>
      </div>
    );
  }

  if (norm.includes('titan')) {
    return (
      <div className="h-32 w-full rounded-2xl bg-gradient-to-br from-[#0c1821] via-[#15233c] to-[#04080f] p-3 text-white flex flex-col justify-between relative overflow-hidden shadow-xs border border-zinc-800 select-none">
        {/* Gold wavy diagonal lines overlay mimicking image art */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-200 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-2 right-2 opacity-20 text-2xl">✨</div>
        
        {/* Elegant Header with Titan logo representation */}
        <div className="flex justify-between items-start z-10">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full border border-amber-400/80 flex items-center justify-center">
              <span className="text-[7px] font-serif font-black text-amber-400">T</span>
            </div>
            <span className="text-[11.5px] font-black tracking-[0.25em] font-serif text-[#ebd399] uppercase">TITAN</span>
          </div>
          <span className="text-[7.5px] text-amber-300 font-mono tracking-widest bg-amber-950/30 px-1.5 py-0.5 rounded">GIFT DEALS</span>
        </div>

        {/* Center Voucher text */}
        <div className="z-10 pl-1">
          <span className="text-[13px] font-serif italic text-amber-200 tracking-wide block">Gift Voucher</span>
        </div>

        {/* Footer sparkling stars */}
        <div className="flex justify-between items-end z-10">
          <span className="text-[7.5px] text-zinc-400 font-mono tracking-wide">EXCLUSIVE COLLECTION</span>
          <span className="text-[9px] text-amber-400 leading-none">✦ ✦ ✦</span>
        </div>
      </div>
    );
  }

  // Backup or Swiggy
  if (norm.includes('swiggy')) {
    return (
      <div className="h-32 w-full rounded-2xl bg-gradient-to-br from-orange-400 to-amber-600 p-3 text-white flex flex-col justify-between relative overflow-hidden shadow-xs select-none">
        <div className="absolute right-0 bottom-0 opacity-20 text-6xl">🍊</div>
        <div className="flex justify-between items-start z-10">
          <span className="text-sm font-black italic tracking-tighter uppercase font-sans">Swiggy</span>
          <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Food Voucher</span>
        </div>
        <div className="z-10">
          <h4 className="text-[15px] font-extrabold text-white leading-none">SWIGGY PLATTER</h4>
          <span className="text-[9px] text-orange-200 font-medium">Instant Hot Delivery</span>
        </div>
        <div className="flex justify-between items-end z-10">
          <span className="text-[8px] text-orange-100 font-mono">15% SAVINGS</span>
          <span className="text-[10px] leading-none">🍟</span>
        </div>
      </div>
    );
  }

  // Backup or Zomato
  if (norm.includes('zomato')) {
    return (
      <div className="h-32 w-full rounded-2xl bg-gradient-to-br from-[#e23744] to-[#cb202d] p-3 text-white flex flex-col justify-between relative overflow-hidden shadow-xs select-none">
        <div className="absolute right-1 bottom-1 opacity-20 text-6xl">🍕</div>
        <div className="flex justify-between items-start z-10">
          <span className="text-sm font-black tracking-widest uppercase font-sans">zomato</span>
          <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full font-bold font-sans">Gold Special</span>
        </div>
        <div className="z-10">
          <h4 className="text-[15px] font-extrabold text-white leading-none">ZOMATO GOLD</h4>
          <span className="text-[9px] text-red-150 font-medium">Fine Dine & Premium</span>
        </div>
        <div className="flex justify-between items-end z-10">
          <span className="text-[8px] text-red-100 font-mono">18% REWARDS</span>
          <span className="text-[10px] leading-none">🍔</span>
        </div>
      </div>
    );
  }

  // AJIO
  if (norm.includes('ajio')) {
    return (
      <div className="h-32 w-full rounded-2xl bg-[#000000] p-3 text-white flex flex-col justify-between relative overflow-hidden shadow-xs border border-zinc-950 select-none">
        <div className="absolute right-0 bottom-0 opacity-15 text-5xl">👗</div>
        <div className="flex justify-between items-start z-10">
          <span className="text-sm font-black tracking-widest font-mono uppercase">AJIO</span>
          <span className="text-[8px] bg-zinc-800 text-zinc-100 px-2 py-0.5 rounded-full font-bold">Shopping Card</span>
        </div>
        <div>
          <h4 className="text-[12px] font-black text-rose-500 tracking-widest uppercase italic">RED HOT DEAL</h4>
          <p className="text-[8px] text-zinc-400 mt-0.5 font-medium uppercase">Premium Fashion Hub</p>
        </div>
        <div className="flex justify-between items-end z-10">
          <span className="text-[8px] text-rose-200 font-mono">25% SAVINGS</span>
          <span className="text-[10px] leading-none">👞</span>
        </div>
      </div>
    );
  }

  // Myntra
  return (
    <div className="h-32 w-full rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 p-3 text-white flex flex-col justify-between relative overflow-hidden shadow-xs select-none">
      <div className="absolute right-0 bottom-0 opacity-25 text-5xl">👜</div>
      <div className="flex justify-between items-start z-10">
        <span className="text-sm font-black tracking-tighter uppercase font-sans">Myntra</span>
        <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full font-bold">E-Voucher</span>
      </div>
      <div>
        <h4 className="text-[14px] font-extrabold text-white leading-none">MYNTRA STYLE</h4>
        <span className="text-[9px] text-rose-100 font-medium">Trendsetter Curations</span>
      </div>
      <div className="flex justify-between items-end z-10">
        <span className="text-[8px] text-rose-100 font-mono">20% CASHBACK</span>
        <span className="text-[10px] leading-none">🏷️</span>
      </div>
    </div>
  );
};

// High fidelity CSS-drawing store render helper mimicking Amazon, Flipkart, Myntra, BookMyShow
const renderStoreCardGraphic = (storeName: string) => {
  const norm = storeName.toLowerCase();
  
  if (norm.includes('amazon')) {
    return (
      <div className="h-32 w-full rounded-2xl bg-gradient-to-br from-[#121212] via-[#242424] to-[#0d0d0d] p-3 text-white flex flex-col justify-between relative overflow-hidden shadow-xs border border-zinc-800 select-none">
        {/* Amazon Pay brand layout with gold curves */}
        <div className="absolute right-[-10px] top-[-10px] w-24 h-24 rounded-full border border-amber-500/10 pointer-events-none" />
        <div className="absolute bottom-[-15px] left-[-15px] w-28 h-28 rounded-full bg-amber-500/5 filter blur-xl pointer-events-none" />
        
        <div className="flex justify-between items-start z-10 w-full">
          <div className="flex flex-col items-start leading-none text-left">
            <span className="text-[12px] text-[#ff9900] font-black tracking-tight leading-none uppercase">amazon pay</span>
            <span className="text-[7.5px] text-zinc-400 font-extrabold uppercase mt-1 tracking-wider">gift card</span>
          </div>
          <div className="text-[#ff9900] text-xl">🪙</div>
        </div>

        <div className="z-10 text-left">
          <h4 className="text-[14px] font-black text-amber-450 tracking-tight leading-tight">PREMIUM REWARDS</h4>
          <span className="text-[8px] text-zinc-400 font-mono tracking-wider">75 Gift Cards Live</span>
        </div>

        <div className="flex justify-between items-end z-10 border-t border-zinc-800 pt-1.5">
          <span className="text-[8px] text-zinc-550 font-bold">VouchLoop Gold</span>
          <span className="text-[8.5px] text-amber-400 font-bold uppercase tracking-wider">Upto 4.74% back</span>
        </div>
      </div>
    );
  }

  if (norm.includes('flipkart')) {
    return (
      <div className="h-32 w-full rounded-2xl bg-gradient-to-br from-[#2c77df] via-[#1c55aa] to-[#0c326b] p-3 text-white flex flex-col justify-between relative overflow-hidden shadow-xs border border-blue-400/20 select-none">
        {/* Blue background with gifts illustrations mimicking image */}
        <div className="absolute right-1 bottom-1 text-5xl opacity-40 select-none">🎁</div>
        <div className="absolute left-1/3 bottom-2 text-2.5xl opacity-20 select-none">🎈</div>
        
        <div className="flex justify-between items-start z-10 w-full">
          <span className="text-[15px] font-black italic text-white tracking-widest leading-none">Flipkart</span>
          <span className="text-[8px] bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">GIFT CARD</span>
        </div>

        <div className="z-10 text-left">
          <span className="text-[10px] text-yellow-300 font-black tracking-wider uppercase block">THE BIG BILLION GIFT</span>
          <span className="text-[7.5px] text-blue-100 font-mono">12 Active deals today</span>
        </div>

        <div className="flex justify-between items-end z-10 border-t border-blue-900/50 pt-1.5">
          <span className="text-[8px] text-blue-100 font-bold">100% Genuine</span>
          <span className="text-[8.5px] text-[#ffe500] font-black uppercase">Upto 6% back</span>
        </div>
      </div>
    );
  }

  if (norm.includes('myntra')) {
    return (
      <div className="h-32 w-full rounded-2xl bg-gradient-to-tr from-[#fe3365] via-[#ee5a35] to-[#fec953] p-3 text-white flex flex-col justify-between relative overflow-hidden shadow-xs border border-red-500/15 select-none">
        {/* Pink background, style token cards mimicking model illustrations */}
        <div className="absolute right-[-10px] bottom-[-5px] opacity-25 text-6xl select-none">💃</div>
        <div className="absolute left-[-5px] top-[-5px] opacity-10 text-5xl">🌸</div>
        
        <div className="flex justify-between items-start z-10 w-full">
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-black text-white uppercase font-sans leading-none tracking-tight">MYNTRA</span>
            <span className="text-[7.1px] text-rose-100 uppercase tracking-widest font-black mt-0.5">Style Token</span>
          </div>
          <span className="text-[10px]">✨</span>
        </div>

        <div className="z-10 text-left pr-6">
          <h4 className="text-[10.5px] font-black leading-tight text-white uppercase tracking-tight">A Special Token</h4>
          <p className="text-[7px] text-rose-50 font-normal leading-none italic mt-0.5">May each day be styled & memorable!</p>
        </div>

        <div className="flex justify-between items-end z-10 border-t border-rose-900/10 pt-1.5">
          <span className="text-[8px] text-rose-100 font-bold">Fashion Showcase</span>
          <span className="text-[8.5px] text-yellow-250 font-black">Upto 8% back</span>
        </div>
      </div>
    );
  }

  if (norm.includes('bookmyshow') || norm.includes('book') || norm.includes('show')) {
    return (
      <div className="h-32 w-full rounded-2xl bg-gradient-to-br from-[#01adb9] to-[#0d9488] p-3 text-white flex flex-col justify-between relative overflow-hidden shadow-xs border border-teal-500/10 select-none">
        {/* Popcorn box and tickets on mint background */}
        <div className="absolute right-1 bottom-1 text-5xl opacity-45 select-none">🍿</div>
        
        <div className="flex justify-between items-start z-10 w-full">
          <div className="flex flex-col items-start text-left">
            <span className="text-[10px] font-semibold text-teal-100 uppercase leading-none font-sans">bookmyshow</span>
            <span className="text-[11px] font-black text-white uppercase tracking-wider mt-0.5">GIFT CARD</span>
          </div>
          <span className="text-[10px]">🎬</span>
        </div>

        <div className="z-10 text-left">
          <span className="text-[13px] font-black tracking-tighter leading-none block">BLOCKBUSTER</span>
          <span className="text-[7.5px] text-teal-100 font-mono">Instant Voucher Delivery</span>
        </div>

        <div className="flex justify-between items-end z-10 border-t border-teal-950/20 pt-1.5">
          <span className="text-[8px] text-teal-100 font-bold">Movies & Shows</span>
          <span className="text-[8.5px] text-white font-extrabold bg-teal-950/20 px-1.5 py-0.2 rounded">Upto 8% back</span>
        </div>
      </div>
    );
  }

  // Fallback store
  return (
    <div className="h-32 w-full rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 p-3 text-white flex flex-col justify-between relative overflow-hidden shadow-xs select-none">
      <div className="flex justify-between items-start z-10">
        <span className="text-sm font-black tracking-tight">{storeName}</span>
        <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Store Voucher</span>
      </div>
      <div>
        <span className="text-[8px] text-slate-300 block">INSTANT REDEEM</span>
      </div>
    </div>
  );
};

interface LandingViewProps {
  coupons: Coupon[];
  reviews: Review[];
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string) => void;
  onBuyCoupon: (coupon: Coupon) => void;
  buyingId: string | null;
  sessionUser: UserType | null;
  onLoginSuccess?: (user: any) => void;
  showToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function LandingView({
  coupons,
  reviews,
  setActiveTab,
  setSearchQuery,
  setSelectedCategory,
  onBuyCoupon,
  buyingId,
  sessionUser,
  onLoginSuccess,
  showToast
}: LandingViewProps) {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchVal, setSearchVal] = useState('');
  const [giftCardOffset, setGiftCardOffset] = useState(0);
  const [storeOffset, setStoreOffset] = useState(0);

  // Embedded Auth states - Separated cleanly for login and register with no toggles required
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [nameRegister, setNameRegister] = useState('');
  const [emailRegister, setEmailRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

  const handleEmbeddedLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailLogin.trim() || !passwordLogin) {
      setLoginError('Please enter both email and password.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLogin.trim())) {
      setLoginError('Please enter a valid email address.');
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLogin.trim(), password: passwordLogin })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Safe credentials storage to maintain auto-login correctly
        const userToSave = { ...data.user, savedPassword: passwordLogin };
        localStorage.setItem('vouchloop_saved_session', JSON.stringify(userToSave));
        
        if (showToast) {
          showToast(data.message || `Welcome back, ${data.user.name}!`, 'success');
        }
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      } else {
        throw new Error(data.error || 'Login rejected. Please check credentials.');
      }
    } catch (err) {
      // Offline fallback: check localStorage or INITIAL_USERS
      const currentUsersStr = localStorage.getItem('vouchloop_users');
      let currentUsers = currentUsersStr ? JSON.parse(currentUsersStr) : INITIAL_USERS;
      if (!currentUsersStr) {
        localStorage.setItem('vouchloop_users', JSON.stringify(INITIAL_USERS));
      }

      const matchUser = currentUsers.find((u: any) => u.email.toLowerCase() === emailLogin.trim().toLowerCase());
      if (matchUser) {
        const savedUserObj = { ...matchUser, savedPassword: passwordLogin };
        localStorage.setItem('vouchloop_saved_session', JSON.stringify(savedUserObj));
        if (showToast) showToast(`Welcome back, ${matchUser.name}!`, 'success');
        if (onLoginSuccess) {
          onLoginSuccess(matchUser);
        }
      } else {
        setLoginError('Incorrect password or email not found. Please try with correct inputs.');
        if (showToast) showToast('Authentication failed. Check your details.', 'error');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleEmbeddedRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameRegister.trim() || !emailRegister.trim() || !passwordRegister) {
      setRegisterError('Please fill in all register fields.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailRegister.trim())) {
      setRegisterError('Please enter a valid email address.');
      return;
    }
    if (passwordRegister.length < 6) {
      setRegisterError('Password should be at least 6 characters.');
      return;
    }

    setRegisterLoading(true);
    setRegisterError(null);
    setRegisterSuccess(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameRegister.trim(), email: emailRegister.trim(), password: passwordRegister })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        if (data.verificationRequired) {
          setRegisterSuccess(data.message || 'Verification email sent! Check inbox / spam to verify.');
          if (showToast) showToast('Verification email sent securely.', 'info');
        } else {
          // Safe credentials storage to maintain auto-login correctly
          const userToSave = { ...data.user, savedPassword: passwordRegister };
          localStorage.setItem('vouchloop_saved_session', JSON.stringify(userToSave));

          if (showToast) {
            showToast(data.message || 'Account created successfully! Received ₹5,000 starting wallet credit.', 'success');
          }
          if (onLoginSuccess) {
            onLoginSuccess(data.user);
          }
        }
      } else {
        throw new Error(data.error || 'Registration failed.');
      }
    } catch (err) {
      // Offline fallback signup
      const currentUsersStr = localStorage.getItem('vouchloop_users');
      let currentUsers = currentUsersStr ? JSON.parse(currentUsersStr) : [...INITIAL_USERS];
      if (!currentUsersStr) {
        localStorage.setItem('vouchloop_users', JSON.stringify(INITIAL_USERS));
      }
      
      const emailExists = currentUsers.some((u: any) => u.email.toLowerCase() === emailRegister.trim().toLowerCase());
      if (emailExists) {
        // Safe auto login bypass for pre-seeded email match to avoid blocking
        const existingUser = currentUsers.find((u: any) => u.email.toLowerCase() === emailRegister.trim().toLowerCase());
        const savedUserObj = { ...existingUser, savedPassword: passwordRegister };
        localStorage.setItem('vouchloop_saved_session', JSON.stringify(savedUserObj));
        
        if (showToast) {
          showToast(`Welcome back, ${existingUser.name}!`, 'success');
        }
        if (onLoginSuccess) {
          onLoginSuccess(existingUser);
        }
      } else {
        const newUserObj = {
          id: `usr-${Date.now()}`,
          name: nameRegister.trim(),
          email: emailRegister.trim(),
          role: emailRegister.trim().toLowerCase().includes('admin') ? 'admin' : 'user',
          balance: 5000,
          kycStatus: 'verified' as const,
          referralCode: `VOUCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          isPremium: false,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nameRegister.trim())}`
        };
        currentUsers.push(newUserObj);
        localStorage.setItem('vouchloop_users', JSON.stringify(currentUsers));

        const savedUserObj = { ...newUserObj, savedPassword: passwordRegister };
        localStorage.setItem('vouchloop_saved_session', JSON.stringify(savedUserObj));

        if (showToast) {
          showToast('Account registered successfully! Received ₹5,000 wallet starting balance.', 'success');
        }
        if (onLoginSuccess) {
          onLoginSuccess(newUserObj);
        }
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleBuyClick = (coupon: Coupon) => {
    if (!sessionUser) {
      if (showToast) {
        showToast('Please sign up or sign in to claim vouchers securely.', 'info');
      }
      setActiveTab('auth');
      return;
    }
    onBuyCoupon(coupon);
  };

  // Zingoy-themed promotional sliding banners
  const banners = [
    {
      id: "amazon",
      brand: "Amazon Pay Rewards",
      logoType: "amazon",
      title: "Get 50 - 90% Off",
      sub: "Across categories",
      reward: "Upto 4.74% VouchLoop Rewards",
      btnBg: "bg-orange-500 hover:bg-orange-600 text-white font-bold",
      bgGradient: "from-[#FDFBF7] via-[#F5EFE6] to-[#EAE3D2]",
      textColor: "text-slate-900",
      query: "amazon",
      tagLine: "Ultimate Lifestyle Savings Hub",
      items: [
        { name: "👕 Summer Apparel", style: "bg-amber-100 text-amber-800" },
        { name: "🕶️ Retro Shades", style: "bg-indigo-100 text-indigo-800" },
        { name: "⌚ Smartwatch OS", style: "bg-rose-100 text-rose-800" },
        { name: "👜 Leather Bag", style: "bg-emerald-100 text-emerald-800" }
      ]
    },
    {
      id: "flipkart",
      brand: "Flipkart Cashback Deal",
      logoType: "flipkart",
      title: "50-90% Off",
      sub: "Across category",
      reward: "Upto 6% VouchLoop Cashback",
      btnBg: "bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold",
      bgGradient: "from-emerald-500 via-emerald-600 to-teal-700",
      textColor: "text-white",
      query: "flipkart",
      tagLine: "Big Billion Shopping Spree",
      items: [
        { name: "🎧 ANC Headset", style: "bg-white/10 text-white" },
        { name: "📱 Flagship 5G", style: "bg-white/15 text-white" }
      ]
    },
    {
      id: "ajio",
      brand: "AJIO Premium Outlet",
      logoType: "ajio",
      title: "RED HOT SALE",
      sub: "You Either Get It Or You Don't!",
      reward: "+ Upto 12% VouchLoop Cashback",
      btnBg: "bg-white hover:bg-zinc-100 text-rose-950 font-bold",
      bgGradient: "from-rose-950 via-rose-900 to-stone-900",
      textColor: "text-rose-100",
      query: "ajio",
      tagLine: "Trending Styles & Global Brands Guide",
      items: [
        { name: "👗 Luxury Outfits", style: "bg-rose-900/40 text-rose-200" },
        { name: "👟 Urban Kicks", style: "bg-rose-900/40 text-rose-200" }
      ]
    }
  ];

  // Auto transition for banner carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % banners.length);
  };

  const handleGiftCardPrev = () => {
    setGiftCardOffset(prev => Math.max(0, prev - 1));
  };

  const handleGiftCardNext = () => {
    setGiftCardOffset(prev => Math.min(giftCardOffers.length - 4, prev + 1));
  };

  const handleStorePrev = () => {
    setStoreOffset(prev => Math.max(0, prev - 1));
  };

  const handleStoreNext = () => {
    // There are 4 visible items, let we limit storeOffset
    setStoreOffset(prev => Math.min(2, prev + 1)); 
  };

  const handleBannerAction = (query: string) => {
    setSelectedCategory('All');
    setSearchQuery(query);
    setActiveTab('marketplace');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCategory('All');
    setSearchQuery(searchVal);
    setActiveTab('marketplace');
  };

  // Gift Card Cashback Offers (precise mockup references with dotted underline text labels)
  const giftCardOffers = [
    {
      brand: "Yatra Flight Gift Card",
      badgeText: "Yatra",
      cashback: "90 % Cashback",
      bgClass: "yatra",
      accentEmoji: "✈️",
      mockValue: "₹5,000 Card",
      query: "yatra"
    },
    {
      brand: "Puma Gift Card",
      badgeText: "Puma",
      cashback: "69 % Cashback",
      bgClass: "puma",
      accentEmoji: "🐆",
      mockValue: "₹3,000 Card",
      query: "puma"
    },
    {
      brand: "Lakme Gift Card",
      badgeText: "Lakme",
      cashback: "60 % Cashback",
      bgClass: "lakme",
      accentEmoji: "💄",
      mockValue: "₹2,000 Card",
      query: "lakme"
    },
    {
      brand: "Titan Watches Gift Card",
      badgeText: "Titan",
      cashback: "50 % Cashback",
      bgClass: "titan",
      accentEmoji: "⌚",
      mockValue: "₹5,000 Card",
      query: "titan"
    },
    {
      brand: "Swiggy Food Voucher",
      badgeText: "Swiggy",
      cashback: "15 % Cashback",
      bgClass: "swiggy",
      accentEmoji: "🍟",
      mockValue: "₹1,000 Card",
      query: "swiggy"
    },
    {
      brand: "Zomato Food Complimentary Gold",
      badgeText: "Zomato",
      cashback: "18 % Cashback",
      bgClass: "zomato",
      accentEmoji: "🍕",
      mockValue: "₹500 Card",
      query: "zomato"
    },
    {
      brand: "AJIO Premium Shopping",
      badgeText: "AJIO",
      cashback: "25 % Cashback",
      bgClass: "ajio",
      accentEmoji: "👗",
      mockValue: "₹2,500 Card",
      query: "ajio"
    },
    {
      brand: "Myntra Fashion Discount",
      badgeText: "Myntra",
      cashback: "20 % Cashback",
      bgClass: "myntra",
      accentEmoji: "👜",
      mockValue: "₹2,000 Card",
      query: "myntra"
    }
  ];

  // Online Shopping Cashback Offers (mockup bottom references)
  const onlineShoppingOffers = [
    {
      logo: "Myntra",
      brandTitle: "Myntra",
      offText: "Get 50 - 90% OFF Across Categories",
      cashbackText: "Upto 8% Cashback",
      logoBg: "bg-white",
      query: "myntra",
      category: "Fashion & Lifestyle",
      borderColor: "hover:border-pink-400 font-sans",
      badgeText: "TRENDING",
      badgeColor: "bg-pink-100 text-pink-600",
      pillBg: "bg-pink-50 border border-pink-250 text-pink-600",
      radialGlow: "from-pink-500/5 via-transparent to-transparent",
      actionText: "Claim rewards",
      bannerColor: "from-pink-600 to-rose-450"
    },
    {
      logo: "AJIO",
      brandTitle: "AJIO",
      offText: "Red hot Sale is Live : Get 50 - 90% OFF + 12% Discount on HSBC Bank cards",
      cashbackText: "Upto 10% Cashback",
      logoBg: "bg-white",
      query: "ajio",
      category: "Premium Fashion",
      borderColor: "hover:border-zinc-850 font-sans",
      badgeText: "RED HOT",
      badgeColor: "bg-red-100 text-red-600",
      pillBg: "bg-red-50 border border-red-250 text-red-600",
      radialGlow: "from-red-500/5 via-transparent to-transparent",
      actionText: "Activate offer",
      bannerColor: "from-zinc-950 to-zinc-900"
    },
    {
      logo: "SBI Card • SPRINT",
      brandTitle: "SBI Card",
      offText: "SBI Flipkart Credit Card - Rs1700 Cashback Voucher on Signup",
      cashbackText: "Upto Rs 1600 Cashback",
      logoBg: "bg-white",
      query: "flipkart",
      category: "Finance Deals",
      borderColor: "hover:border-cyan-400 font-sans",
      badgeText: "POPULAR",
      badgeColor: "bg-cyan-100 text-cyan-650",
      pillBg: "bg-cyan-50 border border-cyan-250 text-cyan-650",
      radialGlow: "from-cyan-500/5 via-transparent to-transparent",
      actionText: "Unlock rewards",
      bannerColor: "from-cyan-600 to-blue-600"
    },
    {
      logo: "Flipkart",
      brandTitle: "Flipkart",
      offText: "Cool Off with Premium Air Conditioners starting from Rs.20,490!",
      cashbackText: "Upto 6% Cashback",
      logoBg: "bg-white",
      query: "flipkart",
      category: "Electronics sale",
      borderColor: "hover:border-blue-400 font-sans",
      badgeText: "HOT DEAL",
      badgeColor: "bg-blue-100 text-blue-600",
      pillBg: "bg-blue-50 border border-blue-250 text-blue-600",
      radialGlow: "from-blue-500/5 via-transparent to-transparent",
      actionText: "Activate deal",
      bannerColor: "from-blue-600 to-[#ffe500]"
    }
  ];

  const categoriesList = [
    { name: 'Shopping', icon: '🛍️', borderHover: 'hover:border-indigo-500 hover:shadow-indigo-500/5', iconBg: 'bg-indigo-50/65 text-indigo-700' },
    { name: 'Food', icon: '🍔', borderHover: 'hover:border-emerald-500 hover:shadow-emerald-500/5', iconBg: 'bg-emerald-50/65 text-emerald-700' },
    { name: 'Travel', icon: '✈️', borderHover: 'hover:border-cyan-500 hover:shadow-cyan-500/5', iconBg: 'bg-cyan-50/65 text-cyan-700' },
    { name: 'Entertainment', icon: '🎬', borderHover: 'hover:border-rose-500 hover:shadow-rose-500/5', iconBg: 'bg-rose-50/65 text-rose-700' },
    { name: 'Subscription', icon: '🔑', borderHover: 'hover:border-amber-500 hover:shadow-amber-500/5', iconBg: 'bg-amber-50/65 text-amber-700' },
    { name: 'Health', icon: '❤️', borderHover: 'hover:border-purple-500 hover:shadow-purple-500/5', iconBg: 'bg-purple-50/65 text-purple-700' }
  ];

  // Active public peer coupons listed on home feed
  const activeCoupons = coupons.filter(c => c.status === 'active').slice(0, 8);

  return (
    <div className="space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans bg-[#fbfcfd] rounded-3xl border border-zinc-150/60 shadow-xs">
      
      {/* 1. Zingoy High-Fidelity Interactive Hero sliding banner component */}
      <div className="w-full">
        <section className="relative rounded-3xl overflow-hidden shadow-lg border border-zinc-200 w-full" id="zingoy-hero-carousel">
          
          {/* Carousel Slide Wrapper */}
          <div className="relative min-h-[320px] sm:min-h-[380px] md:min-h-[420px] flex transition-all duration-500">
            {banners.map((slide, sIdx) => {
              const isActive = sIdx === currentSlide;
              if (!isActive) return null;

              return (
                <div 
                  key={slide.id}
                  className={`w-full flex-1 flex flex-col md:flex-row bg-gradient-to-r ${slide.bgGradient} ${slide.textColor} justify-between text-left p-6 sm:p-10 md:p-14 relative`}
                >
                  {/* Text Content Block */}
                  <div className="space-y-4 max-w-lg z-10 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900/10 rounded-full w-fit">
                      <Ticket className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{slide.tagLine}</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xl sm:text-2xl font-semibold tracking-tight leading-tight block">
                        {slide.brand}
                      </p>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none uppercase">
                        {slide.title}
                      </h2>
                      <p className="text-base sm:text-lg font-medium opacity-90 italic">
                        {slide.sub}
                      </p>
                    </div>

                    {/* Zingoy Style Rewards Box */}
                    <div className="bg-white/95 backdrop-blur-sm shadow-md border border-zinc-200/50 p-4 rounded-2xl w-fit">
                      <p className="text-sm font-black text-rose-600 tracking-tight flex items-center gap-1.5">
                        <Percent className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        <span>{slide.reward}</span>
                      </p>
                      <span className="text-[10px] font-medium text-slate-500 block mt-0.5">Instant coupon delivery to your account</span>
                    </div>

                    {/* CTA button */}
                    <button
                      onClick={() => handleBannerAction(slide.query)}
                      className={`px-7 py-3 rounded-xl shadow-md transition-all scale-100 hover:scale-[1.02] active:scale-95 cursor-pointer w-fit text-xs ${slide.btnBg}`}
                    >
                      Shop Now
                    </button>
                  </div>

                  {/* Right Visual Side Mockup representing images from prompt */}
                  <div className="hidden md:flex flex-col justify-center items-end relative w-1/2 z-10 select-none">
                    {slide.id === "amazon" && (
                      <div className="bg-white/80 p-6 rounded-3xl border border-amber-200/60 shadow-xl space-y-4 max-w-sm rotate-1">
                        <div className="flex justify-between items-center pb-2 border-b border-amber-100">
                          <span className="text-[11px] font-black text-[#FF9900] tracking-wider uppercase font-mono">Verified Gift Cards</span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">Upto 4.74% back</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-[11px] font-bold text-slate-700">
                          {slide.items?.map((it, idx) => (
                            <div key={idx} className={`p-2.5 rounded-xl border border-zinc-200/40 text-left ${it.style}`}>
                              {it.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {slide.id === "flipkart" && (
                      <div className="bg-zinc-950/25 p-6 rounded-3xl border border-white/10 shadow-xl space-y-4 max-w-sm -rotate-1">
                        <span className="text-[11px] font-bold text-yellow-300 block font-sans">⚡ DEALS OF THE HOUR</span>
                        <div className="space-y-2">
                          {slide.items?.map((it, idx) => (
                            <div key={idx} className={`p-3 rounded-xl text-left border border-white/10 font-black text-xs ${it.style}`}>
                              {it.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {slide.id === "ajio" && (
                      <div className="bg-gradient-to-br from-rose-950/60 to-black/40 p-6 rounded-3xl border border-rose-500/20 shadow-xl space-y-4 max-w-sm">
                        <span className="text-[11px] font-black tracking-widest text-[#FF116D] uppercase font-mono">AJIO Gift Cards</span>
                        <div className="space-y-2">
                          {slide.items?.map((it, idx) => (
                            <div key={idx} className={`p-3 rounded-xl border border-rose-500/10 font-extrabold text-xs ${it.style}`}>
                              {it.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          {/* Previous Button inside carousel */}
          <button 
            type="button"
            onClick={handlePrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-zinc-800 rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer z-20 focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Button inside carousel */}
          <button 
            type="button"
            onClick={handleNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-zinc-800 rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer z-20 focus:outline-none"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bottom indicator dots */}
          <div className="absolute bottom-4 left-1/2 -translate-y-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {banners.map((_, bIdx) => (
              <button
                key={bIdx}
                type="button"
                onClick={() => setCurrentSlide(bIdx)}
                className={`w-2.5 h-2.5 rounded-full transition-all focus:outline-none ${
                  bIdx === currentSlide ? 'bg-indigo-600 scale-125' : 'bg-slate-350 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </section>
      </div>

      {/* 2. SECTION: Gift Card Cashback Offers (Yatra, Puma, Lakme, Titan list row) */}
      <section className="space-y-8 relative">
        <div className="relative border-b border-zinc-150/80 pb-5 flex flex-col items-center justify-center">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-center relative font-sans select-none">
            GIFT CARD CASHBACK OFFERS
            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#2874f0] rounded-full" />
          </h2>
          <button 
            onClick={() => handleBannerAction('')}
            className="absolute right-0 bottom-4 text-[11px] font-black text-[#ff116d] hover:text-[#e0085a] uppercase tracking-wider cursor-pointer font-sans"
          >
            VIEW ALL GIFT CARDS
          </button>
        </div>

        <div className="relative px-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {giftCardOffers.slice(giftCardOffset, giftCardOffset + 4).map((offer) => (
              <div 
                key={offer.brand}
                onClick={() => handleBannerAction(offer.query || '')}
                className="bg-white rounded-2xl border border-zinc-200/90 p-3 hover:border-zinc-350 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                {/* Visual Graphic Representation */}
                {renderCardGraphic(offer.brand)}
                
                <div className="pt-3 pb-1 text-center font-sans space-y-2">
                  <p className="text-[13px] font-bold text-slate-700 group-hover:text-[#2874f0] transition-colors leading-relaxed truncate px-1">
                    {offer.brand}
                  </p>
                  
                  {/* Inside standard white dotted border block */}
                  <div className="inline-block w-full border border-pink-550 bg-white py-2 rounded-xl border-dashed">
                    <span className="text-[12.5px] font-black text-[#ff116d] tracking-wide block uppercase">
                      {offer.cashback}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {giftCardOffset > 0 && (
            <button 
              type="button"
              onClick={handleGiftCardPrev}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-350 hover:shadow-md flex items-center justify-center shadow-sm transition-all z-10"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}

          {giftCardOffset < giftCardOffers.length - 4 && (
            <button 
              type="button"
              onClick={handleGiftCardNext}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-350 hover:shadow-md flex items-center justify-center shadow-sm transition-all z-10"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </section>

      {/* 3. Zingoy-themed "Online Shopping Cashback Offers" */}
      <section className="space-y-6">
        
        {/* Section Header with blue line marker */}
        <div className="relative border-b border-zinc-150/80 pb-5 flex flex-col items-center justify-center">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-center relative font-sans select-none">
            ONLINE SHOPPING CASHBACK OFFERS
            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#2874f0] rounded-full" />
          </h2>
          <button 
            onClick={() => handleBannerAction('')}
            className="absolute right-0 bottom-4 text-[11px] font-black text-[#ff116d] hover:text-[#e0085a] uppercase tracking-wider cursor-pointer font-sans"
          >
            VIEW ALL
          </button>
        </div>

        {/* Precision row styled precisely like the lower part of prompt screenshot representing online merchants */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {onlineShoppingOffers.map((shop) => {
            const renderOnlineBrandLogoLocal = (brandTitle: string) => {
              const norm = brandTitle.toLowerCase();
              if (norm.includes('myntra')) {
                return (
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black select-none shadow-xs border border-zinc-150">
                      <span className="text-sm font-black bg-clip-text text-transparent bg-gradient-to-tr from-[#E61C5D] via-[#FF5F1F] to-[#8F00FF]">M</span>
                    </div>
                    <span className="text-[12.5px] font-extrabold text-slate-850 font-sans tracking-tight">Myntra</span>
                  </div>
                );
              }
              if (norm.includes('ajio')) {
                return (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[16px] font-black uppercase tracking-widest font-mono text-zinc-900 leading-none">AJIO</span>
                  </div>
                );
              }
              if (norm.includes('sbi')) {
                return (
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 bg-[#00a3e0] text-white px-2 py-0.5 rounded-md leading-none select-none">
                      <div className="w-2.5 h-2.5 rounded-full border border-white relative flex items-center justify-center flex-shrink-0">
                        <div className="w-1 h-1 bg-white rounded-full" />
                      </div>
                      <span className="text-[8px] font-extrabold font-sans uppercase tracking-tighter">SBI Card</span>
                    </div>
                    <span className="text-[10px] text-[#005a9c] font-black italic tracking-wider">SPRINT</span>
                  </div>
                );
              }
              if (norm.includes('flipkart')) {
                return (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-black text-[#2874f0] italic tracking-tighter leading-none">Flipkart</span>
                    <div className="w-4 h-4 bg-[#ffe500] rounded-xs relative flex items-center justify-center shadow-2xs">
                      <span className="text-[8px] text-[#2874f0] font-black">★</span>
                    </div>
                  </div>
                );
              }
              return <span className="text-sm font-extrabold text-slate-900">{brandTitle}</span>;
            };

            return (
              <div 
                key={shop.logo}
                onClick={() => handleBannerAction(shop.query)}
                className="bg-white border-2 border-[#e6edf8] hover:border-[#2874f0] rounded-2xl hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group"
              >
                {/* Merchant logo preview mockup and description */}
                <div className="p-4.5 space-y-4">
                  <div className="flex items-center pb-2.5 border-b border-zinc-100">
                    {renderOnlineBrandLogoLocal(shop.brandTitle)}
                  </div>

                  <p className="text-[12px] text-slate-600 font-semibold leading-relaxed line-clamp-2 min-h-[44px] text-left">
                    {shop.offText}
                  </p>
                </div>

                {/* Bottom solid bar containing cash reward index */}
                <div className="border-t border-slate-100 bg-[#f5f8fd] px-4 py-2.5 text-center group-hover:bg-[#ebf2fc] transition-colors">
                  <span className="text-[#2b74f0] font-black text-[12.5px] tracking-tight block">
                    {shop.cashbackText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3.1 SECTION: Sell Gift Card Hero Banner / Wave */}
      <section className="w-full">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#1e1e38] rounded-3xl p-8 sm:p-12 shadow-md border border-neutral-700/20 text-center relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-100/20 via-transparent to-transparent font-sans italic text-zinc-100 text-[10rem] font-bold select-none rotate-12 pointer-events-none">
            ₹₹
          </div>

          <button 
            type="button" 
            onClick={() => setIsHowItWorksOpen(true)}
            className="absolute top-4 right-6 text-[10.5px] font-black tracking-widest text-[#ffe500] hover:text-white transition-colors cursor-pointer"
          >
            KNOW MORE →
          </button>

          <div className="space-y-4 max-w-2xl z-10 font-sans text-center">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Got an unused Gift Card to sell?
            </h3>
            <p className="text-sm text-indigo-150 leading-relaxed max-w-xl mx-auto opacity-95">
              Sell it on Zingoy Marketplace, it's fast, easy and safe! Most gift cards will be sold in a few hours
            </p>

            <form onSubmit={handleSearchSubmit} className="mt-6 max-w-lg mx-auto relative group">
              <input 
                type="text"
                placeholder="Type the store or brand name here"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-6 pr-12 py-3.5 bg-white text-zinc-800 rounded-[30px] text-xs font-bold font-sans shadow-md border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all cursor-pointer border-0 outline-none"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 3.2 SECTION: Gift Card Cashback Stores */}
      <section className="space-y-8 relative">
        <div className="relative border-b border-zinc-150/80 pb-5 flex flex-col items-center justify-center">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-center relative font-sans select-none">
            GIFT CARD CASHBACK STORES
            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#2874f0] rounded-full" />
          </h2>
          <button 
            type="button"
            onClick={() => handleBannerAction('')}
            className="absolute right-0 bottom-4 text-[11px] font-black text-[#ff116d] hover:text-[#e0085a] uppercase tracking-wider cursor-pointer font-sans"
          >
            VIEW ALL GIFT CARDS STORES
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Amazon Gift Card",
              badgeText: "Amazon Gift Card",
              cardsCount: "75 Gift Cards",
              query: "amazon",
              graphicName: "amazon"
            },
            {
              name: "Flipkart Gift Card",
              badgeText: "Flipkart Gift Card",
              cardsCount: "12 Gift Cards",
              query: "flipkart",
              graphicName: "flipkart"
            },
            {
              name: "Myntra Gift Card",
              badgeText: "Myntra Gift Card",
              cardsCount: "23 Gift Cards",
              query: "myntra",
              graphicName: "myntra"
            },
            {
              name: "Book My Show Gift Card",
              badgeText: "Book My Show Gift Card",
              cardsCount: "2 Gift Cards",
              query: "book",
              graphicName: "bookmyshow"
            }
          ].map((store) => (
            <div 
              key={store.name}
              onClick={() => handleBannerAction(store.query)}
              className="bg-white rounded-2xl border border-zinc-200/90 p-3 hover:border-zinc-350 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              {renderStoreCardGraphic(store.graphicName)}
              
              <div className="pt-3.5 pb-1 text-center font-sans space-y-1">
                <p className="text-[13px] font-bold text-slate-800 group-hover:text-[#2874f0] transition-colors leading-tight">
                  {store.badgeText}
                </p>
                <span className="text-[10.5px] font-bold text-slate-400 block">
                  {store.cardsCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3.3 SECTION: Online Shopping Cashback Stores */}
      <section className="space-y-8 relative">
        <div className="relative border-b border-zinc-150/80 pb-5 flex flex-col items-center justify-center">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-center relative font-sans select-none">
            ONLINE SHOPPING CASHBACK STORES
            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#2874f0] rounded-full" />
          </h2>
          <button 
            type="button"
            onClick={() => handleBannerAction('')}
            className="absolute right-0 bottom-4 text-[11px] font-black text-[#ff116d] hover:text-[#e0085a] uppercase tracking-wider cursor-pointer font-sans"
          >
            VIEW ALL
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              storeName: "Amazon.in",
              offersCount: "170 Offers",
              cashbackText: "Upto 4.74% Rewards",
              query: "amazon",
              logoRender: () => (
                <div className="flex flex-col items-center pt-2">
                  <span className="text-[16px] font-black text-slate-900 leading-none">amazon.in</span>
                  <svg className="w-14 h-2.5 text-[#FF9900]" viewBox="0 0 24 8" fill="none">
                    <path d="M2 1.5C5 5.5 19 5.5 22 1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              )
            },
            {
              storeName: "Croma",
              offersCount: "81 Offers",
              cashbackText: "Upto 4% Cashback",
              query: "croma",
              logoRender: () => (
                <div className="flex flex-col items-center">
                  <span className="text-[15px] font-black tracking-widest text-[#127d6d] font-sans">croma</span>
                  <span className="text-[6.5px] uppercase tracking-widest text-zinc-400 font-bold">A TATA Enterprise</span>
                </div>
              )
            },
            {
              storeName: "Flipkart",
              offersCount: "91 Offers",
              cashbackText: "Upto 6% Cashback",
              query: "flipkart",
              logoRender: () => (
                <div className="flex items-center gap-1">
                  <span className="text-[15px] font-black text-[#2874f0] italic tracking-tight">Flipkart</span>
                  <div className="w-3.5 h-3.5 bg-[#ffe500] rounded-xs flex items-center justify-center">
                    <span className="text-[7.5px] text-[#2874f0] font-black">★</span>
                  </div>
                </div>
              )
            },
            {
              storeName: "Myntra",
              offersCount: "112 Offers",
              cashbackText: "Upto 8% Cashback",
              query: "myntra",
              logoRender: () => (
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded bg-white flex items-center justify-center shadow-2xs border border-zinc-150">
                    <span className="text-xs font-black bg-clip-text text-transparent bg-gradient-to-tr from-[#E61C5D] via-[#FF5F1F] to-[#8F00FF]">M</span>
                  </div>
                  <span className="text-[12px] font-black text-slate-800">Myntra</span>
                </div>
              )
            },
            {
              storeName: "AJIO",
              offersCount: "61 Offers",
              cashbackText: "Upto 10% Cashback",
              query: "ajio",
              logoRender: () => (
                <span className="text-[15px] font-black tracking-wider uppercase font-mono text-zinc-950">AJIO</span>
              )
            }
          ].map((store) => (
            <div 
              key={store.storeName}
              onClick={() => handleBannerAction(store.query)}
              className="bg-white border-2 border-[#e6edf8] hover:border-[#2874f0] rounded-2xl hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group text-center"
            >
              <div className="p-4 flex flex-col items-center justify-center">
                {/* Clean Logo Box container to mimic top margin look */}
                <div className="w-full h-11 border border-[#f0f4fc] rounded-xl flex items-center justify-center bg-white p-2">
                  {store.logoRender()}
                </div>
                
                <span className="text-[12px] font-bold text-slate-500 mt-3 block font-sans">
                  {store.offersCount}
                </span>
              </div>

              {/* Bottom solid bar precisely colored */}
              <div className="border-t border-slate-100 bg-[#f5f8fd] px-3 py-2 text-center group-hover:bg-[#ebf2fc] transition-colors leading-none">
                <span className="text-[#2b74f0] font-black text-[11.5px] tracking-tight">
                  {store.cashbackText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Active Peer-to-Peer Discount Voucher list - preserving key marketplace features */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Peer-to-Peer Trades</h2>
            <p className="text-xs text-slate-500 mt-1 border-l-2 border-indigo-500 pl-2">Save on brand costs. Claim verified physical voucher codes securely.</p>
          </div>
          <button 
            onClick={() => { setActiveTab('marketplace'); setSearchQuery(''); }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group cursor-pointer"
          >
            <span>Explore Complete directory</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {activeCoupons.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-3xl border border-zinc-200/60 max-w-sm mx-auto">
            <Gift className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-zinc-800">No Listed Vouchers Present</h4>
            <p className="text-[11px] text-zinc-500 mt-0.5 max-w-xs mx-auto">Post your unused Swiggy, Amazon, or Myntra discount gift cards today.</p>
            <button 
              onClick={() => setActiveTab('upload')}
              className="mt-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs px-4 py-2 rounded-xl font-bold transition-all cursor-pointer"
            >
              Post a Discount Voucher
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {activeCoupons.map((coupon) => (
              <div 
                key={coupon.id} 
                className="bg-white rounded-2xl border border-zinc-200/70 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Brand and category banner */}
                <div className="bg-zinc-50/50 p-4 border-b border-zinc-200 flex justify-between items-center gap-2">
                  <div className="flex gap-2.5 items-center overflow-hidden">
                    {renderBrandLogo(coupon.brand)}
                    <div className="overflow-hidden">
                      <span className="font-extrabold text-zinc-800 text-xs tracking-tight block truncate max-w-[120px]">
                        {coupon.brand}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1 py-0.2 rounded mt-0.5">
                        {coupon.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg text-[10px] font-black border border-emerald-100/50 whitespace-nowrap">
                    {coupon.discountType === 'flat' ? `₹${coupon.discountValue} Off` : `${coupon.discountValue}%`}
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between gap-4 flex-1">
                  <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px] leading-relaxed">
                    {coupon.description || `Applicable discount code verified live.`}
                  </p>

                  <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-[10.5px] space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Original Value:</span>
                      <span className="line-through">₹{coupon.discountType === 'flat' ? coupon.discountValue : '1,500'}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-bold">
                      <span>Deal Buying Price:</span>
                      <span className="text-emerald-600">₹{coupon.price}</span>
                    </div>
                  </div>

                  {/* Buy Trigger */}
                  <div className="space-y-1.5 font-sans">
                    <button 
                      onClick={() => handleBuyClick(coupon)}
                      disabled={buyingId === coupon.id}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {buyingId === coupon.id ? (
                        <span>Processing hold...</span>
                      ) : (
                        <>
                          <span>Claim for ₹{coupon.price}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                    <span className="text-[9px] text-slate-400 block text-center">
                      Protected by our buyer protection guarantee
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Cashback Category Store Filter Hub */}
      <section className="space-y-6">
        <div className="text-left">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Browse Cashback Categories</h2>
          <p className="text-xs text-slate-500 border-l-2 border-[#ff116d] pl-2 mt-1">Select card genre to locate verified brand listings instantly.</p>
        </div>

         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesList.map((c) => (
            <div 
              key={c.name}
              onClick={() => {
                setSelectedCategory(c.name);
                setSearchQuery('');
                setActiveTab('marketplace');
              }}
              className={`bg-white border border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3.5 cursor-pointer transition-all duration-200 group shadow-xs ${c.borderHover}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-200 group-hover:scale-105 shadow-xs ${c.iconBg}`}>
                {c.icon}
              </div>
              <span className="text-xs font-bold text-slate-700 tracking-tight transition-colors group-hover:text-slate-900">{c.name}</span>
            </div>
          ))}
        </div>
      </section>



      {/* How It Works Modal Backdrop */}
      {isHowItWorksOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-zinc-200 max-w-lg w-full p-8 relative shadow-2xl space-y-6 text-left" id="step-modal">
            <button 
              onClick={() => setIsHowItWorksOpen(false)} 
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 font-extrabold text-sm p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
            >
              × Close
            </button>
            
            <div className="space-y-1">
              <span className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest font-sans">How VouchLoop Works</span>
              <h3 className="text-lg font-black tracking-tight text-slate-900">Secure Voucher Exchange</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We safely hold transaction funds so buying and redeeming has zero risk.
              </p>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-600">
              <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-zinc-200">
                <span className="text-xs font-black w-6 h-6 bg-indigo-600 text-white rounded flex items-center justify-center flex-shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-900">Secure Payment Hold</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Your order payment is held securely in our system. The coupon code is unlocked for you immediately.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-zinc-200">
                <span className="text-xs font-black w-6 h-6 bg-indigo-600 text-white rounded flex items-center justify-center flex-shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-900">Verify & Redeem Code</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Simply use the code at checkout on the brand's official store and ensure the balance is applied successfully.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0]">
                <span className="text-xs font-black w-6 h-6 bg-emerald-600 text-white rounded flex items-center justify-center flex-shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-900">Payout Released to Seller</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                    Once you confirm redemption, the payment is released directly to the seller's wallet.
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsHowItWorksOpen(false)}
              className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

