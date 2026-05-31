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
        bg-[#020408] border-r border-white/5
        transition-all duration-500 ease-in-out
        ${collapsed ? 'w-20' : 'w-72'}
      `}
    >
      {/* Logo Area */}
      <div className={`flex items-center h-24 px-6 mb-8 flex-shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-500">
               <span className="text-black font-serif italic font-black text-xl -rotate-45">V</span>
            </div>
            <span className="text-white font-serif italic font-black text-2xl tracking-tighter">Voro</span>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-white flex items-center justify-center rotate-45">
            <span className="text-black font-serif italic font-black text-xl -rotate-45">V</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-4 space-y-8
        [&::-webkit-scrollbar]:w-0.5
        [&::-webkit-scrollbar-track]:bg-transparent 
        [&::-webkit-scrollbar-thumb]:bg-white/5
        [&::-webkit-scrollbar-thumb]:rounded-full">
        {navSections.map((section) => (
          <div key={section.label} className="space-y-2">
            {!collapsed && (
              <div className="px-4 mb-4">
                <span className="text-[10px] font-mono font-bold text-gray-700 tracking-[0.4em] uppercase">
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
                    title={collapsed ? item.label : undefined}
                    className={`
                      flex items-center gap-4 px-4 py-3 rounded-sm text-xs font-mono tracking-tight
                      transition-all duration-300 group relative
                      ${collapsed ? 'justify-center' : ''}
                      ${isActive
                        ? 'text-white bg-white/5 border-l-2 border-voro-primary'
                        : 'text-gray-500 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                      }
                    `}
                  >
                    <Icon
                      size={16}
                      strokeWidth={isActive ? 2.5 : 1.5}
                      className={`flex-shrink-0 transition-all duration-300 ${isActive ? 'text-voro-primary scale-110' : 'group-hover:text-white group-hover:scale-110'}`}
                    />
                    {!collapsed && (
                      <span className="truncate uppercase tracking-widest">{item.label}</span>
                    )}
                    {/* Premium Tooltip */}
                    {collapsed && (
                      <div className="
                        absolute left-full ml-6 px-4 py-3
                        bg-black text-white text-[10px] font-black uppercase tracking-[0.2em]
                        opacity-0 group-hover:opacity-100 pointer-events-none
                        whitespace-nowrap z-50 border border-white/10 shadow-2xl
                        transition-all duration-300 transform translate-x-2 group-hover:translate-x-0
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

      {/* Footer Toggle */}
      <div className="p-6 border-t border-white/5 flex items-center justify-between">
        {!collapsed && (
           <div className="text-[8px] font-mono text-gray-700 tracking-[0.3em] uppercase">
             OS v1.0 // Matrix
           </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 mx-auto lg:mx-0"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
