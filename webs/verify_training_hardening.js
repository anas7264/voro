import assert from "node:assert";
import training from "./src/utils/training.js";

console.log("=========================================");
console.log("⚡ VERIFYING TRAINING UTILITIES HARDENING");
console.log("=========================================\n");

// 1. detectPersonalRecords with numeric strings
const prString = training.detectPersonalRecords(
  { exercise: "Bench Press", weight: "105.5" },
  { "Bench Press": "95.0" }
);
assert.strictEqual(prString.isNewPR, true, "PR should be detected when string weight > string previousMax");
assert.strictEqual(prString.currentWeight, 105.5);
assert.strictEqual(prString.previousMax, 95.0);
assert.strictEqual(prString.improvement, 10.5);
assert.strictEqual(prString.improvementPercentage, "11.1");
console.log("✅ Test 1: detectPersonalRecords correctly parsed string weights & maxes");

// 2. calculateRelativeIntensity with numeric strings
const riString = training.calculateRelativeIntensity("90", "100", "8");
assert.strictEqual(riString.percentageOfMax, "90.0");
assert.strictEqual(riString.estimatedRPE, 9.5);
assert.strictEqual(riString.intensityLevel, "High");

const riZeroString = training.calculateRelativeIntensity("0", "0", "0");
assert.strictEqual(riZeroString.percentageOfMax, "0.0");
assert.strictEqual(riZeroString.estimatedRPE, 0);
assert.strictEqual(riZeroString.intensityLevel, "Low");
console.log("✅ Test 2: calculateRelativeIntensity correctly parsed string numeric inputs");

// 3. calculateTrainingStress with numeric strings
const stressString = training.calculateTrainingStress("4", "10", "85", "100");
assert.strictEqual(stressString.percentageOfMax, "85.0");
assert.strictEqual(stressString.totalReps, 40);
assert.strictEqual(stressString.volumeLoad, 3400);
assert.strictEqual(stressString.repsInReserve, 1);
assert.strictEqual(stressString.stressScore > 0, true);
console.log("✅ Test 3: calculateTrainingStress correctly parsed string numeric inputs");

// 4. calculateRecoveryTime with numeric strings
const recString = training.calculateRecoveryTime("26000", "85", "3");
// Base: 24, vol > 25000: +24, intensity > 80: +24, muscle groups: 3 * 6 = 18 => 24 + 24 + 24 + 18 = 90
assert.strictEqual(recString.hoursUntilRecovered, 90);
assert.strictEqual(recString.recommendation, "Full rest day recommended");
console.log("✅ Test 4: calculateRecoveryTime correctly parsed string numeric inputs");

// 5. getPeriodizationPhaseRecommendations with numeric string
const phaseString = training.getPeriodizationPhaseRecommendations("2", "12", "strength");
assert.strictEqual(phaseString.name, "Intensification");
assert.strictEqual(phaseString.intensity, "75-85% 1RM");
console.log("✅ Test 5: getPeriodizationPhaseRecommendations correctly parsed string weekNumber");

// 6. assessTrainingAge with numeric string
const ageString = training.assessTrainingAge("24");
assert.strictEqual(ageString.level, "Intermediate");
assert.strictEqual(ageString.monthsOfTraining, 24);
assert.strictEqual(ageString.characteristics.length > 0, true);
console.log("✅ Test 6: assessTrainingAge correctly parsed string monthsOfTraining");

// 7. analyzeTrainingVolume with string volume property
const volumeData = [
  { exercise: "Squat", volume: "5000", date: "2025-05-15" },
  { exercise: "Bench Press", sets: "3", reps: "10", weight: "100", date: "2025-05-15" }
];
const volResult = training.analyzeTrainingVolume(volumeData);
assert.strictEqual(volResult.totalVolume, 8000, "Volume should aggregate numeric strings correctly");
assert.strictEqual(volResult.topExercises.length, 2);
console.log("✅ Test 7: analyzeTrainingVolume correctly parsed string workout volume");

console.log("\n🎉 ALL TRAINING UTILITIES HARDENING VERIFICATION TESTS PASSED!");
console.log("=========================================");
