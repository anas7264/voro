import React, { useEffect, useMemo } from 'react';
import { Calendar, Plus, Clock, Package, ShoppingCart, ChevronRight, Zap, Download } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorage } from '@/hooks/useStorage';

const MealPrepPlanner = () => {
  const { storageData } = useStorage();

  useEffect(() => {
    document.title = 'VORO | Culinary Logistics';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Narrow dependency to specific storage key for surgical reactivity.
   * Redesigned with a premium boutique gallery aesthetic.
   */
  const prepPlan = useMemo(() => {
    const data = storageData['meal_prep'] || {};
    return data.plan || [
      { id: 1, day: 'Sunday', duration: '2 hours', count: 20, recipes: ['Kinetic Chicken & Basmati', 'Atlantic Salmon & Greens', 'Turkey & Sweet Potato Flux'] },
      { id: 2, day: 'Wednesday', duration: '1 hour', count: 10, recipes: ['Egg White Frittata Matrix', 'Overnight Oats Synthesis'] }
    ];
  }, [storageData['meal_prep']]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30">
      {/* Ambient Background Logistics */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <Package size={18} />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.4em]">Culinary Supply Chain</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-serif italic font-medium tracking-tighter text-white leading-tight">
              Logistics <span className="text-gradient not-italic font-bold">Architect</span>
            </h1>
            <p className="text-gray-500 font-mono text-[0.65rem] uppercase tracking-[0.3em] opacity-60">
              Systematic orchestration of metabolic provisions
            </p>
          </div>

          <button className="group flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full text-[0.7rem] font-black uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10">
            <Plus size={18} />
            <span>Design Prep Plan</span>
          </button>
        </header>

        <div className="grid grid-cols-12 gap-12 mb-20">
          {/* Prep Schedule Modules */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between px-4 mb-4">
               <h3 className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.4em]">Manifested Sessions</h3>
               <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-voro-primary animate-pulse" />
                  <span className="text-[0.55rem] font-black text-voro-primary uppercase tracking-widest">Pipeline Active</span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {prepPlan.map((session, idx) => (
                <Card
                  key={session.id}
                  className="group relative p-0 overflow-hidden bg-[#0A0C14] border-white/5 transition-all hover:border-voro-primary/20 hover:shadow-voro-primary/5 animate-slide-up"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-voro-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-voro-primary/10 transition-colors duration-1000" />

                  <div className="p-10 border-b border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-6 mb-8">
                       <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-voro-primary shadow-inner">
                          <Calendar size={24} />
                       </div>
                       <div>
                          <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-[0.3em]">{session.day}</span>
                          <h4 className="text-2xl font-serif italic font-medium text-white tracking-tight mt-1">Session {session.id}</h4>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <p className="text-[0.5rem] font-black text-gray-700 uppercase tracking-widest mb-1">Temporal Depth</p>
                        <div className="flex items-center gap-2">
                           <Clock size={12} className="text-voro-secondary" />
                           <span className="text-sm font-mono font-bold text-white uppercase">{session.duration}</span>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <p className="text-[0.5rem] font-black text-gray-700 uppercase tracking-widest mb-1">Provision Count</p>
                        <div className="flex items-center gap-2">
                           <Zap size={12} className="text-voro-accent" />
                           <span className="text-sm font-mono font-bold text-white uppercase">{session.count} Units</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-10 space-y-6">
                    <div className="flex items-center justify-between">
                       <p className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.2em]">Recipe Matrix</p>
                       <span className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-widest">{session.recipes.length} Archetypes</span>
                    </div>
                    <div className="space-y-3">
                      {session.recipes.map((recipe, rIdx) => (
                        <div key={rIdx} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.01] border border-white/5 group/item hover:bg-white/[0.03] transition-all">
                           <span className="text-sm font-serif italic text-gray-300 group-hover/item:text-white transition-colors">{recipe}</span>
                           <ChevronRight size={14} className="text-gray-800 group-hover/item:text-voro-primary transition-all" />
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-4 mt-4 border border-dashed border-white/10 rounded-2xl text-[0.6rem] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-white hover:border-voro-primary/30 hover:bg-voro-primary/5 transition-all">
                      Review Manifest
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Provisions Matrix */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <h3 className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.4em] px-4">Provisions Matrix</h3>
            <Card className="p-10 bg-gradient-to-br from-[#0A0C14] to-black border-voro-primary/10 relative overflow-hidden group/matrix">
               <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-voro-secondary/5 rounded-full blur-[100px] group-hover/matrix:bg-voro-secondary/10 transition-colors duration-1000" />

               <div className="relative">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="p-3 bg-voro-secondary/10 text-voro-secondary rounded-2xl border border-voro-secondary/20 shadow-lg shadow-voro-secondary/5">
                      <ShoppingCart size={20} />
                    </div>
                    <h3 className="text-[0.65rem] font-mono font-medium uppercase tracking-[0.4em] text-voro-secondary">Supply List</h3>
                  </div>

                  <div className="space-y-4 mb-12">
                    {[
                      { item: 'Kinetic Chicken Breast', qty: '3.0 kg', checked: false },
                      { item: 'Atlantic Salmon Fillet', qty: '2.0 kg', checked: true },
                      { item: 'Basmati Grains (Bulk)', qty: '5.0 kg', checked: false },
                      { item: 'Sweet Potato Tuber', qty: '2.5 kg', checked: false },
                      { item: 'Organic Spinach Matrix', qty: '1.0 kg', checked: true },
                      { item: 'Liquid Hydration (Oils)', qty: '500 ml', checked: false }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 group/prov hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${item.checked ? 'bg-voro-secondary border-voro-secondary shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-white/10 group-hover/prov:border-white/20'}`}>
                             {item.checked && <Plus size={12} className="text-white rotate-45" />}
                          </div>
                          <span className={`text-sm font-serif italic transition-all ${item.checked ? 'text-gray-600 line-through' : 'text-gray-300'}`}>{item.item}</span>
                        </div>
                        <span className="text-[0.6rem] font-mono font-bold text-voro-secondary opacity-60">{item.qty}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full flex items-center justify-center gap-4 py-5 rounded-2xl bg-white text-black text-[0.65rem] font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-white/5">
                    <Download size={16} />
                    <span>Export Provisions</span>
                  </button>
               </div>
            </Card>

            <Card className="p-10 space-y-6 border-white/5">
               <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em]">Protocol Advisory</h3>
               <p className="text-sm font-medium text-gray-500 leading-relaxed italic">
                 Batch preparation optimizes metabolic adherence by eliminating friction in the provision supply chain.
               </p>
               <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 border-dashed">
                 <p className="text-[0.55rem] font-black text-voro-primary uppercase tracking-widest mb-2">Architect Tip</p>
                 <p className="text-xs text-gray-400 leading-relaxed font-mono">
                   Ensure airtight sequestration of prepared units to maintain structural integrity and nutritional density.
                 </p>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPrepPlanner;
