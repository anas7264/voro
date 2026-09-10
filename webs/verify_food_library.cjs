const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- VERIFYING FOOD LIBRARY PERFORMANCE & REFACTORING ---');

const filePath = path.join(__dirname, 'src', 'pages', 'FoodLibrary.jsx');
const code = fs.readFileSync(filePath, 'utf8');

// Verification 1: Frozen static datasets and single-pass Category map
assert.strictEqual(code.includes('FOODS_LOWERCASE = Object.freeze('), true, 'FOODS_LOWERCASE must be frozen with Object.freeze');
assert.strictEqual(code.includes('CATEGORIES: Object.freeze('), true, 'CATEGORIES must be frozen');
assert.strictEqual(code.includes('FOOD_BY_CATEGORY: Object.freeze('), true, 'FOOD_BY_CATEGORY must be frozen');

// Verification 2: Surgical Storage Reactivity
assert.strictEqual(code.includes("useStorageKeySelector('food_favorites', selectFoodFavorites)"), true, 'FoodLibrary must use useStorageKeySelector for food_favorites');
assert.strictEqual(code.includes('updateStorageKey'), true, 'FoodLibrary must use updateStorageKey for favorites updates');

// Verification 3: Item Wrapper Subcomponent to prevent per-render inline style object allocations
assert.strictEqual(code.includes('FoodArtifactItemWrapper'), true, 'FoodArtifactItemWrapper subcomponent must be present');
assert.strictEqual(code.includes('FoodArtifactItemWrapper.displayName = \'FoodArtifactItemWrapper\';'), true, 'FoodArtifactItemWrapper must have displayName set');

// Verification 4: No per-card useMemo for nodeId
assert.strictEqual(code.includes('useMemo(() => `FOOD_NODE_0${idx}`'), false, 'Per-card useMemo for nodeId must be removed');

console.log('✅ ALL FOOD LIBRARY CODE AUDIT VERIFICATIONS PASSED SUCCESSFULLY!');
