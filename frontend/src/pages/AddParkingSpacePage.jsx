import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ParkingSquare, ArrowRight } from 'lucide-react';

export const AddParkingSpacePage = () => {
  const [title, setTitle] = useState('');
  const [spaceSize, setSpaceSize] = useState('Standard Car / Sedan');
  const [pricePerDay, setPricePerDay] = useState('350');
  const [pricePerMonth, setPricePerMonth] = useState('4500');
  const [published, setPublished] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setPublished(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl">
          
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              Create Parking Slot Listing
            </span>
            <h1 className="text-3xl font-extrabold font-display text-white mt-3">Add Parking Space</h1>
            <p className="text-sm text-zinc-400 mt-1">Publish a dedicated parking slot on your verified land plot</p>
          </div>

          {published ? (
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-700 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-800 text-white flex items-center justify-center mx-auto text-2xl font-bold border border-zinc-700">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white">Parking Space Published</h3>
              <p className="text-sm text-zinc-400">Your parking space listing is now created and under PENDING VERIFICATION status.</p>
              <button
                onClick={() => navigate('/dashboard/landowner')}
                className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Parking Slot Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indiranagar Covered Garage Slot A1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Space Size</label>
                  <select
                    value={spaceSize}
                    onChange={(e) => setSpaceSize(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                  >
                    <option>Standard Car / Sedan</option>
                    <option>Compact (2-Wheeler)</option>
                    <option>Large SUV / Truck</option>
                    <option>Open Plot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Daily Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="350"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Monthly Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="4500"
                    value={pricePerMonth}
                    onChange={(e) => setPricePerMonth(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>Publish Parking Space</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </button>
            </form>
          )}

        </div>

      </div>

      <Footer />
    </div>
  );
};
