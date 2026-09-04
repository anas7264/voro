import React, { useEffect, useState, useMemo, useId, memo, useRef, useCallback } from 'react';
import { TrendingUp, Heart, Moon, Zap, Activity, BarChart2, Shield, Radio, Sparkles } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { Stat } from '@/components/Stat';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { validateVitals } from '@/utils/validators';
import { CachedDateTimeFormat } from '@/utils/formatters';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted cached formatters & static fallback data structures.
 * Prevents redundant object instantiation of Intl.DateTimeFormat and new Date in loops.
 */
const EMPTY_ARRAY = Object.freeze([]);
const selectVitals = (v) => (Array.isArray(v) ? v : EMPTY_ARRAY);
const TICKS_10 = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

const fullDateFormatter = new CachedDateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

/**
 * ⚡ REFINEMENT: Clinical-grade state evaluators frozen at module load time.
 */
const STATUS_LABELS = Object.freeze({
  INVALID_PULSE: Object.freeze({ label: 'Invalid Pulse Frequency', color: 'text-gray-500' }),
  BRADYCARDIA: Object.freeze({ label: 'Bradycardia // Deep Recovery', color: 'text-blue-400' }),
  ATHLETIC_SINUS: Object.freeze({ label: 'Athletic Sinus Rhythm', color: 'text-voro-secondary' }),
  NOMINAL_SINUS: Object.freeze({ label: 'Nominal Sinus Rhythm', color: 'text-voro-secondary' }),
  ELEVATED_CARDIAC: Object.freeze({ label: 'Elevated Cardiac Velocity', color: 'text-voro-accent' }),
  TACHYCARDIA: Object.freeze({ label: 'Tachycardia // High Stress Gradient', color: 'text-voro-danger' }),

  INCOMPLETE_BP: Object.freeze({ label: 'Incomplete Pulse Data', color: 'text-gray-500' }),
  INVALID_BP: Object.freeze({ label: 'Invalid Pressure Gradient', color: 'text-gray-500' }),
  NON_NUMERIC_BP: Object.freeze({ label: 'Non-numeric Tension', color: 'text-gray-500' }),
  OPTIMAL_ARTERIAL: Object.freeze({ label: 'Optimal Arterial Tension', color: 'text-voro-secondary' }),
  ELEVATED_ARTERIAL: Object.freeze({ label: 'Elevated Pressure Gradient', color: 'text-voro-accent' }),
  STAGE_1_LOAD: Object.freeze({ label: 'Stage 1 Vascular Load', color: 'text-voro-accent' }),
  STAGE_2_CRISIS: Object.freeze({ label: 'Stage 2 Vascular Crisis', color: 'text-voro-danger' }),

  MOOD_1: Object.freeze({ label: 'Autonomic Collapse', color: 'text-voro-danger' }),
  MOOD_2: Object.freeze({ label: 'Adrenic Fatigue', color: 'text-voro-accent' }),
  MOOD_3: Object.freeze({ label: 'Allostatic Equanimity', color: 'text-blue-400' }),
  MOOD_4: Object.freeze({ label: 'Optimal Homeostasis', color: 'text-voro-secondary' }),
  MOOD_5: Object.freeze({ label: 'Transcendent Synthesis', color: 'text-white' }),

  ENERGY_1: Object.freeze({ label: 'Metabolic Depletion', color: 'text-voro-danger' }),
  ENERGY_2: Object.freeze({ label: 'Somatic Fatigue', color: 'text-voro-accent' }),
  ENERGY_3: Object.freeze({ label: 'Nominal Kinetic Output', color: 'text-blue-400' }),
  ENERGY_4: Object.freeze({ label: 'Hyper-Anabolic Resonance', color: 'text-voro-secondary' }),
  ENERGY_5: Object.freeze({ label: 'Peak Kinetic Velocity', color: 'text-white' }),
});

