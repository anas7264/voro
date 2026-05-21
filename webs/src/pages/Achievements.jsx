import React, { useEffect, useState } from 'react';
import { Lock, Trophy } from 'lucide-react';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import { achievements } from '@/data/achievements';
import { useStorage } from '@/hooks/useStorage';

const Achievements = () => {
  const { getStorage } = useStorage();
  const [earned, setEarned] = useState([]);
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);

  useEffect(() => {
    document.title = 'VORO | Achievements';
    const gamification = getStorage('voro_gamification') || {};
    setEarned(gamification.achievements || []);
    setLevel(gamification.level || 1);
    setXP(gamification.xp || 0);
  }, []);

  const earnedIds = new Set(earned);

  const rarityColors = {
    common: 'bg-gray-600',
    uncommon: 'bg-green-600',
    rare: 'bg-blue-600',
    epic: 'bg-purple-600',
    legendary: 'bg-yellow-600',
  };

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Achievements</h1>

        {/* Level & XP */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-voro-primary to-voro-secondary">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white opacity-80 mb-2">LEVEL</div>
              <div className="text-5xl font-bold text-white">{level}</div>
            </div>
            <Trophy size={64} className="text-yellow-300" />
            <div className="text-right">
              <div className="text-sm text-white opacity-80 mb-2">XP</div>
              <div className="text-3xl font-bold text-white">{xp}</div>
              <div className="text-xs text-white opacity-60 mt-1">to next level</div>
            </div>
          </div>
        </Card>

        {/* Achievement Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {achievements.map(achievement => {
            const isEarned = earnedIds.has(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  isEarned
                    ? `${rarityColors[achievement.rarity]} opacity-100`
                    : 'bg-gray-700 bg-opacity-30 border-gray-600 opacity-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="text-xs font-semibold text-white mb-1">{achievement.name}</div>
                  <div className="text-xs text-gray-300 text-opacity-70">{achievement.description}</div>
                  {!isEarned && (
                    <Lock size={16} className="mx-auto mt-2 text-gray-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Unlocked</div>
            <div className="text-3xl font-bold text-voro-primary">{earned.length}</div>
            <div className="text-xs text-gray-500">of {achievements.length}</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Completion</div>
            <div className="text-3xl font-bold text-voro-secondary">{Math.round((earned.length / achievements.length) * 100)}%</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Current Streak</div>
            <div className="text-3xl font-bold text-voro-accent">7 🔥</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
