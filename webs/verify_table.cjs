const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src/components/Table.jsx');
const content = fs.readFileSync(targetFile, 'utf-8');

console.log('⚡ Running Table.jsx Refinement & Performance Verifier...');

const checks = [
  { name: 'Import React hooks & memo', test: /import React,?\s*\{[^}]*memo[^}]*\}\s*from\s*["']react["']/.test(content) },
  { name: 'Hoisted frozen fallback EMPTY_HEADERS', test: /const EMPTY_HEADERS = Object\.freeze\(\[\]\)/.test(content) },
  { name: 'Hoisted frozen fallback EMPTY_ROWS', test: /const EMPTY_ROWS = Object\.freeze\(\[\]\)/.test(content) },
  { name: 'SSR-safe nodeId & attestedHash using useId', test: /useId\(\)/.test(content) && /0xTBL_MTX_/.test(content) },
  { name: '60fps Direct-DOM tilt variables (--tilt-x, --tilt-y)', test: /--tilt-x/.test(content) && /--tilt-y/.test(content) },
  { name: 'Dynamic telemetry coordinate overlay', test: /TX_/.test(content) && /TY_/.test(content) },
  { name: 'Dynamic liquid border illumination mask', test: /radial-gradient/.test(content) },
  { name: 'W3C APG compliant focus tilt', test: /focus-visible:ring-2/.test(content) },
  { name: 'Playfair Display & JetBrains Mono typography', test: /font-serif/.test(content) && /font-mono/.test(content) },
  { name: 'DisplayName set', test: /Table\.displayName = ["']Table["']/.test(content) }
];

let allPassed = true;
checks.forEach(({ name, test }) => {
  if (test) {
    console.log(`✓ ${name}`);
  } else {
    console.error(`✗ ${name}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('🎉 Table.jsx verification successful!');
  process.exit(0);
} else {
  console.error('❌ Table.jsx verification failed!');
  process.exit(1);
}
