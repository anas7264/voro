import React, { useEffect, useState, useMemo, useId, memo } from 'react';
import { TrendingUp, Heart, Moon, Zap, Activity, Info, ShieldAlert, Clock, BarChart2 } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { Stat } from '@/components/Stat';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { validateVitals } from '@/utils/validators';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted formatters.
 * Prevents redundant object instantiation of Intl.DateTimeFormat in loops.
 */
const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

/**
 * ⚡ REFINEMENT: Clinical-grade state labels for biometric values.
 */
const getHeartRateStatus = (bpm) => {
  const val = Number(bpm);
  if (isNaN(val) || val <= 0) return { label: 'Invalid Pulse Frequency', color: 'text-gray-500' };
  if (val < 50) return { label: 'Bradycardia // Deep Recovery', color: 'text-blue-400' };
  if (val <= 60) return { label: 'Athletic Sinus Rhythm', color: 'text-voro-secondary' };
  if (val <= 80) return { label: 'Nominal Sinus Rhythm', color: 'text-voro-secondary' };
  if (val <= 100) return { label: 'Elevated Cardiac Velocity', color: 'text-voro-accent' };
  return { label: 'Tachycardia // High Stress Gradient', color: 'text-voro-danger' };
};

const getBloodPressureStatus = (bp) => {
  if (!bp || typeof bp !== 'string') return { label: 'Incomplete Pulse Data', color: 'text-gray-500' };
  const parts = bp.split('/');
  if (parts.length !== 2) return { label: 'Invalid Pressure Gradient', color: 'text-gray-500' };
  const sys = parseInt(parts[0], 10);
  const dia = parseInt(parts[1], 10);
  if (isNaN(sys) || isNaN(dia)) return { label: 'Non-numeric Tension', color: 'text-gray-500' };

  if (sys < 120 && dia < 80) return { label: 'Optimal Arterial Tension', color: 'text-voro-secondary' };
  if (sys <= 129 && dia < 80) return { label: 'Elevated Pressure Gradient', color: 'text-voro-accent' };
  if (sys <= 139 || dia <= 89) return { label: 'Stage 1 Vascular Load', color: 'text-voro-accent' };
  return { label: 'Stage 2 Vascular Crisis', color: 'text-voro-danger' };
};

const getMoodStatus = (val) => {
  if (val <= 2) return { label: 'Autonomic Collapse', color: 'text-voro-danger' };
  if (val <= 4) return { label: 'Adrenic Fatigue', color: 'text-voro-accent' };
  if (val <= 6) return { label: 'Allostatic Equanimity', color: 'text-blue-400' };
  if (val <= 8) return { label: 'Optimal Homeostasis', color: 'text-voro-secondary' };
  return { label: 'Transcendent Synthesis', color: 'text-white' };
};

const getEnergyStatus = (val) => {
  if (val <= 2) return { label: 'Metabolic Depletion', color: 'text-voro-danger' };
  if (val <= 4) return { label: 'Somatic Fatigue', color: 'text-voro-accent' };
  if (val <= 6) return { label: 'Nominal Kinetic Output', color: 'text-blue-400' };
  if (val <= 8) return { label: 'Hyper-Anabolic Resonance', color: 'text-voro-secondary' };
  return { label: 'Peak Kinetic Velocity', color: 'text-white' };
};

/**
 * ⚡ REFINEMENT: ECGMachine re-engineered as an elite, high-fidelity oscilloscope visualizer.
 * Animates a running clinical sweep and heart rate metronome synced directly to input BPM.
 */
