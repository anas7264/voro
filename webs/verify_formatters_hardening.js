import {
  formatNumber,
  formatTime,
  formatPace,
  formatDurationText,
  formatPhoneNumber
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

// 3. formatPace: 0, negative numbers, NaN, Infinity
console.log("🛡️ Test 3: Testing formatPace with zero, negative, and non-finite values...");
if (formatPace(0) === "0:00/km" && formatPace(-5) === "0:00/km" && formatPace(NaN) === "0:00/km" && formatPace(Infinity) === "0:00/km") {
  console.log("✅ Success: formatPace handles zero, negative, and non-finite values safely!");
} else {
  console.error(`❌ Test 3 Failed: 0 -> "${formatPace(0)}", -5 -> "${formatPace(-5)}"`);
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

console.log("\n🎉 ALL FORMATTER SECURITY HARDENING VERIFICATION TESTS PASSED SUCCESSFULLY!");
console.log("=========================================");
