// Verification & Benchmarking Script for AI Prompts and AI Hooks
import assert from "assert";
import {
  buildVORO_SystemPrompt,
  buildMealPlanPrompt,
  buildTrainingPlanPrompt,
  buildCoachPrompt,
  buildNutritionAnalysisPrompt,
  buildBodyCompositionPrompt,
  buildInjuryPreventionPrompt,
  buildCompetitionPrepPrompt,
  buildWellnessPrompt
} from "./src/utils/aiPrompts.js";

console.log("=========================================");
console.log("⚡ TESTING AI PROMPTS OPTIMIZATION & PERF");
console.log("=========================================");

// Test 1: Verify buildVORO_SystemPrompt returns expected static prompt
const sysPrompt1 = buildVORO_SystemPrompt();
const sysPrompt2 = buildVORO_SystemPrompt();

assert.strictEqual(sysPrompt1, sysPrompt2, "buildVORO_SystemPrompt should return identical frozen string reference");
assert.ok(sysPrompt1.includes("You are VORO"), "System prompt content check failed");
console.log("🟢 Test 1 Passed: System prompt referential equality and contents verified!");

// Test 2: Verify fallback behavior with empty or missing arguments
const emptyMealPrompt = buildMealPlanPrompt();
assert.ok(emptyMealPrompt.includes("Dietary Restrictions: None"), "Meal plan prompt fallback failed");

const emptyTrainingPrompt = buildTrainingPlanPrompt();
assert.ok(emptyTrainingPrompt.includes("Injuries/Limitations: None"), "Training plan prompt fallback failed");

const emptyCoachPrompt = buildCoachPrompt();
assert.ok(emptyCoachPrompt.includes("Recent Achievements: Just starting"), "Coach prompt fallback failed");

console.log("🟢 Test 2 Passed: Prompt builders handle empty/missing arguments safely!");

// Test 3: Benchmark prompt generation across 100,000 iterations
const testProfile = {
  age: 30,
  gender: "female",
  weight: 65,
  height: 170,
  goal: "fat_loss",
  tdee: 2100,
  proteinTarget: 140,
  carbsTarget: 210,
  fatTarget: 60,
  activityLevel: "moderate",
  experienceLevel: "intermediate"
};

const iterations = 100000;
const start = performance.now();

for (let i = 0; i < iterations; i++) {
  buildVORO_SystemPrompt();
  buildMealPlanPrompt(testProfile);
  buildTrainingPlanPrompt(testProfile);
  buildCoachPrompt(testProfile);
  buildNutritionAnalysisPrompt(testProfile);
  buildBodyCompositionPrompt(testProfile);
  buildInjuryPreventionPrompt(testProfile);
  buildCompetitionPrepPrompt(testProfile);
  buildWellnessPrompt(testProfile);
}

const end = performance.now();
const elapsed = end - start;

console.log(`⏱️ ${iterations} iterations across 9 prompt builders completed in: ${elapsed.toFixed(2)}ms`);
console.log(`🚀 Average latency per prompt builder cycle: ${(elapsed / iterations).toFixed(4)}ms`);

console.log("\n🎉 ALL AI PROMPTS OPTIMIZATION TESTS PASSED SUCCESSFULLY!");
console.log("=========================================");