const ECGMachine = memo(({ bpm }) => {
  const pulseDuration = useMemo(() => `${60 / Math.max(bpm, 1)}s`, [bpm]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-widest">Biosignal ECG Sweep</span>
        <span className="text-[0.55rem] font-mono font-bold text-voro-primary uppercase tracking-widest animate-pulse">
          REAL_TIME_MONITORING // {bpm} BPM
        </span>
      </div>

      <div className="relative w-full h-16 bg-[#030408] border border-white/5 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-grid-white opacity-[0.08]" />

        {/* Oscilloscope Sweeper phosphor beam effect */}
        <div className="absolute inset-y-0 w-[150px] bg-gradient-to-r from-transparent via-voro-primary/10 to-transparent pointer-events-none animate-ecg-sweep" />

        {/* The SVG ECG Waveform */}
        <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path
            d="M 0 50 L 80 50 L 90 45 L 95 55 L 100 50 L 150 50 L 155 10 L 163 90 L 169 50 L 195 50 L 205 40 L 213 50 L 280 50 L 290 45 L 295 55 L 300 50 L 350 50 L 355 10 L 363 90 L 369 50 L 395 50 L 400 50"
            fill="none"
            stroke="var(--voro-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: 'drop-shadow(0 0 4px var(--voro-primary))',
              opacity: 0.85
            }}
          />
        </svg>

        {/* Glow Halo indicating heart beat rate */}
        <div
          className="absolute right-4 w-4 h-4 rounded-full bg-voro-primary/20 flex items-center justify-center border border-voro-primary/40 animate-double-pulse"
          style={{
            '--pulse-duration': pulseDuration,
            '--pulse-color': 'var(--voro-primary)'
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-voro-primary" />
        </div>
      </div>
    </div>
  );
});

ECGMachine.displayName = "ECGMachine";

/**
 * ⚡ REFINEMENT: VitalsSlider - An ultra-luxury, accessible range slider component.
 * Features customizable thumb highlights, visual tick markers, and responsive halos.
 */
