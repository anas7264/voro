import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useStorage } from '@/hooks/useStorage';

const DailyStreak = () => {
  const { getStorage } = useStorage();
  const [streaks, setStreaks] = useState({
    trainingDays: 15,
    nutritionLogging: 8,
    waterIntake: 12,
    sleepGoal: 6,
  });

  useEffect(() => {
    document.title = 'VORO | Daily Streak';
    const data = getStorage('voro_streaks') || {};
    setStreaks(prev => ({ ...prev, ...data }));
  }, []);

  const data = [
    { day: 'Mon', completed: 4 },
    { day: 'Tue', completed: 3 },
    { day: 'Wed', completed: 4 },
    { day: 'Thu', completed: 4 },
    { day: 'Fri', completed: 4 },
    { day: 'Sat', completed: 2 },
    { day: 'Sun', completed: 4 },
  ];

  const streakGoals = [
    { name: 'Training', current: streaks.trainingDays, icon: '🏋️', goal: 30 },
    { name: 'Nutrition Logging', current: streaks.nutritionLogging, icon: '📝', goal: 30 },
    { name: 'Water Intake', current: streaks.waterIntake, icon: '💧', goal: 30 },
    { name: 'Sleep Goal', current: streaks.sleepGoal, icon: '😴', goal: 30 },
  ];

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Daily Streak</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {streakGoals.map(streak => (
            <Card key={streak.name} className="p-6 text-center">
              <div className="text-3xl mb-2">{streak.icon}</div>
              <div className="text-sm text-gray-400 mb-1">{streak.name}</div>
              <div className="text-3xl font-bold text-voro-primary mb-2">{streak.current}</div>
              <div className="text-xs text-gray-500">
                {Math.round((streak.current / streak.goal) * 100)}% to goal
              </div>
              <div className="w-full bg-voro-border rounded-full h-1 mt-2">
                <div
                  className="h-1 rounded-full bg-voro-primary"
                  style={{ width: `${Math.min((streak.current / streak.goal) * 100, 100)}%` }}
                />
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Completion</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="completed" fill="#7C3AED" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div className="mt-6 text-center">
          <Button>Reset Streaks</Button>
        </div>
      </div>
    </div>
  );
};

export default DailyStreak;
