/**
 * VORO Security Verification: CSV Formula Injection Shield (CFIS)
 * Tests neutralization of OWASP CSV Formula Injection, DDE command execution,
 * quote escaping, and control character purging.
 */

import { sanitizeCSVField } from './src/utils/security.js';
import { sanitizeCSVField as validatorSanitizeCSVField } from './src/utils/validators.js';

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
console.log('🧪 RUNNING CSV FORMULA INJECTION SHIELD VERIFICATION');
console.log('=========================================');

// Test 1: Equals (=) Formula Trigger Neutralization
const t1 = sanitizeCSVField('=1+1');
assert(t1 === '"\'=1+1"', `Equals formula trigger prepends single quote: got ${t1}`);

// Test 2: Plus (+) DDE Formula Trigger Neutralization
const t2 = sanitizeCSVField('+CMD|\' /C calc\'!A1');
assert(t2 === '"\'+CMD|\' /C calc\'!A1"', `Plus DDE trigger prepends single quote: got ${t2}`);

// Test 3: Minus (-) Formula Trigger Neutralization
const t3 = sanitizeCSVField('-2+2');
assert(t3 === '"\'-2+2"', `Minus formula trigger prepends single quote: got ${t3}`);

// Test 4: At (@) Formula Trigger Neutralization
const t4 = sanitizeCSVField('@SUM(A1:A10)');
assert(t4 === '"\'@SUM(A1:A10)"', `At symbol formula trigger prepends single quote: got ${t4}`);

// Test 5: Tab (\t) Formula Trigger Neutralization
const t5 = sanitizeCSVField('\t=HYPERLINK("http://evil.com")');
assert(t5 === '"\'\t=HYPERLINK(""http://evil.com"")"', `Tab character formula trigger prepends single quote and doubles internal quotes: got ${t5}`);

// Test 6: Percent (%) and Pipe (|) Formula Trigger Neutralization
const t6a = sanitizeCSVField('%100');
const t6b = sanitizeCSVField('|calc');
assert(t6a === '"\'%100"' && t6b === '"\'|calc"', `Percent and Pipe triggers prepend single quote: got ${t6a}, ${t6b}`);

// Test 7: Leading Whitespace + Formula Trigger
const t7 = sanitizeCSVField('   =SUM(A1:A5)');
assert(t7 === '"\'   =SUM(A1:A5)"', `Leading whitespace before formula trigger prepends single quote: got ${t7}`);

// Test 8: Double Quote Escaping (Delimiter Hijacking Protection)
const t8 = sanitizeCSVField('Chicken "Breast" 200g');
assert(t8 === '"Chicken ""Breast"" 200g"', `Double quotes are escaped by doubling: got ${t8}`);

// Test 9: Control Character Stripping
const t9 = sanitizeCSVField('Safe\x00Food\x07Notes');
assert(t9 === '"SafeFoodNotes"', `Dangerous control characters are stripped: got ${t9}`);

// Test 10: Null & Undefined Field Handling
const t10a = sanitizeCSVField(null);
const t10b = sanitizeCSVField(undefined);
assert(t10a === '""' && t10b === '""', `Null and undefined return empty quoted field: got ${t10a}, ${t10b}`);

// Test 11: Safe String & Numeric Field Handling
const t11a = sanitizeCSVField('Grilled Salmon');
const t11b = sanitizeCSVField(450);
assert(t11a === '"Grilled Salmon"' && t11b === '"450"', `Safe text and numbers are properly quoted: got ${t11a}, ${t11b}`);

// Test 12: Validator Re-export Parity
const t12 = validatorSanitizeCSVField('=SUM(1,2)');
assert(t12 === '"\'=SUM(1,2)"', `Validator re-export functions identically: got ${t12}`);

console.log('=========================================');
console.log(`📊 RESULTS: ${passed} Passed, ${failed} Failed`);
console.log('=========================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL CSV FORMULA INJECTION SECURITY TESTS PASSED SUCCESSFULLY!');
}
