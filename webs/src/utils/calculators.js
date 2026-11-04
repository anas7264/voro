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
  const w = typeof weightKg === 'number' ? weightKg : parseFloat(weightKg);
  const h = typeof heightCm === 'number' ? heightCm : parseFloat(heightCm);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return "0.0";
  const heightM = h / 100;
  return (w / (heightM * heightM)).toFixed(1);
};

export const getBMICategory = (bmi) => {
  const val = typeof bmi === 'number' ? bmi : parseFloat(bmi);
  if (!Number.isFinite(val) || val <= 0) return "Unknown";
  if (val < 18.5) return "Underweight";
  if (val < 25) return "Normal Weight";
  if (val < 30) return "Overweight";
  return "Obese";
};

// Basal Metabolic Rate - Mifflin-St Jeor (most accurate)
export const calculateBMR = (weightKg, heightCm, age, gender) => {
  const w = typeof weightKg === 'number' ? weightKg : parseFloat(weightKg);
  const h = typeof heightCm === 'number' ? heightCm : parseFloat(heightCm);
  const a = typeof age === 'number' ? age : parseFloat(age);
  if (!Number.isFinite(w) || !Number.isFinite(h) || !Number.isFinite(a) || w <= 0 || h <= 0 || a <= 0) return "0";
  // Performance optimization: Avoid repeated lowercasing where possible.
  const isMale = typeof gender === 'string' && (gender === 'male' || gender === 'Male' || gender.toLowerCase() === "male");
  if (isMale) {
    return (10 * w + 6.25 * h - 5 * a + 5).toFixed(0);
  } else {
    return (10 * w + 6.25 * h - 5 * a - 161).toFixed(0);
  }
};

// Total Daily Energy Expenditure using activity multiplier
export const calculateTDEE = (bmr, activityLevel) => {
  const numericBmr = typeof bmr === 'number' ? bmr : parseFloat(bmr);
  if (!Number.isFinite(numericBmr) || numericBmr <= 0) return 0;
  return Math.round(numericBmr * (TDEE_MULTIPLIERS[activityLevel] || 1.55));
};

// Protein targets based on goal and weight
export const calculateProteinTarget = (weightKg, goal = "maintenance") => {
  const w = typeof weightKg === 'number' ? weightKg : parseFloat(weightKg);
  if (!Number.isFinite(w) || w <= 0) return 0;
  return Math.round(w * (PROTEIN_TARGET_MULTIPLIERS[goal] || 1.6));
};

// Water intake recommendation in liters
export const calculateWaterIntake = (weightKg, activityMinutesPerDay = 0) => {
  const w = typeof weightKg === 'number' ? weightKg : parseFloat(weightKg);
  if (!Number.isFinite(w) || w <= 0) return "0.0";
  const mins = typeof activityMinutesPerDay === 'number' ? activityMinutesPerDay : parseFloat(activityMinutesPerDay);
  const safeMins = Number.isFinite(mins) && mins > 0 ? mins : 0;
  const baseIntake = w * 0.035; // ~35ml per kg
  const exerciseBonus = (safeMins / 30) * 0.5; // 500ml per 30 min exercise
  return (baseIntake + exerciseBonus).toFixed(1);
};

