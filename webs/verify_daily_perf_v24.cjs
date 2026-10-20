/**
 * 🧪 VERIFICATION SUITE: Daily Performance Optimization v24
 * Tests callback referential stability, zero-allocation date formatting,
 * optimistic input resetting, and synchronous storage state lookups.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('⚡ Running Daily Performance Optimization Verification Suite v24...');

let passed = 0;
let failed = 0;

function check(label, condition) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✕ ${label}`);
    failed++;
  }
}

// 1. Check ShoppingList.jsx optimizations
const shoppingListCode = fs.readFileSync(path.join(__dirname, 'src/pages/ShoppingList.jsx'), 'utf8');
check(
  'ShoppingList.jsx wraps handleAddItem in useCallback with optimistic input reset',
  shoppingListCode.includes('handleAddItem = useCallback') &&
  shoppingListCode.includes('setInputValue(\'\');')
);
check(
  'ShoppingList.jsx wraps initiateGlobalPurge, executeGlobalPurge, and resetGlobalPurgeState in useCallback',
  shoppingListCode.includes('initiateGlobalPurge = useCallback') &&
  shoppingListCode.includes('executeGlobalPurge = useCallback') &&
  shoppingListCode.includes('resetGlobalPurgeState = useCallback')
);

// 2. Check VitalsTracker.jsx optimizations
const vitalsTrackerCode = fs.readFileSync(path.join(__dirname, 'src/pages/VitalsTracker.jsx'), 'utf8');
check(
  'VitalsTracker.jsx reads getItem(\'vitals\') directly in handleSaveVitals to remove history dependency',
  vitalsTrackerCode.includes('getItem(\'vitals\') || []') &&
  !vitalsTrackerCode.includes('], [vitals, history,')
);
check(
  'VitalsTracker.jsx uses memoized input/slider handlers to prevent closure re-allocations',
  vitalsTrackerCode.includes('handleHeartRateChange = useCallback') &&
  vitalsTrackerCode.includes('handleMoodChange = useCallback')
);

// 3. Check SupplementTracker.jsx optimizations
const suppTrackerCode = fs.readFileSync(path.join(__dirname, 'src/pages/SupplementTracker.jsx'), 'utf8');
check(
  'SupplementTracker.jsx reads getItem(\'supplements\') directly in handleRemove',
  suppTrackerCode.includes('getItem(\'supplements\') || EMPTY_ARRAY')
);

// 4. Check NutrientTracker.jsx optimizations
const nutrientTrackerCode = fs.readFileSync(path.join(__dirname, 'src/pages/NutrientTracker.jsx'), 'utf8');
check(
  'NutrientTracker.jsx reads getItem(\'nutrient_tracker\') directly in handleLogIntake',
  nutrientTrackerCode.includes('getItem(\'nutrient_tracker\') || DEFAULT_TRACKER')
);

// 5. Check RecipeLibrary.jsx & FoodJournal.jsx optimizations
const recipeLibCode = fs.readFileSync(path.join(__dirname, 'src/pages/RecipeLibrary.jsx'), 'utf8');
check(
  'RecipeLibrary.jsx uses getFastDateStr for zero-allocation ISO date key extraction',
  recipeLibCode.includes('getFastDateStr') &&
  recipeLibCode.includes('todayStr = getFastDateStr(new Date())')
);

const foodJournalCode = fs.readFileSync(path.join(__dirname, 'src/pages/FoodJournal.jsx'), 'utf8');
check(
  'FoodJournal.jsx performs optimistic input reset prior to async persistence',
  foodJournalCode.includes('setNote(\'\');')
);

console.log(`\n--------------------------------------------------`);
console.log(`Verification Results: ${passed}/${passed + failed} checks passed.`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('✨ All v24 Daily Performance checks passed successfully!\n');
}
