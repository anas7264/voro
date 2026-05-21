import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Scale, Activity } from 'lucide-react';
import Card from '@/components/Card';
import AreaChartComponent from '@/components/AreaChartComponent';
import Badge from '@/components/Badge';
import { useStorage } from '@/hooks/useStorage';
import { useApp } from '@/hooks/useAppContext';
import { bodyFatStandards } from '@/data/bodyFatStandards';

const BodyComposition = () => {
  const { getItem } = useStorage();
  const { user } = useApp();
  const [compositionHistory, setCompositionHistory] = useState([]);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    document.title = 'VORO | Body Composition';
    loadData();
  }, []);

  const loadData = () => {
    const metrics = getItem('voro_body_metrics') || { weights: [], bodyFat: [] };

    // Build composition history by aligning weight + body fat entries
    const combined = metrics.weights
      .map((w) => {
        const closestBF = metrics.bodyFat.reduce((prev, curr) =>
          Math.abs(new Date(curr.date) - new Date(w.date)) <
          Math.abs(new Date(prev.date) - new Date(w.date)) ? curr : prev,
          metrics.bodyFat[0]
        );

        if (!closestBF) return null;
        const bfPct = closestBF.value;
        const fatMass = parseFloat((w.value * bfPct / 100).toFixed(1));
        const leanMass = parseFloat((w.value - fatMass).toFixed(1));

        return {
          date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          leanMass,
          fatMass,
          bodyFat: bfPct,
          weight: w.value,
        };
      })
      .filter(Boolean);

    setCompositionHistory(combined.slice(-20));

    if (combined.length > 0) {
      setLatest(combined[combined.length - 1]);
    }
  };

  // Determine body fat category
  const getBFCategory = (bfPct, gender = 'Male') => {
    if (!bfPct) return { label: 'Unknown', color: 'gray' };
    if (gender === 'Male') {
      if (bfPct < 6) return { label: 'Essential Fat', color: 'info' };
      if (bfPct < 14) return { label: 'Athletic', color: 'success' };
      if (bfPct < 18) return { label: 'Fitness', color: 'success' };
      if (bfPct < 25) return { label: 'Acceptable', color: 'warning' };
      return { label: 'Obese', color: 'danger' };
    } else {
      if (bfPct < 14) return { label: 'Essential Fat', color: 'info' };
      if (bfPct < 21) return { label: 'Athletic', color: 'success' };
      if (bfPct < 25) return { label: 'Fitness', color: 'success' };
      if (bfPct < 32) return { label: 'Acceptable', color: 'warning' };
      return { label: 'Obese', color: 'danger' };
    }
  };

  const bfCategory = latest ? getBFCategory(latest.bodyFat, user?.gender) : null;

  const trend = compositionHistory.length >= 2
    ? compositionHistory[compositionHistory.length - 1].bodyFat - compositionHistory[0].bodyFat
    : 0;

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Body Composition</h1>
        <p className="text-gray-400 mb-8">Track lean mass vs fat mass over time</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Lean Mass</div>
            <div className="text-3xl font-bold text-violet-400">
              {latest?.leanMass ?? '—'} <span className="text-lg">kg</span>
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Fat Mass</div>
            <div className="text-3xl font-bold text-amber-400">
              {latest?.fatMass ?? '—'} <span className="text-lg">kg</span>
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Body Fat %</div>
            <div className="text-3xl font-bold text-emerald-400">
              {latest?.bodyFat?.toFixed(1) ?? '—'}<span className="text-lg">%</span>
            </div>
            {bfCategory && <Badge color={bfCategory.color} className="mt-2 text-xs">{bfCategory.label}</Badge>}
          </Card>
          <Card className="p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">BF% Trend</div>
            <div className={`text-3xl font-bold flex items-center justify-center gap-1 ${trend <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend <= 0 ? <TrendingDown size={24} /> : <TrendingUp size={24} />}
              {Math.abs(trend).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">all time</div>
          </Card>
        </div>

        {compositionHistory.length > 1 ? (
          <>
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity size={20} className="text-violet-400" />
                Composition Trend
              </h3>
              <AreaChartComponent
                data={compositionHistory}
                dataKeys={[
                  { key: 'leanMass', name: 'Lean Mass (kg)', color: '#7C3AED' },
                  { key: 'fatMass', name: 'Fat Mass (kg)', color: '#F59E0B' },
                ]}
                height={320}
              />
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Scale size={20} className="text-emerald-400" />
                Body Fat % Over Time
              </h3>
              <AreaChartComponent
                data={compositionHistory}
                dataKey="bodyFat"
                name="Body Fat %"
                color="#10B981"
                height={250}
              />
            </Card>
          </>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">No composition data yet</h3>
            <p className="text-gray-400">Log your weight and body fat percentage in Body Metrics to see your composition analysis here.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BodyComposition;
