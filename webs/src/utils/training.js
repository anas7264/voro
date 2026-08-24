// VORO Training Utilities
// Training-specific calculations and analysis

import { calculateOneRepMax, calculateTrainingVolume, suggestProgressiveOverload } from "./calculators.js";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted and Frozen Configuration Objects.
 * These are frozen with Object.freeze() at the module scope to completely
 * prevent heap-allocation and Garbage Collection (GC) churn in hot paths.
 */
const REST_RECOMMENDATIONS = Object.freeze({
  strength: Object.freeze({ min: 180, max: 300, description: "3-5 minutes for CNS recovery" }),
  hypertrophy: Object.freeze({ min: 60, max: 90, description: "1-1.5 minutes for metabolic stress" }),
  endurance: Object.freeze({ min: 30, max: 60, description: "30-60 seconds to maintain heart rate" }),
  power: Object.freeze({ min: 180, max: 300, description: "3-5 minutes for complete nervous system recovery" })
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
  // workouts: array of { date, exercise, sets, reps, weight }

  let totalVolume = 0;
  let volumeByExercise = {};
  let volumeByDay = {};

  workouts.forEach(workout => {
    const volume = calculateTrainingVolume(workout.sets, workout.reps, workout.weight);
    totalVolume += volume;

    // Group by exercise
    if (!volumeByExercise[workout.exercise]) {
      volumeByExercise[workout.exercise] = 0;
    }
    volumeByExercise[workout.exercise] += volume;

    // Group by day
    // ⚡ PERFORMANCE OPTIMIZATION: Avoid heavy dynamic Date parsing, timezone calculations,
    // and .toISOString() serialization in hot loops when workout.date is already in standard ISO format.
    const day = (typeof workout.date === "string" && workout.date.length >= 10 && workout.date[4] === "-" && workout.date[7] === "-")
      ? workout.date.slice(0, 10)
      : new Date(workout.date).toISOString().split("T")[0];
    if (!volumeByDay[day]) {
      volumeByDay[day] = 0;
    }
    volumeByDay[day] += volume;
  });

  const averageVolumePerWorkout = workouts.length ? totalVolume / workouts.length : 0;

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
  const isNewPR = currentLift.weight > (previousMaxes[currentLift.exercise] || 0);
  const improvement = currentLift.weight - (previousMaxes[currentLift.exercise] || 0);

  return {
    isNewPR,
    currentWeight: currentLift.weight,
    previousMax: previousMaxes[currentLift.exercise] || 0,
    improvement,
    improvementPercentage: ((improvement / (previousMaxes[currentLift.exercise] || currentLift.weight)) * 100).toFixed(1),
    celebration: isNewPR ? "🎉 NEW PR! 🎉" : ""
  };
};

// Calculate Relative Intensity (RI) based on RPE and weight
export const calculateRelativeIntensity = (weight, oneRepMax, reps) => {
  // Estimated effort level
  const percentageOfMax = (weight / oneRepMax) * 100;

  let rpe = 0;
  if (percentageOfMax >= 90) rpe = 9.5;
  else if (percentageOfMax >= 85) rpe = 9;
  else if (percentageOfMax >= 80) rpe = 8.5;
  else if (percentageOfMax >= 75) rpe = 8;
  else if (percentageOfMax >= 70) rpe = 7.5;
  else if (percentageOfMax >= 65) rpe = 7;
  else rpe = 6.5;

  // Adjust for reps (higher reps = slightly lower intensity feeling but similar muscle stimulus)
  if (reps > 12) rpe -= 0.5;
  if (reps > 15) rpe -= 1;

  return {
    percentageOfMax: percentageOfMax.toFixed(1),
    estimatedRPE: Math.round(rpe * 10) / 10,
    intensityLevel: percentageOfMax >= 85 ? "High" : (percentageOfMax >= 70 ? "Moderate" : "Low")
  };
};

// Analyze exercise frequency per muscle group
export const analyzeFrequencyPerMuscleGroup = (workouts) => {
  const frequency = {};

  // ⚡ PERFORMANCE OPTIMIZATION: Utilizes module-scoped EXERCISE_MUSCLE_DATABASE
  // to avoid allocating a new object on every function call.
  workouts.forEach(workout => {
    const muscleGroup = EXERCISE_MUSCLE_DATABASE[workout.exercise] || "Other";
    frequency[muscleGroup] = (frequency[muscleGroup] || 0) + 1;
  });

  return frequency;
};

// Calculate training stress/effort
export const calculateTrainingStress = (sets, reps, weight, oneRepMax, trainingAge = "intermediate") => {
  // RIR (Reps In Reserve) method
  const percentageOfMax = (weight / oneRepMax) * 100;
  let rir = 0;

  if (percentageOfMax >= 90) rir = 0;
  else if (percentageOfMax >= 85) rir = 1;
  else if (percentageOfMax >= 80) rir = 2;
  else if (percentageOfMax >= 75) rir = 3;
  else rir = reps - 6;

  const totalRepsPerformed = sets * reps;
  const volumeLoad = sets * reps * weight;

  // Stress score (0-100)
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
    formattedMin: `${Math.floor(recommendation.min / 60)}:${(recommendation.min % 60).toString().padStart(2, "0")}`,
    formattedMax: `${Math.floor(recommendation.max / 60)}:${(recommendation.max % 60).toString().padStart(2, "0")}`,
    description: recommendation.description,
    improvement: previousRestTime ? (previousRestTime < recommendation.min ? "Increase rest" : "Decrease rest") : ""
  };
};

