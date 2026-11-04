// Regression Test Suite: Gamification Defensive Hardening & Boundary Reliability
import * as gamification from "./src/utils/gamification.js";

console.log("=========================================");
console.log("🎮 STARTING GAMIFICATION HARDENING VERIFICATION");
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

// 1. checkChallengeCompletion robustness
console.log("🧪 Test 1: checkChallengeCompletion defensive handling...");
try {
  const resNullChallenge = gamification.checkChallengeCompletion(null, {});
  assert(
    resNullChallenge && resNullChallenge.isComplete === false && resNullChallenge.progress === 0,
    "checkChallengeCompletion handles null challenge without crashing"
  );
} catch (e) {
  assert(false, `checkChallengeCompletion crashed on null challenge: ${e.message}`);
}

try {
  const resUndefinedCriteria = gamification.checkChallengeCompletion({}, {});
  assert(
    resUndefinedCriteria && resUndefinedCriteria.isComplete === false && resUndefinedCriteria.progress === 0,
    "checkChallengeCompletion handles missing criteria without crashing"
  );
} catch (e) {
  assert(false, `checkChallengeCompletion crashed on missing criteria: ${e.message}`);
}

try {
  const challenge = { criteria: "Complete 5+ workouts", xpReward: 100, timeRemaining: 3600 };
  const resNullProgress = gamification.checkChallengeCompletion(challenge, null);
  assert(
    resNullProgress && resNullProgress.isComplete === false && resNullProgress.progress === 0 && resNullProgress.xpReward === 100,
    "checkChallengeCompletion handles null userProgress without crashing"
  );

  const resEmptyProgress = gamification.checkChallengeCompletion(challenge, {});
  assert(
    resEmptyProgress && resEmptyProgress.isComplete === false && resEmptyProgress.progress === 0,
    "checkChallengeCompletion handles empty userProgress object without NaN progress"
  );

  const resValidProgress = gamification.checkChallengeCompletion(challenge, { workoutsThisPeriod: 5 });
  assert(
    resValidProgress && resValidProgress.isComplete === true && resValidProgress.progress === 100,
    "checkChallengeCompletion accurately computes valid progress and completion"
  );
} catch (e) {
  assert(false, `checkChallengeCompletion crashed on progress evaluation: ${e.message}`);
}

// 2. getGamificationStats robustness
console.log("\n🧪 Test 2: getGamificationStats defensive handling...");
try {
  const statsNull = gamification.getGamificationStats(null);
  assert(
    statsNull && statsNull.level === 1 && statsNull.xp === 0 && statsNull.achievements === 0,
    "getGamificationStats handles null userData without crashing"
  );

  const statsEmpty = gamification.getGamificationStats({});
  assert(
    statsEmpty && statsEmpty.level === 1 && statsEmpty.xp === 0 && statsEmpty.rank === "Novice",
    "getGamificationStats handles empty userData object without crashing"
  );

  const statsValid = gamification.getGamificationStats({
    totalXP: 2500,
    achievements: [{ id: "first_workout", rarity: "rare" }],
    completedWorkoutDates: ["2026-06-01", "2026-06-02"]
  });
  assert(
    statsValid && statsValid.level === 3 && statsValid.xp === 2500 && statsValid.achievements === 1,
    "getGamificationStats properly computes statistics for populated userData"
  );
} catch (e) {
  assert(false, `getGamificationStats crashed: ${e.message}`);
}

// 3. getLevelFromXP & getRankTier numeric bounds
console.log("\n🧪 Test 3: getLevelFromXP & getRankTier numeric boundary handling...");
try {
  const lvlNaN = gamification.getLevelFromXP(NaN);
  assert(lvlNaN.level === 1 && lvlNaN.progress === "0.0", "getLevelFromXP handles NaN totalXP safely");

  const lvlNegative = gamification.getLevelFromXP(-100);
  assert(lvlNegative.level === 1 && lvlNegative.progress === "0.0", "getLevelFromXP handles negative totalXP safely");

  const lvlUndefined = gamification.getLevelFromXP(undefined);
  assert(lvlUndefined.level === 1 && lvlUndefined.progress === "0.0", "getLevelFromXP handles undefined totalXP safely");

  const rankNaN = gamification.getRankTier(NaN);
  assert(rankNaN.tier === "Novice", "getRankTier handles NaN level safely mapping to Novice");

  const rankNeg = gamification.getRankTier(-5);
  assert(rankNeg.tier === "Novice", "getRankTier handles negative level safely mapping to Novice");

  const rankElite = gamification.getRankTier(25);
  assert(rankElite.tier === "Elite", "getRankTier maps valid level 25 to Elite");
} catch (e) {
  assert(false, `getLevelFromXP or getRankTier crashed on boundaries: ${e.message}`);
}

console.log("\n=========================================");
if (passed) {
  console.log("🎉 ALL GAMIFICATION DEFENSIVE HARDENING TESTS PASSED!");
  process.exit(0);
} else {
  console.error("💥 SOME GAMIFICATION DEFENSIVE TESTS FAILED (EXPECTED PRIOR TO PATCH)!");
  process.exit(1);
}
