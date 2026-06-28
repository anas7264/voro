import React, { useEffect, useState } from 'react';
import { Edit2, Save, X, User as UserIcon, Ruler, Weight, Target, Activity, Shield } from 'lucide-react';
import { Button, Card, Input, Header, Avatar } from '@/components';
import { useApp } from '@/hooks/useAppContext';
import { useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { calculateBMI, calculateBMR, calculateTDEE } from '@/utils/calculators';
import { validateFitnessProfile } from '@/utils/validators';

const Profile = () => {
  const { user, updateUser: setUser } = useApp();
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * By using useStorageMethods() instead of useStorage(), we obtain a stable
   * reference to storage actions without subscribing to the global state manifest.
   * This prevents Profile from re-rendering when unrelated data (e.g. nutrition, habits) changes.
   */
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
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30 overflow-hidden">
      {/* Ambient background architectural lighting */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-voro-primary/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-secondary/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
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
                <div className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-md flex items-center gap-3">
                   <Shield size={12} className="text-voro-secondary" />
                   <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-widest">Status: <span className="text-voro-secondary">Secured</span></span>
                </div>
                <div className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-md flex items-center gap-3">
                   <Activity size={12} className="text-voro-primary" />
                   <span className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-widest">Sync: <span className="text-voro-primary">Active</span></span>
                </div>
              </div>
            </div>
          </div>

          {!editing && (
            <Button
              onClick={() => setEditing(true)}
              className="px-10 h-16 !rounded-full shadow-2xl shadow-voro-primary/20"
            >
              <Edit2 size={18} className="mr-3" />
              Re-Engineer Identity
            </Button>
          )}
        </div>

        {editing ? (
          <div className="space-y-10 animate-slide-up max-w-4xl">
            <Card className="p-12 bg-[#0A0C14]/80 backdrop-blur-3xl border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <Input
                  label="Display Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <Input
                  label="Biological Age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                />
                <div className="space-y-4">
                  <label className="block text-[0.6rem] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Gender Identification</label>
                  <div className="flex gap-3">
                    {['Male', 'Female', 'Other'].map(g => (
                      <button
                        key={g}
                        onClick={() => setFormData(p => ({ ...p, gender: g }))}
                        className={`flex-1 py-4 rounded-2xl text-[0.65rem] font-bold uppercase tracking-widest transition-all active:scale-95 ${formData.gender === g ? 'bg-voro-primary text-white shadow-lg shadow-voro-primary/20' : 'bg-white/5 text-gray-500 hover:bg-white/10 border border-white/5'}`}
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
                  value={formData.heightCm}
                  onChange={handleInputChange}
                />
                <Input
                  label="Current Magnitude (kg)"
                  type="number"
                  name="currentWeight"
                  value={formData.currentWeight}
                  onChange={handleInputChange}
                  step="0.1"
                />
                <Input
                  label="Target Magnitude (kg)"
                  type="number"
                  name="targetWeight"
                  value={formData.targetWeight}
                  onChange={handleInputChange}
                  step="0.1"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-6 mt-16">
                <Button onClick={handleSave} className="flex-[2] h-16 !rounded-full">Confirm Neural Synchronization</Button>
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
              {[
                { label: 'Verticality', value: user.heightCm, unit: 'cm', icon: Ruler, color: 'voro-primary' },
                { label: 'Mass', value: user.currentWeight, unit: 'kg', icon: Weight, color: 'voro-secondary' },
                { label: 'Biometric Index', value: user.bmi?.toFixed(1), unit: 'BMI', icon: Activity, color: 'voro-accent' }
              ].map((stat, i) => (
                <Card key={i} className="p-10 group hover:border-white/20 transition-all duration-700 bg-boutique-grain">
                  <div className="flex items-center justify-between mb-10">
                    <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.4em] group-hover:text-gray-400 transition-colors">{stat.label}</span>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-gray-700 group-hover:text-white group-hover:bg-white/5 group-hover:border-white/10 transition-all duration-700">
                      <stat.icon size={20} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-6xl font-serif italic font-medium text-white tracking-tighter leading-none">{stat.value}</span>
                    <span className="text-[0.65rem] font-mono font-bold text-gray-600 uppercase tracking-[0.3em]">{stat.unit}</span>
                  </div>
                  {/* Subtle decorative glow */}
                  <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-${stat.color}/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               {/* Objective Matrix */}
               <Card className="p-12 space-y-12 bg-boutique-grain">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-voro-primary/10 text-voro-primary rounded-2xl shadow-lg shadow-voro-primary/10">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="text-[0.7rem] font-black uppercase tracking-[0.5em] text-white">Objective Matrix</h3>
                    <p className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-[0.2em] mt-1">Strategic Biological Targets</p>
                  </div>
                </div>

                <div className="space-y-10">
                  {[
                    { label: 'Primary Directive', value: user.primaryGoal },
                    { label: 'Target Mass', value: `${user.targetWeight} kg` },
                    { label: 'Caloric Bound', value: `${user.calorieGoal} kcal` },
                    { label: 'Metabolic Ceiling (TDEE)', value: `${user.tdee} kcal` }
                  ].map((goal, i) => (
                    <div key={i} className="group/item flex items-center justify-between border-b border-white/[0.03] pb-8 last:border-0 last:pb-0">
                      <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em] group-hover/item:text-gray-400 transition-colors">{goal.label}</span>
                      <span className="text-2xl font-serif italic font-medium text-white tracking-tight group-hover/item:text-voro-primary transition-colors">{goal.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Core Signatures Archive */}
              <Card className="p-12 space-y-12 bg-boutique-grain">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-voro-secondary/10 text-voro-secondary rounded-2xl shadow-lg shadow-voro-secondary/10">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h3 className="text-[0.7rem] font-black uppercase tracking-[0.5em] text-white">Core Signatures</h3>
                    <p className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-[0.2em] mt-1">Immutable Identity Markers</p>
                  </div>
                </div>

                <div className="space-y-10">
                  {[
                    { label: 'Subject Name', value: user.name },
                    { label: 'Biological Age', value: `${user.age} Years` },
                    { label: 'Gender Archetype', value: user.gender },
                    { label: 'Initialization Date', value: new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }
                  ].map((detail, i) => (
                    <div key={i} className="group/item flex items-center justify-between border-b border-white/[0.03] pb-8 last:border-0 last:pb-0">
                      <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em] group-hover/item:text-gray-400 transition-colors">{detail.label}</span>
                      <span className="text-2xl font-serif italic font-medium text-white uppercase tracking-tight group-hover/item:text-voro-secondary transition-colors">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Tactical Footer detail */}
            <div className="flex items-center justify-between pt-12 border-t border-white/[0.03]">
               <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-voro-primary/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-voro-primary/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-voro-primary/10" />
               </div>
               <span className="text-[0.5rem] font-mono text-gray-800 uppercase tracking-[0.8em]">VORO_IDENTITY_MANIFEST_V1.0</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
