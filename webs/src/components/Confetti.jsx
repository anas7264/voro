import React, { useEffect, forwardRef, useId, useImperativeHandle, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';

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
 * Re-engineered conforming to Voro's 'Forge' luxury architecture and zero-allocation performance standards.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: High-fidelity mathematical particle trajectories celebrating protocol milestones and habit completions.
 * 2. Motion: Multi-stage, physics-driven particle dispersion with deterministic lifecycle cleanup via requestAnimationFrame cancelation.
 * 3. Spatial: Off-screen non-visual DOM presentation with accessible ARIA live status announcements for screen readers.
 * 4. Reliability: Ref-forwarded imperative `fire()` trigger API allowing parent components to trigger manual celebrations.
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
  const animFrameIdRef = useRef(null);
  const timeoutIdRef = useRef(null);
  const intervalIdRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  // Keep onCompleteRef updated to avoid stale closures
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const colors = BRAND_PALETTES[palette] || DEFAULT_PALETTE;

  // Generate an SSR-safe deterministic sub-pixel attestation hash badge
  const subpixelHash = useMemo(() => {
    const cleanId = generatedId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `0xCNF_${cleanId.slice(-4).padStart(4, '0')}`;
  }, [generatedId]);

  const showBannerUI = () => {
    if (bannerRef.current) {
      bannerRef.current.style.opacity = '1';
      bannerRef.current.style.transform = 'translate3d(-50%, 0, 0) scale(1)';
      bannerRef.current.style.pointerEvents = 'auto';
    }
  };

  const hideBannerUI = () => {
    if (bannerRef.current) {
      bannerRef.current.style.opacity = '0';
      bannerRef.current.style.transform = 'translate3d(-50%, -12px, 0) scale(0.96)';
      bannerRef.current.style.pointerEvents = 'none';
    }
  };

  const stopActiveTimers = () => {
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
  };

  /**
   * Core particle emitter engine.
   * Dispatches particle streams based on selected celebration variant.
   */
  const fire = (customOptions = {}) => {
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
  };

  // Expose imperative trigger control to parent components via forwardRef
  useImperativeHandle(ref, () => ({
    fire: (options) => fire(options),
    reset: () => {
      stopActiveTimers();
      confetti.reset();
    }
  }));

  useEffect(() => {
    if (autoFire) {
      fire();
    }

    return () => {
      stopActiveTimers();
    };
  }, [autoFire, duration, variant, colors]);

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
          style={{
            opacity: 0,
            transform: 'translate3d(-50%, -12px, 0) scale(0.96)',
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="fixed top-8 left-1/2 z-[150] pointer-events-none -translate-x-1/2 select-none"
        >
          <div className="relative flex items-center gap-4 px-6 py-3 rounded-full bg-[#0A0C14]/90 border border-voro-primary/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(124,58,237,0.35),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden group">
            {/* Ambient Pulse Aura */}
            <div aria-hidden="true" className="absolute -inset-2 bg-gradient-to-r from-voro-primary/20 via-voro-secondary/20 to-voro-accent/20 blur-md opacity-40 animate-pulse pointer-events-none" />

            {/* Kinetic Signal Dot */}
            <div className="relative flex h-2.5 w-2.5 shrink-0 z-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-voro-primary shadow-[0_0_12px_#7C3AED]" />
            </div>

            {/* Hero Text Stack */}
            <div className="relative z-10 flex items-center gap-3">
              <span className="text-sm sm:text-base font-serif italic font-medium text-white tracking-tight">
                Milestone <span className="text-voro-primary font-serif not-italic">Achieved</span>
              </span>
              <div className="h-3 w-px bg-white/10" />
              <span className="text-[0.55rem] font-mono font-bold text-gray-400 uppercase tracking-[0.25em]">
                {announceMessage}
              </span>
            </div>

            {/* Sub-pixel Attestation Badge */}
            <div className="relative z-10 font-mono text-[0.45rem] font-bold text-voro-primary/80 bg-voro-primary/10 px-2 py-0.5 rounded-full border border-voro-primary/20 tracking-widest hidden sm:inline-block">
              {subpixelHash}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

Confetti.displayName = 'Confetti';

export default Confetti;