const getHeartRateStatus = (bpm) => {
  const val = Number(bpm);
  if (isNaN(val) || val <= 0) return STATUS_LABELS.INVALID_PULSE;
  if (val < 50) return STATUS_LABELS.BRADYCARDIA;
  if (val <= 60) return STATUS_LABELS.ATHLETIC_SINUS;
  if (val <= 80) return STATUS_LABELS.NOMINAL_SINUS;
  if (val <= 100) return STATUS_LABELS.ELEVATED_CARDIAC;
  return STATUS_LABELS.TACHYCARDIA;
};

const getBloodPressureStatus = (bp) => {
  if (!bp || typeof bp !== 'string') return STATUS_LABELS.INCOMPLETE_BP;
  const parts = bp.split('/');
  if (parts.length !== 2) return STATUS_LABELS.INVALID_BP;
  const sys = parseInt(parts[0], 10);
  const dia = parseInt(parts[1], 10);
  if (isNaN(sys) || isNaN(dia)) return STATUS_LABELS.NON_NUMERIC_BP;

  if (sys < 120 && dia < 80) return STATUS_LABELS.OPTIMAL_ARTERIAL;
  if (sys <= 129 && dia < 80) return STATUS_LABELS.ELEVATED_ARTERIAL;
  if (sys <= 139 || dia <= 89) return STATUS_LABELS.STAGE_1_LOAD;
  return STATUS_LABELS.STAGE_2_CRISIS;
};

const getMoodStatus = (val) => {
  if (val <= 2) return STATUS_LABELS.MOOD_1;
  if (val <= 4) return STATUS_LABELS.MOOD_2;
  if (val <= 6) return STATUS_LABELS.MOOD_3;
  if (val <= 8) return STATUS_LABELS.MOOD_4;
  return STATUS_LABELS.MOOD_5;
};

const getEnergyStatus = (val) => {
  if (val <= 2) return STATUS_LABELS.ENERGY_1;
  if (val <= 4) return STATUS_LABELS.ENERGY_2;
  if (val <= 6) return STATUS_LABELS.ENERGY_3;
  if (val <= 8) return STATUS_LABELS.ENERGY_4;
  return STATUS_LABELS.ENERGY_5;
};

/**
 * ⚡ REFINEMENT: ECGMachine re-engineered as an elite oscilloscope visualizer
 * featuring phosphor sweep animations, live telemetry coordinate overlays, and beat pulses.
 */
const ECGMachine = memo(({ bpm }) => {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ tx: '+0.0°', ty: '+0.0°' });
  const pulseDuration = useMemo(() => `${60 / Math.max(bpm, 1)}s`, [bpm]);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);

    setCoords({
      tx: `${rotateY >= 0 ? '+' : ''}${rotateY.toFixed(1)}°`,
      ty: `${rotateX >= 0 ? '+' : ''}${rotateX.toFixed(1)}°`
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--tilt-x', '0deg');
    cardRef.current.style.setProperty('--tilt-y', '0deg');
    setCoords({ tx: '+0.0°', ty: '+0.0°' });
  }, []);

  const handleFocus = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--tilt-x', '-2deg');
    cardRef.current.style.setProperty('--tilt-y', '4deg');
    setCoords({ tx: '+4.0°', ty: '-2.0°' });
  }, []);

  const handleBlur = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--tilt-x', '0deg');
    cardRef.current.style.setProperty('--tilt-y', '0deg');
    setCoords({ tx: '+0.0°', ty: '+0.0°' });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      className="group relative space-y-4 p-6 bg-[#030408]/90 border border-white/5 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-voro-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/60 cursor-default"
      style={{
        transform: 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
        transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease'
      }}
    >
      {/* Ambient Radial Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.08), transparent 80%)'
        }}
      />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Radio size={14} className="text-voro-primary animate-pulse" />
          <span className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-widest">
            Biosignal Oscilloscope Sweep
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[0.5rem]">
          <span className="text-voro-primary font-bold uppercase tracking-widest animate-pulse">
            REAL_TIME_MONITORING // {bpm} BPM
          </span>
          <span className="text-gray-600 tracking-tighter" aria-hidden="true">
            TX_{coords.tx} TY_{coords.ty}
          </span>
        </div>
      </div>

      <div className="relative w-full h-20 bg-[#020306] border border-white/5 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-grid-white opacity-[0.08]" />

        {/* Oscilloscope Sweeper phosphor beam effect */}
        <div className="absolute inset-y-0 w-[160px] bg-gradient-to-r from-transparent via-voro-primary/15 to-transparent pointer-events-none animate-ecg-sweep" />

        {/* SVG ECG Waveform */}
        <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path
            d="M 0 50 L 80 50 L 90 45 L 95 55 L 100 50 L 150 50 L 155 10 L 163 90 L 169 50 L 195 50 L 205 40 L 213 50 L 280 50 L 290 45 L 295 55 L 300 50 L 350 50 L 355 10 L 363 90 L 369 50 L 395 50 L 400 50"
            fill="none"
            stroke="var(--voro-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: 'drop-shadow(0 0 6px var(--voro-primary))',
              opacity: 0.9
            }}
          />
        </svg>

        {/* Dynamic Cardiac Pulsing Metronome */}
        <div
          className="absolute right-4 w-5 h-5 rounded-full bg-voro-primary/20 flex items-center justify-center border border-voro-primary/50 animate-double-pulse"
          style={{
            '--pulse-duration': pulseDuration,
            '--pulse-color': 'var(--voro-primary)'
          }}
        >
          <div className="w-2 h-2 rounded-full bg-voro-primary shadow-[0_0_8px_var(--voro-primary)]" />
        </div>
      </div>
    </div>
  );
});

