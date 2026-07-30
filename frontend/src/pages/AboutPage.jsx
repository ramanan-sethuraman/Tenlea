import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ShieldCheck, Target, Lightbulb, Users, Linkedin } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-700">
            About TENLEA
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display">
            Monetize Your Space. <span className="gradient-text-mono">Secure Your Vehicle.</span>
          </h1>
          <p className="text-lg text-zinc-400">
            Building India’s most trusted marketplace for land leasing and vehicle parking.
          </p>
        </div>

        {/* 4 Story Cards: Problem, Solution, Mission, Trust */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center mb-6">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-display text-white mb-3">The Problem</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              In rapidly growing Indian cities, vehicle owners moving abroad, traveling for work, or needing temporary parking face high costs, unverified local brokers, and lack of security guarantees. Meanwhile, landowners with vacant plots, driveways, or commercial spaces have no safe way to monetize their land.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-display text-white mb-3">The TENLEA Solution</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              TENLEA connects verified landowners directly with vehicle owners through a trusted web marketplace. We provide KYC identity verification, automated digital agreements, QR check-in timestamps, and Razorpay escrow payments.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-display text-white mb-3">Our Mission</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              To empower Indian landowners to generate steady monthly income from unused space while offering vehicle owners complete peace of mind, legal clarity, and transparent pricing.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-display text-white mb-3">Built for India</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Designed from the ground up to support Indian urban mobility, custom land size units, regional payment gateways, and transparent weekly payouts without hidden middleman fees.
            </p>
          </div>

        </div>

        {/* Founder & Leadership LinkedIn Section */}
        <div className="p-8 sm:p-10 rounded-3xl bg-zinc-900 border border-zinc-800 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold font-display text-white mb-2">Connect With Leadership</h2>
          <p className="text-sm text-zinc-400 mb-6">Have questions or want to collaborate? Connect with Ramanan Sethuraman on LinkedIn.</p>
          <a
            href="https://www.linkedin.com/in/ramanan-sethuraman/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-silver-primary text-zinc-950 font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <Linkedin className="w-5 h-5 text-zinc-950" />
            <span>Connect on LinkedIn</span>
          </a>
        </div>

      </div>

      <Footer />
    </div>
  );
};
