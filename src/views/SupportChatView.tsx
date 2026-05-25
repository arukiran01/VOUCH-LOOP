import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Mail, Phone, MapPin, Search } from 'lucide-react';
import { ChatMessage } from '../types';

interface SupportChatViewProps {
  chatMessages?: ChatMessage[];
  chatInput?: string;
  setChatInput?: (val: string) => void;
  chatLoading?: boolean;
  onPostMessage?: (e: React.FormEvent) => void;
  chatEndRef?: React.RefObject<HTMLDivElement | null>;
}

export default function SupportChatView({}: SupportChatViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    {
      title: "Escrow & Purchases",
      faqs: [
        {
          q: "How does the VouchLoop Escrow Secure Hold protect me?",
          a: "When you buy a gift card or voucher, your payment is placed in a neutral, secure Escrow Lock. The coupon secret code is instantly revealed to you. The seller does not receive the funds until you have had ample time to verify and claim the voucher code on the respective platform and the system settles the ledger securely."
        },
        {
          q: "What should I do if a purchased voucher code does not work?",
          a: "If a voucher code is invalid, you can click on the 'Report Issue / Raise Dispute' button in your Wallet/Claims section. This will freeze the Escrow settlement payout immediately. Our compliance ledger team will examine the listing history and resolve the conflict within 24 working hours."
        },
        {
          q: "Is there a guarantee that the coupons sold are valid?",
          a: "Yes. All listed coupons go through our strict compliance engine. High-risk coupons are flagged or rejected prior to listing, and the Escrow protection system ensures you never lose money on invalid vouchers."
        }
      ]
    },
    {
      title: "Selling & Vouchers",
      faqs: [
        {
          q: "What is the fee for selling an unused gift card?",
          a: "Listing vouchers is completely free! We charge a fixed 10% platform settlement fee strictly upon successful sales. If your voucher is not sold, you pay ₹0. There are absolutely no hidden list charges."
        },
        {
          q: "How are exchange discount recommendations calculated?",
          a: "We compute optimized fair market price values using a mathematical pricing index. This checks the historical demand of the retail brand, voucher category, expiration buffer, and absolute flat/percentage value to maximize your chance of a quick, high-yield checkout."
        },
        {
          q: "What formats can I upload for coupon verification?",
          a: "You can upload flat codes, pin details, or use our digital photo upload feature. Our server parses valid vouchers securely to prevent duplication and listing errors."
        }
      ]
    },
    {
      title: "Wallet & P2P Ledger",
      faqs: [
        {
          q: "How do I withdraw my active wallet balance?",
          a: "You can initiate a bank wire transfer or instant UPI payout request directly from the Wallet View. Payout clearances require verified KYC status, and standard payouts are cleared instantly."
        },
        {
          q: "How does Peer-to-Peer (P2P) direct wallet transfer work?",
          a: "VouchLoop provides a seamless, zero-tariff internal transfer system. You can instantly move wallet funds to any other user's balance on VouchLoop by supplying their registered email address."
        },
        {
          q: "Is there a limit on standard wallet wallet deposits?",
          a: "Unverified accounts can hold up to ₹1,000. Undergoing compliance verification (KYC status check) removes all limits, allowing enterprise or high-volume corporate voucher transfers."
        }
      ]
    },
    {
      title: "Account & KYC Compliance",
      faqs: [
        {
          q: "Why is KYC verification mandatory?",
          a: "To prevent multi-account voucher duplication fraud and preserve escrow security, standard financial rules require brief KYC verification. Undergoing KYC unlocks unrestricted bank withdrawals and instant P2P corporate ledger credits."
        },
        {
          q: "How long does it take to verify my profile?",
          a: "Preselling verification takes under 5 minutes. Select the 'Edit Profile / Verify KYC' options from the top navigation drop-down menu to get automated verification clearances."
        }
      ]
    }
  ];

  // Flatten FAQs for search
  const allFaqs = categories.reduce((acc, cat, catIdx) => {
    cat.faqs.forEach((faq, faqIdx) => {
      acc.push({
        ...faq,
        category: cat.title,
        globalIndex: catIdx * 100 + faqIdx
      });
    });
    return acc;
  }, [] as Array<{ q: string, a: string, category: string, globalIndex: number }>);

  const filteredFaqs = searchQuery.trim() === ''
    ? allFaqs
    : allFaqs.filter(faq =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const toggleAccordion = (globalIdx: number) => {
    setOpenIndex(openIndex === globalIdx ? null : globalIdx);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8" id="vouchloop-support-root">
      
      {/* Page Header */}
      <div className="flex flex-col border-b border-slate-100 pb-6 text-center sm:text-left">
        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full w-max mx-auto sm:mx-0">
          Corporate Support Desk
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
          Compliance & FAQ Directory
        </h1>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Need assistance with escrow settlements, P2P wallet ledger transfers, or voucher verification? Find instant answers in our system rules directory.
        </p>
      </div>

      {/* Internal Interactive Search Bar */}
      <div className="relative">
        <div className="relative">
          <input 
            type="text"
            placeholder="Search our rules directory... (e.g. escrow, payouts, fees, KYC)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 text-xs pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
            id="faq-search-input"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Corporate Help Desk Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Support contacts sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-5 rounded-3xl text-white shadow-md border border-indigo-950">
            <h3 className="text-[10px] font-black uppercase text-indigo-200 tracking-wider">Official Contacts</h3>
            <p className="text-[11px] text-indigo-100 mt-2 leading-relaxed">
              For active billing disputes and legal escalations, reach our physical compliance node directly.
            </p>
            
            <div className="mt-4 space-y-3.5 text-[11px] font-medium">
              <div className="flex items-start gap-2 text-indigo-200">
                <Mail className="w-4 h-4 text-amber-400 mt-0.5" />
                <span className="break-all">support@vouchloop.com</span>
              </div>
              <div className="flex items-start gap-2 text-indigo-200">
                <Phone className="w-4 h-4 text-amber-400 mt-0.5" />
                <span>+91 (11) 4059-3990</span>
              </div>
              <div className="flex items-start gap-2 text-indigo-200">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5" />
                <span className="leading-tight">Udyog Vihar Phase IV, Gurugram, HR, India</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl">
            <span className="text-[10px] font-black text-emerald-950 uppercase block tracking-wider">Escrow Ledger Status</span>
            <p className="leading-relaxed text-[10px] font-medium text-emerald-700 mt-2">
              All transactions remain fully protected under continuous 256-bit encryption. Settlements require clear matching criteria before final approval.
            </p>
          </div>
        </div>

        {/* FAQs list accordion */}
        <div className="md:col-span-3 space-y-6">
          {searchQuery.trim() === '' ? (
            // Grouped Category View
            categories.map((cat, catIdx) => {
              const matches = cat.faqs.filter(faq => {
                const globalIdx = catIdx * 100 + cat.faqs.indexOf(faq);
                return true; // when no search query
              });

              if (matches.length === 0) return null;

              return (
                <div key={catIdx} className="space-y-3">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest border-l-2 border-indigo-500 pl-2.5">
                    {cat.title}
                  </h3>

                  <div className="space-y-2.5">
                    {cat.faqs.map((faq, faqIdx) => {
                      const globalIdx = catIdx * 100 + faqIdx;
                      const isOpen = openIndex === globalIdx;

                      return (
                        <div 
                          key={faqIdx}
                          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200"
                        >
                          <button
                            onClick={() => toggleAccordion(globalIdx)}
                            className="w-full text-left p-4 sm:p-5 flex justify-between items-start gap-4 hover:bg-slate-50/50 cursor-pointer"
                            id={`faq-btn-${globalIdx}`}
                          >
                            <span className="text-xs font-bold text-slate-800 leading-snug">
                              {faq.q}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="px-5 pb-5 pt-0 border-t border-slate-50">
                              <p className="text-xs text-slate-600 leading-relaxed font-medium pt-3.5 whitespace-pre-wrap">
                                {faq.a}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            // Flat Search Result View
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">
                Search Results ({filteredFaqs.length})
              </h3>

              {filteredFaqs.length > 0 ? (
                <div className="space-y-2.5">
                  {filteredFaqs.map((faq, idx) => {
                    const isOpen = openIndex === faq.globalIndex;

                    return (
                      <div 
                        key={idx}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200"
                      >
                        <button
                          onClick={() => toggleAccordion(faq.globalIndex)}
                          className="w-full text-left p-4 sm:p-5 flex justify-between items-start gap-4 hover:bg-slate-50/50 cursor-pointer"
                          id={`faq-btn-search-${idx}`}
                        >
                          <div className="flex flex-col gap-1 items-start">
                            <span className="text-[9px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                              {faq.category}
                            </span>
                            <span className="text-xs font-bold text-slate-800 leading-snug mt-1.5">
                              {faq.q}
                            </span>
                          </div>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-0 border-t border-slate-50">
                            <p className="text-xs text-slate-600 leading-relaxed font-medium pt-3.5 whitespace-pre-wrap">
                              {faq.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <span className="text-slate-400 text-sm font-semibold block">No matching questions found</span>
                  <span className="text-[11px] text-slate-400 block mt-1">Try searching active terms like 'escrow', 'fees', or 'UPI'</span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
