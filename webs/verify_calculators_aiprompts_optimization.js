// Verification Script: Calculators & AI Prompts Hardening
import {
  calculateBMR,
  calculateTDEE,
  calculateProteinTarget,
  calculateWaterIntake,
  calculateWilksCoefficient,
  calculateFFMI,
  calculateMaxHeartRate,
  getHeartRateZones,
  estimateVO2Max,
  estimateCaloriesBurned,
  calculateCalorieAdjustment,
  calculateIdealWeight,
  suggestProgressiveOverload,
  calculateRecoveryScore,
  assessOvertrainingRisk,
  calculateBMI,
  getBMICategory
} from './src/utils/calculators.js';

import {
  buildMealPlanPrompt,
  buildTrainingPlanPrompt,
  buildCoachPrompt,
  buildNutritionAnalysisPrompt,
  buildBodyCompositionPrompt,
  buildInjuryPreventionPrompt,
  buildCompetitionPrepPrompt,
  buildWellnessPrompt
} from './src/utils/aiPrompts.js';

console.log("=========================================");
console.log("🧪 RUNNING CALCULATORS & AI PROMPTS HARDENING VERIFICATION");
console.log("=========================================");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ ${message}`);
    passed++;
  } else {
    console.error(`❌ FAILED: ${message}`);
    failed++;
  }
}

// Test Set 1: Biometric Calculator Non-Finite & Boundary Guards
console.log("\n🧪 Test Set 1: Biometric Calculator Boundary Guards");

assert(calculateBMR(NaN, 175, 25, "male") === "0", "BMR returns '0' on NaN weight");
assert(calculateBMR(70, -175, 25, "male") === "0", "BMR returns '0' on negative height");
assert(calculateBMR(70, 175, 0, "female") === "0", "BMR returns '0' on 0 age");

assert(calculateTDEE(NaN, "moderately_active") === 0, "TDEE returns 0 on NaN BMR");
assert(calculateTDEE(-500, "very_active") === 0, "TDEE returns 0 on negative BMR");

assert(calculateProteinTarget(NaN) === 0, "Protein target returns 0 on NaN weight");
assert(calculateProteinTarget(0) === 0, "Protein target returns 0 on 0 weight");

assert(calculateWaterIntake(NaN) === "0.0", "Water intake returns '0.0' on NaN weight");
assert(calculateWaterIntake(-80, 30) === "0.0", "Water intake returns '0.0' on negative weight");

assert(calculateWilksCoefficient(NaN, 80, "male") === "0.00", "Wilks returns '0.00' on NaN total weight");
assert(calculateWilksCoefficient(500, -80, "female") === "0.00", "Wilks returns '0.00' on negative bodyweight");

assert(calculateFFMI(NaN, 15, 180) === "0.0", "FFMI returns '0.0' on NaN weight");
assert(calculateFFMI(80, 15, -180) === "0.0", "FFMI returns '0.0' on negative height");

assert(calculateMaxHeartRate(NaN) === 0, "Max HR returns 0 on NaN age");
assert(calculateMaxHeartRate(-25) === 0, "Max HR returns 0 on negative age");

const emptyZones = getHeartRateZones(NaN);
assert(emptyZones.warmup.min === 0 && emptyZones.zone5.max === 0, "Heart rate zones gracefully returns zeroed zone object on NaN max HR");

assert(estimateVO2Max(NaN, "male", 60) === 0, "VO2 Max returns 0 on NaN age");
assert(estimateVO2Max(25, "female", NaN) === 0, "VO2 Max returns 0 on NaN resting HR");

assert(estimateCaloriesBurned(NaN, 60, "running_moderate") === 0, "Calories burned returns 0 on NaN weight");
assert(estimateCaloriesBurned(70, -30, "hiit") === 0, "Calories burned returns 0 on negative duration");

assert(calculateCalorieAdjustment(NaN, "moderate_cut") === 0, "Calorie adjustment returns 0 on NaN TDEE");
assert(calculateIdealWeight(NaN) === 0, "Ideal weight returns 0 on NaN height");

assert(suggestProgressiveOverload(NaN, NaN, NaN).length === 5, "Progressive overload fallback handles NaN parameters");
assert(calculateRecoveryScore(NaN, NaN, NaN) >= 0, "Recovery score handles NaN parameters");
assert(assessOvertrainingRisk(NaN, NaN, NaN, NaN) >= 0, "Overtraining risk handles NaN parameters");

// Test Set 2: AI Prompt Builders Null / Undefined Safety
console.log("\n🧪 Test Set 2: AI System Prompt Builders Null/Undefined Defensive Hardening");

const nullProfile = {
  age: null,
  gender: null,
  weight: null,
  dietaryRestrictions: null,
  allergies: null,
  cuisinePreferences: null,
  injuries: null,
  equipment: null,
  currentStrength: null,
  recentChallenges: null,
  achievements: null,
  recentDays: null,
  concerns: null,
  measurements: null,
  pastInjuries: null,
  currentPainAreas: null,
  previousCompetitions: null
};

assert(typeof buildMealPlanPrompt(nullProfile) === "string" && buildMealPlanPrompt(nullProfile).includes("None"), "buildMealPlanPrompt handles null profile attributes without throwing");
assert(typeof buildTrainingPlanPrompt(nullProfile) === "string" && buildTrainingPlanPrompt(nullProfile).includes("Bodyweight only"), "buildTrainingPlanPrompt handles null profile attributes without throwing");
assert(typeof buildCoachPrompt(nullProfile) === "string" && buildCoachPrompt(nullProfile).includes("Just starting"), "buildCoachPrompt handles null profile attributes without throwing");
assert(typeof buildNutritionAnalysisPrompt(nullProfile) === "string", "buildNutritionAnalysisPrompt handles null profile attributes without throwing");
assert(typeof buildBodyCompositionPrompt(nullProfile) === "string", "buildBodyCompositionPrompt handles null profile attributes without throwing");
assert(typeof buildInjuryPreventionPrompt(nullProfile) === "string", "buildInjuryPreventionPrompt handles null profile attributes without throwing");
assert(typeof buildCompetitionPrepPrompt(nullProfile) === "string", "buildCompetitionPrepPrompt handles null profile attributes without throwing");
assert(typeof buildWellnessPrompt(nullProfile) === "string", "buildWellnessPrompt handles null profile attributes without throwing");

assert(typeof buildMealPlanPrompt(null) === "string", "buildMealPlanPrompt handles null profile object");
assert(typeof buildTrainingPlanPrompt(null) === "string", "buildTrainingPlanPrompt handles null profile object");

// Test Set 3: Benchmark
console.log("\n⚡ Test Set 3: Execution Speed Benchmark (100,000 operations)");
const start = performance.now();
for (let i = 0; i < 100000; i++) {
  calculateBMR(75, 180, 28, "male");
  calculateTDEE(1800, "moderately_active");
  calculateProteinTarget(75, "muscle_gain");
  calculateWaterIntake(75, 45);
  getHeartRateZones(192);
}
const elapsed = performance.now() - start;
console.log(`⏱️ 100,000 operations executed in ${elapsed.toFixed(2)}ms`);
assert(elapsed < 200, "100,000 calculator operations executed under 200ms threshold");

console.log("\n=========================================");
if (failed === 0) {
  console.log(`🎉 ALL ${passed} VERIFICATION CHECKS PASSED SUCCESSFULLY!`);
  console.log("=========================================");
} else {
  console.error(`💥 ${failed} CHECKS FAILED!`);
  console.log("=========================================");
  process.exit(1);
}