// One Rep Max estimators
export const calculateOneRepMax = {
  epley: (weight, reps) => {
    const w = typeof weight === 'number' ? weight : parseFloat(weight);
    const r = typeof reps === 'number' ? reps : parseFloat(reps);
    if (!Number.isFinite(w) || !Number.isFinite(r) || w <= 0 || r <= 0) return 0;
    if (r === 1) return Math.round(w);
    return Math.round(w * (1 + r / 30));
  },
  brzycki: (weight, reps) => {
    const w = typeof weight === 'number' ? weight : parseFloat(weight);
    const r = typeof reps === 'number' ? reps : parseFloat(reps);
    if (!Number.isFinite(w) || !Number.isFinite(r) || w <= 0 || r <= 0) return 0;
    if (r === 1) return Math.round(w);
    const safeReps = Math.min(r, 36);
    return Math.round(w * (36 / (37 - safeReps)));
  },
  lander: (weight, reps) => {
    const w = typeof weight === 'number' ? weight : parseFloat(weight);
    const r = typeof reps === 'number' ? reps : parseFloat(reps);
    if (!Number.isFinite(w) || !Number.isFinite(r) || w <= 0 || r <= 0) return 0;
    if (r === 1) return Math.round(w);
    const denom = 101.3 - 2.67123 * r;
    if (denom <= 0) return Math.round(w * 2);
    return Math.round((100 * w) / denom);
  },
  reynolds: (weight, reps) => {
    const w = typeof weight === 'number' ? weight : parseFloat(weight);
    const r = typeof reps === 'number' ? reps : parseFloat(reps);
    if (!Number.isFinite(w) || !Number.isFinite(r) || w <= 0 || r <= 0) return 0;
    if (r === 1) return Math.round(w);
    return Math.round(w * (1 + r / 15));
  },
  adamson: (weight, reps) => {
    const w = typeof weight === 'number' ? weight : parseFloat(weight);
    const r = typeof reps === 'number' ? reps : parseFloat(reps);
    if (!Number.isFinite(w) || !Number.isFinite(r) || w <= 0 || r <= 0) return 0;
    if (r === 1) return Math.round(w);
    return Math.round(w * (1 + r / 20));
  },
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Zero-allocation average calculation.
   * Completely bypasses array allocation `[estimates]`, closure execution, and `.reduce()` logic.
   * Includes defensive boundary checks to prevent divide-by-zero on reps >= 37 and short-circuits when reps === 1.
   */
  average: (weight, reps) => {
    const w = typeof weight === 'number' ? weight : parseFloat(weight);
    const r = typeof reps === 'number' ? reps : parseFloat(reps);
    if (!Number.isFinite(w) || !Number.isFinite(r) || w <= 0 || r <= 0) return 0;
    if (r === 1) return Math.round(w);

    const safeRepsBrzycki = Math.min(r, 36);
    const landerDenom = 101.3 - 2.67123 * r;

    const epley = w * (1 + r / 30);
    const brzycki = w * (36 / (37 - safeRepsBrzycki));
    const lander = landerDenom > 0 ? (100 * w) / landerDenom : w * 2;
    const reynolds = w * (1 + r / 15);
    const adamson = w * (1 + r / 20);

    return Math.round((epley + brzycki + lander + reynolds + adamson) / 5);
  }
};

// Wilks Coefficient (strength-to-bodyweight ratio for comparing lifters)
export const calculateWilksCoefficient = (totalWeight, bodyweightKg, gender) => {
  const tw = typeof totalWeight === 'number' ? totalWeight : parseFloat(totalWeight);
  const bw = typeof bodyweightKg === 'number' ? bodyweightKg : parseFloat(bodyweightKg);
  if (!Number.isFinite(tw) || !Number.isFinite(bw) || tw <= 0 || bw <= 0) return "0.00";
  const isMale = typeof gender === 'string' && (gender === 'male' || gender === 'Male' || gender.toLowerCase() === "male");
  const a = isMale ? -216.0475 : -594.31;
  const b = isMale ? 16.2606 : 27.91957;
  const c = isMale ? -0.002388 : -0.12835;
  const bodyweightSq = bw * bw;
  const denom = a + b * bw + c * bodyweightSq;
  if (!denom || !Number.isFinite(denom) || denom === 0) return "0.00";
  const coefficient = 500 / denom;
  return (tw * coefficient).toFixed(2);
};

// Fat-Free Mass Index (muscle mass relative to height)
export const calculateFFMI = (weightKg, bodyFatPercent, heightCm) => {
  const w = typeof weightKg === 'number' ? weightKg : parseFloat(weightKg);
  const h = typeof heightCm === 'number' ? heightCm : parseFloat(heightCm);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return "0.0";
  const bfVal = typeof bodyFatPercent === 'number' ? bodyFatPercent : parseFloat(bodyFatPercent);
  const bf = Number.isFinite(bfVal) ? Math.max(0, Math.min(100, bfVal)) : 0;
  const leanMassKg = w * (1 - bf / 100);
  const heightM = h / 100;
  return (leanMassKg / (heightM * heightM)).toFixed(1);
};

// Maximum Heart Rate and training zones
export const calculateMaxHeartRate = (age, method = "karvonen") => {
  const a = typeof age === 'number' ? age : parseFloat(age);
  if (!Number.isFinite(a) || a <= 0) return 0;
  if (method === "tanaka") return Math.round(208 - (0.7 * a));
  if (method === "gulati_female") return Math.round(206 - (0.88 * a));
  return Math.round(220 - a); // Default
};

