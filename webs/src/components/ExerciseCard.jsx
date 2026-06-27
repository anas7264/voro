import React, { memo, useRef, useState, useId } from "react";
import { Activity, Sparkles, ChevronRight, Edit3, Trash2 } from "lucide-react";
import { Button } from "./Button";

/**
 * ⚡ REFINEMENT: Luxury Kinetic Movement Pattern Node (ExerciseCard).
 * Re-engineered to the 'Forge' luxury standard with 3D spatial transforms,
 * magnetic mouse tracking, and industrial telemetry markers.
 *
 * DESIGN PHILOSOPHY:
 * 1. Aesthetic: High-fidelity charcoal architecture with glassmorphic depth.
 * 2. Typography: Playfair Display for movement names; JetBrains Mono for telemetry.
 * 3. Motion: Volumetric 3D tilt and 'Liquid Light' luminous lens.
 * 4. Precision: Surgical Reactivity via direct DOM manipulation for 60fps performance.
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
  const [isHovered, setIsHovered] = useState(false);
  const reactId = useId();

  // Generate a stable system ID for the node using useId for SSR safety
  const nodeId = `EX_NODE_${reactId.replace(/:/g, '')}`;

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 12 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 24;
    const tiltX = (0.5 - (y / rect.height)) * 24;

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
          ? 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-8px)'
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        relative bg-[#0A0C14] border border-white/5 p-10 rounded-[2.5rem]
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-white/20 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]
        flex flex-col justify-between group/ex h-full
        ${className}
      `}
    >
      {/* Precision Grid & Grain Architecture */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/ex:opacity-100 transition-opacity duration-1000" style={{ transform: 'translateZ(10px)' }} />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens (Mouse Tracking) */}
        <div
          className="absolute inset-0 opacity-0 group-hover/ex:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 45%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/ex:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
        <header className="flex items-start justify-between mb-8">
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <span className="text-[0.55rem] font-mono font-bold uppercase tracking-[0.4em] text-voro-primary">
                   {exercise.category}
                </span>
                <div className="h-px w-4 bg-voro-primary/30" />
                <span className="text-[0.55rem] font-mono font-bold uppercase tracking-[0.4em] text-gray-600">
                   {exercise.difficulty}
                </span>
             </div>
             <h3 className="text-2xl md:text-3xl font-serif italic font-medium text-white tracking-tight group-hover/ex:text-voro-primary transition-colors duration-500">
               {exercise.name}
             </h3>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-600 group-hover/ex:text-voro-primary group-hover/ex:bg-voro-primary/5 group-hover/ex:border-voro-primary/10 transition-all duration-700">
             <Activity size={20} />
          </div>
        </header>

        <p className="text-sm text-gray-500 leading-relaxed mb-10 opacity-80 font-medium">
          {exercise.description}
        </p>

        {exercise.tips && exercise.tips.length > 0 && (
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3 text-[0.55rem] font-black uppercase tracking-[0.3em] text-gray-700">
              <Sparkles size={12} className="text-voro-accent" />
              <span>Kinetic Insights</span>
            </div>
            <p className="text-xs italic text-gray-400 pl-4 border-l border-voro-accent/20 leading-relaxed">
              "{exercise.tips[0]}"
            </p>
          </div>
        )}
      </div>

      <div className="relative z-10 flex gap-4 mt-auto" style={{ transform: 'translateZ(50px)' }}>
        {onSelect && (
          <Button
            onClick={onSelect}
            className="flex-1 !rounded-2xl"
          >
            <span>Integrate Pattern</span>
            <ChevronRight size={16} />
          </Button>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-600 hover:text-white hover:bg-white/5 hover:border-white/10 transition-all"
            aria-label="Edit pattern"
          >
            <Edit3 size={18} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-600 hover:text-red-400 hover:bg-red-400/5 hover:border-red-400/10 transition-all"
            aria-label="Delete pattern"
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
