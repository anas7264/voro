// Security & Correctness Verification Script for assessInflammatoryPotential in nutrition.js
import { assessInflammatoryPotential } from './src/utils/nutrition.js';

console.log("=========================================");
console.log("🧪 RUNNING NUTRITION INFLAMMATORY HARDENING VERIFICATION");
console.log("=========================================\n");

let passed = true;

function check(testName, condition, details = "") {
  if (condition) {
    console.log(`✅ ${testName}`);
  } else {
    console.error(`❌ FAILURE: ${testName} ${details}`);
    passed = false;
  }
}

// Test 1: Null/undefined/empty input handling
const emptyRes1 = assessInflammatoryPotential(null);
check("Handles null input safely", emptyRes1.inflammatoryScore === 0 && emptyRes1.classification === "Low");

const emptyRes2 = assessInflammatoryPotential([]);
check("Handles empty array input safely", emptyRes2.inflammatoryScore === 0 && emptyRes2.classification === "Low");

// Test 2: Malformed food items and non-string category handling (No TypeErrors)
try {
  const malformedItems = [
    null,
    undefined,
    {},
    { category: 12345 },
    { category: { name: "processed" } },
    { category: ["fried"] },
    { category: true }
  ];
  const malformedRes = assessInflammatoryPotential(malformedItems);
  check("Handles non-string category types without throwing TypeError", typeof malformedRes.inflammatoryScore === "number");
} catch (err) {
  check("Handles non-string category types without throwing TypeError", false, err.message);
}

// Test 3: Malformed tags handling (No TypeErrors)
try {
  const malformedTagsItems = [
    { category: "healthy", tags: null },
    { category: "healthy", tags: 42 },
    { category: "healthy", tags: { tag: "antioxidant" } },
    { category: "healthy", tags: true },
    { category: "healthy", tags: [null, undefined, 123, {}] }
  ];
  const malformedTagsRes = assessInflammatoryPotential(malformedTagsItems);
  check("Handles malformed tags types without throwing TypeError", typeof malformedTagsRes.inflammatoryScore === "number");
} catch (err) {
  check("Handles malformed tags types without throwing TypeError", false, err.message);
}

// Test 4: Case-insensitivity for category strings
const uppercaseCatMeal = [
  { category: "PROCESSED FOOD" },
  { category: "DEEP FRIED DELICACY" },
  { category: "SUGARY BEVERAGE" }
];
const upperCatRes = assessInflammatoryPotential(uppercaseCatMeal);
check(
  "Evaluates uppercase category items correctly (processed + fried + sugary = 6 -> High)",
  upperCatRes.inflammatoryScore === 6 && upperCatRes.classification === "High",
  `Got score=${upperCatRes.inflammatoryScore}, class=${upperCatRes.classification}`
);

// Test 5: Case-insensitivity for tags array
const uppercaseTagsMeal = [
  { tags: ["HIGH-OMEGA6", "Processed"] }, // +1 for high-omega6
  { tags: ["ANTIOXIDANT", "HIGH-OMEGA3"] }, // -2, -2 = -4
  { tags: ["POLYPHENOL-RICH"] } // -1
];
// Score = 1 - 2 - 2 - 1 = -4 -> Math.max(0, -4) = 0
const upperTagsRes = assessInflammatoryPotential(uppercaseTagsMeal);
check(
  "Evaluates uppercase tags array items correctly with negative score floor at 0",
  upperTagsRes.inflammatoryScore === 0 && upperTagsRes.classification === "Low",
  `Got score=${upperTagsRes.inflammatoryScore}`
);

// Test 6: String-based tags format (comma-separated or single string)
const stringTagsMeal = [
  { category: "processed foods", tags: "high-omega6, snack" } // category +2, tag +1 = 3 -> Moderate
];
const stringTagsRes = assessInflammatoryPotential(stringTagsMeal);
check(
  "Evaluates string-based tags format correctly (score 3 -> Moderate)",
  stringTagsRes.inflammatoryScore === 3 && stringTagsRes.classification === "Moderate",
  `Got score=${stringTagsRes.inflammatoryScore}, class=${stringTagsRes.classification}`
);

// Test 7: Classification boundaries
// Score <= 2: Low
// Score 3 to 5: Moderate
// Score > 5: High
const moderateMeal = [
  { category: "processed meat" }, // +2
  { tags: ["high-omega6"] } // +1 => total 3
];
const modRes = assessInflammatoryPotential(moderateMeal);
check("Correctly classifies Moderate score (3)", modRes.classification === "Moderate");

const highMeal = [
  { category: "processed fried sugary" } // +2 +2 +2 = 6
];
const highRes = assessInflammatoryPotential(highMeal);
check("Correctly classifies High score (6)", highRes.classification === "High");

console.log("\n=========================================");
if (passed) {
  console.log("🎉 ALL NUTRITION INFLAMMATORY HARDENING TESTS PASSED!");
  console.log("=========================================\n");
  process.exit(0);
} else {
  console.error("💥 SOME TESTS FAILED!");
  console.log("=========================================\n");
  process.exit(1);
}
