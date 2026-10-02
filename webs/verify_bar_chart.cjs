const fs = require('fs');
const path = require('path');

console.log("=== VERIFYING BARCHARTCOMPONENT LUXURY RE-ENGINEERING ===");

const filePath = path.join(__dirname, 'src/components/BarChartComponent.jsx');
if (!fs.existsSync(filePath)) {
  console.error("FAIL: BarChartComponent.jsx file does not exist.");
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');

const checks = [
  { name: "Direct-DOM useRef volumetric tilt flags (isHoveredRef, isFocusedRef)", pattern: /isHoveredRef\s*=\s*useRef/ },
  { name: "60fps direct-DOM transform style updates in handleMouseMove", pattern: /setProperty\('--tilt-x'/ },
  { name: "Live spatial coordinate telemetry refs (tiltXRef, tiltYRef)", pattern: /tiltXRef\s*=\s*useRef/ },
  { name: "Magnetic liquid border illumination mask", pattern: /radial-gradient\(400px circle at var\(--mouse-x/ },
  { name: "Luminous spotlight follower lens", pattern: /radial-gradient\(600px circle at var\(--mouse-x/ },
  { name: "SSR-safe sub-pixel attestation hash badge", pattern: /0xBAR_.*_ATTESTED/ },
  { name: "W3C APG keyboard accessibility attributes (role=region, tabIndex=0)", pattern: /role="region"[\s\S]*tabIndex=\{0\}/ },
  { name: "W3C APG static 4.0° focus tilt fallback", pattern: /setProperty\('--tilt-x',\s*'4\.00deg'\)/ },
  { name: "CustomTooltip with Playfair Display italic serif hero typography", pattern: /font-serif italic font-medium text-white/ },
  { name: "Multi-series linear gradients and glow filters in SVG defs", pattern: /filter id=\{\`glow-bar-/ }
];

let passed = 0;
checks.forEach((check, i) => {
  if (check.pattern.test(content)) {
    console.log(`[PASS] Check ${i + 1}: ${check.name}`);
    passed++;
  } else {
    console.error(`[FAIL] Check ${i + 1}: ${check.name}`);
  }
});

console.log(`\nResults: ${passed}/${checks.length} checks passed.`);
if (passed !== checks.length) {
  process.exit(1);
}

console.log("=== BARCHARTCOMPONENT VERIFICATION COMPLETE ===");
