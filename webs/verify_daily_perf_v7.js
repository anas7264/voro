import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("⚡ Running Daily Optimization v7 Verification Test Suite...");

// Test files to verify
const testFiles = [
  { path: 'src/pages/Calculators.jsx', component: 'VolumetricComputationNode' },
  { path: 'src/pages/Challenges.jsx', component: 'TelemetryCard' },
  { path: 'src/components/Toggle.jsx', component: 'Toggle' }
];

let allPassed = true;

for (const { path: relPath, component } of testFiles) {
  const fullPath = path.resolve(__dirname, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Verification Failed: File ${relPath} does not exist.`);
    allPassed = false;
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8');

  // Check 1: Ensure useState(false) for isHovered/isFocused is eliminated in target components
  const hoverStateRegex = /const\s+\[isHovered,\s*setIsHovered\]\s*=\s*useState\(false\)/;
  const focusStateRegex = /const\s+\[isFocused,\s*setIsFocused\]\s*=\s*useState\(false\)/;

  if (hoverStateRegex.test(content) || focusStateRegex.test(content)) {
    console.error(`❌ Verification Failed in ${relPath}: Found useState for isHovered or isFocused.`);
    allPassed = false;
  } else {
    console.log(`  ✓ ${relPath}: No React useState hooks for interaction hover/focus tracking.`);
  }

  // Check 2: Ensure useRef flags exist for zero-allocation interaction tracking
  if (!content.includes('isHoveredRef') || !content.includes('isFocusedRef')) {
    console.error(`❌ Verification Failed in ${relPath}: Missing isHoveredRef or isFocusedRef.`);
    allPassed = false;
  } else {
    console.log(`  ✓ ${relPath}: Verified useRef interaction flags (isHoveredRef & isFocusedRef).`);
  }

  // Check 3: Ensure direct-DOM property manipulation exists
  if (!content.includes('.style.setProperty') && !content.includes('.style')) {
    console.error(`❌ Verification Failed in ${relPath}: Direct-DOM style updates not detected.`);
    allPassed = false;
  } else {
    console.log(`  ✓ ${relPath}: Direct DOM style updates verified.`);
  }
}

if (!allPassed) {
  console.error("❌ Test suite failed!");
  process.exit(1);
}

console.log("🎉 All Daily Optimization v7 verification checks passed successfully!");
