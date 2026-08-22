import React, { useRef, memo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Utensils, Dumbbell, Activity, BarChart3,
  Trophy, Bot, Calculator, BookOpen, User, Settings,
  X, Calendar, ShieldCheck, Zap, Coffee, Star, Camera,
  Heart, TrendingUp, Target, Clock, BookMarked, Layers, ShoppingCart, Flame
} from 'lucide-react';
import VoroLogo from './VoroLogo';

const navSections = [
  {
    label: 'Core Systems',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, nodeId: 'CORE_DASH' },
    ]
  },
  {
    label: 'Metabolic Matrix',
    items: [
      { path: '/nutrition/diary', label: 'Food Diary', icon: Utensils, nodeId: 'MET_DIARY' },
      { path: '/nutrition/planner', label: 'Meal Planner', icon: Calendar, nodeId: 'MET_PLAN' },
      { path: '/nutrition/library', label: 'Food Library', icon: BookMarked, nodeId: 'MET_LIB' },
      { path: '/nutrition/recipes', label: 'Recipes', icon: Coffee, nodeId: 'MET_RCP' },
      { path: '/nutrition/shopping-list', label: 'Shopping List', icon: ShoppingCart, nodeId: 'MET_SHOP' },
      { path: '/nutrition/tracker', label: 'Nutrients', icon: Layers, nodeId: 'MET_TRK' },
    ]
  },
  {
    label: 'Kinetic Logic',
    items: [
      { path: '/workout/log', label: 'Workout Log', icon: Dumbbell, nodeId: 'KIN_LOG' },
      { path: '/workout/history', label: 'History', icon: BookOpen, nodeId: 'KIN_HIST' },
      { path: '/workout/library', label: 'Exercises', icon: BookMarked, nodeId: 'KIN_LIB' },
      { path: '/workout/plan', label: 'Training Plan', icon: Target, nodeId: 'KIN_PLAN' },
    ]
  },
  {
    label: 'Biometric Archive',
    items: [
      { path: '/body/metrics', label: 'Body Metrics', icon: Activity, nodeId: 'BIO_METR' },
      { path: '/body/composition', label: 'Composition', icon: TrendingUp, nodeId: 'BIO_COMP' },
      { path: '/body/photos', label: 'Progress Photos', icon: Camera, nodeId: 'BIO_PHOT' },
      { path: '/body/vitals', label: 'Vitals', icon: Heart, nodeId: 'BIO_VITAL' },
      { path: '/body/pr-records', label: 'PR Records', icon: Star, nodeId: 'BIO_RECS' },
    ]
  },
  {
    label: 'Neural Intelligence',
    items: [
      { path: '/ai-coach', label: 'AI Coach', icon: Bot, nodeId: 'AI_COACH' },
      { path: '/analytics/dashboard', label: 'Statistics', icon: BarChart3, nodeId: 'ANA_STAT' },
      { path: '/analytics/performance', label: 'Performance', icon: Zap, nodeId: 'ANA_PERF' },
    ]
  },
  {
    label: 'Optimization',
    items: [
      { path: '/gamification/challenges', label: 'Challenges', icon: Target, nodeId: 'OPT_CHAL' },
      { path: '/gamification/achievements', label: 'Achievements', icon: Trophy, nodeId: 'OPT_ACHV' },
      { path: '/gamification/streak', label: 'Daily Streak', icon: Flame, nodeId: 'OPT_STRK' },
      { path: '/gamification/habits', label: 'Habits', icon: Clock, nodeId: 'OPT_HABI' },
    ]
  },
  {
    label: 'Configuration',
    items: [
      { path: '/profile', label: 'Profile', icon: User, nodeId: 'SYS_PROF' },
      { path: '/settings', label: 'Settings', icon: Settings, nodeId: 'SYS_SETT' },
    ]
  },
];

/**
 * ⚡ LUXURY MASTERCLASS REFINEMENT: Kinetic Neural Nav Node.
 * Re-engineered into a bespoke 60fps Volumetric 3D Interactive Node featuring direct-DOM
 * mouse-tracked rotational tilt, holographic spatial coordinate telemetry (TX/TY),
 * W3C APG accessible static 4-degree focus tilt, dynamic luminous lens backglows,
 * and high-contrast liquid light indicators.
 */
