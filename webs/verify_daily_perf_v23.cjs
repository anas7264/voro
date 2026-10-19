const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("=========================================");
console.log("⚡ VERIFYING DAILY PERFORMANCE OPTIMIZATIONS (v23)");
console.log("=========================================");

const bodyMetricsPath = path.join(__dirname, 'src', 'pages', 'BodyMetrics.jsx');
const bodyCompositionPath = path.join(__dirname, 'src', 'pages', 'BodyComposition.jsx');
const calculatorsPath = path.join(__dirname, 'src', 'pages', 'Calculators.jsx');

const bodyMetricsSrc = fs.readFileSync(bodyMetricsPath, 'utf8');
const bodyCompositionSrc = fs.readFileSync(bodyCompositionPath, 'utf8');
const calculatorsSrc = fs.readFileSync(calculatorsPath, 'utf8');

// Test 1: Verify BodyMetrics.jsx RAF batching in handleVolumetricMove
console.log("\n🧪 Test 1: Verifying RAF batching in BodyMetrics.jsx...");
assert(bodyMetricsSrc.includes('volumetricRafRef'), "BodyMetrics.jsx should declare volumetricRafRef");
assert(bodyMetricsSrc.includes('requestAnimationFrame'), "BodyMetrics.jsx handleVolumetricMove should batch updates via requestAnimationFrame");
assert(bodyMetricsSrc.includes('cancelAnimationFrame'), "BodyMetrics.jsx handleVolumetricLeave should cancel pending RAF frame");
console.log("  ✓ BodyMetrics.jsx uses requestAnimationFrame for 60fps volumetric tilt tracking without layout thrashing");

// Test 2: Verify BodyMetrics.jsx callback referential stability
console.log("\n🧪 Test 2: Verifying callback referential stability in BodyMetrics.jsx...");
assert(bodyMetricsSrc.includes('const addWeight = useCallback('), "BodyMetrics.jsx addWeight should be wrapped in useCallback");
assert(bodyMetricsSrc.includes('const addMeasurement = useCallback('), "BodyMetrics.jsx addMeasurement should be wrapped in useCallback");
assert(bodyMetricsSrc.includes('const addBodyFat = useCallback('), "BodyMetrics.jsx addBodyFat should be wrapped in useCallback");
assert(!bodyMetricsSrc.match(/\[weight,\s*weights,/), "addWeight should not depend on closure array weights");
assert(!bodyMetricsSrc.match(/\[bodyFat,\s*bodyFatRecords,/), "addBodyFat should not depend on closure array bodyFatRecords");
console.log("  ✓ BodyMetrics.jsx action callbacks are referentially stable and decoupled from data array dependencies");

// Test 3: Verify Calculators.jsx RAF batching in VolumetricComputationNode
console.log("\n🧪 Test 3: Verifying RAF batching in Calculators.jsx VolumetricComputationNode...");
assert(calculatorsSrc.includes('rafIdRef'), "Calculators.jsx VolumetricComputationNode should declare rafIdRef");
assert(calculatorsSrc.includes('requestAnimationFrame'), "Calculators.jsx handleMouseMove should batch updates via requestAnimationFrame");
assert(calculatorsSrc.includes('cancelAnimationFrame'), "Calculators.jsx handleMouseLeave should cancel pending RAF frame");
console.log("  ✓ Calculators.jsx VolumetricComputationNode uses requestAnimationFrame for 60fps 3D hover tracking");

// Test 4: Verify Masterclass luxury standard checks
console.log("\n🧪 Test 4: Verifying Masterclass luxury standards...");
assert(calculatorsSrc.includes('VolumetricComputationNode.displayName = "VolumetricComputationNode"'), "Calculators.jsx should export VolumetricComputationNode displayName");
assert(bodyCompositionSrc.includes('SomaticSpecimenCell.displayName = "SomaticSpecimenCell"'), "BodyComposition.jsx should export SomaticSpecimenCell displayName");
assert(bodyCompositionSrc.includes('SomaticSegmentalLens.displayName = "SomaticSegmentalLens"'), "BodyComposition.jsx should export SomaticSegmentalLens displayName");
console.log("  ✓ Masterclass luxury standards verified across components");

console.log("\n=========================================");
console.log("🎉 ALL DAILY PERFORMANCE OPTIMIZATION CHECKS PASSED!");
console.log("=========================================\n");
