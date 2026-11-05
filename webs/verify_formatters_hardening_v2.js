import {
  formatMacros,
  formatVolume,
  formatStreak,
  formatLevel
} from './src/utils/formatters.js';

console.log('=========================================');
console.log('🧪 RUNNING VERIFICATION: FORMATTERS HARDENING V2');
console.log('=========================================');

// Test 1: formatMacros numeric and string numeric values
console.log('🛡️ Test 1: Testing formatMacros with string numeric values...');
const res1 = formatMacros('30', '40', '10');
if (res1.protein === '30.0g P' && res1.carbs === '40.0g C' && res1.fat === '10.0g F' && res1.total === '80.0g') {
  console.log('✅ Success: formatMacros accurately computes total without string concatenation!');
} else {
  console.error('❌ Test 1 Failed:', res1);
  process.exit(1);
}

// Test 2: formatMacros non-finite / null / undefined inputs
console.log('🛡️ Test 2: Testing formatMacros with null/undefined/NaN inputs...');
const res2 = formatMacros(null, undefined, 'invalid');
if (res2.protein === '0.0g P' && res2.carbs === '0.0g C' && res2.fat === '0.0g F' && res2.total === '0.0g') {
  console.log('✅ Success: formatMacros handles non-finite inputs gracefully!');
} else {
  console.error('❌ Test 2 Failed:', res2);
  process.exit(1);
}

// Test 3: formatVolume with numeric strings and boundary values
console.log('🛡️ Test 3: Testing formatVolume with string numeric values...');
const vol1 = formatVolume('3', '10', '50');
if (vol1 === '1,500 kg') {
  console.log('✅ Success: formatVolume parses numeric strings correctly!');
} else {
  console.error(`❌ Test 3 Failed: expected "1,500 kg", got "${vol1}"`);
  process.exit(1);
}

const vol2 = formatVolume(null, -5, NaN);
if (vol2 === '0 kg') {
  console.log('✅ Success: formatVolume handles negative and non-finite values safely!');
} else {
  console.error(`❌ Test 3 Failed: expected "0 kg", got "${vol2}"`);
  process.exit(1);
}

// Test 4: formatStreak with strings, boundary numbers, null, undefined
console.log('🛡️ Test 4: Testing formatStreak...');
if (
  formatStreak('0') === 'No streak' &&
  formatStreak(0) === 'No streak' &&
  formatStreak('1') === '1 day 🔥' &&
  formatStreak(1) === '1 day 🔥' &&
  formatStreak('5') === '5 days 🔥' &&
  formatStreak(5) === '5 days 🔥' &&
  formatStreak(null) === 'No streak' &&
  formatStreak(undefined) === 'No streak' &&
  formatStreak(NaN) === 'No streak' &&
  formatStreak(-3) === 'No streak'
) {
  console.log('✅ Success: formatStreak handles string numbers, zeros, ones, and edge cases safely!');
} else {
  console.error('❌ Test 4 Failed with unexpected streak results');
  process.exit(1);
}

// Test 5: formatLevel with strings, non-finite values, and valid numbers
console.log('🛡️ Test 5: Testing formatLevel...');
const lvl1 = formatLevel('2500');
if (lvl1.level === 3 && lvl1.xp === 2500 && lvl1.currentXP === 500 && lvl1.nextLevelXP === 3000 && lvl1.progress === '50.0') {
  console.log('✅ Success: formatLevel correctly processes string numbers!');
} else {
  console.error('❌ Test 5 Failed:', lvl1);
  process.exit(1);
}

const lvl2 = formatLevel(NaN);
if (lvl2.level === 1 && lvl2.xp === 0 && lvl2.currentXP === 0 && lvl2.nextLevelXP === 1000 && lvl2.progress === '0.0') {
  console.log('✅ Success: formatLevel safely guards against NaN inputs!');
} else {
  console.error('❌ Test 5 Failed for NaN:', lvl2);
  process.exit(1);
}

console.log('\n🎉 ALL FORMATTERS HARDENING V2 TESTS PASSED SUCCESSFULLY!');
console.log('=========================================');
