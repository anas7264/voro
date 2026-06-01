import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Utensils, Dumbbell, Activity, BarChart3,
  Trophy, Bot, Calculator, BookOpen, User, Settings,
  ChevronLeft, ChevronRight, Flame, Droplets, Target,
  ClipboardList, ShoppingCart, FileText, Zap,
  TrendingUp, Camera, Heart, Star, Clock, BookMarked,
  Layers, Coffee, X, Calendar
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

const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const location = useLocation();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full z-[60] flex flex-col
        bg-[#0A0C14] border-r border-white/5 shadow-2xl
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${collapsed && !isMobile ? 'w-20' : 'w-72'}
        ${isMobile && collapsed ? '-translate-x-full' : 'translate-x-0'}
      `}
    >
      <div className={`flex items-center h-24 px-6 border-b border-white/5 flex-shrink-0 ${collapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-voro-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-voro-primary/30">
            <span className="text-white font-black text-lg">V</span>
          </div>
          {(!collapsed || isMobile) && (
            <span className="text-white font-black text-2xl tracking-[0.2em]">VORO</span>
          )}
        </div>

        {isMobile && !collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-8 no-scrollbar">
        {navSections.map((section) => (
          <div key={section.label} className="space-y-4">
            {(!collapsed || isMobile) && (
              <div className="px-4">
                <span className="text-[0.6rem] font-black text-gray-700 tracking-[0.3em] uppercase">
                  {section.label}
                </span>
              </div>
            )}

            <div className="space-y-1">
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
                      transition-all duration-300 group relative
                      ${collapsed && !isMobile ? 'justify-center' : ''}
                      ${isActive
                        ? 'bg-voro-primary text-white shadow-lg shadow-voro-primary/20'
                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon
                      size={18}
                      className={`flex-shrink-0 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                    />
                    {(!collapsed || isMobile) && (
                      <span className={`tracking-tight font-bold ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                        {item.label}
                      </span>
                    )}

                    {collapsed && !isMobile && (
                      <div className="
                        absolute left-full ml-6 px-4 py-3
                        bg-[#0A0C14] text-white text-[0.65rem] font-black uppercase tracking-widest rounded-xl shadow-2xl
                        opacity-0 group-hover:opacity-100 pointer-events-none
                        whitespace-nowrap z-[70] border border-white/10
                        transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0
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

      {(!collapsed || isMobile) && (
        <div className="p-8 border-t border-white/5 text-center">
          <p className="text-[0.55rem] font-black text-gray-700 tracking-[0.4em] uppercase">
             Matrix OS · 2026
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
