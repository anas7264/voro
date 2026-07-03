import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Plus, Trash2, Heart, Zap, Target, Activity, ChevronRight, ShieldCheck } from 'lucide-react';
import { Button, Card, Badge, Tag, Input, Modal } from '@/components';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static nutrient metadata.
 * Prevents redundant object instantiation and useMemo overhead on every render cycle.
 */
const NUTRIENTS = [
  { id: 'vitamin_d', name: 'Vitamin D', unit: 'IU', dailyGoal: 2000, warning: 'Low levels linked to poor mood and immunity', color: '#F59E0B' },
  { id: 'iron', name: 'Iron', unit: 'mg', dailyGoal: 18, warning: 'Essential for oxygen transport', color: '#EF4444' },
  { id: 'magnesium', name: 'Magnesium', unit: 'mg', dailyGoal: 420, warning: 'Critical for muscle recovery', color: '#7C3AED' },
  { id: 'zinc', name: 'Zinc', unit: 'mg', dailyGoal: 11, warning: 'Immune system support', color: '#10B981' },
  { id: 'b12', name: 'Vitamin B12', unit: 'mcg', dailyGoal: 2.4, warning: 'Energy metabolism', color: '#3B82F6' },
  { id: 'omega3', name: 'Omega-3', unit: 'g', dailyGoal: 1.1, warning: 'Anti-inflammatory benefits', color: '#EC4899' },
];

