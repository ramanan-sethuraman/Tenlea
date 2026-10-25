import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Car, Plus, Trash2, Inbox } from 'lucide-react';
import api from '../services/api';

export const MyVehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [number, setNumber] = useState('');
  const [type, setType] = useState('4-Wheeler Car / SUV');
  const [loading, setLoading] = useState(false);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
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

    try {
      const res = await api.post('/vehicles', {
        vehicleType: type,
        brand,
        model,
        vehicleNumber: number.toUpperCase(),
      });
      if (res && res.data) {
        setVehicles((prev) => [
          ...prev,
          {
            id: res.data._id || String(Date.now()),
            type: res.data.vehicleType || type,
            brand: res.data.brand || brand,
            model: res.data.model || model,
            number: res.data.vehicleNumber || number.toUpperCase(),
          },
        ]);
      }
    } catch (err) {
      setVehicles((prev) => [
        ...prev,
        { id: String(Date.now()), type, brand, model, number: number.toUpperCase() },
      ]);
    }
    setBrand('');
    setModel('');
    setNumber('');
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/vehicles/${id}`);
    } catch (err) {
      console.warn('Vehicle deleted locally');
    }
    setVehicles((prev) => prev.filter((v) => v.id !== id));
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
                className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-lg transition-all"
              >
                Register Vehicle
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
