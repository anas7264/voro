import React, { useState, createContext, useContext, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Menu } from 'lucide-react';

export const SidebarContext = createContext({ collapsed: false, setCollapsed: () => {} });

export const useSidebar = () => useContext(SidebarContext);

const AppLayout = ({ children }) => {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isMobile]);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex h-full bg-[#080B14] relative">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile} />

        {isMobile && !collapsed && (
          <div
            className="fixed inset-0 bg-[#080B14]/80 backdrop-blur-xl z-[50] animate-fade-in"
            onClick={() => setCollapsed(true)}
          />
        )}

        <main
          className="flex-1 min-h-screen overflow-y-auto overflow-x-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ marginLeft: isMobile ? '0' : (collapsed ? '80px' : '288px') }}
        >
          {isMobile && (
            <div className="sticky top-0 z-[40] flex items-center justify-between h-20 px-6 bg-[#080B14]/80 backdrop-blur-xl border-b border-white/5">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCollapsed(false)}
                  className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white transition-all active:scale-90"
                >
                  <Menu size={22} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-voro-primary flex items-center justify-center shadow-lg shadow-voro-primary/20">
                    <span className="text-white font-black text-xs">V</span>
                  </div>
                  <span className="text-white font-black text-lg tracking-[0.2em] uppercase">Voro</span>
                </div>
              </div>
            </div>
          )}
          <div className="relative">
             {children}
          </div>
        </main>
      </div>
    </SidebarContext.Provider>
  );
};

export default AppLayout;
