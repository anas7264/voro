import React, { useRef, memo } from 'react';
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
 * ⚡ REFINEMENT: Luxury Kinetic Nav Node.
 * Features magnetic proximity tracking, telemetry reveal, and glassmorphic depth.
 * Implements 'Surgical Reactivity' via direct DOM manipulation for 60fps performance.
 */
const NavItem = memo(({ item, isActive, collapsed, isMobile, onClick }) => {
  const nodeRef = useRef(null);
  const telemetryRef = useRef(null);
  const Icon = item.icon;

  const handleMouseMove = (e) => {
    if (!nodeRef.current || (collapsed && !isMobile)) return;

    const rect = nodeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX;
    const y = e.clientY;

    const distance = Math.hypot(x - centerX, y - centerY);
    const radius = 120;

    if (distance < radius) {
      const strength = 1 - (distance / radius);
      const moveX = (x - centerX) * 0.15 * strength;
      const moveY = (y - centerY) * 0.15 * strength;

      nodeRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.02)`;
      if (telemetryRef.current) telemetryRef.current.style.opacity = (0.4 + strength * 0.6).toString();
    } else {
      nodeRef.current.style.transform = `translate3d(0, 0, 0) scale(1)`;
      if (telemetryRef.current) telemetryRef.current.style.opacity = '0';
    }
  };

  const handleMouseLeave = () => {
    if (nodeRef.current) {
      nodeRef.current.style.transform = `translate3d(0, 0, 0) scale(1)`;
    }
    if (telemetryRef.current) {
      telemetryRef.current.style.opacity = '0';
    }
  };

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      ref={nodeRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium
        transition-all duration-500 group relative overflow-hidden focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408] outline-none
        ${collapsed && !isMobile ? 'justify-center' : ''}
        ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-200'}
      `}
    >
      {/* Active Neural Aura */}
      {isActive && (
        <div className="absolute inset-0 bg-voro-primary/[0.04] backdrop-blur-md animate-fade-in" />
      )}

      {/* Liquid Light Indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-voro-primary rounded-r-full shadow-[0_0_15px_rgba(124,58,237,0.8)]" />
      )}

      {/* Industrial Telemetry Reveal */}
      <span
        ref={telemetryRef}
        className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[0.45rem] font-bold text-voro-primary tracking-widest opacity-0 pointer-events-none transition-opacity duration-300"
      >
        [0x{item.nodeId}]
      </span>

      <Icon
        size={18}
        className={`
          flex-shrink-0 transition-all duration-500 relative z-10
          ${isActive ? 'text-voro-primary scale-110' : 'group-hover:scale-110 group-hover:text-white'}
        `}
      />

      {(!collapsed || isMobile) && (
        <span className={`
          tracking-tight relative z-10 font-medium transition-all duration-500
          ${isActive ? 'translate-x-1 opacity-100 font-bold' : 'opacity-60 group-hover:opacity-100 group-hover:translate-x-1'}
        `}>
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
             <div className="w-1 h-1 rounded-full bg-voro-primary animate-pulse" />
             {item.label}
          </div>
        </div>
      )}
    </NavLink>
  );
});

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
