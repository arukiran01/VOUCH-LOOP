import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ShieldCheck, Users, Activity, CheckCircle, XCircle, Search, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminView() {
  const { user, vouchers, updateVoucherStatus, updateKycStatus, addFunds } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'vouchers' | 'users'>('overview');

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-6">You don't have permission to view the Admin Dashboard.</p>
          <button onClick={() => navigate('/')} className="bg-teal-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-teal-700">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const pendingVouchers = vouchers.filter(v => v.status === 'pending');
  const activeVouchers = vouchers.filter(v => v.status === 'active');
  const rejectedVouchers = vouchers.filter(v => v.status === 'rejected');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-teal-600" /> Admin Console
          </h1>
          <p className="text-gray-500 mt-1">Manage platform operations and approvals.</p>
        </div>
        <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-lg font-bold border border-teal-100 flex items-center gap-2">
           <Activity className="w-5 h-5" /> Live
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
           <button 
             onClick={() => setActiveTab('overview')}
             className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${activeTab === 'overview' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
           >
             <Activity className="w-5 h-5" /> Overview
           </button>
           <button 
             onClick={() => setActiveTab('vouchers')}
             className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${activeTab === 'vouchers' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
           >
             <Gift className="w-5 h-5" /> Voucher Approvals
             {pendingVouchers.length > 0 && <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === 'vouchers' ? 'bg-white text-teal-600' : 'bg-red-100 text-red-600'}`}>{pendingVouchers.length}</span>}
           </button>
           <button 
             onClick={() => setActiveTab('users')}
             className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${activeTab === 'users' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
           >
             <Users className="w-5 h-5" /> KYC & Users
           </button>
        </div>

        <div className="md:col-span-3">
           <AnimatePresence mode="wait">
             {activeTab === 'overview' && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <p className="text-gray-500 font-medium text-sm mb-1">Total Users</p>
                      <h3 className="text-3xl font-extrabold text-gray-900">4,289</h3>
                      <p className="text-green-500 text-sm font-medium mt-2">+12% this week</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <p className="text-gray-500 font-medium text-sm mb-1">Active Vouchers</p>
                      <h3 className="text-3xl font-extrabold text-gray-900">{activeVouchers.length}</h3>
                      <p className="text-teal-600 text-sm font-medium mt-2">{pendingVouchers.length} pending approval</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <p className="text-gray-500 font-medium text-sm mb-1">Platform Revenue (Est)</p>
                      <h3 className="text-3xl font-extrabold text-gray-900">₹84.5k</h3>
                      <p className="text-green-500 text-sm font-medium mt-2">From transaction limits</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Manual Adjustments</h3>
                    <div className="flex gap-4">
                      <button onClick={() => { addFunds(100); alert('Added ₹100 to admin wallet for testing.'); }} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg text-sm">
                         Credit Admin Wallet (₹100)
                      </button>
                    </div>
                  </div>
               </motion.div>
             )}

             {activeTab === 'vouchers' && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                   <h3 className="font-bold text-gray-900">Pending Voucher Approvals</h3>
                 </div>
                 <div className="divide-y divide-gray-100">
                   {pendingVouchers.length === 0 ? (
                     <div className="p-12 text-center text-gray-500">No pending submissions right now.</div>
                   ) : (
                     pendingVouchers.map(v => (
                       <div key={v.id} className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-gray-50 transition-colors">
                         <div className="flex items-center gap-4">
                           <div className="w-16 h-12 bg-gray-100 rounded border flex flex-shrink-0 items-center justify-center">
                             {v.logo ? <img src={v.logo} alt={v.brand} className="max-h-8" /> : <Gift className="text-gray-400" />}
                           </div>
                           <div>
                             <h4 className="font-bold text-gray-900">{v.brand} Voucher</h4>
                             <p className="text-sm text-gray-500">Submitted by: {v.sellerName}</p>
                             <div className="flex gap-3 mt-1 text-sm bg-yellow-50 text-yellow-800 px-2 py-1 rounded inline-flex">
                               <span className="font-medium">Face: ₹{v.value}</span>
                               <span>Sell: ₹{v.sellingPrice}</span>
                             </div>
                           </div>
                         </div>
                         <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                           <button 
                             onClick={() => updateVoucherStatus(v.id, 'rejected')} 
                             className="flex-1 sm:flex-none px-4 py-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                           >
                              <XCircle className="w-4 h-4" /> Reject
                           </button>
                           <button 
                             onClick={() => updateVoucherStatus(v.id, 'active')} 
                             className="flex-1 sm:flex-none px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                           >
                              <CheckCircle className="w-4 h-4" /> Approve
                           </button>
                         </div>
                       </div>
                     ))
                   )}
                 </div>
               </motion.div>
             )}

             {activeTab === 'users' && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-4 border-b border-gray-100 bg-gray-50">
                   <h3 className="font-bold text-gray-900 mb-2">Simulate KYC Approvals</h3>
                   <p className="text-sm text-gray-500">In a live environment, this connects to your active users table.</p>
                 </div>
                 <div className="p-6">
                   <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <h4 className="font-bold text-gray-900">Current Session User</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs font-mono mt-1">Status: <span className="font-bold text-teal-600">{user.kycStatus}</span></p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => updateKycStatus('verified')} className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 font-medium rounded text-sm transition">Set Verified</button>
                        <button onClick={() => updateKycStatus('pending')} className="px-3 py-1.5 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-medium rounded text-sm transition">Set Pending</button>
                        <button onClick={() => updateKycStatus('rejected')} className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 font-medium rounded text-sm transition">Set Rejected</button>
                      </div>
                   </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
