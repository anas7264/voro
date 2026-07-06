import React, { useEffect, useCallback, useMemo } from 'react';
import { Check } from 'lucide-react';
import Card from '@/components/Card';
import Checkbox from '@/components/Checkbox';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static metadata.
 * Prevents redundant object instantiation on every component render.
 */
const COMMON_EQUIPMENT = [
  { id: 1, name: 'Dumbbells', category: 'Free Weights' },
  { id: 2, name: 'Barbell', category: 'Free Weights' },
  { id: 3, name: 'Bench', category: 'Equipment' },
  { id: 4, name: 'Rack', category: 'Equipment' },
  { id: 5, name: 'Cables', category: 'Machines' },
  { id: 6, name: 'Treadmill', category: 'Cardio' },
  { id: 7, name: 'Stationary Bike', category: 'Cardio' },
  { id: 8, name: 'Rowing Machine', category: 'Cardio' },
];

const CATEGORIES = ['Free Weights', 'Equipment', 'Machines', 'Cardio'];

const GymSetup = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad useStorage() with useStorageKey for specific data and
   * useStorageMethods for stable action references.
   */
  const equipment = useStorageKey('gym_setup') || [];
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  useEffect(() => {
    document.title = 'VORO | Gym Setup';
  }, []);

  const handleToggleEquipment = useCallback(async (item) => {
    const isSelected = equipment.some(e => e.id === item.id);
    let updated;

    if (isSelected) {
      updated = equipment.filter(e => e.id !== item.id);
      addNotification(`${item.name} decommissioned from setup`, 'info');
    } else {
      updated = [...equipment, item];
      addNotification(`${item.name} integrated into setup`, 'success');
    }

    /**
     * ⚡ OPTIMISTIC UI: Provide immediate feedback while storage persists.
     */
    await setItem('gym_setup', updated);
  }, [equipment, setItem, addNotification]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] p-4 md:p-8 selection:bg-voro-primary/30">
      <div className="max-w-4xl mx-auto py-12">
        <header className="mb-12 space-y-2">
           <h1 className="text-4xl md:text-5xl font-serif italic font-medium text-white tracking-tight">
            Gym <span className="text-voro-primary not-italic font-bold">Setup</span>
          </h1>
          <p className="text-gray-500 font-mono text-[0.6rem] uppercase tracking-[0.3em]">Configure available kinetic infrastructure</p>
        </header>

        <Card className="p-10 mb-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-voro-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-voro-primary/10 transition-colors duration-1000" />

          <div className="relative z-10 space-y-12">
            <div>
              <h3 className="text-xl font-serif italic font-medium text-white mb-2">Kinetic Inventory</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed italic">Select the equipment currently available in your primary training environment.</p>
            </div>

            {CATEGORIES.map(category => (
              <div key={category} className="space-y-4">
                <h4 className="text-[0.65rem] font-black text-gray-700 uppercase tracking-[0.4em] ml-1">{category}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {COMMON_EQUIPMENT
                    .filter(e => e.category === category)
                    .map(item => (
                      <Checkbox
                        key={item.id}
                        label={item.name}
                        checked={equipment.some(e => e.id === item.id)}
                        onChange={() => handleToggleEquipment(item)}
                        className={`p-5 rounded-2xl border transition-all duration-500 ${
                          equipment.some(e => e.id === item.id)
                            ? 'bg-voro-primary/5 border-voro-primary/30 text-white'
                            : 'bg-white/[0.01] border-white/5 text-gray-600 hover:border-white/10 hover:bg-white/[0.03]'
                        }`}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.4em]">Active Configuration ({equipment.length})</h3>
            <div className="px-3 py-1 bg-voro-secondary/10 rounded-full border border-voro-secondary/20">
               <span className="text-[0.55rem] font-black text-voro-secondary uppercase tracking-widest">Live Sync</span>
            </div>
          </div>

          {equipment.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {equipment.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-voro-secondary/20 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-voro-secondary/10 flex items-center justify-center text-voro-secondary">
                    <Check size={16} />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{item.name}</span>
                    <p className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-widest">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center opacity-30">
               <p className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em]">Infrastructure Void</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default GymSetup;
