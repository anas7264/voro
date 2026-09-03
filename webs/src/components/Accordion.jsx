import React, { useState, useRef, useMemo, memo, useId } from "react";
import { ChevronDown } from "lucide-react";

/**
 * ⚡ REFINEMENT: Luxury Neural Accordion Node ('Kinetic Neural Accordion Node').
 * Re-engineered with Voro's Forge luxury design system architecture:
 * Features 60fps direct-DOM 3D volumetric hover tilt tracking, magnetic liquid border
 * illumination, holographic spatial coordinate telemetry, deterministic sub-pixel
 * attestation badging, W3C APG compliant keyboard focus states, and zero-allocation
 * performance standards.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Box-model architecture suggests a precision data expansion matrix.
 * 2. Precision: JetBrains Mono for system markers; Playfair Display italic for titles.
 * 3. Motion: Direct-DOM 60fps volumetric rotational tilt and kinetic grid expansion.
 * 4. Spatial: Golden ratio whitespace optimization with rounded-[2.5rem] architecture.
 */

const EMPTY_ITEMS = Object.freeze([]);

export const Accordion = memo(({ items = EMPTY_ITEMS, className = "" }) => {
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
  const generatedId = useId();
  const buttonId = `accordion-button-${generatedId}`;
  const regionId = `accordion-region-${generatedId}`;

  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);

  // Generate stable, deterministic system node identification and attestation markers
  const nodeId = useMemo(() => `NODE_AC_${index.toString().padStart(2, '0')}`, [index]);

  const subpixelHash = useMemo(() => {
    const cleanId = generatedId.replace(/:/g, '');
    return `0xACD_${cleanId.slice(0, 4).toUpperCase().padStart(4, '0')}`;
  }, [generatedId]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D rotational tilt calculation (clamped to max 8 degrees for luxury restraint)
    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    // Internal parallax displacement
    const gridX = (x / rect.width - 0.5) * -12;
    const gridY = (y / rect.height - 0.5) * -12;

    const style = containerRef.current.style;
    style.setProperty('--mouse-x', `${x}px`);
    style.setProperty('--mouse-y', `${y}px`);
    style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    style.setProperty('--grid-x', `${gridX.toFixed(2)}px`);
    style.setProperty('--grid-y', `${gridY.toFixed(2)}px`);
    style.setProperty('transform', `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`);
    style.setProperty('transition', 'none');

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (!containerRef.current) return;

    const style = containerRef.current.style;
    if (isFocusedRef.current) {
      // Revert back to focus static 4-degree tilt on mouse leave
      style.setProperty('--tilt-x', '4.00deg');
      style.setProperty('--tilt-y', '-4.00deg');
      style.setProperty('--grid-x', '0px');
      style.setProperty('--grid-y', '0px');
      style.setProperty('transform', 'perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(-2px)');
      style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    } else {
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('--grid-x', '0px');
      style.setProperty('--grid-y', '0px');
      style.setProperty('transform', 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
      style.setProperty('transition', 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)');
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  };

  const handleFocus = () => {
    isFocusedRef.current = true;
    if (!containerRef.current) return;

    const style = containerRef.current.style;
    style.setProperty('--tilt-x', '4.00deg');
    style.setProperty('--tilt-y', '-4.00deg');
    style.setProperty('transform', 'perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(-2px)');
    style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
    if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
    if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
  };

  const handleBlur = () => {
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
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      className={`
        relative overflow-hidden bg-[#0A0C14]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem]
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group/accordion-item
        ${isOpen ? "border-voro-primary/30 shadow-[0_40px_80px_rgba(0,0,0,0.6)]" : "hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"}
      `}
    >
      {/* 🛰️ Liquid Border Intelligence: Reactive perimeter illumination */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/accordion-item:opacity-100 group-focus-within/accordion-item:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.35), transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Volumetric Internal Parallax & Grain Architecture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: 'translate3d(var(--grid-x, 0px), var(--grid-y, 0px), 0)'
        }}
      >
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/accordion-item:opacity-100 group-focus-within/accordion-item:opacity-100 transition-opacity duration-1000" />
      </div>

      {/* Dynamic Luminous Lens Spotlight */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover/accordion-item:opacity-100 group-focus-within/accordion-item:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.05), transparent 40%)`,
          transform: 'translateZ(20px)'
        }}
      />

      <button
        id={buttonId}
        onClick={onToggle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="relative z-10 w-full px-10 py-8 flex items-center justify-between outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/50 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0C14] rounded-[2.5rem]"
        aria-expanded={isOpen}
        aria-controls={regionId}
      >
        <div className="flex flex-col items-start text-left gap-2" style={{ transform: 'translateZ(40px)' }}>
          <div className="flex items-center gap-3">
             <span className="text-[0.55rem] font-mono font-black text-voro-primary uppercase tracking-[0.4em]">
               {nodeId}
             </span>
             <div className="h-px w-4 bg-voro-primary/30" />
          </div>
          <span className={`text-2xl md:text-3xl font-serif italic font-medium tracking-tight transition-colors duration-500 ${isOpen ? "text-white" : "text-gray-400 group-hover/accordion-item:text-white"}`}>
            {item.title}
          </span>
        </div>

        <div
          style={{ transform: 'translateZ(40px)' }}
          className={`
            p-4 rounded-2xl bg-white/[0.02] border border-white/5
            text-gray-600 transition-all duration-700
            ${isOpen ? "rotate-180 bg-voro-primary/10 text-voro-primary border-voro-primary/20 shadow-[0_0_15px_rgba(124,58,237,0.3)]" : "group-hover/accordion-item:text-white group-hover/accordion-item:border-white/10"}
          `}
        >
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
          <div className="px-10 pb-10 pt-2 space-y-8" style={{ transform: 'translateZ(30px)' }}>
            <div className="h-px w-full bg-gradient-to-r from-voro-primary/20 via-white/5 to-transparent" />
            <div className="text-gray-400 font-medium leading-relaxed max-w-2xl">
              {item.content}
            </div>

            {/* Artifact Metadata & Coordinate Telemetry */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex flex-col gap-1">
                <span className="text-[0.45rem] font-mono font-black text-gray-700 uppercase tracking-[0.3em]">Attestation</span>
                <span className="text-[0.6rem] font-mono font-bold text-gray-400">{subpixelHash}</span>
              </div>
              <div className="h-8 w-px bg-white/5" />
              <div className="flex flex-col gap-1">
                <span className="text-[0.45rem] font-mono font-black text-gray-700 uppercase tracking-[0.3em]">Telemetry</span>
                <span className="text-[0.6rem] font-mono font-bold text-gray-400">
                  X_<span ref={tiltXRef}>0.0</span>° Y_<span ref={tiltYRef}>0.0</span>°
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corner System Glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-voro-primary/10 to-transparent blur-3xl transition-opacity duration-1000 pointer-events-none ${isOpen ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
});

AccordionItem.displayName = "AccordionItem";
Accordion.displayName = "Accordion";

export default Accordion;
