import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Trash2, Heart, Zap, Target } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';

const NutrientTracker = () => {
  const tracker = useStorageKey('nutrient_tracker') || {};
  const { setItem } = useStorageMethods();
  const [selectedNutrient, setSelectedNutrient] = useState('vitamin_d');

  useEffect(() => {
    document.title = 'VORO | Nutrient Tracker';
  }, []);

  const nutrients = useMemo(() => [
    { id: 'vitamin_d', name: 'Vitamin D', unit: 'IU', dailyGoal: 2000, warning: 'Low levels linked to poor mood and immunity', color: '#F59E0B' },
    { id: 'iron', name: 'Iron', unit: 'mg', dailyGoal: 18, warning: 'Essential for oxygen transport', color: '#EF4444' },
    { id: 'magnesium', name: 'Magnesium', unit: 'mg', dailyGoal: 420, warning: 'Critical for muscle recovery', color: '#7C3AED' },
    { id: 'zinc', name: 'Zinc', unit: 'mg', dailyGoal: 11, warning: 'Immune system support', color: '#10B981' },
    { id: 'b12', name: 'Vitamin B12', unit: 'mcg', dailyGoal: 2.4, warning: 'Energy metabolism', color: '#3B82F6' },
    { id: 'omega3', name: 'Omega-3', unit: 'g', dailyGoal: 1.1, warning: 'Anti-inflammatory benefits', color: '#EC4899' },
  ], []);


  const currentNutrient = nutrients.find(n => n.id === selectedNutrient);
  const currentStatus = tracker[selectedNutrient] || { intake: 0, fromFood: 0 };

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <header className="mb-12">
          <div className="flex items-center gap-3 text-voro-primary mb-2">
            <Heart size={18} />
            <span className="text-[0.6rem] font-black uppercase tracking-[0.3em]">Micronutrient Matrix</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif italic font-medium text-white tracking-tight">
            Nutritional <span className="text-voro-primary not-italic font-bold">Optimization</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Nutrient Selector */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <Target size={18} className="text-voro-primary" />
                <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white">Select Biological Marker</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {nutrients.map(nutrient => (
                  <button
                    key={nutrient.id}
                    onClick={() => setSelectedNutrient(nutrient.id)}
                    className={`p-6 rounded-2xl border transition-all text-left group ${
                      selectedNutrient === nutrient.id
                        ? 'bg-voro-primary/5 border-voro-primary ring-1 ring-voro-primary'
                        : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                    }`}
                  >
                    <p className={`text-[0.55rem] font-black uppercase tracking-widest mb-2 ${selectedNutrient === nutrient.id ? 'text-voro-primary' : 'text-gray-600'}`}>
                      {nutrient.unit} Marker
                    </p>
                    <p className={`text-sm font-bold tracking-tight uppercase ${selectedNutrient === nutrient.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                      {nutrient.name}
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-8 space-y-6">
                <h4 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500">Intake Statistics</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <span className="text-xs font-bold text-white uppercase tracking-tight">Supplements</span>
                    <Badge variant="voro-secondary" dot>100%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <span className="text-xs font-bold text-white uppercase tracking-tight">Dietary Sources</span>
                    <Badge variant="voro-accent">60%</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-yellow-500/5 to-transparent border-yellow-500/10">
                <div className="flex items-center gap-3 mb-4 text-yellow-500">
                  <Heart size={16} />
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.2em]">Clinical Insight</span>
                </div>
                <p className="text-lg font-serif italic text-white leading-relaxed">
                  "{currentNutrient.warning}"
                </p>
              </Card>
            </div>
          </div>

          {/* Metric Card */}
          <div className="lg:col-span-4">
            <Card className="p-10 h-full flex flex-col justify-center bg-[#0A0C14] border-white/5 relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 opacity-5">
                <Zap size={200} />
              </div>

              <div className="relative z-10 space-y-10 text-center">
                <div>
                  <p className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Metabolic Goal</p>
                  <div className="flex flex-col items-center">
                    <span className="text-7xl font-serif italic font-bold text-white leading-none">{currentNutrient.dailyGoal}</span>
                    <span className="text-xs font-mono font-bold text-voro-primary uppercase tracking-[0.4em] mt-4">{currentNutrient.unit} per cycle</span>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/5">
                  <p className="text-[0.55rem] font-black text-gray-600 uppercase tracking-widest mb-6">Synthesis Progress</p>
                  <div className="relative h-48 w-48 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke={currentNutrient.color}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 80}`}
                        strokeDashoffset={`${2 * Math.PI * 80 * 0.25}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                        style={{ filter: `drop-shadow(0 0 8px ${currentNutrient.color}40)` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-3xl font-serif italic font-bold text-white">75%</span>
                      <span className="text-[0.5rem] font-black text-gray-600 uppercase tracking-widest">Absorbed</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutrientTracker;
