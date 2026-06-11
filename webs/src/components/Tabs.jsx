import React, { useRef, useEffect, useState } from "react";

/**
 * ⚡ OPTIMIZATION: Refined luxury Tabs component.
 * Features a kinetic 'pill' indicator, serif-italic active states,
 * and high-end mathematical whitespace for a boutique aesthetic.
 */
export const Tabs = ({ tabs = [], activeTab, onTabChange, className = "" }) => {
  const activeTabRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (activeTabRef.current) {
      const { offsetLeft, offsetWidth } = activeTabRef.current;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  const handleKeyDown = (e) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (e.key === "ArrowRight") {
      const nextIndex = (currentIndex + 1) % tabs.length;
      onTabChange(tabs[nextIndex].id);
      setTimeout(() => {
        const nextTab = document.querySelector(`[aria-selected="true"]`);
        if (nextTab) nextTab.focus();
      }, 0);
    } else if (e.key === "ArrowLeft") {
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      onTabChange(tabs[prevIndex].id);
      setTimeout(() => {
        const prevTab = document.querySelector(`[aria-selected="true"]`);
        if (prevTab) prevTab.focus();
      }, 0);
    }
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        className="relative flex gap-1 bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 mb-12 overflow-x-auto no-scrollbar scroll-smooth"
        onKeyDown={handleKeyDown}
      >
        {/* Kinetic Indicator: Premium sliding effect */}
        <div
          className="absolute inset-y-1.5 bg-voro-primary rounded-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        />

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              className={`relative z-10 px-8 py-3.5 rounded-xl transition-all duration-500 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-95 flex items-center justify-center gap-3 group ${
                isActive
                  ? "text-white font-serif italic text-lg font-medium tracking-tight"
                  : "text-gray-500 hover:text-gray-300 font-mono text-[0.65rem] font-black uppercase tracking-[0.25em]"
              }`}
            >
              {tab.icon && (
                <span className={`${isActive ? "text-white" : "text-gray-600 group-hover:text-gray-400"} transition-colors duration-500`}>
                  {tab.icon}
                </span>
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="relative">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              activeTab === tab.id
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 translate-y-8 invisible absolute inset-0"
            }`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
