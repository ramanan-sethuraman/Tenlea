import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HowItWorks } from '../components/home/HowItWorks';
import { ArrowRight, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HowItWorksPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* Hero Header */}
      <div className="pt-32 pb-16 bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full silver-badge mb-4 inline-block">
            Complete Workflow Guide
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display mb-6">
            How <span className="gradient-text-silver">TENLEA</span> Works
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover how TENLEA connects landowners with vehicle owners through a seamless, 
            KYC-verified 6-step digital process with escrow payment protection.
          </p>
        </div>
      </div>

      {/* Interactive Step-by-Step Component */}
      <HowItWorks />

      {/* Trust & Safety Banner */}
      <div className="py-20 bg-zinc-900 border-t border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl card-silver-rim flex flex-col items-center text-center">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-slate-300/30 text-white mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Government ID Verification</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every host and driver is verified with Aadhaar, PAN, or Driving License before any transaction occurs.
              </p>
            </div>

            <div className="p-6 rounded-3xl card-silver-rim flex flex-col items-center text-center">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-slate-300/30 text-white mb-4">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Automated Check-In QR</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Scan property QR codes upon arrival to record entry timestamp and generate verifiable check-in logs.
              </p>
            </div>

            <div className="p-6 rounded-3xl card-silver-rim flex flex-col items-center text-center">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-slate-300/30 text-white mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Digital Legally-Binding Contracts</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Automated legal agreements outlining rate, duration, cancellation policies, and liability protections.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
