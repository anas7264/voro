import React, { useEffect, useState } from 'react';
import { Edit2, Save, X, User as UserIcon, Ruler, Weight, Target, Activity } from 'lucide-react';
import { Button, Card, Input, Header } from '@/components';
import { useApp } from '@/hooks/useAppContext';
import { useStorage } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { calculateBMI, calculateBMR, calculateTDEE } from '@/utils/calculators';
import { validateFitnessProfile } from '@/utils/validators';

const Profile = () => {
  const { user, updateUser: setUser } = useApp();
  const { setStorage } = useStorage();
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

    setStorage('voro_profile', updated);
    setUser(updated);
    addNotification('Neural identity synchronized', 'success');
    setEditing(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F0F4FF] pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <Header
          eyebrow="Identity Matrix"
          title={<>Subject <span className="text-voro-primary not-italic font-bold">{user.name}</span></>}
          action={!editing && (
            <Button
              onClick={() => setEditing(true)}
              className="px-8 shadow-xl shadow-voro-primary/20"
            >
              <Edit2 size={18} className="mr-2" />
              Modify Identity
            </Button>
          )}
        />

        {editing ? (
          <div className="space-y-10 animate-slide-up">
            <Card className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
                  <div className="flex gap-2">
                    {['Male', 'Female', 'Other'].map(g => (
                      <button
                        key={g}
                        onClick={() => setFormData(p => ({ ...p, gender: g }))}
                        className={`flex-1 py-3 rounded-xl text-[0.65rem] font-bold uppercase tracking-widest transition-all ${formData.gender === g ? 'bg-voro-primary text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10 border border-white/5'}`}
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

              <div className="flex gap-4 mt-12">
                <Button onClick={handleSave} className="flex-1">Synchronize Profile</Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setFormData(user);
                    setEditing(false);
                  }}
                  className="px-10"
                >
                  Discard Changes
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Biometric Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Verticality', value: user.heightCm, unit: 'cm', icon: Ruler },
                { label: 'Mass', value: user.currentWeight, unit: 'kg', icon: Weight },
                { label: 'Biometric Index', value: user.bmi?.toFixed(1), unit: 'BMI', icon: Activity }
              ].map((stat, i) => (
                <Card key={i} className="p-8 group hover:-translate-y-1 transition-all duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.3em]">{stat.label}</span>
                    <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-gray-600 group-hover:text-voro-primary transition-colors">
                      <stat.icon size={18} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-serif italic font-bold text-white tracking-tighter">{stat.value}</span>
                    <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-widest">{stat.unit}</span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Objectives */}
               <Card className="p-10 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-voro-primary/10 text-voro-primary rounded-xl">
                    <Target size={20} />
                  </div>
                  <h3 className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-white">Objective Matrix</h3>
                </div>

                <div className="space-y-8">
                  {[
                    { label: 'Primary Directive', value: user.primaryGoal },
                    { label: 'Target Mass', value: `${user.targetWeight} kg` },
                    { label: 'Caloric Bound', value: `${user.calorieGoal} kcal` },
                    { label: 'Metabolic Ceiling (TDEE)', value: `${user.tdee} kcal` }
                  ].map((goal, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-white/5 pb-6 last:border-0 last:pb-0">
                      <span className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.2em]">{goal.label}</span>
                      <span className="text-xl font-serif italic font-bold text-white">{goal.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Identity Details */}
              <Card className="p-10 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-voro-secondary/10 text-voro-secondary rounded-xl">
                    <Activity size={20} />
                  </div>
                  <h3 className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-white">Core Signatures</h3>
                </div>

                <div className="space-y-8">
                  {[
                    { label: 'Subject Name', value: user.name },
                    { label: 'Biological Age', value: `${user.age} Years` },
                    { label: 'Gender Archetype', value: user.gender },
                    { label: 'Initialization Date', value: new Date(user.createdAt || Date.now()).toLocaleDateString() }
                  ].map((detail, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-white/5 pb-6 last:border-0 last:pb-0">
                      <span className="text-[0.65rem] font-black text-gray-500 uppercase tracking-[0.2em]">{detail.label}</span>
                      <span className="text-xl font-serif italic font-bold text-white uppercase tracking-tight">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
