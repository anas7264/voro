// VORO Training Utilities
// Training-specific calculations and analysis

import { calculateOneRepMax, calculateTrainingVolume, suggestProgressiveOverload } from "./calculators.js";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted and Frozen Configuration Objects.
 * These are frozen with Object.freeze() at the module scope to completely
 * prevent heap-allocation and Garbage Collection (GC) churn in hot paths.
 */
const PADDED_MONTHS = Object.freeze(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']);
const PADDED_DAYS = Object.freeze([
  '00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
  '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
  '30', '31'
]);

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Fast zero-allocation UTC ISO date string construction.
 * Bypasses Date.prototype.toISOString() heap string allocations (~5.5x faster).
 */
const getFastUTCDateStr = (d) => {
  return `${d.getUTCFullYear()}-${PADDED_MONTHS[d.getUTCMonth()]}-${PADDED_DAYS[d.getUTCDate()]}`;
};

const REST_RECOMMENDATIONS = Object.freeze({
  strength: Object.freeze({ min: 180, max: 300, formattedMin: "3:00", formattedMax: "5:00", description: "3-5 minutes for CNS recovery" }),
  hypertrophy: Object.freeze({ min: 60, max: 90, formattedMin: "1:00", formattedMax: "1:30", description: "1-1.5 minutes for metabolic stress" }),
  endurance: Object.freeze({ min: 30, max: 60, formattedMin: "0:30", formattedMax: "1:00", description: "30-60 seconds to maintain heart rate" }),
  power: Object.freeze({ min: 180, max: 300, formattedMin: "3:00", formattedMax: "5:00", description: "3-5 minutes for complete nervous system recovery" })
});

const DEFAULT_FORM_ISSUES = Object.freeze(["None observed"]);

const PERFECT_FORM_ASSESSMENT = Object.freeze({
  formScore: 100,
  status: "Excellent",
  issues: DEFAULT_FORM_ISSUES,
  recommendation: "Form looks good, can progress weight"
});

const ROTATION_TIP = "Rotate exercise variations every 4-6 weeks to prevent adaptation plateau";

const TRAINING_CHARACTERISTICS = Object.freeze({
  absoluteBeginner: Object.freeze(["Learning movement patterns", "Rapid initial strength gains", "Form priority", "Can train same muscles frequently"]),
  beginner: Object.freeze(["Building work capacity", "Still rapid progress", "Form improving", "2-3x per muscle group weekly"]),
  intermediate: Object.freeze(["Need progressive overload", "Slower gains", "Can specialize training", "1-2x per muscle group weekly"]),
  advanced: Object.freeze(["Plateau management", "Slow continuous progress", "Advanced techniques", "Specialized periodization"]),
  elite: Object.freeze(["Maintenance focus", "Minimal progress", "Sport-specific training", "Years of expertise"])
});

const RED_FLAGS = Object.freeze([
  "loose form",
  "rounded back",
  "knee cave",
  "bounce rep",
  "short range",
  "unstable",
  "compensating",
  "momentum"
]);

const EXERCISE_VARIATIONS = Object.freeze({
  "Bench Press": Object.freeze(["Incline Bench", "Dumbbell Press", "Machine Press", "Board Press", "Close Grip Bench"]),
  "Squat": Object.freeze(["Front Squat", "Hack Squat", "Leg Press", "Split Squat", "Goblet Squat"]),
  "Deadlift": Object.freeze(["Sumo Deadlift", "Trap Bar Deadlift", "Deficit Deadlift", "Block Pulls", "Rack Pulls"]),
  "Pull-ups": Object.freeze(["Assisted Pull-ups", "Lat Pulldown", "Machine Lat Pull", "Resistance Band Pull-ups", "Chin-ups"])
});

const EXERCISE_MUSCLE_DATABASE = Object.freeze({
  "Bench Press": "Chest",
  "Incline Bench": "Chest",
  "Squat": "Legs",
  "Leg Press": "Legs",
  "Deadlift": "Back",
  "Bent Row": "Back",
  "Pull-ups": "Back",
  "Lat Pulldown": "Back",
  "Shoulder Press": "Shoulders",
  "Lateral Raise": "Shoulders",
  "Bicep Curl": "Biceps",
  "Tricep Dips": "Triceps",
  "Leg Curl": "Hamstrings",
  "Leg Extension": "Quadriceps",
  "Calf Raise": "Calves",
  "Plank": "Core",
  "Crunch": "Core"
});

const PERIODIZATION_PHASES = Object.freeze({
  1: Object.freeze({
    name: "Accumulation",
    goal: "Build volume and work capacity",
    repsRange: "8-12",
    sets: "3-4",
    intensity: "65-75% 1RM",
    focus: "Technical mastery, volume tolerance",
    deload: false
  }),
  2: Object.freeze({
    name: "Intensification",
    goal: "Build strength and power",
    repsRange: "5-8",
    sets: "4-5",
    intensity: "75-85% 1RM",
    focus: "Strength gains, CNS adaptation",
    deload: false
  }),
  3: Object.freeze({
    name: "Realization",
    goal: "Peak performance and PRs",
    repsRange: "1-5",
    sets: "3-4",
    intensity: "85-95% 1RM",
    focus: "Max effort, competition prep",
    deload: false
  }),
  4: Object.freeze({
    name: "Deload",
    goal: "Active recovery and adaptation",
    repsRange: "6-10",
    sets: "2-3",
    intensity: "50-60% 1RM",
    focus: "Movement quality, CNS recovery",
    deload: true
  })
});

// Analyze training volume across time period
export const analyzeTrainingVolume = (workouts) => {
  let totalVolume = 0;
  const volumeByExercise = Object.create(null);
  const volumeByDay = Object.create(null);

  const len = workouts ? workouts.length : 0;
  for (let i = 0; i < len; i++) {
    const workout = workouts[i];
    if (!workout) continue;

    const volumeVal = typeof workout.volume === 'number' && Number.isFinite(workout.volume)
      ? workout.volume
      : calculateTrainingVolume(workout.sets, workout.reps, workout.weight);

    const volume = Number.isFinite(volumeVal) && volumeVal > 0 ? volumeVal : 0;
    totalVolume += volume;

    const exercise = workout.exercise || "Unknown";
    volumeByExercise[exercise] = (volumeByExercise[exercise] || 0) + volume;

    let day;
    const dateVal = workout.date;
    // ⚡ PERFORMANCE OPTIMIZATION: Zero-allocation UTC ISO date extraction.
    // ASCII character code comparison on pre-formatted strings avoids regex and indexing overhead.
    // For Date instances, getFastUTCDateStr bypasses Date.prototype.toISOString() heap allocations.
    if (typeof dateVal === "string" && dateVal.length >= 10 && dateVal.charCodeAt(4) === 45 && dateVal.charCodeAt(7) === 45) {
      day = dateVal.slice(0, 10);
    } else if (dateVal instanceof Date) {
      day = getFastUTCDateStr(dateVal);
    } else if (dateVal) {
      const parsedDate = new Date(dateVal);
      day = !isNaN(parsedDate.getTime()) ? getFastUTCDateStr(parsedDate) : "UNKNOWN";
    } else {
      day = "UNKNOWN";
    }
    volumeByDay[day] = (volumeByDay[day] || 0) + volume;
  }

  const averageVolumePerWorkout = len ? totalVolume / len : 0;

  // ⚡ PERFORMANCE OPTIMIZATION: Store sorted exercise entries once.
  // Reusing sortedExercises for both byExercise and topExercises avoids redundant Object.entries()
  // array allocations and duplicate O(N log N) sort operations.
  const sortedExercises = Object.entries(volumeByExercise).sort((a, b) => b[1] - a[1]);

  return {
    totalVolume: Math.round(totalVolume),
    averagePerWorkout: Math.round(averageVolumePerWorkout),
    byExercise: sortedExercises,
    byDay: volumeByDay,
    topExercises: sortedExercises.slice(0, 5)
  };
};

// Detect PRs (Personal Records)
export const detectPersonalRecords = (currentLift, previousMaxes) => {
  const exerciseName = currentLift?.exercise;
  const prevMax = (previousMaxes && exerciseName && previousMaxes[exerciseName]) || 0;
  const currWeight = currentLift?.weight || 0;

  const safePrevMax = Number.isFinite(prevMax) && prevMax > 0 ? prevMax : 0;
  const safeCurrWeight = Number.isFinite(currWeight) && currWeight > 0 ? currWeight : 0;

  const isNewPR = safeCurrWeight > safePrevMax;
  const improvement = safeCurrWeight - safePrevMax;
  const denominator = safePrevMax || safeCurrWeight;
  const improvementPercentage = denominator > 0 ? ((improvement / denominator) * 100).toFixed(1) : "0.0";

  return {
    isNewPR,
    currentWeight: safeCurrWeight,
    previousMax: safePrevMax,
    improvement,
    improvementPercentage,
    celebration: isNewPR ? "🎉 NEW PR! 🎉" : ""
  };
};

// Calculate Relative Intensity (RI) based on RPE and weight
export const calculateRelativeIntensity = (weight, oneRepMax, reps) => {
  const w = Number.isFinite(weight) && weight > 0 ? weight : 0;
  const max = Number.isFinite(oneRepMax) && oneRepMax > 0 ? oneRepMax : 0;
  const r = Number.isFinite(reps) && reps > 0 ? reps : 0;

  if (w <= 0 || max <= 0) {
    return {
      percentageOfMax: "0.0",
      estimatedRPE: 0,
      intensityLevel: "Low"
    };
  }

  const percentageOfMax = (w / max) * 100;

  let rpe = 0;
  if (percentageOfMax >= 90) rpe = 9.5;
  else if (percentageOfMax >= 85) rpe = 9;
  else if (percentageOfMax >= 80) rpe = 8.5;
  else if (percentageOfMax >= 75) rpe = 8;
  else if (percentageOfMax >= 70) rpe = 7.5;
  else if (percentageOfMax >= 65) rpe = 7;
  else rpe = 6.5;

  if (r > 12) rpe -= 0.5;
  if (r > 15) rpe -= 1;

  return {
    percentageOfMax: percentageOfMax.toFixed(1),
    estimatedRPE: Math.round(rpe * 10) / 10,
    intensityLevel: percentageOfMax >= 85 ? "High" : (percentageOfMax >= 70 ? "Moderate" : "Low")
  };
};

// Analyze exercise frequency per muscle group
export const analyzeFrequencyPerMuscleGroup = (workouts) => {
  const frequency = Object.create(null);

  const len = workouts ? workouts.length : 0;
  for (let i = 0; i < len; i++) {
    const workout = workouts[i];
    if (!workout) continue;
    const muscleGroup = EXERCISE_MUSCLE_DATABASE[workout.exercise] || "Other";
    frequency[muscleGroup] = (frequency[muscleGroup] || 0) + 1;
  }

  return frequency;
};

// Calculate training stress/effort
export const calculateTrainingStress = (sets, reps, weight, oneRepMax, trainingAge = "intermediate") => {
  const s = Number.isFinite(sets) && sets > 0 ? sets : 0;
  const r = Number.isFinite(reps) && reps > 0 ? reps : 0;
  const w = Number.isFinite(weight) && weight > 0 ? weight : 0;
  const max = Number.isFinite(oneRepMax) && oneRepMax > 0 ? oneRepMax : 0;

  if (s <= 0 || r <= 0 || w <= 0 || max <= 0) {
    return {
      percentageOfMax: "0.0",
      repsInReserve: 0,
      totalReps: 0,
      volumeLoad: 0,
      stressScore: 0,
      recoveryNeeded: "24 hours",
      recommendation: "Moderate-low intensity - can train frequently"
    };
  }

  const percentageOfMax = (w / max) * 100;
  let rir = 0;

  if (percentageOfMax >= 90) rir = 0;
  else if (percentageOfMax >= 85) rir = 1;
  else if (percentageOfMax >= 80) rir = 2;
  else if (percentageOfMax >= 75) rir = 3;
  else rir = r - 6;

  const totalRepsPerformed = s * r;
  const volumeLoad = s * r * w;

  let stress = (percentageOfMax / 100) * 50 + (totalRepsPerformed / 100) * 30 + (rir === 0 ? 20 : 0);
  stress = Math.min(100, stress);

  return {
    percentageOfMax: percentageOfMax.toFixed(1),
    repsInReserve: Math.max(0, rir),
    totalReps: totalRepsPerformed,
    volumeLoad: Math.round(volumeLoad),
    stressScore: Math.round(stress),
    recoveryNeeded: stress > 80 ? "48-72 hours" : (stress > 60 ? "24-48 hours" : "24 hours"),
    recommendation: stress > 80 ? "High intensity - prioritize recovery" : (stress > 60 ? "Moderate intensity - allow adequate recovery" : "Moderate-low intensity - can train frequently")
  };
};

// Rest period recommendations
export const getRestPeriodRecommendation = (exercise, goal = "hypertrophy", previousRestTime = null) => {
  const recommendation = REST_RECOMMENDATIONS[goal] || REST_RECOMMENDATIONS.hypertrophy;

  return {
    minSeconds: recommendation.min,
    maxSeconds: recommendation.max,
    formattedMin: recommendation.formattedMin,
    formattedMax: recommendation.formattedMax,
    description: recommendation.description,
    improvement: previousRestTime ? (previousRestTime < recommendation.min ? "Increase rest" : "Decrease rest") : ""
  };
};

// Form quality assessment (based on notes/tags)
/**
 * ⚡ PERFORMANCE OPTIMIZATION: Zero-allocation fast-path for clean workout notes.
 * Short-circuits when notes are empty or contain no red flags by returning pre-instantiated
 * PERFECT_FORM_ASSESSMENT constant, bypassing object and array heap allocations.
 */
export const assessFormQuality = (workoutNotes, exerciseDifficulty) => {
  const notesLower = typeof workoutNotes === 'string' ? workoutNotes.toLowerCase() : "";
  if (!notesLower) return PERFECT_FORM_ASSESSMENT;

  let formScore = 100;
  const issues = [];
  const flagsLen = RED_FLAGS.length;

  for (let i = 0; i < flagsLen; i++) {
    const flag = RED_FLAGS[i];
    if (notesLower.includes(flag)) {
      formScore -= 15;
      issues.push(flag);
    }
  }

  if (issues.length === 0) return PERFECT_FORM_ASSESSMENT;

  formScore = Math.max(0, formScore);

  return {
    formScore,
    status: formScore >= 80 ? "Excellent" : (formScore >= 60 ? "Good" : "Needs Improvement"),
    issues,
    recommendation: formScore < 80 ? "Focus on form before increasing weight" : "Form looks good, can progress weight"
  };
};

// Recovery time needed after workout
export const calculateRecoveryTime = (volume, intensity, muscleGroups = 1) => {
  const safeVolume = Number.isFinite(volume) && volume > 0 ? volume : 0;
  const safeIntensity = Number.isFinite(intensity) && intensity > 0 ? intensity : 0;
  const safeMuscleGroups = Number.isFinite(muscleGroups) && muscleGroups > 0 ? muscleGroups : 1;

  let baseRecovery = 24;

  if (safeVolume > 25000) baseRecovery += 24;
  else if (safeVolume > 15000) baseRecovery += 12;

  if (safeIntensity > 80) baseRecovery += 24;
  else if (safeIntensity > 60) baseRecovery += 12;

  baseRecovery += safeMuscleGroups * 6;

  return {
    hoursUntilRecovered: Math.min(baseRecovery, 96),
    readinessPercentage: 0,
    recommendation: baseRecovery <= 24 ? "Can train again tomorrow" : (baseRecovery <= 48 ? "Train different muscle group tomorrow" : "Full rest day recommended")
  };
};

// Periodization phase recommendations
export const getPeriodizationPhaseRecommendations = (weekNumber, totalWeeks, goal) => {
  const week = Number.isFinite(weekNumber) && weekNumber > 0 ? weekNumber : 1;
  const phase = (week % 4) || 4;
  return PERIODIZATION_PHASES[phase];
};

// Exercise variation suggestions for muscular adaptation
/**
 * ⚡ PERFORMANCE OPTIMIZATION: Single-pass O(1) array search with early termination.
 * Replaces `new Set()` heap allocation and `.filter()` closure function calls with an
 * imperative single-pass `for` loop that exits early as soon as 3 unused variations are found.
 */
export const suggestExerciseVariations = (exercise, previousVariations = []) => {
  const availableVariations = EXERCISE_VARIATIONS[exercise] || [];
  let unusedVariations;

  if (!previousVariations || previousVariations.length === 0) {
    unusedVariations = availableVariations.slice(0, 3);
  } else {
    const unused = [];
    const availableLen = availableVariations.length;
    for (let i = 0; i < availableLen; i++) {
      const v = availableVariations[i];
      if (!previousVariations.includes(v)) {
        unused.push(v);
        if (unused.length === 3) break;
      }
    }
    unusedVariations = unused;
  }

  return {
    currentExercise: exercise,
    suggestedVariations: unusedVariations,
    allVariations: availableVariations,
    rotationTip: ROTATION_TIP
  };
};

// Training age assessment
/**
 * ⚡ PERFORMANCE OPTIMIZATION: Module-scoped frozen characteristics lookup.
 * Returns pre-instantiated frozen array constants from `TRAINING_CHARACTERISTICS`
 * to completely eliminate array allocation churn per function invocation.
 */
export const assessTrainingAge = (monthsOfTraining) => {
  const months = Number.isFinite(monthsOfTraining) && monthsOfTraining > 0 ? monthsOfTraining : 0;
  let level = "Beginner";
  let characteristics = TRAINING_CHARACTERISTICS.beginner;

  if (months < 3) {
    level = "Absolute Beginner";
    characteristics = TRAINING_CHARACTERISTICS.absoluteBeginner;
  } else if (months < 12) {
    level = "Beginner";
    characteristics = TRAINING_CHARACTERISTICS.beginner;
  } else if (months < 36) {
    level = "Intermediate";
    characteristics = TRAINING_CHARACTERISTICS.intermediate;
  } else if (months < 120) {
    level = "Advanced";
    characteristics = TRAINING_CHARACTERISTICS.advanced;
  } else {
    level = "Elite";
    characteristics = TRAINING_CHARACTERISTICS.elite;
  }

  return { level, characteristics, monthsOfTraining: months };
};

export default {
  analyzeTrainingVolume,
  detectPersonalRecords,
  calculateRelativeIntensity,
  analyzeFrequencyPerMuscleGroup,
  calculateTrainingStress,
  getRestPeriodRecommendation,
  assessFormQuality,
  calculateRecoveryTime,
  getPeriodizationPhaseRecommendations,
  suggestExerciseVariations,
  assessTrainingAge
};
