import React, { useEffect, useMemo } from 'react';
import { Trophy, Zap } from 'lucide-react';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import { useStorage } from '@/hooks/useStorage';
import { exercises } from '@/data/exercises';

const PRRecords = () => {
  const { storageData } = useStorage();

  useEffect(() => {
    document.title = 'VORO | PR Records';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Synchronous data synthesis using useMemo.
   * Eliminates the mount-time double-render cycle and ensures
   * reactivity to storage changes without secondary state management.
   */
  const prs = useMemo(() => {
    const data = storageData['pr_history'] || {};

    // ⚡ OPTIMIZATION: O(1) exercise lookup map to avoid O(N) searches inside the loop.
    const exerciseMap = exercises.reduce((acc, e) => {
      acc[e.id] = e.name;
      return acc;
    }, {});

    return Object.entries(data).map(([exerciseId, records]) => ({
      exerciseId,
      exerciseName: exerciseMap[exerciseId] || 'Unknown',
      records: Array.isArray(records) ? [...records].sort((a, b) => new Date(b.date) - new Date(a.date)) : [],
    })).filter(pr => pr.records.length > 0);
  }, [storageData['pr_history']]);

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-voro-primary">
              <Trophy size={18} />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.3em]">Absolute Peak Manifestations</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif italic font-medium text-white tracking-tight">
              Personal <span className="text-voro-primary not-italic font-bold">Records</span>
            </h1>
          </div>
        </header>

        {prs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prs.map(item => (
              <Card key={item.exerciseId} className="group relative p-8 hover:border-white/10 transition-all border-white/5">
                <div className="flex items-start justify-between mb-8">
                  <div className="space-y-1">
                    <p className="text-[0.6rem] font-black text-voro-primary uppercase tracking-[0.3em]">Movement Pattern</p>
                    <h3 className="text-xl font-serif italic font-bold text-white tracking-tight">{item.exerciseName}</h3>
                  </div>
                  <div className="p-3 bg-voro-primary/10 rounded-xl text-voro-primary border border-voro-primary/20">
                    <Zap size={16} />
                  </div>
                </div>

                <div className="space-y-3">
                  {item.records.map((record, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${idx === 0 ? 'bg-voro-primary/5 border-voro-primary/20' : 'bg-white/[0.02] border-white/5'}`}>
                      <div>
                        <div className="text-lg font-mono font-bold text-white">
                          {record.weight} <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-widest ml-1">kg</span>
                          <span className="mx-3 text-gray-800">×</span>
                          {record.reps} <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-widest ml-1">reps</span>
                        </div>
                        <div className="text-[0.55rem] font-black text-gray-600 uppercase tracking-[0.2em] mt-1">
                          {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                      {idx === 0 && <Badge variant="voro-accent" dot>APEX</Badge>}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Trophy size={32} className="text-gray-700" />
            </div>
            <h3 className="text-xl font-serif italic font-bold text-white mb-2">Performance Void</h3>
            <p className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.2em]">No peak manifestations recorded in the archive</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PRRecords;
