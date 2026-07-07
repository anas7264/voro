import React, { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useApp } from '@/hooks/useAppContext';
import { useStorageMethods } from '@/hooks/useStorage';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Textarea from '@/components/Textarea';
import Checkbox from '@/components/Checkbox';
import VoroLogo from '@/components/VoroLogo';
import Confetti from '@/components/Confetti';
import { calculateBMI, calculateBMR } from '@/utils/calculators';

const Onboarding = () => {
  const navigate = useNavigate();
  const { updateUser: setUser } = useApp();
  const { setItem } = useStorageMethods();
  const [step, setStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = React.useRef(null);

  const nameId = useId();
  const ageId = useId();
  const genderId = useId();
  const heightId = useId();
  const weightId = useId();
  const allergiesId = useId();
  const gymNameId = useId();
  const mealsPerDayId = useId();

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
    const bmi = calculateBMI(Number(formData.weightKg), Number(formData.heightCm));
    const bmr = calculateBMR(
      Number(formData.weightKg),
      Number(formData.heightCm),
      Number(formData.age),
      formData.gender
    );

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
      /**
       * ⚡ OPTIMIZATION: Direct storage write.
       * Standardize storage key usage by using the base 'profile' key.
       * The storage utility automatically handles the 'voro_' prefix.
       */
      setItem('profile', profileData);
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

  return (
    <div className="min-h-screen bg-[#080B14] flex items-center justify-center p-4 sm:p-8">
      {showConfetti && <Confetti ref={confettiRef} />}

      <div className="w-full max-w-2xl">
        <div className="mb-12 relative z-10 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-full sm:min-w-[400px] px-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-all duration-500 ${
                  s <= step
                    ? 'bg-voro-primary text-white shadow-lg shadow-voro-primary/40'
                    : 'bg-white/5 text-gray-600'
                }`}>
                  {s < step ? <Check size={24} /> : <span className="font-mono">{s}</span>}
                </div>
                {s < 5 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-700 ${
                    s < step ? "bg-voro-primary" : "bg-white/5"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="p-6 sm:p-12 bg-[#0A0C14] border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          {step === 1 && (
            <div className="text-center animate-fade-in relative z-10">
              <div className="mb-10 flex justify-center transform hover:scale-105 transition-transform duration-500">
                <VoroLogo size={140} />
              </div>
              <h1 className="text-4xl sm:text-5xl font-serif italic font-medium mb-6 text-white leading-tight">Welcome to <span className="text-voro-primary not-italic font-bold">VORO</span></h1>
              <p className="text-lg text-gray-400 mb-10 font-medium tracking-wide">Your Body. Your Data. Your Evolution.</p>
              <p className="text-gray-500 mb-12 leading-relaxed max-w-md mx-auto">
                VORO is your complete AI-powered fitness and nutrition operating system.
                Track every calorie, rep, measurement, and milestone beautifully.
              </p>
              <div className="mb-12 relative z-10">
                <Input
                  id={nameId}
                  label="Your Name"
                  required
                  placeholder="What's your name?"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  autoFocus
                  className="text-center text-2xl font-serif italic font-bold text-voro-primary bg-white/[0.02] border-white/5"
                />
              </div>
              <p className="text-[0.6rem] font-black text-voro-primary uppercase tracking-[0.3em]">Sequential Evolution Initiation</p>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-serif italic font-medium mb-8 text-white">Personal Information</h2>
              <div className="space-y-6">
                <Input
                  id={ageId}
                  label="Age"
                  required
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="25"
                  min="13"
                  max="120"
                />
                <Select
                  id={genderId}
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Prefer not to say' }
                  ]}
                />
                <Input
                  id={heightId}
                  label="Height (cm)"
                  required
                  type="number"
                  name="heightCm"
                  value={formData.heightCm}
                  onChange={handleInputChange}
                  placeholder="180"
                  min="100"
                  max="250"
                />
                <Input
                  id={weightId}
                  label="Current Weight (kg)"
                  required
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
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-serif italic font-medium mb-8 text-white">What's Your Primary Goal?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goals.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setFormData(prev => ({ ...prev, goal: g.value }))}
                    className={`p-6 rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-700 ${
                      formData.goal === g.value
                        ? 'border-voro-primary bg-voro-primary/10 shadow-lg shadow-voro-primary/20'
                        : 'border-white/5 bg-white/[0.02] hover:border-voro-primary/50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{g.icon}</div>
                    <div className="font-semibold text-white">{g.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-serif italic font-medium mb-8 text-white">Activity Level</h2>
              <div className="space-y-3">
                {activityLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setFormData(prev => ({ ...prev, activityLevel: level.value }))}
                    className={`w-full p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-left transition-all duration-700 ${
                      formData.activityLevel === level.value
                        ? 'border-voro-primary bg-voro-primary/10 shadow-lg shadow-voro-primary/20'
                        : 'border-white/5 bg-white/[0.02] hover:border-voro-primary/50'
                    }`}
                  >
                    <div className="font-semibold text-white">{level.label}</div>
                    <div className="text-xs text-gray-400 mt-1">Multiplier: {level.multiplier}x</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-serif italic font-medium mb-8 text-white">Finalize Your Profile</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em] mb-4">Dietary Preferences</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dietaryOptions.map((option) => (
                      <Checkbox
                        key={option}
                        label={option}
                        value={option}
                        checked={formData.dietaryPreferences.includes(option)}
                        onChange={(checked) => {
                          handleInputChange({
                            target: {
                              name: 'dietaryPreferences',
                              value: option,
                              type: 'checkbox',
                              checked
                            }
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>

                <Textarea
                  id={allergiesId}
                  label="Allergies / Medical Conditions"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="e.g., Nut allergy, Lactose intolerant..."
                  rows="4"
                />

                <Input
                  id={gymNameId}
                  label="Gym Name (Optional)"
                  name="gymName"
                  value={formData.gymName}
                  onChange={handleInputChange}
                  placeholder="My Gym"
                />

                <div>
                  <label
                    htmlFor={mealsPerDayId}
                    className="block text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em] mb-4"
                  >
                    Meals Per Day
                  </label>
                  <input
                    id={mealsPerDayId}
                    type="range"
                    name="mealsPerDay"
                    min="2"
                    max="6"
                    value={formData.mealsPerDay}
                    onChange={handleInputChange}
                    aria-label="Meals per day (2-6)"
                    className="w-full accent-voro-primary h-1 bg-white/5 rounded-full appearance-none cursor-pointer focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0C14] outline-none transition-all"
                  />
                  <div className="text-center mt-6 text-2xl font-serif italic text-voro-primary font-bold">{formData.mealsPerDay} meals/day</div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-voro-primary/5 border border-voro-primary/10 mb-12 shadow-inner group-hover:bg-voro-primary/10 transition-colors duration-700">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 space-y-2">
                  ⚡ Profile ready to create<br/>
                  ⚡ AI features enabled<br/>
                  ⚡ Your goals calculated
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-12 gap-4 relative z-10 flex flex-col sm:flex-row">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-3 px-8 py-4 ${step === 1 ? "opacity-0 pointer-events-none" : ""}`}
            >
              <ChevronLeft size={20} />
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="flex items-center gap-3 px-12 py-4 flex-1 sm:flex-none justify-center bg-white text-black hover:bg-white/90"
            >
              {step === 5 ? 'Complete Profile' : 'Continue'}
              {step < 5 && <ChevronRight size={20} />}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
