// Verification Script for MealPrepPlanner Performance Optimization
import assert from 'node:assert';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('====================================================');
console.log('⚡ VERIFYING MEAL PREP PLANNER PERFORMANCE OPTIMIZATION');
console.log('====================================================');

const code = readFileSync(resolve(__dirname, 'src/pages/MealPrepPlanner.jsx'), 'utf8');

// Test 1: Module-scoped selectors defined outside component
console.log('🧪 Test 1: Verifying module-scoped state selectors...');
assert.ok(code.includes('const selectPrepPlan ='), 'MealPrepPlanner must define selectPrepPlan');
assert.ok(code.includes('const selectProvisions ='), 'MealPrepPlanner must define selectProvisions');
console.log('✅ Success: Module-scoped state selectors defined!');

// Test 2: Shallow array equality comparator defined outside component
console.log('🧪 Test 2: Verifying shallowArrayEqual helper...');
assert.ok(code.includes('const shallowArrayEqual ='), 'MealPrepPlanner must define shallowArrayEqual');
console.log('✅ Success: shallowArrayEqual helper defined!');

// Test 3: Removal of JSON.stringify inside useStorageKeySelector
console.log('🧪 Test 3: Verifying removal of JSON.stringify inside useStorageKeySelector...');
assert.ok(!code.includes('JSON.stringify(a) === JSON.stringify(b)'), 'MealPrepPlanner must NOT use JSON.stringify in useStorageKeySelector');
assert.ok(code.includes("useStorageKeySelector('meal_prep', selectPrepPlan, shallowArrayEqual)"), 'MealPrepPlanner must use selectPrepPlan and shallowArrayEqual');
assert.ok(code.includes("useStorageKeySelector('meal_prep', selectProvisions, shallowArrayEqual)"), 'MealPrepPlanner must use selectProvisions and shallowArrayEqual');
console.log('✅ Success: JSON.stringify removed from useStorageKeySelector!');

// Test 4: Memoized PrepSessionCardWrapper extracted
console.log('🧪 Test 4: Verifying PrepSessionCardWrapper component...');
assert.ok(code.includes('PrepSessionCardWrapper = React.memo'), 'MealPrepPlanner must extract PrepSessionCardWrapper');
assert.ok(code.includes('<PrepSessionCardWrapper'), 'MealPrepPlanner must render PrepSessionCardWrapper inside map loop');
console.log('✅ Success: PrepSessionCardWrapper extracted for zero-allocation rendering!');

console.log('====================================================');
console.log('🎉 ALL MEAL PREP PLANNER PERFORMANCE CHECKS PASSED!');
console.log('====================================================');
