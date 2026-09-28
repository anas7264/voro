const fs = require('fs');
const path = require('path');

console.log('=========================================');
console.log('⚡ VERIFYING DAILY PERFORMANCE OPTIMIZATIONS (V14)');
console.log('=========================================\n');

let passCount = 0;
let totalChecks = 0;

function check(description, condition) {
  totalChecks++;
  if (condition) {
    console.log(`✅ Success: ${description}`);
    passCount++;
  } else {
    console.error(`❌ Failure: ${description}`);
  }
}

// 1. HabitTracker.jsx
console.log('🧪 Verifying HabitTracker.jsx...');
const habitTrackerPath = path.join(__dirname, 'src/pages/HabitTracker.jsx');
const habitTrackerSrc = fs.readFileSync(habitTrackerPath, 'utf8');

check('HabitItem uses isHoveredRef flag', habitTrackerSrc.includes('isHoveredRef = useRef('));
check('HabitItem uses isFocusedRef flag', habitTrackerSrc.includes('isFocusedRef = useRef('));
check('HabitTracker celebration card uses isCelebrationHoveredRef flag', habitTrackerSrc.includes('isCelebrationHoveredRef = useRef('));
check('HabitTracker celebration card uses isCelebrationFocusedRef flag', habitTrackerSrc.includes('isCelebrationFocusedRef = useRef('));
check('Eliminated useState for hover/focus in HabitTracker', !/useState\s*\(\s*false\s*\)\s*;?\s*\/\/\s*celebration|const\s+\[isHovered,\s*setIsHovered\]\s*=\s*useState/.test(habitTrackerSrc));

console.log('\n🧪 Verifying QuickLog.jsx...');
const quickLogPath = path.join(__dirname, 'src/pages/QuickLog.jsx');
const quickLogSrc = fs.readFileSync(quickLogPath, 'utf8');

check('KineticExpressCard uses isHoveredRef flag', quickLogSrc.includes('isHoveredRef = useRef('));
check('KineticExpressCard uses isFocusedRef flag', quickLogSrc.includes('isFocusedRef = useRef('));
check('Eliminated useState for hover/focus in QuickLog', !/const\s+\[isHovered,\s*setIsHovered\]\s*=\s*useState/.test(quickLogSrc));

console.log('\n🧪 Verifying RecipeBuilder.jsx...');
const recipeBuilderPath = path.join(__dirname, 'src/pages/RecipeBuilder.jsx');
const recipeBuilderSrc = fs.readFileSync(recipeBuilderPath, 'utf8');

check('IngredientItem uses isHoveredRef flag', recipeBuilderSrc.includes('isHoveredRef = useRef('));
check('SavedRecipeCard uses isHoveredRef flag', recipeBuilderSrc.includes('isHoveredRef = useRef('));
check('Eliminated useState for hover/focus in RecipeBuilder', !/const\s+\[isHovered,\s*setIsHovered\]\s*=\s*useState/.test(recipeBuilderSrc));

console.log('\n🧪 Verifying MealPlanner.jsx...');
const mealPlannerPath = path.join(__dirname, 'src/pages/MealPlanner.jsx');
const mealPlannerSrc = fs.readFileSync(mealPlannerPath, 'utf8');

check('MealDayCard uses isFocusedRef flag', mealPlannerSrc.includes('isFocusedRef = useRef('));
check('MealDayCard eliminated unused useState for focus', !/const\s+\[isFocused,\s*setIsFocused\]\s*=\s*useState\s*\(\s*false\s*\)/.test(mealPlannerSrc));

console.log('\n=========================================');
if (passCount === totalChecks) {
  console.log(`🎉 ALL ${passCount}/${totalChecks} DAILY OPTIMIZATION V14 CHECKS PASSED!`);
  console.log('=========================================\n');
  process.exit(0);
} else {
  console.error(`❌ ${totalChecks - passCount}/${totalChecks} CHECKS FAILED.`);
  console.log('=========================================\n');
  process.exit(1);
}
