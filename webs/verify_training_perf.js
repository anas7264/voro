import { analyzeTrainingVolume, analyzeFrequencyPerMuscleGroup, assessFormQuality } from "./src/utils/training.js";

console.log("=========================================");
console.log("⚡ VERIFYING TRAINING UTILITIES PERFORMANCE");
console.log("=========================================\n");

// Generate mock workouts dataset
const sampleWorkouts = [];
const exercises = ["Bench Press", "Squat", "Deadlift", "Pull-ups", "Incline Bench", "Leg Press"];
const now = new Date();

for (let i = 0; i < 1000; i++) {
  const d = new Date(now.getTime() - i * 3600 * 1000 * 4);
  const isoString = d.toISOString();
  sampleWorkouts.push({
    date: i % 2 === 0 ? isoString.slice(0, 10) : d,
    exercise: exercises[i % exercises.length],
    sets: 4,
    reps: 10,
    weight: 100 + (i % 50)
  });
}

// Benchmark 1: analyzeTrainingVolume
const startVolume = performance.now();
let volumeResult;
const ITERATIONS = 100;
for (let i = 0; i < ITERATIONS; i++) {
  volumeResult = analyzeTrainingVolume(sampleWorkouts);
}
const elapsedVolume = performance.now() - startVolume;

console.log(`✅ Test 1: analyzeTrainingVolume execution time for ${ITERATIONS} runs across 1,000 workouts: ${elapsedVolume.toFixed(2)}ms`);
if (volumeResult && volumeResult.totalVolume > 0 && volumeResult.topExercises.length > 0) {
  console.log("   - Total Volume calculated:", volumeResult.totalVolume);
  console.log("   - Top Exercises count:", volumeResult.topExercises.length);
  console.log("   - Volume by Day entries:", Object.keys(volumeResult.byDay).length);
} else {
  console.error("❌ Test 1 failed: Invalid volume result structure");
  process.exit(1);
}

// Benchmark 2: analyzeFrequencyPerMuscleGroup
const startFreq = performance.now();
let freqResult;
for (let i = 0; i < ITERATIONS; i++) {
  freqResult = analyzeFrequencyPerMuscleGroup(sampleWorkouts);
}
const elapsedFreq = performance.now() - startFreq;

console.log(`\n✅ Test 2: analyzeFrequencyPerMuscleGroup execution time for ${ITERATIONS} runs: ${elapsedFreq.toFixed(2)}ms`);
if (freqResult && (freqResult.Chest || freqResult.Legs)) {
  console.log("   - Muscle Frequency result:", freqResult);
} else {
  console.error("❌ Test 2 failed: Invalid frequency result");
  process.exit(1);
}

// Test 3: assessFormQuality
const formAssessment = assessFormQuality("Execution was smooth but noticed slight knee cave on set 3.", "Moderate");
console.log("\n✅ Test 3: assessFormQuality result:", formAssessment);
if (formAssessment.issues.includes("knee cave") && formAssessment.formScore === 85) {
  console.log("   - Form quality correctly flagged red flag issue 'knee cave'");
} else {
  console.error("❌ Test 3 failed: Incorrect form score or issue detection");
  process.exit(1);
}

console.log("\n🎉 ALL TRAINING UTILITIES VERIFICATION TESTS PASSED!");
console.log("=========================================");
