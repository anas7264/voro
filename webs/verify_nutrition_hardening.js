import {
  calculateNutritionScore,
  analyzeMacros,
  getMacroWarnings,
  calculateGlycemicLoad,
  calculateTEF,
  getIdealMealMacros,
  calculateDailyWaterNeeds,
  detectNutrientDeficits
} from './src/utils/nutrition.js';

console.log("=========================================");
console.log("🧪 VERIFYING NUTRITION STRING PARSING HARDENING");
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

// 1. calculateNutritionScore with numeric strings
const scoreNum = calculateNutritionScore(30, 50, 20, 2000);
const scoreStr = calculateNutritionScore("30", "50", "20", "2000");
assert(scoreNum > 0, "calculateNutritionScore works with numbers");
assert(scoreStr === scoreNum, `calculateNutritionScore parses numeric strings correctly (${scoreStr} === ${scoreNum})`);

// 2. analyzeMacros with numeric strings
const macroNum = analyzeMacros(150, 200, 60, 150, 200, 60);
const macroStr = analyzeMacros("150", "200", "60", "150", "200", "60");
assert(macroStr.protein.status === "On Target", "analyzeMacros parses consumed/target strings");
assert(macroStr.protein.consumed === 150, "analyzeMacros parses consumed to number");
assert(macroStr.protein.target === 150, "analyzeMacros parses target to number");

// 3. getMacroWarnings with numeric strings
const warnNum = getMacroWarnings(10, 50, 20, 2000);
const warnStr = getMacroWarnings("10", "50", "20", "2000");
assert(warnStr.length > 0 && warnStr[0] === warnNum[0], "getMacroWarnings parses numeric strings");

// 4. calculateGlycemicLoad with numeric string properties
const glNum = calculateGlycemicLoad([{ carbs: 50, glycemicIndex: 60 }]);
const glStr = calculateGlycemicLoad([{ carbs: "50", glycemicIndex: "60" }]);
assert(glStr.glycemicLoad === glNum.glycemicLoad, "calculateGlycemicLoad parses carbs and glycemicIndex strings");

// 5. calculateTEF with numeric strings
const tefNum = calculateTEF(30, 50, 20);
const tefStr = calculateTEF("30", "50", "20");
assert(tefStr === tefNum, "calculateTEF parses numeric strings");

// 6. getIdealMealMacros with numeric string totalDailyCalories
const idealNum = getIdealMealMacros("pre_workout", "muscle_gain", 2400);
const idealStr = getIdealMealMacros("pre_workout", "muscle_gain", "2400");
assert(idealStr.calories === idealNum.calories, "getIdealMealMacros parses totalDailyCalories string");

// 7. calculateDailyWaterNeeds with numeric string weightKg
const waterNum = calculateDailyWaterNeeds(80, "moderate");
const waterStr = calculateDailyWaterNeeds("80", "moderate");
assert(waterStr.litersPerDay === waterNum.litersPerDay, "calculateDailyWaterNeeds parses weightKg string");

// 8. detectNutrientDeficits with numeric strings
const defs = detectNutrientDeficits({ iron: "10" }, { iron: "20" });
assert(defs.iron && defs.iron.intake === 10 && defs.iron.target === 20, "detectNutrientDeficits parses string targets and intakes");

console.log("=========================================");
if (fails === 0) {
  console.log(`🎉 ALL ${passes} TESTS PASSED!`);
} else {
  console.error(`❌ FAILED: ${fails} test(s) failed`);
  process.exit(1);
}
