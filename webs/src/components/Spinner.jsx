import React, { memo, useEffect, useRef, useId, useMemo } from "react";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted & Frozen static lookup maps.
 * Module-scoped frozen dictionaries eliminate per-render heap allocations.
 */
const SIZE_MAP = Object.freeze({
  sm: Object.freeze({ container: 40, core: 12, stroke: 1 }),
  md: Object.freeze({ container: 80, core: 24, stroke: 1.5 }),
  lg: Object.freeze({ container: 120, core: 36, stroke: 2 }),
  xl: Object.freeze({ container: 180, core: 54, stroke: 3 })
});

const COLOR_MAP = Object.freeze({
  primary: "var(--voro-primary)",
  secondary: "var(--voro-secondary)",
  accent: "var(--voro-accent)",
  danger: "var(--voro-danger)",
  white: "#FFFFFF"
});

/**
 * ⚡ REFINEMENT: Luxury Neural Core Spinner ('Spinner').
 * Re-engineered to Voro's 'Forge' luxury architecture standard ('Kinetic Neural Core Spinner Specimen'):
 * multi-layered concentric orbital rings, asynchronous rotation speeds, glassmorphic focal center,
 * direct-DOM surgical telemetry, Playfair Display typography, JetBrains Mono metadata,
 * SSR-safe deterministic sub-pixel system attestation badging (`0xSPN_..._ATTESTED_CORE`),
 * and W3C APG compliant status live-region accessibility (`role="status"`, `aria-live="polite"`).
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Concentric box-model architecture suggesting a high-precision quantum logic core.
 * 2. Precision: JetBrains Mono for system metadata & cycling telemetry; Playfair Display for message status.
 * 3. Atmosphere: Multi-axis asynchronous rotation with subtle grain texture and radiant focal lens.
 * 4. Performance: Zero-allocation direct-DOM state updates bypassing React component re-renders.
 */
export const Spinner = memo(({
  size = "md",
  color = "primary",
  message,
  className = "",
  "aria-label": ariaLabel,
  ...props
}) => {
  const telemetryRef1 = useRef(null);
  const telemetryRef2 = useRef(null);
  const lastTelemetryRef = useRef("0x0000");
  const reactId = useId();

  // SSR-safe deterministic system attestation hash badge
  const subpixelHash = useMemo(() => {
    const cleanId = reactId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const suffix = cleanId.padEnd(4, '0').slice(-4);
    return `0xSPN_${suffix}_ATTESTED_CORE`;
  }, [reactId]);

  /**
   * ⚡ SURGICAL PERFORMANCE OPTIMIZATION: Direct DOM Telemetry Stream Updates.
   * Telemetry values rotate every 1.5s via direct DOM text manipulation,
   * eliminating 100% of React component re-renders during active loading sequences.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const hex = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
      const val = `0x${hex}`;
      lastTelemetryRef.current = val;
      if (telemetryRef1.current) telemetryRef1.current.innerText = val;
      if (telemetryRef2.current) telemetryRef2.current.innerText = val;
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;
  const { container, core, stroke } = sizeConfig;
  const activeColor = COLOR_MAP[color] || COLOR_MAP.primary;

  const computedLabel = ariaLabel || message || "Loading";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={computedLabel}
      className={`flex flex-col items-center justify-center gap-8 ${className}`}
      {...props}
    >
      {/* Neural Core Architecture */}
      <div
        aria-hidden="true"
        className="relative flex items-center justify-center shrink-0"
        style={{ width: container, height: container }}
      >
        {/* Outer Kinetic Ring: Signal Pulse */}
        <div
          className="absolute inset-0 rounded-full border border-white/5 animate-spin-slow"
          style={{ borderWidth: stroke }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full shadow-[0_0_12px_rgba(124,58,237,0.8)]"
            style={{ backgroundColor: activeColor }}
          />
        </div>

        {/* Middle Kinetic Ring: Asynchronous Reverse Orbit */}
        <div
          className="absolute inset-[15%] rounded-full border animate-spin-reverse opacity-20"
          style={{
            borderColor: activeColor,
            borderWidth: stroke,
            borderStyle: 'dashed',
            borderDasharray: '4 8'
          }}
        />

        {/* Tactical Telemetry Ring */}
        <div className="absolute inset-[-10%] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pb-2">
            <span
              ref={telemetryRef1}
              className="text-[0.45rem] font-mono font-bold text-white/20 uppercase tracking-[0.4em]"
            >
              {lastTelemetryRef.current}
            </span>
          </div>
        </div>

        {/* Glassmorphic Neural Core */}
        <div
          className="relative rounded-full bg-white/[0.03] backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden group"
          style={{ width: core, height: core }}
        >
          {/* Pulsing Luminous Center */}
          <div
            className="w-1/3 h-1/3 rounded-full animate-pulse blur-[2px]"
            style={{ backgroundColor: activeColor }}
          />

          {/* Internal Shimmer Pattern */}
          <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-10 pointer-events-none" />

          {/* Gloss Lens Detail */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        </div>

        {/* Ambient Radial Aura */}
        <div
          className="absolute inset-[-20%] blur-[40px] opacity-10 animate-pulse pointer-events-none rounded-full"
          style={{ backgroundColor: activeColor }}
        />
      </div>

      {/* System Status Label */}
      {(message || size === "xl") && (
        <div className="flex flex-col items-center gap-2">
          {message && (
            <p aria-hidden="true" className="text-[0.65rem] font-serif italic font-medium text-white/90 tracking-tight leading-snug">
              {message}
            </p>
          )}
          <span aria-hidden="true" className="text-[0.45rem] font-mono font-black text-white/30 uppercase tracking-[0.4em]">
            Sequence // <span ref={telemetryRef2}>{lastTelemetryRef.current}</span> // {subpixelHash}
          </span>
        </div>
      )}
    </div>
  );
});

Spinner.displayName = "Spinner";

export default Spinner;
