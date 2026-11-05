import {
  formatMacros,
  formatVolume,
  formatStreak,
  formatLevel
} from './src/utils/formatters.js';

console.log("=========================================");
console.log("🧪 RUNNING REGRESSION VERIFICATION: FORMATTERS HARDENING V2");
console.log("=========================================");

// 1. formatMacros: string inputs, zero, non-finite, negative
console.log("🛡️ Test 1: Testing formatMacros with string numbers and boundary values...");
const strMacros = formatMacros("30", "40", "10");
if (strMacros.protein === "30.0g P" && strMacros.carbs === "40.0g C" && strMacros.fat === "10.0g F" && strMacros.total === "80.0g") {
  console.log("✅ Success: formatMacros avoids string concatenation with string inputs!");
} else {
  console.error("❌ Test 1 Failed: formatMacros returned:", strMacros);
  process.exit(1);
}

const invalidMacros = formatMacros(NaN, null, -15);
if (invalidMacros.protein === "0.0g P" && invalidMacros.carbs === "0.0g C" && invalidMacros.fat === "0.0g F" && invalidMacros.total === "0.0g") {
  console.log("✅ Success: formatMacros safely handles NaN, null, and negative inputs!");
} else {
  console.error("❌ Test 1b Failed: formatMacros returned:", invalidMacros);
  process.exit(1);
}

// 2. formatVolume: string inputs, non-finite, zero, negative
console.log("🛡️ Test 2: Testing formatVolume with string inputs and negative/non-finite factors...");
const strVol = formatVolume("3", "10", "60");
if (strVol === "1,800 kg") {
  console.log("✅ Success: formatVolume handles string numeric inputs correctly!");
} else {
  console.error(`❌ Test 2 Failed: formatVolume("3", "10", "60") -> "${strVol}"`);
  process.exit(1);
}

const negVol = formatVolume(-3, 10, 60);
const nanVol = formatVolume(NaN, 10, 60);
const zeroVol = formatVolume(0, 10, 60);
if (negVol === "0 kg" && nanVol === "0 kg" && zeroVol === "0 kg") {
  console.log("✅ Success: formatVolume safely clamps negative and non-finite volumes to 0 kg!");
} else {
  console.error(`❌ Test 2b Failed: negVol -> "${negVol}", nanVol -> "${nanVol}", zeroVol -> "${zeroVol}"`);
  process.exit(1);
}

// 3. formatStreak: numeric strings, null, undefined, NaN, 0, 1, and negative values
console.log("🛡️ Test 3: Testing formatStreak with edge-case days...");
if (
  formatStreak(0) === "No streak" &&
  formatStreak("0") === "No streak" &&
  formatStreak(null) === "No streak" &&
  formatStreak(undefined) === "No streak" &&
  formatStreak(NaN) === "No streak" &&
  formatStreak(-5) === "No streak" &&
  formatStreak(1) === "1 day 🔥" &&
  formatStreak("1") === "1 day 🔥" &&
  formatStreak(5) === "5 days 🔥" &&
  formatStreak("5") === "5 days 🔥"
) {
  console.log("✅ Success: formatStreak correctly formats days across boundary conditions!");
} else {
  console.error("❌ Test 3 Failed: formatStreak boundary check mismatch.");
  process.exit(1);
}

// 4. formatLevel: string inputs, NaN, null, undefined, negative values
console.log("🛡️ Test 4: Testing formatLevel with XP edge cases...");
const nanLevel = formatLevel(NaN);
const nullLevel = formatLevel(null);
const strLevel = formatLevel("1500");
const negLevel = formatLevel(-200);

if (
  nanLevel.level === 1 && nanLevel.xp === 0 && nanLevel.progress === "0.0" &&
  nullLevel.level === 1 && nullLevel.xp === 0 && nullLevel.progress === "0.0" &&
  negLevel.level === 1 && negLevel.xp === 0 && negLevel.progress === "0.0" &&
  strLevel.level === 2 && strLevel.xp === 1500 && strLevel.currentXP === 500 && strLevel.nextLevelXP === 2000 && strLevel.progress === "50.0"
) {
  console.log("✅ Success: formatLevel safely guards against NaN/null/negative XP and handles strings!");
} else {
  console.error("❌ Test 4 Failed: formatLevel edge case mismatch:", { nanLevel, nullLevel, strLevel, negLevel });
  process.exit(1);
}

console.log("\n🎉 ALL FORMATTER HARDENING V2 VERIFICATION TESTS PASSED SUCCESSFULLY!");
console.log("=========================================");
