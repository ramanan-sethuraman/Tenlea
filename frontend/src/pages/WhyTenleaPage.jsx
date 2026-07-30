import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { WhyTenlea } from '../components/home/WhyTenlea';
import { ShieldCheck, ArrowRight, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WhyTenleaPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* Hero Header */}
      <div className="pt-32 pb-16 bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full silver-badge mb-4 inline-block">
            Platform Capabilities & Vision
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display mb-6">
            Why Choose <span className="gradient-text-silver">TENLEA</span>?
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Eliminating middleman brokers, unverified arrangements, and payment uncertainty 
            with India's first tech-driven land and parking marketplace.
          </p>
        </div>
      </div>

      {/* Main Features Grid Component */}
      <WhyTenlea />

      {/* TENLEA vs Traditional Broker Comparison */}
      <div className="py-24 bg-zinc-950 border-t border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full silver-badge">
              Clear Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
              TENLEA vs Traditional Brokers
            </h2>
            <p className="text-zinc-400 text-base">See how TENLEA modernizes parking and land leasing in India.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Traditional Method */}
            <div className="p-8 rounded-3xl bg-zinc-900/60 border border-red-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Traditional Brokers & Manual Leasing</h3>
                  <p className="text-xs text-zinc-400">High friction, insecure, broker commissions</p>
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-zinc-400">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span>High broker fees up to 1-2 months rent</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span>No identity verification or safety guarantees</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Manual paper agreements prone to disputes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Cash payments without receipt or escrow protection</span>
                </li>
              </ul>
            </div>

            {/* TENLEA Method */}
            <div className="p-8 rounded-3xl card-silver-rim bg-zinc-900">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">TENLEA Smart Marketplace</h3>
                  <p className="text-xs text-zinc-300">Direct, verified, digital escrow</p>
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-zinc-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                  <span>Zero broker commission & transparent pricing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                  <span>Mandatory Aadhaar/PAN KYC for both host & driver</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                  <span>Automated instant digital legal agreement</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                  <span>Razorpay Escrow with guaranteed weekly settlements</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-zinc-900 border-t border-zinc-800/80 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl font-extrabold font-display">Start Parking or Renting Land Today</h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            Get started in under 3 minutes with seamless identity verification.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/find-parking')}
              className="px-6 py-3.5 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs flex items-center gap-2"
            >
              <span>Explore Available Parking</span>
              <ArrowRight className="w-4 h-4 text-zinc-950" />
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3.5 rounded-xl btn-silver-secondary text-white font-bold text-xs"
            >
              Register Land / Car
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