// Form quality assessment (based on notes/tags)
export const assessFormQuality = (workoutNotes, exerciseDifficulty) => {
  let formScore = 100;
  let issues = [];

  // ⚡ PERFORMANCE OPTIMIZATION: Avoid repeatedly executing .toLowerCase() (8 times) inside the loop.
  // Converting workoutNotes to lowercase once outside the loop completely eliminates redundant allocations.
  const notesLower = workoutNotes?.toLowerCase() || "";

  RED_FLAGS.forEach(flag => {
    if (notesLower.includes(flag)) {
      formScore -= 15;
      issues.push(flag);
    }
  });

  formScore = Math.max(0, formScore);

  return {
    formScore,
    status: formScore >= 80 ? "Excellent" : (formScore >= 60 ? "Good" : "Needs Improvement"),
    issues: issues.length > 0 ? issues : ["None observed"],
    recommendation: formScore < 80 ? "Focus on form before increasing weight" : "Form looks good, can progress weight"
  };
};

// Recovery time needed after workout
export const calculateRecoveryTime = (volume, intensity, muscleGroups = 1) => {
  // Based on volume, intensity, and number of muscle groups hit
  let baseRecovery = 24; // hours

  // Volume adjustments
  if (volume > 25000) baseRecovery += 24;
  else if (volume > 15000) baseRecovery += 12;

  // Intensity adjustments
  if (intensity > 80) baseRecovery += 24;
  else if (intensity > 60) baseRecovery += 12;

  // Multiple muscle groups take longer to recover
  baseRecovery += muscleGroups * 6;

  return {
    hoursUntilRecovered: Math.min(baseRecovery, 96), // Max 96 hours
    readinessPercentage: 0, // Will be updated in real time
    recommendation: baseRecovery <= 24 ? "Can train again tomorrow" : (baseRecovery <= 48 ? "Train different muscle group tomorrow" : "Full rest day recommended")
  };
};

// Periodization phase recommendations
export const getPeriodizationPhaseRecommendations = (weekNumber, totalWeeks, goal) => {
  // Typical 4-week periodization: Accumulation → Intensification → Realization → Deload
  // ⚡ PERFORMANCE OPTIMIZATION: Utilizes module-scoped PERIODIZATION_PHASES
  // to avoid allocating dictionary and phase objects on every call.
  const phase = (weekNumber % 4) || 4;
  return PERIODIZATION_PHASES[phase];
};

// Exercise variation suggestions for muscular adaptation
export const suggestExerciseVariations = (exercise, previousVariations = []) => {
  const availableVariations = EXERCISE_VARIATIONS[exercise] || [];
  const unusedVariations = availableVariations.filter(v => !previousVariations.includes(v));

  return {
    currentExercise: exercise,
    suggestedVariations: unusedVariations.slice(0, 3),
    allVariations: availableVariations,
    rotationTip: "Rotate exercise variations every 4-6 weeks to prevent adaptation plateau"
  };
};

// Training age assessment
export const assessTrainingAge = (monthsOfTraining) => {
  let level = "Beginner";
  let characteristics = [];

  if (monthsOfTraining < 3) {
    level = "Absolute Beginner";
    characteristics = ["Learning movement patterns", "Rapid initial strength gains", "Form priority", "Can train same muscles frequently"];
  } else if (monthsOfTraining < 12) {
    level = "Beginner";
    characteristics = ["Building work capacity", "Still rapid progress", "Form improving", "2-3x per muscle group weekly"];
  } else if (monthsOfTraining < 36) {
    level = "Intermediate";
    characteristics = ["Need progressive overload", "Slower gains", "Can specialize training", "1-2x per muscle group weekly"];
  } else if (monthsOfTraining < 120) {
    level = "Advanced";
    characteristics = ["Plateau management", "Slow continuous progress", "Advanced techniques", "Specialized periodization"];
  } else {
    level = "Elite";
    characteristics = ["Maintenance focus", "Minimal progress", "Sport-specific training", "Years of expertise"];
  }

  return { level, characteristics, monthsOfTraining };
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
