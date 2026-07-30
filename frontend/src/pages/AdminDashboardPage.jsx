import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ShieldAlert, Users, MapPin, CalendarCheck, Wallet, CheckCircle2 } from 'lucide-react';

export const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Super Admin Dashboard</h1>
            <p className="text-xs text-zinc-400 mt-1">Platform Governance, KYC Approval & Dispute Resolution</p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-700">
            Superuser Mode
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="text-xs text-zinc-400">Total Users</div>
            <div className="text-xl font-bold text-white mt-1">14,250</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-700">
            <div className="text-xs text-zinc-300">Pending KYC</div>
            <div className="text-xl font-bold text-white mt-1">42 Pending</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="text-xs text-zinc-400">Total Listings</div>
            <div className="text-xl font-bold text-white mt-1">3,480 Spaces</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-700">
            <div className="text-xs text-zinc-400">Platform Revenue</div>
            <div className="text-xl font-bold text-white mt-1">₹2,89,000</div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};
