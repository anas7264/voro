import {
  validateWorkoutEntry,
  validateNutritionEntry,
  validateRecipe,
  validateFoodDiaryEntry,
  validateHabit,
  validateWaterEntry,
  validateVitals,
  isValidWaterAmount
} from './src/utils/validators.js';

console.log("=========================================");
console.log("🧪 RUNNING SECURITY VERIFICATION: ENTRY VALIDATORS HARDENING");
console.log("=========================================");

// 1. Test validateWorkoutEntry optional fields
console.log("🛡️ Test 1: Testing validateWorkoutEntry optional notes and duration bounds...");
const validWorkout = {
  date: "2026-06-15",
  exercises: [{ name: "Bench Press", sets: [{ reps: 10, weight: 80 }] }],
  notes: "Felt strong during top set.",
  duration: 1800
};
const validWorkoutResult = validateWorkoutEntry(validWorkout);
if (!validWorkoutResult.valid) {
  throw new Error("❌ Test 1 Failed: Valid workout entry rejected! " + JSON.stringify(validWorkoutResult.errors));
}

const overlongWorkoutNotes = { ...validWorkout, notes: "a".repeat(2049) };
if (validateWorkoutEntry(overlongWorkoutNotes).valid) {
  throw new Error("❌ Test 1 Failed: Overlong workout notes (>2048 chars) passed validation!");
}

const invalidWorkoutDuration = { ...validWorkout, duration: 99999 };
if (validateWorkoutEntry(invalidWorkoutDuration).valid) {
  throw new Error("❌ Test 1 Failed: Invalid workout duration (>3600s) passed validation!");
}
console.log("✅ Success: validateWorkoutEntry optional notes and duration bounds verified!");

// 2. Test validateNutritionEntry optional notes
console.log("🛡️ Test 2: Testing validateNutritionEntry optional notes bounds...");
const validNutrition = {
  date: "2026-06-15",
  food: "Chicken Breast & Rice",
  calories: 650,
  protein: 50,
  carbs: 60,
  fat: 10,
  mealType: "lunch",
  notes: "Post-workout meal"
};
const validNutritionResult = validateNutritionEntry(validNutrition);
if (!validNutritionResult.valid) {
  throw new Error("❌ Test 2 Failed: Valid nutrition entry rejected! " + JSON.stringify(validNutritionResult.errors));
}

const overlongNutritionNotes = { ...validNutrition, notes: "b".repeat(2049) };
if (validateNutritionEntry(overlongNutritionNotes).valid) {
  throw new Error("❌ Test 2 Failed: Overlong nutrition notes (>2048 chars) passed validation!");
}

const nonStringNutritionNotes = { ...validNutrition, notes: { malicious: "object" } };
if (validateNutritionEntry(nonStringNutritionNotes).valid) {
  throw new Error("❌ Test 2 Failed: Non-string nutrition notes passed validation!");
}
console.log("✅ Success: validateNutritionEntry optional notes bounds verified!");

// 3. Test validateRecipe optional instructions, notes, and servings
console.log("🛡️ Test 3: Testing validateRecipe optional instructions, notes, and servings bounds...");
const validRecipe = {
  name: "Anabolic Oatmeal",
  ingredients: [{ name: "Oats", portion: 100 }],
  instructions: "1. Boil water. 2. Add oats. 3. Stir.",
  notes: "Great for breakfast",
  servings: 2
};
const validRecipeResult = validateRecipe(validRecipe);
if (!validRecipeResult.valid) {
  throw new Error("❌ Test 3 Failed: Valid recipe rejected! " + JSON.stringify(validRecipeResult.errors));
}

const overlongInstructions = { ...validRecipe, instructions: "c".repeat(4097) };
if (validateRecipe(overlongInstructions).valid) {
  throw new Error("❌ Test 3 Failed: Overlong instructions (>4096 chars) passed validation!");
}

const invalidServings = { ...validRecipe, servings: -5 };
if (validateRecipe(invalidServings).valid) {
  throw new Error("❌ Test 3 Failed: Negative servings passed validation!");
}

const nonFiniteServings = { ...validRecipe, servings: NaN };
if (validateRecipe(nonFiniteServings).valid) {
  throw new Error("❌ Test 3 Failed: NaN servings passed validation!");
}
console.log("✅ Success: validateRecipe optional fields verified!");

// 4. Test validateFoodDiaryEntry optional food and notes
console.log("🛡️ Test 4: Testing validateFoodDiaryEntry optional food and notes bounds...");
const validFoodDiary = {
  portion: 200,
  food: "Greek Yogurt",
  notes: "Added honey"
};
const validFoodDiaryResult = validateFoodDiaryEntry(validFoodDiary);
if (!validFoodDiaryResult.valid) {
  throw new Error("❌ Test 4 Failed: Valid food diary entry rejected! " + JSON.stringify(validFoodDiaryResult.errors));
}

