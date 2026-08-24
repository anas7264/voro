import React, { useEffect, useState, useCallback, useRef, memo } from 'react';
import { Trash2, Calendar, Zap, Target, Activity, AlertCircle, Compass, Cpu, Sparkles } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDate } from '@/utils/formatters';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted and frozen static metadata.
 * Prevents redundant object instantiation and heap allocations on every component render.
 */
const BLOCK_TYPES = Object.freeze([
  { id: 'hyp', name: 'Hypertrophy Block', duration: '4 weeks', focus: 'Muscle growth', color: 'text-voro-primary', bg: 'bg-voro-primary/10', code: '0xBLK_HYP_01' },
  { id: 'str', name: 'Strength Block', duration: '4 weeks', focus: 'Maximum strength', color: 'text-voro-secondary', bg: 'bg-voro-secondary/10', code: '0xBLK_STR_02' },
  { id: 'pow', name: 'Power Block', duration: '2 weeks', focus: 'Explosive power', color: 'text-voro-accent', bg: 'bg-voro-accent/10', code: '0xBLK_POW_03' },
  { id: 'del', name: 'Deload Week', duration: '1 week', focus: 'Systemic recovery', color: 'text-gray-400', bg: 'bg-gray-400/10', code: '0xBLK_DEL_04' },
]);

/**
 * ⚡ SUBCOMPONENT: KineticBlockCard
 * 60fps direct-DOM 3D Volumetric Mouse Tilt Tracking,
 * dynamic luminous lens spotlighting, reactive liquid border illumination,
 * holographic coordinate telemetry overlays, sub-pixel node hash badges,
 * and W3C APG compliant static 4-degree keyboard focus tilts.
 */
