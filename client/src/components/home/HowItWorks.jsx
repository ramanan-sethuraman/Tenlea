import React, { useState } from 'react';
import { UserCheck, ImagePlus, BellRing, QrCode, LineChart, Wallet, Search, CalendarCheck, CreditCard, ShieldCheck } from 'lucide-react';

export const HowItWorks = () => {
  const [role, setRole] = useState('landowner');

  const landownerSteps = [
    { step: '01', title: 'Sign Up & Verify', desc: 'Create account and complete quick KYC verification.', icon: UserCheck },
    { step: '02', title: 'Add Land & Parking', desc: 'Upload images, set dimensions, pricing (daily/monthly), and security details.', icon: ImagePlus },
    { step: '03', title: 'Receive Bookings', desc: 'Get booking requests from verified drivers. Funds locked in escrow.', icon: BellRing },
    { step: '04', title: 'QR Check-In', desc: 'Driver scans your property QR code upon arrival to start session.', icon: QrCode },
    { step: '05', title: 'Digital Agreement', desc: 'Automated contract terms signed digitally between both parties.', icon: ShieldCheck },
    { step: '06', title: 'Weekly Payouts', desc: 'Get direct bank payouts with transparent fee breakdowns.', icon: Wallet },
  ];

  const vehicleSteps = [
    { step: '01', title: 'Register & KYC', desc: 'Create your account and register your vehicle details.', icon: UserCheck },
    { step: '02', title: 'Search Location', desc: 'Filter by city, pricing, vehicle type, CCTV, and amenities.', icon: Search },
    { step: '03', title: 'Request Booking', desc: 'Choose dates, review price breakdown, and submit booking.', icon: CalendarCheck },
    { step: '04', title: 'Make Payment', desc: 'Pay via Razorpay or demo escrow mode securely.', icon: CreditCard },
    { step: '05', title: 'QR Check-In', desc: 'Scan QR at location to confirm arrival and log session.', icon: QrCode },
    { step: '06', title: 'Park With Peace', desc: 'Track booking history, extend dates, and leave reviews.', icon: ShieldCheck },
  ];

  const currentSteps = role === 'landowner' ? landownerSteps : vehicleSteps;

  return (
    <section id="how-it-works" className="py-24 bg-zinc-950 text-white relative border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full silver-badge">
            Simple 6-Step Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
            How <span className="gradient-text-silver">TENLEA</span> Works
          </h2>
          <p className="text-zinc-400 text-base">Select your journey below to explore the simple step-by-step process.</p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="p-1.5 rounded-2xl bg-zinc-900 border border-slate-300/30 flex items-center gap-2 shadow-silver-inner">
            <button
              onClick={() => setRole('landowner')}
              className={`px-6 py-3 rounded-xl font-bold text-xs transition-all ${
                role === 'landowner'
                  ? 'btn-silver-primary text-zinc-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Landowners (Rent Space)
            </button>
            <button
              onClick={() => setRole('vehicle')}
              className={`px-6 py-3 rounded-xl font-bold text-xs transition-all ${
                role === 'vehicle'
                  ? 'btn-silver-primary text-zinc-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Vehicle Owners (Find Parking)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-8 rounded-3xl card-silver-rim">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-extrabold text-slate-300">{item.step}</span>
                  <div className="p-3 rounded-2xl bg-zinc-900 text-slate-200 border border-slate-300/30 shadow-silver-glow">
                    <Icon className="w-6 h-6" />
                  </div>
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
