import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Key, ShieldCheck, Navigation, Phone, ExternalLink, Search, Filter, Car, Building } from 'lucide-react';

export const GoogleParkingLocator = ({ apiKey = '', mapId = 'DEMO_MAP_ID', initialSelectedCity = '' }) => {
  const [userApiKey, setUserApiKey] = useState(apiKey);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSelectedCity);
  const [activeFilter, setActiveFilter] = useState('All');
  const locatorRef = useRef(null);

  // TENLEA Verified Vacant Land & Parking Locations
  const tenleaLocations = [
    {
      id: 'loc-1',
      title: 'T. Nagar Commercial Land Plot (2,400 sq.ft)',
      city: 'Chennai',
      type: 'Vacant Land Plot',
      size: '2,400 sq.ft',
      price: '₹4,000 / mo',
      address1: 'Usman Road, T. Nagar',
      address2: 'Chennai, Tamil Nadu 600017, India',
      coords: { lat: 13.0418, lng: 80.2341 },
      placeId: 'ChIJ5SZ52pGAhYAR1raOybzuDp8',
      host: 'Santhanam Ramanathan (Landowner)',
    },
    {
      id: 'loc-2',
      title: 'Velachery Open Gated Land Acre',
      city: 'Chennai',
      type: 'Vacant Land Plot',
      size: '1,800 sq.ft',
      price: '₹3,000 / mo',
      address1: 'Near Vijaya Nagar Bus Stand, Velachery',
      address2: 'Chennai, Tamil Nadu 600042, India',
      coords: { lat: 12.9785, lng: 80.2184 },
      placeId: 'ChIJeyVKpNd_j4ARLUED10OEr1s',
      host: 'Karthik Subramanian (Landowner)',
    },
    {
      id: 'loc-3',
      title: 'OMR IT Corridor Perungudi Fleet Ground',
      city: 'Chennai',
      type: 'Commercial Ground',
      size: '3,500 sq.ft',
      price: '₹3,500 / mo',
      address1: 'Phase 1 OMR, Perungudi',
      address2: 'Chennai, Tamil Nadu 600096, India',
      coords: { lat: 12.9654, lng: 80.2461 },
      placeId: 'ChIJgYMdZvGAhYAR2ifWKOR5ek8',
      host: 'Meenakshi Sundaram (Landowner)',
    },
    {
      id: 'loc-4',
      title: 'Indiranagar 100ft Road Prime Vacant Land',
      city: 'Bengaluru',
      type: 'Vacant Land Plot',
      size: '2,000 sq.ft',
      price: '₹4,500 / mo',
      address1: '100 Feet Road, Indiranagar',
      address2: 'Bengaluru, Karnataka 560038, India',
      coords: { lat: 12.9784, lng: 77.6408 },
      placeId: 'ChIJk_FWiDmHhYARgDVidBVO_RM',
      host: 'Rajesh Verma (Landowner)',
    },
    {
      id: 'loc-5',
      title: 'Bandra West Hill Road Private Land Lot',
      city: 'Mumbai',
      type: 'Vacant Land Plot',
      size: '1,500 sq.ft',
      price: '₹6,500 / mo',
      address1: 'Hill Road, Bandra West',
      address2: 'Mumbai, Maharashtra 400050, India',
      coords: { lat: 19.0596, lng: 72.8295 },
      placeId: 'ChIJ_2knd4-HhYARI5PPNZ7aasA',
      host: 'Sameer Merchant (Landowner)',
    },
    {
      id: 'loc-6',
      title: 'Gachibowli Open Commercial Ground',
      city: 'Hyderabad',
      type: 'Commercial Ground',
      size: '4,000 sq.ft',
      price: '₹5,000 / mo',
      address1: 'Financial District, Gachibowli',
      address2: 'Hyderabad, Telangana 500032, India',
      coords: { lat: 17.4401, lng: 78.3489 },
      placeId: 'ChIJSwWfLT9-j4ARMGcgMs-tBRE',
      host: 'Venkatesh Rao (Landowner)',
    },
    {
      id: 'loc-7',
      title: 'Gurugram CyberCity Commercial Acre',
      city: 'Delhi NCR',
      type: 'Vacant Land Plot',
      size: '3,000 sq.ft',
      price: '₹5,500 / mo',
      address1: 'DLF Cyber City, Phase 2',
      address2: 'Gurugram, Delhi NCR 122002, India',
      coords: { lat: 28.495, lng: 77.0895 },
      placeId: 'ChIJtYdd3IR-j4ARSybFjVnGTBw',
      host: 'Rohan Ahuja (Landowner)',
    },
  ];

  const [selectedLoc, setSelectedLoc] = useState(tenleaLocations[0]);

  const filteredLocations = tenleaLocations.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address1.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === 'All' ||
      item.type.toLowerCase().includes(activeFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  const locatorConfig = {
    locations: filteredLocations,
    mapOptions: {
      center: selectedLoc ? selectedLoc.coords : { lat: 15.9129, lng: 79.74 },
      fullscreenControl: true,
      mapTypeControl: true,
      streetViewControl: true,
      zoom: 13,
      zoomControl: true,
      maxZoom: 17,
      mapId: mapId,
    },
    mapsApiKey: userApiKey,
    capabilities: {
      input: true,
      autocomplete: true,
      directions: true,
      distanceMatrix: true,
      details: true,
      actions: true,
    },
  };

  useEffect(() => {
    const scriptId = 'google-maps-extended-component-library';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.15/index.min.js';
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !userApiKey) return;

    const configureLocator = async () => {
      try {
        await customElements.whenDefined('gmpx-store-locator');
        if (locatorRef.current) {
          locatorRef.current.configureFromQuickBuilder(locatorConfig);
        }
      } catch (err) {
        console.warn('Google Maps Extended Store Locator initialization:', err);
      }
    };

    configureLocator();
  }, [scriptLoaded, userApiKey, selectedLoc, searchQuery, activeFilter]);

  const getGoogleMapsDirectionsUrl = (coords, title) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}&destination_place_id=${title}`;
  };

  const getGoogleEmbedUrl = (loc) => {
    const query = encodeURIComponent(`${loc.address1}, ${loc.city}, India`);
    return `https://maps.google.com/maps?q=${query}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 shadow-2xl overflow-hidden relative">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Google Maps Interactive Platform
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
            TENLEA <span className="gradient-text-silver">Vacant Land &amp; Parking Map</span> 🗺️
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Explore verified vacant land plots &amp; parking spaces with Google Maps GPS
          </p>
        </div>

        {/* API Key Input Control */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Key className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              type="password"
              placeholder="Paste Google Maps API Key..."
              value={userApiKey}
              onChange={(e) => setUserApiKey(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
          {userApiKey ? (
            <span className="text-[10px] text-emerald-400 font-semibold px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800/80 whitespace-nowrap">
              Google Store Locator Active ✓
            </span>
          ) : (
            <span className="text-[10px] text-blue-400 font-semibold px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-800/80 whitespace-nowrap">
              Google Maps Embed Mode
            </span>
          )}
        </div>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search city, area, or land plot..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {['All', 'Vacant Land Plot', 'Commercial Ground'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === f
                  ? 'btn-silver-primary text-zinc-950 shadow-md'
                  : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Google Maps Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Google Maps Viewport Container */}
        <div className="lg:col-span-8 w-full h-[480px] sm:h-[540px] rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden relative">
          {userApiKey ? (
            /* Custom Google Maps Extended Component Library */
            <>
              <gmpx-api-loader key={userApiKey} solution-channel="GMP_QB_locatorplus_v11_cABD"></gmpx-api-loader>
              <gmpx-store-locator
                ref={locatorRef}
                map-id={mapId}
                style={{
                  width: '100%',
                  height: '100%',
                  '--gmpx-color-surface': '#18181b',
                  '--gmpx-color-on-surface': '#ffffff',
                  '--gmpx-color-on-surface-variant': '#a1a1aa',
                  '--gmpx-color-primary': '#3b82f6',
                  '--gmpx-color-outline': '#27272a',
                  '--gmpx-font-family-base': 'Inter, sans-serif',
                }}
              ></gmpx-store-locator>
            </>
          ) : (
            /* Standard Full-Color Google Maps Viewport Embed */
            <div className="w-full h-full relative">
              <iframe
                title={`Google Maps - ${selectedLoc.title}`}
                width="100%"
                height="100%"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                src={getGoogleEmbedUrl(selectedLoc)}
              ></iframe>
            </div>
          )}
        </div>

        {/* Right Column: Selected Land Location Inspector Card & Quick Selector List */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Selected Location Highlight Box */}
          {selectedLoc && (
            <div className="p-5 rounded-2xl bg-zinc-950 border border-blue-900/40 space-y-3 shadow-xl">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                  {selectedLoc.type}
                </span>
                <span className="text-xs font-bold text-emerald-400">{selectedLoc.price}</span>
              </div>

              <h4 className="text-sm font-bold text-white leading-tight">{selectedLoc.title}</h4>
              <p className="text-xs text-zinc-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>{selectedLoc.address1}, {selectedLoc.city}</span>
              </p>

              <div className="pt-2 border-t border-zinc-900 grid grid-cols-2 gap-2 text-[11px] text-zinc-300">
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase">Plot Size:</span>
                  <span className="font-bold text-white">{selectedLoc.size}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase">Verified Host:</span>
                  <span className="font-bold text-white truncate block">{selectedLoc.host}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={getGoogleMapsDirectionsUrl(selectedLoc.coords, selectedLoc.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-zinc-950" />
                  <span>Navigate</span>
                </a>
                <a
                  href="tel:+919080173002"
                  className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:border-zinc-700 transition-colors flex items-center justify-center"
                  title="Call Landowner"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                </a>
              </div>
            </div>
          )}

          {/* Location Quick List */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">
              Listed Land &amp; Parking Plots ({filteredLocations.length})
            </span>
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredLocations.map((loc) => {
                const isSelected = selectedLoc?.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLoc(loc)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-zinc-900 text-white border-blue-500/50 shadow-md'
                        : 'bg-zinc-900/40 text-zinc-400 border-zinc-800/80 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <span className="font-bold block truncate text-white">{loc.title}</span>
                      <span className="text-[10px] text-zinc-500 block">{loc.city} • {loc.size}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 shrink-0">{loc.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Notice Appendix required by Google Maps Platform */}
      <div className="mt-6 pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 space-y-1">
        <p>• Usage of Google Maps Platform products and services may incur costs against your Google Cloud project billing account.</p>
        <p>• Products Used: Google Maps JavaScript API, Places API, Extended Component Library (`gmpx-store-locator`).</p>
        <p>• Restrict production keys via: <a href="https://docs.cloud.google.com/api-keys/docs/add-restrictions-api-keys?utm_campaign=gmp_git_agentskills_v1" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Cloud Console Credentials</a>.</p>
        <p>• Google-sourced code snippets are provided under Apache 2.0 License. Terms of Service apply: <a href="https://cloud.google.com/maps-platform/terms?utm_campaign=gmp_git_agentskills_v1" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">https://cloud.google.com/maps-platform/terms</a>.</p>
      </div>
    </div>
  );
};
