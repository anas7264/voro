import React, { useEffect, useMemo } from 'react';
import { Plus, Download, Layout, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorageKey } from '@/hooks/useStorage';

const SavedMealPlans = () => {
  const navigate = useNavigate();
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad useStorage() with useStorageKey('plans') for specific data.
   * ESTIMATED IMPACT: Eliminates redundant re-renders and O(N) mount-time syncs.
   */
  const plansData = useStorageKey('plans') || {};

  useEffect(() => {
    document.title = 'VORO | Saved Meal Plans';
  }, []);

  const plans = useMemo(() => plansData.savedMealPlans || [], [plansData]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24">
      {/* Ambient Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary mb-4">
              <Layout size={18} />
              <span className="text-[0.6rem] font-mono font-bold uppercase tracking-[0.4em]">Nutritional Logic Archive</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tight leading-tight">
              Saved Meal <span className="text-voro-primary not-italic font-bold">Plans</span>
            </h1>
          </div>

          <Button
            onClick={() => navigate('/nutrition/meal-planner')}
            className="px-10 py-5 shadow-2xl shadow-voro-primary/20"
          >
            <Plus size={18} className="mr-3" />
            Synthesize New Plan
          </Button>
        </header>

        {plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <Card
                key={plan.id}
                className="group relative p-8 bg-[#0A0C14] border-white/5 hover:border-voro-primary/20 transition-all duration-700 shadow-2xl overflow-hidden animate-slide-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-voro-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-voro-primary/10 transition-colors duration-1000" />

                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-2xl font-serif italic font-medium text-white tracking-tight group-hover:text-voro-primary transition-colors">
                    {plan.name}
                  </h3>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <Calendar size={16} className="text-gray-600" />
                  </div>
                </div>

                <div className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest mb-10 flex items-center gap-3">
                  <span>{new Date(plan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <div className="w-1 h-1 rounded-full bg-gray-800" />
                  <span>{plan.days?.length || 0} Days</span>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-all mb-10">
                   <div className="flex items-center justify-between mb-1">
                      <span className="text-[0.5rem] font-black text-gray-700 uppercase tracking-widest">Mean Energy</span>
                      <span className="text-voro-primary font-mono text-[0.6rem] font-bold">NOMINAL</span>
                   </div>
                   <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-serif italic font-bold text-white">
                        {Math.round(plan.days?.reduce((sum, day) => sum + day.calories, 0) / (plan.days?.length || 1))}
                      </span>
                      <span className="text-[0.6rem] font-mono text-gray-700 uppercase tracking-widest">kcal / day</span>
                   </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1 py-4 text-[0.65rem] font-black uppercase tracking-[0.2em] group-hover:bg-white group-hover:text-black transition-all">
                    View Matrix
                  </Button>
                  <button
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-700 hover:text-white hover:border-white/20 transition-all"
                    aria-label="Export plan"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-32 text-center border-dashed border-white/5 bg-transparent">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
               <Layout size={40} className="text-gray-800" />
            </div>
            <h3 className="text-2xl font-serif italic font-bold text-white mb-2">Protocol Void</h3>
            <p className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em]">No saved nutritional strategies found</p>
            <Button
              onClick={() => navigate('/nutrition/meal-planner')}
              className="mt-10 px-12"
            >
              Begin Synthesis
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SavedMealPlans;
