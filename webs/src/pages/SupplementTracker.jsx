import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Trash2, Pill, Calendar, Activity, Zap } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorage } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { supplements } from '@/data/supplements';

const SupplementTracker = () => {
  const { storageData, setItem } = useStorage();
  const { addNotification } = useNotifications();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    document.title = 'VORO | Supplement Tracker';
  }, []);

  const userSupplements = useMemo(() => {
    return storageData['supplements'] || [];
  }, [storageData['supplements']]);

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
    const updated = userSupplements.filter(s => s.id !== id);
    await setItem('supplements', updated);
    addNotification('Supplement removed from protocol.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-voro-primary">
              <Pill size={18} />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.3em]">Exogenous Catalyst Log</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif italic font-medium text-white tracking-tight">
              Chemical <span className="text-voro-primary not-italic font-bold">Optimization</span>
            </h1>
          </div>

          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-3 px-8 shadow-xl shadow-voro-primary/20"
          >
            <Plus size={18} />
            Integrate Compound
          </Button>
        </header>

        {showForm && (
          <Card className="p-10 mb-12 bg-gradient-to-b from-[#0A0C14] to-black border-voro-primary/20 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white">Available Formulations</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white transition-colors">
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supplements.slice(0, 9).map(supp => (
                <button
                  key={supp.id}
                  onClick={() => handleAddSupplement(supp)}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-voro-primary hover:bg-voro-primary/[0.02] transition-all text-left group"
                >
                  <p className="text-sm font-bold text-white tracking-tight uppercase mb-1">{supp.name}</p>
                  <p className="text-[0.6rem] font-mono text-gray-600 tracking-widest uppercase">{supp.dosage}</p>
                </button>
              ))}
            </div>
          </Card>
        )}

        {userSupplements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userSupplements.map(supp => (
              <Card key={supp.id} className="group relative p-8 hover:border-white/10 transition-all">
                <div className="flex items-start justify-between mb-8">
                  <div className="space-y-1">
                    <p className="text-[0.6rem] font-black text-voro-primary uppercase tracking-[0.3em]">Compound</p>
                    <h3 className="text-xl font-serif italic font-bold text-white tracking-tight">{supp.name}</h3>
                  </div>
                  <button
                    onClick={() => handleRemove(supp.id)}
                    className="p-2.5 rounded-xl text-gray-800 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/5 rounded-xl text-gray-500">
                      <Activity size={16} />
                    </div>
                    <div>
                      <p className="text-[0.55rem] font-black text-gray-600 uppercase tracking-widest">Dosage</p>
                      <p className="text-sm font-mono font-bold text-white uppercase">{supp.dosage}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/5 rounded-xl text-gray-500">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-[0.55rem] font-black text-gray-600 uppercase tracking-widest">Protocol Initiation</p>
                      <p className="text-sm font-mono font-bold text-white uppercase">
                        {new Date(supp.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
              <Zap size={32} className="text-gray-700" />
            </div>
            <h3 className="text-xl font-serif italic font-bold text-white mb-2">Molecular Void</h3>
            <p className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.2em]">No compounds currently active in protocol</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplementTracker;
