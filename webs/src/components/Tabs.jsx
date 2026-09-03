import React, { useRef, useEffect, useState, useId, useMemo, memo, useCallback } from "react";

// Hoisted frozen fallback to ensure zero heap allocation per render cycle
const EMPTY_TABS = Object.freeze([]);

/**
 * ⚡ REFINEMENT: Luxury Kinetic Neural Selection Matrix (Tabs).
 * Re-engineered to Voro's 'Forge' luxury architecture: features 60fps direct-DOM
 * magnetic node tracking, volumetric glass conduits, live coordinate telemetry,
 * dynamic liquid perimeter illumination, and zero-allocation performance standards.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Spatial box-model architecture suggesting a high-precision selection matrix.
 * 2. Precision: JetBrains Mono for metadata & coordinate telemetry; Playfair Display for active state.
 * 3. Motion: 60fps direct-DOM magnetic proximity vectors and volumetric 3D rotational tilt.
 * 4. Performance: Surgical Reactivity bypassing React state churn during high-frequency pointer movements.
 */
export const Tabs = memo(({ tabs = EMPTY_TABS, activeTab, onTabChange, className = "" }) => {
  const activeTabRef = useRef(null);
  const tabListRef = useRef(null);
  const telemetryRef = useRef(null);
  const baseId = useId();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Generate a stable, pre-sanitized identifier for the matrix node
  const cleanMatrixId = useMemo(() => baseId.replace(/:/g, ''), [baseId]);

  const safeTabs = Array.isArray(tabs) ? tabs : EMPTY_TABS;

  // Recalculate volumetric glass indicator dimensions
  const updateIndicator = useCallback(() => {
    if (activeTabRef.current) {
      const { offsetLeft, offsetWidth } = activeTabRef.current;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, []);

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab, safeTabs, updateIndicator]);

  // Direct DOM 60fps magnetic proximity and 3D volumetric tilt tracking
  const handleMouseMove = useCallback((e) => {
    if (!tabListRef.current) return;

    const rect = tabListRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Direct DOM CSS variable injection for liquid perimeter illumination
    tabListRef.current.style.setProperty('--mouse-x', `${mouseX}px`);
    tabListRef.current.style.setProperty('--mouse-y', `${mouseY}px`);

    // Calculate subtle 3D rotational tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = Math.max(-4, Math.min(4, ((mouseY - centerY) / centerY) * -3));
    const tiltY = Math.max(-4, Math.min(4, ((mouseX - centerX) / centerX) * 3));

    tabListRef.current.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    tabListRef.current.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);

    // Magnetic vector pull for individual tab nodes
    const tabNodes = tabListRef.current.querySelectorAll('[role="tab"]');
    tabNodes.forEach((node) => {
      const nodeRect = node.getBoundingClientRect();
      const nodeCenterX = nodeRect.left + nodeRect.width / 2;
      const nodeCenterY = nodeRect.top + nodeRect.height / 2;

      const distance = Math.hypot(e.clientX - nodeCenterX, e.clientY - nodeCenterY);
      const radius = 120; // Magnetic field radius

      if (distance < radius) {
        const maxPull = 6;
        const strength = 1 - distance / radius;
        const moveX = (e.clientX - nodeCenterX) * (maxPull / radius) * strength;
        const moveY = (e.clientY - nodeCenterY) * (maxPull / radius) * strength;

        node.style.transition = 'transform 0.1s cubic-bezier(0.23, 1, 0.32, 1)';
        node.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0) scale(1.025)`;
      } else {
        node.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        node.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
    });

    // Update live coordinate telemetry display
    if (telemetryRef.current) {
      telemetryRef.current.textContent = `TX_${tiltX >= 0 ? '+' : ''}${tiltX.toFixed(1)}° TY_${tiltY >= 0 ? '+' : ''}${tiltY.toFixed(1)}°`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!tabListRef.current) return;

    tabListRef.current.style.setProperty('--tilt-x', '0deg');
    tabListRef.current.style.setProperty('--tilt-y', '0deg');

    const tabNodes = tabListRef.current.querySelectorAll('[role="tab"]');
    tabNodes.forEach((node) => {
      node.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
      node.style.transform = 'translate3d(0, 0, 0) scale(1)';
    });

    if (telemetryRef.current) {
      telemetryRef.current.textContent = 'TX_0.0° TY_0.0°';
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    const currentIndex = safeTabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex === -1) return;

    let nextIndex;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % safeTabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + safeTabs.length) % safeTabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = safeTabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    onTabChange(safeTabs[nextIndex].id);

    setTimeout(() => {
      if (tabListRef.current) {
        const nextTab = tabListRef.current.querySelector('[aria-selected="true"]');
        if (nextTab) nextTab.focus();
      }
    }, 0);
  }, [safeTabs, activeTab, onTabChange]);

  return (
    <div className={className}>
      {/* Luxury Telemetry Header Bar */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-3">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.9)]" />
          </div>
          <span className="text-[0.6rem] font-mono font-bold uppercase tracking-[0.35em] text-gray-400 flex items-center gap-2">
            Selection_Matrix <span className="text-voro-primary/60">//</span> MTX_{cleanMatrixId}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            ref={telemetryRef}
            className="text-[0.5rem] font-mono font-semibold text-voro-primary/80 tracking-widest bg-voro-primary/10 px-2 py-0.5 rounded border border-voro-primary/20"
          >
            TX_0.0° TY_0.0°
          </span>
          <span className="text-[0.5rem] font-mono font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10">
            0xTAB_{cleanMatrixId.slice(-6)}
          </span>
        </div>
      </div>

      {/* Kinetic Tablist Matrix Track */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-orientation="horizontal"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        className="relative flex gap-1.5 bg-[#0A0C14]/90 backdrop-blur-2xl p-2 rounded-2xl border border-white/10 mb-8 overflow-x-auto no-scrollbar scroll-smooth shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] group transition-transform duration-300 ease-out"
        style={{
          transform: 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Dynamic Liquid Border Illumination Mask */}
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.25), transparent 80%)`,
          }}
          aria-hidden="true"
        />

        {/* Boutique Grain Overlay */}
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none rounded-2xl" />

        {/* Volumetric Glass Indicator: Premium sliding artifact */}
        <div
          className="absolute inset-y-2 bg-voro-primary rounded-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_35px_rgba(124,58,237,0.45)] overflow-hidden"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
          aria-hidden="true"
        >
          {/* Internal Shimmer Pulse */}
          <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-25" />

          {/* Liquid Light Lead Edge */}
          <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white/25 to-transparent blur-sm" />

          {/* Gloss Reflection Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent" />
        </div>

        {safeTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const tabId = `${baseId}-tab-${tab.id}`;
          const panelId = `${baseId}-panel-${tab.id}`;

          return (
            <button
              key={tab.id}
              id={tabId}
              ref={isActive ? activeTabRef : null}
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              className={`relative z-10 px-8 py-3.5 rounded-xl transition-all duration-300 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C14] focus-visible:[transform:rotateX(4deg)_rotateY(-4deg)_scale(1.03)] flex items-center justify-center gap-3 group/tab ${
                isActive
                  ? "text-white font-serif italic text-lg font-medium tracking-tight shadow-lg"
                  : "text-gray-400 hover:text-white font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em]"
              }`}
            >
              {tab.icon && (
                <span className={`${isActive ? "text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" : "text-gray-500 group-hover/tab:text-gray-300"} transition-all duration-300`}>
                  {tab.icon}
                </span>
              )}
              {tab.label}

              {/* Corner Telemetry Sync Marker (Active only) */}
              {isActive && (
                <div className="absolute top-1.5 right-2.5 pointer-events-none opacity-30 flex font-mono text-[0.35rem] font-bold text-white uppercase tracking-wider">
                  [L_SYNC]
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="relative">
        {safeTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              id={`${baseId}-panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${tab.id}`}
              className={`transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
                isActive
                  ? "opacity-100 translate-y-0 scale-100 visible"
                  : "opacity-0 translate-y-6 scale-[0.99] invisible absolute inset-0 pointer-events-none"
              }`}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
});

Tabs.displayName = "Tabs";

export default Tabs;
