import React, { useEffect, useState, useMemo } from 'react';
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

  useEffect(() => {
    document.title = 'VORO | Biometric Composition';
  }, []);

  const metrics = getItem('body_metrics') || { weights: [], bodyFat: [] };

  const compositionHistory = useMemo(() => {
    if (!metrics.weights.length || !metrics.bodyFat.length) return [];

    // Pre-calculate timestamps to avoid Date object churn
    const weightsWithTs = metrics.weights
      .map(w => ({ ...w, ts: new Date(w.date).getTime() }))
      .sort((a, b) => a.ts - b.ts);

    const bfWithTs = metrics.bodyFat
      .map(b => ({ ...b, ts: new Date(b.date).getTime() }))
      .sort((a, b) => a.ts - b.ts);

    let bfIdx = 0;

    return weightsWithTs.map(w => {
      // Find closest body fat entry using two-pointer approach (O(N+M))
      while (bfIdx < bfWithTs.length - 1 &&
             Math.abs(bfWithTs[bfIdx + 1].ts - w.ts) <= Math.abs(bfWithTs[bfIdx].ts - w.ts)) {
        bfIdx++;
      }

      const closestBF = bfWithTs[bfIdx];
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
    }).slice(-20);
  }, [metrics]);

  const latest = compositionHistory.length > 0 ? compositionHistory[compositionHistory.length - 1] : null;

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
