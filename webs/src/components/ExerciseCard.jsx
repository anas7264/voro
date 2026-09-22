import React, { memo, useRef, useId, useMemo, useCallback } from "react";
import { Activity, Sparkles, ChevronRight, Edit3, Trash2 } from "lucide-react";
import { Button } from "./Button";

/**
 * ⚡ REFINEMENT: Refined Luxury Kinetic Movement Pattern Node (ExerciseCard).
 * Re-engineered conforming to Voro's 'Forge' luxury system aesthetic and zero-allocation performance standards.
 * Features ultra-high-fidelity glassmorphism, 60fps direct-DOM 3D volumetric tilt tracking,
 * magnetic liquid border intelligence, holographic coordinate telemetry overlays,
 * SSR-safe deterministic sub-pixel hash badging (`0xEX_...`), and W3C APG compliant keyboard focus states.
 *
 * DESIGN & PSYCHOLOGICAL PHILOSOPHY:
 * 1. Visual Hierarchy & Authority: Playfair Display italic serif hero typography paired with
 *    JetBrains Mono technical metadata gives exercise movement patterns editorial gallery prestige.
 * 2. Spatial Architecture: Mathematical whitespace ratio with glassmorphic depth (`bg-[#0A0C14]/90 backdrop-blur-3xl`)
 *    allowing movement telemetry and tips to breathe effortlessly.
 * 3. High-End Micro-Interactions: 60fps direct-DOM volumetric 3D tilt tracking (`--tilt-x`, `--tilt-y`)
 *    and dynamic liquid border illumination (`radial-gradient` mask) create tactile feedback without React state churn.
 * 4. Cognitive Ease: High-contrast pill tags and explicit action titles reduce cognitive load and enhance accessibility.
 */
