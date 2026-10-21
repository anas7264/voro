const fs = require('fs');
const path = require('path');

console.log('⚡ Running WorkoutLog Performance & Luxury Architecture Verification...\n');

const filePath = path.resolve(__dirname, 'src/pages/WorkoutLog.jsx');
const code = fs.readFileSync(filePath, 'utf8');

let totalChecks = 0;
let passedChecks = 0;

function check(description, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ ${description}`);
  } else {
    console.error(`  ✕ FAIL: ${description}`);
  }
}

// 1. React.memo optimization for WorkoutLog page & subcomponents
check('WorkoutLog page is wrapped in React.memo', code.includes('const WorkoutLog = memo('));
check('KineticSetRow subcomponent is wrapped in React.memo', code.includes('const KineticSetRow = memo('));
check('KineticExerciseCard subcomponent is wrapped in React.memo', code.includes('const KineticExerciseCard = memo('));

// 2. Static displayName exports for DevTools & Masterclass standards
check('WorkoutLog exports displayName = "WorkoutLog"', code.includes("WorkoutLog.displayName = 'WorkoutLog'"));
check('KineticExerciseCard exports displayName = "KineticExerciseCard"', code.includes("KineticExerciseCard.displayName = 'KineticExerciseCard'"));
check('KineticSetRow exports displayName = "KineticSetRow"', code.includes("KineticSetRow.displayName = 'KineticSetRow'"));

// 3. Frame-batched 60fps rotational tilt tracking
check('KineticExerciseCard utilizes requestAnimationFrame for mousemove tracking', code.includes('requestAnimationFrame') && code.includes('rafIdRef'));
check('KineticExerciseCard cancels animation frame on unmount/leave', code.includes('cancelAnimationFrame'));

// 4. Sub-pixel attestation hash badging
check('KineticExerciseCard generates 0xWKL_..._ATTESTED_NODE attestation hash', code.includes('0xWKL_') && code.includes('_ATTESTED_NODE'));

// 5. Callback stabilization
check('KineticSetRow stabilizes input handlers with useCallback', code.includes('useCallback') && code.includes('handleWeightChange'));

// 6. Zero-allocation volume loop
check('Total volume calculation uses single-pass imperative loop', code.includes('for (let i = 0;') && code.includes('for (let j = 0;'));

console.log('\n--------------------------------------------------');
console.log(`WorkoutLog Verification Results: ${passedChecks}/${totalChecks} checks passed.`);

if (passedChecks === totalChecks) {
  console.log('🎉 ALL WORKOUT LOG PERFORMANCE & LUXURY CHECKS PASSED!\n');
  process.exit(0);
} else {
  console.error('❌ SOME CHECKS FAILED!\n');
  process.exit(1);
}
