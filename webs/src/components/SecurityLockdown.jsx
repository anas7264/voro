import React, { memo, useContext, useRef, useState, useId, useMemo } from 'react';
import { ShieldAlert, Lock, RotateCcw, Activity, Cpu, Layers, AlertTriangle } from 'lucide-react';
import { StorageContext } from '../context/StorageContext';

/**
 * ⚡ REFINEMENT: Volumetric Neural Shield Lockdown Enclave (SecurityLockdown).
 * Re-engineered to Voro's 'Forge' luxury system standard:
 * 1. 60fps direct-DOM 3D volumetric tilt tracking (--mouse-x, --mouse-y, --tilt-x, --tilt-y).
 * 2. Dynamic liquid border perimeter illumination with threat crimson spotlight follower.
 * 3. SSR-safe deterministic attestation node badging (0xLCK_...) using React's native useId().
 * 4. High-contrast editorial typography pairing (Playfair Display italic serif + JetBrains Mono).
 * 5. Symmetrical Security Telemetry Matrix displaying circuit breaker, cipher state, and attestation markers.
 * 6. W3C APG compliant dialog semantics and interactive 3D reset trigger.
 */
const SecurityLockdown = memo(() => {
  const { isCompromised } = useContext(StorageContext);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const txRef = useRef(null);
  const tyRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const reactId = useId();

  // Generate SSR-safe deterministic system node identification and attestation markers
  const nodeId = useMemo(() => {
    const cleanId = reactId.replace(/:/g, '');
    return `LCK_${cleanId.slice(0, 4).toUpperCase()}`;
  }, [reactId]);

  const attestedId = useMemo(() => {
    const cleanId = reactId.replace(/:/g, '');
    return `0xLCK_${cleanId.padEnd(6, 'F').slice(0, 6).toUpperCase()}_SHIELD`;
  }, [reactId]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D rotational tilt calculation (clamped to max 8 degrees for structural luxury stability)
    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (txRef.current) txRef.current.innerText = tiltX.toFixed(1);
    if (tyRef.current) tyRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (txRef.current) txRef.current.innerText = '4.0';
      if (tyRef.current) tyRef.current.innerText = '-4.0';
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (containerRef.current && !isHovered) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  if (!isCompromised) return null;

  const interactionActive = isHovered || isFocused;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${reactId}-title`}
      aria-describedby={`${reactId}-desc`}
      className="fixed inset-0 z-[9999] bg-[#020408]/95 backdrop-blur-3xl flex items-center justify-center p-6 md:p-12 select-none animate-fade-in"
    >
      {/* Precision Background Grid & Grain Architecture */}
      <div className="absolute inset-0 bg-grid-white opacity-[0.015] pointer-events-none" />
      <div className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none" />

      {/* Atmospheric Threat Crimson Orbits */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[75vw] rounded-full border border-red-500/10 pointer-events-none animate-[spin-slow_45s_linear_infinite]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] rounded-full border border-white/5 border-dashed pointer-events-none animate-[spin-reverse_35s_linear_infinite]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-red-500/5 blur-[160px] pointer-events-none" />

      {/* Main Volumetric Neural Enclave Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (containerRef.current && !isFocused) {
            containerRef.current.style.setProperty('--tilt-x', '0deg');
            containerRef.current.style.setProperty('--tilt-y', '0deg');
          }
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
        style={{
          transform: interactionActive
            ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
            : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: isHovered ? 'none' : 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d'
        }}
        className="
          relative max-w-2xl w-full p-8 md:p-12 rounded-[2.5rem] bg-[#0A0C14]/90 border border-red-500/20
          shadow-[0_80px_160px_-40px_rgba(239,68,68,0.25),0_40px_80px_rgba(0,0,0,0.9),inset_0_1px_1px_0_rgba(255,255,255,0.05)]
          backdrop-blur-3xl outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]
          group/lockdown text-center space-y-10 overflow-hidden transition-all duration-1000
        "
      >
        {/* Dynamic Liquid Border Perimeter Illumination (Threat Crimson) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/lockdown:opacity-100 group-focus-visible/lockdown:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            padding: '1px',
            background: `radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(239, 68, 68, 0.45), transparent 80%)`,
            WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Dynamic Spotlight Lens */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 group-hover/lockdown:opacity-100 group-focus-visible/lockdown:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: isHovered
              ? `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(239, 68, 68, 0.08), transparent 45%)`
              : `radial-gradient(600px circle at 50% 50%, rgba(239, 68, 68, 0.08), transparent 45%)`,
            transform: 'translateZ(20px)'
          }}
        />

        {/* Holographic Coordinate Telemetry Overlay */}
        <div
          aria-hidden="true"
          className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/lockdown:opacity-100 group-focus-visible/lockdown:opacity-100 transition-all duration-500"
          style={{ transform: 'translateZ(60px)' }}
        >
          <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-red-400/80 tracking-[0.2em] space-y-0.5">
            <span>TX_<span ref={txRef}>0.0</span>°</span>
            <span>TY_<span ref={tyRef}>0.0</span>°</span>
            <span className="text-white/20">[{nodeId}]</span>
          </div>
        </div>

        {/* Sub-pixel Attestation Hash Badge */}
        <div
          aria-hidden="true"
          className="absolute bottom-4 left-8 pointer-events-none text-[0.4rem] font-mono font-bold text-white/20 tracking-[0.25em] uppercase"
          style={{ transform: 'translateZ(40px)' }}
        >
          {attestedId}
        </div>

        {/* Shield Specimen Emblem */}
        <div className="relative inline-block" style={{ transform: 'translateZ(50px)' }}>
          <div className="
            w-28 h-28 md:w-32 md:h-32 rounded-[2.5rem] bg-gradient-to-b from-red-500/15 to-red-950/40
            border border-red-500/30 flex items-center justify-center mx-auto relative z-10
            shadow-[0_20px_40px_rgba(239,68,68,0.2),inset_0_2px_4px_rgba(255,255,255,0.05)]
            group-hover/lockdown:scale-105 transition-transform duration-700
          ">
            <div className="absolute inset-0 bg-scanline opacity-[0.04] pointer-events-none" />
            <ShieldAlert size={56} className="text-red-500 animate-pulse filter drop-shadow-[0_0_16px_rgba(239,68,68,0.6)]" />
          </div>
          <div className="absolute -inset-6 bg-red-500/20 blur-3xl rounded-full animate-pulse pointer-events-none" />
        </div>

        {/* Editorial Narrative Section */}
        <div className="space-y-4 relative z-10" style={{ transform: 'translateZ(40px)' }}>
          <div className="flex items-center justify-center gap-3 text-red-400">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)]"></span>
            </div>
            <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.45em]">
              NEURAL_SHIELD_CIRCUIT_BREAKER
            </span>
            <div className="h-px w-6 bg-red-500/30" />
          </div>

          <h1
            id={`${reactId}-title`}
            className="text-4xl sm:text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tight leading-tight"
          >
            Neural Shield <span className="text-red-500 not-italic font-black">Lockdown</span>
          </h1>

          <p
            id={`${reactId}-desc`}
            className="text-xs md:text-sm font-mono text-gray-400 tracking-[0.15em] leading-relaxed uppercase max-w-xl mx-auto opacity-90"
          >
            Security integrity violation detected. The active runtime environment has been neutralized to prevent data exfiltration and protect your cryptographic keys.
          </p>
        </div>

        {/* Symmetrical Security Telemetry Matrix */}
        <div
          className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 relative z-10"
          style={{ transform: 'translateZ(30px)' }}
        >
          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col items-start font-mono text-[0.55rem] tracking-wider text-left">
            <span className="text-gray-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Activity size={10} className="text-red-500" />
              CIRCUIT_BREAKER
            </span>
            <span className="text-red-400 font-bold uppercase flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-red-500 animate-ping" />
              ENGAGED_LOCKED
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col items-start font-mono text-[0.55rem] tracking-wider text-left">
            <span className="text-gray-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Lock size={10} className="text-red-400" />
              CIPHER_STATE
            </span>
            <span className="text-gray-300 font-medium">KEYS_PURGED_NULL</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col items-start font-mono text-[0.55rem] tracking-wider text-left">
            <span className="text-gray-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Cpu size={10} className="text-voro-primary" />
              INTEGRITY_SHIELD
            </span>
            <span className="text-voro-primary font-bold flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-voro-primary animate-pulse" />
              ACTIVE_CONTAINED
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col items-start font-mono text-[0.55rem] tracking-wider text-left">
            <span className="text-gray-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Layers size={10} className="text-gray-500" />
              ATTESTATION_STAMP
            </span>
            <span className="text-gray-400 font-medium">{attestedId}</span>
          </div>
        </div>

        {/* Action & Interactive 3D Reset Trigger */}
        <div
          className="pt-6 flex flex-col items-center gap-6 relative z-10"
          style={{ transform: 'translateZ(50px)' }}
        >
          <button
            ref={buttonRef}
            onClick={handleReset}
            className="
              group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl
              bg-red-500/10 text-white font-mono font-black text-xs uppercase tracking-[0.35em]
              border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/20
              shadow-[0_20px_50px_rgba(239,68,68,0.25)] hover:shadow-[0_30px_70px_rgba(239,68,68,0.4)]
              transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden
              focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408]
              active:scale-[0.97]
            "
          >
            <div className="absolute inset-0 bg-scanline opacity-[0.05] pointer-events-none" />
            <RotateCcw size={14} className="group-hover:rotate-[-180deg] transition-transform duration-700 text-red-400" />
            <span>Attempt Secure System Reset</span>
          </button>

          <p className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-[0.25em]">
            All cryptographic operations and persistence halted until reset
          </p>
        </div>
      </div>
    </div>
  );
});

SecurityLockdown.displayName = 'SecurityLockdown';

export default SecurityLockdown;
