/**
 * Verification Script for Pollux & Morbit Morse Ciphers Prompt Injection Shield (PMMC-PIS)
 * Validates that Pollux (digit-to-Morse) and Morbit (digit-to-Morse-pair) obfuscated
 * prompt injection attacks are decoded and neutralized by VORO Input Validators.
 */

import { safeDecodePollux, safeDecodeMorbit, isPromptInjection } from './src/utils/validators.js';

console.log("=========================================");
console.log("🧪 RUNNING POLLUX & MORBIT CIPHERS SECURITY VERIFICATION");
console.log("=========================================");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

// 1. Pollux Cipher Tests
console.log("🟢 Testing Pollux Cipher Prompt Injection Detection...");

// "ignore previous"
// Pollux stream for mapDict index 0: '.' -> 0, '-' -> 3, 'x' -> 6
const polluxIgnorePreviousDigits = "006330630633360306066033060306060003600633360036000";
const decodedPollux = safeDecodePollux(polluxIgnorePreviousDigits);

assert(
  decodedPollux !== null && decodedPollux.includes("ignore"),
  `safeDecodePollux successfully decoded Pollux payload (Decoded: "${decodedPollux}")`
);

assert(
  isPromptInjection(polluxIgnorePreviousDigits) === true,
  "isPromptInjection successfully flagged Pollux prompt injection payload"
);

// 2. Morbit Cipher Tests
console.log("🟢 Testing Morbit Cipher Prompt Injection Detection...");

// "system override" in Morbit pairs: 1='..', 2='.-', 3='.x', 4='-.', 5='--', 6='-x', 7='x.', 8='x-', 9='xx'
const morbitSystemOverrideDigits = "134571878685716323231817";
const decodedMorbit = safeDecodeMorbit(morbitSystemOverrideDigits);

assert(
  decodedMorbit !== null && (decodedMorbit.includes("system") || decodedMorbit.includes("override")),
  `safeDecodeMorbit successfully decoded Morbit payload (Decoded: "${decodedMorbit}")`
);

assert(
  isPromptInjection(morbitSystemOverrideDigits) === true,
  "isPromptInjection successfully flagged Morbit prompt injection payload"
);

// 3. Benign Queries Test (False Positive Check)
console.log("🟢 Verifying zero false positives on benign user queries...");

const benignQueries = [
  "Can you create a 4-day hypertrophy workout plan focused on bench press and squats?",
  "What is my recommended daily macro intake if my weight is 80kg and height is 180cm?",
  "I drank 2500ml of water today and slept 8 hours. How is my recovery?"
];

benignQueries.forEach((q, idx) => {
  assert(
    isPromptInjection(q) === false,
    `Benign fitness query ${idx + 1} passed ("${q.slice(0, 45)}...")`
  );
});

console.log("\n=========================================");
if (failed === 0) {
  console.log(`🎉 ALL ${passed}/${passed + failed} POLLUX & MORBIT CIPHER TESTS PASSED SUCCESSFULLY!`);
  console.log("=========================================");
} else {
  console.error(`💥 TEST SUITE FAILED: ${failed} tests failed!`);
  console.log("=========================================");
  process.exit(1);
}
