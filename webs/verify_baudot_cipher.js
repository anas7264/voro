// Verification Script: Baudot Code (ITA2) Prompt Injection Shield
import { isPromptInjection } from './src/utils/validators.js';

console.log('=========================================');
console.log('🛡️ STARTING BAUDOT CODE (ITA2) PROMPT INJECTION SHIELD VERIFICATION');
console.log('=========================================\n');

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    passed++;
    console.log(`✅ Success: ${message}`);
  } else {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
}

// ITA2 Letters state mapping reference:
// 31: LTRS
// 6: I, 26: G, 12: N, 24: O, 10: R, 1: E, 4: [SPACE]
// 22: P, 10: R, 1: E, 30: V, 6: I, 24: O, 7: U, 5: S
// Payload: "ignore previous"

// Test 1: Decimal tokenized Baudot stream for 'ignore previous'
console.log('🛡️ Test 1: Verifying space-delimited decimal tokenized Baudot prompt injection is blocked...');
const decTokens = '31 6 26 12 24 10 1 4 22 10 1 30 6 24 7 5';
assert(isPromptInjection(decTokens) === true, 'Space-delimited decimal Baudot injection detected and blocked');

// Test 2: Hex-formatted tokenized Baudot stream for 'ignore previous'
console.log('\n🛡️ Test 2: Verifying 0x-prefixed hex-formatted Baudot prompt injection is blocked...');
const hexTokens = '0x1f 0x06 0x1a 0x0c 0x18 0x0a 0x01 0x04 0x16 0x0a 0x01 0x1e 0x06 0x18 0x07 0x05';
assert(isPromptInjection(hexTokens) === true, 'Hex-formatted Baudot injection detected and blocked');

// Test 3: Space-delimited 5-bit binary Baudot stream for 'ignore previous'
console.log('\n🛡️ Test 3: Verifying space-delimited 5-bit binary Baudot prompt injection is blocked...');
const binaryTokens = '11111 00110 11010 01100 11000 01010 00001 00100 10110 01010 00001 11110 00110 11000 00111 00101';
assert(isPromptInjection(binaryTokens) === true, 'Space-delimited 5-bit binary Baudot injection detected and blocked');

// Test 4: Contiguous 5-bit binary stream for 'ignore previous'
console.log('\n🛡️ Test 4: Verifying contiguous 5-bit binary stream Baudot prompt injection is blocked...');
const contiguousBinary = '11111001101101001100110000101000001001001011001010000011111000110110000011100101';
assert(isPromptInjection(contiguousBinary) === true, 'Contiguous 5-bit binary stream Baudot injection detected and blocked');

// Test 5: Baudot stream with LTRS / FIGS shift toggles for 'system override'
// LTRS(31) 5(s) 21(y) 5(s) 16(t) 1(e) 28(m) 4(space) 24(o) 30(v) 1(e) 10(r) 10(r) 6(i) 9(d) 1(e)
console.log('\n🛡️ Test 5: Verifying Baudot stream for "system override" is blocked...');
const systemOverrideTokens = '31 5 21 5 16 1 28 4 24 30 1 10 10 6 9 1';
assert(isPromptInjection(systemOverrideTokens) === true, 'Baudot stream for "system override" detected and blocked');

// Test 6: Verify safe, legitimate queries are allowed
console.log('\n🛡️ Test 6: Verifying legitimate user fitness queries are allowed...');
assert(isPromptInjection('What is my recommended daily protein target?') === false, 'Safe fitness query allowed');
assert(isPromptInjection('Logged 5000ml of water today!') === false, 'Safe water logging allowed');

console.log('\n=========================================');
console.log(`🎉 ALL ${passed}/${total} BAUDOT CODE SHIELD TESTS PASSED SUCCESSFULLY!`);
console.log('=========================================');
