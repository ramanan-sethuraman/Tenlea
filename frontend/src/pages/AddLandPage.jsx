import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { MapPin, ImagePlus, ArrowRight, ShieldCheck } from 'lucide-react';

export const AddLandPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [availableArea, setAvailableArea] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl">
          
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              Landowner Property Submission
            </span>
            <h1 className="text-3xl font-extrabold font-display text-white mt-3">Add New Land Property</h1>
            <p className="text-sm text-zinc-400 mt-1">Submit your plot or property details for verification</p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-700 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-800 text-white flex items-center justify-center mx-auto text-2xl font-bold border border-zinc-700">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white">Land Submitted for Verification</h3>
              <p className="text-sm text-zinc-400">Your land property has been submitted and is currently pending admin review.</p>
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
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Land Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indiranagar 100ft Road Gated Plot"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your land property, fencing, entry width, security..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Street Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Bengaluru / Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">State</label>
                  <input
                    type="text"
                    required
                    placeholder="Karnataka"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">PIN Code</label>
                  <input
                    type="text"
                    required
                    placeholder="560038"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Total Area</label>
                  <input
                    type="text"
                    required
                    placeholder="2,400 sq ft"
                    value={totalArea}
                    onChange={(e) => setTotalArea(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>Submit for Verification</span>
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