export const getHeartRateZones = (maxHeartRate, restingHeartRate = 60) => {
  const mhr = typeof maxHeartRate === 'number' ? maxHeartRate : parseFloat(maxHeartRate);
  if (!Number.isFinite(mhr) || mhr <= 0) return DEFAULT_HR_ZONES;
  const zone2 = mhr * 0.5; // Warm-up: 50%
  const zone3 = mhr * 0.6; // Zone 2: 60%
  const zone4 = mhr * 0.7; // Zone 3: 70%
  const zone5 = mhr * 0.8; // Zone 4: 80%
  const zone6 = mhr * 0.9; // Zone 5: 90%

  return {
    warmup: { min: Math.round(zone2), max: Math.round(zone3), name: "Warm-up", intensity: "50-60%" },
    zone2: { min: Math.round(zone3), max: Math.round(zone4), name: "Zone 2", intensity: "60-70%" },
    zone3: { min: Math.round(zone4), max: Math.round(zone5), name: "Zone 3", intensity: "70-80%" },
    zone4: { min: Math.round(zone5), max: Math.round(zone6), name: "Zone 4", intensity: "80-90%" },
    zone5: { min: Math.round(zone6), max: Math.round(mhr), name: "VO2 Max", intensity: "90-100%" }
  };
};

// VO2 Max estimation (Karvonen formula from max heart rate)
export const estimateVO2Max = (age, gender, resting_heart_rate) => {
  const a = typeof age === 'number' ? age : parseFloat(age);
  const rhr = typeof resting_heart_rate === 'number' ? resting_heart_rate : parseFloat(resting_heart_rate);
  if (!Number.isFinite(a) || !Number.isFinite(rhr) || a <= 0 || rhr <= 0) return 0;
  const maxHR = calculateMaxHeartRate(a);
  const fitnessIndex = ((maxHR - rhr) / a) * 10;
  return Math.round(fitnessIndex * 0.5);
};

