import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useApp } from '@/hooks/useAppContext';
import { useStorage } from '@/hooks/useStorage';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Checkbox from '@/components/Checkbox';
import VoroLogo from '@/components/VoroLogo';
import Confetti from '@/components/Confetti';
import { calculateBMI, calculateBMR, calculateTDEE } from '@/utils/calculators';

const Onboarding = () => {
  const navigate = useNavigate();
  const { updateUser: setUser } = useApp();
  const { setStorage } = useStorage();
  const [step, setStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = React.useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    heightCm: '',
    weightKg: '',
    goal: 'Build Muscle',
    activityLevel: 'Moderately Active',
    dietaryPreferences: [],
    allergies: '',
    gymName: '',
    mealsPerDay: 3,
  });

  const activityLevels = [
    { value: 'Sedentary', label: 'Sedentary (little exercise)', multiplier: 1.2 },
    { value: 'Lightly Active', label: 'Lightly Active (1-3 days/week)', multiplier: 1.375 },
    { value: 'Moderately Active', label: 'Moderately Active (3-5 days/week)', multiplier: 1.55 },
    { value: 'Very Active', label: 'Very Active (6-7 days/week)', multiplier: 1.725 },
    { value: 'Extremely Active', label: 'Extremely Active (physical job)', multiplier: 1.9 },
  ];

  const goals = [
    { value: 'Lose Weight', label: 'Lose Weight', icon: '📉' },
    { value: 'Build Muscle', label: 'Build Muscle', icon: '💪' },
    { value: 'Improve Fitness', label: 'Improve Fitness', icon: '🏃' },
    { value: 'Athletic Performance', label: 'Athletic Performance', icon: '⚡' },
    { value: 'General Health', label: 'General Health', icon: '🧘' },
    { value: 'Body Recomposition', label: 'Body Recomposition', icon: '⚖️' },
  ];

  const dietaryOptions = [
    'No restrictions',
    'Vegetarian',
    'Vegan',
    'Gluten-free',
    'Dairy-free',
    'Halal'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        dietaryPreferences: checked
          ? [...prev.dietaryPreferences, value]
          : prev.dietaryPreferences.filter(d => d !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const calculateProfileData = () => {
    const bmi = calculateBMI(formData.weightKg, formData.heightCm / 100);
    const bmr = calculateBMR({
      weight: formData.weightKg,
      height: formData.heightCm,
      age: Number(formData.age),
      gender: formData.gender
    });
    
    const activityMultiplier = activityLevels.find(a => a.value === formData.activityLevel)?.multiplier || 1.55;
    const tdee = Math.round(bmr * activityMultiplier);

    let calorieGoal = tdee;
    let proteinMultiplier = 1.8;

    switch (formData.goal) {
      case 'Lose Weight':
        calorieGoal = tdee - 500;
        proteinMultiplier = 2.2;
        break;
      case 'Build Muscle':
        calorieGoal = tdee + 300;
        proteinMultiplier = 2.5;
        break;
      case 'Body Recomposition':
        calorieGoal = tdee;
        proteinMultiplier = 2.2;
        break;
      default:
        calorieGoal = tdee;
        proteinMultiplier = 1.8;
    }

    const proteinGoal = Math.round(formData.weightKg * proteinMultiplier);
    const fatGoal = Math.round((calorieGoal * 0.30) / 9);
    const carbGoal = Math.round((calorieGoal - (proteinGoal * 4) - (fatGoal * 9)) / 4);
    const waterGoal = Math.round(formData.weightKg * 0.033 * 1000);

    return {
      name: formData.name,
      age: Number(formData.age),
      gender: formData.gender,
      heightCm: Number(formData.heightCm),
      currentWeight: formData.weightKg,
      targetWeight: formData.goal === 'Lose Weight' ? formData.weightKg * 0.85 : formData.weightKg * 1.1,
      primaryGoal: formData.goal,
      activityLevel: formData.activityLevel,
      bmi,
      bmr: Math.round(bmr),
      tdee,
      calorieGoal: Math.round(calorieGoal),
      proteinGoal,
      carbGoal,
      fatGoal,
      waterGoal,
      dietaryRestrictions: formData.dietaryPreferences,
      allergies: formData.allergies,
      conditions: formData.allergies,
      gymName: formData.gymName,
      mealsPerDay: formData.mealsPerDay,
      profileComplete: true,
      createdAt: new Date().toISOString(),
    };
  };

  const handleNext = () => {
    if (step === 1 && !formData.name) return;
    if (step === 2 && (!formData.age || !formData.heightCm || !formData.weightKg)) return;
    if (step === 5) {
      const profileData = calculateProfileData();
      setStorage('voro_profile', profileData);
      setUser(profileData);
      setShowConfetti(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const stepTitles = [
    'Welcome to VORO',
    'Personal Information',
    'Your Goal',
    'Activity Level',
    'Finalize Profile'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-voro-surface via-voro-card to-voro-surface flex items-center justify-center p-4">
      {showConfetti && <Confetti ref={confettiRef} />}
      
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  s <= step
                    ? 'bg-voro-primary text-white'
                    : 'bg-voro-border text-gray-400'
                }`}>
                  {s < step ? <Check size={20} /> : s}
                </div>
                {s < 5 && (
                  <div className={`flex-1 h-1 mx-2 transition-all ${
                    s < step ? 'bg-voro-primary' : 'bg-voro-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="p-8">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center animate-fade-in">
              <div className="mb-6 flex justify-center">
                <VoroLogo size={120} />
              </div>
              <h1 className="text-4xl font-bold mb-4 text-white">Welcome to VORO</h1>
              <p className="text-lg text-gray-300 mb-6">Your Body. Your Data. Your Evolution.</p>
              <p className="text-gray-400 mb-8">
                VORO is your complete AI-powered fitness and nutrition operating system. 
                Track every calorie, rep, measurement, and milestone beautifully.
              </p>
              <div className="mb-8">
                <Input
                  placeholder="What's your name?"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  autoFocus
                  className="text-center text-lg"
                />
              </div>
              <p className="text-sm text-gray-500">Let's build your profile →</p>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 text-white">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                  <Input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="25"
                    min="13"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                      { value: 'Other', label: 'Prefer not to say' }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Height (cm)</label>
                  <Input
                    type="number"
                    name="heightCm"
                    value={formData.heightCm}
                    onChange={handleInputChange}
                    placeholder="180"
                    min="100"
                    max="250"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Weight (kg)</label>
                  <Input
                    type="number"
                    name="weightKg"
                    value={formData.weightKg}
                    onChange={handleInputChange}
                    placeholder="80"
                    min="30"
                    max="300"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Goal Selection */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 text-white">What's Your Primary Goal?</h2>
              <div className="grid grid-cols-2 gap-3">
                {goals.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setFormData(prev => ({ ...prev, goal: g.value }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.goal === g.value
                        ? 'border-voro-primary bg-voro-primary bg-opacity-10'
                        : 'border-voro-border bg-voro-card hover:border-voro-primary'
                    }`}
                  >
                    <div className="text-3xl mb-2">{g.icon}</div>
                    <div className="font-semibold text-white">{g.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Activity Level */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 text-white">Activity Level</h2>
              <div className="space-y-3">
                {activityLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setFormData(prev => ({ ...prev, activityLevel: level.value }))}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      formData.activityLevel === level.value
                        ? 'border-voro-primary bg-voro-primary bg-opacity-10'
                        : 'border-voro-border bg-voro-card hover:border-voro-primary'
                    }`}
                  >
                    <div className="font-semibold text-white">{level.label}</div>
                    <div className="text-xs text-gray-400 mt-1">Multiplier: {level.multiplier}x</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Finalize */}
          {step === 5 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 text-white">Finalize Your Profile</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Dietary Preferences</label>
                  <div className="space-y-2">
                    {dietaryOptions.map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          value={option}
                          checked={formData.dietaryPreferences.includes(option)}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded"
                        />
                        <span className="ml-2 text-gray-300">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Allergies / Medical Conditions
                  </label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    placeholder="e.g., Nut allergy, Lactose intolerant..."
                    className="w-full px-4 py-2 bg-voro-surface border border-voro-border rounded-lg text-white placeholder-gray-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gym Name (Optional)</label>
                  <Input
                    name="gymName"
                    value={formData.gymName}
                    onChange={handleInputChange}
                    placeholder="My Gym"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Meals Per Day</label>
                  <input
                    type="range"
                    name="mealsPerDay"
                    min="2"
                    max="6"
                    value={formData.mealsPerDay}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <div className="text-center mt-2 text-voro-primary font-bold">{formData.mealsPerDay} meals/day</div>
                </div>
              </div>

              <div className="bg-voro-surface border border-voro-border rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-300">
                  ✓ Profile ready to create<br/>
                  ✓ AI features enabled<br/>
                  ✓ Your goals calculated
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 gap-4">
            <Button
              variant="secondary"
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="flex items-center gap-2 flex-1 justify-center"
            >
              {step === 5 ? 'Complete Profile' : 'Next'}
              {step < 5 && <ChevronRight size={18} />}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
