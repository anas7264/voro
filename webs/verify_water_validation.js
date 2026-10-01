import { isValidWaterAmount, validateWaterEntry } from './src/utils/validators.js';

console.log('=========================================');
console.log('🧪 RUNNING SECURITY VERIFICATION: WATER AMOUNT VALIDATION');
console.log('=========================================');

// 1. Valid inputs
const validInputs = [
  2500,
  0,
  5000,
  '2500',
  '0',
  '5000',
  ' 2500 '
];

console.log('🟢 Test 1: Testing valid water amounts...');
for (const input of validInputs) {
  if (!isValidWaterAmount(input)) {
    console.error(`❌ Failure: Valid input failed validation: ${JSON.stringify(input)}`);
    process.exit(1);
  }
}
console.log('✅ Success: All valid water amounts passed!');

// 2. Out-of-bounds / Invalid numeric inputs
const invalidNumericInputs = [
  -1,
  5001,
  10000,
  '5001',
  '-10',
  Infinity,
  -Infinity,
  NaN
];

console.log('🛡️ Test 2: Testing out-of-bounds and non-finite water amounts...');
for (const input of invalidNumericInputs) {
  if (isValidWaterAmount(input)) {
    console.error(`❌ Failure: Invalid numeric input passed validation: ${JSON.stringify(input)}`);
    process.exit(1);
  }
}
console.log('✅ Success: All out-of-bounds and non-finite water amounts rejected!');

// 3. Type coercion & parsing bypass attempts
const bypassAttempts = [
  '1e21',
  '1E10',
  '2500<script>',
  '2500ml',
  [2500],
  { amount: 2500 },
  null,
  undefined,
  '',
  '   ',
  true,
  false
];

console.log('🛡️ Test 3: Testing type coercion, scientific notation, and trailing string injection bypasses...');
for (const input of bypassAttempts) {
  if (isValidWaterAmount(input)) {
    console.error(`❌ Failure: Bypass attempt passed validation: ${JSON.stringify(input)}`);
    process.exit(1);
  }
}
console.log('✅ Success: All type coercion and string injection bypass attempts rejected!');

// 4. validateWaterEntry integration test
console.log('🟢 Test 4: Testing validateWaterEntry with valid and bypass inputs...');
const validEntryRes = validateWaterEntry({ amount: 2000, date: '2026-06-01' });
if (!validEntryRes.valid) {
  console.error('❌ Failure: Valid water entry failed validateWaterEntry:', validEntryRes);
  process.exit(1);
}

const bypassEntryRes = validateWaterEntry({ amount: '2000<script>', date: '2026-06-01' });
if (bypassEntryRes.valid) {
  console.error('❌ Failure: Bypass water entry passed validateWaterEntry!');
  process.exit(1);
}

console.log('✅ Success: validateWaterEntry integration verified!');

console.log('\n🎉 ALL WATER AMOUNT VALIDATION SECURITY TESTS PASSED SUCCESSFULLY!');
console.log('=========================================\n');
