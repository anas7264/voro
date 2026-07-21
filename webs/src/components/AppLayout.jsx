import React, { useState, createContext, useContext, useEffect, useMemo, useRef } from 'react';
import Sidebar from './Sidebar';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Menu, Activity } from 'lucide-react';
import SecurityLockdown from './SecurityLockdown';
import VoroLogo from './VoroLogo';

export const SidebarContext = createContext({ collapsed: false, setCollapsed: () => {} });

export const useSidebar = () => useContext(SidebarContext);

const AppLayout = ({ children }) => {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const layoutRef = useRef(null);

  /**
   * ⚡ OPTIMIZATION: Global Neural Ambient Engine.
   * Tracks mouse movement to drive background atmospheric displacement.
   * Uses direct DOM manipulation of CSS variables to bypass React render cycle.
   * Hardened with high-frequency event throttling via requestAnimationFrame and passive registration.
   */
  useEffect(() => {
    let rId;
    const handleMouseMove = (e) => {
      if (!layoutRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate normalized coordinates (-50 to 50)
      const nx = (clientX / innerWidth) * 100;
      const ny = (clientY / innerHeight) * 100;

      if (rId) {
        cancelAnimationFrame(rId);
      }

      rId = requestAnimationFrame(() => {
        if (!layoutRef.current) return;
        // Update CSS variables on the container
        layoutRef.current.style.setProperty('--bg-x1', `${nx * 0.4}%`);
        layoutRef.current.style.setProperty('--bg-y1', `${ny * 0.4}%`);
        layoutRef.current.style.setProperty('--bg-x2', `${(100 - nx) * 0.3}%`);
        layoutRef.current.style.setProperty('--bg-y2', `${(100 - ny) * 0.3}%`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rId) {
        cancelAnimationFrame(rId);
      }
    };
  }, []);

  /**
   * ⚡ OPTIMIZATION: Initialize state from source of truth.
   * Direct initialization from isMobile eliminates the mount-time
   * double-render cycle and visual flickering during layout hydration.
   */
  const [collapsed, setCollapsed] = useState(isMobile);

  // Sync collapsed state with isMobile changes (e.g. window resize)
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  /**
   * ⚡ OPTIMIZATION: Memoize context value.
   * Prevents redundant re-renders of all SidebarContext consumers
   * (like the Sidebar itself) when AppLayout re-renders for unrelated reasons.
   */
  const contextValue = useMemo(() => ({
    collapsed,
    setCollapsed
  }), [collapsed, setCollapsed]);

  return (
    <SidebarContext.Provider value={contextValue}>
      {/* Skip to Content Link (Accessibility) */}
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-[200] px-6 py-3 bg-voro-primary text-white font-mono text-[0.6rem] font-black uppercase tracking-[0.3em] rounded-xl shadow-2xl sr-only focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300"
      >
        Skip to Content
      </a>

      <div
        ref={layoutRef}
        className="flex h-full bg-[#080B14] relative selection:bg-voro-primary/30 overflow-hidden"
      >
        {/* 🛰️ GLOBAL NEURAL AMBIENT ENGINE */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Primary Neural Fog: Luminous Primary Hub */}
          <div
            className="absolute w-[60vw] h-[60vw] rounded-full bg-voro-primary/5 blur-[120px] transition-all duration-[3s] ease-out"
            style={{
              left: 'var(--bg-x1, -10%)',
              top: 'var(--bg-y1, -10%)',
              transform: 'translate3d(-50%, -50%, 0)',
            }}
          />
          {/* Secondary Neural Fog: Biometric Secondary Hub */}
          <div
            className="absolute w-[50vw] h-[50vw] rounded-full bg-voro-secondary/5 blur-[100px] transition-all duration-[4s] ease-out"
            style={{
              right: 'var(--bg-x2, -5%)',
              bottom: 'var(--bg-y2, 10%)',
              transform: 'translate3d(50%, 50%, 0)',
            }}
          />
          {/* Tertiary Depth Layer: Sub-pixel Grain */}
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.015]" />
        </div>

        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile} />

        {isMobile && !collapsed && (
          <div
            className="fixed inset-0 bg-[#020408]/90 backdrop-blur-2xl z-[50] animate-fade-in"
            onClick={() => setCollapsed(true)}
          />
        )}

        <main
          id="main-content"
          tabIndex="-1"
          className="flex-1 min-h-screen overflow-y-auto overflow-x-hidden transition-all duration-700 ease-expo-out focus:outline-none"
          style={{ marginLeft: isMobile ? '0' : (collapsed ? '96px' : '320px') }}
        >
          <SecurityLockdown />
          {isMobile && (
            <div className="sticky top-0 z-[40] flex items-center justify-between h-24 px-8 bg-[#080B14]/80 backdrop-blur-2xl border-b border-white/[0.03]">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setCollapsed(false)}
                  className="p-3.5 bg-white/[0.03] border border-white/5 rounded-2xl text-gray-400 hover:text-white transition-all active:scale-90 focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#080B14] outline-none"
                  aria-label="Open sidebar"
                >
                  <Menu size={20} />
                </button>
                <VoroLogo size={40} withText />
              </div>

              <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-voro-primary">
                <Activity size={16} className="animate-pulse" />
              </div>
            </div>
          )}

          <div className="relative min-h-full">
             {/* Architectural Background Detail */}
             <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-voro-primary/[0.02] to-transparent pointer-events-none" />
             {children}
          </div>
        </main>
      </div>
    </SidebarContext.Provider>
  );
};

export default AppLayout;
