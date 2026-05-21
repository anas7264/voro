import React, { useEffect, useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { useAppContext, useApp } from '@/hooks/useAppContext';
import { useStorage } from '@/hooks/useStorage';
import { calculateBMI, calculateBMR, calculateTDEE } from '@/utils/calculators';

const Profile = () => {
  const { user, updateUser: setUser } = useApp();
  const { getStorage, setStorage } = useStorage();
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
    const bmi = calculateBMI(formData.currentWeight, formData.heightCm);
    const bmr = Number(calculateBMR(formData.currentWeight, formData.heightCm, formData.age, formData.gender || 'Male'));
    const tdee = calculateTDEE(bmr, 'moderately_active');

    const updated = {
      ...formData,
      bmi,
      bmr: Math.round(bmr),
      tdee,
    };

    setStorage('voro_profile', updated);
    setUser(updated);
    setEditing(false);
  };

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          {!editing && (
            <Button
              variant="secondary"
              onClick={() => setEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit2 size={18} />
              Edit
            </Button>
          )}
        </div>

        {editing ? (
          <Card className="p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Age</label>
                  <Input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Gender</label>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                      { value: 'Other', label: 'Other' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Height (cm)</label>
                  <Input
                    type="number"
                    name="heightCm"
                    value={formData.heightCm}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Current Weight (kg)</label>
                  <Input
                    type="number"
                    name="currentWeight"
                    value={formData.currentWeight}
                    onChange={handleInputChange}
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Target Weight (kg)</label>
                  <Input
                    type="number"
                    name="targetWeight"
                    value={formData.targetWeight}
                    onChange={handleInputChange}
                    step="0.1"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save size={18} />
                  Save
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setFormData(user);
                    setEditing(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400">Name</span>
                  <div className="text-lg text-white">{user.name}</div>
                </div>
                <div>
                  <span className="text-gray-400">Age</span>
                  <div className="text-lg text-white">{user.age} years</div>
                </div>
                <div>
                  <span className="text-gray-400">Gender</span>
                  <div className="text-lg text-white">{user.gender}</div>
                </div>
                <div>
                  <span className="text-gray-400">Height</span>
                  <div className="text-lg text-white">{user.heightCm} cm</div>
                </div>
              </div>
            </Card>

            {/* Physical Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Physical Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <span className="text-gray-400">Current Weight</span>
                  <div className="text-3xl font-bold text-voro-primary">{user.currentWeight}kg</div>
                </div>
                <div className="text-center">
                  <span className="text-gray-400">Target Weight</span>
                  <div className="text-3xl font-bold text-voro-secondary">{user.targetWeight}kg</div>
                </div>
                <div className="text-center">
                  <span className="text-gray-400">BMI</span>
                  <div className="text-3xl font-bold text-voro-accent">{user.bmi?.toFixed(1)}</div>
                </div>
              </div>
            </Card>

            {/* Goals */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Goals & Targets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400">Primary Goal</span>
                  <div className="text-lg text-white">{user.primaryGoal}</div>
                </div>
                <div>
                  <span className="text-gray-400">Daily Calorie Goal</span>
                  <div className="text-lg text-white">{user.calorieGoal} kcal</div>
                </div>
                <div>
                  <span className="text-gray-400">Protein Target</span>
                  <div className="text-lg text-white">{user.proteinGoal}g</div>
                </div>
                <div>
                  <span className="text-gray-400">TDEE</span>
                  <div className="text-lg text-white">{user.tdee} kcal</div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
