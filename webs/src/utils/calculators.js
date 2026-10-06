// VORO Calculation Utilities
// Complete set of fitness, nutrition, and performance calculations

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted and Frozen Configuration Objects.
 * These are frozen with Object.freeze() at the module scope to completely
 * prevent heap-allocation and Garbage Collection (GC) churn in hot paths.
 */
const TDEE_MULTIPLIERS = Object.freeze({
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9
});

const PROTEIN_TARGET_MULTIPLIERS = Object.freeze({
  weight_loss: 2.2,
  maintenance: 1.6,
  muscle_gain: 2.2
});

const CALORIC_BURN_METS = Object.freeze({
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
});

const GOAL_CALORIC_ADJUSTMENTS = Object.freeze({
  aggressive_cut: 0.75, // 25% deficit
  moderate_cut: 0.85, // 15% deficit
  slight_cut: 0.90, // 10% deficit
  maintenance: 1.0, // No change
  slight_surplus: 1.10, // 10% surplus
  moderate_surplus: 1.15, // 15% surplus
  aggressive_bulk: 1.25 // 25% surplus
});

// BMI Calculation: weight(kg) / height(m)²
export const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm || heightCm <= 0 || !Number.isFinite(weightKg) || !Number.isFinite(heightCm)) return "0.0";
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
  // Performance optimization: Avoid repeated lowercasing where possible.
  const isMale = typeof gender === 'string' && (gender === 'male' || gender.toLowerCase() === "male");
  if (isMale) {
    return (10 * weightKg + 6.25 * heightCm - 5 * age + 5).toFixed(0);
  } else {
    return (10 * weightKg + 6.25 * heightCm - 5 * age - 161).toFixed(0);
  }
};

// Total Daily Energy Expenditure using activity multiplier
export const calculateTDEE = (bmr, activityLevel) => {
  return Math.round(bmr * (TDEE_MULTIPLIERS[activityLevel] || 1.55));
};

// Protein targets based on goal and weight
export const calculateProteinTarget = (weightKg, goal = "maintenance") => {
  return Math.round(weightKg * (PROTEIN_TARGET_MULTIPLIERS[goal] || 1.6));
};

// Water intake recommendation in liters
export const calculateWaterIntake = (weightKg, activityMinutesPerDay = 0) => {
  const baseIntake = weightKg * 0.035; // ~35ml per kg
  const exerciseBonus = (activityMinutesPerDay / 30) * 0.5; // 500ml per 30 min exercise
  return (baseIntake + exerciseBonus).toFixed(1);
};

// One Rep Max estimators
export const calculateOneRepMax = {
  epley: (weight, reps) => {
    if (!weight || !reps || weight <= 0 || reps <= 0 || !Number.isFinite(weight) || !Number.isFinite(reps)) return 0;
    if (reps === 1) return Math.round(weight);
    return Math.round(weight * (1 + reps / 30));
  },
  brzycki: (weight, reps) => {
    if (!weight || !reps || weight <= 0 || reps <= 0 || !Number.isFinite(weight) || !Number.isFinite(reps)) return 0;
    if (reps === 1) return Math.round(weight);
    const safeReps = Math.min(reps, 36);
    return Math.round(weight * (36 / (37 - safeReps)));
  },
  lander: (weight, reps) => {
    if (!weight || !reps || weight <= 0 || reps <= 0 || !Number.isFinite(weight) || !Number.isFinite(reps)) return 0;
    if (reps === 1) return Math.round(weight);
    const denom = 101.3 - 2.67123 * reps;
    if (denom <= 0) return Math.round(weight * 2);
    return Math.round((100 * weight) / denom);
  },
  reynolds: (weight, reps) => {
    if (!weight || !reps || weight <= 0 || reps <= 0 || !Number.isFinite(weight) || !Number.isFinite(reps)) return 0;
    if (reps === 1) return Math.round(weight);
    return Math.round(weight * (1 + reps / 15));
  },
  adamson: (weight, reps) => {
    if (!weight || !reps || weight <= 0 || reps <= 0 || !Number.isFinite(weight) || !Number.isFinite(reps)) return 0;
    if (reps === 1) return Math.round(weight);
    return Math.round(weight * (1 + reps / 20));
  },
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Zero-allocation average calculation.
   * Completely bypasses array allocation `[estimates]`, closure execution, and `.reduce()` logic.
   * Includes defensive boundary checks to prevent divide-by-zero on reps >= 37 and short-circuits when reps === 1.
   */
  average: (weight, reps) => {
    if (!weight || !reps || weight <= 0 || reps <= 0 || !Number.isFinite(weight) || !Number.isFinite(reps)) return 0;
    if (reps === 1) return Math.round(weight);

    const safeRepsBrzycki = Math.min(reps, 36);
    const landerDenom = 101.3 - 2.67123 * reps;

    const epley = weight * (1 + reps / 30);
    const brzycki = weight * (36 / (37 - safeRepsBrzycki));
    const lander = landerDenom > 0 ? (100 * weight) / landerDenom : weight * 2;
    const reynolds = weight * (1 + reps / 15);
    const adamson = weight * (1 + reps / 20);

    return Math.round((epley + brzycki + lander + reynolds + adamson) / 5);
  }
};

