import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Search, ChevronDown, HelpCircle, MessageSquare, ShieldCheck, CreditCard, FileText } from 'lucide-react';

export const FaqPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIdx, setOpenIdx] = useState(0);

  const categories = ['All', 'KYC & Verification', 'Payments & Escrow', 'Agreements', 'Parking & Check-In'];

  const allFaqs = [
    {
      category: 'KYC & Verification',
      q: 'How does TENLEA verify landowners and vehicle owners?',
      a: 'All users must upload government-issued identity documents (Aadhaar Card, PAN Card, or Driving License) and complete selfie verification before listing properties or booking spaces.',
    },
    {
      category: 'KYC & Verification',
      q: 'How long does KYC approval take?',
      a: 'Our automated verification system processes most document submissions in under 10 minutes. In rare manual review cases, approval takes up to 2 hours.',
    },
    {
      category: 'Payments & Escrow',
      q: 'How does payment protection and Razorpay Escrow work?',
      a: 'When a vehicle owner books a space, funds are placed into Razorpay Escrow. Payouts are safely released to the landowner after booking activation and weekly settlement cycles.',
    },
    {
      category: 'Payments & Escrow',
      q: 'Are there hidden charges or extra commission fees?',
      a: 'No hidden charges. Landowners receive clear fee breakdowns for platform facilitation, with zero surprise deductions.',
    },
    {
      category: 'Agreements',
      q: 'What is included in the automated digital agreement?',
      a: 'Every confirmed booking generates a legally compliant digital agreement specifying check-in/out timestamps, monthly/daily rates, cancellation policy, security deposit terms, and property liability guidelines.',
    },
    {
      category: 'Agreements',
      q: 'Can I extend my parking rental contract?',
      a: 'Yes, vehicle owners can extend their active monthly or daily bookings directly through their dashboard before the current agreement expires.',
    },
    {
      category: 'Parking & Check-In',
      q: 'How does QR code check-in work at the location?',
      a: 'Upon arrival at the parking slot, the driver opens the TENLEA app or mobile web interface and scans the landowner property QR code to log entry.',
    },
    {
      category: 'Parking & Check-In',
      q: 'What happens if a vehicle stays beyond the booked date?',
      a: 'Overstay alerts are triggered automatically. Late fees and extended daily rates are charged via connected payment methods as per the digital agreement terms.',
    },
  ];

  const filteredFaqs = allFaqs.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* Hero Header */}
      <div className="pt-32 pb-16 bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full silver-badge mb-4 inline-block">
            Support & Help Center
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display mb-6">
            Frequently Asked <span className="gradient-text-silver">Questions</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Have questions about land leasing, parking bookings, payments, or security? 
            Find detailed answers below.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search questions or keywords (e.g. Escrow, KYC, Chennai, QR)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-900 border border-slate-300/30 text-white text-sm focus:outline-none focus:border-zinc-400 shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Main FAQ Content */}
      <div className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'btn-silver-primary text-zinc-950'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={idx} className="rounded-2xl card-silver-rim overflow-hidden">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between font-bold text-base sm:text-lg text-white hover:text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-3 pr-4">
                      <HelpCircle className="w-5 h-5 text-slate-300 shrink-0" />
                      <span>{faq.q}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-300 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-zinc-400 leading-relaxed border-t border-slate-300/20 pt-4">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-slate-300 inline-block mb-3">
                        {faq.category}
                      </span>
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
            <MessageSquare className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No matching questions found</h3>
            <p className="text-xs text-zinc-400">Try searching for broader terms or select another category above.</p>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};
