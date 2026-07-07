import React, { useState, useRef, useMemo, memo, useId } from "react";
import { ChevronDown } from "lucide-react";

/**
 * ⚡ REFINEMENT: Luxury Neural Accordion Node.
 * Re-engineered with the Forge design system: high-fidelity charcoal palette,
 * kinetic expansion physics, and volumetric 3D tilt effects.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Playfair Display serif titles for editorial weight.
 * 2. Precision: JetBrains Mono metadata and system telemetry markers.
 * 3. Motion: Smooth CSS grid-based expansion for layout stability.
 * 4. Spatial: Mathematical whitespace with rounded-[2.5rem] architecture.
 */
export const Accordion = memo(({ items = [], className = "" }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const accordionRef = useRef(null);

  const handleKeyDown = (e) => {
    const buttons = Array.from(accordionRef.current?.querySelectorAll('button') || []);
    const currentIndex = buttons.indexOf(document.activeElement);

    if (currentIndex === -1) return;

    let nextIndex;
    switch (e.key) {
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % buttons.length;
        break;
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = buttons.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    buttons[nextIndex]?.focus();
  };

  return (
    <div
      ref={accordionRef}
      onKeyDown={handleKeyDown}
      className={`space-y-6 ${className}`}
    >
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          index={index}
        />
      ))}
    </div>
  );
});

const AccordionItem = memo(({ item, isOpen, onToggle, index }) => {
  const id = useId();
  const buttonId = `accordion-button-${id}`;
  const regionId = `accordion-region-${id}`;
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt (max 8 degrees for subtle luxury)
    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const nodeId = useMemo(() => `NODE_AC_${index.toString().padStart(2, '0')}`, [index]);
  const attestedId = useMemo(() => Math.floor(Math.random() * 0x1000000).toString(16).toUpperCase().padStart(6, '0'), []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)`
          : `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`,
        transition: isHovered ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        relative overflow-hidden bg-[#0A0C14] border border-white/5 rounded-[2.5rem]
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isOpen ? "border-voro-primary/30 shadow-[0_40px_80px_rgba(0,0,0,0.6)]" : "hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"}
      `}
    >
      {/* Precision Grid & Light Detail */}
      <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.05), transparent 40%)`,
        }}
      />

      <button
        id={buttonId}
        onClick={onToggle}
        className="relative z-10 w-full px-10 py-8 flex items-center justify-between group outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C14] rounded-[2.5rem]"
        aria-expanded={isOpen}
        aria-controls={regionId}
      >
        <div className="flex flex-col items-start text-left gap-2">
          <div className="flex items-center gap-3">
             <span className="text-[0.5rem] font-mono font-black text-voro-primary uppercase tracking-[0.4em] opacity-60">
               {nodeId}
             </span>
             <div className="h-px w-4 bg-voro-primary/30" />
          </div>
          <span className={`text-2xl md:text-3xl font-serif italic font-medium tracking-tight transition-all duration-500 ${isOpen ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
            {item.title}
          </span>
        </div>

        <div className={`
          p-4 rounded-2xl bg-white/[0.02] border border-white/5
          text-gray-600 transition-all duration-700
          ${isOpen ? "rotate-180 bg-voro-primary/10 text-voro-primary border-voro-primary/20" : "group-hover:text-white group-hover:border-white/10"}
        `}>
          <ChevronDown size={20} />
        </div>
      </button>

      {/* Kinetic Expansion: CSS Grid Transition */}
      <div
        id={regionId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-10 pb-10 pt-2 space-y-8">
            <div className="h-px w-full bg-gradient-to-r from-voro-primary/20 via-white/5 to-transparent" />
            <div className="text-gray-400 font-medium leading-relaxed max-w-2xl">
              {item.content}
            </div>

            {/* Artifact Metadata */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex flex-col gap-1">
                <span className="text-[0.45rem] font-mono font-black text-gray-700 uppercase tracking-[0.3em]">Attestation</span>
                <span className="text-[0.6rem] font-mono font-bold text-gray-500">0x{attestedId}</span>
              </div>
              <div className="h-8 w-px bg-white/5" />
              <div className="flex flex-col gap-1">
                <span className="text-[0.45rem] font-mono font-black text-gray-700 uppercase tracking-[0.3em]">Telemetry</span>
                <span className="text-[0.6rem] font-mono font-bold text-gray-500">
                  X_<span ref={tiltXRef}>0.0</span> Y_<span ref={tiltYRef}>0.0</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corner System Highlight */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-voro-primary/10 to-transparent blur-3xl transition-opacity duration-1000 ${isOpen ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
});

AccordionItem.displayName = "AccordionItem";
Accordion.displayName = "Accordion";

export default Accordion;
