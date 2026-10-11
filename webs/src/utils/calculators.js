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

const DEFAULT_HR_ZONES = Object.freeze({
  warmup: Object.freeze({ min: 0, max: 0, name: "Warm-up", intensity: "50-60%" }),
  zone2: Object.freeze({ min: 0, max: 0, name: "Zone 2", intensity: "60-70%" }),
  zone3: Object.freeze({ min: 0, max: 0, name: "Zone 3", intensity: "70-80%" }),
  zone4: Object.freeze({ min: 0, max: 0, name: "Zone 4", intensity: "80-90%" }),
  zone5: Object.freeze({ min: 0, max: 0, name: "VO2 Max", intensity: "90-100%" })
});

const REST_REDUCTION_SUGGESTION = Object.freeze({ method: "Reduce Rest", suggestedRestReduction: "Decrease rest 15-30 seconds" });
const VARIATION_SUGGESTION = Object.freeze({ method: "Add Exercise Variation", suggestion: "Change grip, angle, or ROM" });

// BMI Calculation: weight(kg) / height(m)²
export const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0 || !Number.isFinite(weightKg) || !Number.isFinite(heightCm)) return "0.0";
  const heightM = heightCm / 100;
  return (weightKg / (heightM * heightM)).toFixed(1);
};

export const getBMICategory = (bmi) => {
  if (!Number.isFinite(bmi) || bmi <= 0) return "Unknown";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal Weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

// Basal Metabolic Rate - Mifflin-St Jeor (most accurate)
export const calculateBMR = (weightKg, heightCm, age, gender) => {
  if (!weightKg || !heightCm || !age || weightKg <= 0 || heightCm <= 0 || age <= 0 || !Number.isFinite(weightKg) || !Number.isFinite(heightCm) || !Number.isFinite(age)) return "0";
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
  const numericBmr = typeof bmr === 'number' ? bmr : parseFloat(bmr);
  if (!numericBmr || numericBmr <= 0 || !Number.isFinite(numericBmr)) return 0;
  return Math.round(numericBmr * (TDEE_MULTIPLIERS[activityLevel] || 1.55));
};

// Protein targets based on goal and weight
export const calculateProteinTarget = (weightKg, goal = "maintenance") => {
  if (!weightKg || weightKg <= 0 || !Number.isFinite(weightKg)) return 0;
  return Math.round(weightKg * (PROTEIN_TARGET_MULTIPLIERS[goal] || 1.6));
};

// Water intake recommendation in liters
export const calculateWaterIntake = (weightKg, activityMinutesPerDay = 0) => {
  if (!weightKg || weightKg <= 0 || !Number.isFinite(weightKg)) return "0.0";
  const mins = Number.isFinite(activityMinutesPerDay) && activityMinutesPerDay > 0 ? activityMinutesPerDay : 0;
  const baseIntake = weightKg * 0.035; // ~35ml per kg
  const exerciseBonus = (mins / 30) * 0.5; // 500ml per 30 min exercise
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
  if (!totalWeight || !bodyweightKg || totalWeight <= 0 || bodyweightKg <= 0 || !Number.isFinite(totalWeight) || !Number.isFinite(bodyweightKg)) return "0.00";
  const isMale = typeof gender === 'string' && (gender === 'male' || gender.toLowerCase() === "male");
  const a = isMale ? -216.0475 : -594.31;
  const b = isMale ? 16.2606 : 27.91957;
  const c = isMale ? -0.002388 : -0.12835;
  const bodyweightSq = bodyweightKg * bodyweightKg;
  const denom = a + b * bodyweightKg + c * bodyweightSq;
  if (!denom || !Number.isFinite(denom) || denom === 0) return "0.00";
  const coefficient = 500 / denom;
  return (totalWeight * coefficient).toFixed(2);
};

// Fat-Free Mass Index (muscle mass relative to height)
export const calculateFFMI = (weightKg, bodyFatPercent, heightCm) => {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0 || !Number.isFinite(weightKg) || !Number.isFinite(heightCm)) return "0.0";
  const bf = Number.isFinite(bodyFatPercent) ? Math.max(0, Math.min(100, bodyFatPercent)) : 0;
  const leanMassKg = weightKg * (1 - bf / 100);
  const heightM = heightCm / 100;
  return (leanMassKg / (heightM * heightM)).toFixed(1);
};

