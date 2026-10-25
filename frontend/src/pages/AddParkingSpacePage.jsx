import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ParkingSquare, ArrowRight, Loader2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const AddParkingSpacePage = () => {
  const [title, setTitle] = useState('');
  const [spaceSize, setSpaceSize] = useState('Standard Car / Sedan');
  const [pricePerDay, setPricePerDay] = useState('350');
  const [pricePerMonth, setPricePerMonth] = useState('4500');
  const [published, setPublished] = useState(false);
  const [createdDocId, setCreatedDocId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const parkingPayload = {
        title: title.trim(),
        spaceSize,
        pricePerDay: Number(pricePerDay),
        pricePerMonth: Number(pricePerMonth),
        amenities: ['CCTV 24/7', 'Gated Security', 'Automated QR Gate'],
        landownerId: user?._id || user?.id || 'guest_landowner',
        landownerEmail: user?.email || 'guest@tenlea.com',
        landownerName: user?.name || 'Landowner Host',
        verificationStatus: 'APPROVED',
        availabilityStatus: 'AVAILABLE',
        createdAt: serverTimestamp(),
      };

      console.log('📝 [Firestore]: Adding document to "parkingspaces" collection...', parkingPayload);
      const docRef = await addDoc(collection(db, 'parkingspaces'), parkingPayload);
      console.log('✅ [Firestore Success]: Saved parking space document with ID:', docRef.id);
      setCreatedDocId(docRef.id);

      // Also sync to backend API
      try {
        await api.post('/parking', { ...parkingPayload, _id: docRef.id });
      } catch (apiErr) {
        console.warn('[Backend Sync Note]:', apiErr.message);
      }

      setPublished(true);
    } catch (err) {
      console.error('❌ [Firestore Error]:', err.code, err.message, err);
      setErrorMsg(`Failed to save to Firestore: [${err.code || 'error'}] ${err.message}`);
    } finally {
      setLoading(false);
    }
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
            <p className="text-sm text-zinc-400 mt-1">Publish a dedicated parking slot directly to Cloud Firestore</p>
          </div>

          {published ? (
            <div className="p-8 rounded-2xl bg-zinc-950 border border-emerald-500/40 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold border border-emerald-500/50">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Parking Space Saved to Cloud Firestore!</h3>
              <p className="text-sm text-zinc-300">
                Your parking slot listing is live in the <span className="font-mono text-emerald-400">"parkingspaces"</span> collection.
              </p>
              {createdDocId && (
                <div className="inline-block px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 font-mono text-xs text-zinc-300">
                  Firestore Document ID: <span className="text-emerald-400 font-bold">{createdDocId}</span>
                </div>
              )}
              <div>
                <button
                  onClick={() => navigate('/dashboard/landowner')}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-all cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {!user && (
                <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-200 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Notice: You are submitting as a guest. Log in to associate this slot with your account.</span>
                </div>
              )}

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
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                    <span>Saving to Cloud Firestore...</span>
                  </>
                ) : (
                  <>
                    <span>Publish Parking Space to Firestore</span>
                    <ArrowRight className="w-4 h-4 text-zinc-950" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>

      <Footer />
    </div>
  );
};
