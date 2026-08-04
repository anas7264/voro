import React, { useEffect, useMemo, useState, useRef, memo, useId } from 'react';
import { TrendingUp, TrendingDown, Scale, Activity, Zap, Target, Heart, Info, ShieldAlert, CircleDot } from 'lucide-react';
import Card from '@/components/Card';
import Stat from '@/components/Stat';
import AreaChartComponent from '@/components/AreaChartComponent';
import Badge from '@/components/Badge';
import { useStorageKey } from '@/hooks/useStorage';
import { useApp } from '@/hooks/useAppContext';
import { bodyFatStandards, bodyFatLevelDescriptions, bodyFatHealthMetrics } from '@/data/bodyFatStandards';
import { getFastShortDate } from '@/utils/formatters';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted formatters.
 * Prevents redundant object instantiation of Intl.DateTimeFormat in loops.
 */
const dateShortFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric'
});

/**
 * ⚡ REFINEMENT: Custom SomaticSpecimenCell Component.
 * Conforms to the 'Forge' luxury system aesthetic with 3D volumetric transforms,
 * direct DOM mouse tracking (bypassing React re-renders), and real-time coordinate telemetry.
 */
const SomaticSpecimenCell = memo(({ label, value, unit, change, icon: Icon, color = "voro-primary", nodeId }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 15 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 30;
    const tiltX = (0.5 - (y / rect.height)) * 30;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      // 4-degree static tilt on focus for keyboard accessibility compliance
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const interactionActive = isHovered || isFocused;
  const isPositive = change !== undefined && parseFloat(change) >= 0;

  const colorTokenMap = {
    'voro-primary': 'var(--voro-primary, #7C3AED)',
    'voro-secondary': 'var(--voro-secondary, #10B981)',
    'voro-accent': 'var(--voro-accent, #F59E0B)',
    'voro-danger': 'var(--voro-danger, #EF4444)'
  };
  const activeColor = colorTokenMap[color] || 'var(--voro-primary, #7C3AED)';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      role="article"
      aria-label={`${label} metric is ${value} ${unit}.`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-6px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="relative bg-[#0A0C14] border border-white/5 rounded-[2.5rem] p-8 overflow-hidden group/card cursor-pointer transition-all duration-700 hover:border-white/20 hover:shadow-[0_80px_160px_rgba(0,0,0,0.9)] outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]"
    >
      {/* Precision Grid Overlay */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/card:opacity-[0.03] transition-opacity duration-1000" style={{ transform: 'translateZ(10px)' }} />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Luminous Lens */}
        <div
          className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), color-mix(in srgb, ${activeColor}, transparent 90%), transparent 50%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Coordinate Telemetry Overlay */}
      <div
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(80px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-white/40 tracking-[0.2em] space-y-1">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/10">[{nodeId}]</span>
        </div>
      </div>

      {/* Atmospheric Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover/card:opacity-[0.04] transition-opacity duration-1000 blur-3xl -z-10"
        style={{ transform: 'translateZ(-20px)', backgroundColor: activeColor }}
      />

      <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            <span className="text-[0.55rem] font-mono font-bold uppercase tracking-[0.4em] text-gray-500">
              {label}
            </span>
            {change !== undefined && (
              <div className={`flex items-center gap-1 text-[0.55rem] font-mono font-black uppercase tracking-wider ${isPositive ? 'text-voro-secondary' : 'text-voro-danger'}`}>
                <span>{isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>

          <div
            style={{ transform: 'translateZ(20px)' }}
            className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-600 group-hover/card:text-white group-hover/card:bg-white/5 group-hover/card:border-white/10 transition-all duration-700"
          >
            {Icon && <Icon size={18} />}
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 mt-4">
          <span className="text-4xl font-serif italic font-medium text-white tracking-tight leading-none">
            {value}
          </span>
          {unit && (
            <span className="text-[0.6rem] font-mono text-gray-500 font-bold uppercase tracking-widest">
              {unit}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
SomaticSpecimenCell.displayName = "SomaticSpecimenCell";

/**
 * ⚡ REFINEMENT: SomaticSegmentalLens Component.
 * Interactive custom visualization demonstrating the muscle-to-fat clinical cross section.
 */
const SomaticSegmentalLens = memo(({ leanMass, fatMass, bodyFat }) => {
  const leanPct = useMemo(() => {
    const total = leanMass + fatMass;
    if (total === 0) return 70;
    return (leanMass / total) * 100;
  }, [leanMass, fatMass]);

  return (
    <div className="relative p-8 rounded-[2.5rem] bg-[#0A0C14]/80 border border-white/5 overflow-hidden group/lens">
      <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
      <div className="absolute -left-12 -top-12 w-48 h-48 bg-voro-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-voro-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <span className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-widest">Somatic Segmental Lens</span>
          <span className="text-[0.55rem] font-mono font-bold text-voro-primary uppercase tracking-widest animate-pulse">CROSS_SECTION // ACTIVE</span>
        </div>

        {/* Anatomical Cross Section Visualizer */}
        <div className="relative h-24 bg-[#030408] rounded-2xl border border-white/5 overflow-hidden flex items-center justify-between px-8">
          <div className="absolute inset-0 bg-grid-white opacity-[0.03]" />

          {/* Animated split slider indicator of muscle vs fat */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-voro-primary/10 to-voro-primary/20 border-r border-voro-primary/30 transition-all duration-1000 ease-out"
            style={{ width: `${leanPct}%` }}
          >
            <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-[0.05]" />
          </div>

          <div
            className="absolute inset-y-0 right-0 bg-gradient-to-l from-voro-accent/10 to-voro-accent/20 border-l border-voro-accent/30 transition-all duration-1000 ease-out"
            style={{ width: `${100 - leanPct}%` }}
          />

          {/* Left Text Detail */}
          <div className="relative z-10 flex flex-col">
            <span className="text-[0.5rem] font-mono text-voro-primary font-bold uppercase tracking-widest">Lean Matrix (Muscle)</span>
            <span className="text-xl font-serif italic text-white font-medium">{leanMass.toFixed(1)} <span className="text-[0.6rem] font-mono text-gray-500">kg</span></span>
          </div>

          {/* Core Calibration Split Pin */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-voro-primary flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all duration-1000 ease-out z-20"
            style={{ left: `calc(${leanPct}% - 1rem)` }}
          >
            <CircleDot size={12} className="text-voro-primary animate-pulse" />
          </div>

          {/* Right Text Detail */}
          <div className="relative z-10 flex flex-col items-end">
            <span className="text-[0.5rem] font-mono text-voro-accent font-bold uppercase tracking-widest">Adipose Flux (Fat)</span>
            <span className="text-xl font-serif italic text-white font-medium">{fatMass.toFixed(1)} <span className="text-[0.6rem] font-mono text-gray-500">kg</span></span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest">
          <span>Active Adipose density: <strong className="text-voro-accent">{bodyFat.toFixed(1)}%</strong></span>
          <span>Somatic density ratio: <strong className="text-voro-primary">{(leanPct/10).toFixed(2)}x</strong></span>
        </div>
      </div>
    </div>
  );
});
SomaticSegmentalLens.displayName = "SomaticSegmentalLens";

const BodyComposition = () => {
  const metricsData = useStorageKey('body_metrics');
  const { user } = useApp();

  // Simulated Masterclass Loading Alignment State
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = useMemo(() => [
    "Establishing Somatotype Protocol...",
    "Aligning Lean Mass Vector...",
    "Calibrating Adipose Flux Coordinates...",
    "Synaptic Compilation Complete."
  ], []);

  useEffect(() => {
    document.title = 'VORO | Biometric Composition';

    // Premium loading simulated sequence
    let stepTimer;
    let finishTimer;

    const cycleSteps = (idx) => {
      if (idx < loadingMessages.length) {
        setLoadingStep(idx);
        stepTimer = setTimeout(() => cycleSteps(idx + 1), 600);
      }
    };

    cycleSteps(0);

    finishTimer = setTimeout(() => {
      setLoading(false);
    }, 2400);

    return () => {
      clearTimeout(stepTimer);
      clearTimeout(finishTimer);
    };
  }, [loadingMessages]);

  /**
   * ⚡ OPTIMIZATION: Synchronous data derivation using useMemo.
   */
  const metrics = useMemo(() => {
    return metricsData || { weights: [], bodyFat: [] };
  }, [metricsData]);

  const compositionHistory = useMemo(() => {
    if (!metrics.weights?.length || !metrics.bodyFat?.length) return [];

    /**
     * ⚡ OPTIMIZATION: Single-pass O(N+M) alignment for merging biometric time-series.
     * Pre-calculates timestamps to eliminate redundant Date parsing in the loop.
     */
    const weights = [...metrics.weights]
      .sort((a, b) => {
        const dA = a.date || '';
        const dB = b.date || '';
        return dA < dB ? -1 : dA > dB ? 1 : 0;
      })
      .slice(-30)
      .map(w => {
        const date = new Date(w.date);
        return { ...w, ts: date.getTime(), dateObj: date };
      });

    const bodyFat = [...metrics.bodyFat]
      .sort((a, b) => {
        const dA = a.date || '';
        const dB = b.date || '';
        return dA < dB ? -1 : dA > dB ? 1 : 0;
      })
      .map(b => ({ ...b, ts: new Date(b.date).getTime() }));

    let bfIdx = 0;
    const result = [];

    for (const w of weights) {
      const wTs = w.ts;

      while (bfIdx < bodyFat.length - 1) {
        const currentDiff = Math.abs(bodyFat[bfIdx].ts - wTs);
        const nextDiff = Math.abs(bodyFat[bfIdx + 1].ts - wTs);
        if (nextDiff <= currentDiff) {
          bfIdx++;
        } else {
          break;
        }
      }

      const bfPct = bodyFat[bfIdx].value;
      const weight = w.value;
      const fatMass = (weight * bfPct / 100);
      const leanMass = (weight - fatMass);

      result.push({
        date: getFastShortDate(w.date),
        leanMass: Number(leanMass.toFixed(2)),
        fatMass: Number(fatMass.toFixed(2)),
        bodyFat: Number(bfPct.toFixed(2)),
        weight: Number(weight.toFixed(2)),
      });
    }

    return result;
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 relative overflow-hidden">
        {/* Cinematic Backdrop Rings */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-voro-primary/5 rounded-full blur-[120px] pointer-events-none" />
        </div>

        <div className="relative flex flex-col items-center z-10 space-y-10">
          {/* Orbital loading elements */}
          <div className="relative w-36 h-34 flex items-center justify-center">
            <div className="absolute w-24 h-24 rounded-full border border-voro-primary/20 border-t-voro-primary animate-spin" />
            <div className="absolute w-28 h-28 rounded-full border border-dashed border-voro-secondary/10 animate-[spin_10s_linear_infinite]" />
            <div className="absolute w-32 h-32 rounded-full border border-voro-accent/20 border-b-voro-accent animate-[spin_6s_linear_infinite_reverse]" />
            <Activity size={32} className="text-voro-primary animate-pulse" />
          </div>

          <div className="text-center space-y-3">
            <p className="text-2xl font-serif italic text-white font-bold">{loadingMessages[loadingStep]}</p>
            <p className="text-[0.55rem] font-mono tracking-[0.40em] text-gray-500 uppercase">
              VORO BIOMETRIC COMPOSITION SYNTHESIS // ONLINE
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <TrendingUp size={18} />
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-voro-primary">
                Somatic Matrix // PROTOCOL_0X9B
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic font-medium tracking-tight text-white leading-tight">
              Biometric <span className="text-gradient not-italic font-bold">Composition</span>
            </h1>
            <p className="text-gray-500 font-mono text-[0.65rem] uppercase tracking-[0.3em] max-w-xl leading-relaxed">
              Architectural analysis of skeletal lean mass indexation and adipose flux coordinates.
            </p>
          </div>

          {/* Status badge */}
          <div className="p-6 rounded-[2rem] bg-[#0A0C14] border border-white/5 flex items-center gap-6 shadow-2xl">
            <div className="p-4 rounded-xl bg-voro-primary/10 text-voro-primary">
              <Scale size={24} />
            </div>
            <div>
              <p className="text-[0.55rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 mb-1">Status Class</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-serif italic font-bold text-white leading-none">{categoryDetails?.name || 'Nominal'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Luminous Biometric Nodes re-engineered into SomaticSpecimenCell */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <SomaticSpecimenCell
            label="Lean Mass"
            value={latest?.leanMass ?? '—'}
            unit="kg"
            icon={Zap}
            color="voro-primary"
            nodeId="COMP_LEAN_01"
          />
          <SomaticSpecimenCell
            label="Fat Mass"
            value={latest?.fatMass ?? '—'}
            unit="kg"
            icon={Target}
            color="voro-accent"
            nodeId="COMP_FAT_02"
          />
          <SomaticSpecimenCell
            label="Adipose Ratio"
            value={latest?.bodyFat ? latest.bodyFat.toFixed(1) : '—'}
            unit="%"
            icon={Scale}
            color="voro-secondary"
            nodeId="COMP_PCT_03"
          />
          <SomaticSpecimenCell
            label="Adipose Trend"
            value={Math.abs(trend).toFixed(1)}
            unit="%"
            change={trend.toFixed(1)}
            icon={Activity}
            color={trend <= 0 ? "voro-secondary" : "voro-danger"}
            nodeId="COMP_TRD_04"
          />
        </div>

        <div className="grid grid-cols-12 gap-12 mb-16 items-start">
          {/* Charts & Interactive Segmental Lens Section */}
          <div className="col-span-12 lg:col-span-8 space-y-12">
            {latest && (
              <SomaticSegmentalLens
                leanMass={latest.leanMass}
                fatMass={latest.fatMass}
                bodyFat={latest.bodyFat}
              />
            )}

            {compositionHistory.length > 1 ? (
              <>
                <Card variant="premium" className="p-10 bg-voro-card border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-voro-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-voro-primary/10 transition-colors duration-700" />
                  <div className="relative">
                    <h3 className="text-[0.65rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
                      <Activity size={16} className="text-voro-primary animate-pulse" />
                      Composition Trajectory
                    </h3>
                    <div className="h-[400px]">
                      <AreaChartComponent
                        data={compositionHistory}
                        dataKeys={[
                          { key: 'leanMass', name: 'Lean Mass (kg)', color: '#7C3AED' },
                          { key: 'fatMass', name: 'Fat Mass (kg)', color: '#F59E0B' },
                        ]}
                        height={400}
                      />
                    </div>
                  </div>
                </Card>

                <Card variant="premium" className="p-10 bg-voro-card border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-voro-secondary/5 rounded-full blur-[100px] -ml-32 -mb-32 group-hover:bg-voro-secondary/10 transition-colors duration-700" />
                  <div className="relative">
                    <h3 className="text-[0.65rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
                      <Scale size={16} className="text-voro-secondary" />
                      Adipose Flux (30D Window)
                    </h3>
                    <div className="h-[300px]">
                      <AreaChartComponent
                        data={compositionHistory}
                        dataKey="bodyFat"
                        name="Body Fat %"
                        color="#10B981"
                        height={300}
                      />
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-[#0A0C14]/40 backdrop-blur-sm">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Zap size={32} className="text-gray-700 animate-pulse" />
                </div>
                <h3 className="text-2xl font-serif italic text-white mb-2">Matrix Void</h3>
                <p className="text-[0.65rem] font-mono font-black text-gray-600 uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                  Log multiple biometric records in Body Metrics to initiate trajectory charts.
                </p>
              </div>
            )}
          </div>

          {/* Anatomical Classification Artifact */}
          <div className="col-span-12 lg:col-span-4 space-y-12">
            <Card variant="premium" className="p-10 bg-gradient-to-br from-voro-card to-black border-voro-primary/20 relative overflow-hidden group/artifact">
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

            <Card variant="premium" className="p-10 bg-voro-card border-white/5 space-y-8 shadow-xl">
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
