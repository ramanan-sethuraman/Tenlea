import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { IndiaMap } from '../components/common/IndiaMap';
import { 
  Building, MapPin, Plus, Search, QrCode, Clock, ShieldCheck, 
  FileText, Settings, KeyRound, AlertCircle, ArrowUpRight, CheckCircle2,
  Calendar, CreditCard, Sparkles, Navigation, ChevronRight, User, Star, Loader2,
  Car, Wallet, Inbox, ParkingSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const LandownerDashboardPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'bookings' | 'agreements' | 'map'

  // Regional Filter state for Landowner Network
  const initialCity = searchParams.get('city') || 'Chennai';
  const [cityInput, setCityInput] = useState(initialCity);
  const [selectedCityFilter, setSelectedCityFilter] = useState(initialCity);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All Types');
  const [allListings, setAllListings] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const manageSectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [parkingRes, bookingRes, agreementRes] = await Promise.allSettled([
          api.get('/parking'),
          api.get('/bookings'),
          api.get('/agreements'),
        ]);

        if (parkingRes.status === 'fulfilled' && parkingRes.value?.data) {
          const myPlots = parkingRes.value.data.filter(
            (p) => !p.landownerId || p.landownerId._id === user?._id || p.landownerId === user?._id
          );
          setProperties(myPlots);
        }

        if (bookingRes.status === 'fulfilled' && bookingRes.value?.data) {
          setBookings(bookingRes.value.data);
        }

        if (agreementRes.status === 'fulfilled' && agreementRes.value?.data) {
          setAgreements(agreementRes.value.data);
        }
      } catch (err) {
        console.error('Failed to fetch landowner dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Fetch Live Landowner Space Listings
  useEffect(() => {
    const fetchLiveSpaces = async () => {
      try {
        setSearchLoading(true);
        const res = await api.get('/parking', { params: { city: selectedCityFilter === 'All' ? '' : selectedCityFilter } });
        if (res && res.data) {
          const formatted = res.data.map((item) => ({
            id: item._id || item.id,
            city: item.city || 'Chennai',
            title: item.title,
            location: item.location || item.city || 'India',
            priceDay: `₹${item.pricePerDay || 0} / day`,
            priceMonth: `₹${item.pricePerMonth || 0} / mo`,
            rating: item.rating || 5.0,
            reviewsCount: item.reviewsCount || 0,
            availableSlots: item.availableSlots || 4,
            amenities: item.amenities || ['24/7 CCTV', 'Gated Security', 'EV Charging Point'],
            image: item.images && item.images[0] && item.images[0].startsWith('http')
              ? item.images[0]
              : 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
            host: item.landownerId?.name || user?.name || 'Verified Landowner Host',
            type: item.spaceSize || 'Vacant Land Plot',
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
  }, [selectedCityFilter, user]);

  const presetCities = ['Chennai', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'All'];

  const filteredListings = allListings.filter((item) => {
    const matchesCity =
      selectedCityFilter === 'All' ||
      item.city.toLowerCase().includes(selectedCityFilter.toLowerCase()) ||
      cityInput.toLowerCase().includes(item.city.toLowerCase());

    const matchesType =
      propertyTypeFilter === 'All Types' || item.type.toLowerCase().includes(propertyTypeFilter.toLowerCase());

    return matchesCity && matchesType;
  });

  const handleCityPillClick = (cityName) => {
    setSelectedCityFilter(cityName);
    setCityInput(cityName === 'All' ? '' : cityName);
    setSearchParams(cityName === 'All' ? {} : { city: cityName });
  };

  const scrollToManage = () => {
    setActiveTab('properties');
    manageSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Metrics Calculations
  const totalSlots = properties.reduce((acc, p) => acc + (p.availableSlots || p.slots || 1), 0);
  const activeBookingsCount = bookings.filter(b => b.bookingStatus === 'ACTIVE' || b.bookingStatus === 'CONFIRMED' || b.paymentStatus === 'PAID').length;
  const totalEarnings = bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between">
      <Navbar />

      <main className="grow pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* ============================================================ */}
        {/* SECTION 1: LANDOWNER DASHBOARD (MATCHING PHOTO 1 DESIGN) */}
        {/* ============================================================ */}
        <div className="p-6 sm:p-8 rounded-3xl card-silver-rim bg-zinc-900/90 relative overflow-hidden mb-8 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" /> LAND &amp; SPACE OWNER PORTAL
                </span>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Account Verified
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-white">
                Welcome, <span className="gradient-text-silver">{user?.name || user?.email || 'Landowner'}</span>!
              </h1>
              <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                Manage your registered vacant land plots, commercial parking spaces, active driver reservations, and digital lease agreements below.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/add-land')}
                className="px-4 py-2.5 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Plus className="w-4 h-4 text-zinc-950" />
                <span>+ Add Land Plot</span>
              </button>

              <button
                onClick={() => navigate('/add-parking')}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <ParkingSquare className="w-4 h-4 text-blue-400" />
                <span>+ Add Parking Space</span>
              </button>

              <button
                onClick={() => navigate('/agreement-generator')}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Agreements ({agreements.length})</span>
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
        </div>

        {/* Real-time Landowner Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold">Registered Land Plots</span>
              <Building className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold font-display text-white">
              {properties.length} <span className="text-xs font-normal text-zinc-500">{properties.length === 1 ? 'Plot' : 'Plots'}</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified land title registered
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold">Available Parking Bays</span>
              <ParkingSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold font-display text-white">
              {totalSlots} <span className="text-xs font-normal text-zinc-500">Slots</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-400" /> Ready for vehicle check-ins
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold">Active Tenant Drivers</span>
              <Car className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold font-display text-white">
              {activeBookingsCount} <span className="text-xs font-normal text-zinc-500">Active</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" /> 24/7 QR Gated Access
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold">Total Escrow Payouts</span>
              <Wallet className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold font-display text-white">
              ₹{totalEarnings.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Razorpay Escrow
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-zinc-800 mb-8 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'properties'
                ? 'btn-silver-primary text-zinc-950 shadow-lg'
                : 'text-zinc-400 hover:text-white bg-zinc-900/50 border border-zinc-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>My Land Plots &amp; Parking Bays ({properties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'bookings'
                ? 'btn-silver-primary text-zinc-950 shadow-lg'
                : 'text-zinc-400 hover:text-white bg-zinc-900/50 border border-zinc-800'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Active Tenant Reservations ({bookings.length})</span>
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
            <span>Digital Lease Contracts ({agreements.length})</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: PROPERTIES MANAGEMENT & DISCOVERY VIEW */}
        {/* ============================================================ */}
        {activeTab === 'properties' && (
          <div ref={manageSectionRef} className="space-y-8">
            
            {/* Header & Preset City Pills */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300">
                    Verified Landowner Property Portfolio
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
                    Manage Land Plots in <span className="gradient-text-silver">{selectedCityFilter || 'India'}</span>
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
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Space &amp; Land Type</label>
                  <select
                    value={propertyTypeFilter}
                    onChange={(e) => setPropertyTypeFilter(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                  >
                    <option>All Types</option>
                    <option>Vacant Land / Open Plot</option>
                    <option>Commercial Ground</option>
                    <option>Covered Garage</option>
                    <option>Open Gated Plot</option>
                    <option>Private Driveway</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Status Filter</label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                  >
                    <option>All Active Properties</option>
                    <option>Available for Lease</option>
                    <option>Fully Occupied</option>
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <button
                    onClick={() => navigate('/add-land')}
                    className="w-full py-2.5 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-zinc-950" />
                    <span>+ Register New Plot</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Land & Parking Map */}
            <div className="mb-8">
              <IndiaMap
                selectedCity={selectedCityFilter}
                onCitySelect={(cityName) => handleCityPillClick(cityName)}
              />
            </div>

            {/* Landowner Listed Properties Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{filteredListings.length} Land Plots &amp; Parking Spaces</span>
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
                          ✓ Landowner Host
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
                            <span className="text-xs text-zinc-400 block">Est. Revenue</span>
                            <span className="text-sm font-extrabold text-white">{item.priceDay}</span>
                            <span className="text-[11px] text-zinc-400 font-mono ml-2">({item.priceMonth})</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/add-parking?edit=${item.id}`)}
                              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 font-bold text-xs cursor-pointer"
                            >
                              Manage
                            </button>
                            <button
                              onClick={() => navigate(`/agreement-generator?spaceId=${item.id}`)}
                              className="px-3.5 py-1.5 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs cursor-pointer shadow-md"
                            >
                              Agreements
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 rounded-3xl bg-zinc-900/90 text-center border border-zinc-800 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                    <Building className="w-7 h-7 text-zinc-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">No Properties Listed Yet in "{selectedCityFilter}"</h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Turn your vacant land plot or idle parking space into reliable recurring revenue with verified KYC tenant drivers.
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => navigate('/add-land')}
                      className="px-5 py-2.5 rounded-xl btn-silver-primary text-zinc-950 text-xs font-bold cursor-pointer"
                    >
                      + List Vacant Land
                    </button>
                    <button
                      onClick={() => navigate('/add-parking')}
                      className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white text-xs font-bold cursor-pointer"
                    >
                      + List Parking Space
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: ACTIVE TENANT RESERVATIONS */}
        {/* ============================================================ */}
        {activeTab === 'bookings' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Active Tenant Driver Bookings</h3>
                <p className="text-xs text-zinc-400 mt-1">Real-time driver reservations and automated QR check-in activity</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-xs font-bold text-slate-300">
                {bookings.length} Total Bookings
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="py-16 px-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-center space-y-3">
                <Inbox className="w-10 h-10 text-zinc-500 mx-auto" />
                <h4 className="text-base font-bold text-white">No Active Tenant Reservations</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  When vehicle drivers reserve parking slots on your land plots, their check-ins and escrow payments will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((b) => (
                  <div key={b._id || b.id} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between hover:border-zinc-700 transition-all">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">{b.parkingSpaceId?.title || 'Indiranagar Prime Plot'}</h4>
                      <p className="text-xs text-zinc-400">Driver: <span className="text-white font-medium">{b.vehicleOwnerId?.name || b.vehicleOwnerId?.email || 'Registered Tenant'}</span></p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {b.bookingStatus || 'CONFIRMED'}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">QR: {b.qrCode || 'TENLEA-PASS'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-extrabold text-white">₹{b.totalAmount || 0}</div>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">Escrow Held</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: DIGITAL LEASE CONTRACTS */}
        {/* ============================================================ */}
        {activeTab === 'agreements' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Digital Lease Agreements</h3>
                <p className="text-xs text-zinc-400 mt-1">Legally binding digital rent agreements governed under Indian Contract Act, 1872</p>
              </div>
              <button
                onClick={() => navigate('/agreement-generator')}
                className="px-4 py-2 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs cursor-pointer shadow-md"
              >
                + Generate Agreement
              </button>
            </div>

            {agreements.length === 0 ? (
              <div className="py-16 px-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-center space-y-3">
                <FileText className="w-10 h-10 text-zinc-500 mx-auto" />
                <h4 className="text-base font-bold text-white">No Signed Agreements Yet</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Execute direct, stamp-duty compliant parking agreements with vehicle owners with single-click digital signatures.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/agreement-generator')}
                    className="px-5 py-2.5 rounded-xl btn-silver-primary text-zinc-950 text-xs font-bold cursor-pointer"
                  >
                    Open Agreement Generator
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {agreements.map((agr) => (
                  <div key={agr._id || agr.id} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between hover:border-zinc-700 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{agr.agreementNumber || 'TENLEA-AGR-2026'}</h4>
                        <p className="text-[11px] text-zinc-400">{agr.parkingSpaceId?.title || 'Land Plot Agreement'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {agr.status || 'ACTIVE'}
                      </span>
                      <button
                        onClick={() => navigate(`/agreements?id=${agr._id || agr.id}`)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-bold text-white hover:border-zinc-500 transition-all"
                      >
                        View PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};
