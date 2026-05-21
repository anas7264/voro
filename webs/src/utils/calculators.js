// VORO Calculation Utilities
// Complete set of fitness, nutrition, and performance calculations

// BMI Calculation: weight(kg) / height(m)²
export const calculateBMI = (weightKg, heightCm) => {
  const heightM = heightCm / 100;
  return (weightKg / (heightM * heightM)).toFixed(1);
};

export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal Weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

// Basal Metabolic Rate - Mifflin-St Jeor (most accurate)
export const calculateBMR = (weightKg, heightCm, age, gender) => {
  if (gender.toLowerCase() === "male") {
    return (10 * weightKg + 6.25 * heightCm - 5 * age + 5).toFixed(0);
  } else {
    return (10 * weightKg + 6.25 * heightCm - 5 * age - 161).toFixed(0);
  }
};

// Total Daily Energy Expenditure using activity multiplier
export const calculateTDEE = (bmr, activityLevel) => {
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.55));
};

// Protein targets based on goal and weight
export const calculateProteinTarget = (weightKg, goal = "maintenance") => {
  const targets = {
    weight_loss: 2.2, // g/kg
    maintenance: 1.6, // g/kg
    muscle_gain: 2.2  // g/kg
  };
  return Math.round(weightKg * (targets[goal] || 1.6));
};

// Water intake recommendation in liters
export const calculateWaterIntake = (weightKg, activityMinutesPerDay = 0) => {
  const baseIntake = weightKg * 0.035; // ~35ml per kg
  const exerciseBonus = (activityMinutesPerDay / 30) * 0.5; // 500ml per 30 min exercise
  return (baseIntake + exerciseBonus).toFixed(1);
};

// One Rep Max estimators
export const calculateOneRepMax = {
  epley: (weight, reps) => Math.round(weight * (1 + reps / 30)),
  brzycki: (weight, reps) => Math.round(weight * (36 / (37 - reps))),
  lander: (weight, reps) => Math.round((100 * weight) / (101.3 - 2.67123 * reps)),
  reynolds: (weight, reps) => Math.round(weight * (1 + reps / 15)),
  adamson: (weight, reps) => Math.round(weight * (1 + reps / 20)),
  average: (weight, reps) => {
    const estimates = [
      Math.round(weight * (1 + reps / 30)),
      Math.round(weight * (36 / (37 - reps))),
      Math.round((100 * weight) / (101.3 - 2.67123 * reps)),
      Math.round(weight * (1 + reps / 15)),
      Math.round(weight * (1 + reps / 20))
    ];
    return Math.round(estimates.reduce((a, b) => a + b) / estimates.length);
  }
};

// Wilks Coefficient (strength-to-bodyweight ratio for comparing lifters)
export const calculateWilksCoefficient = (totalWeight, bodyweightKg, gender) => {
  const a = gender.toLowerCase() === "male" ? -216.0475 : -594.31;
  const b = gender.toLowerCase() === "male" ? 16.2606 : 27.91957;
  const c = gender.toLowerCase() === "male" ? -0.002388 : -0.12835;
  const coefficient = 500 / (a + b * bodyweightKg + c * Math.pow(bodyweightKg, 2));
  return (totalWeight * coefficient).toFixed(2);
};

// Fat-Free Mass Index (muscle mass relative to height)
export const calculateFFMI = (weightKg, bodyFatPercent, heightCm) => {
  const leanMassKg = weightKg * (1 - bodyFatPercent / 100);
  const heightM = heightCm / 100;
  return (leanMassKg / (heightM * heightM)).toFixed(1);
};

// Maximum Heart Rate and training zones
export const calculateMaxHeartRate = (age, method = "karvonen") => {
  if (method === "karvonen") return 220 - age;
  if (method === "tanaka") return Math.round(208 - (0.7 * age));
  if (method === "gulati_female") return Math.round(206 - (0.88 * age));
  return 220 - age; // Default
};

export const getHeartRateZones = (maxHeartRate, restingHeartRate = 60) => {
  const zone2 = maxHeartRate * 0.5; // Warm-up: 50%
  const zone3 = maxHeartRate * 0.6; // Zone 2: 60%
  const zone4 = maxHeartRate * 0.7; // Zone 3: 70%
  const zone5 = maxHeartRate * 0.8; // Zone 4: 80%
  const zone6 = maxHeartRate * 0.9; // Zone 5: 90%

  return {
    warmup: { min: Math.round(zone2), max: Math.round(zone3), name: "Warm-up", intensity: "50-60%" },
    zone2: { min: Math.round(zone3), max: Math.round(zone4), name: "Zone 2", intensity: "60-70%" },
    zone3: { min: Math.round(zone4), max: Math.round(zone5), name: "Zone 3", intensity: "70-80%" },
    zone4: { min: Math.round(zone5), max: Math.round(zone6), name: "Zone 4", intensity: "80-90%" },
    zone5: { min: Math.round(zone6), max: Math.round(maxHeartRate), name: "VO2 Max", intensity: "90-100%" }
  };
};

// VO2 Max estimation (Karvonen formula from max heart rate)
export const estimateVO2Max = (age, gender, resting_heart_rate) => {
  const maxHR = calculateMaxHeartRate(age);
  // Simplified: (maxHR - restingHR) / age correlates to fitness level
  const fitnessIndex = ((maxHR - resting_heart_rate) / age) * 10;
  return Math.round(fitnessIndex * 0.5); // Rough estimate
};

