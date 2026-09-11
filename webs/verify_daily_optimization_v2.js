import fs from 'fs';
import path from 'path';

console.log("=========================================");
console.log("⚡ VERIFYING DAILY PERFORMANCE OPTIMIZATION V2");
console.log("=========================================");

const fastingTrackerPath = path.resolve('webs/src/pages/FastingTracker.jsx');
const bodyMetricsPath = path.resolve('webs/src/pages/BodyMetrics.jsx');
const educationHubPath = path.resolve('webs/src/pages/EducationHub.jsx');
const workoutLogPath = path.resolve('webs/src/pages/WorkoutLog.jsx');

// 🧪 Test 1: FastingTracker selector and static fallback
console.log("🧪 Test 1: Verifying FastingTracker selectFastingData & DEFAULT_FASTING_DATA...");
const fastingTrackerContent = fs.readFileSync(fastingTrackerPath, 'utf8');

if (!fastingTrackerContent.includes('const DEFAULT_FASTING_DATA = Object.freeze(')) {
  console.error("❌ Error: DEFAULT_FASTING_DATA is not frozen!");
  process.exit(1);
}

if (!fastingTrackerContent.includes('const selectFastingData =')) {
  console.error("❌ Error: selectFastingData is not defined at module scope!");
  process.exit(1);
}

if (!fastingTrackerContent.includes("useStorageKeySelector('fasting', selectFastingData)")) {
  console.error("❌ Error: FastingTracker is not using module-scoped selectFastingData!");
  process.exit(1);
}
console.log("✅ Success: FastingTracker surgical selector and static fallback verified!");

// 🧪 Test 2: BodyMetrics module-scoped selectors and frozen EMPTY_ARRAY fallback
console.log("\n🧪 Test 2: Verifying BodyMetrics module-scoped selectors & EMPTY_ARRAY fallback...");
const bodyMetricsContent = fs.readFileSync(bodyMetricsPath, 'utf8');

if (!bodyMetricsContent.includes('const selectWeights =')) {
  console.error("❌ Error: selectWeights is not defined at module scope!");
  process.exit(1);
}

if (!bodyMetricsContent.includes('const selectBodyFatRecords =')) {
  console.error("❌ Error: selectBodyFatRecords is not defined at module scope!");
  process.exit(1);
}

if (!bodyMetricsContent.includes('const selectMeasurementsRecord =')) {
  console.error("❌ Error: selectMeasurementsRecord is not defined at module scope!");
  process.exit(1);
}

if (!bodyMetricsContent.includes("useStorageKeySelector('body_metrics', selectWeights)")) {
  console.error("❌ Error: BodyMetrics does not use selectWeights!");
  process.exit(1);
}
console.log("✅ Success: BodyMetrics module-scoped selectors verified!");

// 🧪 Test 3: EducationHub pre-computed author initials
console.log("\n🧪 Test 3: Verifying EducationHub pre-computed _initials...");
const educationHubContent = fs.readFileSync(educationHubPath, 'utf8');

if (!educationHubContent.includes('_initials:')) {
  console.error("❌ Error: EducationHub does not pre-compute _initials on PRE_PROCESSED_ARTICLES!");
  process.exit(1);
}

if (!educationHubContent.includes('article._initials')) {
  console.error("❌ Error: EducationHub DossierHero does not render article._initials!");
  process.exit(1);
}
console.log("✅ Success: EducationHub pre-computed author initials verified!");

// 🧪 Test 4: WorkoutLog INITIAL_15_EXERCISES frozen slice
console.log("\n🧪 Test 4: Verifying WorkoutLog INITIAL_15_EXERCISES static slice...");
const workoutLogContent = fs.readFileSync(workoutLogPath, 'utf8');

if (!workoutLogContent.includes('const INITIAL_15_EXERCISES = Object.freeze(')) {
  console.error("❌ Error: INITIAL_15_EXERCISES is not frozen!");
  process.exit(1);
}

if (!workoutLogContent.includes('if (!query) return INITIAL_15_EXERCISES;')) {
  console.error("❌ Error: ExerciseSearchModal does not return INITIAL_15_EXERCISES on empty search!");
  process.exit(1);
}
console.log("✅ Success: WorkoutLog INITIAL_15_EXERCISES static slice verified!");

// ⏱️ Test 5: Benchmark selector performance over 100,000 evaluations
console.log("\n🧪 Test 5: Running Selector & Fallback Benchmark (100,000 iterations)...");

const DEFAULT_FASTING_DATA = Object.freeze({ window: '16:8', started: null, status: 'idle' });
const selectFastingData = (data) => data || DEFAULT_FASTING_DATA;
const EMPTY_ARRAY = Object.freeze([]);
const selectWeights = (metrics) => metrics?.weights || EMPTY_ARRAY;

const startTime = performance.now();
for (let i = 0; i < 100000; i++) {
  const f = selectFastingData(null);
  const w = selectWeights(undefined);
}
const endTime = performance.now();

console.log(`⏱️ 100,000 selector evaluations took: ${(endTime - startTime).toFixed(3)}ms`);
console.log("=========================================");
console.log("🎉 ALL DAILY OPTIMIZATION V2 CHECKS PASSED!");
console.log("=========================================");
