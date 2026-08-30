import React, { useEffect, useState, useRef, useMemo, memo } from 'react';
import { Edit2, Save, X, User as UserIcon, Ruler, Weight, Target, Activity, Shield, Sparkles } from 'lucide-react';
import { Button, Card, Input, Header, Avatar } from '@/components';
import { useApp } from '@/hooks/useAppContext';
import { useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { calculateBMI, calculateBMR, calculateTDEE } from '@/utils/calculators';
import { validateFitnessProfile } from '@/utils/validators';

// 🧊 Frozen Module-Scoped Static Configuration & Formatters (Zero Runtime Allocation)
const GENDER_OPTIONS = Object.freeze(['Male', 'Female', 'Other']);

const INIT_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});

/**
 * ⚡ LUXURY REFINEMENT: BiometricStatCard
 * Implements 60fps direct-DOM volumetric 3D mouse tilt tracking,
 * holographic coordinate telemetry overlays (TX_...°, TY_...°),
 * W3C APG compliant static 4-degree keyboard focus tilts, and liquid border illumination.
 */
const BiometricStatCard = memo(({ label, value, unit, icon: Icon, color, nodeId }) => {
  const containerRef = useRef(null);
  const txRef = useRef(null);
  const tyRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 18;
    const tiltX = (0.5 - (y / rect.height)) * 18;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (txRef.current) txRef.current.innerText = tiltX.toFixed(1);
    if (tyRef.current) tyRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (txRef.current) txRef.current.innerText = "4.0";
      if (tyRef.current) tyRef.current.innerText = "-4.0";
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
      onMouseLeave={() => {
        setIsHovered(false);
        if (containerRef.current) {
          containerRef.current.style.setProperty('--tilt-x', '0deg');
          containerRef.current.style.setProperty('--tilt-y', '0deg');
        }
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      role="article"
      aria-label={`${label}: ${value} ${unit}`}
      style={{
        transform: interactionActive
          ? 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="group/biocard relative p-10 rounded-[2.5rem] bg-[#0A0C14]/80 border border-white/5 backdrop-blur-3xl shadow-[0_30px_70px_rgba(0,0,0,0.6)] hover:border-voro-primary/30 transition-all duration-700 outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408] overflow-hidden"
    >
      {/* 🛰️ Liquid Border Perimeter Illumination */}
      <div
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover/biocard:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          padding: '1px',
          background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.35), transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Backglow Spotlight */}
      <div
        className="absolute inset-0 opacity-0 group-hover/biocard:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 50%)`,
          transform: 'translateZ(20px)'
        }}
      />

      {/* Holographic Telemetry Overlay */}
      <div
        className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/biocard:opacity-100 group-focus-visible:opacity-100 transition-all duration-500 z-20"
        style={{ transform: 'translateZ(80px)' }}
      >
        <div className="flex flex-col items-end font-mono text-[0.45rem] font-bold text-voro-primary/60 tracking-[0.25em] space-y-0.5">
          <span>TX_<span ref={txRef}>0.0</span>°</span>
          <span>TY_<span ref={tyRef}>0.0</span>°</span>
          <span className="text-white/20">[{nodeId}]</span>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between mb-10" style={{ transform: 'translateZ(40px)' }}>
        <span className="text-[0.65rem] font-mono font-black text-gray-500 uppercase tracking-[0.4em] group-hover/biocard:text-gray-300 transition-colors">
          {label}
        </span>
        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl text-gray-400 group-hover/biocard:text-white group-hover/biocard:bg-voro-primary/10 group-hover/biocard:border-voro-primary/30 transition-all duration-700 shadow-inner">
          <Icon size={20} />
        </div>
      </div>

      <div className="relative z-10 flex items-baseline gap-4" style={{ transform: 'translateZ(60px)' }}>
        <span className="text-6xl font-serif italic font-medium text-white tracking-tighter leading-none group-hover/biocard:text-voro-primary transition-colors duration-500">
          {value}
        </span>
        <span className="text-[0.65rem] font-mono font-bold text-gray-500 uppercase tracking-[0.3em]">
          {unit}
        </span>
      </div>

      {/* Attestation Hash Badge */}
      <div
        className="absolute bottom-4 right-8 pointer-events-none opacity-20 group-hover/biocard:opacity-40 transition-opacity duration-700 font-mono text-[0.4rem] font-black text-white/30 tracking-[0.3em] uppercase"
        style={{ transform: 'translateZ(30px)' }}
      >
        0xBIO_SPECIMEN_NODE
      </div>
    </div>
  );
});

