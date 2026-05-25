import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  AlertCircle, 
  Lock, 
  Unlock, 
  Copy,
  Eye,
  Calendar,
  X,
  CreditCard,
  ShoppingCart,
  ShieldCheck
} from 'lucide-react';
import { Coupon, User, PriceAlert } from '../types';

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

  // General fallback
  const displayChar = brandName.trim() ? brandName.trim().charAt(0).toUpperCase() : 'V';
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-black text-base select-none flex-shrink-0 shadow-xs">
      {displayChar}
    </div>
  );
};

const getBrandTheme = (brandName: string) => {
  const norm = brandName ? brandName.toLowerCase() : "";
  if (norm.includes("amazon")) return { border: "hover:border-amber-400", bg: "bg-amber-50/40", badgeBg: "bg-amber-100 text-amber-800" };
  if (norm.includes("flipkart")) return { border: "hover:border-blue-400", bg: "bg-blue-50/30", badgeBg: "bg-blue-100 text-blue-800" };
  if (norm.includes("ajio")) return { border: "hover:border-[#402026]", bg: "bg-rose-50/10", badgeBg: "bg-rose-100 text-rose-950" };
  if (norm.includes("swiggy")) return { border: "hover:border-orange-400", bg: "bg-orange-50/30", badgeBg: "bg-orange-100 text-orange-900" };
  if (norm.includes("zomato")) return { border: "hover:border-red-400", bg: "bg-red-50/30", badgeBg: "bg-red-100 text-red-850" };
  if (norm.includes("myntra")) return { border: "hover:border-pink-400", bg: "bg-pink-50/30", badgeBg: "bg-pink-100 text-pink-900" };
  if (norm.includes("yatra")) return { border: "hover:border-red-400", bg: "bg-red-50/30", badgeBg: "bg-rose-100 text-rose-800" };
  if (norm.includes("puma")) return { border: "hover:border-black", bg: "bg-zinc-50/65", badgeBg: "bg-zinc-200 text-zinc-900" };
  if (norm.includes("lakme")) return { border: "hover:border-amber-700", bg: "bg-amber-50/20", badgeBg: "bg-amber-100 text-amber-900" };
  return { border: "hover:border-indigo-400", bg: "bg-indigo-50/20", badgeBg: "bg-indigo-100 text-indigo-900" };
};

interface MarketplaceViewProps {
  coupons: Coupon[];
  sessionUser: User | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onBuyCoupon: (coupon: Coupon) => void;
  buyingId: string | null;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  priceAlerts: PriceAlert[];
  onCreateAlert: (brand: string, maxPrice: number) => void;
  onDeleteAlert: (id: string) => void;
}

