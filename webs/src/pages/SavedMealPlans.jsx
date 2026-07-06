import React, { useEffect, useMemo } from 'react';
import { Plus, Download, Clipboard, Calendar, Zap, ChevronRight, Layout } from 'lucide-react';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import Button from '@/components/Button';
import Card from '@/components/Card';

const SavedMealPlans = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad useStorage() with useStorageKey('plans') to narrow subscription.
   * This ensures the component only re-renders when the 'plans' storage key is updated.
   */
  const plansData = useStorageKey('plans') || {};
  const { setItem } = useStorageMethods();

  const plans = useMemo(() => plansData.savedMealPlans || [], [plansData]);

  useEffect(() => {
    document.title = 'VORO | Plan Repository';
  }, []);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30">
      {/* Ambient Architectural Lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <Clipboard size={18} />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.4em]">Strategic Provisions</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-serif italic font-medium tracking-tighter text-white leading-tight">
              Plan <span className="text-gradient not-italic font-bold">Repository</span>
            </h1>
            <p className="text-gray-500 font-mono text-[0.65rem] uppercase tracking-[0.3em] opacity-60">
              Archived metabolic protocols and nutritional blueprints
            </p>
          </div>

          <Button
            className="group h-16 px-10 shadow-2xl shadow-voro-primary/20 text-[0.7rem] font-black uppercase tracking-[0.4em]"
          >
            <Plus size={18} className="mr-3" />
            Generate New Blueprint
          </Button>
        </header>

        {plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, idx) => {
              const avgCalories = plan.days?.reduce((sum, day) => sum + day.calories, 0) / (plan.days?.length || 1);

              return (
                <Card
                  key={plan.id}
                  className="group relative p-0 overflow-hidden bg-[#0A0C14] border-white/5 transition-all hover:border-voro-primary/20 hover:shadow-voro-primary/5 animate-slide-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-voro-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-voro-primary/10 transition-colors duration-1000" />

                  <div className="p-10 border-b border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-6 mb-8">
                       <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-voro-primary shadow-inner">
                          <Layout size={24} />
                       </div>
                       <div>
                          <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-[0.3em]">
                            {new Date(plan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <h4 className="text-2xl font-serif italic font-medium text-white tracking-tight mt-1">{plan.name}</h4>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <p className="text-[0.5rem] font-black text-gray-700 uppercase tracking-widest mb-1">Temporal Depth</p>
                        <div className="flex items-center gap-2">
                           <Calendar size={12} className="text-voro-secondary" />
                           <span className="text-sm font-mono font-bold text-white uppercase">{plan.days?.length || 0} Days</span>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <p className="text-[0.5rem] font-black text-gray-700 uppercase tracking-widest mb-1">Metabolic Mean</p>
                        <div className="flex items-center gap-2">
                           <Zap size={12} className="text-voro-accent" />
                           <span className="text-sm font-mono font-bold text-white uppercase">{Math.round(avgCalories)} kcal</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-10 flex gap-4">
                    <Button variant="secondary" className="flex-1 h-14 text-[0.6rem] font-black uppercase tracking-[0.2em] border-white/5">
                      Analyze Matrix
                    </Button>
                    <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                      <Download size={18} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 relative group">
               <div className="absolute inset-0 bg-voro-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
               <Clipboard size={32} className="text-gray-800 group-hover:text-voro-primary/50 transition-colors duration-700" />
            </div>
            <h3 className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.5em] mb-4">Repository Empty</h3>
            <p className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-widest max-w-xs leading-relaxed mb-12">
              No metabolic blueprints detected in the local archive.
            </p>
            <Button className="px-12 h-16 shadow-xl shadow-voro-primary/10">
              Synthesize First Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedMealPlans;
