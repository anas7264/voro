import React, { memo, useState, useEffect } from "react";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static maps.
 * Prevents redundant object allocation on every component render.
 */
const SIZE_MAP = {
  sm: { container: 40, core: 12, stroke: 1 },
  md: { container: 80, core: 24, stroke: 1.5 },
  lg: { container: 120, core: 36, stroke: 2 },
  xl: { container: 180, core: 54, stroke: 3 }
};

const COLOR_MAP = {
  primary: "var(--voro-primary)",
  secondary: "var(--voro-secondary)",
  accent: "var(--voro-accent)",
  danger: "var(--voro-danger)",
  white: "#FFFFFF"
};

/**
 * ⚡ REFINEMENT: Luxury Neural Core Spinner.
 * Re-engineered to the 'Forge' luxury standard: multi-layered concentric rings,
 * asynchronous rotation speeds, glassmorphic center, and industrial system telemetry.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Concentric architecture suggests complex, centralized processing.
 * 2. Precision: JetBrains Mono for cycling system telemetry and hex markers.
 * 3. Motion: Multi-axis asynchronous rotation (spin-slow, spin-reverse) for depth.
 * 4. Atmosphere: Luminous primary glow and sub-pixel architectural details.
 */
export const Spinner = memo(({
  size = "md",
  color = "primary",
  message,
  className = ""
}) => {
  const [telemetry, setTelemetry] = useState("0x0000");

  // Cycle system telemetry for industrial aesthetic
  useEffect(() => {
    const interval = setInterval(() => {
      const hex = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
      setTelemetry(`0x${hex}`);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const { container, core, stroke } = SIZE_MAP[size] || SIZE_MAP.md;
  const activeColor = COLOR_MAP[color] || COLOR_MAP.primary;

  return (
    <div className={`flex flex-col items-center justify-center gap-8 ${className}`}>
      {/* Neural Core Architecture */}
      <div
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
              <span className="text-[0.45rem] font-mono font-bold text-white/20 uppercase tracking-[0.4em]">
                {telemetry}
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
            <p className="text-[0.65rem] font-mono font-black text-white/60 uppercase tracking-[0.5em] animate-pulse">
              {message}
            </p>
          )}
          <span className="text-[0.45rem] font-mono text-white/20 uppercase tracking-[0.2em]">
            Processing Sequence // {telemetry}
          </span>
        </div>
      )}
    </div>
  );
});

Spinner.displayName = "Spinner";

export default Spinner;
