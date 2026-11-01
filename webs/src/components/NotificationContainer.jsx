import React, { memo, useRef, useId, useMemo, useCallback } from "react";
import { useNotifications, useNotificationState } from "../hooks/useNotifications";
import { Alert } from "./Alert";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Memoized Notification Item.
 * Stabilizes the `onClose` callback reference using `useCallback` to prevent
 * unnecessary re-renders of existing `Alert` cards when notifications are added or removed.
 */
const NotificationItem = memo(({ notification, onRemove }) => {
  const handleClose = useCallback(() => {
    onRemove(notification.id);
  }, [notification.id, onRemove]);

  return (
    <div className="pointer-events-auto">
      <Alert
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={handleClose}
        className="animate-slide-up"
      />
    </div>
  );
});

NotificationItem.displayName = "NotificationItem";

/**
 * ⚡ LUXURY MASTERCLASS REFINEMENT: Kinetic Notification Matrix Stream ('NotificationContainer').
 * Re-engineered conforming to Voro's 'Forge' luxury gallery architecture and zero-allocation performance standards.
 * Features elevated golden-ratio spatial positioning, responsive viewport margins, a bespoke glassmorphic
 * telemetry header matrix badge, direct-DOM 60fps 3D volumetric tilt tracking, holographic coordinate telemetry
 * overlays (`TX_...°`, `TY_...°`), SSR-safe system attestation hash badging (`0xNTF_..._STREAM`), W3C APG compliant
 * live region semantics, and surgical reactivity.
 *
 * DESIGN PHILOSOPHY:
 * 1. Aesthetic & Visual Language: Boutique gallery layout with Playfair Display italic accents & JetBrains Mono metadata.
 * 2. Spatial Architecture: Mathematical whitespace (`top-6 right-6 sm:top-10 sm:right-10`) letting toast notifications float with dynamic depth.
 * 3. High-End Micro-interactions: Fluid entrance animations and 60fps direct-DOM volumetric 3D hover tilt physics.
 * 4. Cognitive Ease: Clear visual hierarchy with live stream telemetry (`[0xNTF_STREAM]`) reducing uncertainty and cognitive load.
 */
