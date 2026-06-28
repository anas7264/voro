import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Utensils, Dumbbell, Activity, BarChart3,
  Trophy, Bot, Calculator, BookOpen, User, Settings,
  ChevronLeft, ChevronRight, Flame, Droplets, Target,
  ClipboardList, ShoppingCart, FileText, Zap,
  TrendingUp, Camera, Heart, Star, Clock, BookMarked,
  Layers, Coffee, X, Calendar, ShieldCheck
} from 'lucide-react';

const navSections = [
  {
    label: 'Core Systems',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    label: 'Metabolic Matrix',
    items: [
      { path: '/nutrition/diary', label: 'Food Diary', icon: Utensils },
      { path: '/nutrition/planner', label: 'Meal Planner', icon: Calendar },
      { path: '/nutrition/library', label: 'Food Library', icon: BookMarked },
      { path: '/nutrition/recipes', label: 'Recipes', icon: Coffee },
      { path: '/nutrition/shopping-list', label: 'Shopping List', icon: ShoppingCart },
      { path: '/nutrition/tracker', label: 'Nutrients', icon: Layers },
    ]
  },
  {
    label: 'Kinetic Logic',
    items: [
      { path: '/workout/log', label: 'Workout Log', icon: Dumbbell },
      { path: '/workout/history', label: 'History', icon: ClipboardList },
      { path: '/workout/library', label: 'Exercises', icon: BookOpen },
      { path: '/workout/plan', label: 'Training Plan', icon: Target },
    ]
  },
  {
    label: 'Biometric Archive',
    items: [
      { path: '/body/metrics', label: 'Body Metrics', icon: Activity },
      { path: '/body/composition', label: 'Composition', icon: TrendingUp },
      { path: '/body/photos', label: 'Progress Photos', icon: Camera },
      { path: '/body/vitals', label: 'Vitals', icon: Heart },
      { path: '/body/pr-records', label: 'PR Records', icon: Star },
    ]
  },
  {
    label: 'Neural Intelligence',
    items: [
      { path: '/ai-coach', label: 'AI Coach', icon: Bot },
      { path: '/analytics/dashboard', label: 'Statistics', icon: BarChart3 },
      { path: '/analytics/performance', label: 'Performance', icon: Zap },
      { path: '/analytics/reports', label: 'Reports', icon: FileText },
    ]
  },
  {
    label: 'Optimization',
    items: [
      { path: '/gamification/challenges', label: 'Challenges', icon: Target },
      { path: '/gamification/achievements', label: 'Achievements', icon: Trophy },
      { path: '/gamification/streak', label: 'Daily Streak', icon: Flame },
      { path: '/gamification/habits', label: 'Habits', icon: Clock },
    ]
  },
  {
    label: 'Configuration',
    items: [
      { path: '/profile', label: 'Profile', icon: User },
      { path: '/settings', label: 'Settings', icon: Settings },
    ]
  },
];

const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const location = useLocation();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full z-[60] flex flex-col
        bg-[#020408] border-r border-voro-border shadow-2xl
        transition-all duration-700 ease-expo-out
        ${collapsed && !isMobile ? 'w-24' : 'w-80'}
        ${isMobile && collapsed ? '-translate-x-full' : 'translate-x-0'}
      `}
    >
      {/* Editorial Logo Section */}
      <div className={`
        flex items-center h-28 px-10 flex-shrink-0 relative
        ${collapsed && !isMobile ? 'justify-center' : 'justify-between'}
        border-b border-voro-border bg-white/[0.01]
      `}>
        <div className="flex items-center gap-5 group cursor-pointer">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-voro-primary flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(124,58,237,0.3)] group-hover:shadow-[0_0_50px_rgba(124,58,237,0.5)] transition-all duration-700 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <span className="text-white font-serif italic font-bold text-2xl relative z-10">V</span>
            </div>
            <div className="absolute -inset-1 bg-voro-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          {(!collapsed || isMobile) && (
            <div className="flex flex-col">
              <span className="text-white font-serif italic font-medium text-2xl tracking-tighter leading-none">Voro</span>
              <span className="text-[0.55rem] font-mono text-voro-primary uppercase tracking-[0.4em] mt-1 opacity-80">Evolution OS</span>
            </div>
          )}
        </div>

        {isMobile && !collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="text-gray-600 hover:text-white transition-colors p-2.5 rounded-2xl bg-white/[0.02] border border-white/5 focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408] outline-none"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation Matrix */}
      <nav className="flex-1 overflow-y-auto py-12 px-8 space-y-12 no-scrollbar">
        {navSections.map((section) => (
          <div key={section.label} className="space-y-4">
            {(!collapsed || isMobile) && (
              <div className="px-4 flex items-center gap-4">
                <span className="text-[0.55rem] font-mono font-medium text-gray-700 uppercase tracking-[0.5em] whitespace-nowrap">
                  {section.label}
                </span>
                <div className="h-[1px] w-full bg-white/[0.03]" />
              </div>
            )}

            <div className="space-y-1.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/'));
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => isMobile && setCollapsed(true)}
                    className={`
                      flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium
                      transition-all duration-500 group relative overflow-hidden focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408] outline-none
                      ${collapsed && !isMobile ? 'justify-center' : ''}
                      ${isActive
                        ? 'text-white'
                        : 'text-gray-500 hover:text-gray-200'
                      }
                    `}
                  >
                    {/* Active Glassmorphism Layer */}
                    {isActive && (
                      <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-md animate-fade-in" />
                    )}

                    {/* Liquid Light Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-voro-primary rounded-r-full shadow-[0_0_15px_rgba(124,58,237,0.8)]" />
                    )}

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
                        {item.label}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Boutique Footer */}
      <div className="p-8 border-t border-white/[0.03] bg-black/20">
        <div className={`flex items-center gap-4 ${collapsed && !isMobile ? 'justify-center' : ''}`}>
           <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-voro-secondary animate-pulse" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-voro-secondary animate-ping opacity-40" />
           </div>
           {(!collapsed || isMobile) && (
             <div className="flex flex-col">
                <span className="text-[0.55rem] font-mono font-bold text-gray-400 uppercase tracking-[0.2em]">System Status</span>
                <span className="text-[0.5rem] font-mono text-voro-secondary uppercase tracking-[0.1em] opacity-80 mt-0.5">Matrix Active</span>
             </div>
           )}
        </div>

        {(!collapsed || isMobile) && (
          <div className="mt-6 flex items-center justify-between">
             <p className="text-[0.55rem] font-mono font-medium text-gray-700 tracking-[0.4em] uppercase">
                MMXXVI · VORO
             </p>
             <ShieldCheck size={12} className="text-gray-800" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
