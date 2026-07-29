import React, { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { Check, Layers, Compass, Cpu, Wrench } from 'lucide-react';
import Card from '@/components/Card';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static metadata.
 * Prevents redundant object instantiation on every component render.
 */
const COMMON_EQUIPMENT = [
  { id: 1, name: 'Dumbbells', category: 'Free Weights', coord: 'W_01', type: 'Load-bearing resistance' },
  { id: 2, name: 'Barbell', category: 'Free Weights', coord: 'W_02', type: 'Load-bearing resistance' },
  { id: 3, name: 'Bench', category: 'Equipment', coord: 'EQ_01', type: 'Structural platform' },
  { id: 4, name: 'Rack', category: 'Equipment', coord: 'EQ_02', type: 'Structural platform' },
  { id: 5, name: 'Cables', category: 'Machines', coord: 'MC_01', type: 'Pulley-directed loading' },
  { id: 6, name: 'Treadmill', category: 'Cardio', coord: 'C_01', type: 'Metabolic engine' },
  { id: 7, name: 'Stationary Bike', category: 'Cardio', coord: 'C_02', type: 'Metabolic engine' },
  { id: 8, name: 'Rowing Machine', category: 'Cardio', coord: 'C_03', type: 'Metabolic engine' },
];

const CATEGORIES = ['Free Weights', 'Equipment', 'Machines', 'Cardio'];

/**
 * Bespoke Kinetic Cell Terminal.
 * Implements the Accessible 3D Interaction Pattern:
 * - Dynamic mouse tracking for real-time 3D tilt.
 * - Static 4-degree volumetric tilt on focus for keyboard accessibility.
 * - Distinct, premium focus halos and explicit ARIA descriptors.
 */
const KineticCellTerminal = ({ item, isChecked, onToggle }) => {
  const cellRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cellRef.current) return;
    const rect = cellRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation (max 10 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 12;
    const tiltX = (0.5 - (y / rect.height)) * 12;

    cellRef.current.style.setProperty('--cell-mouse-x', `${x}px`);
    cellRef.current.style.setProperty('--cell-mouse-y', `${y}px`);
    cellRef.current.style.setProperty('--cell-tilt-x', `${tiltX}deg`);
    cellRef.current.style.setProperty('--cell-tilt-y', `${tiltY}deg`);
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggle();
    }
  };

  const activeStyles = useMemo(() => {
    if (isHovered && !isFocused) {
      return {
        transform: 'perspective(1000px) rotateX(var(--cell-tilt-x, 0deg)) rotateY(var(--cell-tilt-y, 0deg)) translateY(-2px)',
        transition: 'none'
      };
    }
    if (isFocused) {
      // Accessible 3D Interaction Pattern: static 4-degree tilt on keyboard focus
      return {
        transform: 'perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(-2px)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      };
    }
    return {
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
    };
  }, [isHovered, isFocused]);

  return (
    <div
      ref={cellRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={handleKeyDown}
      onClick={onToggle}
      tabIndex={0}
      role="checkbox"
      aria-checked={isChecked}
      aria-label={`Toggle ${item.name} for current environment setup`}
      style={activeStyles}
      className={`
        relative p-6 rounded-[2rem] border transition-all duration-500 cursor-pointer select-none group/cell overflow-hidden outline-none
        focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408]
        ${isChecked
          ? 'bg-[#0A0C14]/80 border-voro-primary/30 shadow-[0_20px_40px_-10px_rgba(124,58,237,0.15)]'
          : 'bg-[#0A0C14]/30 border-white/[0.03] hover:border-white/10 hover:bg-[#0A0C14]/60'
        }
      `}
    >
      {/* Laser Reflection Light Lens on Hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover/cell:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(150px circle at var(--cell-mouse-x, 0px) var(--cell-mouse-y, 0px), rgba(124, 58, 237, 0.1), transparent 80%)`
        }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[0.5rem] font-mono text-gray-600 font-bold tracking-widest uppercase">
              [{item.coord}]
            </span>
            <div className={`w-1 h-1 rounded-full ${isChecked ? 'bg-voro-primary animate-pulse' : 'bg-gray-800'}`} />
          </div>
          <div>
            <h4 className="text-base font-serif italic font-bold text-white tracking-tight group-hover/cell:text-voro-primary transition-colors duration-300">
              {item.name}
            </h4>
            <p className="text-[0.55rem] font-mono text-gray-500 tracking-wider uppercase mt-1">
              {item.type}
            </p>
          </div>
        </div>

        {/* Custom Glowing Binary Signal */}
        <div className={`
          w-8 h-8 rounded-xl border transition-all duration-500 flex items-center justify-center
          ${isChecked
            ? 'bg-voro-primary border-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.5)]'
            : 'border-white/5 bg-white/[0.01]'
          }
        `}>
          {isChecked ? (
            <Check size={14} strokeWidth={3} className="text-white animate-fade-in" />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover/cell:bg-white/25 transition-colors" />
          )}
        </div>
      </div>
    </div>
  );
};

const GymSetup = () => {
  const equipment = useStorageKey('gym_setup') || [];
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  useEffect(() => {
    document.title = 'VORO | Kinetic Blueprint Console';
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

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 relative overflow-hidden pb-24">
      {/* Architectural Blueprint Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-grid-white" />

      {/* Luminous Radials */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-15%] w-[45%] h-[45%] bg-voro-secondary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">

        {/* Luxury Typography Header */}
        <header className="mb-20 space-y-4">
          <div className="flex items-center gap-3 text-voro-primary">
            <Compass size={18} className="animate-[spin_4s_linear_infinite_reverse]" />
            <span className="text-[0.6rem] font-mono font-bold tracking-[0.5em] uppercase">SYSTEM SCHEMA // ENVIRONMENT DESIGN</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tight leading-none">
            Kinetic <span className="text-voro-primary not-italic font-bold">Infrastructure</span>
          </h1>
          <p className="text-gray-500 font-mono text-[0.6rem] uppercase tracking-[0.4em]">
            Calibrate available bio-mechanic loading mechanisms
          </p>
        </header>

        {/* Master Schematic Configuration Console */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Main Kinetic Inventory Panel */}
          <div className="lg:col-span-8 space-y-10">
            <Card variant="premium" nodeId="KINETIC_CELLS" className="p-10 md:p-12">
              <div className="relative space-y-12">

                {/* Section Branding */}
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-6">
                  <div>
                    <h3 className="text-xl font-serif italic font-medium text-white mb-1">
                      Infrastructure Grid
                    </h3>
                    <p className="text-xs text-gray-500 italic">
                      Verify and activate the equipment systems currently available.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-voro-primary" />
                    <span className="text-[0.55rem] font-mono font-bold text-gray-500 uppercase tracking-widest">
                      MATRIX v1.4
                    </span>
                  </div>
                </div>

                {/* Grid organized by standard luxury categories */}
                {CATEGORIES.map(category => (
                  <div key={category} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <h4 className="text-[0.65rem] font-black text-voro-primary uppercase tracking-[0.5em]">
                        {category}
                      </h4>
                      <div className="h-px flex-1 bg-gradient-to-r from-voro-primary/20 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {COMMON_EQUIPMENT
                        .filter(e => e.category === category)
                        .map(item => (
                          <KineticCellTerminal
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

          {/* Bespoke Interactive Blueprint Spatial Overlay */}
          <div className="lg:col-span-4 space-y-8">
            <Card variant="premium" nodeId="ACTIVE_SCHEMATIC" className="p-8">
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-6 mb-8">
                <div>
                  <h3 className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.4em]">
                    Active Environment Blueprint
                  </h3>
                  <p className="text-[0.55rem] font-mono text-voro-secondary tracking-widest uppercase mt-0.5">
                    Real-time Spatial Synthesis
                  </p>
                </div>
                <div className="px-3 py-1 bg-voro-secondary/10 rounded-full border border-voro-secondary/20 flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-voro-secondary rounded-full animate-ping" />
                  <span className="text-[0.5rem] font-black text-voro-secondary uppercase tracking-widest">
                    SYNC
                  </span>
                </div>
              </div>

              {/* Blueprint Layout Wireframe Visualization */}
              <div className="relative rounded-[2rem] bg-black/40 border border-white/[0.03] p-6 mb-8 overflow-hidden aspect-square flex flex-col justify-between">

                {/* Cybernetic Grid & Grid-Points */}
                <div className="absolute inset-0 bg-grid-white opacity-[0.03] pointer-events-none" />
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-px bg-voro-primary/10 border-dashed pointer-events-none" />
                <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-px bg-voro-primary/10 border-dashed pointer-events-none" />

                {/* Active Infrastructure Plotting */}
                {equipment.length > 0 ? (
                  <div className="absolute inset-0 p-8 grid grid-cols-3 grid-rows-3 gap-2">
                    {/* Render active items onto physical blueprint grid coordinates */}
                    {COMMON_EQUIPMENT.map((item, index) => {
                      const isActive = equipment.some(e => e.id === item.id);
                      return (
                        <div
                          key={item.id}
                          className={`
                            relative rounded-xl border flex flex-col items-center justify-center p-2 transition-all duration-1000
                            ${isActive
                              ? 'bg-voro-primary/5 border-voro-primary/30 text-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.1)] scale-100'
                              : 'border-white/[0.02] text-gray-800 opacity-20 scale-95'
                            }
                          `}
                        >
                          <span className="text-[0.4rem] font-mono font-bold tracking-widest">
                            {item.coord}
                          </span>
                          {isActive && (
                            <span className="text-[0.45rem] font-serif font-black italic text-white truncate max-w-full mt-1">
                              {item.name}
                            </span>
                          )}
                          {isActive && (
                            <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-voro-primary animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border border-dashed border-white/5 flex items-center justify-center bg-white/[0.01] animate-[spin_60s_linear_infinite]" />
                      <Cpu size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-800 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[0.6rem] font-mono font-black text-gray-600 uppercase tracking-[0.3em]">
                        VOID INFRASTRUCTURE
                      </p>
                      <p className="text-[0.5rem] text-gray-700 uppercase font-bold tracking-widest mt-1">
                        Map active gear nodes to sync
                      </p>
                    </div>
                  </div>
                )}

                {/* Floating Technical Markings */}
                <div className="relative z-10 flex justify-between text-[0.45rem] font-mono text-gray-600 tracking-wider">
                  <span>SCALE: 1:1.2</span>
                  <span>NODE_CT: {equipment.length}/8</span>
                </div>
                <div className="relative z-10 flex justify-between text-[0.45rem] font-mono text-gray-600 tracking-wider">
                  <span>ENVIRONMENT_CORE</span>
                  <span>VORO_KINETICS_OS</span>
                </div>
              </div>

              {/* Live list matching the visual blueprint */}
              {equipment.length > 0 ? (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {equipment.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-white/[0.01] border border-white/[0.03] rounded-2xl group/item hover:border-voro-secondary/20 transition-all duration-500"
                    >
                      <div className="w-8 h-8 rounded-xl bg-voro-secondary/10 flex items-center justify-center text-voro-secondary group-hover/item:scale-110 transition-transform">
                        <Wrench size={14} />
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <span className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors truncate block">
                          {item.name}
                        </span>
                        <div className="flex items-center justify-between text-[0.5rem] font-mono text-gray-600 uppercase tracking-widest">
                          <span>{item.category}</span>
                          <span>COORD_{item.coord}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center border border-dashed border-white/5 rounded-2xl">
                  <p className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-[0.2em]">
                    No hardware synced
                  </p>
                </div>
              )}
            </Card>
          </div>

        </section>
      </div>
    </div>
  );
};

export default GymSetup;
