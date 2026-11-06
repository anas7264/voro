import {
  checkAchievementTrigger,
  getLevelFromXP,
  getRankTier,
  checkChallengeCompletion,
  getGamificationStats
} from './src/utils/gamification.js';

console.log("=========================================");
console.log("🎮 STARTING GAMIFICATION HARDENING V2 VERIFICATION");
console.log("=========================================\n");

let passed = true;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    passed = false;
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

// 1. checkAchievementTrigger: null, undefined, empty object, and string numerics
console.log("🧪 Test 1: Testing checkAchievementTrigger with null/undefined and string values...");
try {
  assert(checkAchievementTrigger("first_workout", null) === false, "checkAchievementTrigger handles null userData");
  assert(checkAchievementTrigger("first_workout", undefined) === false, "checkAchievementTrigger handles undefined userData");
  assert(checkAchievementTrigger("first_workout", {}) === false, "checkAchievementTrigger handles empty userData");
  assert(checkAchievementTrigger("first_workout", { totalWorkouts: "1" }) === true, "checkAchievementTrigger handles string numeric totalWorkouts");
  assert(checkAchievementTrigger("workout_streak_7", { currentStreak: "7" }) === true, "checkAchievementTrigger handles string currentStreak");
  assert(checkAchievementTrigger("weight_loss_5kg", { startingWeight: "85", currentWeight: "78" }) === true, "checkAchievementTrigger handles string weights");
  assert(checkAchievementTrigger("non_existent_trigger", { totalWorkouts: 1 }) === false, "checkAchievementTrigger returns false for unknown trigger");
} catch (e) {
  assert(false, `checkAchievementTrigger crashed: ${e.message}`);
}

// 2. getLevelFromXP: string numeric XP, zero, null, undefined, NaN
console.log("\n🧪 Test 2: Testing getLevelFromXP with string numeric inputs...");
try {
  const strLvl = getLevelFromXP("2500");
  assert(strLvl.level === 3 && strLvl.totalXP === 2500 && strLvl.progress === "50.0", "getLevelFromXP parses numeric strings");

  const strZero = getLevelFromXP("0");
  assert(strZero.level === 1 && strZero.totalXP === 0, "getLevelFromXP handles string zero");

  const invalidStr = getLevelFromXP("abc");
  assert(invalidStr.level === 1 && invalidStr.totalXP === 0, "getLevelFromXP handles invalid strings safely");
} catch (e) {
  assert(false, `getLevelFromXP crashed: ${e.message}`);
}

// 3. getRankTier: string numeric level, negative, NaN
console.log("\n🧪 Test 3: Testing getRankTier with string numeric inputs...");
try {
  const strRank1 = getRankTier("5");
  assert(strRank1.tier === "Athlete" && strRank1.level === 5, "getRankTier parses string level 5");

  const strRank2 = getRankTier("15");
  assert(strRank2.tier === "Champion" && strRank2.level === 15, "getRankTier parses string level 15");

  const strRank3 = getRankTier("35");
  assert(strRank3.tier === "Legend" && strRank3.level === 35, "getRankTier parses string level 35");

  const strRank4 = getRankTier("55");
  assert(strRank4.tier === "VORO Master" && strRank4.level === 55, "getRankTier parses string level 55");
} catch (e) {
  assert(false, `getRankTier crashed: ${e.message}`);
}

// 4. checkChallengeCompletion: string numeric user progress metrics
console.log("\n🧪 Test 4: Testing checkChallengeCompletion with string numeric progress...");
try {
  const chalWorkouts = checkChallengeCompletion({ criteria: "Complete 5 workouts" }, { workoutsThisPeriod: "5" });
  assert(chalWorkouts.isComplete === true && chalWorkouts.progress === 100, "checkChallengeCompletion parses string workouts");

  const chalNutrition = checkChallengeCompletion({ criteria: "Log 7 days nutrition" }, { nutritionDays: "7" });
  assert(chalNutrition.isComplete === true && chalNutrition.progress === 100, "checkChallengeCompletion parses string nutritionDays");

  const chalWater = checkChallengeCompletion({ criteria: "Drink 3 liters water" }, { waterLiters: "3" });
  assert(chalWater.isComplete === true && chalWater.progress === 100, "checkChallengeCompletion parses string waterLiters");

  const chalSteps = checkChallengeCompletion({ criteria: "Walk 10000 steps" }, { steps: "10000" });
  assert(chalSteps.isComplete === true && chalSteps.progress === 100, "checkChallengeCompletion parses string steps");
} catch (e) {
  assert(false, `checkChallengeCompletion crashed: ${e.message}`);
}

// 5. getGamificationStats: string totalXP
console.log("\n🧪 Test 5: Testing getGamificationStats with string totalXP...");
try {
  const stats = getGamificationStats({ totalXP: "3500" });
  assert(stats.level === 4 && stats.xp === 3500, "getGamificationStats parses string totalXP");
} catch (e) {
  assert(false, `getGamificationStats crashed: ${e.message}`);
}

console.log("\n=========================================");
if (passed) {
  console.log("🎉 ALL GAMIFICATION HARDENING V2 TESTS PASSED!");
  process.exit(0);
} else {
  console.error("💥 SOME GAMIFICATION HARDENING V2 TESTS FAILED!");
  process.exit(1);
}
