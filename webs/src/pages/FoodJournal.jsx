import React, { useEffect, useState, useMemo, useCallback, useRef, memo } from 'react';
import { Plus, Trash2, BookOpen, Clock, Zap, AlertTriangle, Sparkles, Target, ShieldCheck } from 'lucide-react';
import { Button, Card, Textarea, Header } from '@/components';
import { useStorageMethods, useStorageKeySelector } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { isValidJournalNote } from '@/utils/validators';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted Module-Scoped Formatters.
 * Pre-instantiated Intl.DateTimeFormat instances avoid GC thrashing in render loops.
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

/**
 * ⚡ SUBCOMPONENT: JournalEntryCard
 * Features 60fps direct-DOM 3D volumetric hover tilts, real-time coordinate telemetry,
 * static 4-degree keyboard focus tilts, and a 3-second self-canceling double-confirmation purge.
 */
const JournalEntryCard = memo(({ entry, onDelete, index }) => {
  const cardRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const timerRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [purgeState, setPurgeState] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const dateObj = useMemo(() => new Date(entry.date), [entry.date]);
  const formattedDate = useMemo(() => dateFormatter.format(dateObj), [dateObj]);
  const formattedTime = useMemo(() => timeFormatter.format(dateObj), [dateObj]);

  const nodeId = useMemo(() => `0xJRN_${entry.id?.toString().slice(-4) || 'LOG'}`, [entry.id]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 12;
    const tiltX = (0.5 - (y / rect.height)) * 12;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '4deg');
      cardRef.current.style.setProperty('--tilt-y', '-4deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    }
    setAnnouncement(`Journal entry recorded on ${formattedDate} at ${formattedTime}. Note: ${entry.note}`);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '0deg');
      cardRef.current.style.setProperty('--tilt-y', '0deg');
    }
    setAnnouncement('');
  };

  const handlePurgeTrigger = useCallback(() => {
    if (!purgeState) {
      setPurgeState(true);
      timerRef.current = setTimeout(() => {
        setPurgeState(false);
      }, 3000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPurgeState(false);
      onDelete(entry.id);
    }
  }, [purgeState, onDelete, entry.id]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const isActive = isHovered || isFocused;

  return (
    <>
      {announcement && (
        <div className="sr-only" aria-live="polite">
          {announcement}
        </div>
      )}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex="0"
        role="article"
        aria-label={`Reflection Entry: ${formattedDate} ${formattedTime}`}
        style={{
          transform: isActive
            ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
            : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d'
        }}
        className={`
          group relative p-10 rounded-[2.5rem] bg-[#0A0C14] border transition-all duration-500
          outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/80 overflow-hidden cursor-pointer shadow-2xl
          ${purgeState
            ? 'border-red-500/50 bg-red-950/10 shadow-[0_20px_50px_rgba(239,68,68,0.15)]'
            : 'border-white/5 hover:border-voro-primary/30 hover:shadow-2xl hover:shadow-voro-primary/5'
          }
        `}
      >
        {/* Dynamic Light Spotting & Grain */}
        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 85%)`
            }}
          />
        </div>

        {/* Dynamic Telemetry Coordinates */}
        <div
          className="absolute top-8 right-8 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500 z-30"
          style={{ transform: 'translateZ(40px)' }}
        >
          <div className="flex flex-col items-end font-mono text-[0.45rem] font-black text-voro-primary/60 tracking-[0.2em] space-y-0.5 select-none">
            <span>T_X <span ref={tiltXRef}>0.0</span>°</span>
            <span>T_Y <span ref={tiltYRef}>0.0</span>°</span>
            <span className="text-white/20">[{nodeId}]</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full space-y-6" style={{ transform: 'translateZ(20px)' }}>
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${purgeState ? 'bg-red-500 animate-bounce' : 'bg-voro-primary animate-pulse'}`} />
              <div className="flex items-center gap-2">
                <Clock size={14} className={purgeState ? 'text-red-400' : 'text-voro-primary'} />
                <span className="text-[0.65rem] font-mono font-bold text-gray-400 uppercase tracking-widest">
                  {formattedDate} — {formattedTime}
                </span>
              </div>
            </div>
            <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-widest">
              INDEX // #{(index + 1).toString().padStart(2, '0')}
            </span>
          </div>

          <p className="text-xl font-serif italic text-gray-200 leading-relaxed font-medium tracking-tight">
            "{entry.note}"
          </p>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-voro-primary/60 text-[0.55rem] font-mono font-bold uppercase tracking-widest">
              <ShieldCheck size={12} />
              <span>Metabolic Reflection Secured</span>
            </div>

            <button
              onClick={handlePurgeTrigger}
              className={`
                px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 font-mono text-[0.6rem] font-black uppercase tracking-wider outline-none focus-visible:ring-2 focus-visible:ring-red-500
                ${purgeState
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : 'text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent'
                }
              `}
              aria-label={purgeState ? `Confirm purge of journal entry from ${formattedDate}` : `Purge journal entry`}
            >
              {purgeState ? (
                <>
                  <AlertTriangle size={12} className="animate-bounce" />
                  <span aria-live="assertive">PURGE?</span>
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  <span>Purge</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

JournalEntryCard.displayName = "JournalEntryCard";

/**
 * ⚡ SUBCOMPONENT: ArchiveVoidDeck
 * High-end cinematic empty state when no reflection logs exist.
 */
const ArchiveVoidDeck = memo(() => (
  <div className="py-28 px-8 text-center border border-dashed border-white/10 rounded-[3rem] bg-[#0A0C14]/40 relative overflow-hidden group">
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
      <div className="w-64 h-64 rounded-full border border-voro-primary/20 animate-[spin_40s_linear_infinite]" />
      <div className="w-48 h-48 rounded-full border border-dashed border-voro-secondary/20 animate-[spin_30s_linear_infinite_reverse]" />
    </div>

    <div className="relative z-10 max-w-md mx-auto space-y-6">
      <div className="w-20 h-20 bg-white/[0.02] border border-white/10 rounded-full flex items-center justify-center mx-auto group-hover:border-voro-primary/40 transition-colors duration-700 shadow-inner">
        <Zap size={32} className="text-gray-700 group-hover:text-voro-primary transition-all duration-700 animate-pulse" />
      </div>
      <div>
        <h3 className="text-2xl font-serif italic font-bold text-white mb-2">Qualitative Trophic Void</h3>
        <p className="text-[0.6rem] font-mono text-gray-500 uppercase tracking-[0.25em] leading-relaxed">
          No experiential logs recorded in active memory. Synthesize your neural state and qualitative meal reflections above.
        </p>
      </div>
    </div>
  </div>
));

ArchiveVoidDeck.displayName = "ArchiveVoidDeck";

const FoodJournal = () => {
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();
  const [note, setNote] = useState('');

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Subscribes specifically to 'food_journal' key using useStorageKeySelector.
   */
  const foodJournalData = useStorageKeySelector(
    'food_journal',
    useCallback((data) => data || [], [])
  );

  useEffect(() => {
    document.title = 'VORO | Qualitative Trophic Archive';
  }, []);

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Raw Relational Sort Optimization.
   * Sorts entries with raw string comparison to eliminate Date object instantiation overhead.
   */
  const entries = useMemo(() => {
    return [...foodJournalData].sort((a, b) => {
      const dA = a.date || '';
      const dB = b.date || '';
      return dA < dB ? 1 : dA > dB ? -1 : 0;
    });
  }, [foodJournalData]);

  const handleAddEntry = useCallback(async () => {
    const trimmedNote = note.trim();
    if (!trimmedNote) return;

    if (!isValidJournalNote(trimmedNote)) {
      addNotification('Reflection text is too long (maximum 2048 characters).', 'error');
      return;
    }

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      note: trimmedNote,
    };

    setNote('');
    const updatedEntries = [newEntry, ...entries];

    await setItem('food_journal', updatedEntries);
    addNotification('Qualitative reflection archived into memory.', 'success');
  }, [note, entries, setItem, addNotification]);

  const handleDeleteEntry = useCallback(async (id) => {
    const updatedEntries = entries.filter(e => e.id !== id);
    await setItem('food_journal', updatedEntries);
    addNotification('Reflection entry purged from archive.', 'info');
  }, [entries, setItem, addNotification]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30 relative overflow-hidden bg-boutique-grain">
      {/* Ambient Background Lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-12 md:px-12 lg:px-20">
        <Header
          eyebrow="Trophic Synthesis & Neural Log"
          title={<>Food <span className="text-voro-primary not-italic font-bold">Journal</span></>}
          subtitle="Qualitative metabolic reflection and experiential neural archiving."
        />

        <div className="grid grid-cols-1 gap-12 mt-12">
          {/* Form Card */}
          <Card className="p-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-voro-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-voro-primary/10 transition-colors duration-1000" />

            <div className="relative space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                  <BookOpen size={18} className="text-voro-primary" />
                  <h3 className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-gray-400">Synthesize Experience</h3>
                </div>
                <div className="flex items-center gap-2 text-voro-primary">
                  <Sparkles size={14} className="animate-pulse" />
                  <span className="text-[0.5rem] font-mono uppercase tracking-[0.2em]">Neural Input Active</span>
                </div>
              </div>

              <Textarea
                placeholder="Synthesize your eating experience, neural state, metabolic satiety, and energy dynamics..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="bg-white/[0.02] border-white/10 italic font-serif text-lg leading-relaxed focus:border-voro-primary/50 text-white placeholder:text-gray-600 rounded-2xl"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-widest">
                  {note.trim().length} / 2048 Characters
                </span>
                <Button
                  onClick={handleAddEntry}
                  disabled={!note.trim()}
                  className="px-10 py-5 rounded-2xl shadow-xl shadow-voro-primary/20 text-[0.65rem] font-black uppercase tracking-[0.3em]"
                >
                  <Plus size={16} className="mr-2" />
                  Archive Reflection
                </Button>
              </div>
            </div>
          </Card>

          {/* Entries Feed */}
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <Target size={16} className="text-voro-primary" />
                <h3 className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-gray-400">Archived Feed</h3>
              </div>
              <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-widest">
                {entries.length} Total Logs
              </span>
            </div>

            {entries.length > 0 ? (
              <div className="space-y-6">
                {entries.map((entry, index) => (
                  <JournalEntryCard
                    key={entry.id}
                    entry={entry}
                    onDelete={handleDeleteEntry}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <ArchiveVoidDeck />
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default FoodJournal;