const VitalsSlider = memo(({ id, label, value, min = 1, max = 10, onChange, color = 'primary', stateLabel }) => {
  const isSecondary = color === 'secondary';
  const sliderColorClass = isSecondary ? 'custom-slider-secondary' : '';
  const progressPercent = ((value - min) / (max - min)) * 100;

  const statusInfo = stateLabel(value);

  return (
    <div className="group/slider space-y-4">
      <div className="flex justify-between items-end">
        <label
          htmlFor={id}
          className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.25em] group-hover/slider:text-white transition-colors duration-300 cursor-pointer"
        >
          {label}
        </label>
        <div className="flex items-baseline gap-2">
          <span className={`text-[0.55rem] font-mono font-bold uppercase tracking-widest ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          <span className="text-2xl font-serif italic font-bold text-white leading-none">
            {value}
            <span className="text-[0.6rem] not-italic font-sans text-gray-600 ml-1">/{max}</span>
          </span>
        </div>
      </div>

      <div className="relative flex items-center">
        {/* Slider Track background highlight */}
        <div
          className="absolute left-0 h-1.5 rounded-l-full bg-gradient-to-r pointer-events-none transition-all duration-300"
          style={{
            width: `${progressPercent}%`,
            background: isSecondary ? 'var(--voro-secondary)' : 'var(--voro-primary)',
            boxShadow: isSecondary ? '0 0 10px rgba(16, 185, 129, 0.3)' : '0 0 10px rgba(124, 58, 237, 0.3)'
          }}
        />

        <input
          id={id}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`
            custom-slider ${sliderColorClass} w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer outline-none
            focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0C14]
            ${isSecondary ? 'focus-visible:ring-voro-secondary' : 'focus-visible:ring-voro-primary'}
          `}
          aria-label={label}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
        />
      </div>

      {/* Numerical ticks beneath slider */}
      <div className="flex justify-between px-1 text-[0.45rem] font-mono font-bold text-gray-700 tracking-tighter select-none">
        {Array.from({ length: max - min + 1 }).map((_, i) => {
          const val = min + i;
          const isActive = val === value;
          return (
            <span
              key={val}
              className={`transition-colors duration-300 ${isActive ? 'text-white scale-110 font-bold' : ''}`}
            >
              {val}
            </span>
          );
        })}
      </div>
    </div>
  );
});

VitalsSlider.displayName = "VitalsSlider";

const VitalsTracker = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Subscribe only to the 'vitals' key. By deriving history directly from the
   * storage snapshot, we eliminate the initial mount-time double-render cycle.
   */
  const history = useStorageKey('vitals') || [];
  const { setItem } = useStorageMethods();
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
   * ⚡ OPTIMIZATION: Memoized recent history transformation.
   * Prevents redundant slice/reverse operations on every render.
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

      /**
       * ⚡ OPTIMIZATION: Perform immutable update on the snapshot and persist.
       * Component will reactively update via useStorageKey.
       */
      const updated = [...history, entry];
      await setItem('vitals', updated);
      addNotification('Biometric data synchronized', 'success');
    } finally {
      setIsSaving(false);
    }
  };

  const heartRateStatus = useMemo(() => getHeartRateStatus(vitals.heartRate), [vitals.heartRate]);
  const bpStatus = useMemo(() => getBloodPressureStatus(vitals.bloodPressure), [vitals.bloodPressure]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30 relative">
      {/* Dynamic styles local block to avoid polluting global scope */}
      <style>{`
        /* Slider track styling */
        .custom-slider::-webkit-slider-runnable-track {
          background: rgba(255, 255, 255, 0.05);
          height: 6px;
          border-radius: 9999px;
        }
        .custom-slider::-moz-range-track {
          background: rgba(255, 255, 255, 0.05);
          height: 6px;
          border-radius: 9999px;
        }
        /* Slider thumb styling */
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FFF;
          border: 2px solid var(--voro-primary);
          cursor: pointer;
          margin-top: -7px;
          box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px var(--voro-primary);
        }
        .custom-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FFF;
          border: 2px solid var(--voro-primary);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .custom-slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px var(--voro-primary);
        }

        /* Secondary (Green) thumb variant */
        .custom-slider-secondary::-webkit-slider-thumb {
          border-color: var(--voro-secondary) !important;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5) !important;
        }
        .custom-slider-secondary::-webkit-slider-thumb:hover {
          box-shadow: 0 0 15px var(--voro-secondary) !important;
        }
        .custom-slider-secondary::-moz-range-thumb {
          border-color: var(--voro-secondary) !important;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5) !important;
        }
        .custom-slider-secondary::-moz-range-thumb:hover {
          box-shadow: 0 0 15px var(--voro-secondary) !important;
        }

        /* ECG Sweep & Double Pulse keyframes */
        @keyframes ecg-sweep {
          0% { transform: translateX(-150px); }
          100% { transform: translateX(450px); }
        }
        .animate-ecg-sweep {
          animation: ecg-sweep 2.5s infinite linear;
        }

        @keyframes double-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          15% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 8px var(--pulse-color, #7C3AED)); }
          30% { transform: scale(1.05); opacity: 0.9; }
          45% { transform: scale(1.3); opacity: 1; filter: drop-shadow(0 0 12px var(--pulse-color, #7C3AED)); }
          60% { transform: scale(1); opacity: 0.8; }
        }
        .animate-double-pulse {
          animation: double-pulse var(--pulse-duration, 1s) infinite ease-in-out;
        }
      `}</style>

      {/* Ambient Depth Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[45vw] h-[45vw] bg-voro-primary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] bg-voro-secondary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-white opacity-[0.015] pointer-events-none" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-16 md:px-12 lg:px-20 z-10">
        <header className="mb-24 group/header">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-voro-primary">
              <Activity size={18} className="animate-pulse" />
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-voro-primary">
                Autonomic Bio-Frequency Console
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-5xl md:text-7xl font-serif italic font-medium tracking-tight text-white leading-tight">
                Biometric <span className="text-gradient not-italic font-bold">Vitals</span>
              </h1>
              <p className="text-gray-500 font-mono text-[0.65rem] uppercase tracking-[0.3em] max-w-xl leading-relaxed">
                High-fidelity physiological logging and real-time autonomic system analysis.
              </p>
            </div>

            {/* Architectural line indicator */}
            <div className="flex items-center gap-6">
              <div className="h-px w-24 bg-gradient-to-r from-voro-primary to-transparent opacity-50 group-hover/header:w-48 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <span className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-[0.4em] select-none">NODE // VITALS_MONITOR</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Input Panel: Wrapped inside luxurious Premium Card */}
          <div className="lg:col-span-8">
            <Card
              variant="premium"
              nodeId="VITALS_CORE"
              className="p-10 md:p-14 bg-[#0A0C14]/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8)]"
            >
              <div className="space-y-12">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                  <div className="p-3 bg-voro-primary/10 rounded-2xl text-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.1)]">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <span className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] block">Calibration matrix</span>
                    <h2 className="text-xl font-serif italic text-white font-bold leading-none mt-1">Somatic Acquisition</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Left Column: Direct Inputs */}
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <Input
                        label="Metabolic Pulse (bpm)"
                        type="number"
                        value={vitals.heartRate}
                        onChange={(e) => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
                        className="bg-white/[0.02] border-white/5 italic font-serif"
                        aria-describedby="heart-rate-desc"
                      />
                      <div className="flex items-baseline justify-between px-1">
                        <span id="heart-rate-desc" className="text-[0.5rem] font-mono text-gray-600 uppercase tracking-widest">Target Rest: 50-80 BPM</span>
                        <span className={`text-[0.55rem] font-mono font-bold uppercase tracking-wider ${heartRateStatus.color}`}>
                          {heartRateStatus.label}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Input
                        label="Pressure Gradient (mmHg)"
                        value={vitals.bloodPressure}
                        onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                        placeholder="120/80"
                        className="bg-white/[0.02] border-white/5 italic font-serif"
                        aria-describedby="bp-desc"
                      />
                      <div className="flex items-baseline justify-between px-1">
                        <span id="bp-desc" className="text-[0.5rem] font-mono text-gray-600 uppercase tracking-widest">Systole / Diastole tension</span>
                        <span className={`text-[0.55rem] font-mono font-bold uppercase tracking-wider ${bpStatus.color}`}>
                          {bpStatus.label}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Input
                        label="Recovery Duration (hours)"
                        type="number"
                        value={vitals.sleep}
                        onChange={(e) => setVitals({ ...vitals, sleep: Number(e.target.value) })}
                        className="bg-white/[0.02] border-white/5 italic font-serif"
                        aria-describedby="sleep-desc"
                      />
                      <span id="sleep-desc" className="text-[0.5rem] font-mono text-gray-600 uppercase tracking-widest block px-1">Target Rest: 7-9 hours per diurnal cycle</span>
                    </div>
                  </div>

                  {/* Right Column: Custom Range Sliders */}
                  <div className="space-y-8">
                    <VitalsSlider
                      id={moodId}
                      label="Neural Balance"
                      value={vitals.mood}
                      min={1}
                      max={10}
                      onChange={(val) => setVitals({ ...vitals, mood: val })}
                      color="primary"
                      stateLabel={getMoodStatus}
                    />

                    <VitalsSlider
                      id={energyId}
                      label="Kinetic Energy"
                      value={vitals.energy}
                      min={1}
                      max={10}
                      onChange={(val) => setVitals({ ...vitals, energy: val })}
                      color="secondary"
                      stateLabel={getEnergyStatus}
                    />

                    <Button
                      onClick={handleSaveVitals}
                      isLoading={isSaving}
                      className="w-full py-5 rounded-2xl bg-voro-primary text-white font-black uppercase tracking-[0.3em] text-[0.65rem] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-voro-primary/20"
                    >
                      Synchronize Vitals
                    </Button>
                  </div>
                </div>

                {/* ECG Waveform Sweeper integration */}
                <div className="border-t border-white/5 pt-8">
                  <ECGMachine bpm={vitals.heartRate} />
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Stats Panel */}
          <div className="lg:col-span-4 space-y-8">
            <Stat
              label="Metabolic Pulse"
              value={vitals.heartRate}
              unit="BPM"
              icon={Heart}
              color="voro-danger"
              nodeId="VIT_PULSE_01"
            />
            <Stat
              label="Recovery State"
              value={vitals.sleep}
              unit="HOURS"
              icon={Moon}
              color="voro-primary"
              nodeId="VIT_RECOV_02"
            />
            <Stat
              label="Energy Matrix"
              value={`${vitals.energy}/10`}
              icon={Zap}
              color="voro-accent"
              nodeId="VIT_ENG_03"
            />

            {/* Tactical System Telemetry Card */}
            <Card className="p-8 bg-white/[0.01] border-dashed border-white/10 space-y-6">
              <div className="flex items-center gap-3">
                <BarChart2 size={16} className="text-gray-500 animate-pulse-slow" />
                <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.25em] text-gray-500">Autonomous Telemetry</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[0.6rem] font-mono text-gray-500 uppercase tracking-wider">
                  <span>Heart Beat metronome:</span>
                  <span className="text-white font-bold">{(60 / Math.max(vitals.heartRate, 1)).toFixed(2)}s / beat</span>
                </div>
                <div className="flex justify-between items-center text-[0.6rem] font-mono text-gray-500 uppercase tracking-wider">
                  <span>Pulse Wave speed:</span>
                  <span className="text-white font-bold">~ 6.5 m/s (Standard)</span>
                </div>
                <div className="flex justify-between items-center text-[0.6rem] font-mono text-gray-500 uppercase tracking-wider">
                  <span>System load state:</span>
                  <span className={`font-bold ${vitals.energy >= 8 && vitals.mood >= 8 ? 'text-voro-secondary' : 'text-voro-accent'}`}>
                    {vitals.energy >= 8 && vitals.mood >= 8 ? 'NOMINAL_ECO_RESERVE' : 'STANDARD_METABOLIC_FLUX'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* History Log Timeline: Redesigned as exquisite glassmorphic timeline panels */}
        {recentHistory.length > 0 && (
          <section className="mt-24 space-y-12">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div>
                <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.4em] block mb-1">Historical Sequence</span>
                <h3 className="text-2xl font-serif italic font-bold text-white tracking-tight">Temporal Manifest</h3>
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 font-mono text-[0.45rem] text-gray-500 uppercase tracking-widest">
                ARCHIVE // SECURED
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {recentHistory.map((entry, idx) => {
                const bpmInfo = getHeartRateStatus(entry.heartRate);
                const bpInfo = getBloodPressureStatus(entry.bloodPressure);
                const moodInfo = getMoodStatus(entry.mood);
                const energyInfo = getEnergyStatus(entry.energy);

                return (
                  <Card
                    key={idx}
                    className="group p-8 bg-[#0A0C14]/60 border border-white/5 rounded-[2.5rem] hover:border-white/20 hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] transition-all duration-700 overflow-hidden relative cursor-default bg-boutique-grain"
                  >
                    {/* Tiny visual pulse halo on the card corner */}
                    <div className="absolute top-8 right-8 w-1.5 h-1.5 rounded-full bg-voro-primary shadow-[0_0_8px_rgba(124,58,237,0.8)] animate-pulse" />

                    <div className="space-y-6">
                      <div className="text-[0.55rem] font-mono font-black text-gray-600 uppercase tracking-[0.25em] border-b border-white/5 pb-4">
                        {fullDateFormatter.format(new Date(entry.date))}
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-baseline">
                          <div className="space-y-0.5">
                            <span className="text-[0.5rem] font-mono text-gray-500 uppercase tracking-widest block">Metabolic Pulse</span>
                            <span className={`text-[0.45rem] font-mono font-bold uppercase tracking-wider ${bpmInfo.color}`}>
                              {bpmInfo.label}
                            </span>
                          </div>
                          <span className="text-xl font-serif italic text-white font-bold">
                            {entry.heartRate} <span className="text-[0.55rem] not-italic font-sans text-gray-500">BPM</span>
                          </span>
                        </div>

                        <div className="flex justify-between items-baseline">
                          <div className="space-y-0.5">
                            <span className="text-[0.5rem] font-mono text-gray-500 uppercase tracking-widest block">Arterial Tension</span>
                            <span className={`text-[0.45rem] font-mono font-bold uppercase tracking-wider ${bpInfo.color}`}>
                              {bpInfo.label}
                            </span>
                          </div>
                          <span className="text-xl font-serif italic text-white font-bold">
                            {entry.bloodPressure} <span className="text-[0.55rem] not-italic font-sans text-gray-500">mmHg</span>
                          </span>
                        </div>

                        <div className="flex justify-between items-baseline">
                          <span className="text-[0.5rem] font-mono text-gray-500 uppercase tracking-widest">Recovery cycle</span>
                          <span className="text-xl font-serif italic text-white font-bold">
                            {entry.sleep} <span className="text-[0.55rem] not-italic font-sans text-gray-500">HRS</span>
                          </span>
                        </div>

                        <div className="pt-4 border-t border-white/[0.03] grid grid-cols-2 gap-4">
                          <div className="space-y-0.5">
                            <span className="text-[0.45rem] font-mono text-gray-500 uppercase tracking-widest block">Neural balance</span>
                            <span className={`text-[0.45rem] font-mono font-bold uppercase tracking-wider truncate block ${moodInfo.color}`}>
                              {moodInfo.label}
                            </span>
                          </div>
                          <div className="space-y-0.5 text-right">
                            <span className="text-[0.45rem] font-mono text-gray-500 uppercase tracking-widest block">Kinetic Energy</span>
                            <span className={`text-[0.45rem] font-mono font-bold uppercase tracking-wider truncate block ${energyInfo.color}`}>
                              {energyInfo.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default VitalsTracker;
