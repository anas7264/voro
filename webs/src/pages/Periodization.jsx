import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { useStorage } from '@/hooks/useStorage';

const Periodization = () => {
  const { getStorage, setStorage } = useStorage();
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    document.title = 'VORO | Periodization';
    const data = getStorage('voro_periodization') || [];
    setBlocks(data);
  }, []);

  const blockTypes = [
    { name: 'Hypertrophy Block', duration: '4 weeks', focus: 'Muscle growth' },
    { name: 'Strength Block', duration: '4 weeks', focus: 'Maximum strength' },
    { name: 'Power Block', duration: '2 weeks', focus: 'Explosive power' },
    { name: 'Deload Week', duration: '1 week', focus: 'Recovery' },
  ];

  const handleAddBlock = (block) => {
    const updated = [...blocks, { id: Date.now(), ...block, startDate: new Date().toISOString() }];
    setBlocks(updated);
    setStorage('voro_periodization', updated);
  };

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Periodization</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {blockTypes.map((block, idx) => (
            <Card key={idx} className="p-6">
              <h3 className="text-lg font-bold text-white mb-2">{block.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{block.focus}</p>
              <div className="text-sm text-gray-500 mb-4">Duration: {block.duration}</div>
              <Button
                onClick={() => handleAddBlock(block)}
                className="w-full"
              >
                Add to Plan
              </Button>
            </Card>
          ))}
        </div>

        {blocks.length > 0 ? (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Current Periodization Plan
            </h3>
            <div className="space-y-3">
              {blocks.map((block, idx) => (
                <div key={block.id} className="flex items-center justify-between p-4 bg-voro-surface rounded-lg">
                  <div>
                    <div className="text-white font-semibold">Week {idx + 1}: {block.name}</div>
                    <div className="text-sm text-gray-400">{block.focus}</div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setBlocks(blocks.filter(b => b.id !== block.id))}
                    className="text-danger"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-white mb-2">No periodization plan yet</h3>
            <p className="text-gray-400 mb-6">Create a training periodization plan above</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Periodization;
