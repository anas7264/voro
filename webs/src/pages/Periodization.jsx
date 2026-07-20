import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Plus, Trash2, Calendar, Zap, Target, Activity, AlertTriangle } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static metadata.
 * Prevents redundant object instantiation on every component render.
 */
const BLOCK_TYPES = [
  { name: 'Hypertrophy Block', duration: '4 weeks', focus: 'Muscle growth', color: 'text-voro-primary', bg: 'bg-voro-primary/10' },
  { name: 'Strength Block', duration: '4 weeks', focus: 'Maximum strength', color: 'text-voro-secondary', bg: 'bg-voro-secondary/10' },
  { name: 'Power Block', duration: '2 weeks', focus: 'Explosive power', color: 'text-voro-accent', bg: 'bg-voro-accent/10' },
  { name: 'Deload Week', duration: '1 week', focus: 'Recovery', color: 'text-gray-400', bg: 'bg-gray-400/10' },
];

const Periodization = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad useStorage() with useStorageKey for specific data and
   * useStorageMethods for stable action references.
   * CORRECTED STORAGE KEY: The storage utility automatically handles prefixes.
   */
  const blocks = useStorageKey('periodization') || [];
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();
  const [confirmingId, setConfirmingId] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    document.title = 'VORO | Periodization Archive';
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAddBlock = useCallback(async (block) => {
    const newBlock = {
      id: Date.now(),
      ...block,
      startDate: new Date().toISOString()
    };
    const updated = [...blocks, newBlock];

    /**
     * ⚡ OPTIMISTIC UI: Provide immediate feedback while storage persists.
     */
    addNotification(`${block.name} integrated into timeline`, 'success');
    await setItem('periodization', updated);
  }, [blocks, setItem, addNotification]);

  const handleRemoveBlock = useCallback(async (id) => {
    if (confirmingId === id) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setConfirmingId(null);
      const updated = blocks.filter(b => b.id !== id);
      await setItem('periodization', updated);
      addNotification('Evolution block decommissioned', 'info');
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setConfirmingId(id);
      timeoutRef.current = setTimeout(() => {
        setConfirmingId(null);
      }, 3000);
    }
  }, [blocks, confirmingId, setItem, addNotification]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] p-4 md:p-8 selection:bg-voro-primary/30">
      <div className="max-w-6xl mx-auto py-12">
        <header className="mb-20 space-y-4">
           <div className="flex items-center gap-3 text-voro-primary">
              <Calendar size={18} />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.4em]">Temporal Blueprint</span>
            </div>
           <h1 className="text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tight leading-tight">
            Kinetic <span className="text-voro-primary not-italic font-bold">Periodization</span>
          </h1>
          <p className="text-gray-500 font-mono text-[0.65rem] uppercase tracking-[0.3em] opacity-60">Strategic orchestration of training stimulus over time</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {BLOCK_TYPES.map((block, idx) => (
            <Card key={idx} className="p-8 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-xl hover:border-voro-primary/20 transition-all group flex flex-col justify-between">
              <div className="space-y-6">
                <div className={`w-12 h-12 rounded-2xl ${block.bg} ${block.color} flex items-center justify-center shadow-inner`}>
                   <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-serif italic font-bold text-white mb-2">{block.name}</h3>
                  <p className="text-[0.6rem] font-black text-gray-600 uppercase tracking-[0.2em]">{block.focus}</p>
                </div>
                <div className="text-[0.55rem] font-mono font-bold text-gray-700 uppercase tracking-widest">Temporal: {block.duration}</div>
              </div>
              <Button
                onClick={() => handleAddBlock(block)}
                className="w-full mt-10 !rounded-xl text-[0.6rem] font-black uppercase tracking-[0.3em]"
              >
                Integrate
              </Button>
            </Card>
          ))}
        </div>

        <Card className="p-10 bg-[#0A0C14] border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-voro-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-12 px-4">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-voro-primary/10 text-voro-primary rounded-xl border border-voro-primary/20">
                    <Activity size={20} />
                 </div>
                 <h3 className="text-[0.7rem] font-black text-white uppercase tracking-[0.4em]">Current Evolution Timeline</h3>
              </div>
              <div className="px-4 py-1 bg-white/[0.02] border border-white/5 rounded-full">
                 <span className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-widest">0xLOG_SYNC_ACTIVE</span>
              </div>
            </div>

            {blocks.length > 0 ? (
              <div className="space-y-4 px-4">
                {blocks.map((block, idx) => (
                  <div key={block.id} className="group flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-voro-primary/20 hover:bg-white/[0.03] transition-all">
                    <div className="flex items-center gap-8">
                      <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center font-serif italic font-bold text-gray-600 group-hover:text-voro-primary group-hover:border-voro-primary/30 transition-all">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <div className="text-lg font-serif italic font-bold text-white tracking-tight">{block.name}</div>
                        <div className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest">{block.focus} • {block.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <span className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-widest">Start: {new Date(block.startDate).toLocaleDateString()}</span>
                       <button
                        onClick={() => handleRemoveBlock(block.id)}
                        className={`p-3 rounded-xl transition-all flex items-center gap-1.5 text-[0.65rem] font-mono font-bold uppercase tracking-wider ${
                          confirmingId === block.id
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.2)] scale-105 opacity-100'
                            : 'hover:bg-red-500/10 text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:opacity-100'
                        }`}
                        aria-label={confirmingId === block.id ? `Confirm deletion of ${block.name}` : `Remove ${block.name}`}
                       >
                        {confirmingId === block.id ? (
                          <>
                            <AlertTriangle size={12} className="animate-pulse" />
                            <span>Confirm Deletion</span>
                          </>
                        ) : (
                          <Trash2 size={18} />
                        )}
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center space-y-6 opacity-20">
                <Target size={48} className="mx-auto text-gray-700" />
                <div>
                  <h3 className="text-[0.65rem] font-black uppercase tracking-[0.4em]">Timeline Void</h3>
                  <p className="text-[0.55rem] font-mono uppercase tracking-widest mt-2">Design your strategic periodization above</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Periodization;
