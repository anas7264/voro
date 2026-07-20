import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Layout, AlertCircle } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';

const SavedTrainingPlans = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad useStorage() with useStorageKey('plans') for reactive data.
   */
  const plansData = useStorageKey('plans') || {};
  const { updateItem } = useStorageMethods();
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);

  useEffect(() => {
    document.title = 'VORO | Blueprint Archive';
  }, []);

  // Reset confirmation state after timeout
  useEffect(() => {
    if (confirmingDeleteId) {
      const timer = setTimeout(() => setConfirmingDeleteId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmingDeleteId]);

  /**
   * ⚡ OPTIMIZATION: Synchronous data derivation.
   */
  const plans = useMemo(() => plansData.savedTrainingPlans || [], [plansData.savedTrainingPlans]);

  const handleDeletePlan = async (id) => {
    if (confirmingDeleteId === id) {
      const updated = plans.filter(p => p.id !== id);
      await updateItem('plans', { savedTrainingPlans: updated });
      setConfirmingDeleteId(null);
    } else {
      setConfirmingDeleteId(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] p-4 md:p-8 selection:bg-voro-primary/30">
      <div className="max-w-6xl mx-auto py-12">
        <header className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-serif italic font-medium text-white tracking-tight leading-tight">
              Blueprint <span className="text-voro-primary not-italic font-bold">Archive</span>
            </h1>
            <p className="text-gray-500 font-mono text-[0.6rem] uppercase tracking-[0.3em]">Vault of manifested training protocols</p>
          </div>
          <Button variant="primary" className="flex items-center gap-4 !rounded-xl px-10 h-16 shadow-2xl shadow-voro-primary/20 text-[0.7rem] font-black uppercase tracking-[0.4em]">
            <Plus size={18} />
            New Blueprint
          </Button>
        </header>

        {plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map(plan => (
              <Card key={plan.id} className="group relative p-0 overflow-hidden bg-[#0A0C14] border-white/5 transition-all hover:border-voro-primary/20 animate-slide-up">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-voro-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-voro-primary/10 transition-colors duration-1000" />

                 <div className="p-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-voro-primary shadow-inner">
                        <Layout size={20} />
                      </div>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        aria-label={confirmingDeleteId === plan.id ? `Confirm deletion of training plan: ${plan.name}` : `Delete training plan: ${plan.name}`}
                        className={`p-3 rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${confirmingDeleteId === plan.id ? 'bg-red-500/20 text-red-400 animate-pulse opacity-100' : 'bg-white/[0.02] border border-white/5 text-gray-700 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 focus-visible:opacity-100'}`}
                      >
                        {confirmingDeleteId === plan.id ? <AlertCircle size={16} /> : <Trash2 size={16} />}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-2xl font-serif italic font-bold text-white tracking-tight">{plan.name}</h3>
                      <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                        <div className="space-y-1">
                          <p className="text-[0.5rem] font-black text-gray-700 uppercase tracking-widest">Protocol</p>
                          <p className="text-[0.65rem] font-mono font-bold text-voro-primary uppercase tracking-widest">{plan.days} Days / Week</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[0.5rem] font-black text-gray-700 uppercase tracking-widest">Intensity</p>
                          <p className="text-[0.65rem] font-mono font-bold text-gray-400 uppercase tracking-widest">{plan.level}</p>
                        </div>
                      </div>
                    </div>
                 </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center text-center opacity-20">
            <div className="text-6xl mb-8">🏋️</div>
            <h3 className="text-[0.7rem] font-black uppercase tracking-[0.5em] text-white">Archive Empty</h3>
            <p className="text-[0.6rem] font-mono uppercase tracking-[0.3em] mt-4">Synthesize a kinetic blueprint to populate the vault</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTrainingPlans;
