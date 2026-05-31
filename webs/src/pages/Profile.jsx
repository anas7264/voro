import React, { useEffect, useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { useAppContext, useApp } from '@/hooks/useAppContext';
import { useStorage } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { calculateBMI, calculateBMR, calculateTDEE } from '@/utils/calculators';
import { validateFitnessProfile } from '@/utils/validators';

const Profile = () => {
  const { user, updateUser: setUser } = useApp();
  const { getStorage, setStorage } = useStorage();
  const { addNotification } = useNotifications();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(user || {});

  useEffect(() => {
    document.title = 'VORO | Profile';
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSave = () => {
    // Security: Validate fitness profile before saving to storage
    const { valid, errors } = validateFitnessProfile({
      age: formData.age,
      height: formData.heightCm,
      weight: formData.currentWeight,
      gender: formData.gender,
      goal: formData.primaryGoal, // Map primaryGoal to goal for validator
      activityLevel: formData.activityLevel || 'moderately_active'
    });

    if (!valid) {
      const errorMsg = Object.values(errors).join('. ');
      addNotification(`Validation failed: ${errorMsg}`, 'error');
      return;
    }

    const bmi = calculateBMI(formData.currentWeight, formData.heightCm);
    const bmr = Number(calculateBMR(formData.currentWeight, formData.heightCm, formData.age, formData.gender || 'Male'));

    // Security: Use the validated activity level from formData
    const activityLevel = formData.activityLevel?.toLowerCase().replace(' ', '_') || 'moderately_active';
    const tdee = calculateTDEE(bmr, activityLevel);

    const updated = {
      ...formData,
      bmi,
      bmr: Math.round(bmr),
      tdee,
    };

    setStorage('voro_profile', updated);
    setUser(updated);
    addNotification('Profile updated successfully!', 'success');
    setEditing(false);
  };

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] overflow-x-hidden p-8 lg:p-24">
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-voro-primary">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Genetic Blueprint</span>
              <div className="h-[1px] w-12 bg-voro-primary/30" />
            </div>
            <h1 className="text-7xl font-black font-serif italic text-white leading-[0.9] tracking-tighter">
              Biological <span className="text-gradient not-italic">Identity</span>
            </h1>
          </div>

          {!editing && (
            <button onClick={() => setEditing(true)} className="px-8 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all">
              Modify Blueprint
            </button>
          )}
        </header>

        {editing ? (
          <Card className="p-16 space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Input label="Subject Name" name="name" value={formData.name} onChange={handleInputChange} />
              <Input label="Chronological Age" type="number" name="age" value={formData.age} onChange={handleInputChange} />

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-gray-500">Biological Sex</label>
                <select
                  name="gender" value={formData.gender} onChange={handleInputChange}
                  className="w-full bg-transparent border-b-2 border-white/10 py-6 text-2xl font-serif italic text-white focus:outline-none focus:border-voro-primary transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <Input label="Vertical Stature (CM)" type="number" name="heightCm" value={formData.heightCm} onChange={handleInputChange} />
              <Input label="Current Mass (KG)" type="number" name="currentWeight" value={formData.currentWeight} onChange={handleInputChange} step="0.1" />
              <Input label="Target Mass (KG)" type="number" name="targetWeight" value={formData.targetWeight} onChange={handleInputChange} step="0.1" />
            </div>

            <div className="flex gap-8 pt-8">
              <Button onClick={handleSave} fullWidth>Synchronize Changes</Button>
              <Button variant="secondary" fullWidth onClick={() => { setFormData(user); setEditing(false); }}>Abort</Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-12">
            {/* Bio-Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-12">
                  <section className="space-y-6">
                    <h3 className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-[0.4em] mb-4">Core Identification</h3>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="p-8 bg-white/5 border border-white/5">
                          <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1">Subject</p>
                          <p className="text-xl font-serif italic text-white">{user.name}</p>
                       </div>
                       <div className="p-8 bg-white/5 border border-white/5">
                          <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1">Chronology</p>
                          <p className="text-xl font-serif italic text-white">{user.age} YRS</p>
                       </div>
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-[0.4em] mb-4">Metabolic Constants</h3>
                    <div className="grid grid-cols-1 gap-4">
                       <div className="p-10 bg-white/5 border border-white/5 flex justify-between items-center">
                          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">Basal Metabolic Rate</p>
                          <p className="text-3xl font-mono font-bold text-white">{user.bmr} <span className="text-[10px] text-gray-600">KC/24H</span></p>
                       </div>
                       <div className="p-10 bg-white/5 border border-voro-primary/20 flex justify-between items-center">
                          <p className="text-[10px] font-mono text-voro-primary uppercase tracking-[0.2em]">Total Daily Energy Expenditure</p>
                          <p className="text-3xl font-mono font-bold text-white">{user.tdee} <span className="text-[10px] text-gray-600">KC/24H</span></p>
                       </div>
                    </div>
                  </section>
               </div>

               <div className="space-y-12">
                  <section className="space-y-6">
                    <h3 className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-[0.4em] mb-4">Physical Metrics</h3>
                    <div className="grid grid-cols-2 gap-8">
                        <Stat label="Current Mass" value={user.currentWeight} unit="KG" />
                        <Stat label="Target Mass" value={user.targetWeight} unit="KG" />
                    </div>
                    <div className="p-10 bg-gradient-to-br from-white/10 to-transparent border border-white/5 text-center">
                       <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.4em] mb-4">Body Mass Index</p>
                       <p className="text-7xl font-serif italic font-black text-white">{user.bmi?.toFixed(1)}</p>
                       <p className="text-[10px] font-mono text-voro-primary uppercase tracking-[0.2em] mt-4">Structural Density: Optimized</p>
                    </div>
                  </section>
               </div>
            </div>

            {/* Directive Manifest */}
            <section className="pt-12 border-t border-white/5">
               <h3 className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-[0.4em] mb-12">Neural Directive Manifest</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 border border-white/5">
                     <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Primary Objective</p>
                     <p className="text-2xl font-serif italic text-white uppercase tracking-tight">{user.primaryGoal}</p>
                  </div>
                  <div className="p-8 border border-white/5">
                     <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Energy Threshold</p>
                     <p className="text-2xl font-mono font-bold text-white">{user.calorieGoal} KCAL</p>
                  </div>
                  <div className="p-8 border border-white/5">
                     <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Protein Target</p>
                     <p className="text-2xl font-mono font-bold text-white">{user.proteinGoal} G</p>
                  </div>
               </div>
            </section>
          </div>
        )}
      </div>
      <style>{`
        .text-gradient {
          background: linear-gradient(to right, #7C3AED, #A78BFA);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default Profile;
