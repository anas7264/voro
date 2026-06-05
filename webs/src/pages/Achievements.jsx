import React, { useEffect, useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { AchievementCard } from '@/components/AchievementCard';
import { achievements } from '@/data/achievements';
import { useStorage } from '@/hooks/useStorage';

const Achievements = () => {
  const { storageData } = useStorage();

  useEffect(() => {
    document.title = 'VORO | Achievement Matrix';
  }, []);

  // Synchronous data derivation from StorageContext
  const { earned, level, xp } = useMemo(() => {
    const gamification = storageData['gamification'] || {};
    return {
      earned: gamification.achievements || [],
      level: gamification.level || 1,
      xp: gamification.totalXP || 0 // Corrected to use totalXP from useGamification hook
    };
  }, [storageData]);

  const earnedIds = useMemo(() => new Set(earned), [earned]);

  const categories = useMemo(() => {
    return [...new Set(achievements.map(a => a.category))];
  }, []);

  const xpToNextLevel = useMemo(() => {
    const currentLevelXP = level * 1000; // Simplified logic for UI
    return currentLevelXP - (xp % currentLevelXP);
  }, [level, xp]);

  const progressPercentage = useMemo(() => {
    const currentLevelXP = level * 1000;
    return ((xp % currentLevelXP) / currentLevelXP) * 100;
  }, [level, xp]);

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24">
      {/* Ambient Background Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-voro-primary">
              <Trophy size={18} />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.3em]">Evolution Milestones</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif italic font-medium tracking-tight text-white leading-tight">
              Artifact <span className="text-voro-primary not-italic font-bold">Matrix</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-widest text-[0.65rem] uppercase opacity-60">
              Documenting the kinetics of your biological ascension
            </p>
          </div>

          <div className="flex gap-4">
             <div className="px-8 py-4 bg-[#0A0C14] border border-white/5 rounded-2xl shadow-xl flex items-center gap-6">
                <div className="text-right border-r border-white/5 pr-6">
                  <p className="text-[0.55rem] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">Completion</p>
                  <p className="text-xl font-mono font-bold text-white">{Math.round((earned.length / achievements.length) * 100)}%</p>
                </div>
                <div className="text-right">
                  <p className="text-[0.55rem] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">Unlocked</p>
                  <p className="text-xl font-mono font-bold text-voro-primary">{earned.length}<span className="text-gray-700 mx-1">/</span>{achievements.length}</p>
                </div>
             </div>
          </div>
        </header>

        {/* Luminous Biometric Node: Level & XP */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-[#0A0C14] border border-white/5 p-8 md:p-12 mb-20 shadow-2xl shadow-black/40 group/hero">
          <div className="absolute top-0 right-0 w-96 h-96 bg-voro-primary/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover/hero:bg-voro-primary/15 transition-colors duration-1000" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5 pb-8 lg:pb-0 lg:pr-12">
              <div className="relative">
                <div className="w-40 h-40 rounded-full border border-white/5 flex items-center justify-center bg-black/40 backdrop-blur-xl shadow-[0_0_50px_rgba(124,58,237,0.2)]">
                  <div className="text-center">
                    <p className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Level</p>
                    <p className="text-7xl font-serif italic font-bold text-white leading-none">{level}</p>
                  </div>
                </div>
                {/* Orbital Decoration */}
                <div className="absolute inset-[-10px] rounded-full border-2 border-dashed border-voro-primary/20 animate-[spin_20s_linear_infinite]" />
              </div>
            </div>

            <div className="lg:col-span-8 space-y-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Ascension Progress</h3>
                  <div className="flex items-baseline gap-4">
                    <span className="text-6xl font-serif italic font-medium tracking-tighter text-white">
                      {xp.toLocaleString()}
                    </span>
                    <span className="text-lg font-medium text-gray-500 tracking-tight">/ {(level * 1000).toLocaleString()} XP</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[0.65rem] font-black text-voro-secondary uppercase tracking-[0.2em] mb-1">Synthesis Required</p>
                  <p className="text-xl font-serif italic font-bold text-white">{xpToNextLevel.toLocaleString()} <span className="text-[0.6rem] not-italic font-sans font-black text-gray-600 uppercase ml-1 tracking-widest">XP</span></p>
                </div>
              </div>

              <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                <div
                  className="absolute inset-y-1 left-1 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full bg-gradient-to-r from-voro-primary to-voro-accent shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                  style={{ width: `calc(${progressPercentage}% - 8px)` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categorized Matrix Display */}
        <div className="space-y-24">
          {categories.map(category => (
            <section key={category} className="space-y-10">
              <div className="items-center gap-6 hidden md:flex">
                <h2 className="text-[0.7rem] font-black uppercase tracking-[0.5em] text-gray-500 whitespace-nowrap">
                  {category}
                </h2>
                <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {achievements
                  .filter(a => a.category === category)
                  .map(achievement => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      unlocked={earnedIds.has(achievement.id)}
                    />
                  ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
