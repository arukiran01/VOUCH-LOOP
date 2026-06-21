import React, { useState } from 'react';
import { Search, User, Wallet, Gift, Heart, Menu, ShoppingCart, Share2, Bell, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Header() {
  const { user, logout, walletBalance, cart, wishlist, notifications, markAllNotificationsRead, clearNotifications, markNotificationRead } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
      <div className="bg-teal-600 text-white text-xs py-1.5 text-center font-medium">
        🎉 Summer Sale is Live! Get extra 10% cashback on top stores.
      </div>
      
      {/* Top Nav */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-teal-600 tracking-tight">
            VouchLoop
          </Link>
        </div>

        {/* Search */}
        <div className="flex-grow max-w-2xl hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-teal-500 focus-within:bg-white transition-all">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search stores, brands, or gift cards..." 
            className="bg-transparent border-none outline-none w-full px-3 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/stores?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
              }
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6 text-gray-600">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center justify-center hover:text-teal-600 focus:outline-none"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <h3 className="font-bold text-gray-900">Notifications {unreadCount > 0 && `(${unreadCount})`}</h3>
                  <div className="flex gap-3">
                    {unreadCount > 0 && (
                      <button onClick={markAllNotificationsRead} className="text-xs text-teal-600 font-medium hover:underline focus:outline-none">Mark all read</button>
                    )}
                    {notifications.length > 0 && (
                      <button onClick={clearNotifications} className="text-xs text-red-500 font-medium hover:underline focus:outline-none">Clear</button>
                    )}
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      No notifications to show.
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-4 border-b border-gray-50 flex gap-3 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-teal-50/30' : ''}`}
                        onClick={() => {
                          if (!n.read) {
                            markNotificationRead(n.id);
                          }
                        }}
                      >
                        <div className={`mt-0.5 rounded-full p-1.5 h-max shrink-0 ${n.type === 'kyc' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                          {n.type === 'kyc' ? <ShieldCheck className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-sm ${!n.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</h4>
                          <p className={`text-xs mt-1 ${!n.read ? 'text-gray-600' : 'text-gray-500'}`}>{n.desc}</p>
                          <p className="text-[10px] text-gray-400 mt-2">{n.time}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></div>}
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div 
                    className="p-3 text-center border-t border-gray-100 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => setShowNotifications(false)}
                  >
                    <span className="text-sm text-teal-600 font-medium">Close</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <Link to="/wishlist" className="relative flex items-center justify-center hover:text-teal-600">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>}
          </Link>
          
          <Link to="/cart" className="relative flex items-center justify-center hover:text-teal-600">
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}
          </Link>

          <Link to="/wallet" className="flex items-center gap-1 hover:text-teal-600 text-sm font-medium">
            <Wallet className="w-5 h-5" />
            <span className="hidden md:inline font-bold">₹{walletBalance.toFixed(2)}</span>
          </Link>

          {user ? (
            <div className="relative group hidden md:flex items-center gap-1 hover:text-teal-600 text-sm font-medium cursor-pointer">
              <User className="w-5 h-5" />
              <span className="flex items-center gap-1">
                {user.name} 
                {user.kycStatus === 'verified' && <span className="w-2 h-2 rounded-full bg-green-500" title="Verified"></span>}
                {user.kycStatus === 'pending' && <span className="w-2 h-2 rounded-full bg-yellow-500" title="Pending"></span>}
                {user.kycStatus === 'unverified' && <span className="w-2 h-2 rounded-full bg-red-400" title="Unverified"></span>}
              </span>
              <div className="absolute top-full right-0 w-40 bg-white shadow-lg border border-gray-100 rounded-md py-2 mt-2 hidden group-hover:block z-50">
                {user.role === 'admin' && (
                  <Link to="/admin" className="block w-full text-left px-4 py-2 text-sm text-teal-700 bg-teal-50 hover:bg-teal-100 font-bold">
                    Admin Panel
                  </Link>
                )}
                <Link to="/my-vouchers" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  My Coupons
                </Link>
                <Link to="/dashboard" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Transactions
                </Link>
                <Link to="/kyc" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  {user.kycStatus === 'verified' ? 'KYC Details' : 'Complete KYC'}
                </Link>
                <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/auth" state={{ from: location.pathname }} className="hidden md:flex items-center gap-1 hover:text-teal-600 text-sm font-medium">
              <User className="w-5 h-5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="border-t border-gray-100 hidden md:block w-full overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 py-3 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-teal-600 whitespace-nowrap">Home</Link>
          <Link to="/stores" className="hover:text-teal-600 whitespace-nowrap">All Vouchers</Link>
          <Link to="/gift-cards" className="hover:text-teal-600 whitespace-nowrap">Buy Vouchers</Link>
          <Link to="/sell-gift-card" className="hover:text-teal-600 whitespace-nowrap">Sell Vouchers</Link>
          <Link to="/referrals" className="hover:text-green-600 text-green-700 font-bold whitespace-nowrap flex items-center gap-1">
             <Share2 className="w-4 h-4" /> Refer & Earn
          </Link>
        </div>
      </div>
      
      {/* Mobile Nav & Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:border-teal-500 border border-transparent">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search stores or brands..." 
            className="bg-transparent border-none outline-none w-full px-2 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/stores?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
              }
            }}
          />
        </div>
        <div className="flex justify-between mt-3 text-xs font-medium text-gray-600 px-2">
          <Link to="/" className="flex flex-col items-center hover:text-teal-600">
            <Menu className="w-5 h-5 mb-1" />
            Home
          </Link>
          <Link to="/stores" className="flex flex-col items-center hover:text-teal-600">
            <StoreIcon className="w-5 h-5 mb-1" />
            All
          </Link>
          <Link to="/gift-cards" className="flex flex-col items-center hover:text-teal-600">
            <Gift className="w-5 h-5 mb-1" />
            Buy
          </Link>
          <Link to="/referrals" className="flex flex-col items-center hover:text-green-600 text-green-600">
            <Share2 className="w-5 h-5 mb-1" />
            Refer
          </Link>
          {user ? (
             <button onClick={logout} className="flex flex-col items-center hover:text-teal-600">
               <User className="w-5 h-5 mb-1" />
               Out
             </button>
          ) : (
             <Link to="/auth" state={{ from: location.pathname }} className="flex flex-col items-center hover:text-teal-600">
               <User className="w-5 h-5 mb-1" />
               Auth
             </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function StoreIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );
}
