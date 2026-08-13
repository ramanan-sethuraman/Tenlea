import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { IndiaMap } from '../components/common/IndiaMap';
import { Search, MapPin, Star, ShieldCheck, Car, Calendar, CheckCircle2, Loader2, Map } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const FindParkingPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || 'Chennai';
  const [city, setCity] = useState(initialCity);
  const [vehicleType, setVehicleType] = useState('4-Wheeler Car / SUV');
  const [parkingType, setParkingType] = useState('All Types');
  const [selectedCityFilter, setSelectedCityFilter] = useState(initialCity);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?role=vehicle');
    }
  }, [user, authLoading, navigate]);

  const [allListings, setAllListings] = useState([]);

  useEffect(() => {
    const urlCity = searchParams.get('city');
    if (urlCity) {
      setCity(urlCity);
      setSelectedCityFilter(urlCity);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchLiveSpaces = async () => {
      try {
        setLoading(true);
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
            amenities: item.amenities || [],
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
        setLoading(false);
      }
    };

    fetchLiveSpaces();
  }, [selectedCityFilter]);

  const presetCities = ['Chennai', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'All'];

  const filteredListings = allListings.filter((item) => {
    const matchesCity =
      selectedCityFilter === 'All' ||
      item.city.toLowerCase().includes(selectedCityFilter.toLowerCase()) ||
      city.toLowerCase().includes(item.city.toLowerCase());

    const matchesType =
      parkingType === 'All Types' || item.type.toLowerCase().includes(parkingType.toLowerCase());

    return matchesCity && matchesType;
  });

  const handleCityPillClick = (cityName) => {
    setSelectedCityFilter(cityName);
    setCity(cityName === 'All' ? '' : cityName);
    setSearchParams(cityName === 'All' ? {} : { city: cityName });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Quick City Filter Pills */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                Verified Indian Mobility Spaces
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-1">
                Find Parking Spaces in <span className="gradient-text-silver">{selectedCityFilter || 'India'}</span>
              </h1>
            </div>

            {/* Quick Preset City Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {presetCities.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCityPillClick(c)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedCityFilter === c
                      ? 'btn-silver-primary text-zinc-950 shadow-silver-glow'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{c}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Search Bar Filter Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 mb-10 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">City / Area Name</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="e.g. Chennai, T. Nagar, Velachery..."
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setSelectedCityFilter(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Vehicle Type</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
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
                value={parkingType}
                onChange={(e) => setParkingType(e.target.value)}
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
                onClick={() => setSelectedCityFilter(city || 'All')}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <Search className="w-4 h-4 text-zinc-950" />
                <span>Apply Filter ({filteredListings.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive India Map Component */}
        <div className="mb-12">
          <IndiaMap
            selectedCity={selectedCityFilter}
            onCitySelect={(cityName) => handleCityPillClick(cityName)}
          />
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Listing Cards */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{filteredListings.length} Verified Parking Spaces</span>
                <span className="text-xs font-normal text-zinc-400">in {selectedCityFilter || 'Selected Area'}</span>
              </h2>
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-300" />}
                <span>Sorted by Recommended</span>
              </span>
            </div>

            {filteredListings.length > 0 ? (
              filteredListings.map((item) => (
                <div key={item.id} className="p-6 rounded-3xl card-silver-rim flex flex-col sm:flex-row gap-6">
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
                        <h3 className="text-base font-bold text-white">{item.title}</h3>
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
                        <span className="text-xs text-zinc-400 block">Starting from</span>
                        <span className="text-sm font-extrabold text-white">{item.priceDay}</span>
                        <span className="text-[11px] text-zinc-400 font-mono ml-2">({item.priceMonth})</span>
                      </div>

                      <button className="px-4 py-2 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs">
                        View & Book Slot
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 rounded-3xl bg-zinc-900 text-center border border-zinc-800 space-y-3">
                <MapPin className="w-10 h-10 text-zinc-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No spaces found in "{selectedCityFilter}"</h3>
                <p className="text-xs text-zinc-400">Try selecting another city like Chennai or Bengaluru.</p>
                <button
                  onClick={() => handleCityPillClick('Chennai')}
                  className="px-4 py-2 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs"
                >
                  View Chennai Parking Spaces
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Dynamic OpenStreetMap / Leaflet Visualizer */}
          <div className="lg:col-span-4 rounded-3xl card-silver-rim p-6 flex flex-col justify-between min-h-[440px]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-white">Map View</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-900 border border-slate-300/30 text-slate-300">
                  {selectedCityFilter || 'India'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mb-4">
                OpenStreetMap real-time spatial pins for {selectedCityFilter || 'selected region'}.
              </p>
              
              <div className="w-full h-80 rounded-2xl bg-zinc-950 border border-slate-300/20 relative overflow-hidden flex items-center justify-center text-center p-4">
                <div className="space-y-3">
                  <MapPin className="w-10 h-10 text-white mx-auto animate-bounce" />
                  <div className="text-xs font-bold text-white">OpenStreetMap / Leaflet Container</div>
                  <div className="text-[11px] text-zinc-300 font-mono">
                    📍 {filteredListings.length} Active Marker Pins in {selectedCityFilter || 'India'}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-1 pt-2">
                    {filteredListings.slice(0, 3).map((l, idx) => (
                      <span key={idx} className="text-[9px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                        {l.location.split(',')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 text-xs text-zinc-400 text-center flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
              <span>Zero-cost OpenStreetMap integration without external API fees</span>
            </div>
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
};
