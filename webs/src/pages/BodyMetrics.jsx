import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Activity, Target, Zap, Ruler } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { Stat } from '@/components/Stat';
import LineChartComponent from '@/components/LineChartComponent';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useApp } from '@/hooks/useAppContext';
import { useNotifications } from '@/hooks/useNotifications';
import { calculateBMI, calculateFFMI } from '@/utils/calculators';
import { isValidWeight, isValidBodyFat, isPositiveNumber } from '@/utils/validators';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted formatters.
 * Prevents redundant object instantiation of Intl.DateTimeFormat in loops.
 */
const shortDateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

const BodyMetrics = () => {
  const { updateItem } = useStorageMethods();
  const { user } = useApp();
  const { addNotification } = useNotifications();
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    hips: '',
    bicep: '',
    thigh: '',
    calf: '',
  });

  useEffect(() => {
    document.title = 'VORO | Biometric Composition';
  }, []);

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad body_metrics subscription with useStorageKeySelector to isolate
   * weights, body fat, and measurements.
   */
  const weights = useStorageKeySelector(
    'body_metrics',
    useCallback((metrics) => metrics?.weights || [], [])
  );

  const bodyFatRecords = useStorageKeySelector(
    'body_metrics',
    useCallback((metrics) => metrics?.bodyFat || [], [])
  );

  const measurementsRecord = useStorageKeySelector(
    'body_metrics',
    useCallback((metrics) => metrics?.measurements || [], [])
  );

  const addWeight = async () => {
    if (!weight) return;

    if (!isValidWeight(weight)) {
      addNotification('Invalid weight value. Must be between 30 and 500 kg.', 'error');
      return;
    }

    const newWeight = {
      date: new Date().toISOString(),
      value: Number(weight),
    };

    /**
     * ⚡ OPTIMIZATION: Use updateItem for atomic key-level persistence.
     * Prevents full object read-spread-write cycles.
     */
    await updateItem('body_metrics', {
      weights: [...weights, newWeight]
    });

    setWeight('');
    addNotification('Mass record synchronized', 'success');
  };

  const addMeasurement = async () => {
    const invalidFields = Object.entries(measurements).filter(([_, val]) => val && !isPositiveNumber(val));
    if (invalidFields.length > 0) {
      addNotification('All measurements must be positive numbers', 'error');
      return;
    }

    if (Object.values(measurements).every(v => v === '')) {
      addNotification('Please provide at least one measurement', 'info');
      return;
    }

    const newMeasurement = {
      date: new Date().toISOString(),
      ...measurements,
    };

    /**
     * ⚡ OPTIMIZATION: Atomic update for anatomical dimensions.
     */
    await updateItem('body_metrics', {
      measurements: [...measurementsRecord, newMeasurement]
    });

    setMeasurements({
      chest: '',
      waist: '',
      hips: '',
      bicep: '',
      thigh: '',
      calf: '',
    });
    addNotification('Anatomical dimensions recorded', 'success');
  };

  const addBodyFat = async () => {
    if (!bodyFat) return;

    if (!isValidBodyFat(bodyFat)) {
      addNotification('Invalid body fat value. Must be between 0 and 100%.', 'error');
      return;
    }

    const newBodyFat = {
      date: new Date().toISOString(),
      value: Number(bodyFat),
    };

    /**
     * ⚡ OPTIMIZATION: Atomic update for adipose index.
     */
    await updateItem('body_metrics', {
      bodyFat: [...bodyFatRecords, newBodyFat]
    });

    setBodyFat('');
    addNotification('Adipose index updated', 'success');
  };

  /**
   * ⚡ OPTIMIZATION: Memoized derived data with surgical reactivity.
   * Hoisted formatters eliminate object churn in the trend loop.
   */
  const weightData = useMemo(() => weights.slice(-30).map(w => ({
    date: shortDateFormatter.format(new Date(w.date)),
    weight: w.value,
  })), [weights]);

  const bodyFatData = useMemo(() => bodyFatRecords.slice(-30).map(b => ({
    date: shortDateFormatter.format(new Date(b.date)),
    bodyFat: b.value,
  })), [bodyFatRecords]);

  const { latestWeight, latestBodyFat, bmi, ffmi } = useMemo(() => {
    const lw = weights[weights.length - 1]?.value;
    const lbf = bodyFatRecords[bodyFatRecords.length - 1]?.value;
    const b = lw && user ? calculateBMI(lw, user.heightCm) : null;
    const f = lw && lbf && user ? calculateFFMI(lw, lbf, user.heightCm) : null;
    return { latestWeight: lw, latestBodyFat: lbf, bmi: b, ffmi: f };
  }, [weights, bodyFatRecords, user]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[35%] h-[35%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary">
              <Activity size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Composition Matrix</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif italic font-medium tracking-tight text-white leading-tight">
              Biometric <span className="text-gradient not-italic font-bold">Evolution</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-widest text-xs uppercase opacity-60">Architectural analysis of physical manifestation</p>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Stat
            label="Current Mass"
            value={latestWeight ? Number(latestWeight).toFixed(1) : '-'}
            unit="kg"
            icon={Zap}
            color="voro-primary"
          />
          <Stat
            label="Adipose Index"
            value={latestBodyFat ? Number(latestBodyFat).toFixed(1) : '-'}
            unit="%"
            icon={Target}
            color="voro-accent"
          />
          <Stat
            label="Metabolic BMI"
            value={bmi || '-'}
            icon={Zap}
            color="voro-secondary"
          />
          <Stat
            label="Lean FFMI"
            value={ffmi || '-'}
            icon={Activity}
            color="voro-primary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Weight Trend */}
          <Card className="lg:col-span-12 p-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-voro-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-voro-primary/10 transition-colors duration-1000" />
            <div className="relative">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em]">Mass Trajectory</h3>
                <span className="text-[0.65rem] font-black text-voro-primary uppercase tracking-widest bg-voro-primary/10 px-3 py-1 rounded-full border border-voro-primary/20">30 Day Window</span>
              </div>
              <div className="h-[400px] w-full">
                <LineChartComponent
                  data={weightData}
                  dataKey="weight"
                  name="Weight"
                  color="#7C3AED"
                  height={400}
                  strokeWidth={3}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
           {/* Weight Entry */}
          <Card className="p-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-xl">
            <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-10">Log Mass</h3>
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Magnitude (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                step="0.1"
                className="flex-1 bg-white/[0.02] border-white/5 italic font-serif"
              />
              <Button onClick={addWeight} className="px-8 py-4 rounded-2xl bg-voro-primary text-white font-black uppercase tracking-[0.3em] text-[0.65rem] shadow-xl shadow-voro-primary/20">
                Record
              </Button>
            </div>
          </Card>

          {/* Body Fat Entry */}
          <Card className="p-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-xl">
            <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-10">Log Adipose %</h3>
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Magnitude (%)"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                step="0.1"
                className="flex-1 bg-white/[0.02] border-white/5 italic font-serif"
              />
              <Button onClick={addBodyFat} className="px-8 py-4 rounded-2xl bg-voro-accent text-white font-black uppercase tracking-[0.3em] text-[0.65rem] shadow-xl shadow-voro-accent/20">
                Record
              </Button>
            </div>
          </Card>
        </div>

        {/* Measurements */}
        <Card className="p-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-2xl">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.3em]">Anatomical Dimensions</h3>
            <Ruler size={18} className="text-gray-700" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            {Object.entries(measurements).map(([key, value]) => (
              <div key={key}>
                <label className="text-[0.6rem] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 block">{key}</label>
                <Input
                  type="number"
                  placeholder="cm"
                  value={value}
                  onChange={(e) => setMeasurements(prev => ({ ...prev, [key]: e.target.value }))}
                  step="0.1"
                  className="bg-white/[0.02] border-white/5 italic font-serif"
                />
              </div>
            ))}
          </div>
          <Button onClick={addMeasurement} className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-[0.3em] text-[0.65rem] shadow-xl shadow-white/5 transition-all hover:scale-[1.01] active:scale-[0.99]">
            Save Manifestation
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default BodyMetrics;
