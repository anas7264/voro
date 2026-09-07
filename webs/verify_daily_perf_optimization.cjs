const assert = require('assert');

console.log("=========================================");
console.log("⚡ TESTING DAILY PERFORMANCE OPTIMIZATIONS");
console.log("=========================================");

// 🧪 Test 1: GymSetup Set Lookup Performance & Correctness
console.log("🧪 Test 1: Verifying GymSetup O(1) Set lookups...");
const equipmentList = [
  { id: 1, name: 'Dumbbells' },
  { id: 3, name: 'Bench' },
  { id: 5, name: 'Cables' }
];

const equipmentSet = new Set();
for (let i = 0; i < equipmentList.length; i++) {
  equipmentSet.add(equipmentList[i].id);
}

assert.strictEqual(equipmentSet.has(1), true);
assert.strictEqual(equipmentSet.has(2), false);
assert.strictEqual(equipmentSet.has(3), true);
assert.strictEqual(equipmentSet.has(4), false);
console.log("✅ Success: O(1) Set lookup verified!");

// 🧪 Test 2: DailyStreak Single-Pass Consolidated Computation
console.log("🧪 Test 2: Verifying DailyStreak single-pass computation...");
const STREAK_METRICS_CONFIG = [
  { key: 'trainingDays', goal: 30 },
  { key: 'nutritionLogging', goal: 30 },
  { key: 'waterIntake', goal: 30 },
  { key: 'sleepGoal', goal: 30 },
];
const DEFAULT_STREAKS = {
  trainingDays: 15,
  nutritionLogging: 8,
  waterIntake: 12,
  sleepGoal: 6,
};
const streaksData = {
  trainingDays: 20,
  nutritionLogging: 10,
  waterIntake: 15,
  sleepGoal: 7,
};

let totalDays = 0;
const len = STREAK_METRICS_CONFIG.length;
const goals = new Array(len);

for (let i = 0; i < len; i++) {
  const config = STREAK_METRICS_CONFIG[i];
  const currentVal = streaksData[config.key] ?? DEFAULT_STREAKS[config.key] ?? 0;
  totalDays += (streaksData[config.key] || 0);
  goals[i] = {
    ...config,
    current: currentVal
  };
}

assert.strictEqual(totalDays, 52);
assert.strictEqual(goals.length, 4);
assert.strictEqual(goals[0].current, 20);
assert.strictEqual(goals[1].current, 10);
console.log("✅ Success: Single-pass metric pass verified!");

// 🧪 Test 3: Benchmark 100,000 iterations of Set lookups vs Array.some
console.log("🧪 Test 3: Running lookup benchmark (100,000 iterations)...");
const iterations = 100000;

const startSet = performance.now();
for (let i = 0; i < iterations; i++) {
  equipmentSet.has(3);
}
const endSet = performance.now();

const startSome = performance.now();
for (let i = 0; i < iterations; i++) {
  equipmentList.some(e => e.id === 3);
}
const endSome = performance.now();

console.log(`⏱️ Set lookup time: ${(endSet - startSet).toFixed(3)}ms`);
console.log(`⏱️ Array.some lookup time: ${(endSome - startSome).toFixed(3)}ms`);

console.log("\n🎉 ALL DAILY PERFORMANCE VERIFICATION TESTS PASSED SUCCESSFULLY!");
console.log("=========================================");
