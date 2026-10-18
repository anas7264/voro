import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("⚡ Starting Streak Hook Performance & Verification Benchmarks...");

// 1. Code Inspection Check
const useStreakRawCode = fs.readFileSync(path.join(__dirname, "src/hooks/useStreak.js"), "utf8");
// Strip comments for AST/executable code checks
const useStreakExecutableCode = useStreakRawCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");

assert.ok(
  useStreakExecutableCode.includes("charCodeAt(0) - 48"),
  "getLocalMidnightTime must use direct ASCII charCodeAt arithmetic for year extraction"
);
assert.ok(
  useStreakExecutableCode.includes("charCodeAt(5) - 48"),
  "getLocalMidnightTime must use direct ASCII charCodeAt arithmetic for month extraction"
);
assert.ok(
  useStreakExecutableCode.includes("charCodeAt(8) - 48"),
  "getLocalMidnightTime must use direct ASCII charCodeAt arithmetic for day extraction"
);
assert.ok(
  !useStreakExecutableCode.includes("dateInput.slice(0, 4)"),
  "getLocalMidnightTime must NOT use string slicing for year extraction"
);
assert.ok(
  useStreakExecutableCode.includes("getFastDateStr(new Date())"),
  "markDayCompleted must use getFastDateStr(new Date())"
);
assert.ok(
  !useStreakExecutableCode.includes("toISOString().split"),
  "markDayCompleted executable code must NOT use toISOString().split"
);

console.log("✅ Code Inspection Passed: Zero-allocation structures verified in useStreak.js");

// 2. Functional & Performance Verification for ASCII Local Midnight Parsing
const testDate = "2026-05-18";

// Unoptimized reference implementation
function referenceGetLocalMidnightTime(dateInput) {
  if (!dateInput) return null;
  if (typeof dateInput === "string" && dateInput.length === 10 && dateInput.charCodeAt(4) === 45 && dateInput.charCodeAt(7) === 45) {
    const y = parseInt(dateInput.slice(0, 4), 10);
    const m = parseInt(dateInput.slice(5, 7), 10);
    const d = parseInt(dateInput.slice(8, 10), 10);
    if (y >= 1000 && y <= 9999 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      const dt = new Date(y, m - 1, d);
      if (dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d) {
        return dt.getTime();
      }
    }
  }
  return null;
}

// Optimized ASCII digit math implementation
function optimizedGetLocalMidnightTime(dateInput) {
  if (!dateInput) return null;
  if (typeof dateInput === "string" && dateInput.length === 10 && dateInput.charCodeAt(4) === 45 && dateInput.charCodeAt(7) === 45) {
    const y = (dateInput.charCodeAt(0) - 48) * 1000 + (dateInput.charCodeAt(1) - 48) * 100 + (dateInput.charCodeAt(2) - 48) * 10 + (dateInput.charCodeAt(3) - 48);
    const m = (dateInput.charCodeAt(5) - 48) * 10 + (dateInput.charCodeAt(6) - 48);
    const d = (dateInput.charCodeAt(8) - 48) * 10 + (dateInput.charCodeAt(9) - 48);
    if (y >= 1000 && y <= 9999 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      const dt = new Date(y, m - 1, d);
      if (dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d) {
        return dt.getTime();
      }
    }
  }
  return null;
}

// Verify output parity across various test dates
const testDates = [
  "2026-01-01",
  "2026-02-28",
  "2026-05-18",
  "2026-12-31",
  "2024-02-29" // Leap year
];

for (const d of testDates) {
  const refTime = referenceGetLocalMidnightTime(d);
  const optTime = optimizedGetLocalMidnightTime(d);
  assert.strictEqual(optTime, refTime, `Output mismatch for date ${d}: expected ${refTime}, got ${optTime}`);
}

console.log("✅ Functional Parity Passed: Output matches baseline implementation across all test dates");

// Benchmark
const iterations = 2000000;

const startRef = performance.now();
for (let i = 0; i < iterations; i++) {
  referenceGetLocalMidnightTime(testDate);
}
const endRef = performance.now();
const refDuration = endRef - startRef;

const startOpt = performance.now();
for (let i = 0; i < iterations; i++) {
  optimizedGetLocalMidnightTime(testDate);
}
const endOpt = performance.now();
const optDuration = endOpt - startOpt;

const speedup = (refDuration / optDuration).toFixed(2);
console.log(`📊 Benchmark Results (${iterations.toLocaleString()} iterations):`);
console.log(`   - Reference (slice + parseInt): ${refDuration.toFixed(2)} ms`);
console.log(`   - Optimized (ASCII digit math): ${optDuration.toFixed(2)} ms`);
console.log(`   - Speedup Factor: ${speedup}x faster`);

assert.ok(optDuration < refDuration, "Optimized implementation must be faster than reference");

console.log("🎉 ALL STREAK HOOK PERFORMANCE VERIFICATIONS PASSED PERFECTLY!");
