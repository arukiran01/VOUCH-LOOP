import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">VouchLoop</h3>
          <p className="opacity-80 leading-relaxed mb-6">
            Get the best cashback, coupons, and gift card deals all in one place. Save money every time you shop!
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-medium mb-4 uppercase tracking-wider text-xs">Quick Links</h4>
          <ul className="space-y-2 opacity-80">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-medium mb-4 uppercase tracking-wider text-xs">Top Categories</h4>
          <ul className="space-y-2 opacity-80">
            <li><Link to="/stores?category=electronics" className="hover:text-white transition-colors">Electronics Offers</Link></li>
            <li><Link to="/stores?category=fashion" className="hover:text-white transition-colors">Fashion Coupons</Link></li>
            <li><Link to="/stores?category=food" className="hover:text-white transition-colors">Food Delivery</Link></li>
            <li><Link to="/stores?category=travel" className="hover:text-white transition-colors">Travel Deals</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-medium mb-4 uppercase tracking-wider text-xs">Connect With Us</h4>
          <p className="opacity-80 mb-4">Subscribe to get the latest deals delivered to your inbox.</p>
          <div className="flex mb-6">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="bg-gray-800 text-white px-3 py-2 rounded-l-md outline-none w-full border border-gray-700 focus:border-gray-500 text-sm"
            />
            <button className="bg-teal-600 text-white px-4 py-2 rounded-r-md hover:bg-teal-500 transition-colors">
              Subscribe
            </button>
          </div>
          <h4 className="text-white font-medium mb-3 uppercase tracking-wider text-xs">Secure Payments</h4>
          <div className="flex flex-wrap gap-2">
            <div className="bg-white px-2 py-1.5 rounded-sm flex items-center justify-center h-8">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-5 object-contain" />
            </div>
            <div className="bg-white px-2 py-1.5 rounded-sm flex items-center justify-center h-8">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 object-contain" />
            </div>
            <div className="bg-white px-2 py-1.5 rounded-sm flex items-center justify-center h-8">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 object-contain" />
            </div>
            <div className="bg-white px-2 py-1.5 rounded-sm flex items-center justify-center h-8 text-[#0a2336] font-bold text-[10px] uppercase leading-none text-center">
              Net<br/>Banking
            </div>
            <div className="bg-white px-2 py-1.5 rounded-sm flex items-center justify-center h-8">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png" alt="RuPay" className="h-4 object-contain" />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-gray-800 text-center opacity-60">
        &copy; {new Date().getFullYear()} VouchLoop. All rights reserved.
      </div>
    </footer>
  );
}
