import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import LineChartComponent from '@/components/LineChartComponent';
import BarChartComponent from '@/components/BarChartComponent';
import { useStorage } from '@/hooks/useStorage';
import { useApp } from '@/hooks/useAppContext';

const Statistics = () => {
  const { getStorage } = useStorage();
  const { user } = useApp();
  const [period, setPeriod] = useState('30D');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    document.title = 'VORO | Statistics';
    loadStats();
  }, [period]);

  const loadStats = () => {
    const nutritionLog = getStorage('voro_nutrition_log') || {};
    const workoutLog = getStorage('voro_workout_log') || {};
    const metrics = getStorage('voro_body_metrics') || {};

    const getPeriodDays = () => {
      switch (period) {
        case '7D': return 7;
        case '30D': return 30;
        case '90D': return 90;
        case '1Y': return 365;
        default: return 30;
      }
    };

    const days = getPeriodDays();
    let calorieTrend = [];
    let workoutDays = 0;
    let totalVolume = 0;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const kcal = nutritionLog[dateStr]?.totals?.calories || 0;
      calorieTrend.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        calories: kcal,
      });

      if (workoutLog[dateStr]?.attended) {
        workoutDays++;
        totalVolume += workoutLog[dateStr]?.volume || 0;
      }
    }

    setStats({
      calorieTrend,
      workoutDays,
      totalVolume,
      avgCalories: Math.round(calorieTrend.reduce((sum, day) => sum + day.calories, 0) / calorieTrend.length),
    });
  };

  if (!stats) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Statistics</h1>

        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          {['7D', '30D', '90D', '1Y'].map(p => (
            <Button
              key={p}
              variant={period === p ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {p}
            </Button>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Workouts</div>
            <div className="text-3xl font-bold text-voro-primary">{stats.workoutDays}</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Avg Calories</div>
            <div className="text-3xl font-bold text-voro-secondary">{stats.avgCalories}</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Total Volume</div>
            <div className="text-3xl font-bold text-voro-accent">{Math.round(stats.totalVolume / 1000)}k kg</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Adherence</div>
            <div className="text-3xl font-bold text-green-500">92%</div>
          </Card>
        </div>

        {/* Calorie Trend */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Calorie Trend</h3>
          <LineChartComponent
            data={stats.calorieTrend}
            dataKey="calories"
            name="Calories"
            color="#7C3AED"
            height={300}
          />
        </Card>

        {/* Weekly Workouts */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Workouts</h3>
          <BarChartComponent
            data={[
              { day: 'Mon', workouts: 1 },
              { day: 'Tue', workouts: 0 },
              { day: 'Wed', workouts: 1 },
              { day: 'Thu', workouts: 1 },
              { day: 'Fri', workouts: 1 },
              { day: 'Sat', workouts: 0 },
              { day: 'Sun', workouts: 1 },
            ]}
            dataKey="workouts"
            name="Workouts"
            color="#7C3AED"
            height={300}
          />
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
