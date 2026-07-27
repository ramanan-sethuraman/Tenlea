import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/home/Hero';
import { Footer } from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle, ShieldCheck, Layers, Award, MapPin } from 'lucide-react';

export const LandingPage = () => {
  const portalCards = [
    {
      title: 'How TENLEA Works',
      desc: 'Explore the 6-step digital process for landowners and vehicle owners from signup to automated QR check-in.',
      path: '/how-it-works',
      icon: Layers,
      tag: 'Step-By-Step Workflow',
    },
    {
      title: 'Why TENLEA',
      desc: 'Learn how TENLEA eliminates brokers, guarantees Razorpay escrow payments, and enforces mandatory KYC.',
      path: '/why-tenlea',
      icon: ShieldCheck,
      tag: 'Platform Advantages',
    },
    {
      title: 'Benefits',
      desc: 'Discover financial rewards for landowners and reliable, secure long-term/short-term parking for drivers.',
      path: '/benefits',
      icon: Award,
      tag: 'ROI & Savings',
    },
    {
      title: 'FAQ & Support',
      desc: 'Got questions about agreements, escrow, verification, or parking limits? Find instant answers.',
      path: '/faq',
      icon: HelpCircle,
      tag: '24/7 Help Center',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      {/* Main Hero Banner */}
      <Hero />

      {/* Explore Portals Section */}
      <section className="py-24 bg-zinc-900 border-t border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full silver-badge">
              Discover Platform Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
              Everything You Need to Know About <span className="gradient-text-silver">TENLEA</span>
            </h2>
            <p className="text-zinc-400 text-base">
              Navigate directly to detailed guides, platform security specs, earnings estimation, and frequently asked questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {portalCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="p-8 rounded-3xl card-silver-rim flex flex-col justify-between group hover:border-slate-300 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 rounded-2xl bg-zinc-950 text-slate-200 border border-slate-300/30 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-950 text-slate-300 border border-slate-300/20">
                        {card.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-6">{card.desc}</p>
                  </div>

                  <Link
                    to={card.path}
                    className="pt-4 border-t border-slate-300/20 flex items-center justify-between text-xs font-bold text-slate-200 group-hover:text-white transition-colors"
                  >
                    <span>View Dedicated Page</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Cities Banner (Including Chennai) */}
      <section className="py-20 bg-zinc-950 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full silver-badge">
            Active Urban Hubs
          </span>
          <h2 className="text-3xl font-bold font-display text-white">Find Parking in Major Indian Cities</h2>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {['Chennai', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Delhi NCR'].map((cityName) => (
              <Link
                key={cityName}
                to={`/find-parking?city=${cityName}`}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-slate-300/30 text-white font-bold text-xs hover:bg-zinc-800 hover:border-slate-300 transition-all flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-slate-300" />
                <span>{cityName}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
