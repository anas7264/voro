import {
  formatNumber,
  formatTime,
  formatPace,
  formatDurationText,
  formatPhoneNumber,
  formatHeight,
  formatBMI,
  formatTemperature,
  formatBloodPressure,
  formatBodyFat
} from './src/utils/formatters.js';

console.log("=========================================");
console.log("🧪 RUNNING SECURITY VERIFICATION: FORMATTERS HARDENING");
console.log("=========================================");

// 1. formatNumber: NaN, Infinity, -Infinity, null, undefined
console.log("🛡️ Test 1: Testing formatNumber with non-finite numeric values...");
if (formatNumber(NaN) === "0" && formatNumber(Infinity) === "0" && formatNumber(-Infinity) === "0") {
  console.log("✅ Success: formatNumber handles non-finite values safely!");
} else {
  console.error(`❌ Test 1 Failed: NaN -> "${formatNumber(NaN)}", Infinity -> "${formatNumber(Infinity)}"`);
  process.exit(1);
}

// 2. formatTime: NaN, Infinity, negative numbers, 0
console.log("🛡️ Test 2: Testing formatTime with negative and non-finite values...");
if (formatTime(NaN) === "0:00" && formatTime(Infinity) === "0:00" && formatTime(-100) === "0:00" && formatTime(0) === "0:00") {
  console.log("✅ Success: formatTime handles negative and non-finite values safely!");
} else {
  console.error(`❌ Test 2 Failed: NaN -> "${formatTime(NaN)}", -100 -> "${formatTime(-100)}"`);
  process.exit(1);
}

// 3. formatPace: 0, negative numbers, NaN, Infinity, valid paces, and boundary rollover
console.log("🛡️ Test 3: Testing formatPace with zero, negative, and non-finite values...");
if (formatPace(0) === "0:00/km" && formatPace(-5) === "0:00/km" && formatPace(NaN) === "0:00/km" && formatPace(Infinity) === "0:00/km") {
  console.log("✅ Success: formatPace handles zero, negative, and non-finite values safely!");
} else {
  console.error(`❌ Test 3 Failed: 0 -> "${formatPace(0)}", -5 -> "${formatPace(-5)}"`);
  process.exit(1);
}

console.log("🛡️ Test 3b: Testing formatPace with valid speeds and 60-second boundary conditions...");
const pace10kmh = formatPace(2.77778); // ~10 km/h -> 6:00/km
const pace12kmh = formatPace(3.33333); // ~12 km/h -> 5:00/km
const paceBoundary = formatPace(1000 / 359.6); // 359.6 seconds per km -> must roll over to 6:00/km, never 5:60/km

if (pace10kmh === "6:00/km" && pace12kmh === "5:00/km" && paceBoundary === "6:00/km") {
  console.log("✅ Success: formatPace accurately computes pace and handles boundary rollover cleanly!");
} else {
  console.error(`❌ Test 3b Failed: 10km/h -> "${pace10kmh}", 12km/h -> "${pace12kmh}", boundary -> "${paceBoundary}"`);
  process.exit(1);
}

// 4. formatDurationText: negative numbers, NaN, 0
console.log("🛡️ Test 4: Testing formatDurationText with negative and non-finite values...");
if (formatDurationText(0) === "0 minutes" && formatDurationText(-100) === "0 minutes" && formatDurationText(NaN) === "0 minutes") {
  console.log("✅ Success: formatDurationText handles non-positive and non-finite values safely!");
} else {
  console.error(`❌ Test 4 Failed: -100 -> "${formatDurationText(-100)}", NaN -> "${formatDurationText(NaN)}"`);
  process.exit(1);
}

// 5. formatPhoneNumber: oversized inputs and HTML script tag injection
console.log("🛡️ Test 5: Testing formatPhoneNumber with oversized inputs and script injection...");
const longInput = "<script>alert(1)</script>" + "A".repeat(100);
const formattedLong = formatPhoneNumber(longInput);
const scriptInput = "<script>alert('xss')</script>";
const formattedScript = formatPhoneNumber(scriptInput);

if (!formattedLong.includes("<script>") && formattedLong.length <= 50 && !formattedScript.includes("<script>")) {
  console.log("✅ Success: formatPhoneNumber handles length bounds and sanitizes input!");
} else {
  console.error(`❌ Test 5 Failed: formattedLong -> "${formattedLong}", formattedScript -> "${formattedScript}"`);
  process.exit(1);
}

// 6. formatHeight: NaN, undefined, 0, negative, feet conversion rollover
console.log("🛡️ Test 6: Testing formatHeight with non-finite and edge values...");
if (
  formatHeight(NaN, "cm", "feet") === "0'0\"" &&
  formatHeight(undefined, "cm", "feet") === "0'0\"" &&
  formatHeight(0, "cm", "feet") === "0'0\"" &&
  formatHeight(-50, "cm", "feet") === "0'0\"" &&
  formatHeight(NaN, "cm", "inches") === "0.0" &&
  formatHeight(180, "cm", "feet") === "5'11\""
) {
  console.log("✅ Success: formatHeight handles non-finite and boundary conversions cleanly!");
} else {
  console.error(`❌ Test 6 Failed: formatHeight boundary conversion failed.`);
  process.exit(1);
}

// 7. formatBMI: NaN, null, undefined, 0, negative values, and normal classifications
console.log("🛡️ Test 7: Testing formatBMI with non-finite, non-positive, and valid categories...");
if (
  formatBMI(NaN) === "0.0 (Unknown)" &&
  formatBMI(null) === "0.0 (Unknown)" &&
  formatBMI(undefined) === "0.0 (Unknown)" &&
  formatBMI(0) === "0.0 (Unknown)" &&
  formatBMI(-10) === "0.0 (Unknown)" &&
  formatBMI(17.5) === "17.5 (Underweight)" &&
  formatBMI(22.5) === "22.5 (Normal)" &&
  formatBMI(27.5) === "27.5 (Overweight)" &&
  formatBMI(32.5) === "32.5 (Obese)"
) {
  console.log("✅ Success: formatBMI handles non-finite inputs without false-positive obese classifications!");
} else {
  console.error(`❌ Test 7 Failed: formatBMI returned unexpected output.`);
  process.exit(1);
}

// 8. formatTemperature, formatBloodPressure, formatBodyFat
console.log("🛡️ Test 8: Testing formatTemperature, formatBloodPressure, and formatBodyFat...");
if (
  formatTemperature(null, "F") === "0.0°F" &&
  formatTemperature(NaN, "F") === "0.0°F" &&
  formatTemperature(25, "C") === "25.0°C" &&
  formatTemperature(25, "F") === "77.0°F" &&
  formatBloodPressure(NaN, null) === "0/0 mmHg" &&
  formatBloodPressure(120, 80) === "120/80 mmHg" &&
  formatBodyFat(NaN) === "0.0% BF" &&
  formatBodyFat(15.5) === "15.5% BF"
) {
  console.log("✅ Success: formatTemperature, blood pressure, and body fat format correctly on edge inputs!");
} else {
  console.error(`❌ Test 8 Failed: formatTemperature, blood pressure, or body fat returned unexpected output.`);
  process.exit(1);
}

console.log("\n🎉 ALL FORMATTER SECURITY HARDENING VERIFICATION TESTS PASSED SUCCESSFULLY!");
console.log("=========================================");
