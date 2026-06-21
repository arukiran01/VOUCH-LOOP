import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ShieldCheck, FileText, CheckCircle, AlertCircle, UploadCloud } from 'lucide-react';
import { motion } from 'motion/react';

export default function KYCVerification() {
  const { user, updateKycStatus, addNotification } = useAppContext();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is not logged in, redirect
  if (!user) {
    navigate('/');
    return null;
  }

  // If user is already verified or pending
  if (user.kycStatus === 'verified' || user.kycStatus === 'pending') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 overflow-hidden relative"
        >
          {user.kycStatus === 'verified' && (
             <motion.div 
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 pointer-events-none"
               animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             />
          )}
          {user.kycStatus === 'pending' && (
             <motion.div 
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 pointer-events-none"
               animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
             />
          )}

          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ${user.kycStatus === 'verified' ? 'bg-gradient-to-br from-green-100 to-green-50 text-green-500 border border-green-100' : 'bg-gradient-to-br from-teal-100 to-teal-50 text-teal-600 border border-teal-100'}`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            >
              {user.kycStatus === 'verified' ? <CheckCircle className="w-12 h-12" /> : <ShieldCheck className="w-12 h-12" />}
            </motion.div>
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight"
          >
            {user.kycStatus === 'verified' ? 'Identity Verified' : 'Verification Under Review'}
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed"
          >
            {user.kycStatus === 'verified' 
              ? 'Your identity has been successfully authenticated. You now have full access to our Secure Escrow P2P platform.' 
              : 'Your documents have been submitted securely and are being verified. This usually takes between 2-4 hours.'}
          </motion.p>
          
          <motion.button 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => navigate('/stores')} 
            className="bg-teal-600 shadow-xl shadow-teal-600/20 text-white px-10 py-4 rounded-full font-bold hover:bg-teal-700 transition"
          >
            Continue to Marketplace
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!panNumber.trim() || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
        setError('Please enter a valid PAN number (e.g., ABCDE1234F).');
        return;
      }
    } else if (step === 2) {
      if (!aadhaarNumber.trim() || !/^\d{12}$/.test(aadhaarNumber)) {
        setError('Please enter a valid 12-digit Aadhaar number.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to Supabase / verification provider
    setTimeout(() => {
      setIsSubmitting(false);
      updateKycStatus('pending');
      addNotification({
        title: "KYC Pending",
        desc: "Your identity verification documents have been submitted and are pending review.",
        type: "kyc"
      });
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Identity Verification</h1>
        <p className="text-gray-500 mt-2">Complete your KYC to securely buy and sell vouchers</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Progress Bar */}
        <div className="flex border-b border-gray-100 relative">
          <motion.div 
            className="absolute bottom-0 left-0 h-0.5 bg-teal-500 transition-all duration-300" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
          <div className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${step >= 1 ? 'text-teal-600 bg-teal-50/30' : 'text-gray-400'}`}>
            1. PAN Details
          </div>
          <div className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${step >= 2 ? 'text-teal-600 bg-teal-50/30' : 'text-gray-400'}`}>
            2. Aadhaar Details
          </div>
          <div className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${step >= 3 ? 'text-teal-600 bg-teal-50/30' : 'text-gray-400'}`}>
            3. Document Upload
          </div>
        </div>

        <div className="p-8 relative min-h-[400px]">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-start gap-3 border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-teal-600" />
                <h3 className="text-xl font-bold text-gray-800">Verify your PAN</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">We need your PAN to ensure secure peer-to-peer transactions and comply with government regulations.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Account Number (PAN)</label>
                  <input 
                    type="text" 
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none uppercase font-mono tracking-wider"
                  />
                </div>
              </div>
              
              <button 
                onClick={handleNext}
                className="w-full bg-teal-600 text-white font-bold py-3 mt-8 rounded-xl hover:bg-teal-700 transition shadow-lg shadow-teal-600/20"
              >
                Verify & Proceed
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 p-8">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-6 h-6 text-teal-600" />
                <h3 className="text-xl font-bold text-gray-800">Verify your Aadhaar</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">Your Aadhaar links your identity to your profile for fraud prevention.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">12-Digit Aadhaar Number</label>
                  <input 
                    type="text" 
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="XXXX XXXX XXXX"
                    maxLength={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-mono tracking-wider text-center text-lg"
                  />
                </div>
              </div>

               <div className="flex gap-4 mt-8">
                 <button 
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleNext}
                    className="w-2/3 bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition shadow-lg shadow-teal-600/20"
                  >
                    Verify & Proceed
                  </button>
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 p-8">
               <div className="flex items-center gap-3 mb-6">
                <UploadCloud className="w-6 h-6 text-teal-600" />
                <h3 className="text-xl font-bold text-gray-800">Upload Documents</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">Please upload a clear picture of your Aadhaar card (Front) to complete the process.</p>
              
              <div className="border-2 border-dashed border-teal-200 bg-teal-50 rounded-xl p-8 text-center mb-8 cursor-pointer hover:bg-teal-100 transition-colors group">
                <motion.div whileHover={{ y: -5 }} className="inline-block">
                  <UploadCloud className="w-12 h-12 text-teal-500 mx-auto mb-3 group-hover:text-teal-600 transition-colors" />
                </motion.div>
                <p className="text-teal-800 font-medium mb-1">Click to upload Aadhaar front image</p>
                <p className="text-xs text-teal-600">JPG, PNG or PDF (Max 5MB)</p>
              </div>

               <div className="flex gap-4">
                 <button 
                    onClick={() => setStep(2)}
                    className="w-1/3 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="relative w-2/3 bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition flex items-center justify-center disabled:opacity-80 overflow-hidden"
                  >
                    {isSubmitting ? (
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: "100%" }} 
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 bg-teal-500"
                      />
                    ) : null}
                    <span className="relative z-10">{isSubmitting ? 'Verifying securely...' : 'Submit KYC Details'}</span>
                  </button>
               </div>
            </motion.div>
          )}

        </div>
      </div>
      
      <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
        <ShieldCheck className="w-3 h-3" /> 256-bit bank-grade encryption. Your data is never shared.
      </p>
    </div>
  );
}
