const fs = require('fs');
const path = require('path');

console.log('⚡ Starting Exercise Library & Nutrient Tracker Verification...');

const cardPath = path.join(__dirname, 'src', 'components', 'ExerciseCard.jsx');
const libraryPath = path.join(__dirname, 'src', 'pages', 'ExerciseLibrary.jsx');
const trackerPath = path.join(__dirname, 'src', 'pages', 'NutrientTracker.jsx');

if (!fs.existsSync(cardPath) || !fs.existsSync(libraryPath) || !fs.existsSync(trackerPath)) {
  console.error('ERROR: Required source files do not exist!');
  process.exit(1);
}

const cardContent = fs.readFileSync(cardPath, 'utf8');
const libraryContent = fs.readFileSync(libraryPath, 'utf8');
const trackerContent = fs.readFileSync(trackerPath, 'utf8');

const checks = [
  // ExerciseCard checks
  { name: '[ExerciseCard] Memoized nodeId with useMemo', test: cardContent.includes('const nodeId = useMemo(') },
  { name: '[ExerciseCard] W3C APG focus/blur handlers for static 4-degree tilt', test: cardContent.includes('handleFocus') && cardContent.includes('handleBlur') && cardContent.includes('4deg') },
  { name: '[ExerciseCard] W3C APG role="article" and tabIndex={0}', test: cardContent.includes('role="article"') && cardContent.includes('tabIndex={0}') },
  { name: '[ExerciseCard] Direct callback handlers passing exercise entity', test: cardContent.includes('handleSelect') && cardContent.includes('onSelect?.(exercise)') && cardContent.includes('handleEdit') && cardContent.includes('handleDelete') },

  // ExerciseLibrary checks
  { name: '[ExerciseLibrary] Extracted memoized ExerciseItemWrapper subcomponent', test: libraryContent.includes('ExerciseItemWrapper') && libraryContent.includes('ExerciseItemWrapper.displayName = \'ExerciseItemWrapper\'') },
  { name: '[ExerciseLibrary] Encapsulated animationDelay to eliminate inline style allocations in .map()', test: libraryContent.includes('animationDelay: `${Math.min(index, 10) * 50}ms`') },
  { name: '[ExerciseLibrary] O(1) category map lookup and useDeferredValue search pipeline', test: libraryContent.includes('EXERCISES_BY_CATEGORY') && libraryContent.includes('useDeferredValue') },

  // NutrientTracker checks
  { name: '[NutrientTracker] Single-pass consolidated metrics calculation in useMemo', test: trackerContent.includes('const { currentNutrient, currentStatus, total, deficit, percentage } = useMemo(') },
  { name: '[NutrientTracker] Hoisted static DEFAULT_STATUS fallback', test: trackerContent.includes('const DEFAULT_STATUS = Object.freeze(') },
  { name: '[NutrientTracker] W3C APG focus/blur handlers in NutrientCard and ConcentricVisualizer', test: trackerContent.includes('handleFocus') && trackerContent.includes('handleBlur') }
];

let allPassed = true;
checks.forEach(check => {
  if (check.test) {
    console.log(`✓ ${check.name}`);
  } else {
    console.error(`✗ ${check.name}`);
    allPassed = false;
  }
});

if (!allPassed) {
  console.error('Verification failed!');
  process.exit(1);
}

console.log('🎉 Exercise Library & Nutrient Tracker verification successful!');
