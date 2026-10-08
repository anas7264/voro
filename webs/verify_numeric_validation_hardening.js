import {
  isPositiveNumber,
  isNonNegativeNumber,
  isInteger,
  isValidWeight,
  isValidExerciseWeight,
  isValidHeight,
  isValidAge,
  isValidBodyFat,
  isValidCalories,
  isValidMacro,
  isValidMacroRatio,
  isValidHeartRate,
  isValidBloodPressure,
  isValidTemperature,
  isValidReps,
  isValidSets,
  isValidDuration,
  validateVitals
} from './src/utils/validators.js';

console.log('=========================================');
console.log('🧪 RUNNING SECURITY VERIFICATION: NUMERIC VALIDATION HARDENING');
console.log('=========================================');

let passed = 0;
let failed = 0;

function assertEqual(actual, expected, testName) {
  if (actual === expected) {
    passed++;
    console.log(`✅ Passed: ${testName}`);
  } else {
    failed++;
    console.error(`❌ Failed: ${testName}. Expected ${expected}, got ${actual}`);
  }
}

// 🛡️ Test 1: Valid numeric inputs pass
assertEqual(isPositiveNumber(10), true, 'isPositiveNumber(10)');
assertEqual(isPositiveNumber('10.5'), true, 'isPositiveNumber("10.5")');
assertEqual(isNonNegativeNumber(0), true, 'isNonNegativeNumber(0)');
assertEqual(isInteger(42), true, 'isInteger(42)');
assertEqual(isInteger('42'), true, 'isInteger("42")');
assertEqual(isValidWeight(70), true, 'isValidWeight(70)');
assertEqual(isValidHeight(175), true, 'isValidHeight(175)');
assertEqual(isValidAge(25), true, 'isValidAge(25)');
assertEqual(isValidHeartRate(80), true, 'isValidHeartRate(80)');
assertEqual(isValidBloodPressure(120, 80), true, 'isValidBloodPressure(120, 80)');
assertEqual(isValidTemperature(36.6), true, 'isValidTemperature(36.6)');
assertEqual(isValidReps(10), true, 'isValidReps(10)');
assertEqual(isValidSets(3), true, 'isValidSets(3)');
assertEqual(isValidDuration(60), true, 'isValidDuration(60)');

// 🛡️ Test 2: Trailing string injection bypass attempts are rejected
assertEqual(isPositiveNumber('10abc'), false, 'isPositiveNumber("10abc") rejected');
assertEqual(isPositiveNumber('10<script>'), false, 'isPositiveNumber("10<script>") rejected');
assertEqual(isInteger('42abc'), false, 'isInteger("42abc") rejected');
assertEqual(isValidWeight('70<script>alert(1)</script>'), false, 'isValidWeight with trailing script rejected');
assertEqual(isValidAge('25<script>'), false, 'isValidAge("25<script>") rejected');
assertEqual(isValidAge('25.5'), false, 'isValidAge float "25.5" rejected');
assertEqual(isValidHeartRate('80hello'), false, 'isValidHeartRate("80hello") rejected');
assertEqual(isValidHeartRate('80<script>'), false, 'isValidHeartRate("80<script>") rejected');
assertEqual(isValidBloodPressure('120<script>', '80'), false, 'isValidBloodPressure with trailing script rejected');
assertEqual(isValidTemperature('36.6<script>'), false, 'isValidTemperature with trailing script rejected');
assertEqual(isValidReps('10abc'), false, 'isValidReps("10abc") rejected');
assertEqual(isValidSets('3xyz'), false, 'isValidSets("3xyz") rejected');
assertEqual(isValidDuration('60sec'), false, 'isValidDuration("60sec") rejected');

// 🛡️ Test 3: Scientific notation, non-primitive, empty, and non-finite inputs are rejected
assertEqual(isValidHeartRate('1e2'), false, 'isValidHeartRate("1e2") scientific notation rejected');
assertEqual(isValidHeartRate(''), false, 'isValidHeartRate("") empty string rejected');
assertEqual(isValidHeartRate('   '), false, 'isValidHeartRate whitespace rejected');
assertEqual(isValidHeartRate(NaN), false, 'isValidHeartRate(NaN) rejected');
assertEqual(isValidHeartRate(Infinity), false, 'isValidHeartRate(Infinity) rejected');
assertEqual(isValidHeartRate(['80']), false, 'isValidHeartRate array coercion rejected');
assertEqual(isValidHeartRate({ bpm: 80 }), false, 'isValidHeartRate object coercion rejected');

// 🛡️ Test 4: Integration test with validateVitals
const vitalsWithInjection = {
  heartRate: '80<script>alert(1)</script>',
  sleep: 8,
  mood: 5
};
const result = validateVitals(vitalsWithInjection);
assertEqual(result.valid, false, 'validateVitals rejects heartRate injection string');
assertEqual(result.errors.heartRate !== undefined, true, 'validateVitals sets error for injected heartRate');

console.log('=========================================');
console.log(`📊 RESULTS: ${passed} Passed, ${failed} Failed`);
console.log('=========================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL NUMERIC VALIDATION HARDENING TESTS PASSED SUCCESSFULLY!');
}
