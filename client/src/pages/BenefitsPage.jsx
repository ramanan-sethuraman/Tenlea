import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Benefits } from '../components/home/Benefits';
import { Wallet, Calculator, ArrowRight, Shield, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BenefitsPage = () => {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState(2);
  const [dailyRate, setDailyRate] = useState(250);

  const estimatedMonthlyIncome = spaces * dailyRate * 25; // assuming 25 days occupancy

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* Hero Header */}
      <div className="pt-32 pb-16 bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full silver-badge mb-4 inline-block">
            Value Proposition & ROI
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display mb-6">
            TENLEA <span className="gradient-text-silver">Benefits</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you own vacant land or drive a vehicle in urban India, 
            TENLEA creates tangible financial rewards, security, and peace of mind.
          </p>
        </div>
      </div>

      {/* Benefits Overview Component */}
      <Benefits />

      {/* Interactive Landowner Earnings Calculator */}
      <div className="py-24 bg-zinc-900 border-t border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl card-silver-rim">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-zinc-950 text-white border border-slate-300/30">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-display text-white">Landowner Earnings Estimator</h3>
                <p className="text-xs text-zinc-400">Estimate monthly income from renting out vacant parking slots.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  Number of Parking Slots Available: <span className="text-white font-extrabold">{spaces}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={spaces}
                  onChange={(e) => setSpaces(Number(e.target.value))}
                  className="w-full accent-white bg-zinc-950 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  Expected Daily Slot Rate (₹): <span className="text-white font-extrabold">₹{dailyRate}</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(Number(e.target.value))}
                  className="w-full accent-white bg-zinc-950 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950 border border-slate-300/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-zinc-400 block font-semibold">Estimated Monthly Passive Income</span>
                <span className="text-3xl font-extrabold text-white">₹{estimatedMonthlyIncome.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-zinc-400 block mt-0.5">*Based on ~80% occupancy (25 days/mo)</span>
              </div>

              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3.5 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs flex items-center gap-2 shrink-0"
              >
                <span>List Property & Start Earning</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
