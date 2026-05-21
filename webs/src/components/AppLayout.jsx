import React, { useState, createContext, useContext } from 'react';
import Sidebar from './Sidebar';

export const SidebarContext = createContext({ collapsed: false, setCollapsed: () => {} });

export const useSidebar = () => useContext(SidebarContext);

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex h-full bg-[#080B14]">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main
          className="flex-1 min-h-screen overflow-y-auto overflow-x-hidden transition-all duration-300"
          style={{ marginLeft: collapsed ? '64px' : '240px' }}
        >
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
};

export default AppLayout;