export const NotificationContainer = memo(() => {
  const notifications = useNotificationState();
  const { removeNotification, clearAllNotifications } = useNotifications();

  const reactId = useId();
  const headerRef = useRef(null);
  const txRef = useRef(null);
  const tyRef = useRef(null);

  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);

  // SSR-safe deterministic system stream attestation hash badge
  const subpixelHash = useMemo(() => {
    const cleanId = reactId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const suffix = cleanId.padEnd(4, '0').slice(-4);
    return `0xNTF_${suffix}_STREAM`;
  }, [reactId]);

  const count = notifications ? notifications.length : 0;

  // Direct-DOM 60fps 3D Volumetric Rotational Tilt Tracking
  const handleMouseMove = useCallback((e) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    const style = headerRef.current.style;
    style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
    style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
    style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    style.setProperty('transform', `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-2px)`);
    style.setProperty('transition', 'none');

    if (txRef.current) txRef.current.innerText = tiltX.toFixed(1);
    if (tyRef.current) tyRef.current.innerText = tiltY.toFixed(1);
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    if (!headerRef.current) return;

    const style = headerRef.current.style;
    if (isFocusedRef.current) {
      style.setProperty('--tilt-x', '3.00deg');
      style.setProperty('--tilt-y', '-3.00deg');
      style.setProperty('transform', 'perspective(1000px) rotateX(3deg) rotateY(-3deg) translateY(-2px)');
      style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
      if (txRef.current) txRef.current.innerText = "3.0";
      if (tyRef.current) tyRef.current.innerText = "-3.0";
    } else {
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('transform', 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
      style.setProperty('transition', 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)');
      if (txRef.current) txRef.current.innerText = "0.0";
      if (tyRef.current) tyRef.current.innerText = "0.0";
    }
  }, []);

  const handleFocus = useCallback(() => {
    isFocusedRef.current = true;
    if (!headerRef.current) return;

    const style = headerRef.current.style;
    style.setProperty('--tilt-x', '3.00deg');
    style.setProperty('--tilt-y', '-3.00deg');
    style.setProperty('transform', 'perspective(1000px) rotateX(3deg) rotateY(-3deg) translateY(-2px)');
    style.setProperty('transition', 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)');
    if (txRef.current) txRef.current.innerText = "3.0";
    if (tyRef.current) tyRef.current.innerText = "-3.0";
  }, []);

  const handleBlur = useCallback(() => {
    isFocusedRef.current = false;
    if (!headerRef.current) return;

    if (!isHoveredRef.current) {
      const style = headerRef.current.style;
      style.setProperty('--tilt-x', '0deg');
      style.setProperty('--tilt-y', '0deg');
      style.setProperty('transform', 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
      style.setProperty('transition', 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)');
      if (txRef.current) txRef.current.innerText = "0.0";
      if (tyRef.current) tyRef.current.innerText = "0.0";
    }
  }, []);

  return (
    <section
      role="region"
      aria-label="System Notification Matrix Stream"
      aria-live="polite"
      aria-relevant="additions"
      className="fixed top-6 right-6 sm:top-10 sm:right-10 space-y-4 sm:space-y-5 z-[100] max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0 transition-all duration-500"
    >
      {/* 🛰️ Luxury Stream Matrix Telemetry Header */}
      {count > 0 && (
        <div
          ref={headerRef}
          tabIndex={0}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px',
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
            transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="group/stream-header pointer-events-auto relative overflow-hidden flex items-center justify-between px-5 py-3 rounded-2xl bg-[#0A0C14]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.08)] animate-fade-in transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408]"
        >
          {/* Dynamic Liquid Light Perimeter Illumination Mask */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover/stream-header:opacity-100 group-focus-visible/stream-header:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              padding: '1px',
              background: `radial-gradient(250px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.4), transparent 80%)`,
              WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          {/* Precision Grid & Grain Overlay */}
          <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/stream-header:opacity-[0.04] transition-opacity duration-700 pointer-events-none" />
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none" />

          {/* Luminous Spotlight Follower Lens */}
          <div
            className="absolute inset-0 opacity-0 group-hover/stream-header:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.12), transparent 70%)`,
            }}
          />

          <div className="relative z-10 flex items-center gap-2.5" style={{ transform: 'translateZ(20px)' }}>
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.9)]" />
            </div>
            <span className="text-[0.55rem] font-mono font-black uppercase tracking-[0.3em] text-white/80 group-hover/stream-header:text-white transition-colors">
              Notification_Stream <span className="text-voro-primary/80">//</span> ACTIVE
            </span>
          </div>

          <div className="relative z-10 flex items-center gap-2.5" style={{ transform: 'translateZ(20px)' }}>
            {/* Coordinate Telemetry Overlay */}
            <div
              aria-hidden="true"
              className="hidden sm:flex items-center gap-1.5 font-mono text-[0.45rem] font-bold text-white/30 opacity-0 group-hover/stream-header:opacity-100 group-focus-visible/stream-header:opacity-100 transition-opacity duration-500 tracking-widest"
            >
              <span>TX_<span ref={txRef}>0.0</span>°</span>
              <span>TY_<span ref={tyRef}>0.0</span>°</span>
            </div>

            {count > 1 && (
              <button
                type="button"
                onClick={clearAllNotifications}
                aria-label="Clear all notifications"
                title="Clear all notifications"
                className="text-[0.5rem] font-mono font-bold text-gray-400 hover:text-voro-danger bg-white/[0.04] hover:bg-voro-danger/10 px-2 py-0.5 rounded-full border border-white/10 hover:border-voro-danger/30 tracking-widest transition-colors outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/60 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A0C14]"
              >
                CLEAR ALL
              </button>
            )}
            <span className="text-[0.5rem] font-mono font-bold text-voro-primary bg-voro-primary/10 px-2 py-0.5 rounded-full border border-voro-primary/20 tracking-widest shadow-[0_0_10px_rgba(124,58,237,0.2)]">
              {count} {count === 1 ? 'SIGNAL' : 'SIGNALS'}
            </span>
            <span className="text-[0.45rem] font-mono font-bold text-white/30 uppercase tracking-widest hidden sm:inline">
              [{subpixelHash} // [0xNTF_STREAM]]
            </span>
          </div>
        </div>
      )}

      {/* ⚡ Active Signal Payload Stack */}
      <div className="space-y-4 sm:space-y-5">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>
    </section>
  );
});

NotificationContainer.displayName = "NotificationContainer";

export default NotificationContainer;
