import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { MapPin, ImagePlus, ArrowRight, ShieldCheck, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

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
      const landPayload = {
        title: title.trim(),
        description: description.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pinCode: pinCode.trim(),
        totalArea: totalArea.trim(),
        availableArea: availableArea.trim(),
        landownerId: user?._id || user?.id || 'guest_landowner',
        landownerEmail: user?.email || 'guest@tenlea.com',
        landownerName: user?.name || 'Landowner Host',
        verificationStatus: 'PENDING',
        createdAt: serverTimestamp(),
      };

      console.log('📝 [Firestore]: Adding document to "lands" collection...', landPayload);
      const docRef = await addDoc(collection(db, 'lands'), landPayload);
      console.log('✅ [Firestore Success]: Saved land document with ID:', docRef.id);
      setCreatedDocId(docRef.id);

      // Also sync to backend API
      try {
        await api.post('/lands', { ...landPayload, _id: docRef.id });
      } catch (apiErr) {
        console.warn('[Backend Sync Note]:', apiErr.message);
      }

      setSubmitted(true);
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
              Landowner Property Submission
            </span>
            <h1 className="text-3xl font-extrabold font-display text-white mt-3">Add New Land Property</h1>
            <p className="text-sm text-zinc-400 mt-1">Submit your plot or property details for verification</p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-zinc-950 border border-emerald-500/40 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold border border-emerald-500/50">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Land Property Saved to Cloud Firestore!</h3>
              <p className="text-sm text-zinc-300">
                Your land listing has been written directly to the <span className="font-mono text-emerald-400">"lands"</span> collection in Cloud Firestore.
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
                  <span>Notice: You are submitting as a guest. Log in to bind this plot to your verified landowner profile.</span>
                </div>
              )}
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
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                    <span>Writing to Cloud Firestore...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Land to Cloud Firestore</span>
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
