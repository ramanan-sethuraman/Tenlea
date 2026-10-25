import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Car, Plus, Trash2, Inbox, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const MyVehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [number, setNumber] = useState('');
  const [type, setType] = useState('4-Wheeler Car / SUV');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { user } = useAuth();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      // 1. Try real Firestore first
      try {
        const vColl = collection(db, 'vehicles');
        const snap = await getDocs(vColl);
        if (!snap.empty) {
          const list = snap.docs.map(d => ({
            id: d.id,
            type: d.data().vehicleType || '4-Wheeler Car / SUV',
            brand: d.data().brand,
            model: d.data().model,
            number: d.data().vehicleNumber,
          }));
          setVehicles(list);
          setLoading(false);
          return;
        }
      } catch (fsErr) {
        console.warn('Firestore fetch vehicles notice:', fsErr.code, fsErr.message);
      }

      // 2. Fallback to API
      const res = await api.get('/vehicles');
      if (res && res.data) {
        const formatted = res.data.map((v) => ({
          id: v._id || v.id,
          type: v.vehicleType || '4-Wheeler Car / SUV',
          brand: v.brand,
          model: v.model,
          number: v.vehicleNumber,
        }));
        setVehicles(formatted);
      }
    } catch (err) {
      console.warn('Could not fetch vehicles from server:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!brand || !model || !number) return;
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const vehiclePayload = {
      vehicleType: type,
      brand: brand.trim(),
      model: model.trim(),
      vehicleNumber: number.trim().toUpperCase(),
      userId: user?._id || user?.id || 'guest_user',
      userEmail: user?.email || 'guest@tenlea.com',
      userName: user?.name || 'Vehicle Owner',
      createdAt: serverTimestamp(),
    };

    try {
      console.log('📝 [Firestore]: Adding document to "vehicles" collection...', vehiclePayload);
      const docRef = await addDoc(collection(db, 'vehicles'), vehiclePayload);
      console.log('✅ [Firestore Success]: Saved vehicle document with ID:', docRef.id);

      setSuccessMsg(`Vehicle successfully saved to Firestore! Doc ID: ${docRef.id}`);
      setVehicles((prev) => [
        {
          id: docRef.id,
          type,
          brand: vehiclePayload.brand,
          model: vehiclePayload.model,
          number: vehiclePayload.vehicleNumber,
        },
        ...prev,
      ]);

      // Sync with backend API
      try {
        await api.post('/vehicles', { ...vehiclePayload, _id: docRef.id });
      } catch (apiErr) {
        console.warn('[Backend Sync Note]:', apiErr.message);
      }

      setBrand('');
      setModel('');
      setNumber('');
    } catch (err) {
      console.error('❌ [Firestore Error]:', err.code, err.message, err);
      setErrorMsg(`Failed to save vehicle: [${err.code || 'unknown'}] ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('🗑️ [Firestore]: Deleting document from "vehicles":', id);
      await deleteDoc(doc(db, 'vehicles', id));
      console.log('✅ [Firestore Success]: Deleted vehicle ID:', id);
      setSuccessMsg(`Vehicle ${id} deleted successfully.`);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      try {
        await api.delete(`/vehicles/${id}`);
      } catch (apiErr) {
        console.warn('[Backend delete note]:', apiErr.message);
      }
    } catch (err) {
      console.error('❌ [Firestore Delete Error]:', err.code, err.message);
      setErrorMsg(`Failed to delete vehicle: [${err.code || 'unknown'}] ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">My Vehicles</h1>
            <p className="text-xs text-zinc-400 mt-1">Register vehicles for safe parking bookings & digital agreements</p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-3 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="flex-1 font-mono">{successMsg}</div>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-400 hover:text-white font-bold text-sm">✕</button>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="flex-1">{errorMsg}</div>
            <button onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-white font-bold text-sm">✕</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Form */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-zinc-900 border border-zinc-800">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-zinc-300" /> Add New Vehicle
            </h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Vehicle Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                >
                  <option>4-Wheeler Car / SUV</option>
                  <option>2-Wheeler Bike</option>
                  <option>Commercial Van</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Brand / Make</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Honda / Hyundai"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Model Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City / Creta"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Vehicle Number Plate</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KA-05-MM-1234"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-mono uppercase focus:outline-none focus:border-zinc-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                    <span>Saving to Firestore...</span>
                  </>
                ) : (
                  <span>Register Vehicle</span>
                )}
              </button>
            </form>
          </div>

          {/* Registered List */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-base font-bold text-white mb-4">Registered Fleet ({vehicles.length})</h3>

            {vehicles.length === 0 ? (
              <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-2">
                <Inbox className="w-8 h-8 text-zinc-500 mx-auto" />
                <p className="text-xs text-zinc-400">No registered vehicles yet. Use the form to add your first vehicle.</p>
              </div>
            ) : (
              vehicles.map((v) => (
                <div key={v.id} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center font-bold">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{v.brand} {v.model}</h4>
                      <span className="text-xs font-mono text-zinc-300 font-semibold">{v.number}</span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">{v.type}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(v.id)}
                    className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
};
