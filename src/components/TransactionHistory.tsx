import React, { useState } from 'react';
import useSWR from 'swr';
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, XCircle, Search, Calendar, ChevronLeft, ChevronRight, Filter, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'purchase' | 'sale';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description?: string;
  brand?: string;
}

export function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Use SWR to fetch and automatically synchronize transactions with the server state
  const { data, error, isLoading, mutate } = useSWR('/api/wallet/history', fetcher, {
    refreshInterval: 10000, // Background poll every 10 seconds to keep transactions up-to-date
  });

  const transactions: Transaction[] = data?.success && Array.isArray(data.history) ? data.history : [];

  // Filter transactions to only those related to wallet (deposits and withdrawals)
  const walletTransactions = transactions.filter(t => t.type === 'deposit' || t.type === 'withdraw');

  // Filter by search, type, and status
  const filtered = walletTransactions.filter((t) => {
    // Search
    const searchString = `${t.id} ${t.description || ''} ${t.brand || ''}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());

    // Credit vs Debit
    // Deposits are credit (money coming in), withdrawals are debit (money going out)
    const matchesType =
      typeFilter === 'all' ||
      (typeFilter === 'credit' && t.type === 'deposit') ||
      (typeFilter === 'debit' && t.type === 'withdraw');

    // Status
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination calculation
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filtered.slice(startIndex, startIndex + itemsPerPage);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/25';
      case 'pending':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/25';
      case 'failed':
        return 'bg-red-500/10 text-red-700 border-red-500/25';
      default:
        return 'bg-slate-500/10 text-slate-705 border-slate-500/25_';
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-600" />
            Wallet Ledgers
          </h3>
          <p className="text-xs text-slate-500 mt-1">Detailed history of credits and debits.</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => mutate()} 
            className="text-xs px-2.5 py-1.5 rounded-lg font-semibold bg-white/65 hover:bg-white border border-slate-200 text-slate-700 shadow-xs transition-all active:scale-95"
          >
            Refresh List
          </button>
        </div>
      </div>

      {/* Filters Bench */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {/* Search */}
        <div className="relative flex items-center bg-white/70 rounded-xl px-3 py-2 border border-slate-200">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search log ID, type..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent border-none outline-none w-full px-2 text-xs text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Type selector */}
        <div className="flex items-center bg-white/70 rounded-xl px-1 py-1 border border-slate-200">
          <button
            onClick={() => { setTypeFilter('all'); setCurrentPage(1); }}
            className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${typeFilter === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
          >
            All Logs
          </button>
          <button
            onClick={() => { setTypeFilter('credit'); setCurrentPage(1); }}
            className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${typeFilter === 'credit' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-emerald-600'}`}
          >
            Credits
          </button>
          <button
            onClick={() => { setTypeFilter('debit'); setCurrentPage(1); }}
            className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${typeFilter === 'debit' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-500 hover:text-amber-600'}`}
          >
            Debits
          </button>
        </div>

        {/* Status Selector */}
        <div className="relative flex items-center bg-white/70 rounded-xl px-2.5 py-1.5 border border-slate-200">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-transparent border-none outline-none w-full text-xs text-slate-600 font-medium cursor-pointer"
          >
            <option value="all">Any Status</option>
            <option value="completed">Completed Only</option>
            <option value="pending">Pending Only</option>
            <option value="failed">Failed Only</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="relative min-h-[340px] max-h-[460px] overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-teal-600 border-r-teal-600 border-slate-200"></div>
            <span className="text-xs font-semibold text-slate-500">Loading ledger account stats...</span>
          </div>
        ) : paginatedTransactions.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {paginatedTransactions.map((trx, index) => {
              const isCredit = trx.type === 'deposit';
              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  key={trx.id + '-' + index}
                  className="p-4 bg-white/50 backdrop-blur-xs rounded-xl border border-white/60 hover:bg-white/80 hover:border-teal-200 hover:shadow-xs flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isCredit 
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}>
                      {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">
                        {trx.description || (isCredit ? 'Wallet Balance Refill' : 'Standard Bank Cashout')}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                          {trx.id}
                        </span>
                        <span className="text-slate-300 text-[10px]">•</span>
                        <span className="text-slate-400 text-[10px] font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-300" />
                          {trx.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5">
                    <p className={`font-extrabold text-base ${isCredit ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {isCredit ? '+' : '-'}₹{trx.amount.toFixed(2)}
                    </p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(trx.status)}`}>
                      {getStatusIcon(trx.status)}
                      {trx.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <div className="flex flex-col justify-center items-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <Receipt className="w-6 h-6 text-slate-300" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No transactions recorded</h4>
            <p className="text-xs text-slate-400 max-w-xs mt-1 mx-auto">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' 
                ? 'Try adjusting your filters to find existing records.' 
                : 'Any standard deposits or withdrawal settlements will log right here.'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100/50 pt-4 mt-4">
          <p className="text-xs font-semibold text-slate-500">
            Showing <span className="text-slate-700 font-bold">{startIndex + 1}</span> to{' '}
            <span className="text-slate-700 font-bold">
              {Math.min(startIndex + itemsPerPage, filtered.length)}
            </span>{' '}
            of <span className="text-slate-700 font-bold">{filtered.length}</span> ledgers
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-3">
              <span className="text-xs font-bold text-slate-700">{currentPage}</span>
              <span className="text-xs text-slate-400">/</span>
              <span className="text-xs font-medium text-slate-500">{totalPages}</span>
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
