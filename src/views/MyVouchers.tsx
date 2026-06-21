import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Ticket, ExternalLink, RefreshCw, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

export default function MyVouchers() {
  const { user, myPurchasedVouchers } = useAppContext();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Ticket className="w-8 h-8 text-teal-600" /> My Coupons & Vouchers
        </h1>
        <p className="text-gray-500 mt-2">View and manage your purchased digital vouchers.</p>
      </div>

      {myPurchasedVouchers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
           <Ticket className="w-16 h-16 text-gray-200 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-gray-800 mb-2">No Vouchers Yet</h3>
           <p className="text-gray-500 mb-6">You have not purchased any gift cards or offers.</p>
           <button onClick={() => navigate('/gift-cards')} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
             Browse Vouchers
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPurchasedVouchers.map((voucher, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={voucher.id + idx} 
              className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group relative"
            >
              <div className="bg-gradient-to-tr from-gray-50 to-gray-100 p-6 flex items-center justify-center h-40 border-b relative">
                {voucher.logo ? (
                  <img src={voucher.logo} alt={voucher.brand} className="max-h-16 max-w-[80%] object-contain" />
                ) : (
                   <span className="font-bold text-xl text-gray-400">OFFER</span>
                )}
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-xs font-bold text-teal-600 shadow-sm border">
                  Ready to Use
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{voucher.brand || 'Digital Voucher'}</h3>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-xl font-extrabold text-teal-600">₹{voucher.value}</span>
                </div>
                
                <p className="text-xs text-gray-500 mt-4 flex-grow">Valid until {new Date(new Date().setMonth(new Date().getMonth() + 6)).toLocaleDateString()}</p>
                
                <div className="mt-5 bg-gray-50 p-3 rounded-lg border border-gray-100 border-dashed">
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Voucher Code</p>
                   <div className="flex justify-between items-center">
                     <span className="font-mono text-gray-800 font-bold tracking-widest text-lg">{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                     <button className="text-teal-600 hover:text-teal-800 p-1" title="Tap to copy">
                       <RefreshCw className="w-4 h-4" />
                     </button>
                   </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex justify-center items-center gap-1.5">
                    <ExternalLink className="w-4 h-4" /> Redeem Now
                  </button>
                  <button 
                     onClick={() => navigate('/sell-gift-card')}
                     className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg text-sm transition-colors"
                  >
                    Resell
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
