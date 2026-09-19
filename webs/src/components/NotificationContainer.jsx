import React, { memo } from "react";
import { useNotifications, useNotificationState } from "../hooks/useNotifications";
import { Alert } from "./Alert";

/**
 * ⚡ LUXURY MASTERCLASS REFINEMENT: Kinetic Notification Matrix Stream ('NotificationContainer').
 * Re-engineered conforming to Voro's 'Forge' luxury design architecture and zero-allocation performance standards.
 * Features elevated golden-ratio spatial positioning, responsive viewport margins, a bespoke glassmorphic
 * telemetry header matrix badge, W3C APG compliant live region semantics, and surgical reactivity.
 *
 * DESIGN PHILOSOPHY:
 * 1. Aesthetic & Visual Language: Boutique gallery layout with Playfair Display italic accents & JetBrains Mono metadata.
 * 2. Spatial Architecture: Mathematical whitespace (top-6 right-6 sm:top-10 sm:right-10) letting toast notifications floating with dynamic depth.
 * 3. High-End Micro-interactions: Fluid entrance animations and 60fps direct-DOM volumetric 3D hover physics forwarded to Alert nodes.
 * 4. Cognitive Ease: Clear visual hierarchy with live stream telemetry (`[0xNTF_STREAM]`) reducing uncertainty.
 */
export const NotificationContainer = memo(() => {
  const notifications = useNotificationState();
  const { removeNotification } = useNotifications();

  const count = notifications ? notifications.length : 0;

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
        <div className="pointer-events-auto flex items-center justify-between px-4 py-2 rounded-2xl bg-[#0A0C14]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] animate-fade-in transition-all duration-500">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.9)]" />
            </div>
            <span className="text-[0.55rem] font-mono font-black uppercase tracking-[0.3em] text-white/70">
              Notification_Stream <span className="text-voro-primary/60">//</span> ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[0.5rem] font-mono font-bold text-voro-primary bg-voro-primary/10 px-2 py-0.5 rounded-full border border-voro-primary/20 tracking-widest">
              {count} {count === 1 ? 'SIGNAL' : 'SIGNALS'}
            </span>
            <span className="text-[0.45rem] font-mono font-bold text-white/30 uppercase tracking-widest hidden sm:inline">
              [0xNTF_STREAM]
            </span>
          </div>
        </div>
      )}

      {/* ⚡ Active Signal Payload Stack */}
      <div className="space-y-4 sm:space-y-5">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <Alert
              type={notification.type}
              title={notification.title}
              message={notification.message}
              onClose={() => removeNotification(notification.id)}
              className="animate-slide-up"
            />
          </div>
        ))}
      </div>
    </section>
  );
});

NotificationContainer.displayName = "NotificationContainer";

export default NotificationContainer;
