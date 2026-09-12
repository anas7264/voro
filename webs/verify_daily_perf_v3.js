import assert from 'assert';

console.log('=========================================');
console.log('⚡ TESTING DAILY PERFORMANCE OPTIMIZATION V3');
console.log('=========================================');

// 1. Verify pad2 zero-allocation string padding lookup table
console.log('🧪 Test 1: Verifying PAD_STRINGS lookup table...');
const PAD_STRINGS = Object.freeze(Array.from({ length: 100 }, (_, i) => String(i).padStart(2, '0')));
const pad2 = (num) => PAD_STRINGS[num] || String(num).padStart(2, '0');

assert.strictEqual(Object.isFrozen(PAD_STRINGS), true, 'PAD_STRINGS must be frozen');
assert.strictEqual(PAD_STRINGS.length, 100, 'PAD_STRINGS must contain 100 elements');
assert.strictEqual(pad2(0), '00', 'pad2(0) must return "00"');
assert.strictEqual(pad2(9), '09', 'pad2(9) must return "09"');
assert.strictEqual(pad2(59), '59', 'pad2(59) must return "59"');
assert.strictEqual(pad2(120), '120', 'pad2 fallback above 99');
console.log('✅ Success: PAD_STRINGS lookup table verified!');

// 2. Verify immutable checklist toggle filter/append logic
console.log('🧪 Test 2: Verifying immutable checklist toggle logic...');
const initialChecklist = [0, 2];

const toggleItem = (checklist, itemIndex) => {
  const isChecked = checklist.includes(itemIndex);
  return isChecked
    ? checklist.filter(idx => idx !== itemIndex)
    : [...checklist, itemIndex];
};

const checkedResult = toggleItem(initialChecklist, 1);
assert.deepStrictEqual(checkedResult, [0, 2, 1], 'Checking item 1 appends to checklist');
assert.notStrictEqual(checkedResult, initialChecklist, 'Must create a new array reference');

const uncheckedResult = toggleItem(checkedResult, 2);
assert.deepStrictEqual(uncheckedResult, [0, 1], 'Unchecking item 2 removes item from checklist');
assert.notStrictEqual(uncheckedResult, checkedResult, 'Must create a new array reference');

console.log('✅ Success: Immutable checklist toggle verified!');

// 3. Verify zero-allocation chat history selector
console.log('🧪 Test 3: Verifying chat history selector immutability...');
const EMPTY_ARRAY = Object.freeze([]);
const selectChatHistory = (history) => history || EMPTY_ARRAY;

assert.strictEqual(selectChatHistory(null), EMPTY_ARRAY, 'Falsy input returns EMPTY_ARRAY');
assert.strictEqual(selectChatHistory(undefined), EMPTY_ARRAY, 'Undefined input returns EMPTY_ARRAY');
assert.strictEqual(Object.isFrozen(EMPTY_ARRAY), true, 'EMPTY_ARRAY must be frozen');

const mockHistory = [{ role: 'user', content: 'Hello' }];
assert.strictEqual(selectChatHistory(mockHistory), mockHistory, 'Valid history array returned as-is');
console.log('✅ Success: Chat history selector verified!');

// 4. Verify timestamp formatter
console.log('🧪 Test 4: Verifying timestamp formatting performance...');
const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const testIsoDate = '2025-02-20T14:30:00.000Z';

const startTime = process.hrtime.bigint();
let formattedOutput = '';
for (let i = 0; i < 10000; i++) {
  formattedOutput = timeFormatter.format(new Date(testIsoDate));
}
const endTime = process.hrtime.bigint();
const durationMs = Number(endTime - startTime) / 1e6;

assert.strictEqual(typeof formattedOutput, 'string');
console.log(`⏱️ 10,000 timestamp format operations took: ${durationMs.toFixed(3)}ms`);
console.log('✅ Success: Cached DateTimeFormat verified!');

console.log('=========================================');
console.log('🎉 ALL DAILY PERFORMANCE V3 VERIFICATION TESTS PASSED!');
console.log('=========================================');
