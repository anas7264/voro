import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { useStorage } from '@/hooks/useStorage';

const FoodJournal = () => {
  const { getStorage, setStorage } = useStorage();
  const [entries, setEntries] = useState([]);
  const [note, setNote] = useState('');

  useEffect(() => {
    document.title = 'VORO | Food Journal';
    const data = getStorage('voro_food_journal') || [];
    setEntries(data);
  }, []);

  const handleAddEntry = () => {
    if (!note.trim()) return;
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      note,
    };
    const updated = [...entries, entry];
    setEntries(updated);
    setStorage('voro_food_journal', updated);
    setNote('');
  };

  const handleDeleteEntry = (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    setStorage('voro_food_journal', updated);
  };

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Food Journal</h1>

        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Notes</h3>
          <div className="flex gap-2">
            <textarea
              placeholder="Record your eating experience, feelings, energy levels..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex-1 bg-voro-elevated text-white px-4 py-3 rounded border border-voro-border focus:outline-none focus:border-voro-primary resize-none"
              rows="4"
            />
          </div>
          <Button onClick={handleAddEntry} className="w-full mt-3">
            Add Entry
          </Button>
        </Card>

        {entries.length > 0 ? (
          <div className="space-y-3">
            {entries.slice().reverse().map(entry => (
              <Card key={entry.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-gray-400 mb-2">
                      {new Date(entry.date).toLocaleDateString()} at {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <p className="text-white whitespace-pre-wrap">{entry.note}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-danger ml-4 flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">📔</div>
            <h3 className="text-xl font-bold text-white mb-2">No entries yet</h3>
            <p className="text-gray-400">Start journaling your food experiences</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FoodJournal;