export const ExerciseCard = memo(({
  exercise,
  onSelect,
  onEdit,
  onDelete,
  className = ""
}) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const reactId = useId();

  // Generate an SSR-safe deterministic system node ID and sub-pixel attestation hash badge
  const { nodeId, subpixelHash } = useMemo(() => {
    const cleanId = reactId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return {
      nodeId: `EX_NODE_${cleanId.slice(-4).padStart(4, '0')}`,
      subpixelHash: `0xEX_${cleanId.slice(-6).padStart(6, '0')}`
    };
  }, [reactId]);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 12 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 24;
    const tiltX = (0.5 - (y / rect.height)) * 24;

    const style = containerRef.current.style;
    style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
    style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
    style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    style.setProperty('transform', 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-8px)');

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    if (containerRef.current) {
      containerRef.current.style.setProperty('transition', 'none');
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    if (!containerRef.current) return;

    const style = containerRef.current.style;
    style.setProperty('transition', 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)');

    if (isFocusedRef.current) {
      style.setProperty('--tilt-x', '4.00deg');
      style.setProperty('--tilt-y', '-4.00deg');
      style.setProperty('transform', 'perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(-8px)');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    } else {
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('transform', 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  }, []);

  const handleFocus = useCallback(() => {
    isFocusedRef.current = true;
    if (!containerRef.current) return;

    const style = containerRef.current.style;
    style.setProperty('transition', 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)');
    style.setProperty('--tilt-x', '4.00deg');
    style.setProperty('--tilt-y', '-4.00deg');
    style.setProperty('transform', 'perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(-8px)');
    if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
    if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
  }, []);

  const handleBlur = useCallback(() => {
    isFocusedRef.current = false;
    if (!containerRef.current) return;

    if (!isHoveredRef.current) {
      const style = containerRef.current.style;
      style.setProperty('transition', 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)');
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('transform', 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  }, []);

  const handleSelect = useCallback(() => {
    onSelect?.(exercise);
  }, [onSelect, exercise]);

  const handleKeyDown = useCallback((e) => {
    if (onSelect && (e.key === "Enter" || e.key === " ") && e.target === containerRef.current) {
      e.preventDefault();
      onSelect(exercise);
    }
  }, [onSelect, exercise]);

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    onEdit?.(exercise);
  }, [onEdit, exercise]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete?.(exercise);
  }, [onDelete, exercise]);

  const exerciseName = exercise?.name || "Movement Pattern";
  const category = exercise?.category || "General";
  const difficulty = exercise?.difficulty || "Standard";
  const description = exercise?.description || "";
  const tips = exercise?.tips;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`Movement pattern: ${exerciseName}. Category: ${category}. Difficulty: ${difficulty}.`}
      style={{
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        relative bg-[#0A0C14]/90 border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-3xl
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/20 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]
        flex flex-col justify-between group/ex h-full overflow-hidden
        ${className}
      `}
    >
      {/* 🛰️ Liquid Border Intelligence: Reactive perimeter illumination */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/ex:opacity-100 group-focus-visible/ex:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.35), transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Precision Grid & Grain Architecture */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/ex:opacity-100 group-focus-visible/ex:opacity-100 transition-opacity duration-1000" style={{ transform: 'translateZ(10px)' }} />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens (Mouse Tracking) */}
        <div
          className="absolute inset-0 opacity-0 group-hover/ex:opacity-100 group-focus-visible/ex:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.08), transparent 45%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Coordinate Telemetry Overlay */}
      <div
        aria-hidden="true"
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/ex:opacity-100 group-focus-visible/ex:opacity-100 transition-all duration-500"
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
        className="absolute bottom-4 left-10 text-[0.4rem] font-mono font-bold text-white/10 group-hover/ex:text-white/30 group-focus-visible/ex:text-white/30 transition-colors duration-700 tracking-[0.25em] pointer-events-none select-none"
        style={{ transform: 'translateZ(40px)' }}
      >
        {subpixelHash}
      </div>

      <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
        <header className="flex items-start justify-between mb-8">
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <span className="text-[0.55rem] font-mono font-bold uppercase tracking-[0.4em] text-voro-primary">
                   {category}
                </span>
                <div className="h-px w-4 bg-voro-primary/30" />
                <span className="text-[0.55rem] font-mono font-bold uppercase tracking-[0.4em] text-gray-500">
                   {difficulty}
                </span>
             </div>
             <h3 className="text-2xl md:text-3xl font-serif italic font-medium text-white tracking-tight group-hover/ex:text-voro-primary transition-colors duration-500">
               {exerciseName}
             </h3>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-500 group-hover/ex:text-voro-primary group-hover/ex:bg-voro-primary/5 group-hover/ex:border-voro-primary/10 transition-all duration-700">
             <Activity size={20} />
          </div>
        </header>

        {description && (
          <p className="text-sm text-gray-400 leading-relaxed mb-10 font-medium">
            {description}
          </p>
        )}

        {tips && tips.length > 0 && (
          <div className="space-y-3 mb-10">
            <div className="flex items-center gap-2.5 text-[0.55rem] font-black uppercase tracking-[0.3em] text-voro-accent/90">
              <Sparkles size={12} className="text-voro-accent" />
              <span>Kinetic Insights</span>
            </div>
            <p className="text-xs italic text-gray-400 pl-4 border-l border-voro-accent/30 leading-relaxed font-serif">
              "{tips[0]}"
            </p>
          </div>
        )}
      </div>

      <div className="relative z-10 flex gap-4 mt-auto" style={{ transform: 'translateZ(50px)' }}>
        {onSelect && (
          <Button
            type="button"
            onClick={handleSelect}
            className="flex-1 !rounded-2xl"
          >
            <span>Integrate Pattern</span>
            <ChevronRight size={16} />
          </Button>
        )}
        {onEdit && (
          <button
            type="button"
            onClick={handleEdit}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/10 transition-all outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary active:scale-95"
            aria-label={`Edit ${exerciseName} pattern`}
            title={`Edit ${exerciseName} pattern`}
          >
            <Edit3 size={18} />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-400 hover:text-red-400 hover:bg-red-400/5 hover:border-red-400/10 transition-all outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-95"
            aria-label={`Delete ${exerciseName} pattern`}
            title={`Delete ${exerciseName} pattern`}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Boutique Bottom Edge Indicator */}
      <div className="absolute bottom-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover/ex:via-voro-primary/30 transition-all duration-1000" />
    </div>
  );
});

ExerciseCard.displayName = "ExerciseCard";

export default ExerciseCard;
