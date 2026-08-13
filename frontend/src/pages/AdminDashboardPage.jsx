import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ShieldAlert, Users, MapPin, CalendarCheck, Wallet, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../services/api';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    landownersCount: 0,
    driversCount: 0,
    pendingKYC: 0,
    verifiedUsers: 0,
    totalListings: 0,
    pendingListings: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    totalGross: 0,
    pendingDisputes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard');
        if (res && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Super Admin Dashboard</h1>
            <p className="text-xs text-zinc-400 mt-1">Platform Governance, KYC Approval & Dispute Resolution</p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-700 flex items-center gap-2">
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />}
            Superuser Mode
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="text-xs text-zinc-400">Total Users</div>
            <div className="text-xl font-bold text-white mt-1">
              {loading ? '-' : stats.totalUsers.toLocaleString()}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">
              {stats.landownersCount} Landowners • {stats.driversCount} Drivers
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-700">
            <div className="text-xs text-zinc-300">Pending KYC</div>
            <div className="text-xl font-bold text-white mt-1">
              {loading ? '-' : `${stats.pendingKYC} Pending`}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">
              {stats.verifiedUsers} Verified Users
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="text-xs text-zinc-400">Total Listings</div>
            <div className="text-xl font-bold text-white mt-1">
              {loading ? '-' : `${stats.totalListings} Spaces`}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">
              {stats.pendingListings} Pending Verification
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-700">
            <div className="text-xs text-zinc-400">Platform Revenue</div>
            <div className="text-xl font-bold text-white mt-1">
              {loading ? '-' : `₹${stats.totalRevenue.toLocaleString('en-IN')}`}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">
              Gross: ₹{(stats.totalGross || 0).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};
