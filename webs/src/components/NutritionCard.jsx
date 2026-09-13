import React, { memo, useRef, useState, useId, useMemo, useEffect, useCallback } from "react";
import { Trash2, Edit3, AlertCircle } from "lucide-react";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted & Frozen Static Lookup Data.
 * Zero heap allocations during component render cycles for macro item mappings.
 */
const MACRO_ITEMS = Object.freeze([
  Object.freeze({ key: 'protein', label: 'Protein', color: 'text-voro-primary' }),
  Object.freeze({ key: 'carbs', label: 'Carbs', color: 'text-voro-secondary' }),
  Object.freeze({ key: 'fat', label: 'Fat', color: 'text-voro-accent' })
]);

/**
 * ⚡ REFINEMENT: Luxury Forge-Standard Metabolic Artifact Node (NutritionCard).
 * Re-engineered conforming to Voro's 'Forge' luxury system aesthetic and zero-allocation performance standards.
 * Features ultra-high-fidelity glassmorphism, 60fps direct-DOM 3D volumetric tilt tracking,
 * magnetic liquid border intelligence, holographic coordinate telemetry overlays,
 * SSR-safe deterministic sub-pixel hash badging (`0xMET_...`), and W3C APG compliant keyboard focus states.
 *
 * DESIGN & PSYCHOLOGICAL PHILOSOPHY:
 * 1. Visual Hierarchy & Authority: Playfair Display italic serif hero typography paired with
 *    JetBrains Mono technical metadata gives biometric meal logs an editorial gallery prestige.
 * 2. Spatial Architecture: Mathematical whitespace ratio with glassmorphic depth (`bg-[#0A0C14]/80 backdrop-blur-3xl`)
 *    allowing macro telemetry data to breathe effortlessly.
 * 3. High-End Micro-Interactions: 60fps direct-DOM volumetric 3D tilt tracking (`--tilt-x`, `--tilt-y`)
 *    and dynamic liquid border illumination (`radial-gradient` mask) create tactile feedback without React state churn.
 * 4. Cognitive Ease & Defensive Purge Safety: Context-aware interactive delete confirmation state
 *    prevents accidental data destruction with high-contrast visual safety indicators.
 */