// Wilks Coefficient (strength-to-bodyweight ratio for comparing lifters)
export const calculateWilksCoefficient = (totalWeight, bodyweightKg, gender) => {
  const isMale = typeof gender === 'string' && (gender === 'male' || gender.toLowerCase() === "male");
  const a = isMale ? -216.0475 : -594.31;
  const b = isMale ? 16.2606 : 27.91957;
  const c = isMale ? -0.002388 : -0.12835;
  // Performance optimization: Avoid Math.pow and compute direct multiplication
  const bodyweightSq = bodyweightKg * bodyweightKg;
  const coefficient = 500 / (a + b * bodyweightKg + c * bodyweightSq);
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
    const p = typeof pace === 'number' ? pace : parseFloat(pace);
    if (!p || p <= 0 || !Number.isFinite(p)) return "0:00";
    const seconds = (3600 / p);
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  } else if (unit === "pace_to_kmh") {
    if (typeof pace !== "string" || !pace.includes(":")) return "0.00";
    const parts = pace.split(":");
    const min = parseFloat(parts[0]) || 0;
    const sec = parseFloat(parts[1]) || 0;
    const totalSeconds = min * 60 + sec;
    if (totalSeconds <= 0) return "0.00";
    return (3600 / totalSeconds).toFixed(2);
  }
  return "0.00";
};

// Caloric burn estimates by activity
export const estimateCaloriesBurned = (weightKg, durationMinutes, activity) => {
  const met = CALORIC_BURN_METS[activity] || 5.0;
  return Math.round((met * weightKg * durationMinutes) / 60);
};

// Macro ratio calculator
export const calculateMacroRatios = (calories, goalProteinG, goalCarbG, goalFatG) => {
  const cals = calories && calories > 0 ? calories : 0;
  const pG = goalProteinG || 0;
  const cG = goalCarbG || 0;
  const fG = goalFatG || 0;
  return {
    protein: { grams: pG, calories: pG * 4, percentage: cals > 0 ? ((pG * 4) / cals * 100).toFixed(1) : "0.0" },
    carbs: { grams: cG, calories: cG * 4, percentage: cals > 0 ? ((cG * 4) / cals * 100).toFixed(1) : "0.0" },
    fat: { grams: fG, calories: fG * 9, percentage: cals > 0 ? ((fG * 9) / cals * 100).toFixed(1) : "0.0" }
  };
};

// Calculate surplus/deficit for goal
export const calculateCalorieAdjustment = (tdee, goal) => {
  const multiplier = GOAL_CALORIC_ADJUSTMENTS[goal] || 1.0;
  return Math.round(tdee * multiplier);
};

// Periodization cycle calculator
export const calculatePeriodizationCycle = (totalWeeks, cycles = 4) => {
  const weeksPerCycle = Math.floor(totalWeeks / cycles);
  const remainder = totalWeeks % cycles;

  // ⚡ PERFORMANCE OPTIMIZATION: Single-pass pre-allocated array instantiation.
  // Replaces multi-pass `Array(cycles).fill().map()` construct, completely eliminating
  // temporary intermediate array allocations and callback closure allocations.
  const deload = Math.ceil((weeksPerCycle + remainder) / 4);
  const cycleBreakdown = new Array(cycles);
  for (let i = 0; i < cycles; i++) {
    cycleBreakdown[i] = {
      cycle: i + 1,
      weeks: i === cycles - 1 ? weeksPerCycle + remainder : weeksPerCycle,
      deload
    };
  }

  return {
    totalWeeks,
    cycles,
    weeksPerCycle,
    remainderWeeks: remainder,
    cycleBreakdown
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
  const isMale = typeof gender === 'string' && (gender === 'Male' || gender.toLowerCase() === "male");
  if (isMale) {
    return Math.max(50 + (2.3 * heightInches), 40);
  } else {
    return Math.max(45.5 + (2.3 * heightInches), 38);
  }
};
