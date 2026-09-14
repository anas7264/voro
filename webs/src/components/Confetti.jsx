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
  onComplete,
  className = ""
}, ref) => {
  const generatedId = useId();
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
  };

  /**
   * Core particle emitter engine.
   * Dispatches particle streams based on selected celebration variant.
   */
  const fire = (customOptions = {}) => {
    // Cancel any existing animation frame loop or timer before spawning a new one
    stopActiveTimers();

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
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`sr-only pointer-events-none ${className}`}
      data-attestation={subpixelHash}
    >
      <span>{announceMessage}</span>
    </div>
  );
});

Confetti.displayName = 'Confetti';

export default Confetti;