// Pace converter (convert between min/km and km/h)
export const convertPace = (pace, unit = "kmh_to_pace") => {
  if (unit === "kmh_to_pace") {
    // Convert km/h to min:sec per km
    const seconds = (3600 / pace);
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  } else if (unit === "pace_to_kmh") {
    // Convert min:sec per km to km/h
    const [min, sec] = pace.split(":").map(Number);
    const totalSeconds = min * 60 + sec;
    return (3600 / totalSeconds).toFixed(2);
  }
};

// Caloric burn estimates by activity
export const estimateCaloriesBurned = (weightKg, durationMinutes, activity) => {
  const mets = {
    walking_slow: 2.8,
    walking_moderate: 3.5,
    running_slow: 5.8,
    running_moderate: 8.3,
    running_fast: 11.5,
    cycling_moderate: 7.5,
    cycling_vigorous: 12.0,
    swimming: 8.0,
    hiit: 10.0,
    strength_training: 6.0,
    yoga: 2.5,
    pilates: 4.0
  };

  const met = mets[activity] || 5.0;
  return Math.round((met * weightKg * durationMinutes) / 60);
};

// Macro ratio calculator
export const calculateMacroRatios = (calories, goalProteinG, goalCarbG, goalFatG) => {
  return {
    protein: { grams: goalProteinG, calories: goalProteinG * 4, percentage: ((goalProteinG * 4) / calories * 100).toFixed(1) },
    carbs: { grams: goalCarbG, calories: goalCarbG * 4, percentage: ((goalCarbG * 4) / calories * 100).toFixed(1) },
    fat: { grams: goalFatG, calories: goalFatG * 9, percentage: ((goalFatG * 9) / calories * 100).toFixed(1) }
  };
};

// Calculate surplus/deficit for goal
export const calculateCalorieAdjustment = (tdee, goal) => {
  const adjustments = {
    aggressive_cut: 0.75, // 25% deficit
    moderate_cut: 0.85, // 15% deficit
    slight_cut: 0.90, // 10% deficit
    maintenance: 1.0, // No change
    slight_surplus: 1.10, // 10% surplus
    moderate_surplus: 1.15, // 15% surplus
    aggressive_bulk: 1.25 // 25% surplus
  };

  const multiplier = adjustments[goal] || 1.0;
  return Math.round(tdee * multiplier);
};

// Periodization cycle calculator
export const calculatePeriodizationCycle = (totalWeeks, cycles = 4) => {
  const weeksPerCycle = Math.floor(totalWeeks / cycles);
  const remainder = totalWeeks % cycles;

  return {
    totalWeeks,
    cycles,
    weeksPerCycle,
    remainderWeeks: remainder,
    cycleBreakdown: Array(cycles).fill(weeksPerCycle).map((w, i) => ({
      cycle: i + 1,
      weeks: i === cycles - 1 ? w + remainder : w,
      deload: Math.ceil((w + remainder) / 4) // Deload week approximately every 3-4 weeks
    }))
  };
};

// Training volume calculator (sets × reps × weight)
export const calculateTrainingVolume = (sets, reps, weight) => {
  return sets * reps * weight;
};

// Progressive overload suggestions
export const suggestProgressiveOverload = (currentSets, currentReps, currentWeight, trainingAge = "intermediate") => {
  const strategies = [
    { method: "Add Reps", currentReps, suggestedReps: currentReps + 1 },
    { method: "Add Sets", currentSets, suggestedSets: currentSets + 1 },
    { method: "Increase Weight", currentWeight, suggestedWeight: Math.round(currentWeight * 1.025) },
    { method: "Reduce Rest", suggestedRestReduction: "Decrease rest 15-30 seconds" },
    { method: "Add Exercise Variation", suggestion: "Change grip, angle, or ROM" }
  ];

  return strategies;
};

// Recovery score (0-100) based on sleep, stress, nutrition
export const calculateRecoveryScore = (sleepHours, stressLevel, nutritionCompleteness) => {
  const sleepScore = Math.min((sleepHours / 8) * 40, 40);
  const stressScore = (1 - stressLevel / 10) * 30; // 0-10 stress scale inverted
  const nutritionScore = nutritionCompleteness * 30; // 0-1 completeness

  return Math.round(sleepScore + stressScore + nutritionScore);
};

// Overtraining risk assessment (0-100, >70 indicates high risk)
export const assessOvertrainingRisk = (weeklyVolume, weeklyFrequency, averageIntensity, sleepQuality) => {
  const volumeRisk = Math.min((weeklyVolume / 20000) * 30, 30); // Normalized to 20k volume
  const frequencyRisk = Math.min((weeklyFrequency / 6) * 30, 30); // Normalized to 6x/week
  const intensityRisk = (averageIntensity / 10) * 30; // 0-10 scale
  const sleepRisk = (1 - sleepQuality / 10) * 10; // 0-10 quality inverted

  return Math.round(volumeRisk + frequencyRisk + intensityRisk + sleepRisk);
};

export default {
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateTDEE,
  calculateProteinTarget,
  calculateWaterIntake,
  calculateOneRepMax,
  calculateWilksCoefficient,
  calculateFFMI,
  calculateMaxHeartRate,
  getHeartRateZones,
  estimateVO2Max,
  convertPace,
  estimateCaloriesBurned,
  calculateMacroRatios,
  calculateCalorieAdjustment,
  calculatePeriodizationCycle,
  calculateTrainingVolume,
  suggestProgressiveOverload,
  calculateRecoveryScore,
  assessOvertrainingRisk
};

// Ideal Body Weight - Devine Formula
export const calculateIdealWeight = (heightCm, gender = 'Male') => {
  const heightInches = (heightCm - 152.4) / 2.54;
  if (gender === 'Male') {
    return Math.max(50 + (2.3 * heightInches), 40);
  } else {
    return Math.max(45.5 + (2.3 * heightInches), 38);
  }
};
