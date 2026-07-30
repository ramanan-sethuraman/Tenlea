import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Car, QrCode, ArrowRight, IndianRupee, CheckCircle2 } from 'lucide-react';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-zinc-950 overflow-hidden text-white min-h-[85vh] flex flex-col justify-center">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-800/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full silver-badge backdrop-blur-md"
            >
              <ShieldCheck className="w-4 h-4 text-slate-200" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-100">
                India’s Trusted Land & Parking Marketplace
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.15]"
            >
              Your Space. Their Vehicle. <br className="hidden sm:inline" />
              A <span className="gradient-text-silver">Trusted Connection.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-zinc-400 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Turn unused land into income and give vehicle owners a safe place to park. Direct digital agreements, QR check-in, and escrow payments.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                onClick={() => navigate('/find-parking')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl btn-silver-primary text-zinc-950 font-bold text-base flex items-center justify-center gap-3 group"
              >
                <Car className="w-5 h-5 text-zinc-950" />
                <span>Find Parking</span>
                <ArrowRight className="w-5 h-5 text-zinc-950 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl btn-silver-secondary text-slate-200 font-semibold text-base flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5 text-slate-300" />
                <span>List Your Space</span>
              </button>
            </motion.div>

            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-zinc-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-300" /> Verified KYC Landowners
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-300" /> Contactless QR Check-In
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-300" /> Escrow Protection
              </span>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="p-6 sm:p-8 rounded-3xl card-silver-rim">
              <div className="text-center mb-6">
                <div className="inline-block p-3 rounded-2xl bg-zinc-900 border border-slate-300/40 mb-3 shadow-silver-glow">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold font-display text-white">TENLEA Ecosystem</h3>
                <p className="text-xs text-zinc-400">Direct Landowner to Driver Matching</p>
              </div>

              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-slate-300/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-slate-300/30 flex items-center justify-center text-white font-bold">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-zinc-400 font-medium">Landowner</div>
                      <div className="text-sm font-semibold text-white">Monetize Open Space</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full silver-badge">
                    Earn Weekly
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-slate-300/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-slate-300/30 flex items-center justify-center text-white font-bold">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-zinc-400 font-medium">Vehicle Owner</div>
                      <div className="text-sm font-semibold text-white">Safe Long/Short Storage</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full silver-badge">
                    Book Instantly
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
