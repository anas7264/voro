import {
  calculateXP,
  getLevelFromXP,
  checkAchievementTrigger,
  calculateStreak,
  getRankTier,
  checkChallengeCompletion,
  getActiveChallenges,
  calculateTotalRewards,
  calculateLeaderboardPosition,
  getRarityBreakdown,
  getGamificationStats,
  predictNextAchievement
} from './src/utils/gamification.js';

console.log("=========================================");
console.log("🧪 TESTING GAMIFICATION UTILITY OPTIMIZATIONS");
console.log("=========================================");

// 1. Test calculateLeaderboardPosition correctness & immutability
const originalUsers = [
  { id: 'u1', totalXP: 1200 },
  { id: 'u2', totalXP: 3500 },
  { id: 'u3', totalXP: 800 },
  { id: 'u4', totalXP: 2100 },
  { id: 'u5', totalXP: 5000 }
];

// Shallow copy to test if originalUsers is mutated
const usersCopy = [...originalUsers.map(u => ({ ...u }))];

const userStats = { id: 'u4', totalXP: 2100 };
const result = calculateLeaderboardPosition(userStats, usersCopy);

console.log("Leaderboard position result:", result);

if (result.position !== 3) {
  console.error(`❌ Expected position 3, got ${result.position}`);
  process.exit(1);
}

// Check immutability: first element in usersCopy should still be u1 (1200), not u5 (5000)
if (usersCopy[0].id !== 'u1') {
  console.error("❌ Array was mutated in place by calculateLeaderboardPosition!");
  process.exit(1);
} else {
  console.log("✅ Immutability verified: Input array was NOT mutated!");
}

// 2. Test edge case: empty array
const emptyResult = calculateLeaderboardPosition(userStats, []);
console.log("Empty leaderboard result:", emptyResult);
if (emptyResult.position !== 1) {
  console.error(`❌ Expected position 1 for empty array, got ${emptyResult.position}`);
  process.exit(1);
}
console.log("✅ Empty leaderboard array handled safely!");

// 3. Test getRarityBreakdown empty array
const emptyRarity = getRarityBreakdown([]);
if (emptyRarity.legendaryPercentage !== "0.0") {
  console.error(`❌ Expected "0.0", got ${emptyRarity.legendaryPercentage}`);
  process.exit(1);
}
console.log("✅ getRarityBreakdown handles empty array without NaN!");

// 4. Benchmark calculateLeaderboardPosition with 100,000 users
const largeUsersList = Array.from({ length: 100000 }, (_, i) => ({
  id: `user_${i}`,
  totalXP: Math.floor(Math.random() * 100000)
}));
const testUser = { id: 'user_5000', totalXP: 50000 };

const start = performance.now();
for (let i = 0; i < 100; i++) {
  calculateLeaderboardPosition(testUser, largeUsersList);
}
const duration = performance.now() - start;

console.log(`⏱️ 100 iterations of calculateLeaderboardPosition over 100k users took: ${duration.toFixed(2)}ms`);

console.log("🎉 ALL GAMIFICATION TESTS PASSED SUCCESSFULLY!");
