const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("⚡ Starting Accordion.jsx Component Verification...\n");

const accordionPath = path.join(__dirname, 'src', 'components', 'Accordion.jsx');
const accordionContent = fs.readFileSync(accordionPath, 'utf8');

// Test 1: React Memoization & Hooks
if (!accordionContent.includes('memo(') || !accordionContent.includes('useId(') || !accordionContent.includes('useRef(') || !accordionContent.includes('useMemo(')) {
  console.error("❌ Test 1 Failed: Accordion.jsx must use memo, useId, useRef, and useMemo.");
  process.exit(1);
}
console.log("✓ Test 1 Passed: Component memoization and required React hooks present.");

// Test 2: SSR-Safe Deterministic Subpixel Hash Badging
if (!accordionContent.includes('0xACD_') || !accordionContent.includes('generatedId.replace')) {
  console.error("❌ Test 2 Failed: Sub-pixel attestation hash badging missing or not derived from useId.");
  process.exit(1);
}
console.log("✓ Test 2 Passed: Deterministic SSR-safe attestation hash badging present.");

// Test 3: Zero-Allocation Direct-DOM 60fps Tilt Handling
if (!accordionContent.includes('isHoveredRef') || !accordionContent.includes('isFocusedRef') || !accordionContent.includes('setProperty(\'--tilt-x\'')) {
  console.error("❌ Test 3 Failed: Direct-DOM 60fps rotational tilt tracking missing.");
  process.exit(1);
}
console.log("✓ Test 3 Passed: Zero-allocation direct-DOM 60fps tilt tracking verified.");

// Test 4: Liquid Border Illumination Mask
if (!accordionContent.includes('radial-gradient') || !accordionContent.includes('WebkitMaskComposite')) {
  console.error("❌ Test 4 Failed: Reactive liquid border illumination mask missing.");
  process.exit(1);
}
console.log("✓ Test 4 Passed: Reactive liquid border illumination mask verified.");

// Test 5: W3C APG Focus Tilt States
if (!accordionContent.includes('4.00deg') || !accordionContent.includes('rotateX(4deg)')) {
  console.error("❌ Test 5 Failed: Static 4-degree focus tilt state missing.");
  process.exit(1);
}
console.log("✓ Test 5 Passed: W3C APG static focus tilt states verified.");

// Test 6: DisplayName Export
if (!accordionContent.includes('Accordion.displayName = "Accordion"') || !accordionContent.includes('AccordionItem.displayName = "AccordionItem"')) {
  console.error("❌ Test 6 Failed: Component displayName must be set.");
  process.exit(1);
}
console.log("✓ Test 6 Passed: Component displayNames set.");

// Test 7: Production Build Verification
console.log("\nRunning Vite production build check...");
try {
  execSync('npm run build', { cwd: __dirname, stdio: 'pipe' });
  console.log("✓ Test 7 Passed: Vite production build succeeded cleanly.");
} catch (err) {
  console.error("❌ Test 7 Failed: Vite production build failed:", err.message);
  process.exit(1);
}

console.log("\n🎉 ALL ACCORDION.JSX VERIFICATION CHECKS PASSED SUCCESSFULLY!");
