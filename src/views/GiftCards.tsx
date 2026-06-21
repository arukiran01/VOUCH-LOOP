import React, { useState, useEffect } from 'react';
import { Search, Tag } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { CATEGORIES } from '../data';
import VoucherSkeleton from '../components/VoucherSkeleton';
import NoResults from '../components/NoResults';
import GiftCard from '../components/GiftCard';

export default function GiftCards() {
  const { vouchers, activeCategoryFilter, setActiveCategoryFilter } = useAppContext();
  const [localSearch, setLocalSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      // Find category by name (case insensitive) or ID
      const matchingCat = CATEGORIES.find(c => 
        c.name.toLowerCase() === categoryParam.toLowerCase() || 
        c.id === categoryParam
      );
      if (matchingCat) {
        setActiveCategoryFilter(matchingCat.id);
      } else if (categoryParam.toLowerCase() === 'all') {
        setActiveCategoryFilter('All');
      }
    }
  }, [searchParams, setActiveCategoryFilter]);

  useEffect(() => {
    // Simulate loading data initially and on category filter changes
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeCategoryFilter]);

  const activeVouchers = vouchers.filter(v => {
    if (v.status !== 'active') return false;
    
    // Category filter
    if (activeCategoryFilter !== 'All' && v.category !== activeCategoryFilter) return false;
    
    // Real-time search filter
    if (localSearch) {
      const searchString = `${v.brand} ${v.description || ''}`.toLowerCase();
      if (!searchString.includes(localSearch.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  const handleClearFilters = () => {
    setLocalSearch('');
    setActiveCategoryFilter('All');
    setSearchParams({}); // Clear query params
  };

  const handleCategoryClick = (catId: string, catName: string) => {
    setActiveCategoryFilter(catId);
    if (catId === 'All') {
      setSearchParams({ category: 'all' });
    } else {
      setSearchParams({ category: catName.toLowerCase() });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-teal-800 to-teal-600 py-12 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            Buy & Sell Gift Cards
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl mb-8">
            Buy verified P2P brand vouchers at a discount using our secure PhonePe Escrow platform.
          </p>
          <div className="flex bg-white rounded-lg p-2 max-w-2xl shadow-lg">
            <div className="flex flex-grow items-center px-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search brands like Amazon, Myntra, Swiggy..." 
                className="w-full px-3 py-2 outline-none text-gray-700"
              />
            </div>
            <button 
              onClick={() => {}} // Local search is already real-time now! but keep the button for UI
              className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded font-bold hover:bg-yellow-300 transition-colors flex items-center justify-center cursor-default"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 border-b border-gray-200 pb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center shrink-0">
            <Tag className="w-6 h-6 mr-2 text-teal-600" /> Popular Vouchers
          </h2>
          <div className="flex gap-2">
           <button className="px-4 py-2 rounded-full text-sm font-medium bg-teal-600 text-white shadow hover:bg-teal-700 transition">Buy Vouchers</button>
           <Link to="/sell-gift-card" className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition">Sell Vouchers</Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Categories</h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleCategoryClick('All', 'all')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${activeCategoryFilter === 'All' ? 'bg-teal-50 text-teal-700 font-medium' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                All Brands
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id, cat.name)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${activeCategoryFilter === cat.id ? 'bg-teal-50 text-teal-700 font-medium' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Vouchers Grid */}
          <div className="flex-grow">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <VoucherSkeleton key={`gc-skeleton-${i}`} />
                ))}
              </div>
            ) : activeVouchers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeVouchers.map(gc => (
                  <GiftCard key={gc.id} voucher={gc} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 border-dashed">
                <NoResults onClearFilters={handleClearFilters} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
