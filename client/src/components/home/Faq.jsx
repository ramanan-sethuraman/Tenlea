import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const Faq = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How does TENLEA verify landowners and vehicle owners?',
      a: 'All users must submit government identity documents (Aadhaar/PAN/DL) and selfies for KYC verification before creating listings or booking spaces.',
    },
    {
      q: 'How does payment protection work?',
      a: 'Payments are held securely in Razorpay Escrow. Landowners are paid out weekly upon successful booking execution.',
    },
    {
      q: 'What is the digital agreement?',
      a: 'After a booking is accepted, TENLEA generates a digital contract with dates, rates, liability clauses, and cancellation rules signed digitally by both parties.',
    },
    {
      q: 'How does QR check-in work?',
      a: 'Upon arriving at the parking space, the driver scans the landowner’s property QR code to log the official check-in timestamp.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-zinc-900 text-white border-t border-zinc-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full silver-badge">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
            Frequently Asked <span className="gradient-text-silver">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="rounded-2xl card-silver-rim overflow-hidden">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between font-bold text-base sm:text-lg text-white hover:text-slate-200 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-zinc-400 leading-relaxed border-t border-slate-300/20 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
