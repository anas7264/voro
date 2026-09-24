import assert from "assert";
import { challenges } from "./src/data/challenges.js";
import * as gamification from "./src/utils/gamification.js";

console.log("=========================================");
console.log("⚡ VERIFYING USECHALLENGE HOOK OPTIMIZATIONS");
console.log("=========================================");

// Module-scoped O(1) challenge lookup map
const CHALLENGES_BY_ID = Object.freeze(
  challenges.reduce((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, Object.create(null))
);

// Verify dictionary indexing
assert.strictEqual(CHALLENGES_BY_ID["ch001"].id, "ch001");
assert.strictEqual(CHALLENGES_BY_ID["ch048"].id, "ch048");
assert.strictEqual(Object.keys(CHALLENGES_BY_ID).length, challenges.length);
console.log("✅ Module-scoped O(1) CHALLENGES_BY_ID lookup index verified!");

// Mock user progress
const mockUserProgress = {
  "ch001": { workoutsThisPeriod: 1 },
  "ch002": { waterLiters: 3 },
  "ch028": { nutritionDays: 6 }
};

// Benchmark Old vs New approach for getAllChallengeProgress over 10,000 calls
const activeChallenges = challenges;

// Old unoptimized implementation
function oldGetAllChallengeProgress() {
  function oldGetProgress(id) {
    const c = challenges.find(item => item.id === id);
    const p = mockUserProgress[id];
    if (!c || !p) return null;
    return gamification.checkChallengeCompletion(c, p);
  }
  function oldIsComplete(id) {
    const c = challenges.find(item => item.id === id);
    const p = mockUserProgress[id];
    if (!c || !p) return false;
    return gamification.checkChallengeCompletion(c, p).isComplete;
  }
  return activeChallenges.map(challenge => ({
    challenge,
    progress: oldGetProgress(challenge.id),
    isComplete: oldIsComplete(challenge.id)
  }));
}

// New optimized implementation
function newGetAllChallengeProgress() {
  function newGetProgress(id) {
    const c = CHALLENGES_BY_ID[id];
    const p = mockUserProgress[id];
    if (!c || !p) return null;
    return gamification.checkChallengeCompletion(c, p);
  }
  const len = activeChallenges.length;
  const allProgress = new Array(len);
  for (let i = 0; i < len; i++) {
    const challenge = activeChallenges[i];
    const progress = newGetProgress(challenge.id);
    allProgress[i] = {
      challenge,
      progress,
      isComplete: Boolean(progress?.isComplete)
    };
  }
  return allProgress;
}

// Verify output parity
const oldRes = oldGetAllChallengeProgress();
const newRes = newGetAllChallengeProgress();

assert.strictEqual(oldRes.length, newRes.length);
for (let i = 0; i < oldRes.length; i++) {
  assert.strictEqual(oldRes[i].challenge.id, newRes[i].challenge.id);
  assert.strictEqual(oldRes[i].isComplete, newRes[i].isComplete);
  assert.deepStrictEqual(oldRes[i].progress, newRes[i].progress);
}
console.log("✅ Functional output parity between old and new implementations verified!");

// Benchmark
const ITERATIONS = 10000;

const startOld = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  oldGetAllChallengeProgress();
}
const endOld = performance.now();
const oldTime = endOld - startOld;

const startNew = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  newGetAllChallengeProgress();
}
const endNew = performance.now();
const newTime = endNew - startNew;

console.log(`⏱️ Unoptimized time (${ITERATIONS} iterations): ${oldTime.toFixed(2)}ms`);
console.log(`⏱️ Optimized time (${ITERATIONS} iterations): ${newTime.toFixed(2)}ms`);
console.log(`🚀 Speedup factor: ${(oldTime / newTime).toFixed(2)}x faster!`);

console.log("🎉 ALL USECHALLENGE OPTIMIZATION TESTS PASSED!");