ECGMachine.displayName = "ECGMachine";

/**
 * ⚡ REFINEMENT: VitalsSlider - An ultra-luxury tactile range slider.
 * Integrated with 60fps focus response, custom tracks, and clinical status labels.
 */
const VitalsSlider = memo(({ id, label, value, min = 1, max = 10, onChange, color = 'primary', stateLabel }) => {
  const isSecondary = color === 'secondary';
  const sliderColorClass = isSecondary ? 'custom-slider-secondary' : '';
  const progressPercent = ((value - min) / (max - min)) * 100;
  const statusInfo = stateLabel(value);

  const ticks = useMemo(() => {
    if (min === 1 && max === 10) return TICKS_10;
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }, [min, max]);

  return (
    <div className="group/slider space-y-4 p-5 bg-white/[0.015] border border-white/5 rounded-3xl transition-all duration-300 hover:bg-white/[0.03] hover:border-white/10">
      <div className="flex justify-between items-end">
        <label
          htmlFor={id}
          className="text-[0.6rem] font-mono font-black text-gray-400 uppercase tracking-[0.25em] group-hover/slider:text-white transition-colors duration-300 cursor-pointer"
        >
          {label}
        </label>
        <div className="flex items-baseline gap-3">
          <span className={`text-[0.55rem] font-mono font-bold uppercase tracking-wider ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          <span className="text-2xl font-serif italic font-bold text-white leading-none">
            {value}
            <span className="text-[0.6rem] not-italic font-sans text-gray-500 ml-1">/{max}</span>
          </span>
        </div>
      </div>

      <div className="relative flex items-center py-1">
        {/* Slider Track background glow */}
        <div
          className="absolute left-0 h-2 rounded-l-full bg-gradient-to-r pointer-events-none transition-all duration-300"
          style={{
            width: `${progressPercent}%`,
            background: isSecondary ? 'var(--voro-secondary)' : 'var(--voro-primary)',
            boxShadow: isSecondary ? '0 0 12px rgba(16, 185, 129, 0.4)' : '0 0 12px rgba(124, 58, 237, 0.4)'
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
            custom-slider ${sliderColorClass} w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer outline-none
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
      <div className="flex justify-between px-1 text-[0.45rem] font-mono font-bold text-gray-600 tracking-tighter select-none">
        {ticks.map((val) => {
          const isActive = val === value;
          return (
            <span
              key={val}
              className={`transition-all duration-300 ${isActive ? 'text-white scale-125 font-bold text-voro-primary' : ''}`}
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

/**
 * ⚡ REFINEMENT: Volumetric 3D Historical Log Card.
 * Elevates past entries into bespoke interactive artifact nodes.
 */
const VitalsHistoryCard = memo(({ entry, bpmInfo, bpInfo, moodInfo, energyInfo }) => {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ tx: '+0.0°', ty: '+0.0°' });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);

    setCoords({
      tx: `${rotateY >= 0 ? '+' : ''}${rotateY.toFixed(1)}°`,
      ty: `${rotateX >= 0 ? '+' : ''}${rotateX.toFixed(1)}°`
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--tilt-x', '0deg');
    cardRef.current.style.setProperty('--tilt-y', '0deg');
    setCoords({ tx: '+0.0°', ty: '+0.0°' });
  }, []);

  const handleFocus = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--tilt-x', '-2deg');
    cardRef.current.style.setProperty('--tilt-y', '4deg');
    setCoords({ tx: '+4.0°', ty: '-2.0°' });
  }, []);

  const handleBlur = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--tilt-x', '0deg');
    cardRef.current.style.setProperty('--tilt-y', '0deg');
    setCoords({ tx: '+0.0°', ty: '+0.0°' });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      className="group relative p-8 bg-[#0A0C14]/70 border border-white/5 rounded-[2.5rem] hover:border-voro-primary/30 transition-all duration-500 overflow-hidden cursor-default bg-boutique-grain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/60"
      style={{
        transform: 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
        transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.7)'
      }}
    >
      {/* Dynamic Radial Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.1), transparent 80%)'
        }}
      />

      {/* Pulse Beacon */}
      <div className="absolute top-8 right-8 flex items-center gap-3">
        <span className="font-mono text-[0.45rem] text-gray-600 tracking-tighter" aria-hidden="true">
          TX_{coords.tx} TY_{coords.ty}
        </span>
        <div className="w-2 h-2 rounded-full bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.8)] animate-pulse" />
      </div>

      <div className="space-y-6 relative z-10">
        <div className="text-[0.55rem] font-mono font-black text-gray-400 uppercase tracking-[0.25em] border-b border-white/5 pb-4 flex items-center justify-between">
          <span>{entry._formattedDate}</span>
          <span className="text-[0.45rem] text-gray-600 font-normal">NODE // RECORD</span>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <div className="space-y-0.5">
              <span className="text-[0.5rem] font-mono text-gray-500 uppercase tracking-widest block">Metabolic Pulse</span>
              <span className={`text-[0.45rem] font-mono font-bold uppercase tracking-wider ${bpmInfo.color}`}>
                {bpmInfo.label}
              </span>
            </div>
            <span className="text-2xl font-serif italic text-white font-bold">
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
            <span className="text-2xl font-serif italic text-white font-bold">
              {entry.bloodPressure} <span className="text-[0.55rem] not-italic font-sans text-gray-500">mmHg</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-[0.5rem] font-mono text-gray-500 uppercase tracking-widest">Recovery cycle</span>
            <span className="text-2xl font-serif italic text-white font-bold">
              {entry.sleep} <span className="text-[0.55rem] not-italic font-sans text-gray-500">HRS</span>
            </span>
          </div>

          <div className="pt-4 border-t border-white/[0.04] grid grid-cols-2 gap-4">
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
    </div>
  );
});

VitalsHistoryCard.displayName = "VitalsHistoryCard";

const VitalsTracker = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity via selector hook.
   */
  const history = useStorageKeySelector('vitals', selectVitals);
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
   * ⚡ PERFORMANCE OPTIMIZATION: Memoized recent history transformation with pre-formatted dates and pre-calculated clinical status lookups.
   */
  const recentHistory = useMemo(() => {
    return history
      .slice(-6)
      .reverse()
      .map(entry => {
        let formattedDate = '';
        try {
          formattedDate = fullDateFormatter.format(entry.date);
        } catch (e) {
          formattedDate = entry.date;
        }
        return {
          ...entry,
          _formattedDate: formattedDate,
          bpmInfo: getHeartRateStatus(entry.heartRate),
          bpInfo: getBloodPressureStatus(entry.bloodPressure),
          moodInfo: getMoodStatus(entry.mood),
          energyInfo: getEnergyStatus(entry.energy)
        };
      });
  }, [history]);

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
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30 relative overflow-hidden">
      {/* Dynamic styles local block to avoid polluting global scope */}
      <style>{`
        /* Slider track styling */
        .custom-slider::-webkit-slider-runnable-track {
          background: rgba(255, 255, 255, 0.05);
          height: 8px;
          border-radius: 9999px;
        }
        .custom-slider::-moz-range-track {
          background: rgba(255, 255, 255, 0.05);
          height: 8px;
          border-radius: 9999px;
        }
        /* Slider thumb styling */
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #FFF;
          border: 2px solid var(--voro-primary);
          cursor: pointer;
          margin-top: -7px;
          box-shadow: 0 0 12px rgba(124, 58, 237, 0.6);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
        }
        .custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.25);
          box-shadow: 0 0 18px var(--voro-primary);
        }
        .custom-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #FFF;
          border: 2px solid var(--voro-primary);
          cursor: pointer;
          box-shadow: 0 0 12px rgba(124, 58, 237, 0.6);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
        }
        .custom-slider::-moz-range-thumb:hover {
          transform: scale(1.25);
          box-shadow: 0 0 18px var(--voro-primary);
        }

        /* Secondary (Green) thumb variant */
        .custom-slider-secondary::-webkit-slider-thumb {
          border-color: var(--voro-secondary) !important;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.6) !important;
        }
        .custom-slider-secondary::-webkit-slider-thumb:hover {
          box-shadow: 0 0 18px var(--voro-secondary) !important;
        }
        .custom-slider-secondary::-moz-range-thumb {
          border-color: var(--voro-secondary) !important;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.6) !important;
        }
        .custom-slider-secondary::-moz-range-thumb:hover {
          box-shadow: 0 0 18px var(--voro-secondary) !important;
        }

        /* ECG Sweep & Double Pulse keyframes */
        @keyframes ecg-sweep {
          0% { transform: translateX(-160px); }
          100% { transform: translateX(450px); }
        }
        .animate-ecg-sweep {
          animation: ecg-sweep 2.5s infinite linear;
        }

        @keyframes double-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          15% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 10px var(--pulse-color, #7C3AED)); }
          30% { transform: scale(1.05); opacity: 0.9; }
          45% { transform: scale(1.35); opacity: 1; filter: drop-shadow(0 0 14px var(--pulse-color, #7C3AED)); }
          60% { transform: scale(1); opacity: 0.8; }
        }
        .animate-double-pulse {
          animation: double-pulse var(--pulse-duration, 1s) infinite ease-in-out;
        }
      `}</style>

      {/* Ambient Depth Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[8%] left-[8%] w-[50vw] h-[50vw] bg-voro-primary/5 rounded-full blur-[150px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-[8%] right-[8%] w-[40vw] h-[40vw] bg-voro-secondary/5 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-white opacity-[0.015] pointer-events-none" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-16 md:px-12 lg:px-20 z-10">
        {/* Spatial Header Architecture */}
        <header className="mb-20 group/header">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-voro-primary">
                <Activity size={18} className="animate-pulse text-voro-primary" />
                <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-voro-primary">
                  Autonomic Bio-Frequency Console
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/5 font-mono text-[0.55rem] text-gray-500 uppercase tracking-widest">
                <Shield size={12} className="text-voro-secondary" />
                <span>ATTESTATION // 0xVIT_CONSOLE_E94F</span>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-5xl md:text-7xl font-serif italic font-medium tracking-tight text-white leading-tight">
                Biometric <span className="text-gradient not-italic font-bold">Vitals</span>
              </h1>
              <p className="text-gray-400 font-mono text-[0.65rem] uppercase tracking-[0.3em] max-w-xl leading-relaxed">
                High-fidelity physiological logging & real-time autonomic system analysis matrix.
              </p>
            </div>

            {/* Architectural line indicator */}
            <div className="flex items-center gap-6">
              <div className="h-px w-24 bg-gradient-to-r from-voro-primary to-transparent group-hover/header:w-56 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <span className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-[0.4em] select-none">NODE // VITALS_MONITOR_v4.2</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Input Panel */}
          <div className="lg:col-span-8">
            <Card
              variant="premium"
              nodeId="VITALS_CORE"
              className="p-8 md:p-12 bg-[#0A0C14]/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
              <div className="space-y-10">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-voro-primary/10 rounded-2xl text-voro-primary shadow-[0_0_20px_rgba(124,58,237,0.15)]">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <span className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] block">Calibration matrix</span>
                      <h2 className="text-2xl font-serif italic text-white font-bold leading-none mt-1">Somatic Acquisition</h2>
                    </div>
                  </div>
                  <Sparkles size={16} className="text-voro-primary/40 animate-pulse" />
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
                        className="bg-white/[0.02] border-white/5 italic font-serif text-lg"
                        aria-describedby="heart-rate-desc"
                      />
                      <div className="flex items-baseline justify-between px-1">
                        <span id="heart-rate-desc" className="text-[0.5rem] font-mono text-gray-500 uppercase tracking-widest">Target Rest: 50-80 BPM</span>
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
                        className="bg-white/[0.02] border-white/5 italic font-serif text-lg"
                        aria-describedby="bp-desc"
                      />
                      <div className="flex items-baseline justify-between px-1">
                        <span id="bp-desc" className="text-[0.5rem] font-mono text-gray-500 uppercase tracking-widest">Systole / Diastole tension</span>
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
                        className="bg-white/[0.02] border-white/5 italic font-serif text-lg"
                        aria-describedby="sleep-desc"
                      />
                      <span id="sleep-desc" className="text-[0.5rem] font-mono text-gray-500 uppercase tracking-widest block px-1">Target Rest: 7-9 hours per diurnal cycle</span>
                    </div>
                  </div>

                  {/* Right Column: Tactile Range Sliders */}
                  <div className="space-y-8 flex flex-col justify-between">
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

                {/* Oscilloscope Sweeper Visualizer */}
                <div className="border-t border-white/5 pt-8">
                  <ECGMachine bpm={vitals.heartRate} />
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Telemetry Panel */}
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
            <Card className="p-8 bg-[#0A0C14]/60 border border-dashed border-white/10 space-y-6 rounded-3xl">
              <div className="flex items-center gap-3">
                <BarChart2 size={16} className="text-gray-400 animate-pulse" />
                <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.25em] text-gray-400">Autonomous Telemetry</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[0.6rem] font-mono text-gray-400 uppercase tracking-wider">
                  <span>Heart Beat metronome:</span>
                  <span className="text-white font-bold">{(60 / Math.max(vitals.heartRate, 1)).toFixed(2)}s / beat</span>
                </div>
                <div className="flex justify-between items-center text-[0.6rem] font-mono text-gray-400 uppercase tracking-wider">
                  <span>Pulse Wave speed:</span>
                  <span className="text-white font-bold">~ 6.5 m/s (Standard)</span>
                </div>
                <div className="flex justify-between items-center text-[0.6rem] font-mono text-gray-400 uppercase tracking-wider">
                  <span>System load state:</span>
                  <span className={`font-bold ${vitals.energy >= 8 && vitals.mood >= 8 ? 'text-voro-secondary' : 'text-voro-accent'}`}>
                    {vitals.energy >= 8 && vitals.mood >= 8 ? 'NOMINAL_ECO_RESERVE' : 'STANDARD_METABOLIC_FLUX'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* History Log Timeline */}
        {recentHistory.length > 0 && (
          <section className="mt-24 space-y-12">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div>
                <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.4em] block mb-1">Historical Sequence</span>
                <h3 className="text-3xl font-serif italic font-bold text-white tracking-tight">Temporal Manifest</h3>
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 font-mono text-[0.5rem] text-gray-400 uppercase tracking-widest">
                ARCHIVE // SECURED
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {recentHistory.map((entry, idx) => (
                <VitalsHistoryCard
                  key={entry.date || idx}
                  entry={entry}
                  bpmInfo={entry.bpmInfo}
                  bpInfo={entry.bpInfo}
                  moodInfo={entry.moodInfo}
                  energyInfo={entry.energyInfo}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default VitalsTracker;
