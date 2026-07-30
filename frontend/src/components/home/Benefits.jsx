import React from 'react';
import { MapPin, Car, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Benefits = () => {
  const navigate = useNavigate();

  return (
    <section id="benefits" className="py-24 bg-zinc-950 text-white relative border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Benefits for Landowners */}
          <div className="p-8 sm:p-10 rounded-3xl card-silver-rim">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-slate-300/30 text-white flex items-center justify-center mb-6 shadow-silver-glow">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-2">Benefits for Landowners</h3>
            <p className="text-sm text-zinc-400 mb-6">Turn vacant plots, driveways, and open land into recurring income.</p>
            
            <ul className="space-y-3 text-sm text-zinc-300 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-300" /> Earn steady monthly/daily passive income
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-300" /> Full control over availability & pricing
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-300" /> Verified drivers with KYC & registration checks
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-300" /> Automated digital agreements & security deposit protection
              </li>
            </ul>

            <button
              onClick={() => navigate('/register')}
              className="w-full py-3.5 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs flex items-center justify-center gap-2"
            >
              <span>List Your Property</span>
              <ArrowRight className="w-4 h-4 text-zinc-950" />
            </button>
          </div>

          {/* Benefits for Vehicle Owners */}
          <div className="p-8 sm:p-10 rounded-3xl card-silver-rim">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-slate-300/30 text-white flex items-center justify-center mb-6 shadow-silver-glow">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-2">Benefits for Vehicle Owners</h3>
            <p className="text-sm text-zinc-400 mb-6">Safe, verified parking for short-term or long-term vehicle storage.</p>
            
            <ul className="space-y-3 text-sm text-zinc-300 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-300" /> Affordable storage when moving abroad or traveling
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-300" /> Verified hosts with CCTV & gated options
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-300" /> Instant QR check-in & digital receipt agreements
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-300" /> Escrow payments protected until checkout
              </li>
            </ul>

            <button
              onClick={() => navigate('/find-parking')}
              className="w-full py-3.5 rounded-xl btn-silver-secondary text-slate-200 font-bold text-xs flex items-center justify-center gap-2"
            >
              <span>Find Parking Near You</span>
              <ArrowRight className="w-4 h-4 text-slate-200" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
