import assert from "assert";
import {
  calculateTotalRewards,
  calculateLeaderboardPosition,
  predictNextAchievement
} from "./src/utils/gamification.js";

console.log("=========================================");
console.log("🎮 STARTING GAMIFICATION HARDENING V3 VERIFICATION");
console.log("=========================================");

// 1. calculateTotalRewards
console.log("\n🧪 Test 1: calculateTotalRewards with string and malformed rewards...");
const rewardsRes1 = calculateTotalRewards(
  [{ xpReward: "50" }, { xpReward: "100" }],
  [{ xpReward: "75" }, { xpReward: null }, { xpReward: "invalid" }]
);
assert.strictEqual(rewardsRes1.totalXP, 225, `Expected 225, got ${rewardsRes1.totalXP}`);
assert.strictEqual(rewardsRes1.achievementsCount, 2);
assert.strictEqual(rewardsRes1.challengesCount, 3);
assert.strictEqual(rewardsRes1.bonusXP, 22, `Expected 22, got ${rewardsRes1.bonusXP}`);
console.log("✅ PASSED: calculateTotalRewards correctly sums string numeric rewards");

const rewardsRes2 = calculateTotalRewards(null, undefined);
assert.strictEqual(rewardsRes2.totalXP, 0);
assert.strictEqual(rewardsRes2.bonusXP, 0);
console.log("✅ PASSED: calculateTotalRewards safely handles null/undefined arguments");

// 2. calculateLeaderboardPosition
console.log("\n🧪 Test 2: calculateLeaderboardPosition with string totalXP and rank ordering...");
const users = [
  { id: "u1", totalXP: "1000" },
  { id: "u2", totalXP: 500 },
  { id: "u3", totalXP: "250" },
  { id: "u4", totalXP: 100 }
];

const pos1 = calculateLeaderboardPosition({ totalXP: "200" }, users);
// u1 (1000), u2 (500), u3 (250) are higher than 200. u4 (100) is lower.
// Position should be 4 out of 4.
assert.strictEqual(pos1.position, 4, `Expected position 4, got ${pos1.position}`);
assert.strictEqual(pos1.totalUsers, 4);
assert.strictEqual(pos1.percentile, "0.0", `Expected percentile '0.0', got ${pos1.percentile}`);
console.log("✅ PASSED: calculateLeaderboardPosition parses string totalXP accurately without lexicographical errors");

// Test percentile clamping (never negative)
const posLowest = calculateLeaderboardPosition({ totalXP: 10 }, [{ totalXP: 20 }]);
assert.strictEqual(posLowest.position, 2);
assert.strictEqual(posLowest.percentile, "0.0", `Expected percentile '0.0', got ${posLowest.percentile}`);
console.log("✅ PASSED: calculateLeaderboardPosition clamps percentile to non-negative range");

// Test top position
const posTop = calculateLeaderboardPosition({ totalXP: "2000" }, users);
assert.strictEqual(posTop.position, 1);
assert.strictEqual(posTop.percentile, "75.0");
assert.strictEqual(posTop.topPercentile, false); // 1 <= floor(4 * 0.1 = 0) is false
console.log("✅ PASSED: calculateLeaderboardPosition handles top rank correctly");

// 3. predictNextAchievement
console.log("\n🧪 Test 3: predictNextAchievement with string currentStreak...");
const pred1 = predictNextAchievement({ currentStreak: "5", unlockedAchievements: [] });
assert.ok(pred1, "Expected achievement prediction object");
assert.strictEqual(pred1.daysUntil, 2, `Expected 7 - 5 = 2 days, got ${pred1.daysUntil}`);
console.log("✅ PASSED: predictNextAchievement parses string currentStreak");

const predNull = predictNextAchievement(null);
assert.strictEqual(predNull, undefined);
console.log("✅ PASSED: predictNextAchievement safely returns undefined for null userData");

console.log("\n=========================================");
console.log("🎉 ALL GAMIFICATION HARDENING V3 TESTS PASSED!");
console.log("=========================================\n");
