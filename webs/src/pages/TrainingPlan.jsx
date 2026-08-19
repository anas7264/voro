import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Plus, Trash2, Target, Zap, Activity, ChevronRight, Download, RefreshCw, AlertTriangle, ShieldAlert, Cpu, Sparkles, Layers } from 'lucide-react';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

// Hoisted and frozen static configuration matrix to eliminate runtime object allocation
const CONFIG = Object.freeze({
  duration: Object.freeze(['4 Weeks', '8 Weeks', '12 Weeks', '16 Weeks']),
  level: Object.freeze(['Beginner', 'Intermediate', 'Advanced', 'Elite']),
  frequency: Object.freeze(['3 Days/Week', '4 Days/Week', '5 Days/Week', '6 Days/Week']),
  focus: Object.freeze(['Balanced', 'Strength', 'Hypertrophy', 'Endurance'])
});

const DIAGNOSTIC_MESSAGES = Object.freeze([
  "CALIBRATING NEUROMUSCULAR BIOMECHANICAL PARAMETERS...",
  "SYNTHESIZING PERIODIZATION VOLUME AND INTENSITY MATRIX...",
  "OPTIMIZING TENDON-STIFFNESS AND HYPERTROPHIC VECTORS...",
  "ATTESTING STRUCTURAL BLUEPRINT INTEGRITY...",
  "KINETIC MANIFEST ALIGNMENT COMPLETE."
]);

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static mock blueprint generator.
 */
const generateMockBlueprint = (selections) => {
  return Object.freeze({
    id: Date.now(),
    name: `${selections.focus} Evolution Blueprint`,
    ...selections,
    createdAt: new Date().toISOString(),
    days: [
      {
        day: 'Monday',
        type: 'Kinetic Push (Primary)',
        exercises: [
          { name: 'Barbell Bench Press', sets: 4, reps: '6-8', rest: '120s', intensity: 'RPE 8' },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '8-10', rest: '90s', intensity: 'RPE 7' },
          { name: 'Overhead Press', sets: 3, reps: '8-10', rest: '90s', intensity: 'RPE 8' },
          { name: 'Lateral Raises', sets: 4, reps: '12-15', rest: '60s', intensity: 'To Failure' },
        ]
      },
      {
        day: 'Tuesday',
        type: 'Posterior Chain Evolution',
        exercises: [
          { name: 'Deadlift (Conventional)', sets: 3, reps: '5', rest: '180s', intensity: 'RPE 9' },
          { name: 'Weighted Pull-Ups', sets: 3, reps: '6-8', rest: '120s', intensity: 'RPE 8' },
          { name: 'Seated Cable Rows', sets: 3, reps: '10-12', rest: '90s', intensity: 'RPE 8' },
          { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '60s', intensity: 'Contraction Focus' },
        ]
      },
      {
        day: 'Thursday',
        type: 'Anterior Chain / Quad Dominant',
        exercises: [
          { name: 'High Bar Back Squat', sets: 4, reps: '6-8', rest: '150s', intensity: 'RPE 8' },
          { name: 'Bulgarian Split Squats', sets: 3, reps: '10 (Per Leg)', rest: '90s', intensity: 'RPE 9' },
          { name: 'Leg Extensions', sets: 3, reps: '12-15', rest: '60s', intensity: 'Burn-out' },
          { name: 'Standing Calf Raises', sets: 4, reps: '15', rest: '60s', intensity: 'Paused' },
        ]
      },
      {
        day: 'Friday',
        type: 'Metabolic Optimization',
        exercises: [
          { name: 'Weighted Dips', sets: 3, reps: '8-10', rest: '90s', intensity: 'RPE 8' },
          { name: 'Barbell Curls', sets: 3, reps: '10-12', rest: '60s', intensity: 'Slow Eccentric' },
          { name: 'Skull Crushers', sets: 3, reps: '10-12', rest: '60s', intensity: 'Squeeze' },
          { name: 'Hanging Leg Raises', sets: 3, reps: '15', rest: '60s', intensity: 'Strict' },
        ]
      }
    ]
  });
};

/**
 * 60fps Direct-DOM Volumetric Tilt Training Card
 */