const NavItem = memo(({ item, isActive, collapsed, isMobile, onClick }) => {
  const nodeRef = useRef(null);
  const txRef = useRef(null);
  const tyRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const Icon = item.icon;

  const handleMouseMove = (e) => {
    if (!nodeRef.current || (collapsed && !isMobile)) return;

    const rect = nodeRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric 3D rotational tilt calculation (max 10 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 20;
    const tiltX = (0.5 - (y / rect.height)) * 20;

    nodeRef.current.style.setProperty('--mouse-x', `${x}px`);
    nodeRef.current.style.setProperty('--mouse-y', `${y}px`);
    nodeRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    nodeRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (txRef.current) txRef.current.innerText = tiltX.toFixed(1);
    if (tyRef.current) tyRef.current.innerText = tiltY.toFixed(1);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (nodeRef.current) {
      nodeRef.current.style.setProperty('--tilt-x', '0deg');
      nodeRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (nodeRef.current && (!collapsed || isMobile)) {
      nodeRef.current.style.setProperty('--tilt-x', '4deg');
      nodeRef.current.style.setProperty('--tilt-y', '-4deg');
      if (txRef.current) txRef.current.innerText = '4.0';
      if (tyRef.current) tyRef.current.innerText = '-4.0';
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (nodeRef.current) {
      nodeRef.current.style.setProperty('--tilt-x', '0deg');
      nodeRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      ref={nodeRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-label={item.label}
      style={{
        transform: interactionActive && (!collapsed || isMobile)
          ? 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-2px)'
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium
        transition-colors duration-500 group relative overflow-hidden focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408] outline-none
        ${collapsed && !isMobile ? 'justify-center' : ''}
        ${isActive ? 'text-white font-semibold bg-white/[0.02]' : 'text-gray-400 hover:text-white'}
      `}
    >
      {/* Dynamic Luminous Lens Spotlight */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: isHovered
            ? 'radial-gradient(150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.12), transparent 70%)'
            : 'radial-gradient(150px circle at 50% 50%, rgba(124, 58, 237, 0.12), transparent 70%)'
        }}
      />

      {/* Active Neural Ambient Aura */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-voro-primary/[0.08] via-voro-primary/[0.02] to-transparent backdrop-blur-md" />
      )}

      {/* Liquid Light Indicator Datum */}
      {isActive && (
        <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-voro-primary rounded-r-full shadow-[0_0_18px_rgba(124,58,237,0.9)] animate-pulse" />
      )}

      {/* Holographic Coordinate Telemetry Overlay */}
      {(!collapsed || isMobile) && (
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[0.45rem] font-bold text-voro-primary/80 tracking-widest opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 pointer-events-none transition-opacity duration-300 flex items-center gap-2"
          style={{ transform: 'translateZ(30px) translateY(-50%)' }}
        >
          <span className="hidden xl:inline">X_<span ref={txRef}>0.0</span>°</span>
          <span className="hidden xl:inline">Y_<span ref={tyRef}>0.0</span>°</span>
          <span className="text-voro-primary font-black">[0x{item.nodeId}]</span>
        </div>
      )}

      <Icon
        size={18}
        style={{ transform: 'translateZ(20px)' }}
        className={`
          flex-shrink-0 transition-all duration-500 relative z-10
          ${isActive ? 'text-voro-primary scale-110' : 'group-hover:scale-110 group-hover:text-voro-primary'}
        `}
      />

      {(!collapsed || isMobile) && (
        <span
          style={{ transform: 'translateZ(20px)' }}
          className={`
            tracking-tight relative z-10 font-medium transition-all duration-500
            ${isActive ? 'translate-x-1 opacity-100 font-bold text-white' : 'opacity-70 group-hover:opacity-100 group-hover:translate-x-1'}
          `}
        >
          {item.label}
        </span>
      )}

      {/* Collapsed Tooltip */}
      {collapsed && !isMobile && (
        <div className="
          absolute left-full ml-8 px-5 py-3
          bg-[#0A0C14] text-white text-[0.6rem] font-mono font-medium uppercase tracking-[0.3em] rounded-xl shadow-2xl
          opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 pointer-events-none
          whitespace-nowrap z-[70] border border-white/10
          transition-all duration-700 translate-x-[-15px] group-hover:translate-x-0 group-focus-visible:translate-x-0
          backdrop-blur-xl
        ">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-voro-primary animate-pulse" />
             <span>{item.label}</span>
             <span className="text-[0.45rem] text-voro-primary font-mono ml-2">[0x{item.nodeId}]</span>
          </div>
        </div>
      )}
    </NavLink>
  );
});

NavItem.displayName = 'NavItem';

const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full z-[60] flex flex-col
        bg-[#020408] border-r border-white/5 shadow-2xl
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${collapsed && !isMobile ? 'w-24' : 'w-80'}
        ${isMobile && collapsed ? '-translate-x-full' : 'translate-x-0'}
      `}
    >
      {/* Editorial Logo Section */}
      <div className={`
        flex items-center h-28 px-10 flex-shrink-0 relative
        ${collapsed && !isMobile ? 'justify-center' : 'justify-between'}
        border-b border-white/5 bg-white/[0.01]
      `}>
        <VoroLogo
          size={48}
          withText={!collapsed || isMobile}
          className="cursor-pointer"
          onClick={() => navigate('/dashboard')}
        />

        {isMobile && !collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="text-gray-600 hover:text-white transition-colors p-2.5 rounded-2xl bg-white/[0.02] border border-white/5 focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408] outline-none active:scale-90"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation Matrix */}
      <nav className="flex-1 overflow-y-auto py-12 px-6 space-y-12 no-scrollbar">
        {navSections.map((section) => (
          <div key={section.label} className="space-y-6">
            {(!collapsed || isMobile) && (
              <div className="px-4 flex items-center justify-between group/section">
                <span className="text-[0.55rem] font-mono font-bold text-gray-700 uppercase tracking-[0.5em] whitespace-nowrap transition-colors group-hover/section:text-voro-primary">
                  {section.label}
                </span>
                <div className="h-px flex-1 bg-white/5 mx-4 relative overflow-hidden">
                   <div className="absolute inset-0 bg-voro-primary scale-x-0 group-hover/section:scale-x-100 transition-transform duration-1000 origin-left" />
                </div>
                <span className="text-[0.45rem] font-mono text-gray-800 opacity-40">NODE_ARCHIVE</span>
              </div>
            )}

            <div className="space-y-1.5 px-2">
              {section.items.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/'));
                return (
                  <NavItem
                    key={item.path}
                    item={item}
                    isActive={isActive}
                    collapsed={collapsed}
                    isMobile={isMobile}
                    onClick={() => isMobile && setCollapsed(true)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Boutique Footer */}
      <div className="p-10 border-t border-white/[0.03] bg-black/20">
        <div className={`flex items-center gap-4 ${collapsed && !isMobile ? 'justify-center' : ''}`}>
           <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-voro-secondary animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-voro-secondary animate-ping opacity-40" />
           </div>
           {(!collapsed || isMobile) && (
             <div className="flex flex-col">
                <span className="text-[0.55rem] font-mono font-bold text-gray-400 uppercase tracking-[0.3em]">System Integrity</span>
                <span className="text-[0.5rem] font-mono text-voro-secondary uppercase tracking-[0.1em] opacity-80 mt-0.5 animate-pulse">Matrix Nominal</span>
             </div>
           )}
        </div>

        {(!collapsed || isMobile) && (
          <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
             <p className="text-[0.55rem] font-mono font-bold text-gray-800 tracking-[0.5em] uppercase hover:text-white transition-colors duration-700 cursor-default">
                MMXXVI · VORO
             </p>
             <ShieldCheck size={12} className="text-voro-primary opacity-30 hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
