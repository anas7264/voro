import React, { useState, createContext, useContext, useEffect, useMemo, useRef, useId } from 'react';
import Sidebar from './Sidebar';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Menu, Activity } from 'lucide-react';
import SecurityLockdown from './SecurityLockdown';
import VoroLogo from './VoroLogo';

export const SidebarContext = createContext({ collapsed: false, setCollapsed: () => {} });

export const useSidebar = () => useContext(SidebarContext);

/**
 * ⚡ REFINEMENT: Luxury Kinetic Spatial Vault Architecture ('AppLayout').
 * Re-engineered conforming to Voro's 'Forge' luxury system standards:
 * features direct-DOM 60fps cursor-driven neural ambient fog displacement,
 * volumetric spatial grid texture, high-fidelity glassmorphism,
 * SSR-safe sub-pixel attestation hash badging (`0xLYT_...`), and W3C APG compliant accessibility.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Spatial box-model architecture creating a protected boutique vault frame.
 * 2. Precision: Playfair Display italic hero accents paired with JetBrains Mono system telemetry.
 * 3. Motion: 60fps direct-DOM mouse vector tracking bypassing React state churn.
 * 4. Spatial Architecture: Golden ratio spacing letting every page view breathe.
 */
const AppLayout = ({ children }) => {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const layoutRef = useRef(null);
  const mobileHeaderRef = useRef(null);
  const reactId = useId();

  // SSR-safe deterministic sub-pixel attestation hash badges
  const layoutAttestationHash = useMemo(() => {
    const cleanId = reactId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `0xLYT_${cleanId.slice(-4).padStart(4, '0')}`;
  }, [reactId]);

  const skipLinkHash = useMemo(() => {
    const cleanId = reactId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `0xSKP_${cleanId.slice(-4).padStart(4, '0')}`;
  }, [reactId]);

  /**
   * ⚡ OPTIMIZATION: Global Neural Ambient Engine.
   * Tracks mouse movement to drive background atmospheric displacement and liquid spotlight.
   * Direct DOM manipulation of CSS variables bypasses React render cycle.
   * Throttled via requestAnimationFrame and passive event listeners.
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
        // Update CSS variables on the spatial container
        layoutRef.current.style.setProperty('--bg-x1', `${nx * 0.4}%`);
        layoutRef.current.style.setProperty('--bg-y1', `${ny * 0.4}%`);
        layoutRef.current.style.setProperty('--bg-x2', `${(100 - nx) * 0.3}%`);
        layoutRef.current.style.setProperty('--bg-y2', `${(100 - ny) * 0.3}%`);

        if (mobileHeaderRef.current) {
          const rect = mobileHeaderRef.current.getBoundingClientRect();
          const mx = clientX - rect.left;
          const my = clientY - rect.top;
          mobileHeaderRef.current.style.setProperty('--mouse-x', `${mx}px`);
          mobileHeaderRef.current.style.setProperty('--mouse-y', `${my}px`);
        }
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
   * Direct initialization from isMobile eliminates mount-time double-render cycles.
   */
  const [collapsed, setCollapsed] = useState(isMobile);

  // Sync collapsed state with isMobile changes (e.g. window resize)
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  /**
   * ⚡ OPTIMIZATION: Memoize context value.
   * Prevents redundant re-renders of SidebarContext consumers when AppLayout re-renders.
   */
  const contextValue = useMemo(() => ({
    collapsed,
    setCollapsed
  }), [collapsed, setCollapsed]);

  return (
    <SidebarContext.Provider value={contextValue}>
      {/* 🛰️ Luxury Glassmorphic Skip to Content Vault Link (W3C APG Accessibility) */}
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-[200] px-6 py-3 bg-[#0A0C14]/95 backdrop-blur-2xl border border-voro-primary/50 text-white font-mono text-[0.65rem] font-bold uppercase tracking-[0.3em] rounded-2xl shadow-[0_20px_50px_rgba(124,58,237,0.3)] sr-only focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-voro-primary focus:ring-offset-4 focus:ring-offset-[#020408] transition-all duration-300 flex items-center gap-3 group/skip"
      >
        <span className="w-2 h-2 rounded-full bg-voro-primary shadow-[0_0_10px_#7C3AED] animate-pulse" />
        <span className="font-serif italic text-sm text-voro-primary">Skip</span> to Main Content
        <span className="text-white/30 font-mono text-[0.5rem] tracking-widest ml-1">[{skipLinkHash}]</span>
      </a>

      <div
        ref={layoutRef}
        className="flex h-full bg-[#080B14] relative selection:bg-voro-primary/30 overflow-hidden"
      >
        {/* 🛰️ GLOBAL NEURAL AMBIENT ENGINE & VOLUMETRIC SPATIAL GRID */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
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
          {/* Tertiary Depth Layer: Boutique Sub-pixel Grain & Spatial Grid */}
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.015]" />
          <div className="absolute inset-0 bg-grid-white opacity-[0.015]" />
        </div>

        {/* Primary Sidebar Enclave */}
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile} />

        {/* Mobile Backdrop Mask */}
        {isMobile && !collapsed && (
          <div
            className="fixed inset-0 bg-[#020408]/90 backdrop-blur-2xl z-[50] animate-fade-in"
            onClick={() => setCollapsed(true)}
            aria-hidden="true"
          />
        )}

        {/* Main Content Vault Viewport */}
        <main
          id="main-content"
          tabIndex="-1"
          className="flex-1 min-h-screen overflow-y-auto overflow-x-hidden transition-all duration-700 ease-expo-out focus:outline-none"
          style={{ marginLeft: isMobile ? '0' : (collapsed ? '96px' : '320px') }}
        >
          <SecurityLockdown />

          {/* 🛰️ Mobile Top Header Vault Node */}
          {isMobile && (
            <header
              ref={mobileHeaderRef}
              role="banner"
              className="sticky top-0 z-[40] flex items-center justify-between h-24 px-8 bg-[#080B14]/85 backdrop-blur-3xl border-b border-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.8)] group/mobheader"
            >
              {/* Dynamic Liquid Border Perimeter Illumination Mask */}
              <div
                className="absolute inset-0 opacity-0 group-hover/mobheader:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.2), transparent 80%)`,
                }}
                aria-hidden="true"
              />

              <div className="flex items-center gap-6 relative z-10">
                <button
                  type="button"
                  onClick={() => setCollapsed(false)}
                  className="p-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all active:scale-90 focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#080B14] outline-none shadow-lg"
                  aria-label="Open sidebar navigation menu"
                >
                  <Menu size={20} />
                </button>
                <VoroLogo size={40} withText />
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-voro-primary shadow-inner">
                  <Activity size={16} className="animate-pulse drop-shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
                </div>
                <span className="hidden sm:inline font-mono text-[0.45rem] font-bold text-white/20 uppercase tracking-[0.25em]">
                  {layoutAttestationHash}
                </span>
              </div>
            </header>
          )}

          <div className="relative min-h-full">
            {/* Architectural Gradient Light Beam */}
            <div
              className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-voro-primary/[0.025] via-transparent to-transparent pointer-events-none"
              aria-hidden="true"
            />
            {children}
          </div>
        </main>
      </div>
    </SidebarContext.Provider>
  );
};

export default AppLayout;
