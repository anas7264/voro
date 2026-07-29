import sentinel, { clearStackCache, validateCallStack } from './src/utils/security.js';

// Setup browser-like environment in Node.js to trigger the full validateCallStack execution path
global.window = {
  location: { origin: 'http://localhost' },
  __VORO_TEST_BYPASS__: false,
  VORO_COMPROMISED: false
};
global.localStorage = {
  getItem: () => 'false' // isTestMode will return false
};

console.log("=== VORO CALL STACK VALIDATION BENCHMARK (REALISTIC DEEP STACK) ===");

const ITERATIONS = 10000;
const DEEP_LEVELS = 40;

// Generate a deep call stack recursively
function recursiveCaller(level) {
  if (level <= 0) {
    return validateCallStack();
  }
  return recursiveCaller(level - 1);
}

// Warm up
for (let i = 0; i < 100; i++) {
  recursiveCaller(DEEP_LEVELS);
}

// 1. Benchmark without caching (clear stack cache every iteration to simulate no caching)
const startNoCache = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  clearStackCache();
  recursiveCaller(DEEP_LEVELS);
}
const endNoCache = performance.now();
const timeNoCache = endNoCache - startNoCache;

// 2. Benchmark with caching (standard behavior)
const startWithCache = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  recursiveCaller(DEEP_LEVELS);
}
const endWithCache = performance.now();
const timeWithCache = endWithCache - startWithCache;

console.log(`Iterations: ${ITERATIONS}`);
console.log(`Time without Cache: ${timeNoCache.toFixed(3)} ms (${(timeNoCache / ITERATIONS * 1000).toFixed(3)} µs/op)`);
console.log(`Time with Cache:    ${timeWithCache.toFixed(3)} ms (${(timeWithCache / ITERATIONS * 1000).toFixed(3)} µs/op)`);
console.log(`Speedup factor:     ${(timeNoCache / timeWithCache).toFixed(1)}x`);

process.exit(0);
