import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, FileText, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Transactions & Rewards</h1>
        <p className="text-gray-500 mt-1">Track your purchases, sales, and loyalty status.</p>
      </div>

      <RewardsProgress transactionCount={completedCount} />

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
  );
}
