import {
  validateWorkoutEntry,
  validateNutritionEntry,
  validateRecipe,
  validateFoodDiaryEntry
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

console.log("\n🎉 ALL ENTRY VALIDATION SECURITY HARDENING TESTS PASSED SUCCESSFULLY!");
console.log("=========================================");
