// Verification script for Base32 Substring Prompt Injection Shield
import { isPromptInjection } from './src/utils/validators.js';

console.log('=========================================');
console.log('🛡️ RUNNING BASE32 SUBSTRING INJECTION VERIFICATION TEST SUITE');
console.log('=========================================');

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    passed++;
    console.log(`✅ Test ${total} Passed: ${message}`);
  } else {
    console.error(`❌ Test ${total} Failed: ${message}`);
    process.exit(1);
  }
}

// 1. Standard Base32 (RFC 4648) substring injection in natural language sentence
const base32Payload = 'NFTW433SMUQHA4TFOZUW65LT'; // "ignore previous"
assert(
  isPromptInjection(`My fitness goal is ${base32Payload} and build muscle`) === true,
  'Base32 (RFC 4648) substring injection in natural language sentence is detected'
);

// 2. Base32hex (RFC 4648 §7 Extended Hex Alphabet) substring injection in natural language sentence
const base32HexPayload = 'D5JMSRRICKG70SJ5EPKMUTBJ'; // "ignore previous"
assert(
  isPromptInjection(`User dietary restriction: ${base32HexPayload} - gluten free`) === true,
  'Base32hex (RFC 4648 §7) substring injection in sentence is detected'
);

// 3. Z-base-32 human-oriented 5-bit encoding substring injection
const zBase32Payload = 'pfush551cwo8yhufq3ws67mu'; // "ignore previous" in z-base-32
assert(
  isPromptInjection(`Injury history: ${zBase32Payload} none`) === true,
  'Z-base-32 substring injection in sentence is detected'
);

// 4. Safe user inputs containing standard words should NOT be flagged as prompt injection
assert(
  isPromptInjection('My fitness goal is to improve athletic endurance and build muscle') === false,
  'Safe natural language input is not flagged as prompt injection'
);

console.log('\n=========================================');
console.log(`🎉 ALL ${passed}/${total} BASE32 SUBSTRING SECURITY TESTS PASSED!`);
console.log('=========================================\n');
