import React, { memo, useId } from "react";

/**
 * ⚡ REFINEMENT: Architectural Editorial Signature (Header).
 * Re-engineered as a luxury editorial signature featuring high-contrast
 * typography, kinetic pulse indicators, and gradient-weighted architectural lines.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Playfair Display serif title for editorial weight.
 * 2. Precision: JetBrains Mono metadata for system-active context.
 * 3. Motion: Subtle neural pulse suggesting a "living" biometric OS.
 * 4. Structure: Gradient datum line providing spatial grounding.
 */
export const Header = memo(({
  title,
  subtitle,
  eyebrow = "System_Active",
  action,
  className = ""
}) => {
  const headerId = useId();

  return (
    <header
      className={`relative mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 group ${className}`}
      aria-labelledby={`${headerId}-title`}
    >
      <div className="space-y-4 max-w-3xl">
        {/* System Eyebrow: Technical Context */}
        <div className="flex items-center gap-3 text-voro-primary">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-voro-primary shadow-[0_0_8px_rgba(124,58,237,0.6)]"></span>
          </div>
          <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.4em] opacity-70">
            {eyebrow}
          </span>
        </div>

        {/* Editorial Title & Description */}
        <div className="space-y-2">
          <h1
            id={`${headerId}-title`}
            className="text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tighter leading-tight"
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm md:text-base font-medium text-gray-500 max-w-xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Architectural Datum Line */}
        <div className="h-px w-24 bg-gradient-to-r from-voro-primary to-transparent opacity-40 group-hover:w-48 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
      </div>

      {/* Dynamic Action Container */}
      {action && (
        <div className="flex items-center gap-4 animate-fade-in">
          {action}
        </div>
      )}
    </header>
  );
});

Header.displayName = "Header";

export default Header;
