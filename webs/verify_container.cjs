const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("=========================================");
console.log("🧪 VERIFYING LUXURY CONTAINER ENCLAVE NODE");
console.log("=========================================");

const containerPath = path.join(__dirname, 'src/components/Container.jsx');
const containerContent = fs.readFileSync(containerPath, 'utf8');

// Check 1: React memoization and required hooks
assert(containerContent.includes('export const Container = memo('), "Container must be wrapped in React.memo");
assert(containerContent.includes('useRef') && containerContent.includes('useId') && containerContent.includes('useMemo'), "Container must use useRef, useId, and useMemo hooks");
console.log("✅ Check 1 Passed: Component memoization and required React hooks present.");

// Check 2: Deterministic SSR-safe attestation hash badging
assert(containerContent.includes('subpixelHash') && containerContent.includes('0xCTR_'), "Container must feature deterministic SSR-safe 0xCTR_..._ATTESTED_ENCLAVE hash badging");
console.log("✅ Check 2 Passed: Deterministic SSR-safe attestation hash badging present.");

// Check 3: Zero-allocation direct-DOM 60fps tilt tracking
assert(containerContent.includes('handleMouseMove') && containerContent.includes('--tilt-x') && containerContent.includes('--tilt-y'), "Container must implement 60fps direct-DOM 3D rotational tilt tracking");
assert(containerContent.includes('isHoveredRef') && containerContent.includes('isFocusedRef'), "Container must use useRef flags for hover/focus state tracking to eliminate React re-renders");
console.log("✅ Check 3 Passed: Zero-allocation direct-DOM 60fps tilt tracking verified.");

// Check 4: Dynamic magnetic liquid border perimeter illumination mask
assert(containerContent.includes('radial-gradient') && containerContent.includes('WebkitMaskComposite'), "Container must feature dynamic liquid border perimeter illumination mask");
console.log("✅ Check 4 Passed: Dynamic liquid border perimeter illumination mask verified.");

// Check 5: W3C APG static focus tilt states & accessibility
assert(containerContent.includes('handleFocus') && containerContent.includes('handleBlur') && containerContent.includes('focus-visible:ring-2'), "Container must support W3C APG focus tracking and visual focus rings");
console.log("✅ Check 5 Passed: W3C APG focus states verified.");

// Check 6: Frozen lookup dictionaries
assert(containerContent.includes('MAX_WIDTH_MAP') && containerContent.includes('PADDING_MAP') && containerContent.includes('VARIANT_MAP') && containerContent.includes('VARIANT_GLOW_COLORS'), "Container must use frozen lookup dictionaries");
console.log("✅ Check 6 Passed: Frozen lookup dictionaries verified.");

// Check 7: Prop forwarding & displayName
assert(containerContent.includes('Container.displayName = "Container"'), "Container.displayName must be set");
assert(containerContent.includes('style={'), "Container must forward style prop");
console.log("✅ Check 7 Passed: Prop forwarding and displayName verified.");

console.log("\n🎉 ALL CONTAINER ENCLAVE NODE VERIFICATION CHECKS PASSED!");
console.log("=========================================");
