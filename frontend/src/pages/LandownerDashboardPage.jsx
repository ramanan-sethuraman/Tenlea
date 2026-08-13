import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { MapPin, ParkingSquare, CalendarCheck, Wallet, Plus, ShieldCheck, CheckCircle2, Building, Inbox, FileText, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const LandownerDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Real landowner property & booking state (starts clean for fresh accounts)
  const [properties, setProperties] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [parkingRes, bookingRes] = await Promise.allSettled([
          api.get('/parking'),
          api.get('/bookings'),
        ]);
        if (parkingRes.status === 'fulfilled' && parkingRes.value?.data) {
          const myPlots = parkingRes.value.data.filter(
            (p) => !p.landownerId || p.landownerId._id === user?._id || p.landownerId === user?._id
          );
          setProperties(
            myPlots.map((p) => ({
              id: p._id || p.id,
              title: p.title,
              location: p.location || p.city,
              slots: p.availableSlots || 1,
            }))
          );
        }
        if (bookingRes.status === 'fulfilled' && bookingRes.value?.data) {
          setBookingRequests(
            bookingRes.value.data.map((b) => ({
              id: b._id || b.id,
              space: b.parkingSpaceId?.title || 'Parking Space',
              driver: b.vehicleOwnerId?.name || b.vehicleOwnerId?.email || 'Driver',
              amount: `₹${b.totalAmount || 0}`,
              status: b.bookingStatus,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to fetch landowner data:', err);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between">
      <Navbar />

      <main className="grow pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold font-display">Landowner Dashboard</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Land & Space Owner
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Welcome back, <span className="text-white font-bold">{user?.name || user?.email || 'Landowner'}</span>! Manage your vacant land plots, active parking slots, and payouts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/add-land')}
              className="px-4 py-2.5 rounded-xl btn-silver-primary text-zinc-950 text-xs font-bold flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4 text-zinc-950" />
              <span>Add Land Plot</span>
            </button>
            <button
              onClick={() => navigate('/add-parking')}
              className="px-4 py-2.5 rounded-xl btn-silver-secondary text-slate-200 text-xs font-bold flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-slate-200" />
              <span>Add Parking Space</span>
            </button>
            <button
              onClick={() => navigate('/agreement-generator')}
              className="px-4 py-2.5 rounded-xl btn-silver-secondary text-zinc-950 font-bold text-xs flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-zinc-950" />
              <span>Agreement Generator</span>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 text-cyan-400" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Real Summary Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <div className="text-xs text-zinc-400 font-medium">Total Properties</div>
            <div className="text-2xl font-extrabold font-display text-white mt-1">
              {properties.length} {properties.length === 1 ? 'Land' : 'Lands'}
            </div>
            <div className="text-[11px] text-zinc-500 mt-2">Registered Land Plots</div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <div className="text-xs text-zinc-400 font-medium">Available Spaces</div>
            <div className="text-2xl font-extrabold font-display text-white mt-1">
              {properties.reduce((acc, p) => acc + (p.slots || 0), 0)} Slots
            </div>
            <div className="text-[11px] text-zinc-500 mt-2">Ready for bookings</div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <div className="text-xs text-zinc-400 font-medium">Active Bookings</div>
            <div className="text-2xl font-extrabold font-display text-white mt-1">
              {bookingRequests.filter((b) => b.status === 'ACTIVE').length} Active
            </div>
            <div className="text-[11px] text-zinc-500 mt-2">Checked-in vehicle owners</div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <div className="text-xs text-zinc-400 font-medium">Total Earnings</div>
            <div className="text-2xl font-extrabold font-display text-white mt-1">₹0</div>
            <div className="text-[11px] text-zinc-500 mt-2">Razorpay Escrow Active</div>
          </div>
        </div>

        {/* Real Properties List & Zero State */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Your Listed Properties</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Vacant land plots &amp; parking lots registered under your account</p>
            </div>
            <button
              onClick={() => navigate('/add-land')}
              className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-blue-400 hover:text-white transition-colors"
            >
              + Register New Plot
            </button>
          </div>

          {properties.length === 0 ? (
            <div className="py-12 px-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                <Building className="w-6 h-6 text-zinc-400" />
              </div>
              <h4 className="text-sm font-bold text-white">No Properties Added Yet</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                You have not listed any vacant land plots or parking spaces. Click below to add your first property and start receiving rental inquiries.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => navigate('/add-land')}
                  className="px-4 py-2 rounded-xl btn-silver-primary text-zinc-950 text-xs font-bold"
                >
                  List Vacant Land
                </button>
                <button
                  onClick={() => navigate('/add-parking')}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-bold hover:border-zinc-500"
                >
                  List Parking Space
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.map((prop) => (
                <div key={prop.id} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <h4 className="text-xs font-bold text-white">{prop.title}</h4>
                  <p className="text-[11px] text-zinc-400 mt-1">{prop.location}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Real Booking Requests & Zero State */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800">
          <h3 className="text-base font-bold text-white mb-4">Recent Booking Requests</h3>
          {bookingRequests.length === 0 ? (
            <div className="py-8 px-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-center space-y-2">
              <Inbox className="w-8 h-8 text-zinc-500 mx-auto" />
              <p className="text-xs text-zinc-400">No active booking requests at the moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookingRequests.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.space}</h4>
                    <div className="text-[11px] text-zinc-400 mt-0.5">Driver: {item.driver}</div>
                  </div>
                  <span className="text-xs font-bold text-white">{item.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
};
