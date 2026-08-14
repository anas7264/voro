import React, { useEffect, useCallback, useMemo, useState, useRef, memo } from 'react';
import { Check, Layers, Compass, Cpu, Wrench, Shield, Zap, Sparkles, Activity } from 'lucide-react';
import Card from '@/components/Card';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted and frozen static metadata.
 * Prevents redundant object instantiations and memory allocations on every component render.
 */
const COMMON_EQUIPMENT = Object.freeze([
  { id: 1, name: 'Dumbbells', category: 'Free Weights', coord: 'W_01', type: 'Load-bearing resistance' },
  { id: 2, name: 'Barbell', category: 'Free Weights', coord: 'W_02', type: 'Load-bearing resistance' },
  { id: 3, name: 'Bench', category: 'Equipment', coord: 'EQ_01', type: 'Structural platform' },
  { id: 4, name: 'Rack', category: 'Equipment', coord: 'EQ_02', type: 'Structural platform' },
  { id: 5, name: 'Cables', category: 'Machines', coord: 'MC_01', type: 'Pulley-directed loading' },
  { id: 6, name: 'Treadmill', category: 'Cardio', coord: 'C_01', type: 'Metabolic engine' },
  { id: 7, name: 'Stationary Bike', category: 'Cardio', coord: 'C_02', type: 'Metabolic engine' },
  { id: 8, name: 'Rowing Machine', category: 'Cardio', coord: 'C_03', type: 'Metabolic engine' },
]);

const CATEGORIES = Object.freeze(['Free Weights', 'Equipment', 'Machines', 'Cardio']);

/**
 * ⚡ LUXURY REFINEMENT: KineticHardwareCell Terminal.
 * Features 60fps direct-DOM 3D volumetric hover tilts, dynamic radial laser lens spotlighting,
 * liquid border perimeter illumination, holographic coordinate telemetry overlays, and
 * static 4-degree focus tilts for screen-reader and keyboard accessibility.
 */
