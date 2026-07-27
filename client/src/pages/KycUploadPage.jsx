import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ShieldCheck, Upload, ArrowRight, CheckCircle2 } from 'lucide-react';

export const KycUploadPage = () => {
  const [docType, setDocType] = useState('AADHAAR');
  const [docNumber, setDocNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl">
          
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              Identity Verification
            </span>
            <h1 className="text-3xl font-extrabold font-display text-white mt-3">Complete KYC Verification</h1>
            <p className="text-sm text-zinc-400 mt-1">Upload government identity documents to unlock verified landowner/driver status</p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-700 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-800 text-white flex items-center justify-center mx-auto text-2xl font-bold border border-zinc-700">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white">KYC Documents Submitted</h3>
              <p className="text-sm text-zinc-400">Your documents have been uploaded and are under review by TENLEA compliance team.</p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-all"
              >
                Back to Home
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Government ID Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                >
                  <option value="AADHAAR">Aadhaar Card</option>
                  <option value="PAN">PAN Card</option>
                  <option value="DRIVING_LICENSE">Driving License</option>
                  <option value="PASSPORT">Passport</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Document ID Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1234 5678 9012"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-dashed border-zinc-700 text-center space-y-2">
                <Upload className="w-8 h-8 text-zinc-400 mx-auto" />
                <div className="text-xs font-bold text-white">Upload Front & Back Document Photo</div>
                <div className="text-[10px] text-zinc-400">JPG, PNG or PDF (Max 10MB)</div>
                <button type="button" className="px-4 py-1.5 rounded-lg bg-zinc-800 text-xs font-semibold text-white mt-2 border border-zinc-700 hover:bg-zinc-700">
                  Select File
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>Submit KYC Documents</span>
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