export default function MarketplaceView({
  coupons,
  sessionUser,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onBuyCoupon,
  buyingId,
  showToast,
  priceAlerts = [],
  onCreateAlert,
  onDeleteAlert
}: MarketplaceViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [quickLookCoupon, setQuickLookCoupon] = useState<Coupon | null>(null);
  const [alertBrand, setAlertBrand] = useState('');
  const [alertPrice, setAlertPrice] = useState('');

  const categories = ['All', 'Shopping', 'Food', 'Travel', 'Entertainment', 'Subscription', 'Health'];

  // Filters calculation
  const normalizeStr = (s: string) => {
    return s ? s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
  };

  const filteredCoupons = coupons.filter(cpn => {
    const q = normalizeStr(searchQuery);
    const matchesSearch = q === "" || 
                          normalizeStr(cpn.brand).includes(q) || 
                          (cpn.terms && normalizeStr(cpn.terms).includes(q)) ||
                          (cpn.description && normalizeStr(cpn.description).includes(q)) ||
                          normalizeStr(cpn.category).includes(q);
    
    const matchesCategory = selectedCategory === 'All' || cpn.category === selectedCategory;
    
    // Regular users see only active listings unless it's their own listed coupon
    const isVisible = cpn.status === 'active' || (sessionUser && cpn.sellerId === sessionUser.id);
    
    return matchesSearch && matchesCategory && isVisible;
  });

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    showToast('Code copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 pb-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Exchange Directory</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Voucher Trading Feed</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse unused digital cards listed directly by vetted peer sellers, protected with escrow holds.
          </p>
        </div>

        {/* Live Filter Inputs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <input 
              type="text"
              placeholder="Filter by brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-60 bg-white text-slate-800 text-xs px-3.5 py-2.5 pl-9 rounded-xl border border-zinc-250 focus:outline-none focus:ring-2 focus:ring-indigo-100 font-medium"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-100">
        <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex-shrink-0 ${
              selectedCategory === cat 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'bg-zinc-50 border border-zinc-200/60 text-slate-600 hover:bg-zinc-100/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 2-Column Responsive Layout: Left Sidebar for Price Alerts, Right for Voucher Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left column: Price Alerts panel */}
        <div className="lg:col-span-1 space-y-6 animate-in fade-in duration-250">
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs space-y-5 text-left font-sans">
            <div className="flex items-center gap-2">
              <span className="text-base">🔔</span>
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">Price Alert Watchers</h3>
            </div>
            
            <p className="text-[10.5px] text-slate-500 leading-normal">
              Follow your favorite brands. Enter your target budget hold threshold to set live background trackers.
            </p>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!sessionUser) {
                  showToast("Please sign in to configure active brand watchers.", "info");
                  return;
                }
                onCreateAlert(alertBrand, Number(alertPrice));
                setAlertBrand('');
                setAlertPrice('');
              }} 
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Brand handle</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Amazon, Swiggy"
                  value={alertBrand}
                  onChange={(e) => setAlertBrand(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Target price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2 text-xs font-bold text-slate-400">₹</span>
                  <input 
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 500"
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 text-slate-800 text-xs pl-7 pr-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500 font-semibold"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-zinc-950 hover:bg-zinc-805 text-white font-black text-[10px] uppercase py-2.5 rounded-xl transition-all cursor-pointer"
              >
                + Create Price Watch
              </button>
            </form>

            {/* Quick selectors */}
            <div className="space-y-1 border-t border-zinc-100 pt-3">
              <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Quick Picks</span>
              <div className="flex flex-wrap gap-1">
                {['Amazon', 'Flipkart', 'Swiggy', 'Zomato', 'Myntra'].map(brand => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => setAlertBrand(brand)}
                    className="bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-slate-600 text-[9px] px-2 py-0.5 rounded font-bold transition-all cursor-pointer"
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Active alert watchers */}
            <div className="border-t border-zinc-100 pt-3 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">My Followed Brands ({sessionUser ? priceAlerts.filter(a => a.userId === sessionUser.id).length : 0})</span>
              
              {!sessionUser ? (
                <p className="text-[10px] text-zinc-400 font-semibold italic">Sign in to list followed trackers.</p>
              ) : priceAlerts.filter(a => a.userId === sessionUser.id).length === 0 ? (
                <p className="text-[10px] text-zinc-400 font-semibold italic">No active trackers. Activate a brand hold above.</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {priceAlerts.filter(a => a.userId === sessionUser.id).map(alert => (
                    <div key={alert.id} className="flex items-center justify-between p-2 bg-indigo-50/50 border border-indigo-100/60 rounded-xl">
                      <div className="flex flex-col text-left">
                        <span className="font-extrabold text-slate-800 text-[11px] truncate max-w-[100px]">{alert.brand}</span>
                        <span className="font-sans text-[9px] text-indigo-700 font-bold">Limit: ₹{alert.maxPrice}</span>
                      </div>
                      <button 
                        onClick={() => onDeleteAlert(alert.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 font-bold rounded hover:bg-rose-50 cursor-pointer text-[10px]"
                        title="Delete watcher rule"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Main coupons feed grid */}
        <div className="lg:col-span-3">
          {filteredCoupons.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200/60 max-w-sm mx-auto">
              <AlertCircle className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-zinc-700">No Matching Vouchers Available</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                We couldn't locate any listed vouchers matching your criteria. Try searching other keywords.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs px-4 py-2 rounded-xl font-bold transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => {
            const isOwner = sessionUser && coupon.sellerId === sessionUser.id;
            const isFeatured = coupon.isFeatured || coupon.price >= 200;
            const theme = getBrandTheme(coupon.brand);

            return (
              <div 
                key={coupon.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden relative"
              >
                {/* Visual Top Decorative Highlight Accent Bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${
                  coupon.brand.toLowerCase().includes('amazon') ? 'from-amber-400 to-amber-600' :
                  coupon.brand.toLowerCase().includes('flipkart') ? 'from-[#2874f0] to-[#1259c3]' :
                  coupon.brand.toLowerCase().includes('swiggy') ? 'from-orange-400 to-orange-500' :
                  coupon.brand.toLowerCase().includes('zomato') ? 'from-red-500 to-red-600' :
                  coupon.brand.toLowerCase().includes('ajio') ? 'from-zinc-800 to-rose-950' :
                  coupon.brand.toLowerCase().includes('myntra') ? 'from-pink-500 via-purple-500 to-amber-500' :
                  'from-[#ff116d] to-indigo-600'
                }`} />

                {/* Coupon Header */}
                <div className="p-5 space-y-3.5">
                  <div className="flex gap-2.5 items-start justify-between">
                    <div className="flex gap-3 items-center min-w-0">
                      {renderBrandLogo(coupon.brand)}
                      <div className="min-w-0">
                        <h3 className="font-black text-slate-900 text-[13px] tracking-tight leading-snug truncate">
                          {coupon.brand}
                        </h3>
                        <span className={`inline-block mt-1 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide border border-current/10 ${theme.badgeBg}`}>
                          {coupon.category}
                        </span>
                      </div>
                    </div>

                    <div className="bg-emerald-500 text-white font-black text-[11px] px-2.5 py-1.5 rounded-xl border border-emerald-400/20 flex-shrink-0 shadow-xs uppercase tracking-tight font-sans">
                      {coupon.discountType === 'flat' ? `₹${coupon.discountValue} Off` : `${coupon.discountValue}%`}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-semibold leading-relaxed min-h-[36px] line-clamp-2">
                    {coupon.description || `Redeemable discount code applicable on standard purchases.`}
                  </p>
                </div>

                {/* Dashed Perforated ticket divider with semicircles */}
                <div className="relative my-0.5 flex items-center justify-between pointer-events-none select-none">
                  <div className="-left-2.5 w-5 h-5 rounded-full bg-zinc-50 border-r border-zinc-200/90 absolute z-10" />
                  <div className="w-full border-t border-dashed border-zinc-200" />
                  <div className="-right-2.5 w-5 h-5 rounded-full bg-zinc-50 border-l border-zinc-200/90 absolute z-10" />
                </div>

                {/* Middle details block */}
                <div className="px-5 pt-3 pb-2 space-y-2 bg-[#fcfdfe]/60 text-xs text-slate-600">
                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="font-bold text-slate-400">Guaranteed Expiry:</span>
                    <span className="font-extrabold text-slate-700 flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {coupon.expiryDate}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="font-bold text-slate-400">Escrow Verification:</span>
                    <span className="font-extrabold text-slate-700 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${coupon.ocrExtracted ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                      {coupon.ocrExtracted ? 'OCR Certified ✓' : 'Manual Inspected'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="font-bold text-slate-400">Vouched By Seller:</span>
                    <div className="flex items-center gap-1 text-slate-700 font-extrabold">
                      <span className="truncate max-w-[90px]">{coupon.sellerName}</span>
                      {isOwner && (
                        <span className="bg-indigo-100 text-indigo-700 text-[8px] font-black px-1.5 py-0.2 rounded">YOU</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dashed Perforated bottom ticket divider with semicircles */}
                <div className="relative my-0.5 flex items-center justify-between pointer-events-none select-none">
                  <div className="-left-2.5 w-5 h-5 rounded-full bg-zinc-50 border-r border-zinc-200/90 absolute z-10" />
                  <div className="w-full border-t border-dashed border-zinc-200" />
                  <div className="-right-2.5 w-5 h-5 rounded-full bg-zinc-50 border-l border-zinc-200/90 absolute z-10" />
                </div>

                {/* Coupon Footer Actions */}
                <div className="p-5 space-y-3 bg-[#fbfcfd]/20">
                  
                  {/* Cost Summary block */}
                  <div className="flex justify-between items-center bg-zinc-50 border border-zinc-200 p-3 rounded-2xl text-xs">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-slate-400">Listed Price</span>
                      <span className="text-[14px] font-black text-slate-900">₹{coupon.price}.00</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold text-slate-400">Direct Savings</span>
                      <span className="text-xs font-black text-emerald-600 block">
                        ~ ₹{(coupon.discountType === 'flat' ? coupon.discountValue : 350) - coupon.price} Save
                      </span>
                    </div>
                  </div>

                  {/* Code Reveal box if purchased/owned */}
                  {coupon.status === 'sold' ? (
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[10px] font-black text-indigo-700 uppercase">
                        <span className="flex items-center gap-1.5">
                          <Unlock className="w-3.5 h-3.5 text-indigo-500" /> Voucher Purchased
                        </span>
                        <span>Copy Pin</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white px-2.5 py-2 rounded-xl border border-indigo-200 justify-between">
                        <span className="font-mono font-black text-xs text-indigo-900 break-all select-all">
                          {coupon.code}
                        </span>
                        <button 
                          onClick={() => handleCopyCode(coupon.id, coupon.code)}
                          className="text-indigo-600 hover:text-indigo-805 p-1 flex-shrink-0 cursor-pointer"
                        >
                          {copiedId === coupon.id ? (
                            <span className="text-[10px] text-emerald-600 font-bold">Copied</span>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ) : isOwner ? (
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-1.5 text-center">
                        <span className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider block">Your Listed Asset</span>
                        <span className="font-mono text-slate-600 font-extrabold text-[11px] bg-slate-100 rounded-lg px-2 py-1 truncate">{coupon.code}</span>
                      </div>
                      <button 
                        disabled
                        className="w-full bg-zinc-200 text-zinc-500 font-black text-xs py-3 rounded-2xl cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Self-Owned Asset</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button 
                        onClick={() => onBuyCoupon(coupon)}
                        disabled={buyingId === coupon.id}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-xs py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {buyingId === coupon.id ? (
                          <span>Executing Secure Trade hold...</span>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Claim Voucher Card</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => setQuickLookCoupon(coupon)}
                        className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200/50 text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Detailed View</span>
                      </button>
                    </div>
                  )}

                  {/* Expand Terms of Use */}
                  {coupon.terms && (
                    <div className="border-t border-zinc-100 pt-3 text-[10px] text-slate-400">
                      <span className="font-bold text-slate-500">Terms of Use:</span>
                      <p className="mt-0.5 line-clamp-1 italic text-slate-400">
                        {coupon.terms}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Look Detailed Modal */}
      {quickLookCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-zinc-200 relative flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="p-6 bg-zinc-900 text-zinc-100 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded text-zinc-300">
                  {quickLookCoupon.category}
                </span>
                <h3 className="text-lg font-bold tracking-tight text-white mt-2">
                  {quickLookCoupon.brand} Details
                </h3>
              </div>
              <button 
                onClick={() => setQuickLookCoupon(null)}
                className="w-7 h-7 rounded-lg hover:bg-zinc-800 text-zinc-400 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[50vh] scrollbar-none text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-zinc-200 text-center space-y-1">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block">Redemption Value</span>
                  <p className="text-base font-bold text-indigo-600">
                    {quickLookCoupon.discountType === 'flat' ? `₹${quickLookCoupon.discountValue} Off` : `${quickLookCoupon.discountValue}%`}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-zinc-200 text-center space-y-1">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block">Direct Buy Price</span>
                  <p className="text-base font-bold text-slate-900">₹{quickLookCoupon.price}.00</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</h4>
                <p className="text-slate-600 leading-relaxed font-normal">
                  {quickLookCoupon.description || "Applicable on verified purchases with instant delivery guarantee."}
                </p>
              </div>

              {quickLookCoupon.terms && (
                <div className="space-y-1.5 p-3.5 bg-indigo-50/50 border border-indigo-100/50 rounded-xl">
                  <span className="font-bold text-indigo-700 block uppercase text-[8px] tracking-wider">Exchange Guidelines</span>
                  <p className="text-[11px] text-slate-500 italic leading-relaxed">
                    {quickLookCoupon.terms}
                  </p>
                </div>
              )}

              {/* Security Ledger Diagnostics */}
              <div className="space-y-2 border-t border-zinc-100 pt-4 text-xs">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Validator Diagnostics</h4>
                
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex justify-between items-center bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                    <span className="text-slate-400">Authenticity</span>
                    <span className="font-bold text-emerald-600">
                      {quickLookCoupon.ocrExtracted ? 'OCR Settle ✓' : 'Manual Verified'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                    <span className="text-slate-400">Status Check</span>
                    <span className="font-bold text-indigo-600 uppercase">
                      {quickLookCoupon.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-slate-50 border-t border-zinc-200 flex flex-col gap-3">
              <button
                onClick={() => {
                  onBuyCoupon(quickLookCoupon);
                  setQuickLookCoupon(null);
                }}
                disabled={buyingId === quickLookCoupon.id}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Claim Voucher Mode</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
