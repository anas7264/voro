import {
  formatHeight,
  formatDate,
  formatPhoneNumber
} from './src/utils/formatters.js';

import {
  analyzeMacros,
  detectNutrientDeficits,
  calculateNutritionScore
} from './src/utils/nutrition.js';

import {
  calculateBMI,
  convertPace,
  calculateMacroRatios
} from './src/utils/calculators.js';

console.log("=========================================");
console.log("🧪 RUNNING FORMATTERS & NUTRITION PERF VERIFICATION");
console.log("=========================================");

// 1. Formatters: Imperial height 12-inch rollover check
const h182_2 = formatHeight(182.2, "cm", "feet"); // 182.2cm -> should be 6'0" (not 5'12")
if (h182_2 === "6'0\"") {
  console.log("🟢 Test 1 Passed: formatHeight(182.2, 'cm', 'feet') = \"6'0\"\" (rollover handled correctly)");
} else {
  console.error(`❌ Test 1 Failed: Expected "6'0\"", got "${h182_2}"`);
  process.exit(1);
}

// 2. Formatters: Null-safe phone number formatting
const phoneNull = formatPhoneNumber(null);
const phoneNum = formatPhoneNumber(1234567890);
if (phoneNull === "" && phoneNum === "1234567890") {
  console.log("🟢 Test 2 Passed: formatPhoneNumber handles null and numeric inputs gracefully");
} else {
  console.error(`❌ Test 2 Failed: Got null->"${phoneNull}", num->"${phoneNum}"`);
  process.exit(1);
}

// 3. Nutrition: Zero target macro safe division
const macroAnalysis = analyzeMacros(50, 100, 30, 0, 0, 0);
if (macroAnalysis.protein.percentOfTarget === "0.0" && macroAnalysis.carbs.percentOfTarget === "0.0") {
  console.log("🟢 Test 3 Passed: analyzeMacros handles 0 target values without returning NaN");
} else {
  console.error(`❌ Test 3 Failed: Got protein percent "${macroAnalysis.protein.percentOfTarget}"`);
  process.exit(1);
}

// 4. Nutrition: Null/undefined nutrient deficit detection
const deficits = detectNutrientDeficits(null, { iron: 18, zinc: 11 });
if (deficits.iron && deficits.iron.percentage === "0.0") {
  console.log("🟢 Test 4 Passed: detectNutrientDeficits handles null dailyIntake and calculates deficits");
} else {
  console.error(`❌ Test 4 Failed: Got deficits:`, deficits);
  process.exit(1);
}

// 5. Nutrition: Score with zero/negative calories
const score0 = calculateNutritionScore(0, 0, 0, 0);
if (score0 === 0) {
  console.log("🟢 Test 5 Passed: calculateNutritionScore handles 0 calories safely");
} else {
  console.error(`❌ Test 5 Failed: Got score "${score0}"`);
  process.exit(1);
}

// 6. Calculators: BMI zero height guard
const bmi0 = calculateBMI(70, 0);
if (bmi0 === "0.0") {
  console.log("🟢 Test 6 Passed: calculateBMI handles 0 height without returning Infinity");
} else {
  console.error(`❌ Test 6 Failed: Got BMI "${bmi0}"`);
  process.exit(1);
}

// 7. Calculators: Pace converter edge cases
const pace1 = convertPace("invalid", "pace_to_kmh");
const pace2 = convertPace(0, "kmh_to_pace");
if (pace1 === "0.00" && pace2 === "0:00") {
  console.log("🟢 Test 7 Passed: convertPace handles invalid/zero inputs safely");
} else {
  console.error(`❌ Test 7 Failed: Got pace1="${pace1}", pace2="${pace2}"`);
  process.exit(1);
}

// 8. Calculators: Macro ratios 0 calories
const ratios = calculateMacroRatios(0, 150, 200, 60);
if (ratios.protein.percentage === "0.0") {
  console.log("🟢 Test 8 Passed: calculateMacroRatios handles 0 calories safely");
} else {
  console.error(`❌ Test 8 Failed: Got ratios:`, ratios);
  process.exit(1);
}

// Performance benchmark
console.log("\n⚡ Running performance benchmarks (100,000 iterations)...");
const start = performance.now();
for (let i = 0; i < 100000; i++) {
  formatHeight(182.2, "cm", "feet");
  analyzeMacros(150, 200, 60, 160, 220, 65);
  calculateNutritionScore(150, 200, 60, 2000);
  calculateBMI(75, 180);
}
const elapsed = performance.now() - start;
console.log(`⏱️ 100,000 operations completed in ${elapsed.toFixed(2)}ms`);

console.log("\n🎉 ALL FORMATTERS & NUTRITION PERF VERIFICATION TESTS PASSED!");
console.log("=========================================");
