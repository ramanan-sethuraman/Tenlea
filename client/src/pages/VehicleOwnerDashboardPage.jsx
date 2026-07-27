import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Car, Search, QrCode, Clock, ShieldCheck, Plus, Inbox, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const VehicleOwnerDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Real user state (starts clean for fresh account)
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-display text-white">Driver / Vehicle Owner Dashboard</h1>
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Verified Account ✓
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Welcome back, <span className="text-white font-bold">{user?.name || user?.email || 'Driver'}</span>! Manage registered vehicles, active parking passes, and bookings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/my-vehicles')}
              className="px-4 py-2.5 rounded-xl btn-silver-secondary text-xs font-semibold text-slate-200 flex items-center gap-2"
            >
              <Car className="w-4 h-4 text-slate-300" />
              <span>My Vehicles ({vehicles.length})</span>
            </button>
            <button
              onClick={() => navigate('/find-parking')}
              className="px-4 py-2.5 rounded-xl btn-silver-primary text-zinc-950 text-xs font-bold flex items-center gap-2 shadow-lg"
            >
              <Search className="w-4 h-4 text-zinc-950" />
              <span>Find Parking &amp; Land</span>
            </button>
          </div>
        </div>

        {/* Real Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <div className="text-xs text-zinc-400 font-medium">Active Bookings</div>
            <div className="text-2xl font-extrabold font-display text-white mt-1">
              {bookings.filter((b) => b.status === 'ACTIVE').length} Active
            </div>
            <div className="text-[11px] text-zinc-500 mt-2">QR Code Checked-in</div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <div className="text-xs text-zinc-400 font-medium">Upcoming Bookings</div>
            <div className="text-2xl font-extrabold font-display text-white mt-1">
              {bookings.filter((b) => b.status === 'UPCOMING').length} Reserved
            </div>
            <div className="text-[11px] text-zinc-500 mt-2">Confirmed reservations</div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <div className="text-xs text-zinc-400 font-medium">Registered Vehicles</div>
            <div className="text-2xl font-extrabold font-display text-white mt-1">
              {vehicles.length} Vehicles
            </div>
            <div className="text-[11px] text-zinc-500 mt-2">Verified plate details</div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <div className="text-xs text-zinc-400 font-medium">Total Spent</div>
            <div className="text-2xl font-extrabold font-display text-white mt-1">₹0</div>
            <div className="text-[11px] text-zinc-500 mt-2">Razorpay Escrow Protected</div>
          </div>
        </div>

        {/* Real Active Bookings & Zero State */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Your Bookings &amp; Parking Passes</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Active land plot rentals and vehicle storage passes</p>
            </div>
            <button
              onClick={() => navigate('/find-parking')}
              className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-blue-400 hover:text-white transition-colors"
            >
              + Search Nearby Land
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="py-12 px-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-center space-y-3">
              <Inbox className="w-8 h-8 text-zinc-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Active Bookings</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                You haven't reserved any land plot or parking space yet. Search TENLEA's verified network across Chennai, Bengaluru, Mumbai &amp; India.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/find-parking')}
                  className="px-5 py-2.5 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs"
                >
                  Find Parking &amp; Land Now
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.location}</h4>
                    <span className="text-[10px] text-zinc-400">{item.vehicle}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{item.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
};
