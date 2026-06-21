import React, { useState } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';

interface GiftCardProps {
  voucher: any;
}

const GiftCard: React.FC<GiftCardProps> = ({ voucher }) => {
  const { toggleWishlist, wishlist, addToCart } = useAppContext();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: voucher.id || Math.random().toString(36).substr(2, 9),
      type: 'giftcard',
      item: voucher,
      quantity: 1,
      price: voucher.sellingPrice
    });
    setAddedId(voucher.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const isWishlisted = wishlist.includes(voucher.id);

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col relative"
    >
      <button 
        onClick={(e) => { e.stopPropagation(); toggleWishlist(voucher.id); }}
        className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm shadow-sm rounded-full text-gray-400 hover:text-red-500 transition-colors z-10"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      <div className="h-28 flex items-center justify-center border-b border-gray-100 p-4 bg-white cursor-pointer relative">
        <div className="absolute top-2 left-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
            {voucher.discountPercentage}% OFF
        </div>
        <img src={voucher.logo} alt={voucher.brand} className="max-h-14 max-w-full object-contain" />
      </div>

      <div className="p-4 flex flex-col flex-grow cursor-default">
        <h4 className="font-bold text-sm text-gray-800 mb-1 truncate" title={voucher.brand}>{voucher.brand}</h4>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-500">By: {voucher.sellerName}</p>
          {voucher.rating && voucher.reviewCount && (
            <div className="flex items-center gap-0.5 mt-0.5">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] font-semibold text-gray-700">{voucher.rating}</span>
              <span className="text-[9px] text-gray-400">({voucher.reviewCount})</span>
            </div>
          )}
        </div>
        <div className="mt-auto space-y-1 mb-3">
          <div className="text-xs text-gray-400 line-through">₹{voucher.value}</div>
          <div className="text-lg font-bold text-teal-700">₹{voucher.sellingPrice}</div>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className={`w-full py-2 rounded flex items-center justify-center gap-1 text-sm font-medium transition-colors ${addedId === voucher.id ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-teal-600 hover:text-white'}`}
        >
          <ShoppingCart className="w-4 h-4" />
          {addedId === voucher.id ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
};

export default GiftCard;