// Maximum Heart Rate and training zones
export const calculateMaxHeartRate = (age, method = "karvonen") => {
  if (!age || age <= 0 || !Number.isFinite(age)) return 0;
  if (method === "tanaka") return Math.round(208 - (0.7 * age));
  if (method === "gulati_female") return Math.round(206 - (0.88 * age));
  return Math.round(220 - age); // Default
};

export const getHeartRateZones = (maxHeartRate, restingHeartRate = 60) => {
  if (!maxHeartRate || maxHeartRate <= 0 || !Number.isFinite(maxHeartRate)) return DEFAULT_HR_ZONES;
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
  if (!age || age <= 0 || !Number.isFinite(age) || !resting_heart_rate || resting_heart_rate <= 0 || !Number.isFinite(resting_heart_rate)) return 0;
  const maxHR = calculateMaxHeartRate(age);
  const fitnessIndex = ((maxHR - resting_heart_rate) / age) * 10;
  return Math.round(fitnessIndex * 0.5);
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
  if (!weightKg || !durationMinutes || weightKg <= 0 || durationMinutes <= 0 || !Number.isFinite(weightKg) || !Number.isFinite(durationMinutes)) return 0;
  const met = CALORIC_BURN_METS[activity] || 5.0;
  return Math.round((met * weightKg * durationMinutes) / 60);
};

// Macro ratio calculator
export const calculateMacroRatios = (calories, goalProteinG, goalCarbG, goalFatG) => {
  const cals = calories && calories > 0 && Number.isFinite(calories) ? calories : 0;
  const pG = goalProteinG && Number.isFinite(goalProteinG) ? goalProteinG : 0;
  const cG = goalCarbG && Number.isFinite(goalCarbG) ? goalCarbG : 0;
  const fG = goalFatG && Number.isFinite(goalFatG) ? goalFatG : 0;
  return {
    protein: { grams: pG, calories: pG * 4, percentage: cals > 0 ? ((pG * 4) / cals * 100).toFixed(1) : "0.0" },
    carbs: { grams: cG, calories: cG * 4, percentage: cals > 0 ? ((cG * 4) / cals * 100).toFixed(1) : "0.0" },
    fat: { grams: fG, calories: fG * 9, percentage: cals > 0 ? ((fG * 9) / cals * 100).toFixed(1) : "0.0" }
  };
};

// Calculate surplus/deficit for goal
export const calculateCalorieAdjustment = (tdee, goal) => {
  if (!tdee || tdee <= 0 || !Number.isFinite(tdee)) return 0;
  const multiplier = GOAL_CALORIC_ADJUSTMENTS[goal] || 1.0;
  return Math.round(tdee * multiplier);
};

// Periodization cycle calculator
export const calculatePeriodizationCycle = (totalWeeks, cycles = 4) => {
  const validWeeks = Number.isFinite(totalWeeks) && totalWeeks > 0 ? Math.floor(totalWeeks) : 12;
  const validCycles = Number.isFinite(cycles) && cycles > 0 ? Math.floor(cycles) : 4;

  const weeksPerCycle = Math.floor(validWeeks / validCycles);
  const remainder = validWeeks % validCycles;

  // ⚡ PERFORMANCE OPTIMIZATION: Single-pass pre-allocated array instantiation.
  // Replaces multi-pass `Array(cycles).fill().map()` construct, completely eliminating
  // temporary intermediate array allocations and callback closure allocations.
  const deload = Math.ceil((weeksPerCycle + remainder) / 4);
  const cycleBreakdown = new Array(validCycles);
  for (let i = 0; i < validCycles; i++) {
    cycleBreakdown[i] = {
      cycle: i + 1,
      weeks: i === validCycles - 1 ? weeksPerCycle + remainder : weeksPerCycle,
      deload
    };
  }

  return {
    totalWeeks: validWeeks,
    cycles: validCycles,
    weeksPerCycle,
    remainderWeeks: remainder,
    cycleBreakdown
  };
};