const KineticHardwareCell = memo(({ item, isChecked, onToggle }) => {
  const cellRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cellRef.current) return;
    const rect = cellRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 12 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 24;
    const tiltX = (0.5 - (y / rect.height)) * 24;

    // Direct DOM property updates to bypass React virtual DOM reconciliation
    cellRef.current.style.setProperty('--cell-mouse-x', `${x}px`);
    cellRef.current.style.setProperty('--cell-mouse-y', `${y}px`);
    cellRef.current.style.setProperty('--cell-tilt-x', `${tiltX}deg`);
    cellRef.current.style.setProperty('--cell-tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (cellRef.current) {
      // Accessible static tilt (4 degrees) on keyboard focus
      cellRef.current.style.setProperty('--cell-tilt-x', '4deg');
      cellRef.current.style.setProperty('--cell-tilt-y', '-4deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (cellRef.current) {
      cellRef.current.style.setProperty('--cell-tilt-x', '0deg');
      cellRef.current.style.setProperty('--cell-tilt-y', '0deg');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggle();
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={cellRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={onToggle}
      tabIndex={0}
      role="checkbox"
      aria-checked={isChecked}
      aria-label={`Calibrate hardware node ${item.name} (${item.category}). Status: ${isChecked ? 'Integrated' : 'Decommissioned'}`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--cell-tilt-x, 0deg)) rotateY(var(--cell-tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        relative p-7 rounded-[2rem] border transition-all duration-700 cursor-pointer select-none group/cell overflow-hidden outline-none
        focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]
        ${isChecked
          ? 'bg-[#0A0C14]/90 border-voro-primary/40 shadow-[0_30px_60px_-15px_rgba(124,58,237,0.2)]'
          : 'bg-[#0A0C14]/40 border-white/5 hover:border-white/15 hover:bg-[#0A0C14]/70'
        }
      `}
    >
      {/* Dynamic Laser Lens Spotlight Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover/cell:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(200px circle at var(--cell-mouse-x, 0px) var(--cell-mouse-y, 0px), rgba(124, 58, 237, 0.12), transparent 80%)`,
          transform: 'translateZ(20px)'
        }}
      />

      {/* Liquid Perimeter Illumination Ring */}
      <div
        className="absolute inset-0 rounded-[2rem] opacity-0 group-hover/cell:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(250px circle at var(--cell-mouse-x, 0px) var(--cell-mouse-y, 0px), rgba(124, 58, 237, 0.5), transparent 75%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Holographic Telemetry Overlay */}
      <div
        className="absolute top-4 right-5 pointer-events-none opacity-0 group-hover/cell:opacity-100 group-focus-within/cell:opacity-100 transition-all duration-500 z-30"
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.4rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-0.5">
          <span>T_X <span ref={tiltXRef}>0.0</span>°</span>
          <span>T_Y <span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[HW_NODE_{item.coord}]</span>
        </div>
      </div>

      <div className="relative z-10 flex items-start justify-between" style={{ transform: 'translateZ(30px)' }}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[0.55rem] font-mono text-voro-primary/80 font-black tracking-widest uppercase">
              [{item.coord}]
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${isChecked ? 'bg-voro-primary shadow-[0_0_8px_rgba(124,58,237,0.8)] animate-pulse' : 'bg-gray-800'}`} />
          </div>
          <div>
            <h4 className="text-lg font-serif italic font-medium text-white tracking-tight group-hover/cell:text-voro-primary transition-colors duration-300">
              {item.name}
            </h4>
            <p className="text-[0.55rem] font-mono text-gray-500 tracking-wider uppercase mt-1">
              {item.type}
            </p>
          </div>
        </div>

        {/* Custom Glowing Signal Module */}
        <div className={`
          w-9 h-9 rounded-2xl border transition-all duration-500 flex items-center justify-center
          ${isChecked
            ? 'bg-voro-primary border-voro-primary shadow-[0_0_20px_rgba(124,58,237,0.6)] scale-105'
            : 'border-white/10 bg-white/[0.02] group-hover/cell:border-white/20'
          }
        `}>
          {isChecked ? (
            <Check size={16} strokeWidth={3} className="text-white animate-fade-in" />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-white/15 group-hover/cell:bg-white/40 transition-colors" />
          )}
        </div>
      </div>
    </div>
  );
});

KineticHardwareCell.displayName = 'KineticHardwareCell';

/**
 * ⚡ LUXURY REFINEMENT: Spatial Blueprint Enclave Container.
 * Features 3D direct-DOM mouse tilt, real-time spatial matrix plotting, and coordinate telemetry.
 */
const SpatialBlueprintEnclave = memo(({ equipment, commonEquipment }) => {
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

    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

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
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      role="region"
      aria-label="Active Hardware Environment Blueprint Enclave"
      style={{
        transform: interactionActive
          ? 'perspective(1500px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) scale(1.01)'
          : 'perspective(1500px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="relative p-8 md:p-10 bg-[#0A0C14] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden group/enclave outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]"
    >
      {/* Precision Grid & Grain Overlay */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/enclave:opacity-10 transition-opacity duration-1000" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />

        {/* Dynamic Lens Light Spotlight */}
        <div
          className="absolute inset-0 opacity-0 group-hover/enclave:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 60%)`,
            transform: 'translateZ(20px)'
          }}
        />
      </div>

      {/* Holographic Coordinate Telemetry */}
      <div
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/enclave:opacity-100 transition-all duration-500 z-30"
        style={{ transform: 'translateZ(70px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.45rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-0.5">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span className="text-white/20">[BLUEPRINT_CORE]</span>
        </div>
      </div>

      <div className="relative z-10 space-y-8" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div>
            <h3 className="text-[0.65rem] font-mono font-black text-gray-400 uppercase tracking-[0.4em]">
              Environment Blueprint
            </h3>
            <p className="text-sm font-serif italic font-bold text-white tracking-wider mt-1">
              Real-time Spatial Synthesis Matrix
            </p>
          </div>
          <div className="px-3 py-1.5 bg-voro-secondary/10 rounded-full border border-voro-secondary/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-voro-secondary rounded-full animate-ping" />
            <span className="text-[0.55rem] font-mono font-black text-voro-secondary uppercase tracking-widest">
              SYNCED
            </span>
          </div>
        </div>

        {/* Wireframe Spatial Matrix Grid */}
        <div className="relative rounded-[2rem] bg-black/50 border border-white/5 p-6 aspect-square flex flex-col justify-between overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-grid-white opacity-[0.03] pointer-events-none" />
          <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-px bg-voro-primary/20 border-dashed pointer-events-none" />
          <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-px bg-voro-primary/20 border-dashed pointer-events-none" />

          {commonEquipment.length > 0 ? (
            <div className="absolute inset-0 p-6 grid grid-cols-3 grid-rows-3 gap-2">
              {commonEquipment.map((item) => {
                const isActive = equipment.some(e => e.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`
                      relative rounded-xl border flex flex-col items-center justify-center p-2 transition-all duration-700
                      ${isActive
                        ? 'bg-voro-primary/10 border-voro-primary/40 text-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.2)] scale-100'
                        : 'border-white/[0.02] text-gray-800 opacity-20 scale-95'
                      }
                    `}
                  >
                    <span className="text-[0.45rem] font-mono font-bold tracking-widest">
                      {item.coord}
                    </span>
                    {isActive && (
                      <span className="text-[0.5rem] font-serif font-bold italic text-white truncate max-w-full mt-1">
                        {item.name}
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-voro-primary animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* Floating Technical Status Footer */}
          <div className="relative z-10 flex justify-between text-[0.5rem] font-mono text-gray-500 tracking-wider">
            <span>MATRIX_SCALE 1:1</span>
            <span>NODES: {equipment.length}/8 ACTIVE</span>
          </div>
          <div className="relative z-10 flex justify-between text-[0.5rem] font-mono text-gray-500 tracking-wider">
            <span>KINETIC_CORE</span>
            <span>VORO_HARDWARE_OS</span>
          </div>
        </div>

        {/* Active Synced Items Inventory List */}
        {equipment.length > 0 ? (
          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 no-scrollbar">
            {equipment.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group/item hover:border-voro-primary/30 transition-all duration-500"
              >
                <div className="w-8 h-8 rounded-xl bg-voro-primary/10 border border-voro-primary/20 flex items-center justify-center text-voro-primary group-hover/item:scale-110 transition-transform">
                  <Wrench size={14} />
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <span className="text-sm font-serif italic font-bold text-white group-hover/item:text-voro-primary transition-colors truncate block">
                    {item.name}
                  </span>
                  <div className="flex items-center justify-between text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest">
                    <span>{item.category}</span>
                    <span className="text-voro-primary/80 font-bold">COORD_{item.coord}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
            <p className="text-[0.6rem] font-mono font-black text-gray-600 uppercase tracking-[0.2em]">
              Hardware Matrix Disconnected
            </p>
            <p className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-widest mt-1">
              Select equipment cells to initialize blueprint
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

SpatialBlueprintEnclave.displayName = 'SpatialBlueprintEnclave';

const GymSetup = () => {
  const equipment = useStorageKey('gym_setup') || [];
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  // 2.5-second cinematic loading sequence state
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Scanning Hardware Infrastructure...');

  useEffect(() => {
    document.title = 'VORO | Kinetic Infrastructure Enclave';

    // Fast bypass check for E2E verification tests
    if (window.__VORO_TEST_BYPASS__ || localStorage.getItem('voro_test_mode') === 'true') {
      setIsLoading(false);
      return;
    }

    // 2.5-second cinematic alignment loading sequence
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        if (prev === 30) setLoadingText('Validating Bio-Mechanical Vectors...');
        if (prev === 70) setLoadingText('Constructing Spatial Blueprint Lattice...');
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleToggleEquipment = useCallback(async (item) => {
    const isSelected = equipment.some(e => e.id === item.id);
    let updated;

    if (isSelected) {
      updated = equipment.filter(e => e.id !== item.id);
      addNotification(`${item.name} decommissioned from setup`, 'info');
    } else {
      updated = [...equipment, item];
      addNotification(`${item.name} integrated into setup`, 'success');
    }

    await setItem('gym_setup', updated);
  }, [equipment, setItem, addNotification]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020408] text-[#F0F4FF] flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute w-[500px] h-[500px] bg-voro-primary/5 rounded-full blur-[150px] animate-pulse" />

        <div className="relative z-10 flex flex-col items-center space-y-10 max-w-md text-center">
          {/* Orbital Counter-Rotating CSS Rings */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-voro-primary/40 animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-3 rounded-full border-2 border-dashed border-voro-secondary/30 animate-[spin_5s_linear_infinite_reverse]" />
            <div className="w-16 h-16 rounded-full bg-voro-primary/10 border border-voro-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.3)]">
              <Compass size={28} className="text-voro-primary animate-pulse" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-serif italic font-medium text-white tracking-tight">
              Calibrating Infrastructure
            </h2>
            <p className="text-[0.6rem] font-mono font-black text-voro-primary uppercase tracking-[0.4em] animate-pulse">
              {loadingText}
            </p>
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between items-center text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest">
              <span>Grid Alignment</span>
              <span className="text-white font-bold">{loadingProgress}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full bg-voro-primary rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(124,58,237,0.8)]"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 relative overflow-hidden pb-32">
      {/* Precision Blueprint Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-grid-white" />

      {/* Luminous Radials */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-15%] w-[45%] h-[45%] bg-voro-secondary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 relative z-10">

        {/* Editorial Boutique Header */}
        <header className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-white/5 pb-16">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 text-voro-primary">
              <Compass size={18} className="animate-[spin_6s_linear_infinite_reverse]" />
              <span className="text-[0.65rem] font-mono font-black tracking-[0.5em] uppercase">
                Hardware Enclave // SYSTEM SCHEMA
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-white tracking-tight leading-none">
              Kinetic <span className="text-voro-primary not-italic font-bold">Infrastructure</span>
            </h1>
            <p className="text-gray-500 font-mono text-[0.6rem] uppercase tracking-[0.3em] opacity-80">
              BIO-MECHANICAL RESISTANCE MATRIX & HARDWARE CALIBRATION TERMINAL
            </p>
          </div>

          <div className="flex items-center gap-6 bg-[#0A0C14] border border-white/5 rounded-[2rem] p-6 shadow-2xl">
            <div className="p-4 bg-voro-primary/10 rounded-2xl border border-voro-primary/20 text-voro-primary">
              <Layers size={22} />
            </div>
            <div>
              <p className="text-[0.55rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 mb-1">
                Active Nodes
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif italic font-bold text-white leading-none">
                  {equipment.length}
                </span>
                <span className="text-[0.6rem] font-mono text-voro-primary font-bold uppercase tracking-widest">
                  / 8 calibrated
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Master Schematic Configuration Enclave */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Main Kinetic Inventory Selector Grid */}
          <div className="lg:col-span-7 space-y-12">
            <Card variant="premium" nodeId="KINETIC_CELLS" className="p-8 md:p-12">
              <div className="relative space-y-12">

                {/* Section Branding */}
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <div>
                    <h3 className="text-2xl font-serif italic font-medium text-white mb-1">
                      Infrastructure Grid
                    </h3>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">
                      Calibrate bio-mechanical loading systems
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full">
                    <Activity size={14} className="text-voro-primary" />
                    <span className="text-[0.55rem] font-mono font-bold text-gray-400 uppercase tracking-widest">
                      SCHEMA v2.4
                    </span>
                  </div>
                </div>

                {/* Categories Grid */}
                {CATEGORIES.map(category => (
                  <div key={category} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <h4 className="text-[0.65rem] font-mono font-black text-voro-primary uppercase tracking-[0.4em]">
                        {category}
                      </h4>
                      <div className="h-px flex-1 bg-gradient-to-r from-voro-primary/30 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {COMMON_EQUIPMENT
                        .filter(e => e.category === category)
                        .map(item => (
                          <KineticHardwareCell
                            key={item.id}
                            item={item}
                            isChecked={equipment.some(e => e.id === item.id)}
                            onToggle={() => handleToggleEquipment(item)}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Bespoke Interactive Blueprint Spatial Enclave */}
          <div className="lg:col-span-5 space-y-8 sticky top-8">
            <SpatialBlueprintEnclave
              equipment={equipment}
              commonEquipment={COMMON_EQUIPMENT}
            />
          </div>

        </section>
      </div>
    </div>
  );
};

export default GymSetup;
