import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Plus, Trash2, ShoppingCart, Zap, CheckCircle2, Package, AlertTriangle, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted constants and static arrays.
 * Bypasses dynamic allocations and GC overhead on high-frequency renders.
 */
const SUPPLY_LOGS = [
  'AWAITING_BIO_SYNC_SEQUENCE',
  'SUPPLY_CHAIN_PIPELINE_STANDBY',
  'LOCAL_INVENTORY_SEQUESTRATION_IDLE',
  'PROCUREMENT_VECTOR_STABILIZED',
  'NEURAL_METABOLIC_LINK_READY'
];

/**
 * ⚡ REFINEMENT: ProcuredResourceCard Component.
 * Implements Voro's elite 'Forge' luxury system aesthetic with:
 * - Direct inline CSS custom property updates on mouse move (O(1) DOM updates, no React state churn).
 * - Real-time TX/TY coordinate telemetry in JetBrains Mono.
 * - Accessible 3D Interaction Pattern on focus (static 4-degree tilt & gold halos).
 * - 3-second self-canceling individual purge protection mechanism.
 */
const ProcuredResourceCard = React.memo(({ item, index, onToggle, onDelete, nodeId }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const purgeTimerRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  // Clean up any active timers on unmount
  useEffect(() => {
    return () => {
      if (purgeTimerRef.current) {
        clearTimeout(purgeTimerRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 15 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 30;
    const tiltX = (0.5 - (y / rect.height)) * 30;

    // Direct DOM mutation for buttery smooth 60fps tracking
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
      // 4-degree static tilt on keyboard focus for accessibility compliance
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
    // Cancel individual purge flow if user clicks away/tabs away
    if (isPurging) {
      setIsPurging(false);
      if (purgeTimerRef.current) clearTimeout(purgeTimerRef.current);
    }
  };

  const handlePurgeClick = (e) => {
    e.stopPropagation();
    if (isPurging) {
      // Confirmed delete
      if (purgeTimerRef.current) clearTimeout(purgeTimerRef.current);
      onDelete(item.id);
    } else {
      // Initiate 3s self-canceling double-confirmation guard
      setIsPurging(true);
      purgeTimerRef.current = setTimeout(() => {
        setIsPurging(false);
      }, 3000);
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (containerRef.current) {
          containerRef.current.style.setProperty('--tilt-x', '0deg');
          containerRef.current.style.setProperty('--tilt-y', '0deg');
        }
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      role="listitem"
      aria-label={`${item.text}. Status: ${item.checked ? 'Secured' : 'Awaiting Procurement'}`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
        animationDelay: `${index * 50}ms`
      }}
      className={`relative group flex items-center gap-6 p-7 bg-[#0A0C14] border rounded-3xl transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/80 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408] ${
        item.checked ? 'border-voro-primary/10 hover:border-voro-primary/20' : 'border-white/5 hover:border-white/10'
      } animate-slide-up`}
    >
      {/* Precision Grid & Luminous Lens Overlay */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700" style={{ transform: 'translateZ(10px)' }} />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.015]" />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 50%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-4 right-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/50 tracking-[0.2em] space-y-0.5">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/10">[{nodeId}]</span>
        </div>
      </div>

      {/* Item Body Content */}
      <div className="flex items-center gap-6 flex-1 relative z-10" style={{ transform: 'translateZ(30px)' }}>
        {/* Luxury Custom Checkbox */}
        <button
          role="checkbox"
          aria-checked={item.checked}
          aria-label={`Secure resource signature ${item.text}`}
          onClick={() => onToggle(item.id)}
          className={`relative w-7 h-7 rounded-xl border flex items-center justify-center transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary ${
            item.checked
              ? 'bg-voro-primary border-voro-primary shadow-[0_0_20px_rgba(124,58,237,0.5)] text-white'
              : 'border-white/10 hover:border-white/30 text-transparent'
          }`}
        >
          {item.checked && <Plus size={16} className="rotate-45 transition-transform duration-500" />}
        </button>

        {/* Text Signature */}
        <span className={`flex-1 text-lg font-serif italic transition-all duration-500 ${
          item.checked ? 'text-gray-500 line-through' : 'text-gray-100'
        }`}>
          {item.text}
        </span>
      </div>

      {/* Defensive Purge Controller */}
      <div className="flex items-center gap-4 relative z-10" style={{ transform: 'translateZ(40px)' }}>
        <span className="text-[0.5rem] font-mono text-gray-700 uppercase tracking-widest hidden md:block">
          [0x{item.id.toString(16).toUpperCase().slice(-4)}]
        </span>

        <button
          onClick={handlePurgeClick}
          aria-label={isPurging ? `CONFIRM PURGE FOR ${item.text}` : `Request decommission of ${item.text}`}
          className={`p-3.5 rounded-xl transition-all duration-500 border ${
            isPurging
              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-lg shadow-amber-500/20'
              : 'bg-white/[0.01] border-white/5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/10'
          } outline-none focus-visible:ring-2 focus-visible:ring-red-500`}
        >
          {isPurging ? (
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="animate-pulse" />
              <span className="text-[0.55rem] font-mono font-black tracking-widest">PURGE?</span>
            </div>
          ) : (
            <Trash2 size={15} />
          )}
        </button>
      </div>
    </div>
  );
});
ProcuredResourceCard.displayName = 'ProcuredResourceCard';

const ShoppingList = () => {
  const shoppingListData = useStorageKey('shopping_list');
  const shoppingList = useMemo(() => Array.isArray(shoppingListData) ? shoppingListData : [], [shoppingListData]);
  const { setItem } = useStorageMethods();

  const [inputValue, setInputValue] = useState('');
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  // Global Purge Confirmation states
  const [globalPurging, setGlobalPurging] = useState(false);
  const [globalCountdown, setGlobalCountdown] = useState(3);
  const countdownTimerRef = useRef(null);
  const autoCancelTimerRef = useRef(null);

  useEffect(() => {
    document.title = 'VORO | Resource Procurement Terminus';
  }, []);

  // Cinematic status logger rotation in empty state
  useEffect(() => {
    if (shoppingList.length === 0) {
      const interval = setInterval(() => {
        setActiveLogIndex((prev) => (prev + 1) % SUPPLY_LOGS.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [shoppingList.length]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (autoCancelTimerRef.current) clearTimeout(autoCancelTimerRef.current);
    };
  }, []);

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Zero-Allocation Parent metrics useMemo.
   * Completely avoids garbage-collection thrashing by performing linear scans
   * in a single pass and memoizing the structural values.
   */
  const metrics = useMemo(() => {
    const total = shoppingList.length;
    const secured = shoppingList.reduce((acc, item) => item.checked ? acc + 1 : acc, 0);
    const rate = total > 0 ? Math.round((secured / total) * 100) : 0;
    const isOptimal = total > 0 && secured === total;

    return { total, secured, rate, isOptimal };
  }, [shoppingList]);

  const handleAddItem = async () => {
    if (!inputValue.trim()) return;
    const updated = [...shoppingList, { id: Date.now(), text: inputValue.trim(), checked: false }];
    await setItem('shopping_list', updated);
    setInputValue('');
  };

  const handleToggleItem = useCallback(async (id) => {
    const updated = shoppingList.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    await setItem('shopping_list', updated);
  }, [shoppingList, setItem]);

  const handleDeleteItem = useCallback(async (id) => {
    const updated = shoppingList.filter(item => item.id !== id);
    await setItem('shopping_list', updated);
  }, [shoppingList, setItem]);

  // Global Purge confirmation flow
  const initiateGlobalPurge = () => {
    if (globalPurging) {
      // Direct second press during countdown -> wipe list instantly
      executeGlobalPurge();
    } else {
      setGlobalPurging(true);
      setGlobalCountdown(3);

      // Countdown ticker
      countdownTimerRef.current = setInterval(() => {
        setGlobalCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Graceful automatic cancellation if not confirmed within 3s
      autoCancelTimerRef.current = setTimeout(() => {
        resetGlobalPurgeState();
      }, 3000);
    }
  };

  const executeGlobalPurge = async () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    if (autoCancelTimerRef.current) clearTimeout(autoCancelTimerRef.current);
    await setItem('shopping_list', []);
    resetGlobalPurgeState();
  };

  const resetGlobalPurgeState = () => {
    setGlobalPurging(false);
    setGlobalCountdown(3);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    if (autoCancelTimerRef.current) clearTimeout(autoCancelTimerRef.current);
  };

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30 relative overflow-hidden">
      {/* Cinematic Depth & Ambient Glow Matrix */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[5%] right-[-10%] w-[45%] h-[45%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24 z-10">

        {/* Luxury Re-Engineered Header Section */}
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/5 pb-16">
          <div className="space-y-6 max-w-2xl">
            {/* Active Supply Chain Eyebrow */}
            <div className="flex items-center gap-4 text-voro-primary">
              <div className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.8)]" />
              </div>
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.50em] opacity-90">
                Supply Chain Logistics // Resource Registry
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-white tracking-tighter leading-[0.9]">
              Procurement <span className="text-gradient not-italic font-bold">Manifest</span>
            </h1>

            <p className="text-gray-500 font-sans text-sm md:text-base leading-relaxed max-w-lg">
              Dynamic orchestration enclave for resource scheduling, metabolic provisions acquisition, and chemical compounds procurement.
            </p>
          </div>

          {/* Luxury 3-Column Telemetry Dashboard */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-white/[0.02] border border-white/5 rounded-[2rem] w-full md:w-auto shadow-2xl backdrop-blur-3xl min-w-[340px]">
            {/* Secures Column */}
            <div className="px-6 py-5 text-center">
              <span className="text-[0.5rem] font-mono font-bold text-gray-500 uppercase tracking-wider block">Secured</span>
              <span className="text-2xl font-serif italic font-bold text-white block mt-1">
                {metrics.secured} <span className="text-[0.6rem] not-italic font-mono text-gray-600">/ {metrics.total}</span>
              </span>
            </div>
            {/* Rate Column */}
            <div className="px-6 py-5 text-center border-x border-white/5">
              <span className="text-[0.5rem] font-mono font-bold text-gray-500 uppercase tracking-wider block">Flow Rate</span>
              <span className="text-2xl font-serif italic font-bold text-voro-primary block mt-1">
                {metrics.rate}<span className="text-[0.6rem] not-italic font-mono text-gray-600">%</span>
              </span>
            </div>
            {/* Status Column */}
            <div className="px-6 py-5 text-center flex flex-col justify-center items-center">
              <span className="text-[0.5rem] font-mono font-bold text-gray-500 uppercase tracking-wider block mb-1">Status</span>
              {metrics.total === 0 ? (
                <span className="text-[0.55rem] font-mono font-bold text-gray-600 uppercase tracking-widest mt-1">EMPTY</span>
              ) : metrics.isOptimal ? (
                <span className="text-[0.55rem] font-mono font-bold text-voro-secondary uppercase tracking-widest flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-voro-secondary animate-pulse" /> OPTIMAL
                </span>
              ) : (
                <span className="text-[0.55rem] font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> PROCUREMENT
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Input Terminal Card with Liquid Border Hover Depth */}
        <Card className="p-8 mb-12 bg-[#0A0C14]/60 backdrop-blur-3xl border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-voro-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-voro-primary/10 transition-colors duration-1000" />

          <div className="relative flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <Input
                placeholder="Declare resource identifier signature..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                className="bg-[#020408]/40 border-white/10 h-16 px-6 text-lg font-serif italic focus:border-voro-primary/50"
              />
            </div>
            <Button
              onClick={handleAddItem}
              className="h-16 px-10 text-[0.7rem] font-black uppercase tracking-[0.3em] shadow-xl shadow-voro-primary/20 w-full md:w-auto"
            >
              <Plus size={18} className="mr-2" />
              Append Manifest
            </Button>
          </div>
        </Card>

        {/* Procurement Controls & Manifest View */}
        {shoppingList.length > 0 ? (
          <div className="space-y-6">

            {/* Header control toolbar */}
            <div className="flex justify-between items-center px-4 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-voro-primary animate-pulse" />
                <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em]">
                  Active Telemetry Node Matrix
                </span>
              </div>

              {/* Secure Global Purge Button */}
              <button
                onClick={initiateGlobalPurge}
                aria-label={globalPurging ? `CONFIRM MASS PURGE COUNTDOWN ${globalCountdown} SECONDS` : "Purge complete resource manifest"}
                className={`flex items-center gap-3 px-6 py-3 border rounded-full text-[0.65rem] font-mono font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                  globalPurging
                    ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-lg shadow-red-500/20'
                    : 'bg-white/[0.01] border-white/5 text-gray-500 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5'
                }`}
              >
                {globalPurging ? (
                  <>
                    <ShieldAlert size={14} className="animate-bounce" />
                    <span>PURGE IN {globalCountdown}s (CLICK AGAIN)</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={13} />
                    <span>PURGE MANIFEST</span>
                  </>
                )}
              </button>
            </div>

            {/* List Segment */}
            <div className="space-y-4">
              {shoppingList.map((item, idx) => (
                <ProcuredResourceCard
                  key={item.id}
                  item={item}
                  index={idx}
                  onToggle={handleToggleItem}
                  onDelete={handleDeleteItem}
                  nodeId={`RES_NODE_0${idx}`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* High-end Cinematic Empty State: Supply Vacuum Core */
          <div className="py-24 flex flex-col items-center justify-center text-center relative max-w-lg mx-auto">
            <div className="relative w-36 h-36 flex items-center justify-center mb-10">

              {/* Rotating outer ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-voro-primary/20 animate-[spin_20s_linear_infinite]" />

              {/* Counter-rotating inner ring */}
              <div className="absolute inset-4 rounded-full border border-dashed border-voro-secondary/20 animate-[spin_10s_linear_infinite_reverse]" />

              {/* Deep central hub */}
              <div className="w-20 h-20 rounded-[2rem] bg-[#0A0C14] border border-white/5 flex items-center justify-center shadow-inner relative group">
                <div className="absolute inset-0 bg-voro-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Package size={28} className="text-gray-700 group-hover:text-voro-primary transition-colors duration-700" />
              </div>

              {/* Micro pulse node */}
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-voro-primary/30 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-voro-primary animate-ping" />
              </div>
            </div>

            {/* Cinematic Status Console */}
            <div className="space-y-3 mb-4">
              <h3 className="text-3xl font-serif italic font-medium text-white tracking-tight leading-none">
                Manifest <span className="text-voro-primary not-italic font-bold">Vacuum</span>
              </h3>
              <p className="text-gray-500 font-sans text-sm max-w-xs leading-relaxed">
                Awaiting declare signatures to construct and schedule your bio-provision pipelines.
              </p>
            </div>

            {/* Telemetry scrolling text */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-full min-h-[34px]">
              <RefreshCw size={12} className="text-voro-primary animate-spin-slow" />
              <span className="text-[0.55rem] font-mono font-bold text-voro-primary uppercase tracking-[0.2em] animate-pulse">
                {SUPPLY_LOGS[activeLogIndex]}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
