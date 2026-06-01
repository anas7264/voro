import React, { useEffect, useState, useMemo } from 'react';
import { Share2, Download, Utensils, Dumbbell, Droplets } from 'lucide-react';
import { Button, Card, Tabs } from '@/components';
import { useStorage } from '@/hooks/useStorage';

const QuickLog = () => {
  const { getStorage, setStorage } = useStorage();
  const [activeTab, setActiveTab] = useState('food');
  const [logs, setLogs] = useState({ food: [], workout: [], water: [] });

  useEffect(() => {
    document.title = 'VORO | Express Log';
    const data = getStorage('voro_quick_log') || {};
    setLogs(data);
  }, [getStorage]);

  const quickLogTabs = useMemo(() => [
    {
      id: 'food',
      label: 'Nutrition',
      icon: <Utensils size={16} />,
      content: (
        <div className="animate-slide-up space-y-6">
          <div>
             <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 ml-1">Archetype Logs</h3>
             <div className="space-y-3">
              {[
                { name: 'Chicken Breast', icon: '🍗' },
                { name: 'White Rice', icon: '🍚' },
                { name: 'Mixed Vegetables', icon: '🥗' },
                { name: 'Gala Apple', icon: '🍎' }
              ].map(food => (
                <button
                  key={food.name}
                  className="w-full flex items-center justify-between px-6 py-5 bg-white/[0.02] border border-white/5 rounded-2xl transition-all hover:bg-white/[0.05] hover:border-voro-primary/30 group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{food.icon}</span>
                    <span className="text-white font-serif italic text-lg font-medium">{food.name}</span>
                  </div>
                  <div className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Quick Manifest</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'workout',
      label: 'Kinetic',
      icon: <Dumbbell size={16} />,
      content: (
        <div className="animate-slide-up space-y-6">
          <div>
            <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 ml-1">Energy Manifestation</h3>
            <div className="space-y-3">
              {[
                { name: 'Bench Press', icon: '🏋️', detail: '4x8 Standard' },
                { name: 'Back Squats', icon: '🤸', detail: '4x8 Standard' },
                { name: 'Cardio Protocol', icon: '🚴', detail: '30 min Steady' },
                { name: 'Neural Recovery', icon: '🧘', detail: '20 min Flow' }
              ].map(workout => (
                <button
                   key={workout.name}
                   className="w-full flex items-center justify-between px-6 py-5 bg-white/[0.02] border border-white/5 rounded-2xl transition-all hover:bg-white/[0.05] hover:border-voro-secondary/30 group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{workout.icon}</span>
                    <div className="text-left">
                      <span className="text-white font-serif italic text-lg font-medium block">{workout.name}</span>
                      <span className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest">{workout.detail}</span>
                    </div>
                  </div>
                  <div className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Record Evolution</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'water',
      label: 'Hydration',
      icon: <Droplets size={16} />,
      content: (
        <div className="animate-slide-up space-y-6">
          <div>
            <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 ml-1">Intracellular Matrix</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { amount: '250', label: 'Standard' },
                { amount: '500', label: 'Protocol' },
                { amount: '750', label: 'Advanced' },
                { amount: '1000', label: 'Maximum' }
              ].map(water => (
                <button
                  key={water.amount}
                  className="flex flex-col items-center justify-center p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] transition-all hover:bg-white/[0.05] hover:border-voro-primary/30 group"
                >
                   <div className="text-4xl font-serif italic font-bold text-white mb-1">+{water.amount}<span className="text-[0.6rem] not-italic font-sans font-black text-voro-primary uppercase ml-1">ml</span></div>
                   <div className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest">{water.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
  ], []);

  const activeContent = useMemo(() => {
    return quickLogTabs.find(t => t.id === activeTab)?.content;
  }, [quickLogTabs, activeTab]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-[35%] h-[35%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[15%] right-[10%] w-[35%] h-[35%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[800px] mx-auto px-12 py-20">
        <header className="mb-20 text-center">
            <div className="inline-flex items-center gap-3 text-voro-primary mb-4 bg-voro-primary/10 px-4 py-2 rounded-full border border-voro-primary/20">
              <Share2 size={16} />
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em]">Express Manifestation</span>
            </div>
            <h1 className="text-6xl font-serif italic font-medium tracking-tight text-white leading-tight">
              Quick <span className="text-gradient not-italic font-bold">Log</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-widest text-xs uppercase mt-6 opacity-60">Rapid synchronization of your metabolic trajectory</p>
        </header>

        <div className="mb-12">
          <Tabs
            tabs={quickLogTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <Card className="p-10 md:p-12 bg-[#0A0C14] border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-voro-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-voro-primary/10 transition-colors duration-1000" />
          {activeContent}
        </Card>

        <div className="mt-12 flex justify-center gap-6">
           <button className="flex items-center gap-3 px-8 py-3.5 bg-white/5 border border-white/5 text-gray-400 rounded-full text-[0.6rem] font-black uppercase tracking-[0.25em] transition-all hover:bg-white/10 hover:text-white">
              <Download size={14} />
              <span>Export History</span>
           </button>
           <button className="flex items-center gap-3 px-8 py-3.5 bg-white/5 border border-white/5 text-gray-400 rounded-full text-[0.6rem] font-black uppercase tracking-[0.25em] transition-all hover:bg-white/10 hover:text-white">
              <Share2 size={14} />
              <span>Share Evolution</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default QuickLog;
