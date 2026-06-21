import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data';
import { Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import VoucherSkeleton from '../components/VoucherSkeleton';
import NoResults from '../components/NoResults';
import GiftCard from '../components/GiftCard';

export default function Stores() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  const { vouchers, activeCategoryFilter, setActiveCategoryFilter } = useAppContext();
  const [search, setSearch] = useState<string>(initialSearch);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const updatedSearch = queryParams.get('search') || '';
    const updatedCategory = queryParams.get('category') || activeCategoryFilter;
    if (updatedCategory !== activeCategoryFilter) {
      setActiveCategoryFilter(updatedCategory);
    }
    setSearch(updatedSearch);
    
    // Simulate loading external data
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [location.search, activeCategoryFilter, setActiveCategoryFilter]);

  // Sync state changes to URL
  const updateUrlParams = (newFilter: string, newSearch: string) => {
    const params = new URLSearchParams();
    if (newFilter !== 'All') params.set('category', newFilter);
    if (newSearch) params.set('search', newSearch);
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleFilterChange = (newFilter: string) => {
    setActiveCategoryFilter(newFilter);
    updateUrlParams(newFilter, search);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    updateUrlParams(activeCategoryFilter, newSearch);
  };

  const handleClearFilters = () => {
    setActiveCategoryFilter('All');
    setSearch('');
    navigate('/stores');
  };

  const filteredVouchers = vouchers.filter(voucher => {
    if (voucher.status !== 'active') return false;
    const searchString = `${voucher.brand} ${voucher.description || ''}`.toLowerCase();
    const matchesSearch = searchString.includes(search.toLowerCase());
    const matchesCat = activeCategoryFilter === 'All' || voucher.category === activeCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">All Vouchers</h1>
          <p className="text-gray-500 mt-1">Browse and buy discounted gift cards securely</p>
        </div>
        
        <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 w-full md:w-80 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-all shadow-sm">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search brands or description..." 
            value={search}
            onChange={handleSearchChange}
            className="flex-grow outline-none border-none bg-transparent"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Categories</h3>
          <div className="space-y-2">
            <button 
              onClick={() => handleFilterChange('All')} 
              className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${activeCategoryFilter === 'All' ? 'bg-teal-50 text-teal-700 font-medium' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              All Brands
            </button>
            {CATEGORIES.map(c => (
              <button 
                key={c.id}
                onClick={() => handleFilterChange(c.id)} 
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${activeCategoryFilter === c.id ? 'bg-teal-50 text-teal-700 font-medium' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Vouchers Grid */}
        <div className="flex-grow">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <VoucherSkeleton key={`skeleton-${i}`} />
              ))}
            </div>
          ) : filteredVouchers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVouchers.map(voucher => (
                <GiftCard key={voucher.id} voucher={voucher} />
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
  );
}
