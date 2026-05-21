import React, { useEffect, useState } from 'react';
import { Target, Zap } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Progress from '@/components/Progress';
import { challenges } from '@/data/challenges';
import { useStorage } from '@/hooks/useStorage';

const Challenges = () => {
  const { getStorage, setStorage } = useStorage();
  const [daily, setDaily] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    document.title = 'VORO | Challenges';
    loadChallenges();
  }, []);

  const loadChallenges = () => {
    const gamification = getStorage('voro_gamification') || {};
    setCompleted(gamification.completedChallenges || {});

    setDaily(challenges.filter(c => c.frequency === 'daily').slice(0, 3));
    setWeekly(challenges.filter(c => c.frequency === 'weekly'));
    setMonthly(challenges.filter(c => c.frequency === 'monthly'));
  };

  const completeChallenge = (challengeId) => {
    const updated = { ...completed, [challengeId]: true };
    setCompleted(updated);
    const gamification = getStorage('voro_gamification') || {};
    setStorage('voro_gamification', { ...gamification, completedChallenges: updated });
  };

  const renderChallenges = (list, title) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Target size={20} />
        {title}
      </h3>
      <div className="space-y-3">
        {list.map(challenge => {
          const isCompleted = completed[challenge.id];
          return (
            <Card
              key={challenge.id}
              className={`p-4 border-2 transition-all ${
                isCompleted
                  ? 'border-green-600 bg-green-950 bg-opacity-30'
                  : 'border-voro-border'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    {challenge.icon} {challenge.name}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">{challenge.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Progress value={challenge.progress || 0} max={100} size="sm" />
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      +{challenge.xpReward} XP
                    </span>
                  </div>
                </div>
                {!isCompleted && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => completeChallenge(challenge.id)}
                    className="ml-4"
                  >
                    Claim
                  </Button>
                )}
                {isCompleted && (
                  <div className="ml-4 text-green-400 font-bold">✓</div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <Zap size={32} className="text-yellow-400" />
          Challenges
        </h1>

        {renderChallenges(daily, 'Daily Challenges')}
        {renderChallenges(weekly, 'Weekly Challenges')}
        {renderChallenges(monthly, 'Monthly Challenges')}
      </div>
    </div>
  );
};

export default Challenges;
