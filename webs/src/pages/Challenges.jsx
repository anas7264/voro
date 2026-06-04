import React, { useEffect, useState, useMemo } from 'react';
import { Activity } from 'lucide-react';
import { ChallengeCard } from '@/components/ChallengeCard';
import Tabs from '@/components/Tabs';
import { challenges } from '@/data/challenges';
import { useStorage } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * ⚡ REFINEMENT: Challenges page redesigned as a "Strategic Objective Matrix".
 * Features a high-end tabbed interface, luxury spatial architecture,
 * and ambient background depth.
 */
const Challenges = () => {
  const { getStorage, setStorage } = useStorage();
  const { addNotification } = useNotifications();
  const [completed, setCompleted] = useState({});
  const [activeTab, setActiveTab] = useState('daily');

  useEffect(() => {
    document.title = 'VORO | Strategic Objectives';
    const gamification = getStorage('voro_gamification') || {};
    setCompleted(gamification.completedChallenges || {});
  }, []);

  const handleClaimReward = (challenge) => {
    const updated = { ...completed, [challenge.id]: true };
    setCompleted(updated);
    const gamification = getStorage('voro_gamification') || {};
    setStorage('voro_gamification', {
      ...gamification,
      completedChallenges: updated,
      xp: (gamification.xp || 0) + challenge.xpReward
    });
    addNotification(`${challenge.name} Manifested. +${challenge.xpReward} XP Synthesized.`, 'success');
  };

  const dailyChallenges = useMemo(() =>
    challenges.filter(c => c.category === 'Daily'), []);

  const weeklyChallenges = useMemo(() =>
    challenges.filter(c => c.category === 'Weekly'), []);

  const monthlyChallenges = useMemo(() =>
    challenges.filter(c => c.category === 'Monthly'), []);

  const tabList = [
    {
      id: 'daily',
      label: 'Daily Cycles',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          {dailyChallenges.map(c => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              completed={completed[c.id]}
              onClaim={() => handleClaimReward(c)}
              progress={completed[c.id] ? 100 : c.progress}
            />
          ))}
        </div>
      )
    },
    {
      id: 'weekly',
      label: 'Weekly Rhythms',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          {weeklyChallenges.map(c => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              completed={completed[c.id]}
              onClaim={() => handleClaimReward(c)}
              progress={completed[c.id] ? 100 : c.progress}
            />
          ))}
        </div>
      )
    },
    {
      id: 'monthly',
      label: 'Monthly Evolution',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          {monthlyChallenges.map(c => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              completed={completed[c.id]}
              onClaim={() => handleClaimReward(c)}
              progress={completed[c.id] ? 100 : c.progress}
            />
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] pb-24 relative overflow-hidden">
      {/* Ambient Background Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-voro-primary">
              <Activity size={18} />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.3em]">Operational Objectives</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif italic font-medium tracking-tight text-white leading-tight">
              Strategic <span className="text-voro-primary not-italic font-bold">Matrix</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-widest text-[0.65rem] uppercase opacity-60">
              High-precision challenges to accelerate your biological evolution
            </p>
          </div>

          <div className="flex gap-4">
             <div className="px-8 py-4 bg-[#0A0C14] border border-white/5 rounded-2xl shadow-xl flex items-center gap-6">
                <div className="text-right border-r border-white/5 pr-6">
                  <p className="text-[0.55rem] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">Success Rate</p>
                  <p className="text-xl font-mono font-bold text-white">{Math.round((Object.keys(completed).length / challenges.length) * 100)}%</p>
                </div>
                <div className="text-right">
                  <p className="text-[0.55rem] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">Manifested</p>
                  <p className="text-xl font-mono font-bold text-voro-primary">{Object.keys(completed).length}<span className="text-gray-700 mx-1">/</span>{challenges.length}</p>
                </div>
             </div>
          </div>
        </header>

        <Tabs
          tabs={tabList}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default Challenges;
