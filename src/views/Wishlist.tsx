import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Heart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VOUCHERS } from '../data';

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useAppContext();

  const wishlistItems = VOUCHERS.filter(item => wishlist.includes(item.id));

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save your favorite P2P vouchers here to access them quickly.</p>
        <Link to="/stores" className="bg-teal-600 text-white px-6 py-2 rounded-full font-medium hover:bg-teal-700 transition">
          Browse Vouchers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <Heart className="w-8 h-8 text-teal-600" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Wishlist</h1>
          <p className="text-gray-500">{wishlistItems.length} items saved for later</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col relative group">
              <button 
                onClick={() => toggleWishlist(item.id)}
                className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-red-500 hover:bg-red-50 transition-colors z-10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="h-28 flex items-center justify-center border-b border-gray-100 p-4 bg-gray-50">
                <img src={item.logo} alt={item.brand} className="max-h-14 max-w-full object-contain" />
              </div>
              <div className="p-4 flex flex-col flex-grow text-center">
                <h4 className="font-bold text-sm text-gray-800 mb-2 truncate" title={item.brand}>{item.brand}</h4>
                <div className="mt-auto">
                  <div className="inline-block text-xs font-bold bg-teal-50 text-teal-700 px-2 py-1 rounded">
                    {item.discountPercentage}% OFF
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
