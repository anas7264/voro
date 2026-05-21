import React, { useEffect, useState } from 'react';
import { Zap, TrendingUp } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import LineChartComponent from '@/components/LineChartComponent';
import { useStorage } from '@/hooks/useStorage';
import { useCalculators } from '@/hooks/useCalculators';

const PerformanceMetrics = () => {
  const { getStorage } = useStorage();
  const { calculateTDEE } = useCalculators();
  const [metrics, setMetrics] = useState({
    avgVolume: 18500,
    maxBench: 140,
    maxSquat: 180,
    maxDeadlift: 200,
    bodyweight: 80,
  });

  useEffect(() => {
    document.title = 'VORO | Performance Metrics';
    const data = getStorage('voro_performance') || {};
    setMetrics(prev => ({ ...prev, ...data }));
  }, []);

  const strengthMetrics = [
    { lift: 'Bench Press', max: metrics.maxBench, unit: 'kg' },
    { lift: 'Squat', max: metrics.maxSquat, unit: 'kg' },
    { lift: 'Deadlift', max: metrics.maxDeadlift, unit: 'kg' },
  ];

  const data = [
    { date: 'Week 1', volume: 16000 },
    { date: 'Week 2', volume: 17200 },
    { date: 'Week 3', volume: 18100 },
    { date: 'Week 4', volume: 18500 },
  ];

  const wilksScore = Math.round((metrics.maxBench + metrics.maxSquat + metrics.maxDeadlift) / 3);

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Performance Metrics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {strengthMetrics.map(metric => (
            <Card key={metric.lift} className="p-6 text-center">
              <div className="text-sm text-gray-400 mb-2">{metric.lift}</div>
              <div className="text-3xl font-bold text-voro-primary">{metric.max}</div>
              <div className="text-xs text-gray-500">{metric.unit}</div>
            </Card>
          ))}
          <Card className="p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Wilks Score</div>
            <div className="text-3xl font-bold text-voro-secondary">{wilksScore}</div>
            <div className="text-xs text-gray-500">Strength Index</div>
          </Card>
        </div>

        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Training Volume Trend
          </h3>
          <LineChartComponent
            data={data}
            dataKeys={[{ key: 'volume', name: 'Volume (kg)', color: '#7C3AED' }]}
            height={300}
          />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h4 className="text-lg font-bold text-white mb-3">Body Composition</h4>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-400">Current Bodyweight</div>
                <div className="text-2xl font-bold text-white">{metrics.bodyweight} kg</div>
              </div>
              <Button variant="secondary" className="w-full">Update Metrics</Button>
            </div>
          </Card>
          <Card className="p-6">
            <h4 className="text-lg font-bold text-white mb-3">
              <Zap size={20} className="inline mr-2" />
              Performance Goals
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Bench: 150 kg</span>
                <span className="text-white">{((metrics.maxBench / 150) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-voro-border rounded h-2">
                <div className="h-2 rounded bg-voro-primary" style={{ width: `${(metrics.maxBench / 150) * 100}%` }} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