const overlongFoodName = { ...validFoodDiary, food: "d".repeat(101) };
if (validateFoodDiaryEntry(overlongFoodName).valid) {
  throw new Error("❌ Test 4 Failed: Overlong food name (>100 chars) passed validation!");
}

const overlongFoodNotes = { ...validFoodDiary, notes: "e".repeat(2049) };
if (validateFoodDiaryEntry(overlongFoodNotes).valid) {
  throw new Error("❌ Test 4 Failed: Overlong food diary notes (>2048 chars) passed validation!");
}
console.log("✅ Success: validateFoodDiaryEntry optional fields verified!");

// 5. Test validateHabit optional description and notes
console.log("🛡️ Test 5: Testing validateHabit optional description and notes bounds...");
const validHabit = {
  name: "Daily Reading",
  icon: "📚",
  color: "voro-primary",
  description: "Read 20 pages",
  notes: "Focus on non-fiction"
};
const validHabitResult = validateHabit(validHabit);
if (!validHabitResult.valid) {
  throw new Error("❌ Test 5 Failed: Valid habit entry rejected! " + JSON.stringify(validHabitResult.errors));
}

const overlongHabitDesc = { ...validHabit, description: "f".repeat(2049) };
if (validateHabit(overlongHabitDesc).valid) {
  throw new Error("❌ Test 5 Failed: Overlong habit description (>2048 chars) passed validation!");
}

const nonStringHabitNotes = { ...validHabit, notes: 12345 };
if (validateHabit(nonStringHabitNotes).valid) {
  throw new Error("❌ Test 5 Failed: Non-string habit notes passed validation!");
}
console.log("✅ Success: validateHabit optional fields verified!");

// 6. Test validateWaterEntry optional notes
console.log("🛡️ Test 6: Testing validateWaterEntry optional notes bounds...");
const validWater = {
  amount: 500,
  date: "2026-06-15",
  notes: "Cold filtered water"
};
const validWaterResult = validateWaterEntry(validWater);
if (!validWaterResult.valid) {
  throw new Error("❌ Test 6 Failed: Valid water entry rejected! " + JSON.stringify(validWaterResult.errors));
}

const overlongWaterNotes = { ...validWater, notes: "g".repeat(2049) };
if (validateWaterEntry(overlongWaterNotes).valid) {
  throw new Error("❌ Test 6 Failed: Overlong water notes (>2048 chars) passed validation!");
}

const nonStringWaterNotes = { ...validWater, notes: [1, 2, 3] };
if (validateWaterEntry(nonStringWaterNotes).valid) {
  throw new Error("❌ Test 6 Failed: Non-string water notes passed validation!");
}
console.log("✅ Success: validateWaterEntry optional fields verified!");

// 7. Test strict numeric validation hardening against trailing string injections and scientific notation
console.log("🛡️ Test 7: Testing strict numeric validation against trailing string injections and scientific notation...");
if (validateFoodDiaryEntry({ portion: "200<script>" }).valid) {
  throw new Error("❌ Test 7 Failed: Trailing string injection in food portion passed validation!");
}

if (validateFoodDiaryEntry({ portion: "1e3" }).valid) {
  throw new Error("❌ Test 7 Failed: Scientific notation in food portion passed validation!");
}

if (validateVitals({ heartRate: 70, sleep: "8<script>", mood: 7, energy: 8 }).valid) {
  throw new Error("❌ Test 7 Failed: Trailing string injection in vitals sleep passed validation!");
}

if (validateVitals({ heartRate: 70, sleep: 8, mood: 7, energy: 8, glucose: "100mg/dL" }).valid) {
  throw new Error("❌ Test 7 Failed: Trailing string injection in vitals glucose passed validation!");
}

if (validateRecipe({ name: "Oatmeal", ingredients: [{ name: "Oats", portion: "100<script>" }] }).valid) {
  throw new Error("❌ Test 7 Failed: Trailing string injection in recipe portion passed validation!");
}

if (validateRecipe({ name: "Oatmeal", ingredients: [{ name: "Oats", portion: 100 }], servings: "2servings" }).valid) {
  throw new Error("❌ Test 7 Failed: Trailing string injection in recipe servings passed validation!");
}

if (isValidWaterAmount("500ml") || isValidWaterAmount("1e3")) {
  throw new Error("❌ Test 7 Failed: Trailing string injection or scientific notation passed isValidWaterAmount!");
}
console.log("✅ Success: Strict numeric validation against trailing string injections and scientific notation verified!");

console.log("\n🎉 ALL ENTRY VALIDATION SECURITY HARDENING TESTS PASSED SUCCESSFULLY!");
console.log("=========================================");
