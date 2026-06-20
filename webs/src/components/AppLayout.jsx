import React, { useState, createContext, useContext, useEffect, useMemo } from 'react';
import Sidebar from './Sidebar';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Menu, Activity } from 'lucide-react';
import SecurityLockdown from './SecurityLockdown';

export const SidebarContext = createContext({ collapsed: false, setCollapsed: () => {} });

export const useSidebar = () => useContext(SidebarContext);

const AppLayout = ({ children }) => {
  const isMobile = useMediaQuery('(max-width: 1024px)');

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

      <div className="flex h-full bg-[#080B14] relative selection:bg-voro-primary/30">
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
          className="flex-1 min-h-screen overflow-y-auto overflow-x-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none"
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
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-voro-primary flex items-center justify-center shadow-lg shadow-voro-primary/20">
                      <span className="text-white font-serif italic font-bold text-xl">V</span>
                    </div>
                    <div className="absolute -inset-1 bg-voro-primary/20 blur-lg rounded-xl" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-serif italic font-medium text-xl tracking-tighter leading-none">Voro</span>
                    <span className="text-[0.5rem] font-mono text-voro-primary uppercase tracking-[0.4em] mt-1">Matrix Active</span>
                  </div>
                </div>
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
