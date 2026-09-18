const fs = require('fs');
const path = require('path');

console.log('⚡ Starting Daily Perf V8 Verification Audit...');

const foodLibraryPath = path.join(__dirname, 'src/pages/FoodLibrary.jsx');
const dailyStreakPath = path.join(__dirname, 'src/pages/DailyStreak.jsx');
const workoutHistoryPath = path.join(__dirname, 'src/pages/WorkoutHistory.jsx');

const foodLibraryCode = fs.readFileSync(foodLibraryPath, 'utf8');
const dailyStreakCode = fs.readFileSync(dailyStreakPath, 'utf8');
const workoutHistoryCode = fs.readFileSync(workoutHistoryPath, 'utf8');

let errors = 0;

// 1. FoodLibrary Audit
if (foodLibraryCode.includes('useState(false)') && foodLibraryCode.includes('isHovered')) {
  console.error('❌ FoodLibrary.jsx still contains useState for isHovered!');
  errors++;
} else {
  console.log('✅ FoodLibrary.jsx: Hover/focus useState removed successfully.');
}

if (!foodLibraryCode.includes('isHoveredRef') || !foodLibraryCode.includes('isFocusedRef')) {
  console.error('❌ FoodLibrary.jsx does not use isHoveredRef / isFocusedRef!');
  errors++;
} else {
  console.log('✅ FoodLibrary.jsx: Uses isHoveredRef and isFocusedRef.');
}

// 2. DailyStreak Audit
if (dailyStreakCode.includes('const [chartHovered') || dailyStreakCode.includes('const [isHovered, setIsHovered]')) {
  console.error('❌ DailyStreak.jsx still contains useState for chartHovered or isHovered!');
  errors++;
} else {
  console.log('✅ DailyStreak.jsx: Hover/focus useState removed successfully.');
}

if (!dailyStreakCode.includes('chartHoveredRef') || !dailyStreakCode.includes('isHoveredRef')) {
  console.error('❌ DailyStreak.jsx does not use chartHoveredRef or isHoveredRef!');
  errors++;
} else {
  console.log('✅ DailyStreak.jsx: Uses chartHoveredRef and isHoveredRef.');
}

// 3. WorkoutHistory Audit
if (workoutHistoryCode.includes('const [isHovered, setIsHovered]')) {
  console.error('❌ WorkoutHistory.jsx still contains useState for isHovered!');
  errors++;
} else {
  console.log('✅ WorkoutHistory.jsx: Hover/focus useState removed successfully.');
}

if (!workoutHistoryCode.includes('isHoveredRef') || !workoutHistoryCode.includes('isFocusedRef')) {
  console.error('❌ WorkoutHistory.jsx does not use isHoveredRef / isFocusedRef!');
  errors++;
} else {
  console.log('✅ WorkoutHistory.jsx: Uses isHoveredRef and isFocusedRef.');
}

if (errors > 0) {
  console.error(`\n❌ VERIFICATION FAILED with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log('\n🎉 ALL DAILY PERF V8 VERIFICATIONS PASSED SUCCESSFULLY!');
}
