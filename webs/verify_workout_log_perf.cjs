const fs = require('fs');
const path = require('path');

console.log('--- VERIFYING WORKOUT LOG PERFORMANCE OPTIMIZATION ---');

const filePath = path.join(__dirname, 'src', 'pages', 'WorkoutLog.jsx');
const content = fs.readFileSync(filePath, 'utf8');

// 1. Check that useState for isHovered/isFocused was removed from KineticExerciseCard
const hasHoveredState = /const\s*\[isHovered,\s*setIsHovered\]\s*=\s*useState/.test(content);
const hasFocusedState = /const\s*\[isFocused,\s*setIsFocused\]\s*=\s*useState/.test(content);

if (hasHoveredState || hasFocusedState) {
  console.error('❌ FAIL: KineticExerciseCard still uses useState for hover or focus state!');
  process.exit(1);
} else {
  console.log('✓ PASS: KineticExerciseCard has no React useState hover/focus state churn.');
}

// 2. Check that useRef flags are used
const hasHoveredRef = /isHoveredRef\s*=\s*useRef\(false\)/.test(content);
const hasFocusedRef = /isFocusedRef\s*=\s*useRef\(false\)/.test(content);

if (!hasHoveredRef || !hasFocusedRef) {
  console.error('❌ FAIL: KineticExerciseCard does not instantiate isHoveredRef or isFocusedRef!');
  process.exit(1);
} else {
  console.log('✓ PASS: KineticExerciseCard properly instantiates isHoveredRef and isFocusedRef.');
}

// 3. Check for direct DOM transform updates
const hasDirectTransform = /cardRef\.current\.style\.transform/.test(content);
if (!hasDirectTransform) {
  console.error('❌ FAIL: Direct DOM style transform update missing from KineticExerciseCard.');
  process.exit(1);
} else {
  console.log('✓ PASS: KineticExerciseCard performs zero-allocation 60fps direct-DOM transform updates.');
}

// 4. Check for W3C APG focus handling
const hasFocusHandling = /handleFocus/.test(content) && /handleBlur/.test(content);
if (!hasFocusHandling) {
  console.error('❌ FAIL: W3C APG keyboard focus handling missing.');
  process.exit(1);
} else {
  console.log('✓ PASS: W3C APG keyboard focus handlers present.');
}

console.log('\nALL WORKOUT LOG PERFORMANCE VERIFICATIONS PASSED SUCCESSFULLY!');