// Training volume calculator (sets × reps × weight)
export const calculateTrainingVolume = (sets, reps, weight) => {
  const s = Number.isFinite(sets) && sets > 0 ? sets : 0;
  const r = Number.isFinite(reps) && reps > 0 ? reps : 0;
  const w = Number.isFinite(weight) && weight > 0 ? weight : 0;
  return s * r * w;
};

// Progressive overload suggestions
export const suggestProgressiveOverload = (currentSets = 3, currentReps = 10, currentWeight = 60, trainingAge = "intermediate") => {
  const sets = Number.isFinite(currentSets) && currentSets > 0 ? currentSets : 3;
  const reps = Number.isFinite(currentReps) && currentReps > 0 ? currentReps : 10;
  const weight = Number.isFinite(currentWeight) && currentWeight > 0 ? currentWeight : 60;

  return [
    { method: "Add Reps", currentReps: reps, suggestedReps: reps + 1 },
    { method: "Add Sets", currentSets: sets, suggestedSets: sets + 1 },
    { method: "Increase Weight", currentWeight: weight, suggestedWeight: Math.round(weight * 1.025) },
    REST_REDUCTION_SUGGESTION,
    VARIATION_SUGGESTION
  ];
};

// Recovery score (0-100) based on sleep, stress, nutrition
export const calculateRecoveryScore = (sleepHours = 8, stressLevel = 5, nutritionCompleteness = 1) => {
  const sleep = Number.isFinite(sleepHours) ? Math.max(0, sleepHours) : 8;
  const stress = Number.isFinite(stressLevel) ? Math.max(0, Math.min(10, stressLevel)) : 5;
  const nutrition = Number.isFinite(nutritionCompleteness) ? Math.max(0, Math.min(1, nutritionCompleteness)) : 1;

  const sleepScore = Math.min((sleep / 8) * 40, 40);
  const stressScore = (1 - stress / 10) * 30; // 0-10 stress scale inverted
  const nutritionScore = nutrition * 30; // 0-1 completeness

  return Math.round(sleepScore + stressScore + nutritionScore);
};

// Overtraining risk assessment (0-100, >70 indicates high risk)
export const assessOvertrainingRisk = (weeklyVolume = 0, weeklyFrequency = 0, averageIntensity = 5, sleepQuality = 8) => {
  const volume = Number.isFinite(weeklyVolume) && weeklyVolume > 0 ? weeklyVolume : 0;
  const freq = Number.isFinite(weeklyFrequency) && weeklyFrequency > 0 ? weeklyFrequency : 0;
  const intensity = Number.isFinite(averageIntensity) ? Math.max(0, Math.min(10, averageIntensity)) : 5;
  const sleep = Number.isFinite(sleepQuality) ? Math.max(0, Math.min(10, sleepQuality)) : 8;

  const volumeRisk = Math.min((volume / 20000) * 30, 30); // Normalized to 20k volume
  const frequencyRisk = Math.min((freq / 6) * 30, 30); // Normalized to 6x/week
  const intensityRisk = (intensity / 10) * 30; // 0-10 scale
  const sleepRisk = (1 - sleep / 10) * 10; // 0-10 quality inverted

  return Math.round(volumeRisk + frequencyRisk + intensityRisk + sleepRisk);
};

// Ideal Body Weight - Devine Formula
export const calculateIdealWeight = (heightCm, gender = 'Male') => {
  if (!heightCm || heightCm <= 0 || !Number.isFinite(heightCm)) return 0;
  const heightInches = (heightCm - 152.4) / 2.54;
  const isMale = typeof gender === 'string' && (gender === 'Male' || gender.toLowerCase() === "male");
  if (isMale) {
    return Math.max(50 + (2.3 * heightInches), 40);
  } else {
    return Math.max(45.5 + (2.3 * heightInches), 38);
  }
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
  assessOvertrainingRisk,
  calculateIdealWeight
};
