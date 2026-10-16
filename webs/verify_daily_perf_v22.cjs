const fs = require('fs');
const path = require('path');

console.log("⚡ STARTING PERFORMANCE VERIFICATION SUITE [v22]...\n");

let errors = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✕ FAIL: ${message}`);
    errors++;
  }
}

// -------------------------------------------------------------
// Test 1: MealPrepPlanner.jsx Optimization Verification
// -------------------------------------------------------------
console.log("🔍 Test 1: Verifying MealPrepPlanner.jsx single-source-of-truth reactivity & callback stability...");
const mealPrepPath = path.join(__dirname, 'src/pages/MealPrepPlanner.jsx');
const mealPrepContent = fs.readFileSync(mealPrepPath, 'utf8');

assert(!mealPrepContent.includes('optimisticPrepPlan'), 'MealPrepPlanner.jsx eliminates redundant optimisticPrepPlan state.');
assert(!mealPrepContent.includes('optimisticProvisions'), 'MealPrepPlanner.jsx eliminates redundant optimisticProvisions state.');
assert(!mealPrepContent.includes('setOptimisticPrepPlan(null)'), 'MealPrepPlanner.jsx eliminates redundant useEffect state resetting hooks.');
assert(mealPrepContent.includes("getItem('meal_prep')"), 'MealPrepPlanner.jsx reads storage synchronously via getItem in callback handlers.');
assert(!mealPrepContent.includes('[activeProvisions, updateItem'), 'toggleProvision callback does not re-create on activeProvisions array changes.');
assert(!mealPrepContent.includes('[activePrepPlan, updateItem'), 'handleDeleteSession callback does not re-create on activePrepPlan array changes.');

// -------------------------------------------------------------
// Test 2: MealPlanner.jsx Optimization Verification
// -------------------------------------------------------------
console.log("\n🔍 Test 2: Verifying MealPlanner.jsx selector hoisting & callback stabilization...");
const mealPlannerPath = path.join(__dirname, 'src/pages/MealPlanner.jsx');
const mealPlannerContent = fs.readFileSync(mealPlannerPath, 'utf8');

assert(mealPlannerContent.includes('const selectSavedMealPlans ='), 'MealPlanner.jsx defines selectSavedMealPlans at module scope.');
assert(mealPlannerContent.includes('const shallowArrayEqual ='), 'MealPlanner.jsx defines shallowArrayEqual at module scope.');
assert(mealPlannerContent.includes('selectSavedMealPlans,\n    shallowArrayEqual'), 'MealPlanner.jsx passes hoisted selectSavedMealPlans and shallowArrayEqual to useStorageKeySelector.');
assert(mealPlannerContent.includes("getItem('plans')"), 'MealPlanner.jsx savePlan reads storage synchronously via getItem.');
assert(!mealPlannerContent.includes('[savedMealPlans, mealPlan'), 'savePlan callback does not re-create on savedMealPlans array changes.');

// -------------------------------------------------------------
// Test 3: TrainingPlan.jsx Optimization Verification
// -------------------------------------------------------------
console.log("\n🔍 Test 3: Verifying TrainingPlan.jsx currentPlan selector narrowing...");
const trainingPlanPath = path.join(__dirname, 'src/pages/TrainingPlan.jsx');
const trainingPlanContent = fs.readFileSync(trainingPlanPath, 'utf8');

assert(trainingPlanContent.includes('const selectCurrentPlan ='), 'TrainingPlan.jsx defines selectCurrentPlan at module scope.');
assert(trainingPlanContent.includes("useStorageKeySelector('plans', selectCurrentPlan)"), 'TrainingPlan.jsx subscribes strictly to selectCurrentPlan slice.');
assert(!trainingPlanContent.includes('plansData.currentPlan'), 'TrainingPlan.jsx eliminates redundant plansData intermediate wrapper.');

// -------------------------------------------------------------
// Test 4: DailyStreak.jsx Optimization Verification
// -------------------------------------------------------------
console.log("\n🔍 Test 4: Verifying DailyStreak.jsx module-scoped selector...");
const dailyStreakPath = path.join(__dirname, 'src/pages/DailyStreak.jsx');
const dailyStreakContent = fs.readFileSync(dailyStreakPath, 'utf8');

assert(dailyStreakContent.includes('const selectStreaks ='), 'DailyStreak.jsx defines selectStreaks at module scope.');
assert(dailyStreakContent.includes("useStorageKeySelector('voro_streaks', selectStreaks)"), 'DailyStreak.jsx uses module-scoped selectStreaks function.');

// -------------------------------------------------------------
// Test 5: FoodJournal.jsx Optimization Verification
// -------------------------------------------------------------
console.log("\n🔍 Test 5: Verifying FoodJournal.jsx callback referential stability...");
const foodJournalPath = path.join(__dirname, 'src/pages/FoodJournal.jsx');
const foodJournalContent = fs.readFileSync(foodJournalPath, 'utf8');

assert(foodJournalContent.includes("getItem('food_journal')"), 'FoodJournal.jsx reads storage synchronously via getItem.');
assert(foodJournalContent.includes('}, [getItem, setItem, addNotification]);'), 'handleDeleteEntry maintains referential stability with stable dependencies.');
assert(!foodJournalContent.includes('}, [entries, setItem'), 'handleDeleteEntry callback eliminates volatile entries array dependency.');

console.log("\n-------------------------------------------------------------");
if (errors === 0) {
  console.log("✅ ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!");
  process.exit(0);
} else {
  console.error(`❌ VERIFICATION FAILED WITH ${errors} ERROR(S).`);
  process.exit(1);
}
