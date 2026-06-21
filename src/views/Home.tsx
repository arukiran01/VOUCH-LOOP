import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Tag, TrendingUp, Star } from 'lucide-react';
import { CATEGORIES } from '../data';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';

export default function Home() {
  const { addToCart, vouchers, setActiveCategoryFilter } = useAppContext();
  const navigate = useNavigate();
  const [featuredDeals, setFeaturedDeals] = useState<any[]>([]);

  useEffect(() => {
    // Simulate fetching high discount deals from Supabase
    const fetchDeals = async () => {
      // filtering high discounts
      const deals = vouchers
        .filter(v => v.status === 'active' && v.discountPercentage >= 10)
        .sort((a, b) => b.discountPercentage - a.discountPercentage)
        .slice(0, 6);
      setFeaturedDeals(deals);
    };
    fetchDeals();
  }, [vouchers]);

  return (
    <div className="bg-gray-50 pb-16">
      {/* Hero Banner Area */}
      <section className="bg-teal-700 text-white py-12 md:py-20 px-4 mb-10 overflow-hidden relative">
        {/* Abstract background graphics */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="200" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute -bottom-20 -left-20 opacity-10 pointer-events-none">
          <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="150" cy="150" r="150" fill="currentColor"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
            Buy & Sell Gift Cards.<br className="hidden md:block"/> Instantly via <span className="text-yellow-400">UPI.</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10 font-light">
            Up to 30% discount on P2P unverified vouchers. Powered by AI and PhonePe Escrow integrations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/stores" className="bg-yellow-400 text-yellow-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors w-full sm:w-auto shadow-lg shadow-teal-900/50">
              Browse Vouchers
            </Link>
            <Link to="/sell-gift-card" className="bg-teal-800 text-white font-medium py-3 px-8 rounded-full hover:bg-teal-900 transition-colors border border-teal-600 w-full sm:w-auto">
              Sell Gift Cards
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-16">
        
        {/* Categories Section - Horizontal Scroll */}
        <section>
          <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center justify-between">
            Shop by Category
          </h2>
          <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x">
            {CATEGORIES.map(cat => (
              <div 
                key={cat.id} 
                onClick={() => {
                  setActiveCategoryFilter(cat.id);
                  navigate(`/stores?category=${cat.id}`);
                }}
                className="snap-start flex-shrink-0 w-32 bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-md hover:border-teal-100 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-3 group-hover:bg-teal-100 group-hover:scale-110 transition-transform">
                  <CategoryIcon name={cat.icon} />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Deals Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-teal-600 w-6 h-6" /> Featured Deals
            </h2>
            <Link to="/stores" className="text-teal-600 font-medium text-sm hover:underline">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDeals.map((voucher, i) => (
              <motion.div
                key={voucher.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col h-full relative group cursor-pointer"
                onClick={() => {
                  setActiveCategoryFilter('All');
                  navigate(`/stores?search=${encodeURIComponent(voucher.brand)}&category=All`);
                }}
              >
                <div className="absolute top-4 right-4 bg-teal-50 text-teal-700 text-xs font-extrabold px-3 py-1.5 rounded-full border border-teal-100">
                  {voucher.discountPercentage}% OFF
                </div>
                
                <div className="flex items-center gap-5 mb-5">
                  <div className="w-16 h-16 rounded-xl border border-gray-100 flex items-center justify-center p-2 bg-white shrink-0 group-hover:border-teal-200 transition-colors">
                    <img src={voucher.logo} alt={voucher.brand} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-teal-700 transition-colors">{voucher.brand}</h3>
                    <div className="flex flex-wrap items-center mt-1 gap-2">
                      <p className="text-gray-500 text-xs bg-gray-50 px-2 py-0.5 rounded-md inline-block border border-gray-100">By: {voucher.sellerName}</p>
                      {voucher.rating && voucher.reviewCount && (
                        <div className="flex items-center gap-1 border border-yellow-100 bg-yellow-50 px-2 py-0.5 rounded-md">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-xs font-semibold text-yellow-900">{voucher.rating}</span>
                          <span className="text-[10px] text-yellow-700">({voucher.reviewCount})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mb-6 flex-grow">
                  <p className="text-gray-600 text-sm line-clamp-2">{voucher.description || 'Premium voucher available for a limited time.'}</p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                  <div>
                    <div className="text-gray-400 text-xs line-through mb-0.5">₹{voucher.value}</div>
                    <div className="text-2xl font-bold text-teal-700 leading-none">₹{voucher.sellingPrice}</div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({ id: voucher.id, type: 'giftcard', item: voucher, quantity: 1, price: voucher.sellingPrice });
                      navigate('/cart');
                    }} 
                    className="flex text-sm bg-teal-600 font-bold px-4 h-10 rounded-full items-center justify-center text-white hover:bg-teal-700 transition-colors border border-teal-600"
                  >
                    Buy Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Sell Banner Card */}
        <section>
          <div className="bg-gradient-to-r from-gray-900 to-teal-900 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-xl">
            <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
              <h3 className="text-3xl font-bold mb-3">Got Unused Gift Cards?</h3>
              <p className="text-gray-300 max-w-lg leading-relaxed">Turn your unused corporate vouchers and gift cards into real cash in your bank account safely with our Escrow engine.</p>
            </div>
            <Link to="/sell-gift-card" className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors shrink-0 shadow-lg whitespace-nowrap">
              Sell Voucher Now
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-500">Everything you need to know about cashback and gift cards.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <FaqItem 
              question="How do I earn cashback on VouchLoop?" 
              answer="Simply log in to VouchLoop, browse for your favorite store or offer, and click 'Shop Now'. We will redirect you to the retailer's website. Complete your purchase as usual, and the cashback will automatically track into your VouchLoop wallet within 72 hours."
            />
            <FaqItem 
              question="Can I sell my unused gift cards here?" 
              answer="Yes! Navigate to the 'Sell Gift Cards' section, enter your brand, value, and selling price. Provide the voucher code. Once a buyer purchases it, the money will be credited to your VouchLoop Wallet."
            />
            <FaqItem 
              question="How can I withdraw my wallet balance?" 
              answer="You can use your VouchLoop Wallet balance to buy new gift cards at a discount, or withdraw it directly to your linked bank account or UPI/PhonePe once you reach the minimum threshold of ₹250."
            />
            <FaqItem 
              question="Why is my cashback pending?" 
              answer="Retailers take up to 30-90 days to confirm that your order wasn't returned or cancelled. During this period, your cashback status is 'Pending'. Once confirmed, it becomes 'Confirmed' and can be withdrawn."
            />
          </div>
        </section>

      </div>
    </div>
  );
}

// Subcomponents

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden transition-all">
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 font-medium text-gray-800 transition-colors"
      >
        <span>{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="p-4 bg-white text-gray-600 text-sm leading-relaxed border-t border-gray-200">
          {answer}
        </div>
      )}
    </div>
  );
}

function CategoryIcon({ name }: { name: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {name === 'smartphone' && <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>}
      {name === 'shirt' && <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"></path>}
      {name === 'utensils' && <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"></path></>}
      {name === 'plane' && <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7L3 8l6 5-4.5 4.5-2.8-.7L1 18l4.3 1.7L7 24l1.2-1.7-.7-2.8 4.5-4.5 5 6l1.1-.7c.5-.2.8-.6.7-1.1z"></path>}
      {name === 'shopping-cart' && <><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path></>}
      {name === 'sparkles' && <path d="M12 3v18m9-9H3m15.536 6.364l-12.728-12.728m0 12.728l12.728-12.728"></path>}
    </svg>
  );
}

const unused_to_remove = null;
