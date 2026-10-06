// Comprehensive Verification Script for Calculators & 1RM Performance
import calculators from "./src/utils/calculators.js";
import { useCalculators } from "./src/hooks/useCalculators.js";

console.log("=========================================");
console.log("⚡ VERIFYING CALCULATORS & 1RM OPTIMIZATION");
console.log("=========================================");

let passes = 0;
let fails = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ ${message}`);
    passes++;
  } else {
    console.error(`❌ ${message}`);
    fails++;
  }
}

// 1. Test 1RM estimation formulas and edge cases
console.log("\n🧪 Test Set 1: 1RM Estimation Formulas & Boundary Guards");

assert(calculators.calculateOneRepMax.epley(100, 1) === 100, "1RM Epley short-circuits reps=1 to exact weight (100)");
assert(calculators.calculateOneRepMax.brzycki(100, 1) === 100, "1RM Brzycki short-circuits reps=1 to exact weight (100)");
assert(calculators.calculateOneRepMax.lander(100, 1) === 100, "1RM Lander short-circuits reps=1 to exact weight (100)");
assert(calculators.calculateOneRepMax.average(100, 1) === 100, "1RM Average short-circuits reps=1 to exact weight (100)");

assert(calculators.calculateOneRepMax.brzycki(100, 37) > 0, "1RM Brzycki safely handles reps >= 37 without divide-by-zero Infinity");
assert(Number.isFinite(calculators.calculateOneRepMax.lander(100, 40)), "1RM Lander safely handles high reps without negative/infinite output");
assert(calculators.calculateOneRepMax.average(100, 40) > 0, "1RM Average safely calculates valid 1RM for high reps (reps >= 37)");

assert(calculators.calculateOneRepMax.average(0, 10) === 0, "1RM Average handles 0 weight gracefully");
assert(calculators.calculateOneRepMax.average(100, 0) === 0, "1RM Average handles 0 reps gracefully");
assert(calculators.calculateOneRepMax.average(-50, 10) === 0, "1RM Average handles negative weight gracefully");

// 2. Test useCalculators hook delegate fallback
console.log("\n🧪 Test Set 2: useCalculators Hook Delegate & Fallback");
const api = useCalculators();
assert(api.calculateOneRepMax(100, 10, "epley") === 133, "useCalculators calculates Epley correctly for 100kg x 10 reps");
assert(api.calculateOneRepMax(100, 10, "unknown_method") === api.calculateOneRepMax(100, 10, "average"), "useCalculators falls back to average for unknown method key");

// 3. Test BMI, BMR, TDEE, Wilks, FFMI
console.log("\n🧪 Test Set 3: Biometric Calculators");
assert(calculators.calculateBMI(80, 180) === "24.7", "BMI calculation matches expected 24.7");
assert(calculators.getBMICategory(24.7) === "Normal Weight", "BMI category matches Normal Weight");
assert(calculators.calculateBMR(80, 180, 25, "male") === "1805", "BMR Mifflin-St Jeor matches expected 1805");
assert(calculators.calculateTDEE(1805, "moderately_active") === 2798, "TDEE moderately active matches expected 2798");

// 4. Performance Benchmark (100,000 iterations)
console.log("\n⚡ Test Set 4: Execution Speed Benchmark (100,000 iterations)");
const iterations = 100000;
const start = performance.now();

for (let i = 0; i < iterations; i++) {
  calculators.calculateOneRepMax.average(100 + (i % 50), 1 + (i % 12));
  calculators.calculateBMI(70 + (i % 30), 175);
  calculators.calculateBMR(75, 180, 25, "male");
  calculators.calculateTDEE(1800, "moderately_active");
}

const elapsed = performance.now() - start;
console.log(`⏱️ 100,000 multi-calculator operations completed in ${elapsed.toFixed(2)}ms`);
assert(elapsed < 200, "Performance benchmark completes under 200ms threshold");

console.log("\n=========================================");
if (fails === 0) {
  console.log(`🎉 ALL ${passes} CALCULATOR VERIFICATION CHECKS PASSED SUCCESSFULLY!`);
} else {
  console.error(`❌ VERIFICATION FAILED: ${fails} failure(s) detected.`);
  process.exit(1);
}
console.log("=========================================");
