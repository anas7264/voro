import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Trash2, Pill, Calendar, Activity, Zap, ShieldAlert, BadgeCheck, Leaf } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { supplements } from '@/data/supplements';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted formatters.
 * Prevents redundant object instantiation of Intl.DateTimeFormat in loops.
 */
const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

const SupplementTracker = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Subscribe only to the relevant 'supplements' key. This ensures the component
   * only re-renders when the supplement protocol is modified.
   */
  const userSupplements = useStorageKey('supplements') || [];
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [confirmingRemoveId, setConfirmingRemoveId] = useState(null);

  // Focus state map to handle static 3D tilt for keyboard accessibility
  const [focusedCardId, setFocusedCardId] = useState(null);

  useEffect(() => {
    document.title = 'VORO | Supplement Tracker';
  }, []);

  // Reset confirmation state after timeout
  useEffect(() => {
    if (confirmingRemoveId) {
      const timer = setTimeout(() => setConfirmingRemoveId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmingRemoveId]);

  const handleAddSupplement = async (supplement) => {
    const updated = [...userSupplements, {
      ...supplement,
      id: Date.now(),
      startDate: new Date().toISOString(),
      adherence: [],
    }];
    await setItem('supplements', updated);
    setShowForm(false);
    addNotification(`${supplement.name} integrated into protocol.`, 'success');
  };

  const handleRemove = async (id) => {
    if (confirmingRemoveId === id) {
      const updated = userSupplements.filter(s => s.id !== id);
      await setItem('supplements', updated);
      addNotification('Supplement removed from protocol.', 'info');
      setConfirmingRemoveId(null);
    } else {
      setConfirmingRemoveId(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30 relative overflow-hidden bg-boutique-grain">
      {/* Cinematic Ambient Backglows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-voro-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-voro-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16">

        {/* 'Forge' Editorial Header System */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <Pill size={16} className="animate-pulse" />
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.6em] text-voro-primary">
                Exogenous Catalyst Apothecary
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-white tracking-[-0.03em] leading-none">
              Chemical <span className="text-gradient not-italic font-black">Optimization</span>
            </h1>
            <p className="text-gray-500 font-mono text-[0.6rem] uppercase tracking-[0.4em]">
              Molecular integration & bioactive cellular protocol matrix
            </p>
          </div>

          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-3 px-8 py-5 shadow-2xl shadow-voro-primary/10 rounded-full !bg-white !text-black hover:scale-105 active:scale-95 transition-all duration-500"
          >
            <Plus size={16} />
            <span className="font-mono text-xs uppercase tracking-[0.2em] font-black">Integrate Compound</span>
          </Button>
        </header>

        {showForm && (
          <Card
            variant="premium"
            nodeId="FORM_APOTH"
            className="p-12 mb-16 bg-gradient-to-b from-[#0A0C14] to-black border-voro-primary/20 animate-slide-up"
          >
            <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
              <div>
                <h3 className="text-2xl font-serif italic text-white font-bold">Bioactive Formulations</h3>
                <p className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest mt-1">Select an exogenous compound to initiate cellular protocol</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-xs font-mono font-bold text-gray-400 hover:text-white uppercase tracking-widest border border-white/10 px-4 py-2 rounded-xl hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supplements.slice(0, 12).map(supp => (
                <button
                  key={supp.id}
                  onClick={() => handleAddSupplement(supp)}
                  className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 hover:border-voro-primary hover:bg-voro-primary/[0.02] transition-all text-left group flex flex-col justify-between h-44 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-voro-primary outline-none"
                >
                  <div className="space-y-2">
                    <p className="text-lg font-serif italic text-white font-bold group-hover:text-voro-primary transition-colors">{supp.name}</p>
                    <p className="text-[0.6rem] font-mono text-gray-500 tracking-widest uppercase">{supp.category}</p>
                  </div>
                  <div className="flex justify-between items-center w-full border-t border-white/5 pt-4">
                    <span className="text-[0.65rem] font-mono font-bold text-gray-400">
                      DOSE // {supp.servingSize || `${supp.dosageMin}${supp.dosageUnit}`}
                    </span>
                    {supp.studyBacked && (
                      <span className="text-[0.5rem] font-mono font-black text-voro-secondary bg-voro-secondary/10 border border-voro-secondary/20 px-2 py-0.5 rounded uppercase tracking-wider">
                        Study Backed
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {userSupplements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userSupplements.map(supp => {
              const isCardFocused = focusedCardId === supp.id;
              const displayDosage = supp.servingSize
                ? `${supp.servingSize} ${supp.servingSizeUnit || ''}`
                : `${supp.dosageMin}–${supp.dosageMax} ${supp.dosageUnit || ''}`;

              return (
                <Card
                  key={supp.id}
                  variant="premium"
                  nodeId={`SUPP_0x${supp.id?.toString().slice(-4).toUpperCase()}`}
                  className={`group relative p-10 hover:border-white/15 transition-all duration-700 h-[480px] flex flex-col justify-between`}
                  tabIndex="0"
                  onFocus={() => setFocusedCardId(supp.id)}
                  onBlur={() => setFocusedCardId(null)}
                  style={{
                    transform: isCardFocused
                      ? 'perspective(1200px) rotateX(4deg) rotateY(-4deg) translateY(-4px)'
                      : undefined,
                    transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {/* Card Editorial Header */}
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-[0.55rem] font-mono font-black text-voro-primary uppercase tracking-[0.4em]">
                          {supp.category?.toUpperCase() || 'BIOACTIVE'}
                        </p>
                        <h3 className="text-3xl font-serif italic font-medium text-white tracking-[-0.02em] leading-tight">
                          {supp.name}
                        </h3>
                      </div>

                      {/* Double confirmation delete layout */}
                      <button
                        onClick={() => handleRemove(supp.id)}
                        aria-label={confirmingRemoveId === supp.id ? `Confirm removal of ${supp.name}` : `Remove ${supp.name} from protocol`}
                        className={`p-3 rounded-2xl transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-red-500 border relative ${
                          confirmingRemoveId === supp.id
                            ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse opacity-100'
                            : 'text-gray-600 hover:text-red-400 hover:bg-red-400/10 border-white/5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
                        }`}
                      >
                        {confirmingRemoveId === supp.id ? <ShieldAlert size={16} /> : <Trash2 size={16} />}
                      </button>
                    </div>

                    <p className="text-xs text-gray-400 font-medium leading-relaxed italic line-clamp-2">
                      "{supp.description || 'No detailed pharmacological synthesis available for this specific exogenous compound.'}"
                    </p>
                  </div>

                  {/* Molecular Bio-Availability Grid */}
                  <div className="my-8 space-y-6 border-y border-white/5 py-6">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Dosage details */}
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-voro-primary">
                          <Activity size={14} />
                        </div>
                        <div>
                          <p className="text-[0.5rem] font-mono font-black text-gray-500 uppercase tracking-widest">Bio-Dose</p>
                          <p className="text-xs font-mono font-bold text-white uppercase mt-0.5">{displayDosage}</p>
                        </div>
                      </div>

                      {/* Timeline / Initiation */}
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-voro-primary">
                          <Calendar size={14} />
                        </div>
                        <div>
                          <p className="text-[0.5rem] font-mono font-black text-gray-500 uppercase tracking-widest">Initiated</p>
                          <p className="text-xs font-mono font-bold text-white uppercase mt-0.5">
                            {fullDateFormatter.format(new Date(supp.startDate))}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Benefits visualization */}
                    {supp.benefits && supp.benefits.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[0.5rem] font-mono font-black text-gray-500 uppercase tracking-widest">Bioactive Benefits</p>
                        <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
                          {supp.benefits.slice(0, 3).map((benefit, idx) => (
                            <span
                              key={idx}
                              className="text-[0.55rem] font-mono font-medium text-gray-400 bg-white/[0.02] border border-white/[0.04] px-2 py-0.5 rounded-md uppercase tracking-wider"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Aesthetic and Dietary Tags Footer */}
                  <div className="flex items-center justify-between border-t border-white/[0.02] pt-4">
                    <div className="flex gap-2">
                      {supp.studyBacked && (
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-voro-secondary/10 border border-voro-secondary/20 rounded-lg text-voro-secondary">
                          <BadgeCheck size={12} />
                          <span className="text-[0.55rem] font-mono font-black uppercase tracking-wider">Clinically Proven</span>
                        </div>
                      )}
                      {supp.vegan && (
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                          <Leaf size={11} />
                          <span className="text-[0.55rem] font-mono font-black uppercase tracking-wider">Vegan</span>
                        </div>
                      )}
                    </div>

                    {!supp.studyBacked && !supp.vegan && (
                      <span className="text-[0.45rem] font-mono text-gray-600 uppercase tracking-widest">
                        APOTHECARY PROTOCOL V1.0
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="py-40 text-center border border-dashed border-white/5 rounded-[3rem] bg-[#0A0C14]/20 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-white opacity-[0.01] group-hover:opacity-[0.03] transition-opacity duration-1000" />
            <div className="w-24 h-24 bg-white/[0.01] border border-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-transform duration-700">
              <Zap size={36} className="text-gray-700 group-hover:text-voro-primary transition-colors duration-500" />
            </div>
            <h3 className="text-3xl font-serif italic font-bold text-white mb-2">Molecular Void</h3>
            <p className="text-[0.65rem] font-mono text-gray-500 uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed mt-4">
              No exogenous compounds currently integrated. Begin your biochemical optimization sequence.
            </p>
            <div className="mt-10">
              <Button
                onClick={() => setShowForm(true)}
                className="px-10 py-5 rounded-full font-mono text-xs font-black uppercase tracking-widest shadow-xl shadow-voro-primary/5"
              >
                Open Apothecary Catalog
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplementTracker;
