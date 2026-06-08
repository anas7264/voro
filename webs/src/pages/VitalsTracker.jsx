import React, { useEffect, useState, useMemo, useId } from 'react';
import { TrendingUp, Heart, Moon, Zap, Activity } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { Stat } from '@/components/Stat';
import { useStorage } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { validateVitals } from '@/utils/validators';

const VitalsTracker = () => {
  const { setItem, storageData } = useStorage();
  const { addNotification } = useNotifications();
  const [vitals, setVitals] = useState({
    heartRate: 72,
    bloodPressure: '120/80',
    sleep: 7,
    mood: 8,
    energy: 8,
  });
  const [isSaving, setIsSaving] = useState(false);

  const moodId = useId();
  const energyId = useId();

  useEffect(() => {
    document.title = 'VORO | Biometric Vitals';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Synchronous data derivation using useMemo.
   * Eliminates the fetch-on-mount double-render cycle and ensures
   * the history remains reactive to storage updates without local state sync.
   */
  const history = useMemo(() => storageData['vitals'] || [], [storageData['vitals']]);

  /**
   * ⚡ OPTIMIZATION: Memoized recent history transformation.
   * Prevents redundant slice/reverse operations on every render (e.g. slider moves).
   */
  const recentHistory = useMemo(() => history.slice(-6).reverse(), [history]);

  const handleSaveVitals = async () => {
    const { valid, errors } = validateVitals(vitals);

    if (!valid) {
      const errorMsg = Object.values(errors).join('. ');
      addNotification(`Validation failed: ${errorMsg}`, 'error');
      return;
    }

    setIsSaving(true);
    try {
      const entry = {
        date: new Date().toISOString(),
        ...vitals,
      };

      // ⚡ OPTIMIZATION: Use base storage keys and setItem directly.
      const updated = [...history, entry];
      await setItem('vitals', updated);
      addNotification('Biometric data synchronized', 'success');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[35%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <Activity size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Neural & Biological Status</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif italic font-medium tracking-tight text-white leading-tight">
              Biometric <span className="text-gradient not-italic font-bold">Vitals</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-widest text-xs uppercase opacity-60">High-fidelity physiological manifestation tracking</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-8">
            <section className="bg-[#0A0C14] border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-12">Data Acquisition</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <Input
                    label="Metabolic Pulse (bpm)"
                    type="number"
                    value={vitals.heartRate}
                    onChange={(e) => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
                    className="bg-white/[0.02] border-white/5 italic font-serif"
                  />
                  <Input
                    label="Pressure Gradient (mmHg)"
                    value={vitals.bloodPressure}
                    onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                    placeholder="120/80"
                    className="bg-white/[0.02] border-white/5 italic font-serif"
                  />
                  <Input
                    label="Recovery Duration (hours)"
                    type="number"
                    value={vitals.sleep}
                    onChange={(e) => setVitals({ ...vitals, sleep: Number(e.target.value) })}
                    className="bg-white/[0.02] border-white/5 italic font-serif"
                  />
                </div>

                <div className="space-y-12">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <label htmlFor={moodId} className="text-[0.6rem] font-black text-gray-600 uppercase tracking-[0.2em] cursor-pointer">Neural Balance</label>
                      <span className="text-2xl font-serif italic text-white">{vitals.mood}<span className="text-[0.6rem] not-italic font-sans text-gray-600 ml-1">/10</span></span>
                    </div>
                    <input
                      id={moodId}
                      type="range"
                      min="1"
                      max="10"
                      value={vitals.mood}
                      onChange={(e) => setVitals({ ...vitals, mood: Number(e.target.value) })}
                      className="w-full accent-voro-primary h-1 bg-white/5 rounded-full appearance-none cursor-pointer focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0C14] outline-none transition-all"
                      aria-label="Neural Balance (1-10)"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <label htmlFor={energyId} className="text-[0.6rem] font-black text-gray-600 uppercase tracking-[0.2em] cursor-pointer">Kinetic Energy</label>
                      <span className="text-2xl font-serif italic text-white">{vitals.energy}<span className="text-[0.6rem] not-italic font-sans text-gray-600 ml-1">/10</span></span>
                    </div>
                    <input
                      id={energyId}
                      type="range"
                      min="1"
                      max="10"
                      value={vitals.energy}
                      onChange={(e) => setVitals({ ...vitals, energy: Number(e.target.value) })}
                      className="w-full accent-voro-secondary h-1 bg-white/5 rounded-full appearance-none cursor-pointer focus-visible:ring-2 focus-visible:ring-voro-secondary focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0C14] outline-none transition-all"
                      aria-label="Kinetic Energy (1-10)"
                    />
                  </div>
                  <Button
                    onClick={handleSaveVitals}
                    isLoading={isSaving}
                    className="w-full py-5 rounded-2xl bg-voro-primary text-white font-black uppercase tracking-[0.3em] text-[0.65rem] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-voro-primary/20"
                  >
                    Synchronize Vitals
                  </Button>
                </div>
              </div>
            </section>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-4 space-y-6">
            <Stat
              label="Metabolic Pulse"
              value={vitals.heartRate}
              unit="BPM"
              icon={Heart}
              color="voro-danger"
            />
            <Stat
              label="Recovery State"
              value={vitals.sleep}
              unit="HOURS"
              icon={Moon}
              color="voro-primary"
            />
             <Stat
              label="Energy Matrix"
              value={`${vitals.energy}/10`}
              icon={Zap}
              color="voro-accent"
            />
          </div>
        </div>

        {/* History */}
        {recentHistory.length > 0 && (
          <section className="mt-16 bg-[#0A0C14] border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-xl">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em]">Temporal Manifest</h3>
              <TrendingUp size={18} className="text-gray-700" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {recentHistory.map((entry, idx) => (
                <div key={idx} className="group p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-white/10 transition-all">
                  <div className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest mb-4">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[0.65rem] font-bold text-gray-500 uppercase">Pulse</span>
                      <span className="text-white font-serif italic">{entry.heartRate} <span className="text-[0.5rem] not-italic text-gray-600 font-sans">BPM</span></span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[0.65rem] font-bold text-gray-500 uppercase">Sleep</span>
                      <span className="text-white font-serif italic">{entry.sleep} <span className="text-[0.5rem] not-italic text-gray-600 font-sans">HRS</span></span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[0.65rem] font-bold text-gray-500 uppercase">Mood / Energy</span>
                      <span className="text-white font-serif italic">{entry.mood} / {entry.energy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default VitalsTracker;