BiometricStatCard.displayName = 'BiometricStatCard';

/**
 * ⚡ LUXURY REFINEMENT: ObjectiveMatrixCard
 * Interactive 3D card presenting strategic biological goals.
 */
const ObjectiveMatrixCard = memo(({ primaryGoal, targetWeight, calorieGoal, tdee }) => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const goals = useMemo(() => [
    { label: 'Primary Directive', value: primaryGoal || 'Body Recomposition' },
    { label: 'Target Mass', value: `${targetWeight || '--'} kg` },
    { label: 'Caloric Bound', value: `${calorieGoal || '--'} kcal` },
    { label: 'Metabolic Ceiling (TDEE)', value: `${tdee || '--'} kcal` }
  ], [primaryGoal, targetWeight, calorieGoal, tdee]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group/objcard relative p-12 rounded-[2.5rem] bg-[#0A0C14]/80 border border-white/5 backdrop-blur-3xl shadow-[0_30px_70px_rgba(0,0,0,0.6)] space-y-12 overflow-hidden hover:border-voro-primary/30 transition-all duration-700"
    >
      {/* Backglow Spotlight */}
      <div
        className="absolute inset-0 opacity-0 group-hover/objcard:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.06), transparent 50%)`,
        }}
      />

      <div className="flex items-center gap-5 relative z-10">
        <div className="p-4 bg-voro-primary/10 text-voro-primary rounded-2xl border border-voro-primary/20 shadow-lg shadow-voro-primary/10">
          <Target size={24} />
        </div>
        <div>
          <span className="text-[0.55rem] font-mono font-black text-voro-primary uppercase tracking-[0.3em] block mb-0.5">
            0xOBJ_MATRIX_v4
          </span>
          <h3 className="text-xl font-serif italic font-bold text-white tracking-tight">
            Objective Matrix
          </h3>
          <p className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-[0.2em] mt-0.5">
            Strategic Biological Targets
          </p>
        </div>
      </div>

      <div className="space-y-8 relative z-10">
        {goals.map((goal, i) => (
          <div key={i} className="group/item flex items-center justify-between border-b border-white/[0.03] pb-6 last:border-0 last:pb-0">
            <span className="text-[0.65rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] group-hover/item:text-gray-300 transition-colors">
              {goal.label}
            </span>
            <span className="text-2xl font-serif italic font-medium text-white tracking-tight group-hover/item:text-voro-primary transition-colors">
              {goal.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

ObjectiveMatrixCard.displayName = 'ObjectiveMatrixCard';

/**
 * ⚡ LUXURY REFINEMENT: IdentitySignaturesCard
 * Interactive 3D card presenting immutable biometric markers and system details.
 */
const IdentitySignaturesCard = memo(({ name, age, gender, createdAt }) => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const formattedInitDate = useMemo(() => {
    const d = createdAt ? new Date(createdAt) : new Date();
    return INIT_DATE_FORMATTER.format(d);
  }, [createdAt]);

  const details = useMemo(() => [
    { label: 'Subject Name', value: name || 'Anonymous' },
    { label: 'Biological Age', value: age ? `${age} Years` : '--' },
    { label: 'Gender Archetype', value: gender || 'Unspecified' },
    { label: 'Initialization Date', value: formattedInitDate }
  ], [name, age, gender, formattedInitDate]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group/sigcard relative p-12 rounded-[2.5rem] bg-[#0A0C14]/80 border border-white/5 backdrop-blur-3xl shadow-[0_30px_70px_rgba(0,0,0,0.6)] space-y-12 overflow-hidden hover:border-voro-secondary/30 transition-all duration-700"
    >
      {/* Backglow Spotlight */}
      <div
        className="absolute inset-0 opacity-0 group-hover/sigcard:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16, 185, 129, 0.06), transparent 50%)`,
        }}
      />

      <div className="flex items-center gap-5 relative z-10">
        <div className="p-4 bg-voro-secondary/10 text-voro-secondary rounded-2xl border border-voro-secondary/20 shadow-lg shadow-voro-secondary/10">
          <Activity size={24} />
        </div>
        <div>
          <span className="text-[0.55rem] font-mono font-black text-voro-secondary uppercase tracking-[0.3em] block mb-0.5">
            0xSIG_ARCHIVE_v4
          </span>
          <h3 className="text-xl font-serif italic font-bold text-white tracking-tight">
            Core Signatures
          </h3>
          <p className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-[0.2em] mt-0.5">
            Immutable Identity Markers
          </p>
        </div>
      </div>

      <div className="space-y-8 relative z-10">
        {details.map((detail, i) => (
          <div key={i} className="group/item flex items-center justify-between border-b border-white/[0.03] pb-6 last:border-0 last:pb-0">
            <span className="text-[0.65rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] group-hover/item:text-gray-300 transition-colors">
              {detail.label}
            </span>
            <span className="text-2xl font-serif italic font-medium text-white uppercase tracking-tight group-hover/item:text-voro-secondary transition-colors">
              {detail.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

IdentitySignaturesCard.displayName = 'IdentitySignaturesCard';

const Profile = () => {
  const { user, updateUser: setUser } = useApp();
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(user || {});

  useEffect(() => {
    document.title = 'VORO | Profile Archetype';
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSave = () => {
    const { valid, errors } = validateFitnessProfile({
      name: formData.name,
      age: formData.age,
      height: formData.heightCm,
      weight: formData.currentWeight,
      gender: formData.gender,
      goal: formData.primaryGoal,
      activityLevel: formData.activityLevel || 'moderately_active'
    });

    if (!valid) {
      addNotification(Object.values(errors)[0], 'error');
      return;
    }

    const bmi = calculateBMI(formData.currentWeight, formData.heightCm);
    const bmr = Number(calculateBMR(formData.currentWeight, formData.heightCm, formData.age, formData.gender || 'Male'));
    const tdee = calculateTDEE(bmr, formData.activityLevel || 'moderately_active');

    const updated = {
      ...formData,
      bmi: Number(bmi),
      bmr: Math.round(bmr),
      tdee,
    };

    const syncIdentity = async () => {
      await setItem('voro_profile', updated);
      setUser(updated);
      addNotification('Neural identity synchronized', 'success');
      setEditing(false);
    };

    syncIdentity();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30 overflow-hidden relative">
      {/* Ambient background architectural lighting & cybernetic grain */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-voro-primary/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-secondary/[0.03] rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid-white opacity-[0.015]" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-24">
          <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
            {/* Neural Identity Node Integration */}
            <Avatar
              size="specimen-xl"
              src={user.avatarUrl}
              alt={user.name}
              status="syncing"
              className="shadow-2xl"
            />

            <div className="space-y-6">
              <Header
                eyebrow="Identity_Matrix_v4.2"
                title={<>Subject <span className="text-voro-primary not-italic font-bold">{user.name}</span></>}
                subtitle="High-fidelity biological profile and system-active archetype."
                className="!mb-0"
              />
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-md flex items-center gap-3 shadow-inner">
                   <Shield size={12} className="text-voro-secondary" />
                   <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-widest">Status: <span className="text-voro-secondary">Secured</span></span>
                </div>
                <div className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-md flex items-center gap-3 shadow-inner">
                   <Activity size={12} className="text-voro-primary animate-pulse" />
                   <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-widest">Sync: <span className="text-voro-primary">Active</span></span>
                </div>
              </div>
            </div>
          </div>

          {!editing && (
            <Button
              onClick={() => setEditing(true)}
              className="px-10 h-16 !rounded-full shadow-2xl shadow-voro-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Edit2 size={18} className="mr-3" />
              Re-Engineer Identity
            </Button>
          )}
        </div>

        {editing ? (
          <div className="space-y-10 animate-slide-up max-w-4xl mx-auto">
            <Card className="p-12 bg-[#0A0C14]/90 backdrop-blur-3xl border-voro-primary/20 shadow-[0_40px_80px_rgba(0,0,0,0.8),0_0_40px_rgba(124,58,237,0.15)] rounded-[2.5rem]">
              <div className="flex items-center gap-3 border-b border-white/5 pb-8 mb-10">
                <Sparkles size={20} className="text-voro-primary" />
                <h2 className="text-2xl font-serif italic text-white font-bold tracking-tight">
                  Re-Engineer Neural Identity
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Input
                  label="Display Name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  maxLength={50}
                />
                <Input
                  label="Biological Age"
                  type="number"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleInputChange}
                />
                <div className="space-y-3">
                  <label className="block text-[0.6rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 ml-1">
                    Gender Identification
                  </label>
                  <div className="flex gap-3">
                    {GENDER_OPTIONS.map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, gender: g }))}
                        className={`flex-1 py-4 rounded-2xl text-[0.65rem] font-mono font-black uppercase tracking-widest transition-all duration-300 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-voro-primary ${formData.gender === g ? 'bg-voro-primary text-white shadow-lg shadow-voro-primary/20 border border-white/20' : 'bg-white/5 text-gray-500 hover:bg-white/10 border border-white/5'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <Input
                  label="Height (cm)"
                  type="number"
                  name="heightCm"
                  value={formData.heightCm || ''}
                  onChange={handleInputChange}
                />
                <Input
                  label="Current Magnitude (kg)"
                  type="number"
                  name="currentWeight"
                  value={formData.currentWeight || ''}
                  onChange={handleInputChange}
                  step="0.1"
                />
                <Input
                  label="Target Magnitude (kg)"
                  type="number"
                  name="targetWeight"
                  value={formData.targetWeight || ''}
                  onChange={handleInputChange}
                  step="0.1"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-6 mt-16 pt-8 border-t border-white/5">
                <Button onClick={handleSave} className="flex-[2] h-16 !rounded-full">
                  Confirm Neural Synchronization
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setFormData(user);
                    setEditing(false);
                  }}
                  className="flex-1 h-16 !rounded-full"
                >
                  Discard
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in">
            {/* Biometric Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <BiometricStatCard
                label="Verticality"
                value={user.heightCm || '--'}
                unit="cm"
                icon={Ruler}
                color="voro-primary"
                nodeId="VERT_01"
              />
              <BiometricStatCard
                label="Mass"
                value={user.currentWeight || '--'}
                unit="kg"
                icon={Weight}
                color="voro-secondary"
                nodeId="MASS_02"
              />
              <BiometricStatCard
                label="Biometric Index"
                value={user.bmi ? user.bmi.toFixed(1) : '--'}
                unit="BMI"
                icon={Activity}
                color="voro-accent"
                nodeId="INDEX_03"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Objective Matrix Card */}
              <ObjectiveMatrixCard
                primaryGoal={user.primaryGoal}
                targetWeight={user.targetWeight}
                calorieGoal={user.calorieGoal}
                tdee={user.tdee}
              />

              {/* Core Signatures Archive */}
              <IdentitySignaturesCard
                name={user.name}
                age={user.age}
                gender={user.gender}
                createdAt={user.createdAt}
              />
            </div>

            {/* Tactical Footer Detail */}
            <div className="flex items-center justify-between pt-12 border-t border-white/[0.03]">
               <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-voro-primary/60 shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-voro-primary/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-voro-primary/20" />
               </div>
               <span className="text-[0.5rem] font-mono text-gray-700 uppercase tracking-[0.8em]">
                 VORO_IDENTITY_MANIFEST_V4.2
               </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;