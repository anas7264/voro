import {
  assessHydrationStatus,
  findSimilarFoods
} from './src/utils/nutrition.js';

console.log("=========================================");
console.log("🧪 VERIFYING NUTRITION & HYDRATION HARDENING");
console.log("=========================================");

let passes = 0;
let fails = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ ${message}`);
    passes++;
  } else {
    console.error(`❌ ${message}`);
    fails++;
  }
}

// Test 1: assessHydrationStatus recommendation for "Mild Dehydration"
const mildStatus = assessHydrationStatus(1.025, "golden");
assert(
  mildStatus.status === "Mild Dehydration",
  `Status should be 'Mild Dehydration' (got '${mildStatus.status}')`
);
assert(
  mildStatus.recommendation.toLowerCase().includes("increase water intake"),
  `Mild dehydration should recommend increasing water intake, not reducing! (got '${mildStatus.recommendation}')`
);

// Test 2: assessHydrationStatus recommendation for severe "Dehydrated"
const severeStatus = assessHydrationStatus(1.035, "dark_brown");
assert(
  severeStatus.status === "Dehydrated",
  `Status should be 'Dehydrated' (got '${severeStatus.status}')`
);
assert(
  severeStatus.recommendation.toLowerCase().includes("increase water intake"),
  `Severe dehydration should recommend increasing water intake (got '${severeStatus.recommendation}')`
);

// Test 3: assessHydrationStatus parsing string urine density
const stringDensityStatus = assessHydrationStatus("1.025", "golden");
assert(
  stringDensityStatus.status === "Mild Dehydration",
  `String urine density '1.025' should be parsed and evaluated as 'Mild Dehydration' (got '${stringDensityStatus.status}')`
);
assert(
  stringDensityStatus.hydrationScore === 50,
  `String urine density '1.025' should result in hydrationScore 50 (got ${stringDensityStatus.hydrationScore})`
);

// Test 4: assessHydrationStatus for Overhydrated
const overStatus = assessHydrationStatus(1.005, "colorless");
assert(
  overStatus.status === "Overhydrated",
  `Status should be 'Overhydrated' (got '${overStatus.status}')`
);
assert(
  overStatus.recommendation.toLowerCase().includes("reduce water intake"),
  `Overhydrated should recommend reducing water intake (got '${overStatus.recommendation}')`
);

// Test 5: assessHydrationStatus for Optimally Hydrated
const optimalStatus = assessHydrationStatus(1.015, "pale_yellow");
assert(
  optimalStatus.status === "Optimally Hydrated",
  `Status should be 'Optimally Hydrated' (got '${optimalStatus.status}')`
);
assert(
  optimalStatus.recommendation.toLowerCase().includes("maintain current water intake"),
  `Optimally hydrated should recommend maintaining current water intake (got '${optimalStatus.recommendation}')`
);

// Test 6: findSimilarFoods with numeric string target macro properties
const numericTarget = { id: 'test_food', protein: 25, carbs: 10, fat: 5 };
const stringTarget = { id: 'test_food', protein: '25', carbs: '10', fat: '5' };

const numericResults = findSimilarFoods(numericTarget, 50);
const stringResults = findSimilarFoods(stringTarget, 50);

assert(
  numericResults.length > 0,
  `Numeric target should find similar foods (found ${numericResults.length})`
);
assert(
  stringResults.length === numericResults.length,
  `String target should find exact same count of similar foods as numeric target (${stringResults.length} === ${numericResults.length})`
);
assert(
  stringResults.length > 0 && stringResults[0].id === numericResults[0].id,
  `String target should identify matching food items`
);

console.log("=========================================");
if (fails === 0) {
  console.log(`🎉 ALL ${passes} TESTS PASSED!`);
} else {
  console.error(`❌ FAILED: ${fails} test(s) failed`);
  process.exit(1);
}
