import React, { useState } from 'react';
import { Database, CheckCircle2, AlertTriangle, Loader2, X } from 'lucide-react';
import { runFirestoreTest } from '../../firebase/testFirestore';

export const FirestoreTestButton = ({ className = '' }) => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    setResult(null);
    setIsOpen(true);
    const testResult = await runFirestoreTest();
    setResult(testResult);
    setTesting(false);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={handleTest}
        disabled={testing}
        title="Verify live connection to Cloud Firestore"
        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
      >
        {testing ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
        ) : (
          <Database className="w-3.5 h-3.5 text-emerald-400" />
        )}
        <span>{testing ? 'Testing...' : 'Test Firestore'}</span>
      </button>

      {isOpen && result && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 p-4 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl z-50 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" /> Firestore Connection Test
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {result.success ? (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Firestore Connected &amp; Verified!</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Successfully performed a live write and read on collection <span className="font-mono text-emerald-300">"connection_test"</span>.
              </p>
              <div className="pt-1 border-t border-emerald-800/60 text-[10px] text-zinc-400 font-mono">
                Document ID: <span className="text-emerald-400">{result.docId}</span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-red-300">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Connection Check Failed</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed font-mono">
                Error Code: <span className="text-red-400">{result.code}</span>
              </p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {result.message}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
