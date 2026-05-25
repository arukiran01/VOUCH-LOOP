import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Wallet, 
  User as UserIcon, 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck, 
  RefreshCw, 
  X,
  Edit3
} from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  sessionUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory?: (category: string) => void;
  cartCount: number;
  onRefresh: () => void;
  refreshing: boolean;
  toggleKyc: () => void;
  toggleRole: () => void;
  onLogout: () => void;
}

export default function Header({
  sessionUser,
  activeTab,
  setActiveTab,
  setAuthMode,
  searchQuery,
  setSearchQuery,
  setSelectedCategory,
  cartCount,
  onRefresh,
  refreshing,
  toggleKyc,
  toggleRole,
  onLogout
}: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  // Profile Edit fields
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editKycStatus, setEditKycStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const openEditProfile = () => {
    if (sessionUser) {
      setEditName(sessionUser.name);
      setEditEmail(sessionUser.email);
      setEditKycStatus(sessionUser.kycStatus || 'unverified');
    }
    setFeedback(null);
    setIsEditingProfile(true);
    setProfileOpen(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) {
      setFeedback({ type: 'error', msg: 'Name and email fields cannot be empty.' });
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      const resp = await fetch('/api/auth/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          avatar: editAvatar,
          kycStatus: editKycStatus
        })
      });
      const data = await resp.json();
      if (data.success) {
        // Sync modified data to local session so the correct name persists and auto-logs in
        const stored = localStorage.getItem('vouchloop_saved_session');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            localStorage.setItem('vouchloop_saved_session', JSON.stringify({
              ...parsed,
              ...data.user
            }));
          } catch(e) {}
        } else {
          localStorage.setItem('vouchloop_saved_session', JSON.stringify(data.user));
        }

        setFeedback({ type: 'success', msg: 'VouchLoop profile & KYC status updated!' });
        setTimeout(() => {
          setIsEditingProfile(false);
          onRefresh(); // Refresh parent session user data
        }, 1200);
      } else {
        setFeedback({ type: 'error', msg: data.error || 'Failed to save changes.' });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', msg: 'Ledger update network mismatch error.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoClick = () => {
    setActiveTab('landing');
    setSearchQuery('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (activeTab !== 'marketplace') {
      setActiveTab('marketplace');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200/60 text-slate-800 shadow-xs font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-5">
          
          {/* Logo */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 cursor-pointer flex-shrink-0 relative group"
            id="brand-logo"
          >
            <div className="p-2 bg-zinc-950 text-white rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-black tracking-tight text-slate-900">
              VouchLoop
            </span>
            
            {/* Tooltip */}
            <div className="absolute left-0 top-full mt-2 hidden group-hover:flex flex-col bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl text-[10.5px] text-zinc-100 font-sans font-bold shadow-xl z-[100] whitespace-nowrap gap-0.5 pointer-events-none animate-in fade-in slide-in-from-top-1 duration-150">
              <span className="text-[11.5px] text-indigo-450 text-indigo-400">VouchLoop Inc.</span>
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                P2P Protocol: <span className="text-emerald-400">Operational</span>
              </span>
            </div>
          </div>

          {/* Search bar inside header desktop */}
          <div className="hidden md:flex flex-1 max-w-sm relative">
            <input 
              type="text"
              placeholder="Search store gift cards..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-zinc-50 border border-zinc-200 text-slate-800 text-xs px-3.5 py-2 pl-9 rounded-xl focus:outline-none placeholder-slate-400 font-medium"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
          </div>

          {/* Navigation links - Pure directly styled tabs (simple and clean) */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-slate-500">
            <button 
              onClick={() => { setActiveTab('landing'); setSearchQuery(''); }}
              className={`hover:text-slate-900 transition-colors cursor-pointer ${activeTab === 'landing' ? 'text-indigo-600 font-extrabold' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setActiveTab('marketplace'); setSearchQuery(''); }}
              className={`hover:text-slate-900 transition-colors cursor-pointer ${activeTab === 'marketplace' ? 'text-indigo-600 font-extrabold' : ''}`}
            >
              Buy Vouchers
            </button>
            <button 
              onClick={() => setActiveTab('upload')}
              className={`hover:text-slate-900 transition-colors cursor-pointer ${activeTab === 'upload' ? 'text-indigo-600 font-extrabold' : ''}`}
            >
              Sell Vouchers
            </button>
            <button 
              onClick={() => setActiveTab('wallet')}
              className={`hover:text-slate-900 transition-colors cursor-pointer ${activeTab === 'wallet' ? 'text-indigo-600 font-extrabold' : ''}`}
            >
              Wallet Ledger
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`hover:text-slate-900 transition-colors cursor-pointer ${activeTab === 'chat' ? 'text-indigo-600 font-extrabold' : ''}`}
            >
              FAQ Support
            </button>
            {sessionUser?.role === 'admin' && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`hover:text-rose-600 text-rose-500 transition-colors cursor-pointer ${activeTab === 'admin' ? 'font-extrabold text-rose-700' : ''}`}
              >
                Admin Console
              </button>
            )}
          </nav>

          {/* Action Hub and Profile */}
          <div className="flex items-center gap-3">
            
            {/* User Profile or sign in CTA */}
            {!sessionUser ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Signup Button */}
                <button
                  onClick={() => { setAuthMode('signup'); setActiveTab('auth'); }}
                  className="px-3 py-1.5 border border-zinc-200/80 hover:bg-zinc-50 text-slate-700 font-extrabold text-[12px] tracking-tight rounded-xl cursor-pointer transition-colors"
                >
                  Signup
                </button>
                {/* Login Button */}
                <button
                  onClick={() => { setAuthMode('login'); setActiveTab('auth'); }}
                  className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white font-extrabold text-[12px] tracking-tight rounded-xl cursor-pointer transition-colors"
                >
                  Login
                </button>
                
                {/* Cart Badge Button */}
                <button
                  onClick={() => setActiveTab('landing')}
                  className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer ml-1"
                  title="Purchased Vouchers"
                >
                  <ShoppingCart className="w-[18px] h-[18px]" />
                  <span className="absolute top-0.5 right-0.5 -mt-1 -mr-1 bg-[#ff116d] text-white font-sans text-[8.5px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">
                    {cartCount}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Cart Badge Button */}
                <button
                  onClick={() => setActiveTab('wallet')}
                  className="relative p-2 text-slate-600 hover:text-indigo-650 transition-colors cursor-pointer mr-0.5"
                  title="Your purchased vouchers history"
                >
                  <ShoppingCart className="w-[18px] h-[18px]" />
                  <span className="absolute top-0.5 right-0.5 -mt-1 -mr-1 bg-[#ff116d] text-white font-sans text-[8.5px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">
                    {cartCount}
                  </span>
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1 bg-zinc-50 hover:bg-zinc-150/60 rounded-xl border border-zinc-200/60 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-[10px] select-none uppercase shadow-xs">
                      {sessionUser.name ? sessionUser.name.charAt(0) : 'U'}
                    </div>
                    <div className="hidden sm:flex flex-col text-left text-[10px] leading-tight pr-1">
                      <span className="font-bold text-slate-800 truncate max-w-[80px]">{sessionUser.name}</span>
                      <span className="font-medium text-slate-400 capitalize">{sessionUser.role}</span>
                    </div>
                    <ChevronDown className="w-3 text-slate-400 pr-0.5" />
                  </button>
                  {/* profileOpen content continues ... */}

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-zinc-200/80 rounded-2xl shadow-xl z-50 p-4 text-xs text-left animate-in fade-in duration-100 select-none">
                    <div className="pb-3.5 border-b border-zinc-100 space-y-1">
                      <p className="font-extrabold text-slate-900 text-sm tracking-tight leading-none mb-1">{sessionUser.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium leading-none truncate mb-3">{sessionUser.email}</p>
                      
                      <div className="pt-1.5 select-none flex items-center justify-between">
                        <span className="text-[9.5px] uppercase font-extrabold text-slate-400 tracking-wider">KYC VERIFY</span>
                        {sessionUser.kycStatus === 'verified' ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/80 shadow-xs">Verified ✓</span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200/80 shadow-xs">Unverified</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 space-y-1">
                      <button 
                        onClick={openEditProfile}
                        className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-slate-800 hover:text-indigo-600 font-bold text-[11.5px] rounded-xl cursor-pointer flex items-center gap-2 transition-all"
                      >
                        <Edit3 className="w-4 h-4 text-slate-500" /> 
                        <span>Edit Profile Settings</span>
                      </button>

                      <button 
                        onClick={() => { toggleKyc(); setProfileOpen(false); }} 
                        className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-slate-800 font-bold text-[11.5px] rounded-xl cursor-pointer flex items-center justify-between transition-all"
                      >
                        <span>Simulate KYC Verify</span>
                        <span className="text-[9.5px] bg-[#f1f5f9] text-[#475569] px-2 py-0.5 rounded-lg font-black tracking-tight border border-slate-200">Dev</span>
                      </button>

                      {sessionUser?.email?.toLowerCase() === 'arukiranreddy@gmail.com' && (
                        <button 
                          onClick={() => { toggleRole(); setProfileOpen(false); }} 
                          className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-slate-800 font-bold text-[11.5px] rounded-xl cursor-pointer flex items-center justify-between transition-all"
                        >
                          <span>Switch Admin/User Role</span>
                          <span className="text-[9.5px] bg-[#f1f5f9] text-[#475569] px-2 py-0.5 rounded-lg font-black tracking-tight border border-slate-200">Dev</span>
                        </button>
                      )}

                      {sessionUser.role === 'admin' && (
                        <button 
                          onClick={() => { setActiveTab('admin'); setProfileOpen(false); }} 
                          className="w-full text-left px-3 py-2.5 hover:bg-rose-50 text-rose-600 font-extrabold text-[11.5px] rounded-xl cursor-pointer flex items-center gap-2 transition-all"
                        >
                          <ShieldCheck className="w-4 h-4 text-rose-500" /> 
                          <span>Open Admin Console</span>
                        </button>
                      )}

                      <button 
                        onClick={() => { onLogout(); setProfileOpen(false); }} 
                        className="w-full text-left px-3 py-2.5 hover:bg-rose-55 hover:bg-rose-50 text-rose-600 font-extrabold text-[11.5px] rounded-xl cursor-pointer flex items-center justify-between border-t border-slate-100/80 mt-2.5 pt-2 transition-all"
                        id="logout-btn"
                      >
                        <span>Sign Out Token</span>
                        <span className="text-[9.5px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-lg font-black border border-rose-100">Switch</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          </div>
        </div>
      </div>
      
      {/* Mobile search bar visible on phone screens */}
      <div className="lg:hidden bg-zinc-50 px-4 pb-3 pt-1 border-t border-zinc-200 flex gap-1.5">
        <div className="relative flex-1">
          <input 
            type="text"
            placeholder="Search coupon brands..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-white text-slate-800 placeholder-slate-400 text-xs pl-3 pr-10 py-1.5 rounded-lg border border-slate-200 focus:outline-none"
          />
          <button className="absolute right-0 top-0 bottom-0 px-3 bg-slate-900 rounded-r-lg flex items-center">
            <Search className="w-3 h-3 text-white" />
          </button>
        </div>
        <button 
          onClick={() => setActiveTab('chat')}
          className="bg-white border border-slate-200 px-2 text-slate-600 rounded-lg hover:text-slate-850 text-xs font-semibold"
        >
          FAQ
        </button>
      </div>

      {/* RENDER BEAUTIFIED EDIT PROFILE SETTINGS MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[200] p-4 select-none">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col justify-between">
            {/* Visual Header line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-505 via-[#ff116d] to-amber-500" />
            
            <form onSubmit={handleSaveProfile} className="p-6 space-y-5 text-left font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-550 bg-indigo-50 text-indigo-750 text-indigo-700 rounded-lg">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Edit Profile & Settings
                  </h3>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-705 hover:bg-zinc-100 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10.5px] text-slate-500 leading-normal">
                Revise your credentials, update your peer ledger identity avatar, or simulate standard regulatory KYC check status securely.
              </p>

              {feedback && (
                <div className={`p-3 rounded-2xl text-[10.5px] font-bold leading-normal duration-150 border ${
                  feedback.type === 'success' 
                    ? 'bg-emerald-550/10 bg-emerald-50 text-emerald-800 border-emerald-150' 
                    : 'bg-rose-50 text-rose-800 border-rose-150'
                }`}>
                  {feedback.type === 'success' ? '✓ ' : '⚠️ '}
                  {feedback.msg}
                </div>
              )}

              <div className="space-y-4">
                {/* Full name input */}
                <div className="space-y-1">
                  <label className="text-[8.5px] font-black uppercase tracking-wider text-slate-450 block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Aruna Kiran Reddy"
                    className="w-full bg-slate-50 border border-zinc-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white font-semibold transition-all"
                  />
                </div>

                {/* Email address input */}
                <div className="space-y-1">
                  <label className="text-[8.5px] font-black uppercase tracking-wider text-slate-450 block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="arun@vouchloop.com"
                    className="w-full bg-slate-50 border border-zinc-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white font-semibold transition-all"
                  />
                </div>



                {/* KYC Level Simulation */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3 flex items-center justify-between text-xs">
                  <div className="space-y-0.5 pr-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-450 block">Simulate KYC Seal</span>
                    <span className="text-[10px] font-semibold text-slate-500 leading-normal block">Unlock immediate listings & claims powers</span>
                  </div>
                  <select
                    value={editKycStatus}
                    onChange={(e: any) => setEditKycStatus(e.target.value)}
                    className="bg-white border border-zinc-200 text-slate-800 text-[11px] font-black px-2 py-1 rounded-xl outline-none focus:border-indigo-500"
                  >
                    <option value="unverified">❌ Unverified</option>
                    <option value="pending">⏳ Pending Check</option>
                    <option value="verified">Verified ✓</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-slate-700 font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-slate-950 hover:bg-slate-850 active:bg-black text-white font-extrabold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </header>
  );
}
