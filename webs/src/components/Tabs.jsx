import React, { useRef, useEffect, useState, useId, useMemo, memo } from "react";

/**
 * ⚡ REFINEMENT: Luxury Kinetic Neural Selection Matrix (Tabs).
 * Re-engineered to the 'Forge' luxury standard: features magnetic node tracking,
 * volumetric glass conduits, and industrial system telemetry.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Box-model architecture suggests a high-precision selection matrix.
 * 2. Precision: JetBrains Mono for system markers; Playfair Display for active state.
 * 3. Motion: Magnetic proximity fields and kinetic shimmer transitions.
 * 4. Performance: Surgical Reactivity via direct DOM manipulation for 60fps telemetry.
 */
export const Tabs = memo(({ tabs = [], activeTab, onTabChange, className = "" }) => {
  const activeTabRef = useRef(null);
  const tabListRef = useRef(null);
  const baseId = useId();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Generate a stable system ID for the matrix node
  const matrixId = useId();

  useEffect(() => {
    if (activeTabRef.current) {
      const { offsetLeft, offsetWidth } = activeTabRef.current;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  const handleMouseMove = (e) => {
    if (!tabListRef.current) return;

    // Direct DOM manipulation of children for magnetic effect
    const tabNodes = tabListRef.current.querySelectorAll('[role="tab"]');
    tabNodes.forEach(node => {
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = e.clientX;
      const y = e.clientY;

      const distance = Math.hypot(x - centerX, y - centerY);
      const radius = 100; // Influence area

      if (distance < radius) {
        // Soft-clamped linear interpolation to prevent center-point jitter
        const maxPull = 6;
        const strength = 1 - (distance / radius);
        const moveX = (x - centerX) * (maxPull / radius) * strength;
        const moveY = (y - centerY) * (maxPull / radius) * strength;

        // Apply transform directly to bypass React render cycle for 60fps fluidity
        node.style.transition = 'transform 0.1s cubic-bezier(0.23, 1, 0.32, 1)';
        node.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.02)`;
      } else {
        node.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        node.style.transform = `translate3d(0, 0, 0) scale(1)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (!tabListRef.current) return;
    const tabNodes = tabListRef.current.querySelectorAll('[role="tab"]');
    tabNodes.forEach(node => {
      node.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
      node.style.transform = `translate3d(0, 0, 0) scale(1)`;
    });
  };

  const handleKeyDown = (e) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    let nextIndex;

    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else {
      return;
    }

    onTabChange(tabs[nextIndex].id);
    setTimeout(() => {
      if (tabListRef.current) {
        const nextTab = tabListRef.current.querySelector('[aria-selected="true"]');
        if (nextTab) nextTab.focus();
      }
    }, 0);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4 px-2">
         <div className="flex items-center gap-3">
            <div className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-voro-primary shadow-[0_0_8px_rgba(124,58,237,0.8)]"></span>
            </div>
            <span className="text-[0.55rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500">
               Selection_Matrix // MTX_{matrixId.replace(/:/g, '')}
            </span>
         </div>
         <span className="text-[0.45rem] font-mono font-bold text-gray-700 uppercase tracking-widest opacity-40">
           [MODE_SELECT]
         </span>
      </div>

      <div
        ref={tabListRef}
        role="tablist"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative flex gap-1 bg-[#0A0C14]/80 backdrop-blur-2xl p-1.5 rounded-2xl border border-white/5 mb-12 overflow-x-auto no-scrollbar scroll-smooth shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
        onKeyDown={handleKeyDown}
      >
        {/* Boutique Grain Overlay */}
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02] pointer-events-none rounded-2xl" />

        {/* Volumetric Glass Indicator: Premium sliding artifact */}
        <div
          className="absolute inset-y-1.5 bg-voro-primary rounded-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_30px_rgba(124,58,237,0.4)] overflow-hidden"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
          aria-hidden="true"
        >
          {/* Internal Shimmer Pulse */}
          <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-20" />

          {/* Liquid Light Lead Edge */}
          <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white/20 to-transparent blur-sm" />

          {/* Gloss Reflection Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
        </div>

        {tabs.map((tab) => {
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
              style={{ transition: 'color 0.5s ease' }}
              className={`relative z-10 px-8 py-3.5 rounded-xl transition-[color,opacity,background-color] duration-500 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C14] flex items-center justify-center gap-3 group ${
                isActive
                  ? "text-white font-serif italic text-lg font-medium tracking-tight"
                  : "text-gray-500 hover:text-gray-300 font-mono text-[0.65rem] font-black uppercase tracking-[0.25em]"
              }`}
            >
              {tab.icon && (
                <span className={`${isActive ? "text-white scale-110" : "text-gray-600 group-hover:text-gray-400"} transition-all duration-500`}>
                  {tab.icon}
                </span>
              )}
              {tab.label}

              {/* Corner Telemetry (Active only) */}
              {isActive && (
                <div className="absolute top-1 right-2 pointer-events-none opacity-20 flex font-mono text-[0.35rem] font-bold text-white uppercase">
                   [L_SYNC]
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="relative">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`${baseId}-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${tab.id}`}
            className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              activeTab === tab.id
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 translate-y-12 invisible absolute inset-0"
            }`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
});

Tabs.displayName = "Tabs";

export default Tabs;
