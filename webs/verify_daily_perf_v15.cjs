const fs = require('fs');
const path = require('path');

console.log('=========================================');
console.log('⚡ TESTING DAILY PERFORMANCE OPTIMIZATION V15');
console.log('=========================================');

let testsPassed = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Verify FastingTracker optimizations
const fastingTrackerPath = path.join(__dirname, 'src/pages/FastingTracker.jsx');
const fastingContent = fs.readFileSync(fastingTrackerPath, 'utf8');

assert(
  fastingContent.includes('const handleWindowChange = useCallback('),
  'FastingTracker: handleWindowChange is memoized with useCallback'
);
assert(
  fastingContent.includes('onSelect={handleWindowChange}') && !fastingContent.includes('onClick={() => handleWindowChange(option.id)}'),
  'FastingTracker: WindowCard uses onSelect prop with stable handleWindowChange delegate'
);
assert(
  fastingContent.includes('Math.floor(elapsed / 10)'),
  'FastingTracker: simulatedMeasures quantized to 10s steps to prevent redundant 1s tick object re-allocations'
);

// 2. Verify WorkoutHistory optimizations
const workoutHistoryPath = path.join(__dirname, 'src/pages/WorkoutHistory.jsx');
const workoutContent = fs.readFileSync(workoutHistoryPath, 'utf8');

assert(
  workoutContent.includes('const [expandedDate, setExpandedDate] = useState(null);'),
  'WorkoutHistory: uses expandedDate key state instead of expandedIdx array index'
);
assert(
  workoutContent.includes('onToggle(workout.date)'),
  'WorkoutHistory: ChronoArchiveCard toggles by unique workout.date key'
);

// 3. Verify AICoach optimizations
const aiCoachPath = path.join(__dirname, 'src/pages/AICoach.jsx');
const aiCoachContent = fs.readFileSync(aiCoachPath, 'utf8');

assert(
  aiCoachContent.includes('const handleSendMessage = useCallback('),
  'AICoach: handleSendMessage is memoized with useCallback'
);
assert(
  aiCoachContent.includes('onSelect={handleSendMessage}') && !aiCoachContent.includes('onClick={() => handleSendMessage(prompt)}'),
  'AICoach: QuickPromptCard uses onSelect prop with stable handleSendMessage delegate'
);
assert(
  aiCoachContent.includes("new CachedDateTimeFormat('en-US'"),
  'AICoach: uses CachedDateTimeFormat for zero-allocation time formatting'
);

// 4. Verify FoodDiary optimizations
const foodDiaryPath = path.join(__dirname, 'src/pages/FoodDiary.jsx');
const foodDiaryContent = fs.readFileSync(foodDiaryPath, 'utf8');

assert(
  foodDiaryContent.includes('const handleSearchClick = useCallback('),
  'FoodDiary: KineticMealSlotCard handleSearchClick is memoized with useCallback'
);
assert(
  foodDiaryContent.includes('nutritionLog.totals.protein, nutritionLog.totals.carbs, nutritionLog.totals.fat'),
  'FoodDiary: macroConfigs relies on primitive macro total dependencies'
);

console.log('=========================================');
console.log(`🎉 VERIFICATION COMPLETED: ${testsPassed}/${totalTests} TESTS PASSED`);
console.log('=========================================');
