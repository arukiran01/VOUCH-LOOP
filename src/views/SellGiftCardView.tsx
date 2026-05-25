import React, { useState } from 'react';
import { 
  Upload, 
  HelpCircle, 
  Calculator, 
  CheckCircle, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { User } from '../types';

interface SellGiftCardViewProps {
  sessionUser: User | null;
  uploadForm: {
    brand: string;
    category: string;
    discountType: 'flat' | 'percentage';
    discountValue: string;
    price: string;
    expiryDate: string;
    terms: string;
    code: string;
  };
  setUploadForm: React.Dispatch<React.SetStateAction<any>>;
  submittingCoupon: boolean;
  ocrScanning: boolean;
  ocrFilename: string;
  predictedPrice: number | null;
  predictionReason: string;
  predictionDemand: number | null;
  priceCalculating: boolean;
  onPriceCalculator: () => void;
  onBarcodeMockDrop: (brandChoice: string) => void;
  onSubmitListing: (e: React.FormEvent) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const renderBrandLogo = (brandName: string) => {
  const normalized = brandName ? brandName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
  
  if (normalized.includes('amazon')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#111] border border-zinc-805 flex flex-col items-center justify-center select-none flex-shrink-0 shadow-sm relative overflow-hidden">
        <span className="text-[7.5px] text-white tracking-tight font-sans leading-none font-black lowercase">amazon</span>
        <svg className="w-4 h-1 text-[#FF9900] mt-0.5" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 1.5C5 5.5 19 5.5 22 1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M21 0.8L23 2.5L20 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  
  if (normalized.includes('swiggy')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9F33] to-[#FF5600] border border-orange-400/25 flex items-center justify-center select-none flex-shrink-0 shadow-sm relative overflow-hidden animate-none">
        <svg className="w-3 h-4.5 text-white" viewBox="0 0 16 24" fill="currentColor">
          <path d="M4 20C4 20 1 18 1 15C1 12 5 11 5 8C5 5 1 4 1 2C1 0 4 0 7 2C10 4 14 6 14 9C14 12 11 14 11 17C11 20 14 21 14 23C11 23 8 22 4 20Z" fillRule="evenodd" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('myntra')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-white border border-rose-100 flex items-center justify-center font-black select-none flex-shrink-0 shadow-xs relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FF3366] via-[#FF8833] to-[#AA33FF] opacity-10" />
        <span className="text-[11px] font-black tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-tr from-[#E61C5D] via-[#FF5F1F] to-[#8F00FF] scale-y-115">M</span>
      </div>
    );
  }

  if (normalized.includes('bookmyshow') || normalized.includes('bms')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#df1827] border border-red-540/25 flex flex-col items-center justify-center text-white select-none flex-shrink-0 shadow-sm">
        <span className="text-[6px] uppercase font-mono font-black tracking-tight leading-none text-red-100">BOOK</span>
        <span className="text-[6px] uppercase font-black tracking-widest leading-none mt-0.5 text-zinc-100">SHOW</span>
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-black text-xs select-none flex-shrink-0 shadow-xs">
      {brandName.charAt(0).toUpperCase()}
    </div>
  );
};

export default function SellGiftCardView({
  sessionUser,
  uploadForm,
  setUploadForm,
  submittingCoupon,
  ocrScanning,
  ocrFilename,
  predictedPrice,
  predictionReason,
  predictionDemand,
  priceCalculating,
  onPriceCalculator,
  onBarcodeMockDrop,
  onSubmitListing,
  showToast
}: SellGiftCardViewProps) {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUploadForm((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 font-sans">
      
      {/* Page description */}
      <div className="flex flex-col border-b border-zinc-200 pb-5">
        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Sellers Hub</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Post Your Unused Gift Cards</h1>
        <p className="text-xs text-slate-500 mt-1">
          Convert store vouchers, coupon PINs, or cashback slips to available wallet balance securely.
        </p>
      </div>

      {sessionUser?.kycStatus !== 'verified' && (
        <div className="bg-amber-50/50 border border-amber-200 p-4.5 rounded-2xl flex gap-3 text-amber-800 text-xs text-left" id="kyc-warning">
          <AlertCircle className="w-4.5 h-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 font-medium">
            <span className="font-extrabold text-amber-900 block">Sellers KYC Clearance Required</span>
            <p className="text-amber-700 leading-relaxed font-normal">
              Voucher posting is locked because your profile identity is unverified. Please instantly activate KYC check from your Profile settings (avatar top-right) to start trading!
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Form Inputs */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/60 space-y-6 text-left">
          <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Listing Specifications</h2>

          <form onSubmit={onSubmitListing} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                  Brand Name <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  name="brand"
                  placeholder="e.g. Amazon Pay, Swiggy Food"
                  value={uploadForm.brand}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                  Voucher Category <span className="text-rose-500">*</span>
                </label>
                <select 
                  name="category"
                  value={uploadForm.category}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-50 border border-zinc-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 font-semibold cursor-pointer"
                >
                  <option value="Shopping">Shopping</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Subscription">Subscription</option>
                  <option value="Health">Health</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-1 bg-zinc-50 border border-zinc-200 p-0.5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setUploadForm((prev: any) => ({ ...prev, discountType: 'flat' }))}
                    className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      uploadForm.discountType === 'flat' 
                        ? 'bg-white text-indigo-700 shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    ₹ Flat
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadForm((prev: any) => ({ ...prev, discountType: 'percentage' }))}
                    className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      uploadForm.discountType === 'percentage' 
                        ? 'bg-white text-indigo-700 shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    % Percent
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                  Face Value <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="number"
                  name="discountValue"
                  placeholder={uploadForm.discountType === 'flat' ? 'e.g. 500' : 'e.g. 30'}
                  value={uploadForm.discountValue}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                  Selling Price (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input 
                  type="number"
                    name="price"
                    placeholder="e.g. 350"
                    value={uploadForm.price}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 font-medium pl-6"
                  />
                  <span className="absolute left-2.5 top-3 text-slate-400 font-bold text-xs select-none">₹</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                  Voucher / PIN Code <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  name="code"
                  placeholder="e.g. AMZN-INR1000-PEER"
                  value={uploadForm.code}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                  Voucher Expiry Date <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="date"
                  name="expiryDate"
                  value={uploadForm.expiryDate}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 text-[#1f2937] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                Redeem Terms & Guidelines
              </label>
              <textarea 
                name="terms"
                rows={3}
                placeholder="e.g. Valid on official store cart checkout. Apply code inside payments panel."
                value={uploadForm.terms}
                onChange={handleInputChange}
                className="w-full bg-zinc-50 border border-zinc-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 font-medium"
              />
            </div>

            {/* Price estimation advisor */}
            <div className="flex justify-between items-center pt-3 gap-4 border-t border-zinc-100">
              <span className="text-[10px] text-slate-400 block font-normal leading-relaxed max-w-xs">
                Your code is fully encrypted on server records and visible ONLY to the buyer after trade holds.
              </span>
              <button
                type="button"
                onClick={onPriceCalculator}
                disabled={priceCalculating}
                className="bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 disabled:opacity-50"
              >
                <Calculator className="w-4 h-4 text-indigo-600" />
                <span>Calculate Rate</span>
              </button>
            </div>

            {/* Form Submit listing */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submittingCoupon || sessionUser?.kycStatus !== 'verified'}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {submittingCoupon ? 'Settle list configuration...' : 'Publish Discount Voucher'}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: OCR Receipt parsing simulator */}
        <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-200/60 flex flex-col justify-between text-left h-fit min-h-[380px] space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Fast Receipt Parser</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Click any coupon template voucher below to simulate our automatic receipt parser scanning the digital invoice and auto-filling the specifications.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {(['Amazon', 'Swiggy', 'Myntra', 'BookMyShow'] as const).map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => onBarcodeMockDrop(brand)}
                  disabled={ocrScanning}
                  className="bg-white border border-zinc-200/80 hover:border-indigo-500 hover:shadow-xs p-3 rounded-2xl text-left transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2.5 h-18 text-slate-800"
                >
                  {renderBrandLogo(brand)}
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[11px] font-bold text-slate-800 tracking-wide block leading-none truncate">{brand}</span>
                    <span className="text-[9px] text-zinc-400 mt-1 block leading-none">Parse slip 📄</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Loader or pricing diagnostics */}
          {ocrScanning ? (
            <div className="p-4 bg-white border border-zinc-200/60 rounded-2xl text-center space-y-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block animate-ping" />
              <p className="text-[11px] font-bold text-slate-700">Analyzing OCR barcode signatures...</p>
              <p className="text-[10px] text-slate-400 truncate">{ocrFilename}</p>
            </div>
          ) : predictedPrice !== null ? (
            <div className="p-4.5 bg-zinc-900 text-white rounded-2xl border border-zinc-800 space-y-3 font-sans text-xs">
              <div className="flex justify-between items-center bg-zinc-850 p-2 rounded-xl">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Pricing Advisor</span>
                <span className="font-bold text-indigo-400">₹{predictedPrice} Suggested</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-normal">
                {predictionReason || "Calculated optimal exchange index based on baseline card metrics."}
              </p>
              {predictionDemand !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase">Demand Strength:</span>
                  <span className="text-[11px] font-black text-emerald-500">{predictionDemand}/100</span>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-zinc-200/60 border-dashed rounded-2xl p-6 text-center space-y-2.5 bg-white shadow-inner flex flex-col justify-center items-center py-8">
              <Upload className="w-8 h-8 text-zinc-300" />
              <h4 className="text-xs font-bold text-slate-700">Parsing Simulator Ready</h4>
              <p className="text-[10px] text-slate-400 leading-normal max-w-[140px] mx-auto">Click any recipe template slot above to parser metadata.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
