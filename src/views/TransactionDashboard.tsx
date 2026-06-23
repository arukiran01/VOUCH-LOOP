import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, FileText, ArrowDownCircle, ArrowUpCircle, Wallet, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import RewardsProgress from '../components/RewardsProgress';

export default function TransactionDashboard() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'purchases' | 'sales' | 'wallet'>('all');
  const [dbTransactions, setDbTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/wallet/history')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setDbTransactions(data.history);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) {
    navigate('/auth');
    return null;
  }

  // Total completed transactions for progress visualization
  const completedCount = dbTransactions.filter(t => t.status === 'completed' && t.type === 'purchase').length;

  const walletTransactions = dbTransactions.filter(t => t.type === 'deposit' || t.type === 'withdraw');

  const filtered = dbTransactions.filter(t => {
    if (activeTab === 'all') return true;
    if (activeTab === 'purchases') return t.type === 'purchase';
    if (activeTab === 'sales') return t.type === 'sale';
    if (activeTab === 'wallet') return t.type === 'deposit' || t.type === 'withdraw';
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-300">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Transactions & Rewards</h1>
          <p className="text-gray-500 mt-1">Track your purchases, sales, and loyalty status.</p>
        </div>
        
        {/* Prominent color-coded KYC status badge */}
        <Link to="/kyc" className="group flex items-center gap-3.5 bg-white/70 backdrop-blur-md p-3.5 rounded-2xl border border-gray-150 shadow-xs hover:shadow-md hover:border-teal-200 transition-all duration-300">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            user.kycStatus === 'verified' ? 'bg-green-50 text-green-600 group-hover:bg-green-100' :
            user.kycStatus === 'pending' ? 'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100' :
            'bg-red-50 text-red-500 group-hover:bg-red-100'
          }`}>
            <ShieldCheck className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Identity KYC</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                user.kycStatus === 'verified' ? 'bg-green-100 text-green-800' :
                user.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {user.kycStatus || 'unverified'}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs font-semibold text-gray-500">
                {user.kycStatus === 'verified' ? 'Full access & high-value limits active' :
                 user.kycStatus === 'pending' ? 'Document verification in progress' :
                 'Tap here to verify & lift wallet limits'}
              </span>
            </div>
          </div>
        </Link>
      </div>

      <RewardsProgress transactionCount={completedCount} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main transaction list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 p-4 flex gap-4 overflow-x-auto scrollbar-hide">
              <button 
                onClick={() => setActiveTab('all')}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                All History
              </button>
              <button 
                onClick={() => setActiveTab('purchases')}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'purchases' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Voucher Purchases
              </button>
              <button 
                onClick={() => setActiveTab('sales')}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'sales' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Voucher Sales
              </button>
              <button 
                onClick={() => setActiveTab('wallet')}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'wallet' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Wallet Deposits & Withdrawals
              </button>
            </div>

            <div className="divide-y divide-gray-100 min-h-[200px]">
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
              ) : filtered.length > 0 ? filtered.map((trx, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={trx.id + index} 
                  className="p-4 sm:p-6 hover:bg-gray-50 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${trx.type === 'purchase' || trx.type === 'withdraw' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                      {trx.type === 'purchase' || trx.type === 'withdraw' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">
                        {trx.type === 'purchase' && `${trx.brand || 'Item'} Purchase`}
                        {trx.type === 'sale' && `${trx.brand || 'Item'} Sale`}
                        {trx.type === 'deposit' && `Wallet Deposit`}
                        {trx.type === 'withdraw' && `Wallet Withdrawal`}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{trx.id}</span>
                        <span>•</span>
                        <span>{trx.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-bold text-lg ${trx.type === 'deposit' || trx.type === 'sale' ? 'text-green-600' : 'text-gray-900'}`}>
                      {trx.type === 'sale' || trx.type === 'deposit' ? '+' : '-'}₹{trx.amount.toFixed(2)}
                    </div>
                    <div className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(trx.status)}`}>
                      {getStatusIcon(trx.status)}
                      <span className="capitalize">{trx.status === 'pending' ? 'Verification Pending' : trx.status}</span>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="p-12 text-center">
                   <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                   <h3 className="text-lg font-bold text-gray-900">No transactions found</h3>
                   <p className="text-gray-500">You haven't made any {activeTab !== 'all' ? activeTab : 'transactions'} yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dedicated Recent Wallet Activities Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-[520px]">
            <div className="flex items-center gap-2.5 mb-5 shrink-0">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Wallet Activities</h3>
                <p className="text-xs text-gray-500">Recent deposits & withdrawals</p>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
              ) : walletTransactions.length > 0 ? (
                walletTransactions.map((trx, index) => (
                  <div 
                    key={trx.id + '-wallet-side-' + index}
                    className="p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${trx.type === 'deposit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {trx.type === 'deposit' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">
                          {trx.type === 'deposit' ? 'Wallet Deposit' : 'Withdrawal'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 font-medium">{trx.date}</p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1">
                      <p className={`font-bold text-sm ${trx.type === 'deposit' ? 'text-green-600' : 'text-gray-900'}`}>
                        {trx.type === 'deposit' ? '+' : '-'}₹{trx.amount.toFixed(2)}
                      </p>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                        trx.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-150' :
                        trx.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-150' :
                        'bg-red-50 text-red-700 border border-red-150'
                      }`}>
                        {trx.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col justify-center items-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                    <Wallet className="w-6 h-6 text-gray-300" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">No wallet entries</h4>
                  <p className="text-xs text-gray-400 max-w-[180px] mt-1 mx-auto text-center">Your standard wallet uploads and payouts will report here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