// Pace converter (convert between min/km and km/h)
export const convertPace = (pace, unit = "kmh_to_pace") => {
  if (unit === "kmh_to_pace") {
    const p = typeof pace === 'number' ? pace : parseFloat(pace);
    if (!p || p <= 0 || !Number.isFinite(p)) return "0:00";
    const totalSeconds = Math.round(3600 / p);
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
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
  const w = typeof weightKg === 'number' ? weightKg : parseFloat(weightKg);
  const d = typeof durationMinutes === 'number' ? durationMinutes : parseFloat(durationMinutes);
  if (!Number.isFinite(w) || !Number.isFinite(d) || w <= 0 || d <= 0) return 0;
  const met = CALORIC_BURN_METS[activity] || 5.0;
  return Math.round((met * w * d) / 60);
};

// Macro ratio calculator
export const calculateMacroRatios = (calories, goalProteinG, goalCarbG, goalFatG) => {
  const c = typeof calories === 'number' ? calories : parseFloat(calories);
  const p = typeof goalProteinG === 'number' ? goalProteinG : parseFloat(goalProteinG);
  const carb = typeof goalCarbG === 'number' ? goalCarbG : parseFloat(goalCarbG);
  const f = typeof goalFatG === 'number' ? goalFatG : parseFloat(goalFatG);
  const cals = Number.isFinite(c) && c > 0 ? c : 0;
  const pG = Number.isFinite(p) && p > 0 ? p : 0;
  const cG = Number.isFinite(carb) && carb > 0 ? carb : 0;
  const fG = Number.isFinite(f) && f > 0 ? f : 0;
  return {
    protein: { grams: pG, calories: pG * 4, percentage: cals > 0 ? ((pG * 4) / cals * 100).toFixed(1) : "0.0" },
    carbs: { grams: cG, calories: cG * 4, percentage: cals > 0 ? ((cG * 4) / cals * 100).toFixed(1) : "0.0" },
    fat: { grams: fG, calories: fG * 9, percentage: cals > 0 ? ((fG * 9) / cals * 100).toFixed(1) : "0.0" }
  };
};

// Calculate surplus/deficit for goal
export const calculateCalorieAdjustment = (tdee, goal) => {
  const t = typeof tdee === 'number' ? tdee : parseFloat(tdee);
  if (!Number.isFinite(t) || t <= 0) return 0;
  const multiplier = GOAL_CALORIC_ADJUSTMENTS[goal] || 1.0;
  return Math.round(t * multiplier);
};

// Periodization cycle calculator
export const calculatePeriodizationCycle = (totalWeeks, cycles = 4) => {
  const tw = typeof totalWeeks === 'number' ? totalWeeks : parseFloat(totalWeeks);
  const c = typeof cycles === 'number' ? cycles : parseFloat(cycles);
  const validWeeks = Number.isFinite(tw) && tw > 0 ? Math.floor(tw) : 12;
  const validCycles = Number.isFinite(c) && c > 0 ? Math.floor(c) : 4;

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
  const s = typeof sets === 'number' ? sets : parseFloat(sets);
  const r = typeof reps === 'number' ? reps : parseFloat(reps);
  const w = typeof weight === 'number' ? weight : parseFloat(weight);
  const safeS = Number.isFinite(s) && s > 0 ? s : 0;
  const safeR = Number.isFinite(r) && r > 0 ? r : 0;
  const safeW = Number.isFinite(w) && w > 0 ? w : 0;
  return safeS * safeR * safeW;
};

// Progressive overload suggestions
export const suggestProgressiveOverload = (currentSets = 3, currentReps = 10, currentWeight = 60, trainingAge = "intermediate") => {
  const s = typeof currentSets === 'number' ? currentSets : parseFloat(currentSets);
  const r = typeof currentReps === 'number' ? currentReps : parseFloat(currentReps);
  const w = typeof currentWeight === 'number' ? currentWeight : parseFloat(currentWeight);
  const sets = Number.isFinite(s) && s > 0 ? s : 3;
  const reps = Number.isFinite(r) && r > 0 ? r : 10;
  const weight = Number.isFinite(w) && w > 0 ? w : 60;

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
  const sl = typeof sleepHours === 'number' ? sleepHours : parseFloat(sleepHours);
  const st = typeof stressLevel === 'number' ? stressLevel : parseFloat(stressLevel);
  const nc = typeof nutritionCompleteness === 'number' ? nutritionCompleteness : parseFloat(nutritionCompleteness);
  const sleep = Number.isFinite(sl) ? Math.max(0, sl) : 8;
  const stress = Number.isFinite(st) ? Math.max(0, Math.min(10, st)) : 5;
  const nutrition = Number.isFinite(nc) ? Math.max(0, Math.min(1, nc)) : 1;

  const sleepScore = Math.min((sleep / 8) * 40, 40);
  const stressScore = (1 - stress / 10) * 30; // 0-10 stress scale inverted
  const nutritionScore = nutrition * 30; // 0-1 completeness

  return Math.round(sleepScore + stressScore + nutritionScore);
};

// Overtraining risk assessment (0-100, >70 indicates high risk)
export const assessOvertrainingRisk = (weeklyVolume = 0, weeklyFrequency = 0, averageIntensity = 5, sleepQuality = 8) => {
  const wv = typeof weeklyVolume === 'number' ? weeklyVolume : parseFloat(weeklyVolume);
  const wf = typeof weeklyFrequency === 'number' ? weeklyFrequency : parseFloat(weeklyFrequency);
  const ai = typeof averageIntensity === 'number' ? averageIntensity : parseFloat(averageIntensity);
  const sq = typeof sleepQuality === 'number' ? sleepQuality : parseFloat(sleepQuality);
  const volume = Number.isFinite(wv) && wv > 0 ? wv : 0;
  const freq = Number.isFinite(wf) && wf > 0 ? wf : 0;
  const intensity = Number.isFinite(ai) ? Math.max(0, Math.min(10, ai)) : 5;
  const sleep = Number.isFinite(sq) ? Math.max(0, Math.min(10, sq)) : 8;

  const volumeRisk = Math.min((volume / 20000) * 30, 30); // Normalized to 20k volume
  const frequencyRisk = Math.min((freq / 6) * 30, 30); // Normalized to 6x/week
  const intensityRisk = (intensity / 10) * 30; // 0-10 scale
  const sleepRisk = (1 - sleep / 10) * 10; // 0-10 quality inverted

  return Math.round(volumeRisk + frequencyRisk + intensityRisk + sleepRisk);
};

// Ideal Body Weight - Devine Formula
export const calculateIdealWeight = (heightCm, gender = 'Male') => {
  const h = typeof heightCm === 'number' ? heightCm : parseFloat(heightCm);
  if (!Number.isFinite(h) || h <= 0) return 0;
  const heightInches = (h - 152.4) / 2.54;
  const isMale = typeof gender === 'string' && (gender === 'Male' || gender === 'male' || gender.toLowerCase() === "male");
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
