import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Check } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Checkbox from '@/components/Checkbox';
import { useStorage } from '@/hooks/useStorage';

const GymSetup = () => {
  const { storageData, setStorage } = useStorage();

  const commonEquipment = [
    { id: 1, name: 'Dumbbells', category: 'Free Weights' },
    { id: 2, name: 'Barbell', category: 'Free Weights' },
    { id: 3, name: 'Bench', category: 'Equipment' },
    { id: 4, name: 'Rack', category: 'Equipment' },
    { id: 5, name: 'Cables', category: 'Machines' },
    { id: 6, name: 'Treadmill', category: 'Cardio' },
    { id: 7, name: 'Stationary Bike', category: 'Cardio' },
    { id: 8, name: 'Rowing Machine', category: 'Cardio' },
  ];

  useEffect(() => {
    document.title = 'VORO | Gym Setup';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Synchronous data derivation for gym equipment.
   * Eliminates mount-time double-render and ensures instant reactivity.
   */
  const equipment = useMemo(() => {
    return storageData['gym_setup'] || [];
  }, [storageData['gym_setup']]);

  const handleToggleEquipment = (item) => {
    const found = equipment.find(e => e.id === item.id);
    let updated;
    if (found) {
      updated = equipment.filter(e => e.id !== item.id);
    } else {
      updated = [...equipment, item];
    }
    setStorage('gym_setup', updated);
  };

  const categories = ['Free Weights', 'Equipment', 'Machines', 'Cardio'];

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Gym Setup</h1>

        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Select Available Equipment</h3>
          <p className="text-gray-400 mb-4">Choose the equipment available at your gym or home setup</p>

          {categories.map(category => (
            <div key={category} className="mb-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-3 text-opacity-70">{category}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonEquipment
                  .filter(e => e.category === category)
                  .map(item => (
                    <Checkbox
                      key={item.id}
                      label={item.name}
                      checked={equipment.some(e => e.id === item.id)}
                      onChange={() => handleToggleEquipment(item)}
                      className="p-3 rounded-lg border border-voro-border hover:bg-voro-surface transition"
                    />
                  ))}
              </div>
            </div>
          ))}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Your Equipment ({equipment.length})</h3>
          {equipment.length > 0 ? (
            <div className="space-y-2">
              {equipment.map(item => (
                <div key={item.id} className="flex items-center gap-2 p-3 bg-voro-surface rounded-lg">
                  <Check size={18} className="text-voro-secondary" />
                  <span className="text-white">{item.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">{item.category}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No equipment selected yet</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default GymSetup;
