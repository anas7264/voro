import React, { useEffect, forwardRef, useId, useImperativeHandle, useRef, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { X } from 'lucide-react';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted & Frozen Color Palettes & Variant Configurations.
 * Prevents dynamic array and object allocations on every trigger frame or component render cycle.
 */
const BRAND_PALETTES = Object.freeze({
  primary: Object.freeze(['#7C3AED', '#9333EA', '#A855F7', '#C084FC', '#E9D5FF']),
  gold: Object.freeze(['#F59E0B', '#D97706', '#B45309', '#FBBF24', '#FDE68A']),
  emerald: Object.freeze(['#10B981', '#059669', '#047857', '#34D399', '#A7F3D0']),
  voro: Object.freeze(['#7C3AED', '#10B981', '#F59E0B', '#3B82F6', '#EC4899']),
  aurora: Object.freeze(['#7C3AED', '#3B82F6', '#06B6D4', '#10B981', '#F43F5E'])
});

const DEFAULT_PALETTE = BRAND_PALETTES.voro;

/**
 * ⚡ REFINEMENT: Luxury Kinetic Quantum Particle Emitter Matrix ('Confetti').
 * Re-engineered conforming to Voro's 'Forge' luxury gallery architecture ('Quantum Particle Emitter Node')
 * and zero-allocation performance standards.
 *
 * DESIGN PHILOSOPHY:
 * 1. Visual Hierarchy & Authority: Playfair Display italic serif hero typography paired with
 *    JetBrains Mono system telemetry gives quantum particle milestone celebrations editorial prestige.
 * 2. Spatial Architecture: Floating luxury telemetry banner with magnetic liquid perimeter illumination mask
 *    and volumetric 3D tilt depth.
 * 3. High-End Micro-Interactions: Direct-DOM 60fps 3D volumetric rotational tilt tracking (`--tilt-x`, `--tilt-y`),
 *    luminous spotlight follower lens, and an accessible manual dismiss trigger micro-UX (`X`).
 * 4. Reliability & Cognitive Ease: Ref-forwarded imperative `fire()` and `reset()` trigger API allowing
 *    parent components to trigger celebrations with zero memory leaks and deterministic lifecycle cleanup.
 */
const Confetti = forwardRef(({
  duration = 3000,
  variant = 'default',
  palette = 'voro',
  announceMessage = "Milestone achieved! Celebration particles emitted.",
  autoFire = true,
  showBanner = true,
  onComplete,
  className = ""
}, ref) => {
  const generatedId = useId();
  const bannerRef = useRef(null);
  const txRef = useRef(null);
  const tyRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);

  const animFrameIdRef = useRef(null);
  const timeoutIdRef = useRef(null);
  const intervalIdRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  // Keep onCompleteRef updated to avoid stale closures
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const colors = BRAND_PALETTES[palette] || DEFAULT_PALETTE;

  // Generate an SSR-safe deterministic system node ID & sub-pixel attestation hash badge
  const { nodeId, subpixelHash } = useMemo(() => {
    const cleanId = generatedId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return {
      nodeId: `CNF_NODE_${cleanId.slice(-4).padStart(4, '0')}`,
      subpixelHash: `0xCNF_${cleanId.slice(-6).padStart(6, '0')}`
    };
  }, [generatedId]);

  const showBannerUI = useCallback(() => {
    if (bannerRef.current) {
      const style = bannerRef.current.style;
      style.opacity = '1';
      style.transform = 'translate3d(-50%, 0, 0) perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) scale(1)';
      style.pointerEvents = 'auto';
    }
  }, []);

  const hideBannerUI = useCallback(() => {
    if (bannerRef.current) {
      const style = bannerRef.current.style;
      style.opacity = '0';
      style.transform = 'translate3d(-50%, -16px, 0) perspective(1000px) rotateX(0deg) rotateY(0deg) scale(0.95)';
      style.pointerEvents = 'none';
    }
  }, []);

  const stopActiveTimers = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    hideBannerUI();
  }, [hideBannerUI]);

  // Direct-DOM 60fps 3D Volumetric Tilt & Spotlight Lens Handler
  const handleMouseMove = useCallback((e) => {
    if (!bannerRef.current) return;
    const rect = bannerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D tilt calculation (max 12 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 24;
    const tiltX = (0.5 - (y / rect.height)) * 24;

    const style = bannerRef.current.style;
    style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
    style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
    style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    style.transform = `translate3d(-50%, 0, 0) perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-2px) scale(1.02)`;
    style.transition = 'none';

    if (txRef.current) txRef.current.innerText = tiltX.toFixed(1);
    if (tyRef.current) tyRef.current.innerText = tiltY.toFixed(1);
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    if (!bannerRef.current) return;

    const style = bannerRef.current.style;
    style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

    if (isFocusedRef.current) {
      style.setProperty('--tilt-x', '4.00deg');
      style.setProperty('--tilt-y', '-4.00deg');
      style.transform = 'translate3d(-50%, 0, 0) perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(-1px) scale(1.01)';
      if (txRef.current) txRef.current.innerText = "4.0";
      if (tyRef.current) tyRef.current.innerText = "-4.0";
    } else {
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.transform = 'translate3d(-50%, 0, 0) perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
      if (txRef.current) txRef.current.innerText = "0.0";
      if (tyRef.current) tyRef.current.innerText = "0.0";
    }
  }, []);

  const handleFocus = useCallback(() => {
    isFocusedRef.current = true;
    if (!bannerRef.current) return;

    const style = bannerRef.current.style;
    style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    style.setProperty('--tilt-x', '4.00deg');
    style.setProperty('--tilt-y', '-4.00deg');
    style.transform = 'translate3d(-50%, 0, 0) perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(-1px) scale(1.01)';
    if (txRef.current) txRef.current.innerText = "4.0";
    if (tyRef.current) tyRef.current.innerText = "-4.0";
  }, []);

  const handleBlur = useCallback(() => {
    isFocusedRef.current = false;
    if (!bannerRef.current) return;

    if (!isHoveredRef.current) {
      const style = bannerRef.current.style;
      style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.transform = 'translate3d(-50%, 0, 0) perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
      if (txRef.current) txRef.current.innerText = "0.0";
      if (tyRef.current) tyRef.current.innerText = "0.0";
    }
  }, []);

  /**
   * Core particle emitter engine.
   * Dispatches particle streams based on selected celebration variant.
   */
  const fire = useCallback((customOptions = {}) => {
    // Cancel any existing animation frame loop or timer before spawning a new one
    stopActiveTimers();
    showBannerUI();

    const endTime = Date.now() + duration;

    if (variant === 'burst') {
      confetti({
        particleCount: customOptions.particleCount || 100,
        spread: customOptions.spread || 70,
        origin: customOptions.origin || { y: 0.6 },
        colors: customOptions.colors || colors,
        disableForReducedMotion: true
      });

      timeoutIdRef.current = setTimeout(() => {
        hideBannerUI();
        onCompleteRef.current?.();
      }, duration);

      return;
    }

    if (variant === 'fireworks') {
      intervalIdRef.current = setInterval(() => {
        const timeLeft = endTime - Date.now();
        if (timeLeft <= 0) {
          if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
          }
          hideBannerUI();
          onCompleteRef.current?.();
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors,
          disableForReducedMotion: true
        });
      }, 250);

      return;
    }

    // Default dual-cannon stream animation loop
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
        disableForReducedMotion: true
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
        disableForReducedMotion: true
      });

      if (Date.now() < endTime) {
        animFrameIdRef.current = requestAnimationFrame(frame);
      } else {
        animFrameIdRef.current = null;
        hideBannerUI();
        onCompleteRef.current?.();
      }
    };

    frame();
  }, [duration, variant, colors, showBannerUI, hideBannerUI, stopActiveTimers]);

  // Expose imperative trigger control to parent components via forwardRef
  useImperativeHandle(ref, () => ({
    fire: (options) => fire(options),
    reset: () => {
      stopActiveTimers();
      confetti.reset();
    }
  }), [fire, stopActiveTimers]);

  useEffect(() => {
    if (autoFire) {
      fire();
    }

    return () => {
      stopActiveTimers();
    };
  }, [autoFire, fire, stopActiveTimers]);

  return (
    <>
      {/* Off-screen ARIA announcement live region for accessibility */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className={`sr-only pointer-events-none ${className}`}
        data-attestation={subpixelHash}
      >
        <span>{announceMessage}</span>
      </div>

      {/* 🛰️ Direct-DOM Zero-Allocation Floating Luxury Telemetry Banner */}
      {showBanner && (
        <div
          ref={bannerRef}
          role="status"
          aria-live="polite"
          aria-label="Quantum Particle Celebration Milestone"
          tabIndex={0}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            opacity: 0,
            transform: 'translate3d(-50%, -16px, 0) perspective(1000px) rotateX(0deg) rotateY(0deg) scale(0.95)',
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            transformStyle: 'preserve-3d'
          }}
          className="fixed top-8 left-1/2 z-[150] pointer-events-none -translate-x-1/2 select-none outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408] rounded-full group/confetti"
        >
          <div className="relative flex items-center gap-4 px-6 py-3.5 rounded-full bg-[#0A0C14]/90 border border-voro-primary/30 backdrop-blur-3xl shadow-[0_30px_70px_rgba(0,0,0,0.8),0_0_30px_rgba(124,58,237,0.25)] overflow-hidden">
            {/* 🛰️ Dynamic Liquid Border Intelligence: Perimeter light gradient mask */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full opacity-0 group-hover/confetti:opacity-100 group-focus-visible/confetti:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                padding: '1px',
                background: `radial-gradient(160px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.5), transparent 80%)`,
                WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            {/* Precision Grid & Grain Architecture */}
            <div aria-hidden="true" className="absolute inset-0 bg-grid-white opacity-0 group-hover/confetti:opacity-10 group-focus-visible/confetti:opacity-10 transition-opacity duration-700 pointer-events-none" />
            <div aria-hidden="true" className="absolute inset-0 bg-boutique-grain opacity-[0.03] pointer-events-none" />

            {/* Luminous Spotlight Lens */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-0 group-hover/confetti:opacity-100 group-focus-visible/confetti:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(180px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.15), transparent 70%)`,
                transform: 'translateZ(10px)'
              }}
            />

            {/* Ambient Pulse Aura */}
            <div aria-hidden="true" className="absolute -inset-2 bg-gradient-to-r from-voro-primary/20 via-voro-secondary/20 to-voro-accent/20 blur-md opacity-40 animate-pulse pointer-events-none" />

            {/* Kinetic Signal Dot */}
            <div className="relative flex h-2.5 w-2.5 shrink-0 z-10" style={{ transform: 'translateZ(25px)' }}>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-voro-primary shadow-[0_0_12px_#7C3AED]" />
            </div>

            {/* Hero Text Stack */}
            <div className="relative z-10 flex items-center gap-3" style={{ transform: 'translateZ(30px)' }}>
              <span className="text-sm sm:text-base font-serif italic font-medium text-white tracking-tight">
                Milestone <span className="text-voro-primary font-serif not-italic">Achieved</span>
              </span>
              <div className="h-3 w-px bg-white/10" />
              <span className="text-[0.55rem] font-mono font-bold text-gray-300 uppercase tracking-[0.25em]">
                {announceMessage}
              </span>
            </div>

            {/* Holographic Telemetry & Sub-pixel Attestation Badge */}
            <div className="relative z-10 flex items-center gap-2 font-mono text-[0.45rem] font-bold text-voro-primary/90 bg-voro-primary/10 px-2.5 py-1 rounded-full border border-voro-primary/20 tracking-widest hidden sm:flex" style={{ transform: 'translateZ(35px)' }}>
              <span>TX_<span ref={txRef}>0.0</span>°</span>
              <span>TY_<span ref={tyRef}>0.0</span>°</span>
              <span className="text-white/40">{subpixelHash}</span>
            </div>

            {/* Interactive Dismiss Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                stopActiveTimers();
              }}
              className="relative z-20 p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-voro-primary pointer-events-auto"
              style={{ transform: 'translateZ(40px)' }}
              aria-label="Dismiss milestone announcement"
              title="Dismiss milestone announcement"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </>
  );
});

Confetti.displayName = 'Confetti';

export default Confetti;
