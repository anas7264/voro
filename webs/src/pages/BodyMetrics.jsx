import React, { useState, useEffect, useMemo, useCallback, useRef, useId } from 'react';
import { Activity, Target, Zap, Ruler, ShieldCheck, Cpu, ChevronRight, TrendingUp, Sparkles } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { Stat } from '@/components/Stat';
import LineChartComponent from '@/components/LineChartComponent';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useAppContext as useApp } from '@/hooks/useAppContext';
import { useNotifications } from '@/hooks/useNotifications';
import { calculateBMI, calculateFFMI } from '@/utils/calculators';
import { isValidWeight, isValidBodyFat, isPositiveNumber } from '@/utils/validators';
import { getFastShortDate } from '@/utils/formatters';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted formatters.
 * Prevents redundant object instantiation of Intl.DateTimeFormat.
 */
const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

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

  // Interactive UI States
  const [loading, setLoading] = useState(true);
  const [activeMeasurementField, setActiveMeasurementField] = useState(null);
  const [loadingText, setLoadingText] = useState('ALIGNING BIOMETRIC MATRICES...');
  const [diagnosticCode, setDiagnosticCode] = useState('0x0000');

  // Input Field References for Direct Focus Syncing
  const inputRefs = {
    chest: useRef(null),
    waist: useRef(null),
    hips: useRef(null),
    bicep: useRef(null),
    thigh: useRef(null),
    calf: useRef(null),
  };

  // Volumetric card tilt references
  const mainEnclaveRef = useRef(null);
  const massLogCardRef = useRef(null);
  const adiposeLogCardRef = useRef(null);
  const dimensionsCardRef = useRef(null);

  // Simulated Loading Sequence & Diagnostic Generation
  useEffect(() => {
    document.title = 'VORO | Biometric Composition';

    // Simulated medical-grade clinical biophysics processing
    const textSequence = [
      'INITIALIZING ANATOMICAL CALIBRATION...',
      'CONNECTING QUANTUM BIOMETRIC NODE...',
      'MAPPING SOMATOTYPE INFRASTRUCTURE...',
      'SYNTHESIZING CELLULAR ADIPOSE MATRIX...',
      'CALCULATING PEAK KINETIC VELOCITY...',
      'ALIGNMENT NOMINAL // READY'
    ];

    let seqIndex = 0;
    const textInterval = setInterval(() => {
      if (seqIndex < textSequence.length - 1) {
        seqIndex++;
        setLoadingText(textSequence[seqIndex]);
      }
    }, 400);

    const diagInterval = setInterval(() => {
      const hex = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
      setDiagnosticCode(`0x${hex}`);
    }, 100);

    const timer = setTimeout(() => {
      setLoading(false);
      clearInterval(textInterval);
      clearInterval(diagInterval);
    }, 2500);

    return () => {
      clearInterval(textInterval);
      clearInterval(diagInterval);
      clearTimeout(timer);
    };
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

  // Volumetric Hover Effect Handler
  const handleVolumetricMove = useCallback((e, cardRef) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Direct DOM manipulation of variables to sustain solid 60fps and shield React from re-renders
    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);
  }, []);

  const handleVolumetricLeave = useCallback((cardRef) => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--tilt-x', '0deg');
    cardRef.current.style.setProperty('--tilt-y', '0deg');
  }, []);

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
   */
  const weightData = useMemo(() => weights.slice(-30).map(w => ({
    date: getFastShortDate(w.date),
    weight: w.value,
  })), [weights]);

  const { latestWeight, latestBodyFat, bmi, ffmi } = useMemo(() => {
    const lw = weights[weights.length - 1]?.value;
    const lbf = bodyFatRecords[bodyFatRecords.length - 1]?.value;
    const b = lw && user ? calculateBMI(lw, user.heightCm) : null;
    const f = lw && lbf && user ? calculateFFMI(lw, lbf, user.heightCm) : null;
    return { latestWeight: lw, latestBodyFat: lbf, bmi: b, ffmi: f };
  }, [weights, bodyFatRecords, user]);

  // Bi-directional interactive coordination: focus input from SVG node click
  const handleSVGNodeClick = useCallback((field) => {
    setActiveMeasurementField(field);
    const targetInput = inputRefs[field]?.current;
    if (targetInput) {
      targetInput.focus();
      targetInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [inputRefs]);

  // SVG Dimension markers configurations
  const svgNodes = useMemo(() => [
    { key: 'chest', cx: 150, cy: 110, label: 'Chest [0xCHST]', side: 'right', lineY: 110, labelX: 250 },
    { key: 'bicep', cx: 100, cy: 120, label: 'Bicep [0xBCP]', side: 'left', lineY: 120, labelX: 15 },
    { key: 'waist', cx: 150, cy: 150, label: 'Waist [0xWST]', side: 'right', lineY: 150, labelX: 250 },
    { key: 'hips', cx: 150, cy: 180, label: 'Hips [0xHPS]', side: 'left', lineY: 180, labelX: 15 },
    { key: 'thigh', cx: 128, cy: 230, label: 'Thigh [0xTHG]', side: 'left', lineY: 230, labelX: 15 },
    { key: 'calf', cx: 130, cy: 310, label: 'Calf [0xCLF]', side: 'left', lineY: 310, labelX: 15 },
  ], []);

  const todayDate = useMemo(() => longDateFormatter.format(new Date()), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#020408] text-[#F0F4FF] relative overflow-hidden">
        {/* Diagnostic Background Pattern */}
        <div className="absolute inset-0 bg-grid-white opacity-[0.015] pointer-events-none" />
        <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />

        <div className="flex flex-col items-center max-w-lg px-8 text-center space-y-12 relative z-10 animate-fade-in">
          {/* Concentric Counter-Rotating Orbital Rings */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-dashed border-voro-primary/20 animate-[spin_30s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-voro-accent/30 animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-8 rounded-full border-2 border-dashed border-voro-secondary/40 animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-12 rounded-full bg-voro-primary/10 flex items-center justify-center shadow-[0_0_35px_rgba(124,58,237,0.3)]">
              <Cpu size={36} className="text-voro-primary animate-pulse" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-mono tracking-[0.5em] text-voro-primary uppercase font-bold animate-pulse">
              ANATOMICAL MATRIX SYNTHESIS
            </h2>
            <p className="text-2xl font-serif italic text-white/90 font-medium">
              {loadingText}
            </p>
          </div>

          {/* Rapid Diagnostic Telemetry Stream */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 w-64">
            <div className="flex justify-between font-mono text-[0.6rem] text-gray-500 tracking-widest">
              <span>SYS_ADDR</span>
              <span className="text-voro-accent">{diagnosticCode}</span>
            </div>
            <div className="flex justify-between font-mono text-[0.6rem] text-gray-500 tracking-widest mt-2">
              <span>INTEGRITY</span>
              <span className="text-voro-secondary">NOMINAL_0x11</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30 relative">
      {/* Environmental Ambient backglow elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] bg-voro-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid-white opacity-[0.015]" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">

        {/* Luxury Boutique Header Section */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-16 group/header">
          <div className="space-y-8 max-w-4xl">
            {/* Pulsing Neural Eyebrow */}
            <div className="flex items-center gap-4 text-voro-primary">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.8)]"></span>
              </div>
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.6em] opacity-90">
                Anatomical Calibration // CALIB_SYS_V1.8
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-[4.5rem] md:text-[6.5rem] font-serif italic font-medium tracking-[-0.04em] text-white leading-[0.9] mb-4">
                Biometric <span className="text-gradient not-italic font-bold">Evolution</span>
              </h1>
              <p className="text-gray-500 font-medium tracking-widest text-xs uppercase opacity-70 leading-relaxed max-w-xl">
                A highly-precise spatial analysis and mapping of somatic developments, skeletal dimensions, and lean mass adaptation.
              </p>
            </div>

            {/* Datum line */}
            <div className="flex items-center gap-6">
              <div className="h-px w-24 bg-gradient-to-r from-voro-primary to-transparent opacity-40 group-hover/header:w-48 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <p className="text-gray-600 font-mono font-bold tracking-[0.4em] text-[0.55rem] uppercase opacity-50 whitespace-nowrap">{todayDate}</p>
            </div>
          </div>
        </header>

        {/* Dynamic Telemetry Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <Stat
            label="Current Mass"
            value={latestWeight ? Number(latestWeight).toFixed(1) : '-'}
            unit="kg"
            icon={Zap}
            color="voro-primary"
            nodeId="BIOM_MASS_01"
          />
          <Stat
            label="Adipose Index"
            value={latestBodyFat ? Number(latestBodyFat).toFixed(1) : '-'}
            unit="%"
            icon={Target}
            color="voro-accent"
            nodeId="BIOM_ADIP_02"
          />
          <Stat
            label="Metabolic BMI"
            value={bmi || '-'}
            icon={Activity}
            color="voro-secondary"
            nodeId="BIOM_BMI_03"
          />
          <Stat
            label="Lean FFMI"
            value={ffmi || '-'}
            icon={ShieldCheck}
            color="primary"
            nodeId="BIOM_FFMI_04"
          />
        </section>

        {/* Master Spatial Blueprint Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* LEFT COLUMN: Trajectory Charts & Log Mass Entries */}
          <div className="col-span-12 lg:col-span-7 space-y-10">

            {/* Volumetric Mass Trajectory Card */}
            <section
              ref={mainEnclaveRef}
              onMouseMove={(e) => handleVolumetricMove(e, mainEnclaveRef)}
              onMouseLeave={() => handleVolumetricLeave(mainEnclaveRef)}
              style={{
                transform: 'perspective(1500px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="relative overflow-hidden rounded-[3.5rem] bg-[#0A0C14] border border-white/5 p-12 md:p-16 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)] hover:border-white/10 group/trajectory"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-voro-primary/5 rounded-full blur-[100px] pointer-events-none -mr-48 -mt-48 group-hover/trajectory:bg-voro-primary/10 transition-colors duration-1000" />
              <div className="absolute inset-0 bg-scanline opacity-[0.015] pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full" style={{ transform: 'translateZ(30px)' }}>
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-[0.65rem] font-mono font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Mass Trajectory</h3>
                    <p className="text-3xl font-serif font-bold text-white tracking-tight">Kinetic Shift <span className="text-[0.65rem] font-sans font-black text-gray-700 uppercase ml-3 tracking-[0.2em]">30D Matrix</span></p>
                  </div>
                  <div className="px-5 py-2.5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <span className="text-[0.55rem] font-mono font-bold text-voro-primary uppercase tracking-widest">REALTIME_PLOT</span>
                  </div>
                </div>

                <div className="h-[360px] w-full">
                  <LineChartComponent
                    data={weightData}
                    dataKey="weight"
                    name="Weight"
                    color="#7C3AED"
                    height={360}
                    strokeWidth={3.5}
                  />
                </div>
              </div>
            </section>

            {/* Compact Metric Logging Deck */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Log Mass Card */}
              <div
                ref={massLogCardRef}
                onMouseMove={(e) => handleVolumetricMove(e, massLogCardRef)}
                onMouseLeave={() => handleVolumetricLeave(massLogCardRef)}
                style={{
                  transform: 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="relative overflow-hidden rounded-[3rem] bg-[#0A0C14] border border-white/5 p-10 hover:border-white/10 group/mass"
              >
                <div className="relative z-10" style={{ transform: 'translateZ(35px)' }}>
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-[0.65rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em]">Log Mass</h3>
                    <div className="p-3 bg-voro-primary/10 rounded-2xl text-voro-primary">
                      <Zap size={16} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Input
                      type="number"
                      placeholder="Magnitude (kg)"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      step="0.1"
                      className="w-full bg-white/[0.02] border-white/5 italic font-serif text-lg py-4 px-6 rounded-xl"
                    />
                    <Button onClick={addWeight} fullWidth className="py-5 text-[0.65rem] tracking-[0.3em]">
                      Record Mass
                    </Button>
                  </div>
                </div>
              </div>

              {/* Log Adipose Card */}
              <div
                ref={adiposeLogCardRef}
                onMouseMove={(e) => handleVolumetricMove(e, adiposeLogCardRef)}
                onMouseLeave={() => handleVolumetricLeave(adiposeLogCardRef)}
                style={{
                  transform: 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="relative overflow-hidden rounded-[3rem] bg-[#0A0C14] border border-white/5 p-10 hover:border-white/10 group/adipose"
              >
                <div className="relative z-10" style={{ transform: 'translateZ(35px)' }}>
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-[0.65rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em]">Log Adipose %</h3>
                    <div className="p-3 bg-voro-accent/10 rounded-2xl text-voro-accent">
                      <Target size={16} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Input
                      type="number"
                      placeholder="Magnitude (%)"
                      value={bodyFat}
                      onChange={(e) => setBodyFat(e.target.value)}
                      step="0.1"
                      className="w-full bg-white/[0.02] border-white/5 italic font-serif text-lg py-4 px-6 rounded-xl"
                    />
                    <Button onClick={addBodyFat} fullWidth className="py-5 text-[0.65rem] tracking-[0.3em] !bg-voro-accent">
                      Record Index
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Anatomical Dimensions Console (Interactive SVG & form) */}
          <div className="col-span-12 lg:col-span-5">
            <section
              ref={dimensionsCardRef}
              onMouseMove={(e) => handleVolumetricMove(e, dimensionsCardRef)}
              onMouseLeave={() => handleVolumetricLeave(dimensionsCardRef)}
              style={{
                transform: 'perspective(1500px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="relative overflow-hidden rounded-[3.5rem] bg-[#0A0C14] border border-white/5 p-10 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)] hover:border-white/10 group/dimensions flex flex-col h-full"
            >
              <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-voro-secondary/5 rounded-full blur-[100px] pointer-events-none -ml-48 -mt-48 group-hover/dimensions:bg-voro-secondary/10 transition-colors duration-1000" />
              <div className="absolute inset-0 bg-scanline opacity-[0.015] pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full" style={{ transform: 'translateZ(30px)' }}>
                <div className="flex items-center justify-between border-b border-white/5 pb-8 mb-10">
                  <div>
                    <h3 className="text-[0.65rem] font-mono font-black text-gray-500 uppercase tracking-[0.4em] mb-1">
                      Anatomical Telemetry Blueprint
                    </h3>
                    <p className="text-xl font-serif italic font-medium text-white tracking-tight">Somatic Interactive Matrix</p>
                  </div>
                  <Ruler size={18} className="text-voro-primary animate-pulse" />
                </div>

                {/* HIGH-FIDELITY SVG INTERACTIVE SILHOUETTE */}
                <div className="relative flex justify-center mb-10 border border-white/5 bg-black/40 rounded-[2.5rem] p-4 group/svg-view">
                  <div className="absolute top-4 left-6 text-[0.45rem] font-mono text-gray-600 uppercase tracking-widest">[GRID_CAL_SYS]</div>
                  <div className="absolute top-4 right-6 text-[0.45rem] font-mono text-gray-600 uppercase tracking-widest">NODE_ACTIVE: {activeMeasurementField ? activeMeasurementField.toUpperCase() : 'NONE'}</div>

                  <svg viewBox="0 0 300 380" className="w-full h-[360px] text-gray-500">
                    {/* Abstract Cyber Grid */}
                    <g opacity="0.1">
                      <line x1="50" y1="0" x2="50" y2="380" stroke="currentColor" strokeDasharray="2,2" />
                      <line x1="100" y1="0" x2="100" y2="380" stroke="currentColor" strokeDasharray="2,2" />
                      <line x1="150" y1="0" x2="150" y2="380" stroke="currentColor" strokeDasharray="2,2" />
                      <line x1="200" y1="0" x2="200" y2="380" stroke="currentColor" strokeDasharray="2,2" />
                      <line x1="250" y1="0" x2="250" y2="380" stroke="currentColor" strokeDasharray="2,2" />

                      <line x1="0" y1="50" x2="300" y2="50" stroke="currentColor" strokeDasharray="2,2" />
                      <line x1="0" y1="100" x2="300" y2="100" stroke="currentColor" strokeDasharray="2,2" />
                      <line x1="0" y1="150" x2="300" y2="150" stroke="currentColor" strokeDasharray="2,2" />
                      <line x1="0" y1="200" x2="300" y2="200" stroke="currentColor" strokeDasharray="2,2" />
                      <line x1="0" y1="250" x2="300" y2="250" stroke="currentColor" strokeDasharray="2,2" />
                      <line x1="0" y1="300" x2="300" y2="300" stroke="currentColor" strokeDasharray="2,2" />
                    </g>

                    {/* Vector Human Silhouette Outline */}
                    <path
                      d="M150,25 C158,25 164,31 164,39 C164,47 158,53 150,53 C142,53 136,47 136,39 C136,31 142,25 150,25 Z M124,75 C132,70 141,68 150,68 C159,68 168,70 176,75 C186,81 190,95 190,105 C190,115 186,120 186,130 C186,136 182,142 178,145 C176,146 174,152 174,160 C174,170 178,185 178,195 L178,210 L168,260 L168,360 C168,365 163,370 158,370 L152,370 L152,240 L148,240 L148,370 L142,370 C137,370 132,365 132,360 L132,260 L122,210 L122,195 C122,185 126,170 126,160 C126,152 124,146 122,145 C118,142 114,136 114,130 C114,120 110,115 110,105 C110,95 114,81 124,75 Z"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="2"
                      className="group-hover/svg-view:stroke-white/15 transition-all duration-1000"
                    />

                    {/* Laser Connections & Glowing Interactive Nodes */}
                    {svgNodes.map((node) => {
                      const isActive = activeMeasurementField === node.key;
                      return (
                        <g
                          key={node.key}
                          onClick={() => handleSVGNodeClick(node.key)}
                          className="cursor-pointer group/node"
                        >
                          {/* Pulsing Target Aura */}
                          <circle
                            cx={node.cx}
                            cy={node.cy}
                            r={isActive ? 16 : 8}
                            fill={isActive ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.02)'}
                            className={`transition-all duration-500 ${isActive ? 'animate-pulse' : 'group-hover/node:fill-white/10'}`}
                          />

                          {/* Inner Target Point */}
                          <circle
                            cx={node.cx}
                            cy={node.cy}
                            r="4"
                            fill={isActive ? 'var(--voro-primary)' : '#4B5563'}
                            className="transition-colors duration-500 group-hover/node:fill-voro-primary"
                          />

                          {/* Horizontal Blueprint Connection Line */}
                          <line
                            x1={node.cx}
                            y1={node.cy}
                            x2={node.labelX + (node.side === 'left' ? 40 : 0)}
                            y2={node.lineY}
                            stroke={isActive ? 'var(--voro-primary)' : 'rgba(255,255,255,0.06)'}
                            strokeDasharray={isActive ? '0' : '2,2'}
                            className="transition-colors duration-500 group-hover/node:stroke-voro-primary/50"
                            strokeWidth={isActive ? '1.5' : '1'}
                          />

                          {/* Technical Grid Coordinate Tag */}
                          <text
                            x={node.labelX}
                            y={node.lineY + 4}
                            fontFamily="JetBrains Mono, monospace"
                            fontSize="8"
                            fill={isActive ? 'white' : '#6B7280'}
                            className="font-bold tracking-widest transition-colors duration-500 group-hover/node:fill-white"
                          >
                            {node.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* FORM PANEL */}
                <div className="space-y-8 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {Object.keys(measurements).map((key) => {
                      const isActive = activeMeasurementField === key;
                      return (
                        <div
                          key={key}
                          onClick={() => setActiveMeasurementField(key)}
                          className={`p-4 rounded-2xl border transition-all duration-500 ${
                            isActive
                              ? 'bg-voro-primary/[0.03] border-voro-primary shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.02)]'
                              : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                          }`}
                        >
                          <label className={`text-[0.6rem] font-black uppercase tracking-[0.2em] mb-2 block transition-colors ${isActive ? 'text-voro-primary' : 'text-gray-500'}`}>
                            {key} [C_{key.slice(0, 3).toUpperCase()}]
                          </label>
                          <Input
                            ref={inputRefs[key]}
                            type="number"
                            placeholder="cm"
                            value={measurements[key]}
                            onChange={(e) => setMeasurements(prev => ({ ...prev, [key]: e.target.value }))}
                            onFocus={() => setActiveMeasurementField(key)}
                            step="0.1"
                            className="w-full bg-transparent border-none p-0 focus:ring-0 text-white font-serif italic text-lg"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <Button onClick={addMeasurement} className="w-full py-6 rounded-[1.5rem] bg-white text-black font-black uppercase tracking-[0.3em] text-[0.65rem] shadow-xl shadow-white/5 hover:scale-[1.01] active:scale-[0.99] transition-transform mt-8">
                    Save Anatomical Manifest
                  </Button>
                </div>

              </div>
            </section>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BodyMetrics;
