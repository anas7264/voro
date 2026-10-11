const fs = require('fs');
const path = require('path');

console.log("=== Voro Luxury Masterclass: Verifying Breadcrumb.jsx ===");

const filePath = path.join(__dirname, 'src', 'components', 'Breadcrumb.jsx');
const content = fs.readFileSync(filePath, 'utf8');

// Verification checks
const checks = [
  { name: 'Memoized Component Export', pass: content.includes('export const Breadcrumb = memo(') },
  { name: 'Direct DOM Ref usage (txRef & tyRef)', pass: content.includes('txRef') && content.includes('tyRef') },
  { name: 'Direct DOM style updates for 3D tilt', pass: content.includes("style.setProperty('--tilt-x'") && content.includes("style.setProperty('--tilt-y'") },
  { name: 'Liquid Border Perimeter Mask (radial-gradient)', pass: content.includes('maskComposite') || content.includes('WebkitMaskComposite') },
  { name: 'Playfair Display Italic Typography for terminal node', pass: content.includes('font-serif italic') },
  { name: 'JetBrains Mono Typography for navigation path', pass: content.includes('font-mono') },
  { name: 'Sub-pixel Attestation Hash Badging (0xBRD_SEQ_...)', pass: content.includes('0xBRD_SEQ_') },
  { name: 'W3C APG Accessibility attributes (aria-current="page", aria-label)', pass: content.includes('aria-current="page"') && content.includes('aria-label="Breadcrumb"') },
  { name: 'Keyboard focus ring & static focus tilt fallback', pass: content.includes('focus-visible:ring-2') && content.includes("style.setProperty('--tilt-x', '4deg')") },
  { name: 'Hoisted static fallbacks (EMPTY_ITEMS)', pass: content.includes('EMPTY_ITEMS = Object.freeze([])') }
];

let failed = false;
checks.forEach((check, index) => {
  if (check.pass) {
    console.log(`✓ Check ${index + 1}: ${check.name}`);
  } else {
    console.error(`✗ Check ${index + 1} FAILED: ${check.name}`);
    failed = true;
  }
});

if (failed) {
  console.error("\n❌ Verification failed!");
  process.exit(1);
} else {
  console.log("\n✅ All 10 luxury architecture checks passed successfully!");
}