const VolumetricDayCard = React.memo(({ day, index }) => {
  const cardRef = useRef(null);
  const [telemetry, setTelemetry] = useState({ tx: 0, ty: 0 });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6; // 6deg max pitch
    const rotateY = ((x - centerX) / centerX) * 6;  // 6deg max yaw

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--tilt-x', `${rotateX}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${rotateY}deg`);

    setTelemetry({ tx: Math.round(rotateX * 10) / 10, ty: Math.round(rotateY * 10) / 10 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--tilt-x', '0deg');
    cardRef.current.style.setProperty('--tilt-y', '0deg');
    setTelemetry({ tx: 0, ty: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="region"
      aria-label={`Training Day: ${day.day} — ${day.type}`}
      style={{
        transform: 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
        transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease'
      }}
      className="group relative overflow-hidden rounded-[2.5rem] bg-[#070913]/90 border border-white/5 p-8 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:border-voro-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/60 focus-visible:[transform:perspective(1000px)_rotateX(4deg)_rotateY(-2deg)]"
    >
      {/* Dynamic Laser & Ambient Backglow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 240, 255, 0.08), transparent 40%)`
        }}
      />

      {/* Dynamic Telemetry Coordinate Tag */}
      <div className="absolute top-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 font-mono text-[0.5rem] tracking-widest text-voro-primary/80">
        <span>TX_{telemetry.tx}°</span>
        <span>TY_{telemetry.ty}°</span>
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-voro-primary font-serif italic font-bold text-xl shadow-inner group-hover:scale-110 group-hover:border-voro-primary/40 transition-all duration-500">
              {day.day[0]}
            </div>
            <div>
              <span className="text-[0.55rem] font-mono font-bold text-voro-primary/80 uppercase tracking-[0.3em] block mb-0.5">{day.day}</span>
              <h4 className="text-xl font-serif italic font-semibold text-white tracking-tight">{day.type}</h4>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-600 group-hover:text-voro-primary group-hover:translate-x-1 transition-all duration-300" />
        </div>

        {/* Exercises Table Matrix */}
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-4 text-[0.55rem] font-mono font-black text-gray-600 uppercase tracking-[0.2em] px-4 pb-1">
            <div className="col-span-5">Movement Pattern</div>
            <div className="col-span-2 text-center">Volume</div>
            <div className="col-span-2 text-center">Temporal</div>
            <div className="col-span-3 text-right">Intensity</div>
          </div>

          <div className="space-y-2">
            {day.exercises.map((ex, exIdx) => (
              <div
                key={exIdx}
                className="grid grid-cols-12 gap-4 items-center p-4 rounded-2xl bg-white/[0.015] border border-white/5 hover:bg-white/[0.03] hover:border-voro-primary/20 transition-all duration-300 group/row"
              >
                <div className="col-span-5">
                  <span className="text-xs font-bold text-gray-200 group-hover/row:text-white transition-colors block">{ex.name}</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-xs font-mono font-bold text-voro-primary">{ex.sets} × {ex.reps}</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-[0.65rem] font-mono text-gray-400">{ex.rest}</span>
                </div>
                <div className="col-span-3 text-right">
                  <span className="text-[0.55rem] font-mono font-bold uppercase tracking-widest text-voro-secondary bg-voro-secondary/10 border border-voro-secondary/20 px-3 py-1 rounded-full inline-block">
                    {ex.intensity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

const TrainingPlan = () => {
  const plansData = useStorageKey('plans') || {};
  const { updateItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  const [isGenerating, setIsGenerating] = useState(false);
  const [initSequenceComplete, setInitSequenceComplete] = useState(false);
  const [diagnosticIndex, setDiagnosticIndex] = useState(0);
  const [confirmingPurge, setConfirmingPurge] = useState(false);

  const [selections, setSelections] = useState({
    duration: '12 Weeks',
    level: 'Intermediate',
    frequency: '4 Days/Week',
    focus: 'Balanced'
  });

  useEffect(() => {
    document.title = 'VORO | Kinetic Blueprint Architecture';

    // Cinematic loading sequence (bypassable in test environment)
    const isTestMode = typeof window !== 'undefined' && (window.__VORO_TEST_BYPASS__ || localStorage.getItem('voro_test_mode') === 'true');
    if (isTestMode) {
      setInitSequenceComplete(true);
      return;
    }

    const interval = setInterval(() => {
      setDiagnosticIndex((prev) => {
        if (prev < DIAGNOSTIC_MESSAGES.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 450);

    const timer = setTimeout(() => {
      setInitSequenceComplete(true);
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  // Self-canceling double-confirmation timer for plan purge
  useEffect(() => {
    if (confirmingPurge) {
      const timer = setTimeout(() => setConfirmingPurge(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmingPurge]);

  const currentPlan = useMemo(() => plansData.currentPlan || null, [plansData.currentPlan]);

  const handleGeneratePlan = useCallback(async () => {
    setIsGenerating(true);
    const isTestMode = typeof window !== 'undefined' && (window.__VORO_TEST_BYPASS__ || localStorage.getItem('voro_test_mode') === 'true');

    setTimeout(async () => {
      const plan = generateMockBlueprint(selections);
      await updateItem('plans', { currentPlan: plan });
      setIsGenerating(false);
      addNotification('Kinetic Blueprint synthesized successfully.', 'success');
    }, isTestMode ? 100 : 1500);
  }, [selections, updateItem, addNotification]);

  const handlePurgePlan = useCallback(async () => {
    if (confirmingPurge) {
      await updateItem('plans', { currentPlan: null });
      setConfirmingPurge(false);
      addNotification('Kinetic Blueprint archived to void.', 'info');
    } else {
      setConfirmingPurge(true);
    }
  }, [confirmingPurge, updateItem, addNotification]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 relative overflow-x-hidden">
      {/* Ambient Background Architect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Cinematic Orbital Alignment Loader Sequence */}
      {!initSequenceComplete && (
        <div className="fixed inset-0 z-50 bg-[#020408] flex flex-col items-center justify-center p-6 space-y-8 animate-fade-in">
          <div className="relative flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border border-voro-primary/20 animate-[spin_8s_linear_infinite]" />
            <div className="absolute w-32 h-32 rounded-full border border-voro-secondary/30 border-t-voro-secondary animate-[spin_4s_linear_infinite_reverse]" />
            <div className="absolute w-24 h-24 rounded-full border border-voro-primary/40 border-b-voro-primary animate-[spin_2s_linear_infinite]" />
            <Cpu size={32} className="text-voro-primary animate-pulse" />
          </div>

          <div className="text-center space-y-3 max-w-md">
            <div className="flex items-center justify-center gap-2 text-voro-primary text-[0.65rem] font-mono font-bold tracking-[0.4em] uppercase">
              <Sparkles size={14} className="animate-spin" />
              <span>Biomechanical Synthesis Engine</span>
            </div>
            <p className="text-xs font-mono text-gray-400 tracking-widest min-h-[1.5rem] transition-all duration-300">
              {DIAGNOSTIC_MESSAGES[diagnosticIndex]}
            </p>
          </div>
        </div>
      )}

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        {/* Spatial Luxury Header */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <Zap size={18} />
              <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.4em]">Synthetic Logic</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic font-medium tracking-tighter text-white leading-tight">
              Kinetic <span className="text-gradient not-italic font-bold">Blueprint</span>
            </h1>
            <p className="text-gray-400 font-mono text-[0.65rem] uppercase tracking-[0.3em] opacity-80">
              Algorithmic architectural framework for biophysical structural evolution
            </p>
          </div>

          {currentPlan && (
            <div className="flex items-center gap-4">
              <button
                aria-label="Export kinetic blueprint JSON"
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-gray-300 hover:text-white hover:border-voro-primary/40 hover:bg-voro-primary/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary"
              >
                <Download size={20} />
              </button>
              <button
                onClick={handlePurgePlan}
                aria-label={confirmingPurge ? "Confirm purging blueprint" : "Archive current blueprint"}
                className={`flex items-center gap-2 px-6 py-4 rounded-2xl border text-xs font-mono font-bold uppercase tracking-widest transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                  confirmingPurge
                    ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
                    : 'bg-white/[0.02] border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30'
                }`}
              >
                <Trash2 size={18} />
                <span>{confirmingPurge ? 'PURGE?' : 'Archive'}</span>
              </button>
            </div>
          )}
        </header>

        <div className="grid grid-cols-12 gap-12">
          {/* Parameter Configuration Enclave */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <section
              tabIndex={0}
              role="region"
              aria-label="Parameter Synthesis Form Matrix"
              className="bg-[#070913]/90 border border-white/10 p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden backdrop-blur-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/60"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-voro-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />

              <div className="relative space-y-10">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-[0.65rem] font-mono font-black text-voro-primary uppercase tracking-[0.4em]">Parameter Synthesis</h3>
                  <Cpu size={16} className="text-gray-500" />
                </div>

                {Object.entries(CONFIG).map(([key, options]) => (
                  <div key={key} className="space-y-3">
                    <label className="text-[0.55rem] font-mono font-bold text-gray-400 uppercase tracking-[0.3em] ml-1 block">{key}</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelections((prev) => ({ ...prev, [key]: opt }))}
                          aria-pressed={selections[key] === opt}
                          aria-label={`Select ${key}: ${opt}`}
                          className={`
                            px-4 py-3.5 rounded-2xl text-[0.6rem] font-mono font-bold uppercase tracking-widest transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary
                            ${
                              selections[key] === opt
                                ? 'bg-voro-primary text-black font-extrabold shadow-lg shadow-voro-primary/25 border border-voro-primary/60'
                                : 'bg-white/[0.02] text-gray-400 hover:bg-white/5 hover:text-white border border-white/5'
                            }
                          `}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleGeneratePlan}
                  disabled={isGenerating}
                  aria-label="Initiate synthesis of kinetic training blueprint"
                  className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-gradient-to-r from-voro-primary to-cyan-400 text-black text-[0.7rem] font-black uppercase tracking-[0.4em] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-voro-primary/20 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={18} className="animate-spin text-black" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={18} className="text-black" />
                      <span>Initiate Synthesis</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {!currentPlan && (
              <section className="p-8 rounded-[2.5rem] bg-gradient-to-br from-voro-primary/10 via-voro-primary/5 to-transparent border border-voro-primary/20 backdrop-blur-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-voro-primary/20 border border-voro-primary/40 flex items-center justify-center">
                    <Target size={18} className="text-voro-primary" />
                  </div>
                  <h4 className="text-[0.65rem] font-mono font-black uppercase tracking-[0.2em] text-white">System Advisory</h4>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed font-mono opacity-90">
                  Each blueprint is algorithmically synthesized based on selected biological parameters to optimize periodized structural adaptation and metabolic stimulus.
                </p>
              </section>
            )}
          </div>

          {/* Resultant Blueprint Matrix Enclave */}
          <div className="col-span-12 lg:col-span-8">
            {currentPlan ? (
              <div className="space-y-10 animate-fade-in">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-white/5">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-serif italic font-bold text-white tracking-tight">{currentPlan.name}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[0.6rem] font-mono font-bold text-voro-primary uppercase tracking-widest">{currentPlan.level} Protocol</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                      <span className="text-[0.6rem] font-mono font-bold text-gray-400 uppercase tracking-widest">{currentPlan.duration}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                      <span className="text-[0.6rem] font-mono font-bold text-voro-secondary uppercase tracking-widest">{currentPlan.frequency}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 px-4 py-2 bg-voro-primary/10 border border-voro-primary/30 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-voro-primary animate-ping" />
                    <span className="text-[0.55rem] font-mono font-bold text-voro-primary uppercase tracking-widest">Active Manifest</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {currentPlan.days.map((day, idx) => (
                    <VolumetricDayCard key={day.day} day={day} index={idx} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[480px] flex flex-col items-center justify-center p-12 space-y-8 border border-dashed border-white/10 rounded-[3.5rem] bg-[#070913]/50 backdrop-blur-xl text-center">
                <div className="relative">
                  <div className="w-28 h-28 rounded-[2.5rem] bg-[#0A0D1B] border border-white/10 flex items-center justify-center shadow-2xl">
                    <Layers size={40} className="text-voro-primary/80 animate-pulse" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-voro-primary/20 border border-voro-primary/40 flex items-center justify-center shadow-lg">
                    <Plus size={18} className="text-voro-primary" />
                  </div>
                </div>

                <div className="space-y-3 max-w-sm">
                  <h3 className="text-2xl font-serif italic font-medium text-white tracking-tight">Kinetic Void Matrix</h3>
                  <p className="text-gray-400 font-mono text-xs leading-relaxed">
                    Awaiting parameter input to synthesize your periodized biomechanical training protocol.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPlan;
