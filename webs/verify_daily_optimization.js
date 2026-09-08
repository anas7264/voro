// Verification Script for Daily Performance Optimization (2026-09-08)
import assert from 'node:assert';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('=========================================');
console.log('⚡ VERIFYING DAILY PERFORMANCE OPTIMIZATIONS');
console.log('=========================================');

// Test 1: Verify RecipeBuilder uses useStorageKeySelector
console.log('🧪 Test 1: Verifying RecipeBuilder surgical storage reactivity...');
const recipeBuilderCode = readFileSync(resolve(__dirname, 'src/pages/RecipeBuilder.jsx'), 'utf8');
assert.ok(recipeBuilderCode.includes("import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage'"), 'RecipeBuilder must import useStorageKeySelector');
assert.ok(recipeBuilderCode.includes("useStorageKeySelector('recipes', selectRecipes)"), 'RecipeBuilder must use useStorageKeySelector with selectRecipes');
assert.ok(!recipeBuilderCode.includes("useStorageKey('recipes')"), 'RecipeBuilder must NOT use broad useStorageKey');
console.log('✅ Success: RecipeBuilder uses surgical useStorageKeySelector!');

// Test 2: Verify useStreak uses useStorageKeySelector
console.log('🧪 Test 2: Verifying useStreak surgical storage reactivity...');
const useStreakCode = readFileSync(resolve(__dirname, 'src/hooks/useStreak.js'), 'utf8');
assert.ok(useStreakCode.includes("import { useStorageMethods, useStorageKeySelector } from \"./useStorage\""), 'useStreak must import useStorageKeySelector');
assert.ok(useStreakCode.includes("useStorageKeySelector(\"streak\", selectStreak)"), 'useStreak must use useStorageKeySelector with selectStreak');
assert.ok(!useStreakCode.includes("useStorageKey(\"streak\")"), 'useStreak must NOT use broad useStorageKey');
console.log('✅ Success: useStreak uses surgical useStorageKeySelector!');

// Test 3: Verify useGamification uses useStorageKeySelector
console.log('🧪 Test 3: Verifying useGamification surgical storage reactivity...');
const useGamificationCode = readFileSync(resolve(__dirname, 'src/hooks/useGamification.js'), 'utf8');
assert.ok(useGamificationCode.includes("import { useStorageMethods, useStorageKeySelector } from \"./useStorage\""), 'useGamification must import useStorageKeySelector');
assert.ok(useGamificationCode.includes("useStorageKeySelector(\"gamification\", selectGamification)"), 'useGamification must use useStorageKeySelector with selectGamification');
assert.ok(!useGamificationCode.includes("useStorageKey(\"gamification\")"), 'useGamification must NOT use broad useStorageKey');
console.log('✅ Success: useGamification uses surgical useStorageKeySelector!');

// Test 4: Verify Calculators hoisted tabs and forecast loop optimization
console.log('🧪 Test 4: Verifying Calculators hoisted static tab matrix and forecast loop...');
const calculatorsCode = readFileSync(resolve(__dirname, 'src/pages/Calculators.jsx'), 'utf8');
assert.ok(calculatorsCode.includes("CALCULATOR_TABS = Object.freeze"), 'Calculators must hoist and freeze CALCULATOR_TABS');
assert.ok(calculatorsCode.includes("tabs={CALCULATOR_TABS}"), 'Calculators must pass hoisted CALCULATOR_TABS to Tabs');
assert.ok(calculatorsCode.includes("weeklyFatLostKg = totalDeficitKcal / 7700"), 'Calculators must pre-compute weeklyFatLostKg outside forecast loop');
console.log('✅ Success: Calculators static tabs and forecast loop optimized!');

// Test 5: Verify QuickLog memoized tab components and hoisted tabs
console.log('🧪 Test 5: Verifying QuickLog memoized tab components and hoisted tabs...');
const quickLogCode = readFileSync(resolve(__dirname, 'src/pages/QuickLog.jsx'), 'utf8');
assert.ok(quickLogCode.includes("QUICK_LOG_TABS = Object.freeze"), 'QuickLog must hoist and freeze QUICK_LOG_TABS');
assert.ok(quickLogCode.includes("QuickLogNutritionTab = memo"), 'QuickLog must extract QuickLogNutritionTab');
assert.ok(quickLogCode.includes("QuickLogKineticTab = memo"), 'QuickLog must extract QuickLogKineticTab');
assert.ok(quickLogCode.includes("QuickLogHydrationTab = memo"), 'QuickLog must extract QuickLogHydrationTab');
console.log('✅ Success: QuickLog tab components extracted and memoized!');

// Test 6: Verify Reports surgical storage subscriptions
console.log('🧪 Test 6: Verifying Reports surgical storage subscriptions...');
const reportsCode = readFileSync(resolve(__dirname, 'src/pages/Reports.jsx'), 'utf8');
assert.ok(reportsCode.includes("import { useStorageMethods, useStorageKeySelector } from '@/hooks/useStorage'"), 'Reports must import useStorageKeySelector');
assert.ok(reportsCode.includes("useStorageKeySelector('workout_log', selectWorkoutLog)"), 'Reports must subscribe via useStorageKeySelector for workout_log');
assert.ok(reportsCode.includes("useStorageKeySelector('nutrition_log', selectNutritionLog)"), 'Reports must subscribe via useStorageKeySelector for nutrition_log');
assert.ok(reportsCode.includes("useStorageKeySelector('body_metrics', selectBodyMetrics)"), 'Reports must subscribe via useStorageKeySelector for body_metrics');
console.log('✅ Success: Reports uses surgical storage key selectors!');

console.log('=========================================');
console.log('🎉 ALL DAILY OPTIMIZATION VERIFICATIONS PASSED!');
console.log('=========================================');
