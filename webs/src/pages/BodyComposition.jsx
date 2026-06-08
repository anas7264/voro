import React, { useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Scale, Activity, Zap, Target, Heart, Info } from 'lucide-react';
import Card from '@/components/Card';
import Stat from '@/components/Stat';
import AreaChartComponent from '@/components/AreaChartComponent';
import Badge from '@/components/Badge';
import { useStorage } from '@/hooks/useStorage';
import { useApp } from '@/hooks/useAppContext';
import { bodyFatStandards, bodyFatLevelDescriptions, bodyFatHealthMetrics } from '@/data/bodyFatStandards';

const BodyComposition = () => {
  const { storageData } = useStorage();
  const { user } = useApp();

  useEffect(() => {
    document.title = 'VORO | Biometric Composition';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Synchronous data derivation using useMemo.
   */
  const metrics = useMemo(() => {
    return storageData['body_metrics'] || { weights: [], bodyFat: [] };
  }, [storageData['body_metrics']]);

  const compositionHistory = useMemo(() => {
    if (!metrics.weights?.length || !metrics.bodyFat?.length) return [];

    const weightsWithTs = [...metrics.weights]
      .map(w => ({ ...w, ts: new Date(w.date).getTime() }))
      .sort((a, b) => a.ts - b.ts);

    const bfWithTs = [...metrics.bodyFat]
      .map(b => ({ ...b, ts: new Date(b.date).getTime() }))
      .sort((a, b) => a.ts - b.ts);

    let bfIdx = 0;

    return weightsWithTs.map(w => {
      while (bfIdx < bfWithTs.length - 1 &&
             Math.abs(bfWithTs[bfIdx + 1].ts - w.ts) <= Math.abs(bfWithTs[bfIdx].ts - w.ts)) {
        bfIdx++;
      }

      const closestBF = bfWithTs[bfIdx];
      const bfPct = closestBF.value;
      const fatMass = (w.value * bfPct / 100);
      const leanMass = (w.value - fatMass);

      return {
        date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        leanMass: Number(leanMass.toFixed(2)),
        fatMass: Number(fatMass.toFixed(2)),
        bodyFat: Number(bfPct.toFixed(2)),
        weight: Number(w.value.toFixed(2)),
      };
    }).slice(-30);
  }, [metrics]);

  const latest = useMemo(() =>
    compositionHistory.length > 0 ? compositionHistory[compositionHistory.length - 1] : null
  , [compositionHistory]);

  const trend = useMemo(() => {
    if (compositionHistory.length < 2) return 0;
    return compositionHistory[compositionHistory.length - 1].bodyFat - compositionHistory[0].bodyFat;
  }, [compositionHistory]);

  // Determine body fat category using standard data
  const bfCategory = useMemo(() => {
    if (!latest || !user) return null;
    const bfPct = latest.bodyFat;
    const gender = (user.gender || 'Male').toLowerCase();
    const age = user.age || 25;

    let bracket = "18-25";
    if (age > 65) bracket = "65+";
    else if (age > 55) bracket = "56-65";
    else if (age > 45) bracket = "46-55";
    else if (age > 35) bracket = "36-45";
    else if (age > 25) bracket = "26-35";

    const standards = bodyFatStandards[gender][bracket];

    if (bfPct < standards.athletes.min) return 'essential';
    if (bfPct < standards.fit.min) return 'athletes';
    if (bfPct < standards.average.min) return 'fit';
    if (bfPct < standards.obese.min) return 'average';
    return 'obese';
  }, [latest, user]);

  const categoryDetails = bfCategory ? bodyFatLevelDescriptions[bfCategory] : null;
  const healthMetrics = bfCategory ? {
    cardio: bodyFatHealthMetrics.cardiovascularRisk[bfCategory],
    metabolic: bodyFatHealthMetrics.metabolicHealth[bfCategory],
    hormone: bodyFatHealthMetrics.hormoneBalance[bfCategory],
  } : null;

  return (
    <div className="min-h-screen bg-voro-surface text-[#F0F4FF] selection:bg-voro-primary/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <TrendingUp size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Biometric Matrix</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif italic font-medium tracking-tight text-white leading-tight">
              Biometric <span className="text-gradient not-italic font-bold">Composition</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-widest text-xs uppercase opacity-60">Architectural analysis of lean mass and adipose flux</p>
          </div>
        </header>

        {/* Luminous Biometric Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Stat
            label="Lean Mass"
            value={latest?.leanMass ?? '—'}
            unit="kg"
            icon={Zap}
            color="voro-primary"
          />
          <Stat
            label="Fat Mass"
            value={latest?.fatMass ?? '—'}
            unit="kg"
            icon={Target}
            color="voro-accent"
          />
          <Stat
            label="Adipose %"
            value={latest?.bodyFat ? latest.bodyFat.toFixed(1) : '—'}
            unit="%"
            icon={Scale}
            color="voro-secondary"
          />
          <Stat
            label="Adipose Trend"
            value={Math.abs(trend).toFixed(1)}
            unit="%"
            change={trend.toFixed(1)}
            icon={Activity}
            color={trend <= 0 ? "voro-secondary" : "voro-danger"}
          />
        </div>

        <div className="grid grid-cols-12 gap-8 mb-16">
          {/* Charts Section */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {compositionHistory.length > 1 ? (
              <>
                <Card className="p-10 bg-voro-card border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-voro-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-voro-primary/10 transition-colors duration-700" />
                  <div className="relative">
                    <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
                      <Activity size={16} className="text-voro-primary" />
                      Composition Trajectory
                    </h3>
                    <AreaChartComponent
                      data={compositionHistory}
                      dataKeys={[
                        { key: 'leanMass', name: 'Lean Mass (kg)', color: '#7C3AED' },
                        { key: 'fatMass', name: 'Fat Mass (kg)', color: '#F59E0B' },
                      ]}
                      height={400}
                    />
                  </div>
                </Card>

                <Card className="p-10 bg-voro-card border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-voro-secondary/5 rounded-full blur-[100px] -ml-32 -mb-32 group-hover:bg-voro-secondary/10 transition-colors duration-700" />
                  <div className="relative">
                    <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
                      <Scale size={16} className="text-voro-secondary" />
                      Adipose Flux (30D Window)
                    </h3>
                    <AreaChartComponent
                      data={compositionHistory}
                      dataKey="bodyFat"
                      name="Body Fat %"
                      color="#10B981"
                      height={300}
                    />
                  </div>
                </Card>
              </>
            ) : (
              <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-voro-card/30 backdrop-blur-sm">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Zap size={32} className="text-gray-700" />
                </div>
                <h3 className="text-xl font-serif italic font-bold text-white mb-2">Matrix Void</h3>
                <p className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.2em]">Log multiple biometric records in Body Metrics to initiate analysis</p>
              </div>
            )}
          </div>

          {/* Anatomical Classification Artifact */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <Card className="p-10 bg-gradient-to-br from-voro-card to-black border-voro-primary/20 relative overflow-hidden group/artifact">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-voro-primary/10 rounded-full blur-[100px] group-hover/artifact:bg-voro-primary/20 transition-colors duration-1000" />

              <div className="relative">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-voro-primary rounded-2xl shadow-lg shadow-voro-primary/30">
                    <Info size={20} className="text-white" />
                  </div>
                  <h3 className="text-[0.65rem] font-mono font-medium uppercase tracking-[0.4em] text-voro-primary">Anatomical Classification</h3>
                </div>

                {categoryDetails ? (
                  <div className="space-y-10">
                    <div>
                      <p className="text-[0.55rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Biological Tier</p>
                      <h4 className="text-4xl font-serif italic font-bold text-white tracking-tight">{categoryDetails.name}</h4>
                    </div>

                    <p className="text-lg font-serif italic text-gray-400 leading-relaxed">
                      "{categoryDetails.description}"
                    </p>

                    <div className="pt-10 border-t border-white/5 space-y-6">
                      <p className="text-[0.55rem] font-black text-gray-500 uppercase tracking-[0.3em]">Health Risk Synthesis</p>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                          <span className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest">Cardiovascular</span>
                          <span className="text-xs font-bold text-white uppercase tracking-tight">{healthMetrics.cardio}</span>
                        </div>
                        <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                          <span className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest">Metabolic</span>
                          <span className="text-xs font-bold text-white uppercase tracking-tight">{healthMetrics.metabolic}</span>
                        </div>
                        <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                          <span className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest">Hormonal</span>
                          <span className="text-xs font-bold text-white uppercase tracking-tight">{healthMetrics.hormone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 opacity-20">
                    <Heart size={48} className="mx-auto mb-4" />
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.3em]">Awaiting Profile Sync</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-10 bg-voro-card border-white/5 space-y-8 shadow-xl">
               <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em]">Biological Standards</h3>
               <div className="space-y-6">
                 <p className="text-sm font-medium text-gray-500 leading-relaxed italic">
                   Biometric standards are calculated based on your age ({user?.age || '—'}) and gender archetype ({user?.gender || '—'}).
                 </p>
                 <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 border-dashed">
                   <p className="text-[0.55rem] font-black text-voro-primary uppercase tracking-widest mb-2">Protocol Note</p>
                   <p className="text-xs text-gray-400 leading-relaxed font-mono">
                     Measurements should be recorded monthly, early morning, in a fasted state for maximum precision.
                   </p>
                 </div>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyComposition;
