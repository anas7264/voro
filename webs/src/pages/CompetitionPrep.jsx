import React, { useEffect, useState } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useStorage } from '@/hooks/useStorage';

const CompetitionPrep = () => {
  const { getStorage, setStorage } = useStorage();
  const [compDate, setCompDate] = useState(null);

  useEffect(() => {
    document.title = 'VORO | Competition Prep';
    const data = getStorage('voro_comp_prep') || {};
    setCompDate(data.date);
  }, []);

  const daysUntilComp = compDate ? Math.ceil((new Date(compDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Competition Prep</h1>

        {daysUntilComp ? (
          <>
            <Card className="p-8 mb-6 bg-gradient-to-br from-voro-primary to-purple-700">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">{daysUntilComp}</div>
                <div className="text-xl text-white opacity-90">Days until competition</div>
                <div className="text-sm text-white opacity-75 mt-2">{new Date(compDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <Card className="p-6">
                <div className="text-sm text-gray-400 mb-2">Current Phase</div>
                <div className="text-2xl font-bold text-white">Peak Week</div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-gray-400 mb-2">Training Volume</div>
                <div className="text-2xl font-bold text-voro-primary">-30%</div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-gray-400 mb-2">Carbs Protocol</div>
                <div className="text-2xl font-bold text-voro-accent">Loaded</div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Peak Week Protocol</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className="text-voro-accent mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Reduce Training Volume by 30-40%</div>
                      <div className="text-sm text-gray-400">Maintain intensity but cut sets/reps</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className="text-voro-accent mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Increase Carbohydrates</div>
                      <div className="text-sm text-gray-400">Begin carb-loading 3 days out</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className="text-voro-accent mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Reduce Water & Sodium</div>
                      <div className="text-sm text-gray-400">Strategic dehydration 24h before</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Competition Day Checklist</h3>
                <div className="space-y-2">
                  {['Eat light breakfast 3 hours before', 'Warm-up routine 30 minutes before', 'Mental prep & visualization', 'Have water available'].map((item, idx) => (
                    <label key={idx} className="flex items-center gap-3 p-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-white">{item}</span>
                    </label>
                  ))}
                </div>
              </Card>
            </div>
          </>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-white mb-2">No competition scheduled</h3>
            <p className="text-gray-400 mb-6">Set a competition date to begin your peak week plan</p>
            <Button>Schedule Competition</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CompetitionPrep;