const NutrientTracker = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Subscribe only to the relevant 'nutrient_tracker' key to avoid redundant re-renders
   * when unrelated storage items change. useStorageMethods provides stable action refs.
   */
  const tracker = useStorageKey('nutrient_tracker') || {};
  const { updateItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  const [selectedNutrientId, setSelectedNutrientId] = useState('vitamin_d');
  const [showLogModal, setShowLogModal] = useState(false);
  const [logValue, setLogValue] = useState('');

  useEffect(() => {
    document.title = 'VORO | Nutrient Tracker';
  }, []);

  const currentNutrient = useMemo(() =>
    NUTRIENTS.find(n => n.id === selectedNutrientId)
  , [selectedNutrientId]);

  const currentStatus = useMemo(() =>
    tracker[selectedNutrientId] || { intake: 0, fromFood: 0 }
  , [tracker, selectedNutrientId]);

  const percentage = useMemo(() => {
    const total = (currentStatus.intake || 0) + (currentStatus.fromFood || 0);
    return Math.min(Math.round((total / currentNutrient.dailyGoal) * 100), 100);
  }, [currentStatus, currentNutrient]);

  const handleLogIntake = useCallback(async () => {
    const val = parseFloat(logValue);
    if (isNaN(val) || val <= 0) {
      addNotification('Please enter a valid magnitude', 'error');
      return;
    }

    /**
     * ⚡ OPTIMISTIC UI: Update storage immediately.
     */
    const updatedStatus = {
      ...currentStatus,
      intake: (currentStatus.intake || 0) + val
    };

    await updateItem('nutrient_tracker', {
      [selectedNutrientId]: updatedStatus
    });

    setLogValue('');
    setShowLogModal(false);
    addNotification(`${currentNutrient.name} synthesis recorded`, 'success');
  }, [logValue, currentStatus, selectedNutrientId, currentNutrient, updateItem, addNotification]);

  const handleReset = useCallback(async (id) => {
    await updateItem('nutrient_tracker', {
      [id]: { intake: 0, fromFood: 0 }
    });
    addNotification(`${NUTRIENTS.find(n => n.id === id).name} matrix reset`, 'info');
  }, [updateItem, addNotification]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-24 selection:bg-voro-primary/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-20">
          <div className="flex items-center gap-3 text-voro-primary mb-4">
            <Heart size={18} className="animate-pulse-slow" />
            <span className="text-[0.65rem] font-black uppercase tracking-[0.4em]">Micronutrient Matrix</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-white tracking-tight leading-none mb-8">
            Nutritional <span className="text-voro-primary not-italic font-bold">Optimization</span>
          </h1>
          <div className="flex flex-wrap gap-3">
            <Tag nodeId="SYS_01">System_Ready</Tag>
            <Tag variant="voro-secondary" nodeId="BIO_01">Bio_Sync_Active</Tag>
            <Tag variant="voro-accent" nodeId="NL_01">Neural_Link</Tag>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Nutrient Selector */}
          <div className="lg:col-span-8 space-y-10">
            <Card className="p-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-voro-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-voro-primary/10 transition-colors duration-1000" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <Target size={18} className="text-voro-primary" />
                  <h3 className="text-[0.7rem] font-mono font-black uppercase tracking-[0.4em] text-white">Biological Markers</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {NUTRIENTS.map(nutrient => (
                    <button
                      key={nutrient.id}
                      onClick={() => setSelectedNutrientId(nutrient.id)}
                      className={`p-8 rounded-[2rem] border transition-all duration-500 text-left group/btn relative overflow-hidden active:scale-95 ${
                        selectedNutrientId === nutrient.id
                          ? 'bg-voro-primary/5 border-voro-primary shadow-[0_20px_40px_rgba(124,58,237,0.1)]'
                          : 'bg-white/[0.01] border-white/5 hover:border-white/20 hover:bg-white/[0.03]'
                      }`}
                    >
                      <p className={`text-[0.55rem] font-mono font-black uppercase tracking-[0.25em] mb-3 transition-colors ${selectedNutrientId === nutrient.id ? 'text-voro-primary' : 'text-gray-600'}`}>
                        {nutrient.unit} Marker
                      </p>
                      <p className={`text-lg font-serif italic font-bold tracking-tight transition-colors ${selectedNutrientId === nutrient.id ? 'text-white' : 'text-gray-400 group-hover/btn:text-white'}`}>
                        {nutrient.name}
                      </p>

                      {selectedNutrientId === nutrient.id && (
                        <div className="absolute bottom-0 left-0 h-1 bg-voro-primary animate-width-full" style={{ width: '100%' }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Card className="p-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-xl space-y-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-[0.65rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500">Intake Analysis</h4>
                  <Activity size={16} className="text-gray-700" />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl group/stat">
                    <div className="space-y-1">
                      <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-widest block">Supplementation</span>
                      <span className="text-2xl font-serif italic font-bold text-white transition-transform group-hover/stat:translate-x-1 inline-block">
                        {currentStatus.intake || 0} <span className="text-xs not-italic font-sans text-gray-500">{currentNutrient.unit}</span>
                      </span>
                    </div>
                    <Badge variant="voro-secondary" dot>Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl group/stat">
                    <div className="space-y-1">
                      <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-widest block">Dietary Flux</span>
                      <span className="text-2xl font-serif italic font-bold text-white transition-transform group-hover/stat:translate-x-1 inline-block">
                        {currentStatus.fromFood || 0} <span className="text-xs not-italic font-sans text-gray-500">{currentNutrient.unit}</span>
                      </span>
                    </div>
                    <Badge variant="gray">Passive</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-10 bg-gradient-to-br from-voro-primary/5 to-transparent border-voro-primary/10 rounded-[2.5rem] shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6 text-voro-primary">
                    <ShieldCheck size={16} />
                    <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.3em]">Clinical Insight</span>
                  </div>
                  <p className="text-2xl font-serif italic text-white leading-tight tracking-tight">
                    "{currentNutrient.warning}"
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
                   <Button
                    onClick={() => setShowLogModal(true)}
                    className="flex-1 py-4 !rounded-2xl shadow-lg shadow-voro-primary/20"
                   >
                     <Plus size={16} className="mr-2" />
                     Log Intake
                   </Button>
                   <Button
                    variant="secondary"
                    onClick={() => handleReset(selectedNutrientId)}
                    className="p-4 !rounded-2xl"
                   >
                     <Trash2 size={16} />
                   </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Metric Card */}
          <div className="lg:col-span-4">
            <Card className="p-12 h-full flex flex-col justify-center bg-[#0A0C14] border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden group/metric bg-boutique-grain">
              <div className="absolute -bottom-20 -right-20 opacity-[0.03] group-hover/metric:opacity-[0.07] transition-opacity duration-1000 rotate-12">
                <Zap size={300} />
              </div>

              <div className="relative z-10 space-y-16 text-center">
                <div className="space-y-4">
                  <p className="text-[0.65rem] font-mono font-black text-gray-500 uppercase tracking-[0.4em]">Evolutionary Goal</p>
                  <div className="flex flex-col items-center">
                    <span className="text-[8rem] font-serif italic font-medium text-white leading-[0.8] tracking-tighter">{currentNutrient.dailyGoal}</span>
                    <span className="text-xs font-mono font-bold text-voro-primary uppercase tracking-[0.5em] mt-6">{currentNutrient.unit} per cycle</span>
                  </div>
                </div>

                <div className="pt-16 border-t border-white/5">
                  <p className="text-[0.55rem] font-mono font-black text-gray-600 uppercase tracking-[0.3em] mb-10">Synthesis Progress</p>

                  <div className="relative h-64 w-64 mx-auto perspective-1000 group-hover/metric:rotate-y-12 transition-transform duration-1000">
                    <svg className="w-full h-full transform -rotate-90 overflow-visible">
                      <circle
                        cx="128"
                        cy="128"
                        r="100"
                        stroke="rgba(255,255,255,0.02)"
                        strokeWidth="16"
                        fill="none"
                      />
                      <circle
                        cx="128"
                        cy="128"
                        r="100"
                        stroke={currentNutrient.color}
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 100}`}
                        strokeDashoffset={`${2 * Math.PI * 100 * (1 - percentage / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ filter: `drop-shadow(0 0 15px ${currentNutrient.color}60)` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-serif italic font-bold text-white">{percentage}%</span>
                      <span className="text-[0.6rem] font-mono font-black text-gray-600 uppercase tracking-[0.4em] mt-2">Absorbed</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-8 pt-8">
                  <div className="text-center">
                    <p className="text-white font-mono font-bold text-lg">{((currentStatus.intake || 0) + (currentStatus.fromFood || 0)).toLocaleString()}</p>
                    <p className="text-[0.5rem] font-black text-gray-700 uppercase tracking-widest">Total</p>
                  </div>
                  <div className="h-8 w-px bg-white/5" />
                  <div className="text-center">
                    <p className="text-white font-mono font-bold text-lg">{Math.max(0, currentNutrient.dailyGoal - (currentStatus.intake || 0) - (currentStatus.fromFood || 0)).toLocaleString()}</p>
                    <p className="text-[0.5rem] font-black text-gray-700 uppercase tracking-widest">Deficit</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        title="Compound Intake Synthesis"
      >
        <div className="space-y-12">
          <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
            <h3 className="text-3xl font-serif italic font-bold text-white mb-2">{currentNutrient.name}</h3>
            <p className="text-[0.65rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em]">Protocol Adjustment</p>
          </div>

          <div className="space-y-4">
             <label className="text-[0.65rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Intake Magnitude ({currentNutrient.unit})</label>
             <Input
              type="number"
              placeholder={`Enter ${currentNutrient.unit}...`}
              value={logValue}
              onChange={(e) => setLogValue(e.target.value)}
              autoFocus
              className="!bg-[#0A0C14] border-white/10 italic font-serif text-xl p-6"
            />
          </div>

          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => setShowLogModal(false)}
              className="flex-1 py-4 !rounded-2xl"
            >
              Abort
            </Button>
            <Button
              onClick={handleLogIntake}
              disabled={!logValue}
              className="flex-[2] py-4 !rounded-2xl"
            >
              Finalize Entry
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NutrientTracker;
