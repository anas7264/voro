import React, { useState, createContext, useContext } from 'react';
import Sidebar from './Sidebar';

export const SidebarContext = createContext({ collapsed: false, setCollapsed: () => {} });

export const useSidebar = () => useContext(SidebarContext);

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex h-full bg-[#020408]">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main
          className="flex-1 min-h-screen overflow-y-auto overflow-x-hidden transition-all duration-500 ease-in-out"
          style={{ marginLeft: collapsed ? '80px' : '288px' }}
        >
          <div className="relative">
            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
              <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-voro-primary/5 rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] bg-blue-600/5 rounded-full blur-[100px]" />
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarContext.Provider>
  );
};

export default AppLayout;
