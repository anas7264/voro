import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Plus, Trash2, Target, Zap, Activity, ChevronRight, Download } from 'lucide-react';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import Card from '@/components/Card';
import Button from '@/components/Button';

const CONFIG = {
  duration: ['4 Weeks', '8 Weeks', '12 Weeks', '16 Weeks'],
  level: ['Beginner', 'Intermediate', 'Advanced', 'Elite'],
  frequency: ['3 Days/Week', '4 Days/Week', '5 Days/Week', '6 Days/Week'],
  focus: ['Balanced', 'Strength', 'Hypertrophy', 'Endurance']
};

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static mock blueprint generator.
 */
const generateMockBlueprint = (selections) => {
  return {
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
  };
};

const TrainingPlan = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad useStorage() with useStorageKey('plans') for reactive data
   * and useStorageMethods for stable action references.
   */
  const plansData = useStorageKey('plans') || {};
  const { updateItem } = useStorageMethods();
  const { addNotification } = useNotifications();
  const [isGenerating, setIsGenerating] = useState(false);

  const [selections, setSelections] = useState({
    duration: '12 Weeks',
    level: 'Intermediate',
    frequency: '4 Days/Week',
    focus: 'Balanced'
  });

  useEffect(() => {
    document.title = 'VORO | Kinetic Blueprint';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Synchronous data derivation.
   */
  const currentPlan = useMemo(() => plansData.currentPlan || null, [plansData.currentPlan]);

  const handleGeneratePlan = useCallback(async () => {
    setIsGenerating(true);

    // Simulate deep synthesis
    setTimeout(async () => {
      const plan = generateMockBlueprint(selections);
      await updateItem('plans', { currentPlan: plan });
      setIsGenerating(false);
      addNotification('Kinetic Blueprint synthesized successfully.', 'success');
    }, 1500);
  }, [selections, updateItem, addNotification]);

  const clearPlan = useCallback(async () => {
    // Efficiently remove only the currentPlan from the 'plans' object
    await updateItem('plans', { currentPlan: null });
    addNotification('Blueprint archived.', 'info');
  }, [updateItem, addNotification]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30">
      {/* Ambient Background Architect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <Zap size={18} />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.4em]">Synthetic Logic</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-serif italic font-medium tracking-tighter text-white leading-tight">
              Kinetic <span className="text-gradient not-italic font-bold">Blueprint</span>
            </h1>
            <p className="text-gray-500 font-mono text-[0.65rem] uppercase tracking-[0.3em] opacity-60">
              Architectural framework for structural evolution
            </p>
          </div>

          {currentPlan && (
            <div className="flex gap-4">
              <button className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white transition-all">
                <Download size={20} />
              </button>
              <button
                onClick={clearPlan}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-400 hover:text-red-400 transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </header>

        <div className="grid grid-cols-12 gap-12">
          {/* Parameter Configuration Matrix */}
          <div className="col-span-12 lg:col-span-4 space-y-10">
            <section className="bg-[#0A0C14] border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-voro-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

               <div className="relative space-y-12">
                  <h3 className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.4em]">Parameter Synthesis</h3>

                  {Object.entries(CONFIG).map(([key, options]) => (
                    <div key={key} className="space-y-4">
                      <label className="text-[0.55rem] font-mono font-bold text-gray-700 uppercase tracking-[0.3em] ml-1">{key}</label>
                      <div className="grid grid-cols-2 gap-2">
                        {options.map(opt => (
                          <button
                            key={opt}
                            onClick={() => setSelections(prev => ({ ...prev, [key]: opt }))}
                            className={`
                              px-4 py-3 rounded-xl text-[0.6rem] font-black uppercase tracking-widest transition-all duration-500
                              ${selections[key] === opt
                                ? 'bg-voro-primary text-white shadow-lg shadow-voro-primary/20'
                                : 'bg-white/[0.02] text-gray-600 hover:bg-white/5 border border-white/5'}
                            `}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleGeneratePlan}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-4 py-6 rounded-2xl bg-white text-black text-[0.7rem] font-black uppercase tracking-[0.4em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl disabled:opacity-50"
                  >
                    {isGenerating ? (
                       <Activity size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Plus size={18} />
                        <span>Initiate Synthesis</span>
                      </>
                    )}
                  </button>
               </div>
            </section>

            {!currentPlan && (
              <section className="p-10 rounded-[3rem] bg-gradient-to-br from-voro-primary/10 to-transparent border border-voro-primary/20">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-10 h-10 rounded-full bg-voro-primary flex items-center justify-center">
                      <Target size={20} className="text-white" />
                   </div>
                   <h4 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white">System Advisory</h4>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed font-medium">
                  Each blueprint is algorithmically generated based on selected biological parameters to ensure optimal structural adaptation and metabolic efficiency.
                </p>
              </section>
            )}
          </div>

          {/* Resultant Blueprint Matrix */}
          <div className="col-span-12 lg:col-span-8">
            {currentPlan ? (
              <div className="space-y-12 animate-fade-in">
                <div className="flex items-center justify-between px-4">
                   <div>
                      <h2 className="text-3xl font-serif italic font-bold text-white tracking-tight">{currentPlan.name}</h2>
                      <div className="flex gap-4 mt-2">
                        <span className="text-[0.55rem] font-mono font-bold text-voro-primary uppercase tracking-widest">{currentPlan.level}</span>
                        <div className="w-1 h-1 rounded-full bg-gray-800 self-center" />
                        <span className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-widest">{currentPlan.duration}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-voro-secondary animate-pulse" />
                      <span className="text-[0.55rem] font-black text-voro-secondary uppercase tracking-widest">Active Manifest</span>
                   </div>
                </div>

                <div className="space-y-8">
                  {currentPlan.days.map((day, idx) => (
                    <Card
                      key={day.day}
                      className="p-0 overflow-hidden bg-[#0A0C14] border-white/5 animate-slide-up"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-voro-primary font-serif italic font-bold text-xl">
                              {day.day[0]}
                           </div>
                           <div>
                              <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-[0.3em]">{day.day}</span>
                              <h4 className="text-xl font-serif italic font-medium text-white tracking-tight mt-1">{day.type}</h4>
                           </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-800" />
                      </div>

                      <div className="p-8">
                        <div className="grid grid-cols-12 gap-4 text-[0.55rem] font-black text-gray-700 uppercase tracking-[0.2em] mb-6 px-4">
                           <div className="col-span-5">Movement Pattern</div>
                           <div className="col-span-2 text-center">Volume</div>
                           <div className="col-span-2 text-center">Temporal</div>
                           <div className="col-span-3 text-right">Intensity</div>
                        </div>

                        <div className="space-y-3">
                          {day.exercises.map((ex, exIdx) => (
                            <div key={exIdx} className="grid grid-cols-12 gap-4 items-center p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-voro-primary/20 transition-all group">
                               <div className="col-span-5">
                                  <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{ex.name}</span>
                               </div>
                               <div className="col-span-2 text-center">
                                  <span className="text-xs font-mono font-bold text-voro-primary">{ex.sets} × {ex.reps}</span>
                               </div>
                               <div className="col-span-2 text-center">
                                  <span className="text-[0.65rem] font-mono text-gray-500">{ex.rest}</span>
                               </div>
                               <div className="col-span-3 text-right">
                                  <span className="text-[0.6rem] font-black uppercase tracking-widest text-gray-600 bg-white/[0.02] px-3 py-1 rounded-full">{ex.intensity}</span>
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-40 space-y-12 border border-dashed border-white/5 rounded-[4rem] bg-white/[0.01]">
                <div className="relative">
                   <div className="w-32 h-32 rounded-[3rem] bg-[#0A0C14] border border-white/5 flex items-center justify-center shadow-2xl">
                      <Activity size={48} className="text-gray-800 animate-pulse" />
                   </div>
                   <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-voro-primary/10 border border-voro-primary/30 flex items-center justify-center">
                      <Plus size={20} className="text-voro-primary" />
                   </div>
                </div>

                <div className="text-center space-y-4 max-w-sm">
                   <h3 className="text-3xl font-serif italic font-medium text-white tracking-tight">Void Manifest</h3>
                   <p className="text-gray-500 font-medium leading-relaxed px-8">
                      Awaiting biological parameter input to synthesize your structural evolution blueprint.
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
