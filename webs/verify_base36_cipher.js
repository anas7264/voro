/**
 * VORO Security Verification: Base36 Prompt Injection Shield
 * Tests detection and neutralization of Base36-encoded prompt injection payloads.
 */

import { isPromptInjection } from './src/utils/validators.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ Passed: ${message}`);
    passed++;
  } else {
    console.error(`❌ Failed: ${message}`);
    failed++;
  }
}

console.log('=========================================');
console.log('🧪 RUNNING BASE36 PROMPT INJECTION SHIELD VERIFICATION');
console.log('=========================================');

// Test 1: Base36-encoded "ignore previous" ("vl9s1nkr0oglvx599tcvmur")
const payload1 = 'vl9s1nkr0oglvx599tcvmur';
assert(isPromptInjection(payload1), `Base36-encoded "ignore previous" (${payload1}) is blocked`);

// Test 2: Base36-encoded "system override" ("ylxe2km0da6kihqbkblph7p")
const payload2 = 'ylxe2km0da6kihqbkblph7p';
assert(isPromptInjection(payload2), `Base36-encoded "system override" (${payload2}) is blocked`);

// Test 3: Base36-encoded payload embedded in user prompt
const embeddedPayload = `Please process this query: vl9s1nkr0oglvx599tcvmur and summarize the output.`;
assert(isPromptInjection(embeddedPayload), 'Embedded Base36 prompt injection payload is blocked');

// Test 4: Benign user query is not flagged
const benignQuery = 'What is the optimal macro split for muscle hypertrophy?';
assert(!isPromptInjection(benignQuery), 'Benign user query is allowed');

console.log('=========================================');
console.log(`📊 RESULTS: ${passed} Passed, ${failed} Failed`);
console.log('=========================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL BASE36 PROMPT INJECTION SECURITY TESTS PASSED SUCCESSFULLY!');
}
