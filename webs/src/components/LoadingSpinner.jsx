import React, { memo, useState, useEffect } from "react";
import Spinner from "./Spinner";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static procedural streams.
 * Prevents redundant array allocation on every component render.
 */
const PROCEDURAL_STATUSES = [
  "Initializing Core Heuristics",
  "Calibrating Biometric Sensors",
  "Assembling Data Shards",
  "Optimizing Kinetic Pathways",
  "Synchronizing Metabolic Matrix",
  "Authenticating System Integrity"
];

/**
 * ⚡ REFINEMENT: Luxury Neural Synthesis Loader.
 * Re-engineered to the 'Forge' luxury standard: integrates the upgraded Spinner,
 * high-fidelity glassmorphic 'Absorption' mode, and procedural status streams.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Fullscreen absorption mode suggests a complete system takeover for vital processing.
 * 2. Precision: JetBrains Mono for procedural status streams; Playfair Display for editorial weight.
 * 3. Atmosphere: Deep charcoal (#020408) overlays with high-magnitude backdrop blurs.
 * 4. Motion: Subtle kinetic transitions for entering/exiting the loading state.
 */
export const LoadingSpinner = memo(({
  fullscreen = false,
  message = "Synthesizing Neural Matrix",
  color = "primary"
}) => {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % PROCEDURAL_STATUSES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const content = (
    <div className="flex flex-col items-center justify-center gap-12 text-center animate-scale-in">
      {/* Central Neural Spinner */}
      <Spinner
        size={fullscreen ? "xl" : "lg"}
        color={color}
        className="drop-shadow-[0_0_30px_rgba(124,58,237,0.2)]"
      />

      <div className="space-y-6 max-w-sm">
        {/* Editorial Primary Message */}
        <h2 className="text-3xl md:text-4xl font-serif italic font-medium text-white tracking-tight leading-none">
          {message}
        </h2>

        {/* Procedural Status Stream */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-voro-primary/40" />
            <span className="text-[0.6rem] font-mono font-black text-voro-primary uppercase tracking-[0.4em] animate-pulse">
              System_Status
            </span>
            <div className="h-px w-8 bg-voro-primary/40" />
          </div>
          <p className="text-[0.65rem] font-mono font-medium text-gray-500 uppercase tracking-widest min-h-[1em]">
            {PROCEDURAL_STATUSES[statusIndex]}...
          </p>
        </div>
      </div>

      {/* Industrial Detail: Bottom Telemetry Marker */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-[0.05] pointer-events-none">
        <span className="text-[0.45rem] font-mono font-black text-white uppercase tracking-[0.6em]">
          VORO_EVOLUTION_OS_LOADER_v2.0
        </span>
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-[#020408]/80 backdrop-blur-2xl flex items-center justify-center z-[100] animate-fade-in">
        {/* Ambient background architectural lighting */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
        </div>

        {/* High-fidelity charcoal architecture container */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-8 bg-boutique-grain bg-opacity-[0.02]">
           {content}
        </div>
      </div>
    );
  }

  return content;
});

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;
