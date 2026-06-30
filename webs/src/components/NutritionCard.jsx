import React, { memo, useRef, useState, useId, useMemo, useEffect } from "react";
import { Trash2, Edit3, AlertCircle } from "lucide-react";

/**
 * ⚡ REFINEMENT: Luxury Metabolic Artifact Node (NutritionCard).
 * Re-engineered to the 'Forge' luxury standard with 3D spatial transforms,
 * magnetic mouse tracking, and industrial telemetry markers.
 *
 * DESIGN PHILOSOPHY:
 * 1. Aesthetic: High-fidelity charcoal architecture with glassmorphic depth.
 * 2. Typography: Playfair Display for meal names; JetBrains Mono for telemetry.
 * 3. Motion: Volumetric 3D tilt and 'Liquid Light' luminous lens.
 * 4. Precision: Surgical Reactivity via direct DOM manipulation for 60fps performance.
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
  const [isHovered, setIsHovered] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const reactId = useId();

  // Reset confirmation state after timeout
  useEffect(() => {
    if (isConfirming) {
      const timer = setTimeout(() => setIsConfirming(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConfirming]);

  const handleDeleteClick = () => {
    if (isConfirming) {
      onDelete();
      setIsConfirming(false);
    } else {
      setIsConfirming(true);
    }
  };

  // Generate a stable system ID for the node using useId for SSR safety
  const nodeId = useMemo(() => `MET_NODE_${reactId.replace(/:/g, '').slice(0, 4)}`, [reactId]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 10 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 20;
    const tiltX = (0.5 - (y / rect.height)) * 20;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered
          ? 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        relative bg-[#0A0C14] border border-white/5 p-8 rounded-[2.5rem]
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/20 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)]
        flex flex-col group/met h-full
        ${className}
      `}
    >
      {/* Precision Grid & Grain Architecture */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/met:opacity-100 transition-opacity duration-1000" style={{ transform: 'translateZ(10px)' }} />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens (Mouse Tracking) */}
        <div
          className="absolute inset-0 opacity-0 group-hover/met:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 45%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/met:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
        <header className="flex items-start justify-between mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[0.55rem] font-mono font-bold uppercase tracking-[0.4em] text-voro-primary">
                {meal.mealType || 'Artifact'}
              </span>
              <div className="h-px w-4 bg-voro-primary/30" />
            </div>
            <h3 className="text-xl md:text-2xl font-serif italic font-medium text-white tracking-tight group-hover/met:text-voro-primary transition-colors duration-500">
              {meal.name}
            </h3>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-mono font-bold text-white tracking-tighter">
              {meal.calories}
            </span>
            <span className="text-[0.5rem] font-black text-gray-600 uppercase tracking-[0.2em]">Energy kcal</span>
          </div>
        </header>

        {/* Macro Matrix Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Protein', value: meal.protein, color: 'text-voro-primary' },
            { label: 'Carbs', value: meal.carbs, color: 'text-voro-secondary' },
            { label: 'Fat', value: meal.fat, color: 'text-voro-accent' }
          ].map((macro) => (
            <div key={macro.label} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col items-center group-hover/met:bg-white/[0.04] transition-all duration-500">
              <span className="text-[0.45rem] font-mono font-black text-gray-600 uppercase tracking-widest mb-1">{macro.label}</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-lg font-mono font-bold ${macro.color}`}>{macro.value}</span>
                <span className="text-[0.45rem] font-mono text-gray-700">g</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex gap-3 mt-auto" style={{ transform: 'translateZ(50px)' }}>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex-1 py-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-gray-500 hover:text-white hover:bg-white/5 hover:border-white/10 transition-all duration-500 flex items-center justify-center gap-2 group/edit focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C14] active:scale-95"
            aria-label="Edit entry"
          >
            <Edit3 size={14} className="group-hover/edit:scale-110 transition-transform" />
            <span className="text-[0.55rem] font-black uppercase tracking-[0.2em]">Modify</span>
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className={`
              flex-1 py-3.5 rounded-xl border transition-all duration-500 flex items-center justify-center gap-2 group/del
              focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C14] active:scale-95
              ${isConfirming
                ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse'
                : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-red-400 hover:bg-red-400/5 hover:border-red-400/10'
              }
            `}
            aria-label={isConfirming ? "Confirm purge" : "Delete entry"}
          >
            {isConfirming ? (
              <>
                <AlertCircle size={14} className="animate-bounce" />
                <span className="text-[0.55rem] font-black uppercase tracking-[0.2em]">Confirm?</span>
              </>
            ) : (
              <>
                <Trash2 size={14} className="group-hover/del:scale-110 transition-transform" />
                <span className="text-[0.55rem] font-black uppercase tracking-[0.2em]">Purge</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Boutique Bottom Edge Detail */}
      <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover/met:via-voro-primary/30 transition-all duration-1000" />
    </div>
  );
});

NutritionCard.displayName = "NutritionCard";

export default NutritionCard;
