import React, { useEffect, useId, useMemo } from "react";
import { X } from "lucide-react";

/**
 * ⚡ REFINEMENT: Luxury Neural Interruption Chamber (Modal).
 * Re-engineered with the Forge design system: high-fidelity charcoal architecture,
 * kinetic backdrop blurs, and industrial system telemetry.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Box-model architecture suggests a secure, isolated execution environment.
 * 2. Precision: JetBrains Mono for system markers and technical metadata.
 * 3. Motion: Scale-in transition with fluid backdrop absorption for a boutique feel.
 * 4. Atmosphere: Glassmorphic background with boutique grain texture.
 */
export const Modal = ({ isOpen, onClose, title, children, size = "md", ...props }) => {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;

  // Generate a stable system ID for the modal node
  const nodeId = useMemo(() => {
    const cleanId = generatedId.replace(/:/g, '');
    return `MDL_${cleanId.slice(0, 3).toUpperCase()}`;
  }, [generatedId]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      const originalOverflow = window.getComputedStyle(document.body).overflow;
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      return () => {
        window.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-4xl"
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Dynamic Backdrop: Glassmorphic Absorption */}
      <div
        className="absolute inset-0 bg-[#020408]/80 backdrop-blur-2xl animate-fade-in cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container: Architectural Interruption Chamber */}
      <div
        className={`
          relative w-full max-h-full rounded-[3rem] bg-[#0A0C14] border border-white/5
          shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.05)]
          flex flex-col overflow-hidden animate-scale-in
          ${sizes[size] || sizes.md}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        {...props}
      >
        {/* Boutique Grain Texture */}
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.03] pointer-events-none" />

        {/* Header: Editorial Frame */}
        <div className="relative z-10 flex items-center justify-between p-10 sm:p-12 border-b border-white/5 bg-white/[0.01]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.8)]"></span>
              </div>
              <span className="text-[0.55rem] font-mono font-black uppercase tracking-[0.5em] text-gray-500">
                Interruption_Protocol // {nodeId}
              </span>
            </div>

            <div className="space-y-2">
              <h2 id={titleId} className="text-3xl sm:text-4xl font-serif italic font-medium text-white tracking-tight leading-none">
                {title}
              </h2>
              {/* Liquid Light Indicator */}
              <div className="h-0.5 w-16 bg-gradient-to-r from-voro-primary to-transparent rounded-full shadow-[0_0_15px_rgba(124,58,237,0.4)]" />
            </div>
          </div>

          <button
            onClick={onClose}
            className={`
              p-4 rounded-2xl bg-white/[0.03] border border-white/5
              text-gray-500 hover:text-white hover:border-white/10
              transition-all duration-500 active:scale-90 focus:outline-none
              focus-visible:ring-2 focus-visible:ring-voro-primary
              focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C14]
              group
            `}
            aria-label="Close modal"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>

          {/* Corner Telemetry Marker */}
          <div className="absolute top-0 right-0 p-3 opacity-[0.03] pointer-events-none">
             <div className="font-mono text-[0.45rem] font-black leading-none select-none">
                [X_TERM]
             </div>
          </div>
        </div>

        {/* Content: Procedural Void */}
        <div className="relative z-10 flex-1 overflow-y-auto p-10 sm:p-12 no-scrollbar">
          {children}
        </div>

        {/* Boutique Footer Detail */}
        <div className="relative z-10 p-6 border-t border-white/[0.02] flex justify-between items-center bg-black/20">
          <div className="flex gap-2.5">
            <div className="w-1 h-1 rounded-full bg-voro-primary/40" />
            <div className="w-1 h-1 rounded-full bg-voro-primary/20" />
            <div className="w-1 h-1 rounded-full bg-voro-primary/10" />
          </div>
          <span className="text-[0.45rem] font-mono text-white/10 tracking-[0.6em] uppercase">
            {nodeId}_ATTESTED_CHAMBER
          </span>
        </div>
      </div>
    </div>
  );
};

export default Modal;
