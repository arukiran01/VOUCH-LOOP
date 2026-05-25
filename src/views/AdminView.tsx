import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle,
  FileText,
  Clock,
  Unlock,
  Coins,
  ArrowRight,
  X
} from 'lucide-react';
import { Coupon, Transaction, SystemLog } from '../types';

interface AdminViewProps {
  adminStats: {
    usersCount: number;
    couponsCount: number;
    revenueCommission: number;
    totalTradeVolume: number;
    avgRiskFactor: number;
    pendingApprovalCount: number;
    pendingWithdrawalCount: number;
  } | null;
  adminLogs: SystemLog[];
  allUsers: any[];
  couponsToReview: Coupon[];
  pendingWithdrawals: Transaction[];
  auditLoading: boolean;
  auditReport: string;
  onModerateCoupon: (id: string, action: 'approve' | 'reject') => void;
  onModerateWithdrawal: (id: string, action: 'complete' | 'reject') => void;
  onTriggerAudit: () => void;
}

export default function AdminView({
  adminStats,
  adminLogs,
  allUsers,
  couponsToReview,
  pendingWithdrawals,
  auditLoading,
  auditReport,
  onModerateCoupon,
  onModerateWithdrawal,
  onTriggerAudit
}: AdminViewProps) {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Intro info bar */}
      <div className="flex flex-col border-b border-slate-100 pb-5">
        <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Moderator Security Workspace</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Compliance Center</h1>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Moderate pending coupons, authorize UPI withdrawal wire queue requests, and pull automated bookkeeping ledger audits.
        </p>
      </div>

      {adminStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between">
            <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Total Registered Accounts</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{adminStats.usersCount}</span>
              <span className="text-xs font-bold text-indigo-600">+100% stable</span>
            </div>
          </div>

          <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between">
            <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Platform commissions (10%)</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">₹{adminStats.revenueCommission.toLocaleString('en-IN')}</span>
              <span className="text-xs font-bold text-emerald-600">Pure Revenue</span>
            </div>
          </div>

          <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between">
            <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Aggregate Trade Volume</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">₹{adminStats.totalTradeVolume.toLocaleString('en-IN')}</span>
              <span className="text-xs font-bold text-slate-400">Escrow Swaps</span>
            </div>
          </div>

          <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between">
            <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider font-mono">Pending Review Tasks</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-rose-600">
                {adminStats.pendingApprovalCount + adminStats.pendingWithdrawalCount} Items
              </span>
              <span className="text-xs font-bold text-rose-500 animate-pulse">Needs Clearing</span>
            </div>
          </div>

        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Hand: Listings + Withdrawals moderation queues */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* List queue */}
          <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-800 tracking-tight">
              1. Coupons Verifying list Queue ({couponsToReview.length})
            </h3>

            {couponsToReview.length === 0 ? (
              <p className="text-[11px] text-slate-400 py-6 italic text-center">Listings verifying queue is currently empty.</p>
            ) : (
              <div className="divide-y divide-slate-100 space-y-4">
                {couponsToReview.map((c) => (
                  <div key={c.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-sans">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{c.brand}</span>
                        <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">{c.category}</span>
                      </div>
                      
                      <p className="text-slate-500 text-[11px]">
                        Code PIN: <span className="font-mono font-bold text-slate-800">{c.code}</span> | 
                        Seller: <span className="font-semibold text-slate-700">{c.sellerName}</span>
                      </p>

                      <p className="text-[11px] text-slate-400 italic">"{c.terms}"</p>
                      
                      <div className="flex items-center gap-3 pt-0.5 text-[10px] text-slate-500">
                        <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-mono">
                          Risk Index: <strong className={c.fraudScore > 10 ? 'text-amber-600' : 'text-emerald-600'}>{c.fraudScore}%</strong>
                        </span>
                        <span>Face Value: <strong>₹{c.discountValue}</strong></span>
                        <span>List Price: <strong>₹{c.price}</strong></span>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => onModerateCoupon(c.id, 'reject')}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3.5 py-2 rounded-xl text-[11px] cursor-pointer"
                      >
                        Reject Listing
                      </button>
                      
                      <button
                        onClick={() => onModerateCoupon(c.id, 'approve')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-2 rounded-xl text-[11px] shadow-sm cursor-pointer"
                      >
                        Approve Clearance
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Withdrawals queue */}
          <div className="bg-white p-5 border border-[#fed7aa]/40 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase text-amber-800 tracking-tight">
              2. UPI / Netbanking Withdrawals Wire Queue ({pendingWithdrawals.length})
            </h3>

            {pendingWithdrawals.length === 0 ? (
              <p className="text-[11px] text-slate-400 py-6 italic text-center">Payout withdrawal wire requests queue is currently empty.</p>
            ) : (
              <div className="divide-y divide-slate-100 space-y-4">
                {pendingWithdrawals.map((t) => (
                  <div key={t.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-sans">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-rose-600 text-sm">₹{t.amount.toLocaleString('en-IN')}.00</span>
                        <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Pending Wire</span>
                      </div>

                      <p className="text-slate-500 text-[11px] font-medium">
                        Request ID: <span className="font-mono font-bold">{t.id}</span> | 
                        Trader: <span className="font-bold text-slate-700">{t.sellerName}</span>
                      </p>

                      <p className="text-[11px] text-slate-400 font-mono">Date requested: {new Date(t.date).toLocaleString()}</p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => onModerateWithdrawal(t.id, 'reject')}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3.5 py-2 rounded-xl text-[11px] cursor-pointer"
                      >
                        Reject Wire
                      </button>

                      <button
                        onClick={() => onModerateWithdrawal(t.id, 'complete')}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3.5 py-2 rounded-xl text-[11px] shadow-sm cursor-pointer"
                      >
                        Wire Funds Completed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Management Ledger Registry */}
          <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-tight">
                  3. Peer Accounts Ledger Registry ({allUsers.length})
                </h3>
              </div>
              <span className="text-[9px] bg-indigo-50 text-indigo-600 font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">Click Row to Inspect Logs</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50/20">
              <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-black uppercase tracking-wider text-[9px] border-b border-slate-100">
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Kyc Clearance</th>
                    <th className="py-3 px-4 text-right">Escrow Balance</th>
                    <th className="py-3 px-4 text-right">Trade Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700 bg-white">
                  {allUsers.map((user) => {
                    const statusClass = user.kycStatus === 'verified' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50' 
                      : user.kycStatus === 'pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-100/50'
                        : 'bg-rose-50 text-rose-700 border-rose-100/50';

                    return (
                      <tr 
                        key={user.id} 
                        onClick={() => setSelectedUser(user)}
                        className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                        id={`user-row-${user.id}`}
                      >
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-xs select-none uppercase shadow-xs flex-shrink-0">
                            {user.name ? user.name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <span className="font-extrabold text-[#111827] block leading-tight">{user.name}</span>
                            <span className="text-[10px] text-slate-400 block font-normal leading-normal">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusClass}`}>
                            {user.kycStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                          ₹{(user.balance || 0).toLocaleString('en-IN')}.00
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-black text-indigo-650">
                          ₹{(user.totalTransactionVolume || 0).toLocaleString('en-IN')}.00
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Hand: Ledger Compliance Reports */}
        <div className="space-y-6">
          
          {/* DDL SQL panel */}
          <div className="bg-slate-900 text-slate-300 p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3.5 text-xs">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#a5b4fc] block">Persistent Data Model</span>
              <h3 className="font-extrabold text-white text-sm">PostgreSQL Schema (Supabase)</h3>
              <p className="text-[11px] text-slate-400 leading-normal mt-1">
                This applet contains real Express ledger logic that transfers wallet balances inside standard memory nodes. Use the DB schema DDL below to link this into live Supabase:
              </p>
            </div>

            <pre className="bg-slate-950 p-3 rounded-2xl text-[10px] text-[#cbd5e1] font-mono leading-relaxed overflow-x-auto border border-slate-800/70 max-h-40">
{`CREATE TYPE kyc_status AS ENUM ('unverified', 'pending', 'verified');
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  balance DECIMAL(15,2) DEFAULT 0
);`}
            </pre>
          </div>

          {/* Audit compiler */}
          <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-sm space-y-4">
            <div>
              <span className="text-[9px] font-black uppercase text-indigo-600 tracking-widest block font-mono">Ledger bookkeeping auditing</span>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">Compliance Report Generator</h3>
              <p className="text-[11px] text-slate-400 leading-normal mt-1">
                Retrieve a calculated mathematical settlement report, detailing marketplace volumes and Commission totals (10%).
              </p>
            </div>

            <button
              onClick={onTriggerAudit}
              disabled={auditLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{auditLoading ? 'Calculating books totals...' : 'Trigger Compliance Audit'}</span>
            </button>

            {auditReport && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl font-sans text-[11px] sm:text-xs leading-relaxed text-slate-600 max-h-56 overflow-y-auto font-medium whitespace-pre-line border-dashed">
                {auditReport}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* User Details Compliance Inspect Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs transition-opacity" id="user-inspect-modal">
          <div className="bg-white text-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl mx-4 p-6 border border-slate-100 relative max-h-[85vh] overflow-y-auto">
            
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Summary Header */}
            <div className="pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-black flex items-center justify-center text-xl select-none uppercase shadow-sm flex-shrink-0">
                  {selectedUser.name ? selectedUser.name.charAt(0) : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{selectedUser.name}</h3>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      selectedUser.role === 'admin' 
                        ? 'bg-rose-50 border-rose-100 text-rose-700' 
                        : 'bg-indigo-50 border-indigo-100 text-indigo-700'
                    }`}>
                      {selectedUser.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold">{selectedUser.email}</p>
                </div>
              </div>

              <div className="text-left sm:text-right font-mono">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Unique Member ID</span>
                <span className="text-xs font-black text-slate-600 select-all">{selectedUser.id}</span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 py-5 border-b border-slate-100">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Wallet Balance</span>
                <span className="text-lg font-mono font-black text-slate-800 mt-1 block">
                  ₹{(selectedUser.balance || 0).toLocaleString('en-IN')}.00
                </span>
              </div>

              <div className="bg-indigo-50/50 p-3.5 rounded-2xl tracking-tight border border-indigo-100/30 text-center">
                <span className="text-[9px] uppercase font-bold text-indigo-500 tracking-wider block">Total Tx Volume</span>
                <span className="text-lg font-mono font-black text-indigo-750 mt-1 block">
                  ₹{(selectedUser.totalTransactionVolume || 0).toLocaleString('en-IN')}.00
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">KYC Verification</span>
                <span className={`text-xs font-black uppercase tracking-widest mt-2 block ${
                  selectedUser.kycStatus === 'verified' 
                    ? 'text-emerald-600 font-extrabold' 
                    : selectedUser.kycStatus === 'pending'
                      ? 'text-amber-500 font-extrabold'
                      : 'text-rose-600 font-extrabold'
                }`}>
                  {selectedUser.kycStatus === 'verified' ? '✓ Verified' : selectedUser.kycStatus === 'pending' ? '⏳ Pending' : '⚠️ Unverified'}
                </span>
              </div>
            </div>

            {/* User Transactions Table history */}
            <div className="pt-5 space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-850 tracking-tight flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                Ledger Transaction History Logs ({selectedUser.transactions?.length || 0})
              </h4>

              {(!selectedUser.transactions || selectedUser.transactions.length === 0) ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400">No reported ledger transactions for this user.</span>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-100 max-h-48">
                  <table className="w-full text-left text-[11px] border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-black uppercase text-[8px] border-b border-slate-100 sticky top-0">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3 text-right">Fee</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono font-medium text-slate-600 bg-white">
                      {selectedUser.transactions.map((tx: any) => {
                        const styleType = tx.type === 'purchase' ? 'text-indigo-600' 
                          : tx.type === 'deposit' ? 'text-emerald-600 font-bold' 
                          : 'text-amber-600 font-bold';
                        return (
                          <tr key={tx.id} className="hover:bg-slate-50/50">
                            <td className="py-2 px-3 text-[10px] text-slate-400">{new Date(tx.date).toLocaleDateString()}</td>
                            <td className="py-2 px-3 font-sans font-bold capitalize">
                              <span className={styleType}>{tx.type}</span>
                              {tx.couponBrand && <span className="text-[10px] text-slate-400 block font-normal normal-case">{tx.couponBrand}</span>}
                            </td>
                            <td className="py-2 px-3 text-right text-slate-400">₹{tx.fee || 0}</td>
                            <td className="py-2 px-3 text-right text-slate-800 font-bold">₹{tx.amount || 0}</td>
                            <td className="py-2 px-3 text-center">
                              <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase font-sans ${
                                tx.status === 'completed' ? 'bg-emerald-50 text-emerald-700' 
                                : tx.status === 'pending' ? 'bg-amber-50 text-amber-700' 
                                : 'bg-rose-50 text-rose-700'
                              }`}>
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-6 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-colors"
              >
                Close Logs Directory
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
