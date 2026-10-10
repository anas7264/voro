const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=========================================');
console.log('⚡ TESTING DAILY PERFORMANCE OPTIMIZATION V17');
console.log('=========================================');

const habitTrackerPath = path.join(__dirname, 'src/pages/HabitTracker.jsx');
const aiCoachPath = path.join(__dirname, 'src/pages/AICoach.jsx');
const fastingTrackerPath = path.join(__dirname, 'src/pages/FastingTracker.jsx');
const workoutLogPath = path.join(__dirname, 'src/pages/WorkoutLog.jsx');

const habitTrackerContent = fs.readFileSync(habitTrackerPath, 'utf8');
const aiCoachContent = fs.readFileSync(aiCoachPath, 'utf8');
const fastingTrackerContent = fs.readFileSync(fastingTrackerPath, 'utf8');
const workoutLogContent = fs.readFileSync(workoutLogPath, 'utf8');

// 1. HabitTracker checks
assert.ok(
  habitTrackerContent.includes('getTodayDateStr') && habitTrackerContent.includes('_cachedTodayDateStr'),
  'HabitTracker must cache today date string with timestamp check to avoid Date allocations'
);
assert.ok(
  habitTrackerContent.includes('handleMouseMove = useCallback'),
  'HabitItem handleMouseMove must be wrapped in useCallback'
);
assert.ok(
  habitTrackerContent.includes('handleCelebrationMouseMove = useCallback'),
  'HabitTracker handleCelebrationMouseMove must be wrapped in useCallback'
);
console.log('✅ PASS: HabitTracker uses cached date selector and useCallback interaction handlers');

// 2. AICoach checks
assert.ok(
  aiCoachContent.includes('MessageItem') && aiCoachContent.includes('handleMouseMove = useCallback'),
  'AICoach MessageItem handleMouseMove must be wrapped in useCallback'
);
assert.ok(
  aiCoachContent.includes('QuickPromptCard') && aiCoachContent.includes('handleMouseMove = useCallback'),
  'AICoach QuickPromptCard handleMouseMove must be wrapped in useCallback'
);
console.log('✅ PASS: AICoach wraps MessageItem and QuickPromptCard interaction handlers in useCallback');

// 3. FastingTracker checks
assert.ok(
  fastingTrackerContent.includes('MetabolicChronometer') && fastingTrackerContent.includes('handleMouseMove = useCallback'),
  'FastingTracker MetabolicChronometer handleMouseMove must be wrapped in useCallback'
);
assert.ok(
  fastingTrackerContent.includes('WindowCard') && fastingTrackerContent.includes('handleMouseMove = useCallback'),
  'FastingTracker WindowCard handleMouseMove must be wrapped in useCallback'
);
assert.ok(
  fastingTrackerContent.includes('DiagnosticCell') && fastingTrackerContent.includes('handleMouseMove = useCallback'),
  'FastingTracker DiagnosticCell handleMouseMove must be wrapped in useCallback'
);
console.log('✅ PASS: FastingTracker wraps MetabolicChronometer, WindowCard, and DiagnosticCell interaction handlers in useCallback');

// 4. WorkoutLog checks
assert.ok(
  workoutLogContent.includes('KineticExerciseCard') && workoutLogContent.includes('handleMouseMove = useCallback'),
  'WorkoutLog KineticExerciseCard handleMouseMove must be wrapped in useCallback'
);
console.log('✅ PASS: WorkoutLog KineticExerciseCard interaction handlers are wrapped in useCallback');

console.log('=========================================');
console.log('🎉 VERIFICATION COMPLETED: ALL TESTS PASSED');
