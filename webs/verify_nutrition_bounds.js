// Verification test script for validateNutritionEntry macro numeric bounds validation
import { validateNutritionEntry } from './src/utils/validators.js';

console.log("=========================================");
console.log("🧪 RUNNING SECURITY VERIFICATION: NUTRITION MACRO BOUNDS");
console.log("=========================================");

const validSample = {
  food: "Oatmeal",
  calories: 2500,
  protein: 30,
  carbs: 60,
  fat: 10,
  mealType: "breakfast",
  date: "2025-05-15"
};

// Test 1: Valid entry passes
const res1 = validateNutritionEntry(validSample);
if (!res1.valid) {
  console.error("❌ Test 1 Failed: Valid sample rejected:", res1.errors);
  process.exit(1);
}
console.log("🟢 Test 1: Valid sample entry passed.");

// Test 2: Unbounded / Extreme positive values (e.g. 1000g protein, Infinity)
const res2 = validateNutritionEntry({ ...validSample, protein: 1000, carbs: Infinity });
if (res2.valid || !res2.errors.protein || !res2.errors.carbs) {
  console.error("❌ Test 2 Failed: Out of bounds macro or Infinity accepted:", res2);
  process.exit(1);
}
console.log("🛡️ Test 2: Out-of-bounds macro values (>500g) and Infinity correctly rejected.");

// Test 3: Non-numeric, NaN, and negative values
const res3 = validateNutritionEntry({ ...validSample, protein: -10, carbs: NaN, fat: "invalid" });
if (res3.valid || !res3.errors.protein || !res3.errors.carbs || !res3.errors.fat) {
  console.error("❌ Test 3 Failed: Negative, NaN, or non-numeric macro accepted:", res3);
  process.exit(1);
}
console.log("🛡️ Test 3: Negative, NaN, and non-numeric macro values correctly rejected.");

// Test 4: Edge cases (0g and 500g macros)
const res4 = validateNutritionEntry({ ...validSample, protein: 0, carbs: 500, fat: 0.5 });
if (!res4.valid) {
  console.error("❌ Test 4 Failed: Boundary valid macro values (0, 500, 0.5) rejected:", res4.errors);
  process.exit(1);
}
console.log("🟢 Test 4: Boundary valid macro values (0, 500, 0.5) correctly accepted.");

console.log("\n🎉 ALL NUTRITION MACRO BOUNDS VERIFICATION TESTS PASSED!");
console.log("=========================================");
