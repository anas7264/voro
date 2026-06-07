import React, { useContext } from 'react';
import { ShieldAlert, Lock } from 'lucide-react';
import { StorageContext } from '../context/StorageContext';

const SecurityLockdown = () => {
  const { isCompromised } = useContext(StorageContext);

  if (!isCompromised) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#080B14]/95 backdrop-blur-3xl flex items-center justify-center p-10 animate-fade-in">
      <div className="max-w-2xl w-full text-center space-y-12">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-[2.5rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto relative z-10">
            <ShieldAlert size={64} className="text-red-500 animate-pulse" />
          </div>
          <div className="absolute -inset-8 bg-red-500/5 blur-3xl rounded-full" />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif italic text-white tracking-tight">
            Neural Shield <span className="text-red-500">Lockdown</span>
          </h1>
          <p className="text-gray-400 font-mono text-sm tracking-[0.2em] leading-relaxed uppercase">
            Security integrity violation detected. Environment has been neutralized to protect your data.
          </p>
        </div>

        <div className="pt-12 border-t border-white/[0.03] flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 text-red-400 font-mono text-[10px] tracking-[0.4em] uppercase">
            <Lock size={12} />
            Circuit Breaker Engaged
          </div>
          <p className="text-gray-500 text-xs max-w-sm mx-auto leading-loose">
            All cryptographic operations and data persistence have been halted. Please refresh the page in a secure environment.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-10 py-4 bg-white/[0.03] border border-white/10 rounded-full text-white font-mono text-[10px] tracking-[0.3em] uppercase hover:bg-white/5 transition-all active:scale-95"
          >
            Attempt Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityLockdown;
