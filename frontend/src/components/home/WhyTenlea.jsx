import React from 'react';
import { ShieldCheck, QrCode, Lock, FileCheck, Star, Wallet } from 'lucide-react';

export const WhyTenlea = () => {
  const features = [
    { title: 'Contactless QR Check-In', desc: 'No physical meeting required. Scan QR code to confirm entry and exit timestamp.', icon: QrCode },
    { title: 'Razorpay Escrow Protection', desc: 'Payments are locked in escrow and released fairly upon booking completion.', icon: Lock },
    { title: 'Instant Digital Agreements', desc: 'Auto-generated agreements containing clear terms, cancellation, and liability rules.', icon: FileCheck },
    { title: 'Mandatory KYC Verification', desc: 'Both landowners and drivers undergo strict identity and document verification.', icon: ShieldCheck },
    { title: 'Transparent Payouts', desc: 'Weekly direct settlements into Indian bank accounts with clear fee structures.', icon: Wallet },
    { title: 'Peer Ratings & Reviews', desc: 'Build trusted reputation with transparent user reviews and dispute support.', icon: Star },
  ];

  return (
    <section id="why-tenlea" className="py-24 bg-zinc-900 text-white border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full silver-badge">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
            Why Choose <span className="gradient-text-silver">TENLEA?</span>
          </h2>
          <p className="text-zinc-400 text-base">Eliminating brokers, unverified arrangements, and payment uncertainty.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-8 rounded-3xl card-silver-rim">
                <div className="p-4 rounded-2xl bg-zinc-950 text-slate-100 border border-slate-300/30 w-fit mb-6 shadow-silver-glow">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
