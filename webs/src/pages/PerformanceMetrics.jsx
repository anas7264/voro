import React, { useEffect, useMemo } from 'react';
import { Zap, TrendingUp, Activity, Award } from 'lucide-react';
import { Card, Button, LineChartComponent, Stat } from '@/components';
import { useStorageKey } from '@/hooks/useStorage';
import { useCalculators } from '@/hooks/useCalculators';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted fallback data.
 * Ensures referential stability and prevents redundant object instantiation.
 */
const DEFAULT_PERFORMANCE = {
  avgVolume: 18500,
  maxBench: 140,
  maxSquat: 180,
  maxDeadlift: 200,
  bodyweight: 80,
};

const PerformanceMetrics = () => {
  /**
   * ⚡ OPTIMIZATION: Surgical Reactivity.
   * Subscribe only to 'voro_performance' data to prevent redundant re-renders
   * when unrelated storage keys change.
   */
  const performanceData = useStorageKey('voro_performance');
  const { calculateTDEE } = useCalculators();

  useEffect(() => {
    document.title = 'VORO | Performance Metrics';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Synchronous data derivation using useMemo.
   * Eliminates the initial mount-time double-render cycle and ensures
   * reactivity to StorageContext updates without manual load calls.
   */
  const metrics = useMemo(() => {
    return performanceData || DEFAULT_PERFORMANCE;
  }, [performanceData]);

  const strengthMetrics = useMemo(() => [
    { lift: 'Bench Press', max: metrics.maxBench, unit: 'kg', color: 'voro-primary' },
    { lift: 'Squat', max: metrics.maxSquat, unit: 'kg', color: 'voro-secondary' },
    { lift: 'Deadlift', max: metrics.maxDeadlift, unit: 'kg', color: 'voro-accent' },
  ], [metrics]);

  const volumeData = useMemo(() => [
    { date: 'Week 1', volume: 16000 },
    { date: 'Week 2', volume: 17200 },
    { date: 'Week 3', volume: 18100 },
    { date: 'Week 4', volume: 18500 },
  ], []);

  const wilksScore = useMemo(() =>
    Math.round((metrics.maxBench + metrics.maxSquat + metrics.maxDeadlift) / 3),
  [metrics]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30">
       {/* Background Decor */}
       <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[35%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <Award size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Absolute Performance</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif italic font-medium tracking-tight text-white leading-tight">
              Kinetic <span className="text-gradient not-italic font-bold">Capabilities</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-widest text-xs uppercase opacity-60">High-fidelity analysis of absolute force production</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {strengthMetrics.map(metric => (
            <Stat
              key={metric.lift}
              label={metric.lift}
              value={metric.max}
              unit={metric.unit}
              icon={Activity}
              color={metric.color}
            />
          ))}
          <Stat
            label="Wilks Index"
            value={wilksScore}
            icon={Zap}
            color="voro-primary"
          />
        </div>

        <Card className="p-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group mb-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-voro-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-voro-primary/10 transition-colors duration-1000" />
          <div className="relative">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em]">Volume Trajectory</h3>
              <TrendingUp size={18} className="text-voro-primary" />
            </div>
            <div className="h-[350px] w-full">
              <LineChartComponent
                data={volumeData}
                dataKey="volume"
                name="Volume (kg)"
                color="#7C3AED"
                height={350}
                strokeWidth={3}
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-xl">
            <h4 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-10">Composition Status</h4>
            <div className="space-y-8">
              <div>
                <div className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest mb-2">Current Mass</div>
                <div className="text-4xl font-serif italic font-bold text-white">{metrics.bodyweight} <span className="text-sm not-italic font-sans text-gray-600 uppercase ml-1">kg</span></div>
              </div>
              <Button className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-[0.3em] text-[0.65rem] shadow-xl shadow-white/5 transition-all hover:scale-[1.01]">
                Update Evolution
              </Button>
            </div>
          </Card>

          <Card className="p-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Zap size={80} className="text-voro-primary" />
             </div>
            <h4 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-10">Kinetic Objectives</h4>
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest">Bench Objective: 150 kg</span>
                  <span className="text-xl font-mono font-bold text-white">{((metrics.maxBench / 150) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2.5 p-0.5 border border-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-voro-primary transition-all duration-1000 shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                    style={{ width: `${(metrics.maxBench / 150) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-[0.6rem] font-black text-gray-600 uppercase tracking-[0.4em] text-center italic">Continuous Adaptation Required</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
