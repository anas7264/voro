import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { useStorage } from '@/hooks/useStorage';
import { supplements } from '@/data/supplements';

const SupplementTracker = () => {
  const { getStorage, setStorage } = useStorage();
  const [userSupplements, setUserSupplements] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    document.title = 'VORO | Supplement Tracker';
    const data = getStorage('voro_supplements') || [];
    setUserSupplements(data);
  }, []);

  const handleAddSupplement = (supplement) => {
    const updated = [...userSupplements, {
      ...supplement,
      id: Date.now(),
      startDate: new Date().toISOString(),
      adherence: [],
    }];
    setUserSupplements(updated);
    setStorage('voro_supplements', updated);
  };

  const handleRemove = (id) => {
    const updated = userSupplements.filter(s => s.id !== id);
    setUserSupplements(updated);
    setStorage('voro_supplements', updated);
  };

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Supplement Tracker</h1>
          <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
            <Plus size={18} />
            Add Supplement
          </Button>
        </div>

        {showForm && (
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supplements.slice(0, 6).map(supp => (
                <Button
                  key={supp.id}
                  onClick={() => {
                    handleAddSupplement(supp);
                    setShowForm(false);
                  }}
                  variant="secondary"
                  className="text-left justify-start"
                >
                  {supp.name}
                </Button>
              ))}
            </div>
          </Card>
        )}

        {userSupplements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userSupplements.map(supp => (
              <Card key={supp.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{supp.name}</h3>
                    <p className="text-sm text-gray-400">{supp.dosage}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => handleRemove(supp.id)}
                    className="text-danger"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
                <div className="text-sm text-gray-400">
                  Since {new Date(supp.startDate).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">💊</div>
            <h3 className="text-xl font-bold text-white mb-2">No supplements yet</h3>
            <p className="text-gray-400">Add supplements to track your daily intake</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SupplementTracker;
