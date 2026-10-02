// VORO Daily Performance Verification Script v16
const fs = require('fs');
const path = require('path');

console.log('=========================================');
console.log('⚡ TESTING DAILY PERFORMANCE OPTIMIZATION V16');
console.log('=========================================');

let failed = false;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed = true;
  }
}

// Test 1: Verify useStorageKeySelector array key optimization in useStorage.js
const useStorageCode = fs.readFileSync(path.join(__dirname, 'src/hooks/useStorage.js'), 'utf8');
assert(
  useStorageCode.includes('if (Array.isArray(key)) {') &&
  useStorageCode.includes('if (storage.get(k) !== lastState[k])'),
  'useStorageKeySelector checks element-wise cached storage values for array keys'
);

// Test 2: Verify useGamification.js referential stability
const useGamificationCode = fs.readFileSync(path.join(__dirname, 'src/hooks/useGamification.js'), 'utf8');
assert(
  useGamificationCode.includes('const { getItem, setItem } = useStorageMethods();') &&
  useGamificationCode.includes('selectGamification(getItem("gamification"))') &&
  useGamificationCode.includes('}, [getItem, setItem]);'),
  'useGamification action callbacks use getItem for referential stability'
);

// Test 3: Verify useStreak.js referential stability
const useStreakCode = fs.readFileSync(path.join(__dirname, 'src/hooks/useStreak.js'), 'utf8');
assert(
  useStreakCode.includes('const currentData = selectStreak(getItem("streak"));') &&
  useStreakCode.includes('}, [getItem, setItem]);'),
  'useStreak markDayCompleted and resetStreak callbacks use getItem for referential stability'
);

// Test 4: Verify useChallenge.js referential stability
const useChallengeCode = fs.readFileSync(path.join(__dirname, 'src/hooks/useChallenge.js'), 'utf8');
assert(
  useChallengeCode.includes('const currentProgress = getItem("challengeProgress") || {};') &&
  useChallengeCode.includes('}, [getItem, setItem]);'),
  'useChallenge action callbacks use getItem for referential stability'
);

// Test 5: Verify Dashboard.jsx QuickLogModal memoization
const dashboardCode = fs.readFileSync(path.join(__dirname, 'src/pages/Dashboard.jsx'), 'utf8');
assert(
  dashboardCode.includes('const QuickLogModal = memo(({ isOpen, onClose, onSubmit }) =>') &&
  dashboardCode.includes('QuickLogModal.displayName = \'QuickLogModal\';'),
  'Dashboard.jsx QuickLogModal is wrapped in React.memo'
);

console.log('=========================================');
if (failed) {
  console.error('❌ VERIFICATION FAILED');
  process.exit(1);
} else {
  console.log('🎉 VERIFICATION COMPLETED: ALL TESTS PASSED');
}
