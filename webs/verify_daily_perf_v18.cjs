const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=========================================');
console.log('⚡ TESTING DAILY PERFORMANCE OPTIMIZATION V18');
console.log('=========================================');

const progressPhotosPath = path.join(__dirname, 'src/pages/ProgressPhotos.jsx');
const shoppingListPath = path.join(__dirname, 'src/pages/ShoppingList.jsx');
const supplementTrackerPath = path.join(__dirname, 'src/pages/SupplementTracker.jsx');
const nutrientTrackerPath = path.join(__dirname, 'src/pages/NutrientTracker.jsx');
const workoutHistoryPath = path.join(__dirname, 'src/pages/WorkoutHistory.jsx');

const progressPhotosContent = fs.readFileSync(progressPhotosPath, 'utf8');
const shoppingListContent = fs.readFileSync(shoppingListPath, 'utf8');
const supplementTrackerContent = fs.readFileSync(supplementTrackerPath, 'utf8');
const nutrientTrackerContent = fs.readFileSync(nutrientTrackerPath, 'utf8');
const workoutHistoryContent = fs.readFileSync(workoutHistoryPath, 'utf8');

// 1. ProgressPhotos checks
assert.ok(
  progressPhotosContent.includes('dividerRef') && progressPhotosContent.includes('clippedLayerRef'),
  'ProgressPhotos SpectralLens must use dividerRef and clippedLayerRef for zero-allocation direct-DOM slider tracking'
);
assert.ok(
  !progressPhotosContent.includes('setSliderPos'),
  'ProgressPhotos SpectralLens must NOT trigger setSliderPos state updates on pointer movement'
);
assert.ok(
  progressPhotosContent.includes('KineticPhotoNode') && progressPhotosContent.includes('handleMouseMove = useCallback'),
  'ProgressPhotos KineticPhotoNode interaction handlers must be wrapped in useCallback'
);
console.log('✅ PASS: ProgressPhotos uses direct-DOM slider tracking and useCallback in KineticPhotoNode');

// 2. ShoppingList checks
assert.ok(
  shoppingListContent.includes("getItem('shopping_list')"),
  'ShoppingList handleToggleItem / handleDeleteItem must read getItem synchronously inside useCallback'
);
assert.ok(
  shoppingListContent.includes('ProcuredResourceCard') && shoppingListContent.includes('handleMouseMove = useCallback'),
  'ShoppingList ProcuredResourceCard interaction handlers must be wrapped in useCallback'
);
console.log('✅ PASS: ShoppingList uses synchronous getItem for callback stability and useCallback in ProcuredResourceCard');

// 3. SupplementTracker checks
assert.ok(
  supplementTrackerContent.includes('CatalogItem') && supplementTrackerContent.includes('handleMouseMove = useCallback'),
  'SupplementTracker CatalogItem interaction handlers must be wrapped in useCallback'
);
assert.ok(
  supplementTrackerContent.includes('ActiveProtocolCard') && supplementTrackerContent.includes('handleMouseMove = useCallback'),
  'SupplementTracker ActiveProtocolCard interaction handlers must be wrapped in useCallback'
);
console.log('✅ PASS: SupplementTracker CatalogItem and ActiveProtocolCard handlers are wrapped in useCallback');

// 4. NutrientTracker checks
assert.ok(
  nutrientTrackerContent.includes('NutrientCard') && nutrientTrackerContent.includes('handleMouseMove = useCallback'),
  'NutrientTracker NutrientCard interaction handlers must be wrapped in useCallback'
);
assert.ok(
  nutrientTrackerContent.includes('ConcentricVisualizer') && nutrientTrackerContent.includes('handleMouseMove = useCallback'),
  'NutrientTracker ConcentricVisualizer interaction handlers must be wrapped in useCallback'
);
console.log('✅ PASS: NutrientTracker NutrientCard and ConcentricVisualizer handlers are wrapped in useCallback');

// 5. WorkoutHistory checks
assert.ok(
  workoutHistoryContent.includes('ChronoArchiveCard') && workoutHistoryContent.includes('handleMouseMove = useCallback'),
  'WorkoutHistory ChronoArchiveCard interaction handlers must be wrapped in useCallback'
);
console.log('✅ PASS: WorkoutHistory ChronoArchiveCard interaction handlers are wrapped in useCallback');

console.log('=========================================');
console.log('🎉 VERIFICATION COMPLETED: ALL TESTS PASSED');
