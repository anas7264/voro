/**
 * Dedicated security verification script for Prototype Pollution Defense in safeJSONParse.
 * This runs in Node.js and asserts that safeJSONParse is successfully shielded.
 */

import './mock_window.js';
import { safeJSONParse } from './src/utils/security.js';

const runTests = async () => {
  console.log("=========================================");
  console.log("🧪 RUNNING SECURITY VERIFICATION: PROTOTYPE POLLUTION DEFENSE");
  console.log("=========================================");

  // Confirm safeJSONParse is functional and protects against prototype pollution
  console.log("🟢 Test 1: Verifying safeJSONParse shields against prototype pollution...");

  const text = '{"name": "Voro", "__proto__": {"polluted": true}, "constructor": {"name": "UserConstructor"}, "nested": {"prototype": "DesignSpecimen"}}';
  const parsed = safeJSONParse(text);

  console.log("Parsed object result:", parsed);

  // Assertion 1: '__proto__' must be stripped to prevent prototype pollution
  if (parsed.__proto__ && parsed.__proto__.polluted) {
    throw new Error("❌ Failure: __proto__ pollution was parsed and populated!");
  }

  // Double check that Object.prototype itself was NOT polluted
  const dummy = {};
  if (dummy.polluted) {
    throw new Error("❌ Failure: Global Object.prototype has been polluted!");
  }

  console.log("✅ Success: __proto__ pollution payload successfully neutralized!");

  // Assertion 2: Legitimate fields 'constructor' and 'prototype' must be perfectly neutralized/stripped when nested inside untrusted JSON parsed via safeJSONParse
  console.log("🟢 Test 2: Verifying nested 'constructor' and 'prototype' fields are neutralized in safeJSONParse...");
  if (parsed.constructor !== undefined && parsed.constructor.name === "UserConstructor") {
    throw new Error("❌ Failure: Legitimate 'constructor' field was not stripped during safe deserialization!");
  }
  if (parsed.nested && parsed.nested.prototype !== undefined) {
    throw new Error("❌ Failure: Legitimate 'prototype' field was not stripped during safe deserialization!");
  }
  console.log("✅ Success: Nested pollution vectors neutralized intact.");

  // Test 3: Standard JSON parsing compatibility of safeJSONParse
  console.log("🟢 Test 3: Verifying standard JSON parsing remains fully functional...");
  const standardText = '{"id": 123, "active": true, "list": [1, 2, 3]}';
  const standardParsed = safeJSONParse(standardText);
  if (standardParsed.id !== 123 || !standardParsed.active || standardParsed.list.length !== 3) {
    throw new Error("❌ Failure: Standard JSON parsing has regressions!");
  }
  console.log("✅ Success: Standard JSON parsing remains fully functional.");

  // Test 4: Custom reviver chaining
  console.log("🟢 Test 4: Verifying custom revivers are correctly chained and respected in safeJSONParse...");
  const customText = '{"value": 10, "__proto__": {"polluted": true}}';
  const customParsed = safeJSONParse(customText, (k, v) => {
    if (k === 'value') return v * 2;
    return v;
  });

  if (customParsed.value !== 20) {
    throw new Error(`❌ Failure: Custom reviver failed to run (expected 20, got ${customParsed.value})!`);
  }
  if (customParsed.__proto__ && customParsed.__proto__.polluted) {
    throw new Error("❌ Failure: __proto__ pollution bypass during custom reviver chain!");
  }
  console.log("✅ Success: Custom reviver chaining verified.");

  console.log("\n🎉 ALL PROTOTYPE POLLUTION SECURITY TESTS PASSED SUCCESSFULLY!");
  console.log("=========================================");
  process.exit(0);
};

runTests().catch(err => {
  console.error("❌ Test Runner encountered an error:", err);
  process.exit(1);
});