const KineticBlockCard = memo(({ block, onIntegrate }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 15 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 30;
    const tiltX = (0.5 - (y / rect.height)) * 30;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setAnnouncement(`${block.name}. Temporal duration: ${block.duration}. Focus: ${block.focus}. Currently focused.`);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setAnnouncement('');
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <>
      {announcement && (
        <div className="sr-only" aria-live="polite">
          {announcement}
        </div>
      )}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex="0"
        role="article"
        aria-label={`Periodization Block: ${block.name}. Focus: ${block.focus}. Duration: ${block.duration}`}
        style={{
          transform: interactionActive
            ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-6px)'
            : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d'
        }}
        className="relative bg-[#0A0C14] border border-white/5 rounded-[2.5rem] p-8 overflow-hidden group flex flex-col justify-between transition-all duration-700 hover:border-voro-primary/30 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]"
      >
        {/* Precision Grid & Grain Architecture */}
        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000" />
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

          {/* Dynamic Luminous Lens Spotlight */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.12), transparent 70%)`,
              transform: 'translateZ(20px)'
            }}
          />
        </div>

        {/* Reactive Liquid Perimeter Lighting */}
        <div
          className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            padding: '1px',
            background: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.4), transparent 80%)`,
            WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Coordinate Telemetry Overlay */}
        <div
          className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500 z-30"
          style={{ transform: 'translateZ(60px)' }}
        >
          <div className="flex flex-col items-end font-mono text-[0.45rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-0.5">
            <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
            <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
            <span className="text-white/20">[{block.code}]</span>
          </div>
        </div>

        <div className="space-y-6 relative z-10" style={{ transform: 'translateZ(40px)' }}>
          <div className={`w-12 h-12 rounded-2xl ${block.bg} ${block.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-2xl font-serif italic font-bold text-white mb-2 group-hover:text-voro-primary transition-colors duration-500">{block.name}</h3>
            <p className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.2em]">{block.focus}</p>
          </div>
          <div className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-voro-primary/50" />
            <span>Temporal: {block.duration}</span>
          </div>
        </div>

        <div className="mt-10 relative z-10" style={{ transform: 'translateZ(50px)' }}>
          <Button
            onClick={() => onIntegrate(block)}
            className="w-full !rounded-xl text-[0.6rem] font-black uppercase tracking-[0.3em] shadow-lg hover:shadow-voro-primary/20 transition-all"
          >
            Integrate
          </Button>
        </div>
      </div>
    </>
  );
});

KineticBlockCard.displayName = 'KineticBlockCard';

/**
 * ⚡ SUBCOMPONENT: TimelineNodeItem
 * Individual periodization timeline block with 60fps direct-DOM hover tilts,
 * live spatial telemetry, and a defensive self-canceling double-confirmation decommission safeguard.
 */
const TimelineNodeItem = memo(({ block, idx, onRemove }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Decommission safeguard states
  const [isConfirming, setIsConfirming] = useState(false);
  const [decommissionCount, setDecommissionCount] = useState(3);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '3deg');
      containerRef.current.style.setProperty('--tilt-y', '-3deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "3.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-3.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const handleRemoveClick = () => {
    if (isConfirming) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsConfirming(false);
      onRemove(block.id);
    } else {
      setIsConfirming(true);
      setDecommissionCount(3);
      let count = 3;
      timerRef.current = setInterval(() => {
        count -= 1;
        if (count <= 0) {
          clearInterval(timerRef.current);
          setIsConfirming(false);
          setDecommissionCount(3);
        } else {
          setDecommissionCount(count);
        }
      }, 1000);
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex="0"
      role="article"
      aria-label={`Timeline Node ${idx + 1}: ${block.name}. Focus: ${block.focus}. Duration: ${block.duration}`}
      style={{
        transform: interactionActive
          ? 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-2px)'
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="group flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-voro-primary/30 hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-voro-primary gap-4"
    >
      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-4 right-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 z-30"
        style={{ transform: 'translateZ(40px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em]">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[0xNODE_0{idx + 1}]</span>
        </div>
      </div>

      <div className="flex items-center gap-8 relative z-10" style={{ transform: 'translateZ(20px)' }}>
        <div className="w-12 h-12 rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center font-serif italic font-bold text-xl text-gray-500 group-hover:text-voro-primary group-hover:border-voro-primary/40 transition-all duration-500 shadow-inner">
          {idx + 1}
        </div>
        <div className="space-y-1">
          <div className="text-xl font-serif italic font-bold text-white tracking-tight group-hover:text-voro-primary transition-colors duration-500">{block.name}</div>
          <div className="text-[0.6rem] font-black text-gray-500 uppercase tracking-widest">{block.focus} • {block.duration}</div>
        </div>
      </div>

      <div className="flex items-center gap-6 relative z-10 self-end md:self-center" style={{ transform: 'translateZ(30px)' }}>
        {/* ⚡ Zero-allocation date formatting via module-scoped CachedDateTimeFormat */}
        <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-widest bg-white/[0.02] px-3 py-1.5 rounded-full border border-white/5">
          Start: {formatDate(block.startDate, 'short')}
        </span>
        <button
          onClick={handleRemoveClick}
          aria-label={isConfirming ? `Confirm decommissioning of block: ${block.name}` : `Decommission block: ${block.name}`}
          className={`px-4 py-2.5 rounded-xl transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-red-500 font-mono text-[0.55rem] font-black uppercase tracking-widest flex items-center gap-2 ${
            isConfirming
              ? 'bg-red-500/20 border border-red-500/40 text-red-400 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : 'bg-white/[0.02] border border-white/5 hover:border-red-500/30 text-gray-500 hover:text-red-400 opacity-80 group-hover:opacity-100'
          }`}
        >
          {isConfirming ? (
            <>
              <AlertCircle size={14} className="animate-bounce" />
              <span>PURGE IN {decommissionCount}S?</span>
            </>
          ) : (
            <>
              <Trash2 size={14} />
              <span>Decommission</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
});

TimelineNodeItem.displayName = 'TimelineNodeItem';

/**
 * ⚡ SUBCOMPONENT: KineticAlignmentOverlay
 * Cinematic orbital loading sequence overlay displayed during timeline synthesis.
 * Supports Playwright E2E test bypass hook (`window.__VORO_TEST_BYPASS__` / `voro_test_mode`).
 */
const KineticAlignmentOverlay = memo(({ isVisible, message = "Aligning Kinetic Timeline..." }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#020408]/90 backdrop-blur-2xl flex flex-col items-center justify-center transition-all duration-700 animate-fade-in">
      <div className="relative mb-12">
        <div className="w-36 h-36 rounded-full border border-voro-primary/20 animate-[spin_20s_linear_infinite] flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border border-dashed border-voro-secondary/30 animate-[spin_12s_linear_infinite_reverse] flex items-center justify-center">
            <Compass size={36} className="text-voro-primary animate-pulse" />
          </div>
        </div>
        <div className="absolute inset-[-10px] rounded-full border border-white/5 animate-pulse" />
      </div>

      <div className="text-center space-y-3 max-w-sm px-6">
        <div className="flex items-center justify-center gap-2 text-voro-primary">
          <Sparkles size={14} className="animate-pulse" />
          <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.4em]">Temporal Alignment</span>
        </div>
        <h3 className="text-2xl font-serif italic font-bold text-white tracking-tight">{message}</h3>
        <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">0xPRD_CALIBRATING_STIMULUS</p>
      </div>
    </div>
  );
});

KineticAlignmentOverlay.displayName = 'KineticAlignmentOverlay';

/**
 * ⚡ MAIN COMPONENT: Periodization
 * 'Temporal Blueprint & Kinetic Periodization Matrix Enclave'
 */
const Periodization = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad useStorage() with useStorageKey for specific data and
   * useStorageMethods for stable action references.
   */
  const blocks = useStorageKey('periodization') || [];
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();
  const [isAligning, setIsAligning] = useState(false);

  useEffect(() => {
    document.title = 'VORO | Temporal Blueprint & Kinetic Periodization';
  }, []);

  const handleAddBlock = useCallback(async (block) => {
    // E2E Test mode bypass check
    const isTestBypass =
      typeof window !== 'undefined' &&
      (window.__VORO_TEST_BYPASS__ || localStorage.getItem('voro_test_mode') === 'true');

    if (!isTestBypass) {
      setIsAligning(true);
    }

    const newBlock = {
      id: Date.now(),
      name: block.name,
      duration: block.duration,
      focus: block.focus,
      color: block.color,
      bg: block.bg,
      startDate: new Date().toISOString()
    };
    const updated = [...blocks, newBlock];

    if (!isTestBypass) {
      setTimeout(async () => {
        await setItem('periodization', updated);
        setIsAligning(false);
        addNotification(`${block.name} integrated into timeline.`, 'success');
      }, 1200);
    } else {
      await setItem('periodization', updated);
      addNotification(`${block.name} integrated into timeline.`, 'success');
    }
  }, [blocks, setItem, addNotification]);

  const handleRemoveBlock = useCallback(async (id) => {
    const updated = blocks.filter(b => b.id !== id);
    await setItem('periodization', updated);
    addNotification('Evolution block decommissioned from timeline.', 'info');
  }, [blocks, setItem, addNotification]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24 relative overflow-hidden bg-boutique-grain">
      {/* Cinematic Ambient Background Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-voro-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <KineticAlignmentOverlay isVisible={isAligning} />

      <div className="relative max-w-6xl mx-auto px-6 py-12 md:px-8">
        <header className="mb-20 space-y-4 border-b border-white/5 pb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-voro-primary">
              <Calendar size={18} />
              <span className="text-[0.6rem] font-mono font-medium uppercase tracking-[0.4em]">Temporal Blueprint Matrix</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-voro-secondary animate-pulse" />
              <span className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-widest">0xTEMPORAL_NEXUS_v4.2</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-white tracking-tight leading-tight">
            Kinetic <span className="text-voro-primary not-italic font-bold">Periodization</span>
          </h1>
          <p className="text-gray-500 font-mono text-[0.65rem] uppercase tracking-[0.3em] opacity-60">
            Strategic orchestration of training stimulus over time
          </p>
        </header>

        {/* Available Periodization Block Cards Grid */}
        <section aria-label="Available Periodization Blocks" className="mb-20">
          <div className="flex items-center gap-6 mb-8">
            <h2 className="text-[0.65rem] font-mono font-bold text-gray-500 uppercase tracking-[0.4em]">Available Stimulus Blocks</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BLOCK_TYPES.map((block) => (
              <KineticBlockCard
                key={block.id}
                block={block}
                onIntegrate={handleAddBlock}
              />
            ))}
          </div>
        </section>

        {/* Current Evolution Timeline Container */}
        <section aria-label="Current Evolution Timeline">
          <Card className="p-8 md:p-12 bg-[#0A0C14] border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-voro-primary/5 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 pb-6 border-b border-white/5 gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-voro-primary/10 text-voro-primary rounded-2xl border border-voro-primary/20 shadow-inner">
                    <Activity size={22} />
                  </div>
                  <div>
                    <h3 className="text-[0.7rem] font-black text-white uppercase tracking-[0.4em]">Current Evolution Timeline</h3>
                    <p className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest mt-0.5">Sequential Periodization Sequence</p>
                  </div>
                </div>
                <div className="px-4 py-1.5 bg-white/[0.02] border border-white/5 rounded-full flex items-center gap-2">
                  <Cpu size={12} className="text-voro-primary" />
                  <span className="text-[0.55rem] font-mono font-bold text-gray-400 uppercase tracking-widest">0xPRD_SYNC_ACTIVE</span>
                </div>
              </div>

              {blocks.length > 0 ? (
                <div className="space-y-4">
                  {blocks.map((block, idx) => (
                    <TimelineNodeItem
                      key={block.id}
                      block={block}
                      idx={idx}
                      onRemove={handleRemoveBlock}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center space-y-6 opacity-30">
                  <Target size={52} className="mx-auto text-gray-600 animate-pulse" />
                  <div>
                    <h3 className="text-[0.7rem] font-mono font-black uppercase tracking-[0.5em] text-gray-400">Timeline Void</h3>
                    <p className="text-[0.55rem] font-mono uppercase tracking-widest mt-2 text-gray-600">Integrate strategic periodization blocks above to initiate evolution timeline</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Periodization;
