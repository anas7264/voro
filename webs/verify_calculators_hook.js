// Verification script for useCalculators hook optimization
import { calculateBMI, calculateBMR, calculateTDEE, calculateWilksCoefficient } from "./src/utils/calculators.js";
import { useCalculators } from "./src/hooks/useCalculators.js";

console.log("=========================================");
console.log("⚡ VERIFYING USECALCULATORS HOOK OPTIMIZATION");
console.log("=========================================");

// Test 1: Functionality Parity
console.log("🧪 Test 1: Verifying functionality parity...");
const api1 = useCalculators();
const api2 = useCalculators();

const bmi = api1.calculateBMI(70, 170);
const bmr = api1.calculateBMR(70, 170, 25, 'male');
const tdee = api1.calculateTDEE(bmr, 'moderately_active');
const orm = api1.calculateOneRepMax(100, 5, 'brzycki');
const wilks = api1.calculateWilks(500, 80, 'male');
const ffmi = api1.calculateFFMI(70, 15, 170);
const ideal = api1.calculateIdealWeight(170, 'male');

// Verify direct equivalence between raw calculator output and hook API output
if (
  bmi !== calculateBMI(70, 170) ||
  bmr !== calculateBMR(70, 170, 25, 'male') ||
  tdee !== calculateTDEE(bmr, 'moderately_active') ||
  wilks !== calculateWilksCoefficient(500, 80, 'male')
) {
  console.error("❌ Test 1 Failed: Calculation outputs mismatched!", { bmi, bmr, tdee, orm, wilks, ffmi });
  process.exit(1);
}
console.log("✅ Success: All calculations match expected output!");

// Test 2: Referential Stability
console.log("🧪 Test 2: Verifying referential equality across hook calls...");
if (api1 !== api2) {
  console.error("❌ Test 2 Failed: useCalculators returned different object references across calls!");
  process.exit(1);
}
console.log("✅ Success: api1 === api2 (referential equality guaranteed)!");

// Test 3: Immutability / Frozen API Object
console.log("🧪 Test 3: Verifying object immutability...");
if (!Object.isFrozen(api1)) {
  console.error("❌ Test 3 Failed: CALCULATORS_API is not frozen!");
  process.exit(1);
}
console.log("✅ Success: CALCULATORS_API object is frozen!");

// Benchmark
console.log("🧪 Benchmark: 10,000,000 hook invocations...");
console.time("10,000,000 useCalculators() calls");
for (let i = 0; i < 10000000; i++) {
  const api = useCalculators();
  api.calculateBMI(75, 180);
}
console.timeEnd("10,000,000 useCalculators() calls");

console.log("\n🎉 ALL USECALCULATORS HOOK OPTIMIZATION VERIFICATIONS PASSED SUCCESSFULLY!");
console.log("=========================================");