export const NutritionCard = memo(({
  meal,
  onEdit,
  onDelete,
  className = ""
}) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const reactId = useId();

  // Reset confirmation state after timeout
  useEffect(() => {
    if (isConfirming) {
      const timer = setTimeout(() => setIsConfirming(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConfirming]);

  // Generate an SSR-safe deterministic sub-pixel hash badge
  const { nodeId, subpixelHash } = useMemo(() => {
    const cleanId = reactId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return {
      nodeId: `MET_NODE_${cleanId.slice(-4).padStart(4, '0')}`,
      subpixelHash: `0xMET_${cleanId.slice(-6).padStart(6, '0')}`
    };
  }, [reactId]);

  // Direct DOM 60fps 3D volumetric rotational tilt and mouse tracking
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D tilt calculation (clamped to max 10 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 20;
    const tiltX = (0.5 - (y / rect.height)) * 20;

    const style = containerRef.current.style;
    style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
    style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
    style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    style.setProperty('transform', `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`);
    style.setProperty('transition', 'none');

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    if (!containerRef.current) return;

    const style = containerRef.current.style;
    if (isFocusedRef.current) {
      // Return to static 4-degree keyboard focus tilt feedback
      style.setProperty('--tilt-x', '4.00deg');
      style.setProperty('--tilt-y', '-4.00deg');
      style.setProperty('transform', 'perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(-2px)');
      style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    } else {
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('transform', 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
      style.setProperty('transition', 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  }, []);

  const handleFocus = useCallback(() => {
    isFocusedRef.current = true;
    if (!containerRef.current) return;

    const style = containerRef.current.style;
    style.setProperty('--tilt-x', '4.00deg');
    style.setProperty('--tilt-y', '-4.00deg');
    style.setProperty('transform', 'perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(-2px)');
    style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
    if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
    if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
  }, []);

  const handleBlur = useCallback(() => {
    isFocusedRef.current = false;
    if (!containerRef.current) return;

    if (!isHoveredRef.current) {
      const style = containerRef.current.style;
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('transform', 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
      style.setProperty('transition', 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  }, []);

  const handleEditClick = useCallback((e) => {
    e.stopPropagation();
    onEdit?.(meal);
  }, [onEdit, meal]);

  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation();
    if (isConfirming) {
      onDelete?.(meal);
      setIsConfirming(false);
    } else {
      setIsConfirming(true);
    }
  }, [isConfirming, onDelete, meal]);

  const mealName = meal?.name || "Metabolic Entry";
  const mealType = meal?.mealType || "Artifact";
  const calories = meal?.calories ?? 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      role="article"
      aria-label={`Metabolic artifact: ${mealName}. Type: ${mealType}. Energy: ${calories} kilocalories.`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      className={`
        relative bg-[#0A0C14]/90 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-3xl
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/20 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]
        flex flex-col group/met h-full overflow-hidden
        ${className}
      `}
    >
      {/* 🛰️ Liquid Border Intelligence: Reactive perimeter illumination */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/met:opacity-100 group-focus-visible/met:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.35), transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Volumetric Internal Parallax, Grain & Grid Layers */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/met:opacity-100 group-focus-visible/met:opacity-100 transition-opacity duration-1000" style={{ transform: 'translateZ(10px)' }} />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens (Mouse Tracking) */}
        <div
          className="absolute inset-0 opacity-0 group-hover/met:opacity-100 group-focus-visible/met:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.08), transparent 45%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Coordinate Telemetry & Holographic Badge Overlay */}
      <div
        aria-hidden="true"
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/met:opacity-100 group-focus-visible/met:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1 select-none">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      {/* Sub-pixel System Attestation Badge */}
      <div
        aria-hidden="true"
        className="absolute bottom-4 left-8 text-[0.4rem] font-mono font-bold text-white/10 group-hover/met:text-white/30 group-focus-visible/met:text-white/30 transition-colors duration-700 tracking-[0.25em] pointer-events-none select-none"
        style={{ transform: 'translateZ(40px)' }}
      >
        {subpixelHash}
      </div>

      {/* Main Content Enclave */}
      <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
        <header className="flex items-start justify-between mb-6">
          <div className="space-y-2 max-w-[70%]">
            <div className="flex items-center gap-3">
              <span className="text-[0.55rem] font-mono font-bold uppercase tracking-[0.4em] text-voro-primary">
                {mealType}
              </span>
              <div className="h-px w-4 bg-voro-primary/30" />
            </div>
            <h3 className="text-xl md:text-2xl font-serif italic font-medium text-white tracking-tight group-hover/met:text-voro-primary transition-colors duration-500">
              {mealName}
            </h3>
          </div>

          {/* Energy Telemetry Specimen */}
          <div className="flex flex-col items-end bg-white/[0.02] border border-white/5 px-4 py-2 rounded-2xl group-hover/met:border-voro-primary/20 transition-colors duration-500">
            <span className="text-2xl font-mono font-bold text-white tracking-tighter">
              {calories}
            </span>
            <span className="text-[0.45rem] font-mono font-black text-gray-500 uppercase tracking-[0.2em]">Energy kcal</span>
          </div>
        </header>

        {/* Macro Matrix Grid Node */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {MACRO_ITEMS.map((macro) => {
            const val = meal ? (meal[macro.key] ?? 0) : 0;
            return (
              <div
                key={macro.key}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col items-center group-hover/met:bg-white/[0.04] group-hover/met:border-white/10 transition-all duration-500"
              >
                <span className="text-[0.45rem] font-mono font-black text-gray-500 uppercase tracking-widest mb-1">
                  {macro.label}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-lg font-mono font-bold ${macro.color}`}>
                    {val}
                  </span>
                  <span className="text-[0.45rem] font-mono text-gray-600">g</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Controls Matrix */}
      <div className="relative z-10 flex gap-3 mt-auto" style={{ transform: 'translateZ(50px)' }}>
        {onEdit && (
          <button
            type="button"
            onClick={handleEditClick}
            className="flex-1 py-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/10 transition-all duration-500 flex items-center justify-center gap-2 group/edit focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C14] active:scale-95"
            aria-label={`Modify ${mealName}`}
          >
            <Edit3 size={14} className="group-hover/edit:scale-110 transition-transform" />
            <span className="text-[0.55rem] font-mono font-black uppercase tracking-[0.2em]">Modify</span>
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={handleDeleteClick}
            className={`
              flex-1 py-3.5 rounded-xl border transition-all duration-500 flex items-center justify-center gap-2 group/del
              focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C14] active:scale-95
              ${isConfirming
                ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-red-400 hover:bg-red-400/5 hover:border-red-400/10'
              }
            `}
            aria-label={isConfirming ? `Confirm purge ${mealName}` : `Purge ${mealName}`}
          >
            {isConfirming ? (
              <>
                <AlertCircle size={14} className="animate-bounce text-red-400" />
                <span className="text-[0.55rem] font-mono font-black uppercase tracking-[0.2em]">Confirm?</span>
              </>
            ) : (
              <>
                <Trash2 size={14} className="group-hover/del:scale-110 transition-transform" />
                <span className="text-[0.55rem] font-mono font-black uppercase tracking-[0.2em]">Purge</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Boutique Bottom Edge Indicator */}
      <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover/met:via-voro-primary/30 transition-all duration-1000" />
    </div>
  );
});

NutritionCard.displayName = "NutritionCard";

export default NutritionCard;
