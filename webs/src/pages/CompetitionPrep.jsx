import React, { useEffect, useState, useMemo } from 'react';
import { Calendar, Trophy, Clock, CheckCircle2, Zap, Target, TrendingDown } from 'lucide-react';
import { Card, Button, Input, Divider } from '@/components';
import { useStorage } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { isDateInFuture } from '@/utils/validators';

/**
 * ⚡ OPTIMIZATION: Redesigned as a 'Peak Performance Manifest' luxury experience.
 * Incorporates a luxury boutique gallery aesthetic with Playfair Display italics,
 * mathematical whitespace, and a high-end 'Chronos Node' countdown artifact.
 */
const CompetitionPrep = () => {
  const { storageData, setItem } = useStorage();
  const { addNotification } = useNotifications();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    document.title = 'VORO | Peak Performance Manifest';
  }, []);

  // Standardize on 'competition' key while maintaining backwards compatibility
  const compData = useMemo(() => {
    return storageData['competition'] || storageData['voro_comp_prep'] || {
      date: null,
      phase: 'Preparation',
      protocols: [],
      checklist: []
    };
  }, [storageData]);

  const daysUntilComp = useMemo(() => {
    if (!compData.date) return null;
    const diffTime = new Date(compData.date) - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [compData.date]);

  const handleSetDate = async () => {
    if (!newDate) return;
    if (!isDateInFuture(newDate)) {
      addNotification('Manifestation must be scheduled in the future.', 'error');
      return;
    }

    await setItem('competition', { ...compData, date: newDate });
    setShowDatePicker(false);
    addNotification('Competition timeline synchronized.', 'success');
  };

  const handleToggleChecklist = async (itemIndex) => {
    const updatedChecklist = [...(compData.checklist || [])];
    if (updatedChecklist.includes(itemIndex)) {
      const index = updatedChecklist.indexOf(itemIndex);
      updatedChecklist.splice(index, 1);
    } else {
      updatedChecklist.push(itemIndex);
    }
    await setItem('competition', { ...compData, checklist: updatedChecklist });
  };

  const checklistItems = [
    'Synthesize light energy source 3h prior',
    'Execute neural warm-up protocol',
    'Perform cognitive visualization matrix',
    'Ensure optimal hydration saturation'
  ];

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24">
      {/* Ambient Background Depth - Boutique Standard */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <Trophy size={18} />
              <span className="text-[0.6rem] font-mono font-medium uppercase tracking-[0.4em]">Peak Manifest Matrix</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic font-medium tracking-tighter text-white leading-[1.1]">
              Competition <span className="text-voro-primary not-italic font-bold">Manifest</span>
            </h1>
            <p className="text-gray-500 font-mono font-medium tracking-[0.3em] text-[0.65rem] uppercase opacity-60">
              Architectural preparation for biological dominance
            </p>
          </div>

          <div className="flex gap-4">
             <Button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="px-10 py-5 bg-[#0A0C14] border border-white/5 rounded-2xl shadow-2xl flex items-center gap-3 transition-all hover:border-voro-primary/30 active:scale-95"
              >
                <Calendar size={18} className="text-voro-primary" />
                <span className="text-[0.65rem] font-black uppercase tracking-[0.4em]">Adjust Timeline</span>
             </Button>
          </div>
        </header>

        {showDatePicker && (
          <section className="mb-20 animate-slide-up">
            <Card className="p-12 border-voro-primary/20 bg-voro-primary/5 backdrop-blur-3xl">
              <div className="flex flex-col md:flex-row items-end gap-8">
                <div className="flex-1 space-y-4">
                  <label className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Temporal Target</label>
                  <Input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="bg-black/40 border-white/10 h-[60px] text-lg font-mono"
                  />
                </div>
                <Button onClick={handleSetDate} className="px-14 h-[60px] text-[0.65rem] font-black tracking-[0.3em]">Synchronize</Button>
                <Button variant="secondary" onClick={() => setShowDatePicker(false)} className="px-10 h-[60px] text-[0.65rem] font-black tracking-[0.3em]">Abort</Button>
              </div>
            </Card>
          </section>
        )}

        {daysUntilComp !== null ? (
          <div className="space-y-24">
            {/* Chronos Node: Countdown Artifact */}
            <section className="relative overflow-hidden rounded-[3rem] bg-[#0A0C14] border border-white/5 p-10 md:p-20 shadow-2xl shadow-black/60 group/hero">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-voro-primary/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover/hero:bg-voro-primary/15 transition-colors duration-1000" />

              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                <div className="lg:col-span-5 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5 pb-16 lg:pb-0 lg:pr-20">
                  <div className="relative">
                    <div className="w-72 h-72 rounded-full border border-white/5 flex items-center justify-center bg-black/40 backdrop-blur-2xl shadow-[0_0_100px_rgba(124,58,237,0.15)]">
                      <div className="text-center">
                        <p className="text-[0.65rem] font-mono font-medium text-gray-500 uppercase tracking-[0.5em] mb-3">T-Minus</p>
                        <p className="text-[10rem] font-serif italic font-bold text-white leading-none tracking-tighter">{daysUntilComp}</p>
                        <p className="text-[0.65rem] font-black text-voro-primary uppercase tracking-[0.5em] mt-3">Days</p>
                      </div>
                    </div>
                    {/* Kinetic Orbits - Mathematical Motion */}
                    <div className="absolute inset-[-20px] rounded-full border border-dashed border-voro-primary/20 animate-[spin_30s_linear_infinite]" />
                    <div className="absolute inset-[-40px] rounded-full border border-dashed border-voro-secondary/10 animate-[spin_45s_linear_infinite_reverse]" />
                    <div className="absolute inset-[-60px] rounded-full border border-white/5 opacity-50" />
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <h3 className="text-[0.65rem] font-mono font-medium text-gray-600 uppercase tracking-[0.4em]">Current Phase</h3>
                      <p className="text-5xl font-serif italic font-medium text-white tracking-tight">Peak Protocol <span className="text-voro-secondary not-italic font-sans font-black text-[0.6rem] uppercase tracking-widest ml-3 bg-voro-secondary/10 px-3 py-1.5 rounded-full border border-voro-secondary/20 inline-block align-middle">Active</span></p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-[0.65rem] font-mono font-medium text-gray-600 uppercase tracking-[0.4em]">Target Event</h3>
                      <p className="text-2xl font-mono font-bold text-white tracking-[0.2em] leading-tight">
                        {new Date(compData.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <Divider className="opacity-20" />

                  <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-3">
                      <p className="text-[0.6rem] font-mono font-medium text-gray-600 uppercase tracking-[0.3em]">Volume Attenuation</p>
                      <p className="text-4xl font-serif italic font-bold text-voro-primary tracking-tighter">-40%</p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[0.6rem] font-mono font-medium text-gray-600 uppercase tracking-[0.3em]">Metabolic Loading</p>
                      <p className="text-4xl font-serif italic font-bold text-voro-accent tracking-tighter">High</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Insight Artifact: Protocols */}
              <section className="space-y-12">
                <div className="flex items-center gap-8">
                  <h2 className="text-[0.7rem] font-black uppercase tracking-[0.6em] text-gray-600 whitespace-nowrap">
                    Peak Protocols
                  </h2>
                  <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <div className="space-y-8">
                  {[
                    { title: 'Volume Reduction Matrix', desc: 'Surgically attenuate sets by 40% while maintaining absolute intensity.', icon: TrendingDown, color: 'text-voro-primary' },
                    { title: 'Carbohydrate Saturation', desc: 'Initiate complex glucose loading 72h prior to event manifest.', icon: Zap, color: 'text-voro-accent' },
                    { title: 'Sodium & Fluid Modulation', desc: 'Strategic mineral titration to optimize subcutaneous definition.', icon: Target, color: 'text-voro-secondary' }
                  ].map((protocol, i) => (
                    <Card key={i} className="p-10 group hover:border-voro-primary/20 transition-all duration-700 hover:-translate-y-1">
                      <div className="flex gap-8">
                        <div className={`mt-1 p-4 rounded-2xl bg-white/[0.02] border border-white/5 ${protocol.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                          <protocol.icon size={24} />
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-2xl font-serif italic font-bold text-white tracking-tight">{protocol.title}</h4>
                          <p className="text-base text-gray-500 leading-relaxed font-medium tracking-tight">{protocol.desc}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Insight Artifact: Checklist */}
              <section className="space-y-12">
                <div className="flex items-center gap-8">
                  <h2 className="text-[0.7rem] font-black uppercase tracking-[0.6em] text-gray-600 whitespace-nowrap">
                    Final Checklist
                  </h2>
                  <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <Card className="p-12 bg-gradient-to-br from-[#0A0C14] to-black border-white/5">
                  <div className="space-y-10">
                    {checklistItems.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => handleToggleChecklist(i)}
                        className="w-full flex items-center justify-between group/item text-left"
                      >
                        <div className="flex items-center gap-8">
                          <div className={`
                            w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-700
                            ${compData.checklist?.includes(i)
                              ? 'bg-voro-secondary border-voro-secondary shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                              : 'bg-white/5 border-white/10 group-hover/item:border-voro-secondary/50'}
                          `}>
                            {compData.checklist?.includes(i) && <CheckCircle2 size={16} className="text-black" />}
                          </div>
                          <span className={`
                            text-lg font-medium tracking-tight transition-all duration-700
                            ${compData.checklist?.includes(i) ? 'text-gray-600 line-through' : 'text-gray-200 group-hover/item:text-white'}
                          `}>
                            {item}
                          </span>
                        </div>
                        <div className={`
                          w-2 h-2 rounded-full transition-all duration-700
                          ${compData.checklist?.includes(i) ? 'bg-voro-secondary scale-125 opacity-100' : 'bg-white/5 opacity-0 group-hover/item:opacity-100'}
                        `} />
                      </button>
                    ))}
                  </div>
                </Card>

                <div className="p-10 rounded-[3rem] border border-dashed border-white/5 bg-white/[0.01] text-center">
                  <Clock size={32} className="mx-auto mb-6 text-gray-700 opacity-50" />
                  <p className="text-[0.65rem] font-mono font-medium text-gray-600 uppercase tracking-[0.4em]">All protocols optimized for peak state</p>
                </div>
              </section>
            </div>
          </div>
        ) : (
          /* Empty State: Scheduling Artifact Needed */
          <section className="py-32 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="relative mb-16">
              <div className="w-56 h-56 rounded-full bg-white/[0.01] border border-white/5 flex items-center justify-center shadow-inner">
                 <Trophy size={64} className="text-gray-800 opacity-50" />
              </div>
              <div className="absolute inset-[-10px] rounded-full border border-voro-primary/20 animate-pulse" />
              <div className="absolute inset-[-20px] rounded-full border border-voro-primary/10 animate-pulse delay-700" />
            </div>

            <div className="max-w-xl space-y-8">
              <h3 className="text-4xl md:text-5xl font-serif italic font-bold text-white tracking-tight leading-tight">No Manifest Scheduled</h3>
              <p className="text-lg text-gray-500 font-medium leading-relaxed tracking-tight">
                Your biological peak requires a temporal target. Define your competition date to initiate the high-fidelity refinement protocols.
              </p>
              <Button
                onClick={() => setShowDatePicker(true)}
                className="mt-10 px-16 py-6 rounded-full shadow-2xl shadow-voro-primary/30 text-[0.7rem] font-black uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all"
              >
                Schedule Manifest
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CompetitionPrep;
