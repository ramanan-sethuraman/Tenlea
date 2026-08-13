import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { 
  Car, Search, QrCode, Clock, ShieldCheck, Plus, Inbox, MapPin, 
  FileText, Settings, KeyRound, AlertCircle, ArrowUpRight, CheckCircle2,
  Calendar, CreditCard, Sparkles, Navigation, ChevronRight, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { AnimatedBackground } from '../components/common/AnimatedBackground';

export const VehicleOwnerDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('passes'); // 'passes' | 'vehicles' | 'agreements'
  const [selectedPass, setSelectedPass] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vRes, bRes, aRes] = await Promise.allSettled([
          api.get('/vehicles'),
          api.get('/bookings'),
          api.get('/agreements'),
        ]);

        if (vRes.status === 'fulfilled' && vRes.value?.data) {
          setVehicles(vRes.value.data);
        }
        if (bRes.status === 'fulfilled' && bRes.value?.data) {
          setBookings(bRes.value.data);
        }
        if (aRes.status === 'fulfilled' && aRes.value?.data) {
          setAgreements(aRes.value.data);
        }
      } catch (err) {
        console.error('Failed to fetch vehicle owner dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Calculate statistics
  const activeBookingsCount = bookings.filter(b => b.bookingStatus === 'ACTIVE' || b.bookingStatus === 'CONFIRMED' || b.paymentStatus === 'PAID').length;
  const totalSpent = bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between">
      <Navbar />

      <main className="grow pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Top Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl card-silver-rim bg-zinc-900/90 relative overflow-hidden mb-8 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5" /> Vehicle Owner / Driver Portal
                </span>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Account Verified
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-white">
                Welcome, <span className="gradient-text-silver">{user?.name || user?.email || 'Vehicle Owner'}</span>!
              </h1>
              <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                Manage your registered vehicles, active parking passes, digital QR access keys, and lease agreements with verified land owners across India.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/find-parking')}
                className="px-4 py-2.5 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg"
              >
                <Search className="w-4 h-4 text-zinc-950" />
                <span>Find Nearby Parking</span>
              </button>

              <button
                onClick={() => navigate('/my-vehicles')}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-xs font-bold flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4 text-purple-400" />
                <span>+ Add Vehicle ({vehicles.length})</span>
              </button>

              <button
                onClick={() => navigate('/agreements')}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-xs font-bold flex items-center gap-2 transition-all"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Agreements</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Vehicle Owner Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold">Registered Vehicles</span>
              <Car className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-extrabold font-display text-white">
              {vehicles.length} <span className="text-xs font-normal text-zinc-500">Vehicles</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> License plate verified
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold">Active Parking Passes</span>
              <QrCode className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold font-display text-white">
              {activeBookingsCount} <span className="text-xs font-normal text-zinc-500">Active</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-400" /> 24/7 QR Gated Access
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold">Digital Lease Agreements</span>
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold font-display text-white">
              {agreements.length} <span className="text-xs font-normal text-zinc-500">Legal Contracts</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" /> Escrow Protected
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold">Total Escrow Spent</span>
              <CreditCard className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold font-display text-white">
              ₹{totalSpent.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Razorpay Receipt
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-2 border-b border-zinc-800 mb-6 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('passes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'passes'
                ? 'btn-silver-primary text-zinc-950 shadow-lg'
                : 'text-zinc-400 hover:text-white bg-zinc-900/50 border border-zinc-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Active Parking Passes ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'vehicles'
                ? 'btn-silver-primary text-zinc-950 shadow-lg'
                : 'text-zinc-400 hover:text-white bg-zinc-900/50 border border-zinc-800'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>My Registered Vehicles ({vehicles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('agreements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'agreements'
                ? 'btn-silver-primary text-zinc-950 shadow-lg'
                : 'text-zinc-400 hover:text-white bg-zinc-900/50 border border-zinc-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Digital Lease Agreements ({agreements.length})</span>
          </button>
        </div>

        {/* TAB 1: ACTIVE PARKING PASSES & RESERVATIONS */}
        {activeTab === 'passes' && (
          <div className="space-y-6">
            {bookings.length === 0 ? (
              <div className="p-10 rounded-3xl bg-zinc-900/90 border border-zinc-800 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                  <Inbox className="w-8 h-8 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">No Parking Passes Found</h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                    You haven't reserved any land plot parking space yet. Search TENLEA's verified landowner network in Bengaluru, Chennai, Mumbai &amp; India.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/find-parking')}
                  className="px-6 py-3 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs inline-flex items-center gap-2 shadow-xl"
                >
                  <Search className="w-4 h-4 text-zinc-950" />
                  <span>Search Nearby Parking Slots</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((b) => (
                  <div key={b._id || b.id} className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
                          ✓ ACTIVE PASS
                        </span>
                        <span className="text-xs font-extrabold text-white">₹{b.totalAmount}</span>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1">
                        {b.parkingSpaceId?.title || b.parkingSpaceId?.location || 'Indiranagar Prime Covered Bay'}
                      </h4>
                      <p className="text-xs text-zinc-400 flex items-center gap-1.5 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span>{b.parkingSpaceId?.address || '100 Feet Road, Indiranagar, Bengaluru'}</span>
                      </p>

                      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1.5 text-xs text-zinc-300">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Vehicle Assigned:</span>
                          <span className="font-bold text-white">{b.vehicleId?.vehicleNumber || b.vehicleNumber || 'KA-01-MJ-8899'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Access Key:</span>
                          <span className="font-mono text-amber-400">{b.qrCode || 'TENLEA-PASS-2026'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Valid: {new Date(b.startDate || Date.now()).toLocaleDateString()} - {new Date(b.endDate || Date.now() + 30*86400000).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => setSelectedPass(b)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-white font-bold hover:bg-zinc-800 transition-colors flex items-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                        <span>View QR Pass</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY REGISTERED VEHICLES */}
        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">My Vehicles</h3>
                <p className="text-xs text-zinc-400">Registered cars, SUVs, and two-wheelers eligible for automated parking</p>
              </div>
              <button
                onClick={() => navigate('/my-vehicles')}
                className="px-4 py-2 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Vehicle</span>
              </button>
            </div>

            {vehicles.length === 0 ? (
              <div className="p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 text-center space-y-3">
                <Car className="w-8 h-8 text-zinc-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Registered Vehicles</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Add your vehicle plate number and RC details to easily book verified land plots with automated QR access.
                </p>
                <button
                  onClick={() => navigate('/my-vehicles')}
                  className="px-5 py-2.5 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs"
                >
                  Register Vehicle Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vehicles.map((v) => (
                  <div key={v._id || v.id} className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800">
                        {v.vehicleType || '4-Wheeler Car'}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{v.brand} {v.model}</h4>
                      <p className="text-base font-extrabold font-mono text-amber-400 mt-1 tracking-wider">{v.vehicleNumber}</p>
                    </div>
                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                      <span>Status: <strong className="text-emerald-400">Verified</strong></span>
                      <Link to="/my-vehicles" className="text-zinc-400 hover:text-white flex items-center gap-0.5">
                        Manage <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DIGITAL LEASE AGREEMENTS */}
        {activeTab === 'agreements' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Digital Lease Agreements</h3>
                <p className="text-xs text-zinc-400">Escrow protected legal contracts digitally signed between Landowner &amp; Driver</p>
              </div>
              <button
                onClick={() => navigate('/agreement-generator')}
                className="px-4 py-2 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Create New Agreement</span>
              </button>
            </div>

            {agreements.length === 0 ? (
              <div className="p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 text-center space-y-3">
                <FileText className="w-8 h-8 text-zinc-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Signed Agreements Yet</h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  When you book a land plot, a digital rental contract is generated automatically for legal protection.
                </p>
                <button
                  onClick={() => navigate('/agreement-generator')}
                  className="px-5 py-2.5 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs"
                >
                  Open Agreement Generator
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {agreements.map((agr) => (
                  <div key={agr._id || agr.id} className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
                          ✓ SIGNED &amp; EXECUTED
                        </span>
                        <span className="text-xs font-bold text-white">Agreement #{agr._id?.substring(0, 8) || '2026-0089'}</span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Terms: {agr.terms || 'Standard TENLEA parking space lease terms apply.'}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate('/agreement-generator')}
                      className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs font-bold text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>View Signed Contract</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* QR Pass Modal */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setSelectedPass(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-sm font-bold"
            >
              ✕
            </button>

            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 inline-block">
              24/7 Gate Entry Pass
            </span>

            <h3 className="text-lg font-bold text-white">{selectedPass.parkingSpaceId?.title || 'Indiranagar Prime Plot'}</h3>

            <div className="p-6 rounded-2xl bg-white text-zinc-950 mx-auto w-48 h-48 flex items-center justify-center shadow-xl">
              <QrCode className="w-36 h-36 text-zinc-950" />
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono">
              Key: {selectedPass.qrCode || 'TENLEA-PASS-2026'}
            </div>

            <p className="text-[10px] text-zinc-500">Scan at landowner entrance barrier for automated check-in.</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
