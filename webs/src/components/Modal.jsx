import React, { memo, useEffect, useId, useMemo, useRef } from "react";
import { X } from "lucide-react";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted & Frozen static lookup mappings.
 * Zero heap allocations during component render cycles.
 */
const MODAL_SIZES = Object.freeze({
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-4xl"
});

/**
 * ⚡ REFINEMENT: Luxury Neural Interruption Chamber ('Modal').
 * Re-engineered conforming to Voro's 'Forge' luxury architecture:
 * 1. Ultra-high-fidelity glassmorphism with 60fps direct-DOM 3D volumetric tilt tracking.
 * 2. Magnetic liquid border intelligence (reactive perimeter light gradient mask).
 * 3. Live holographic spatial coordinate telemetry (`TX_...°`, `TY_...°`).
 * 4. SSR-safe deterministic sub-pixel attestation badging (`0xMDL_...`) via React `useId()`.
 * 5. Editorial typography pairing Playfair Display italic serif headings with JetBrains Mono tabular metadata.
 * 6. W3C APG compliant modal dialog accessibility with strict keyboard focus trapping and focus restoration on unmount.
 */
export const Modal = memo(({ isOpen, onClose, title, children, size = "md", ...props }) => {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  const modalRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);

  // Generate a stable system ID and sub-pixel hash for the modal node
  const nodeId = useMemo(() => {
    const cleanId = generatedId.replace(/:/g, '');
    return `MDL_${cleanId.slice(0, 3).toUpperCase().padStart(3, '0')}`;
  }, [generatedId]);

  const subpixelHash = useMemo(() => {
    const cleanId = generatedId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `0xMDL_${cleanId.slice(-4).padStart(4, '0')}`;
  }, [generatedId]);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && (document.activeElement === first || document.activeElement === modalRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const originalOverflow = window.getComputedStyle(document.body).overflow;
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => {
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }, 0);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      }
    };
  }, [isOpen, onClose]);

  const handleMouseMove = (e) => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D tilt calculation (max 10deg)
    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    const style = modalRef.current.style;
    style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
    style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
    style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    style.setProperty('transform', `perspective(1200px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-2px)`);
    style.setProperty('transition', 'none');

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleMouseLeave = () => {
    if (!modalRef.current) return;
    const style = modalRef.current.style;
    style.setProperty('--tilt-x', '0deg');
    style.setProperty('--tilt-y', '0deg');
    style.setProperty('transform', 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)');
    style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');

    if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
    if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
  };

  if (!isOpen) return null;

  const closeLabel = typeof title === "string" && title ? `Close ${title}` : "Close modal";
  const sizeClass = MODAL_SIZES[size] || MODAL_SIZES.md;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Dynamic Backdrop: Glassmorphic Absorption */}
      <div
        className="absolute inset-0 bg-[#020408]/85 backdrop-blur-2xl animate-fade-in cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container: Architectural Interruption Chamber */}
      <div
        ref={modalRef}
        tabIndex={-1}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`
          group relative w-full max-h-full rounded-[3rem] bg-[#0A0C14]/90 backdrop-blur-3xl border border-white/10
          shadow-[0_80px_160px_-40px_rgba(0,0,0,0.9),inset_0_1px_1px_0_rgba(255,255,255,0.08)]
          flex flex-col overflow-hidden animate-scale-in outline-none focus:ring-2 focus:ring-voro-primary/50
          transition-all duration-700
          ${sizeClass}
        `}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1200px'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        {...props}
      >
        {/* 🛰️ Liquid Border Intelligence: Dynamic reactive perimeter illumination */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[3rem] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            padding: '1px',
            background: `radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.35), transparent 80%)`,
            WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Volumetric Internal Micro-Grid & Boutique Grain Texture */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.03]" />
          <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700" />
        </div>

        {/* Dynamic Luminous Lens Spotlight */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.05), transparent 50%)`,
            transform: 'translateZ(20px)'
          }}
        />

        {/* Corner Telemetry Overlay */}
        <div
          aria-hidden="true"
          className="absolute top-4 right-16 pointer-events-none opacity-0 group-hover:opacity-80 transition-opacity duration-500 font-mono text-[0.4rem] font-bold text-white/30 tracking-widest flex items-center gap-2 select-none"
          style={{ transform: 'translateZ(40px)' }}
        >
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-voro-primary/50">[{nodeId}]</span>
        </div>

        {/* Header: Editorial Frame */}
        <div
          className="relative z-10 flex items-center justify-between p-8 sm:p-10 border-b border-white/5 bg-white/[0.01]"
          style={{ transform: 'translateZ(30px)' }}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-voro-primary shadow-[0_0_12px_rgba(124,58,237,0.9)]" />
              </div>
              <span className="text-[0.55rem] font-mono font-black uppercase tracking-[0.45em] text-voro-primary/80">
                Interruption_Protocol // {nodeId}
              </span>
            </div>

            <div className="space-y-2">
              <h2 id={titleId} className="text-2xl sm:text-3xl font-serif italic font-medium text-white tracking-tight leading-none">
                {title}
              </h2>
              {/* Liquid Light Indicator */}
              <div className="h-0.5 w-16 bg-gradient-to-r from-voro-primary to-transparent rounded-full shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
            </div>
          </div>

          <button
            onClick={onClose}
            className={`
              p-3.5 rounded-2xl bg-white/[0.03] border border-white/5
              text-gray-400 hover:text-white hover:border-white/15 hover:bg-white/[0.06]
              transition-all duration-500 active:scale-90 focus:outline-none
              focus-visible:ring-2 focus-visible:ring-voro-primary
              focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C14]
              group cursor-pointer
            `}
            aria-label={closeLabel}
            title={closeLabel}
          >
            <X size={18} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        {/* Content: Procedural Void */}
        <div
          className="relative z-10 flex-1 overflow-y-auto p-8 sm:p-10 no-scrollbar"
          style={{ transform: 'translateZ(25px)' }}
        >
          {children}
        </div>

        {/* Boutique Footer Detail */}
        <div
          className="relative z-10 p-5 px-8 sm:px-10 border-t border-white/[0.03] flex justify-between items-center bg-black/20"
          style={{ transform: 'translateZ(20px)' }}
        >
          <div className="flex gap-2">
            <div className="w-1 h-1 rounded-full bg-voro-primary/60" />
            <div className="w-1 h-1 rounded-full bg-voro-primary/40" />
            <div className="w-1 h-1 rounded-full bg-voro-primary/20" />
          </div>
          <span className="text-[0.45rem] font-mono text-white/20 tracking-[0.5em] uppercase font-bold">
            {subpixelHash} // {nodeId}_ATTESTED_CHAMBER
          </span>
        </div>
      </div>
    </div>
  );
});

Modal.displayName = "Modal";

export default Modal;
