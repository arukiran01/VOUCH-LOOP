import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Gift, 
  ShieldCheck, 
  Star, 
  Sparkles,
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
      <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-amber-500/30 flex flex-col items-center justify-center font-black select-none flex-shrink-0 relative overflow-hidden">
        <span className="text-[10px] text-white tracking-tighter leading-none">amazon</span>
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
      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex flex-col items-center justify-center font-black text-yellow-500 select-none flex-shrink-0 animate-fade-in">
        <span className="text-[8px] tracking-tighter uppercase leading-none text-yellow-405">FAST</span>
        <span className="text-[8px] tracking-widest uppercase leading-none text-white">RCK</span>
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
        if (showToast) showToast(`Simulated Session: Welcome back, ${matchUser.name}!`, 'success');
        if (onLoginSuccess) {
          onLoginSuccess(matchUser);
        }
      } else {
        setLoginError('No matching simulated profile. Try creating an account or sign in with rohan@example.in.');
        if (showToast) showToast('Credentials mismatch or offline profile not found.', 'error');
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
        // Safe credentials storage to maintain auto-login correctly
        const userToSave = { ...data.user, savedPassword: passwordRegister };
        localStorage.setItem('vouchloop_saved_session', JSON.stringify(userToSave));

        if (showToast) {
          showToast(data.message || 'Account created successfully! Received ₹5,000 starting wallet credit.', 'success');
        }
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
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
          showToast(`Welcome back, ${existingUser.name}! (Simulated auto-login)`, 'success');
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
          showToast('Account registered successfully! Received ₹5,000 starting wallet credit inside simulation.', 'success');
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

  const handleBannerAction = (query: string) => {
    setSelectedCategory('All');
    setSearchQuery(query);
    setActiveTab('marketplace');
  };

  // Gift Card Cashback Offers (precise mockup references with dotted underline text labels)
  const giftCardOffers = [
    {
      brand: "Swiggy Food Voucher",
      badgeText: "Swiggy",
      cashback: "15% Cashback",
      bgClass: "bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600",
      accentEmoji: "🍟",
      mockValue: "₹1,000 Card",
      query: "swiggy"
    },
    {
      brand: "Zomato Food Complimentary Gold",
      badgeText: "Zomato",
      cashback: "18% Cashback",
      bgClass: "bg-gradient-to-br from-red-600 via-rose-500 to-red-500",
      accentEmoji: "🍕",
      mockValue: "₹500 Card",
      query: "zomato"
    },
    {
      brand: "AJIO Premium Shopping",
      badgeText: "AJIO",
      cashback: "25% Cashback",
      bgClass: "bg-gradient-to-br from-[#1b1c1e] via-[#402026] to-[#110507]",
      accentEmoji: "👗",
      mockValue: "₹2,500 Card",
      query: "ajio"
    },
    {
      brand: "Myntra Fashion Discount",
      badgeText: "Myntra",
      cashback: "20% Cashback",
      bgClass: "bg-gradient-to-tr from-rose-500 via-purple-500 to-amber-400",
      accentEmoji: "👜",
      mockValue: "₹2,000 Card",
      query: "myntra"
    },
    {
      brand: "Amazon India Pay",
      badgeText: "Amazon",
      cashback: "4.74% Cashback",
      bgClass: "bg-gradient-to-br from-zinc-900 to-black",
      accentEmoji: "🪙",
      mockValue: "₹5,000 Card",
      query: "amazon"
    },
    {
      brand: "Flipkart Supercoins Discount",
      badgeText: "Flipkart",
      cashback: "10% Cashback",
      bgClass: "bg-gradient-to-br from-[#2874f0] via-[#1a5ebc] to-[#043d8c]",
      accentEmoji: "⚡",
      mockValue: "₹1,500 Card",
      query: "flipkart"
    },
    {
      brand: "Yatra Flight Gift Card",
      badgeText: "Yatra",
      cashback: "90% Cashback",
      bgClass: "bg-gradient-to-br from-rose-600 to-red-500",
      accentEmoji: "✈️",
      mockValue: "₹5,000 Card",
      query: "yatra"
    },
    {
      brand: "Puma Athletic Sports",
      badgeText: "Puma",
      cashback: "35% Cashback",
      bgClass: "bg-gradient-to-br from-zinc-800 to-slate-900",
      accentEmoji: "🐆",
      isDarkText: false,
      mockValue: "₹3,000 Card",
      query: "puma"
    }
  ];

  // Online Shopping Cashback Offers (mockup bottom references)
  const onlineShoppingOffers = [
    {
      logo: "amazon.in",
      brandTitle: "Amazon",
      offText: "Up to 80% Off across categories!",
      cashbackText: "Upto 4.74% Rewards",
      logoBg: "bg-white",
      query: "amazon"
    },
    {
      logo: "Myntra",
      brandTitle: "Myntra",
      offText: "Get 50 - 90% OFF Across Categories",
      cashbackText: "Upto 8% Cashback",
      logoBg: "bg-gradient-to-tr from-pink-50 to-orange-50",
      query: "myntra"
    },
    {
      logo: "AJIO",
      brandTitle: "AJIO",
      offText: "Red hot Sale is Live : Get 50 - 90% OFF + 12% Discount on HSBC",
      cashbackText: "Upto 12% Cashback",
      logoBg: "bg-zinc-150",
      query: "ajio"
    },
    {
      logo: "SBI Card • SPRINT",
      brandTitle: "Flipkart SBI",
      offText: "SBI Flipkart Credit Card - Rs1700 Cashback Voucher on Signup",
      cashbackText: "Upto Rs 1600 Cashback",
      logoBg: "bg-sky-50",
      query: "flipkart"
    }
  ];

  const categoriesList = [
    { name: 'Shopping', icon: '🛍️', bg: 'bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700' },
    { name: 'Food', icon: '🍔', bg: 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700' },
    { name: 'Travel', icon: '✈️', bg: 'bg-cyan-50 hover:bg-cyan-100/80 text-cyan-700' },
    { name: 'Entertainment', icon: '🎬', bg: 'bg-rose-50 hover:bg-rose-100/80 text-rose-700' },
    { name: 'Subscription', icon: '🔑', bg: 'bg-amber-50 hover:bg-amber-100/80 text-amber-700' },
    { name: 'Health', icon: '❤️', bg: 'bg-purple-50 hover:bg-purple-100/80 text-purple-700' }
  ];

  // Active public peer coupons listed on home feed
  const activeCoupons = coupons.filter(c => c.status === 'active').slice(0, 8);

  return (
    <div className="space-y-12 py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans">
      
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
                      <Sparkles className="w-3.5 h-3.5" />
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

      {/* 2. Zingoy-themed "Gift Card Cashback Offers" (with dotted underlines screenshot replicas) */}
      <section className="space-y-6">
        
        {/* Section Header with exact blue line marker style */}
        <div className="relative border-b border-zinc-150/80 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-left">
          <div className="relative">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Gift Card Cashback Offers</h2>
            <div className="w-16 h-1 bg-indigo-600 mt-1.5 rounded-full" />
          </div>
          <button 
            onClick={() => handleBannerAction('')}
            className="text-[11px] font-black text-[#ff116d] hover:text-[#e0085a] uppercase tracking-wider cursor-pointer font-sans"
          >
            VIEW ALL GIFT CARDS
          </button>
        </div>

        {/* Responsive grid showing premium high fidelity custom branded cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {giftCardOffers.map((offer) => {
            return (
              <div 
                key={offer.brand}
                onClick={() => handleBannerAction(offer.query)}
                className="bg-white rounded-2xl border border-zinc-200/70 p-4 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-1 relative group"
              >
                {/* Simulated plastic gift card artwork wrapper */}
                <div className={`h-36 ${offer.bgClass} rounded-2xl p-4 flex flex-col justify-between text-white relative overflow-hidden shadow-sm`}>
                  {/* Subtle card grid effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                  
                  {/* High quality header */}
                  <div className="flex justify-between items-start z-10">
                    <span className="font-heading text-[9px] uppercase tracking-widest font-extrabold opacity-75">VouchLoop Gold</span>
                    <span className="text-xl">{offer.accentEmoji}</span>
                  </div>

                  {/* High quality logo combined inside plastic card to look complete */}
                  <div className="z-10 flex items-center gap-2.5 text-left bg-black/10 backdrop-blur-xs p-1.5 rounded-xl border border-white/5">
                    {renderBrandLogo(offer.brand)}
                    <div>
                      <p className={`text-xs font-black tracking-tight ${offer.isDarkText ? 'text-slate-900' : 'text-white'}`}>
                        {offer.badgeText}
                      </p>
                      <p className={`text-[8px] font-sans tracking-tighter opacity-70 ${offer.isDarkText ? 'text-slate-705' : 'text-zinc-300'}`}>
                        Online Gift Card
                      </p>
                    </div>
                  </div>

                  {/* Card bottom details */}
                  <div className="flex justify-between items-center border-t border-white/10 pt-2 z-10 select-none">
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${offer.isDarkText ? 'text-slate-600' : 'text-slate-200'}`}>
                      {offer.mockValue}
                    </span>
                    <span className={`text-[8px] font-sans ${offer.isDarkText ? 'text-slate-500' : 'text-zinc-300'}`}>BUYER PROTECTION</span>
                  </div>
                </div>

                {/* Info and beautiful Zingoy style Pink Dotted Underline Cashback Text */}
                <div className="mt-4 text-center space-y-3">
                  <p className="font-extrabold text-slate-800 text-xs tracking-tight limit-lines-1">
                    {offer.brand}
                  </p>
                  
                  {/* The distinct Pink Cashback Banner block from prompt screenshot */}
                  <div className="border-t border-b border-dashed border-rose-200 py-1.5 bg-rose-50/50 rounded-lg">
                    <span className="text-sm font-black text-[#ff116d] block tracking-tight">
                      {offer.cashback}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 block font-medium group-hover:text-indigo-600 transition-colors">
                    Click to browse active peer trades
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* 3. Zingoy-themed "Online Shopping Cashback Offers" */}
      <section className="space-y-6">
        
        {/* Section Header with blue line marker */}
        <div className="relative border-b border-zinc-150/80 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-left">
          <div className="relative">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Online Shopping Cashback Offers</h2>
            <div className="w-16 h-1 bg-indigo-600 mt-1.5 rounded-full" />
          </div>
          <button 
            onClick={() => handleBannerAction('')}
            className="text-[11px] font-black text-[#ff116d] hover:text-[#e0085a] uppercase tracking-wider cursor-pointer font-sans"
          >
            VIEW ALL DEALS
          </button>
        </div>

        {/* Precision row styled precisely like the lower part of prompt screenshot representing online merchants */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
          {onlineShoppingOffers.map((shop) => (
            <div 
              key={shop.logo}
              onClick={() => handleBannerAction(shop.query)}
              className="bg-white border-2 border-zinc-150 rounded-2xl hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between overflow-hidden group shadow-xs"
            >
              
              {/* Merchant logo preview mockup and description */}
              <div className="p-5 space-y-4">
                <div className="flex gap-2.5 items-center">
                  <div className={`w-9 h-9 rounded-xl border border-zinc-200 flex items-center justify-center font-black text-xs ${shop.logoBg} shadow-xs text-zinc-800 tracking-tighter`}>
                    {shop.logo.substring(0, 3).toUpperCase()}
                  </div>
                  <span className="font-extrabold text-slate-900 text-xs font-mono uppercase">
                    {shop.logo}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-semibold leading-relaxed line-clamp-2 min-h-[36px]">
                  {shop.offText}
                </p>
              </div>

              {/* Bottom blue footer bar containing cash reward index precisely underlined with blue */}
              <div className="border-t border-zinc-100 bg-[#fbfcfd] px-5 py-3 text-center border-b-2 border-indigo-600 group-hover:bg-indigo-50/40">
                <span className="text-indigo-700 font-black text-xs tracking-tight select-none">
                  {shop.cashbackText}
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
            <Gift className="w-10 h-10 text-zinc-350 mx-auto mb-2" />
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
                <div className="bg-zinc-50/50 p-4 border-b border-zinc-150 flex justify-between items-center gap-2">
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

                  <div className="bg-zinc-50 border border-zinc-150 p-2.5 rounded-xl text-[10.5px] space-y-1">
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
          <p className="text-xs text-slate-550 border-l-2 border-[#ff116d] pl-2 mt-1">Select card genre to locate verified brand listings instantly.</p>
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
              className={`p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer border border-zinc-150 transition-all hover:-translate-y-1 hover:shadow-md ${c.bg}`}
            >
              <span className="text-3xl select-none">{c.icon}</span>
              <span className="text-xs font-extrabold tracking-wide">{c.name}</span>
            </div>
          ))}
        </div>
      </section>



      {/* How It Works Modal Backdrop */}
      {isHowItWorksOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-zinc-150 max-w-lg w-full p-8 relative shadow-2xl space-y-6 text-left" id="step-modal">
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
              <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-zinc-150">
                <span className="text-xs font-black w-6 h-6 bg-indigo-600 text-white rounded flex items-center justify-center flex-shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-900">Secure Payment Hold</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Your order payment is held securely in our system. The coupon code is unlocked for you immediately.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-zinc-150">
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

