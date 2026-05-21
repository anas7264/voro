import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Utensils, Dumbbell, Activity, BarChart3,
  Trophy, Bot, Calculator, BookOpen, User, Settings,
  ChevronLeft, ChevronRight, Flame, Droplets, Target,
  Calendar, ClipboardList, ShoppingCart, FileText, Zap,
  TrendingUp, Camera, Heart, Star, Clock, BookMarked,
  Layers, Coffee
} from 'lucide-react';

const navSections = [
  {
    label: 'Overview',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    label: 'Nutrition',
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
    label: 'Training',
    items: [
      { path: '/workout/log', label: 'Workout Log', icon: Dumbbell },
      { path: '/workout/history', label: 'History', icon: ClipboardList },
      { path: '/workout/library', label: 'Exercises', icon: BookOpen },
      { path: '/workout/plan', label: 'Training Plan', icon: Target },
    ]
  },
  {
    label: 'Body',
    items: [
      { path: '/body/metrics', label: 'Body Metrics', icon: Activity },
      { path: '/body/composition', label: 'Composition', icon: TrendingUp },
      { path: '/body/photos', label: 'Progress Photos', icon: Camera },
      { path: '/body/vitals', label: 'Vitals', icon: Heart },
      { path: '/body/pr-records', label: 'PR Records', icon: Star },
    ]
  },
  {
    label: 'Analytics',
    items: [
      { path: '/analytics/dashboard', label: 'Statistics', icon: BarChart3 },
      { path: '/analytics/performance', label: 'Performance', icon: Zap },
      { path: '/analytics/reports', label: 'Reports', icon: FileText },
    ]
  },
  {
    label: 'Gamification',
    items: [
      { path: '/gamification/challenges', label: 'Challenges', icon: Target },
      { path: '/gamification/achievements', label: 'Achievements', icon: Trophy },
      { path: '/gamification/streak', label: 'Daily Streak', icon: Flame },
      { path: '/gamification/habits', label: 'Habits', icon: Clock },
    ]
  },
  {
    label: 'Tools',
    items: [
      { path: '/ai-coach', label: 'AI Coach', icon: Bot },
      { path: '/calculators', label: 'Calculators', icon: Calculator },
      { path: '/education', label: 'Education', icon: BookOpen },
    ]
  },
  {
    label: 'Account',
    items: [
      { path: '/profile', label: 'Profile', icon: User },
      { path: '/settings', label: 'Settings', icon: Settings },
    ]
  },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full z-40 flex flex-col
        bg-[#0D1424] border-r border-[#1E2D45]
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 px-3 border-b border-[#1E2D45] flex-shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-900/50">
              <span className="text-white font-black text-sm">V</span>
            </div>
            <span className="text-white font-black text-xl tracking-tight">VORO</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/50">
            <span className="text-white font-black text-sm">V</span>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-white/5 flex-shrink-0"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Expand toggle when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mt-3 mx-auto text-gray-500 hover:text-white transition-colors p-1.5 rounded hover:bg-white/5 flex-shrink-0"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 
        [&::-webkit-scrollbar]:w-1 
        [&::-webkit-scrollbar-track]:bg-transparent 
        [&::-webkit-scrollbar-thumb]:bg-white/10 
        [&::-webkit-scrollbar-thumb]:rounded-full">
        {navSections.map((section) => (
          <div key={section.label} className="mb-3">
            {!collapsed && (
              <div className="px-2 mb-1 mt-1">
                <span className="text-[9px] font-bold text-gray-600 tracking-widest uppercase">
                  {section.label}
                </span>
              </div>
            )}
            {collapsed && <div className="my-2 mx-2 border-t border-[#1E2D45]" />}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/'));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={`
                    flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium
                    transition-all duration-150 group relative mb-0.5
                    ${collapsed ? 'justify-center' : ''}
                    ${isActive
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }
                  `}
                >
                  <Icon
                    size={16}
                    className={`flex-shrink-0 transition-colors ${isActive ? 'text-violet-400' : 'group-hover:text-white'}`}
                  />
                  {!collapsed && (
                    <span className="truncate leading-none">{item.label}</span>
                  )}
                  {/* Tooltip when collapsed */}
                  {collapsed && (
                    <div className="
                      absolute left-full ml-3 px-2.5 py-1.5 
                      bg-[#1A2438] text-white text-xs rounded-md shadow-xl 
                      opacity-0 group-hover:opacity-100 pointer-events-none 
                      whitespace-nowrap z-50 border border-[#2A3A52]
                      transition-opacity duration-150
                    ">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom info */}
      {!collapsed && (
        <div className="p-3 border-t border-[#1E2D45] flex-shrink-0">
          <div className="text-[9px] text-gray-600 text-center tracking-widest uppercase">
            VORO v1.0 · Your Fitness OS
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
