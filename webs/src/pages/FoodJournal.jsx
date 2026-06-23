import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Plus, Trash2, BookOpen, Clock, Zap } from 'lucide-react';
import { Button, Card, Textarea, Header } from '@/components';
import { useStorageMethods, useStorageKey } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted formatters.
 * Prevents redundant object instantiation of Intl.DateTimeFormat in render loops.
 */
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit'
});

const FoodJournal = () => {
  const { setItem } = useStorageMethods();
  const foodJournalData = useStorageKey('food_journal');
  const { addNotification } = useNotifications();
  const [note, setNote] = useState('');

  useEffect(() => {
    document.title = 'VORO | Food Journal';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Surgical Reactivity.
   * Derive entries directly from StorageContext using useMemo.
   * Eliminates the imperative load cycle and ensures UI remains in sync
   * across all tabs/components without secondary state management.
   */
  const entries = useMemo(() => {
    const data = foodJournalData || [];
    return [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [foodJournalData]);

  const handleAddEntry = useCallback(async () => {
    if (!note.trim()) return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      note: note.trim(),
    };

    /**
     * ⚡ OPTIMISTIC UI: Notify immediately.
     * Persistence happens in the background via async setItem.
     */
    setNote('');
    const updatedEntries = [newEntry, ...entries];

    await setItem('food_journal', updatedEntries);
    addNotification('Journal entry archived.', 'success');
  }, [note, entries, setItem, addNotification]);

  const handleDeleteEntry = useCallback(async (id) => {
    const updatedEntries = entries.filter(e => e.id !== id);
    await setItem('food_journal', updatedEntries);
    addNotification('Entry purged from archive.', 'info');
  }, [entries, setItem, addNotification]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-24 selection:bg-voro-primary/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] left-[5%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] right-[5%] w-[35%] h-[35%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-12 md:px-12 lg:px-20">
        <Header
          eyebrow="Energy Synthesis Log"
          title={<>Food <span className="text-voro-primary not-italic font-bold">Journal</span></>}
          subtitle="Qualitative metabolic reflection and experiential archiving."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Entry Form */}
          <Card className="lg:col-span-12 p-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-voro-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-voro-primary/10 transition-colors duration-1000" />

            <div className="relative space-y-8">
              <div className="flex items-center gap-3">
                <BookOpen size={18} className="text-voro-primary" />
                <h3 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-500">Record Experience</h3>
              </div>

              <Textarea
                placeholder="Synthesize your eating experience, neural state, and energy dynamics..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="bg-white/[0.02] border-white/10 italic font-serif text-lg leading-relaxed focus:border-voro-primary/50"
              />

              <Button
                onClick={handleAddEntry}
                disabled={!note.trim()}
                className="w-full py-6 shadow-xl shadow-voro-primary/20"
              >
                <Plus size={18} className="mr-2" />
                Archive Reflection
              </Button>
            </div>
          </Card>

          {/* Entries List */}
          <div className="lg:col-span-12 space-y-6">
            {entries.length > 0 ? (
              entries.map(entry => {
                const dateObj = new Date(entry.date);
                return (
                  <Card key={entry.id} className="p-8 bg-[#0A0C14] border-white/5 hover:border-white/10 transition-all group animate-fade-in">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-voro-primary" />
                            <span className="text-[0.65rem] font-mono font-bold text-gray-500 uppercase tracking-widest">
                              {dateFormatter.format(dateObj)} — {timeFormatter.format(dateObj)}
                            </span>
                          </div>
                          <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent" />
                        </div>
                        <p className="text-xl font-serif italic text-gray-200 leading-relaxed max-w-3xl">
                          {entry.note}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                        aria-label="Purge entry"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Zap size={32} className="text-gray-700" />
                </div>
                <h3 className="text-xl font-serif italic font-bold text-white mb-2">Archive Void</h3>
                <p className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.2em]">Awaiting the first metabolic reflection</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodJournal;
