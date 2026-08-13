import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { IndiaMap } from '../components/common/IndiaMap';
import { 
  Car, Search, QrCode, Clock, ShieldCheck, Plus, Inbox, MapPin, 
  FileText, Settings, KeyRound, AlertCircle, ArrowUpRight, CheckCircle2,
  Calendar, CreditCard, Sparkles, Navigation, ChevronRight, User, Star, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const VehicleOwnerDashboardPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'passes' | 'vehicles' | 'agreements'
  const [selectedPass, setSelectedPass] = useState(null);

  // Search & Find Parking state
  const initialCity = searchParams.get('city') || 'Chennai';
  const [cityInput, setCityInput] = useState(initialCity);
  const [selectedCityFilter, setSelectedCityFilter] = useState(initialCity);
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('4-Wheeler Car / SUV');
  const [parkingTypeFilter, setParkingTypeFilter] = useState('All Types');
  const [allListings, setAllListings] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchSectionRef = useRef(null);

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

  // Fetch Live Parking Spaces for the Search section below
  useEffect(() => {
    const fetchLiveSpaces = async () => {
      try {
        setSearchLoading(true);
        const res = await api.get('/parking', { params: { city: selectedCityFilter === 'All' ? '' : selectedCityFilter } });
        if (res && res.data) {
          const formatted = res.data.map((item) => ({
            id: item._id || item.id,
            city: item.city || 'India',
            title: item.title,
            location: item.location || item.city || 'India',
            priceDay: `₹${item.pricePerDay || 0} / day`,
            priceMonth: `₹${item.pricePerMonth || 0} / mo`,
            rating: item.rating || 5.0,
            reviewsCount: item.reviewsCount || 0,
            amenities: item.amenities || ['24/7 CCTV', 'Gated Access', 'EV Charging'],
            image: item.images && item.images[0] && item.images[0].startsWith('http')
              ? item.images[0]
              : 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
            host: item.landownerId?.name || 'Verified Host',
            type: item.spaceSize || 'Parking Space',
          }));
          setAllListings(formatted);
        } else {
          setAllListings([]);
        }
      } catch (err) {
        console.error('Error fetching parking spaces:', err);
        setAllListings([]);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchLiveSpaces();
  }, [selectedCityFilter]);

  const presetCities = ['Chennai', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'All'];

  const filteredListings = allListings.filter((item) => {
    const matchesCity =
      selectedCityFilter === 'All' ||
      item.city.toLowerCase().includes(selectedCityFilter.toLowerCase()) ||
      cityInput.toLowerCase().includes(item.city.toLowerCase());

    const matchesType =
      parkingTypeFilter === 'All Types' || item.type.toLowerCase().includes(parkingTypeFilter.toLowerCase());

    return matchesCity && matchesType;
  });

  const handleCityPillClick = (cityName) => {
    setSelectedCityFilter(cityName);
    setCityInput(cityName === 'All' ? '' : cityName);
    setSearchParams(cityName === 'All' ? {} : { city: cityName });
  };

  const scrollToSearch = () => {
    setActiveTab('search');
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Statistics
  const activeBookingsCount = bookings.filter(b => b.bookingStatus === 'ACTIVE' || b.bookingStatus === 'CONFIRMED' || b.paymentStatus === 'PAID').length;
  const totalSpent = bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between">
      <Navbar />

      <main className="grow pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* ============================================================ */}
        {/* SECTION 1: VEHICLE OWNER DASHBOARD (SHOWN BEFORE SEARCH DETAILS) */}
        {/* ============================================================ */}
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
                Manage your registered vehicles, active parking passes, digital QR access keys, and search verified landowner plots across India below.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={scrollToSearch}
                className="px-4 py-2.5 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Search className="w-4 h-4 text-zinc-950" />
                <span>Find Nearby Parking ↓</span>
              </button>

              <button
                onClick={() => navigate('/my-vehicles')}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-purple-400" />
                <span>+ Add Vehicle ({vehicles.length})</span>
              </button>

              <button
                onClick={() => navigate('/agreements')}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Agreements ({agreements.length})</span>
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
              {agreements.length} <span className="text-xs font-normal text-zinc-500">Contracts</span>
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

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-zinc-800 mb-8 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'search'
                ? 'btn-silver-primary text-zinc-950 shadow-lg'
                : 'text-zinc-400 hover:text-white bg-zinc-900/50 border border-zinc-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Find &amp; Search Parking ({filteredListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('passes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
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
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
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
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'agreements'
                ? 'btn-silver-primary text-zinc-950 shadow-lg'
                : 'text-zinc-400 hover:text-white bg-zinc-900/50 border border-zinc-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Digital Lease Agreements ({agreements.length})</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* SECTION 2: CURRENT PARKING DETAILS & SEARCH (BELOW DASHBOARD) */}
        {/* ============================================================ */}
        <div ref={searchSectionRef} className="space-y-8">
          
          {/* Header & Preset City Pills */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300">
                  Verified Landowner Parking Network
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
                  Available Parking Spaces in <span className="gradient-text-silver">{selectedCityFilter || 'India'}</span>
                </h2>
              </div>

              {/* Preset City Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {presetCities.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleCityPillClick(c)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedCityFilter === c
                        ? 'btn-silver-primary text-zinc-950 shadow-silver-glow'
                        : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{c}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Input Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">City / Area Name</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="e.g. Chennai, T. Nagar, Velachery..."
                    value={cityInput}
                    onChange={(e) => {
                      setCityInput(e.target.value);
                      setSelectedCityFilter(e.target.value);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Vehicle Type</label>
                <select
                  value={vehicleTypeFilter}
                  onChange={(e) => setVehicleTypeFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                >
                  <option>4-Wheeler Car / SUV</option>
                  <option>2-Wheeler Bike</option>
                  <option>Commercial Van / Pickup</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Space &amp; Land Type</label>
                <select
                  value={parkingTypeFilter}
                  onChange={(e) => setParkingTypeFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                >
                  <option>All Types</option>
                  <option>Vacant Land / Open Plot</option>
                  <option>Covered Garage</option>
                  <option>Open Gated Plot</option>
                  <option>Private Driveway</option>
                  <option>Commercial Fleet Ground</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setSelectedCityFilter(cityInput || 'All')}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4 text-zinc-950" />
                  <span>Search ({filteredListings.length} Slots)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive OpenStreetMap Component */}
          <div className="mb-8">
            <IndiaMap
              selectedCity={selectedCityFilter}
              onCitySelect={(cityName) => handleCityPillClick(cityName)}
            />
          </div>

          {/* Real-time Parking Spaces Listing Cards - Full Width Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{filteredListings.length} Verified Parking Plots Available</span>
                <span className="text-xs font-normal text-zinc-400">in {selectedCityFilter || 'Selected Region'}</span>
              </h3>
              {searchLoading && <Loader2 className="w-4 h-4 animate-spin text-slate-300" />}
            </div>

            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredListings.map((item) => (
                  <div key={item.id} className="p-6 rounded-3xl card-silver-rim flex flex-col sm:flex-row gap-6 hover:border-zinc-700 transition-all">
                    <div className="w-full sm:w-48 h-44 rounded-2xl overflow-hidden relative shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2.5 py-1 rounded-full silver-badge">
                        ✓ Verified Host
                      </span>
                      <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-950/90 text-slate-200 border border-slate-300/30">
                        {item.city}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-base font-bold text-white">{item.title}</h4>
                          <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-slate-300 text-slate-300" /> {item.rating} ({item.reviewsCount})
                          </span>
                        </div>

                        <p className="text-xs text-zinc-400 flex items-center gap-1 mb-3">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> {item.location}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {item.amenities.map((am, i) => (
                            <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-950 text-slate-300 border border-slate-300/20">
                              {am}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-300/20">
                        <div>
                          <span className="text-xs text-zinc-400 block">Pricing</span>
                          <span className="text-sm font-extrabold text-white">{item.priceDay}</span>
                          <span className="text-[11px] text-zinc-400 font-mono ml-2">({item.priceMonth})</span>
                        </div>

                        <button
                          onClick={() => navigate(`/agreement-generator?spaceId=${item.id}`)}
                          className="px-4 py-2 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs cursor-pointer shadow-md"
                        >
                          View &amp; Reserve Plot
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 rounded-3xl bg-zinc-900/90 text-center border border-zinc-800 space-y-3">
                <MapPin className="w-10 h-10 text-zinc-500 mx-auto" />
                <h4 className="text-base font-bold text-white">No parking plots found in "{selectedCityFilter}"</h4>
                <p className="text-xs text-zinc-400">Try switching to Chennai or Bengaluru.</p>
                <button
                  onClick={() => handleCityPillClick('Chennai')}
                  className="px-4 py-2 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs cursor-pointer"
                >
                  View Chennai Land Plots
                </button>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* QR Gate Pass Modal */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setSelectedPass(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-sm font-bold cursor-pointer"
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
