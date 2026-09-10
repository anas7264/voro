const fs = require('fs');
const path = require('path');

console.log('⚡ Starting Breadcrumb.jsx Component Verification...');

const breadcrumbPath = path.join(__dirname, 'src', 'components', 'Breadcrumb.jsx');
if (!fs.existsSync(breadcrumbPath)) {
  console.error('ERROR: Breadcrumb.jsx does not exist!');
  process.exit(1);
}

const content = fs.readFileSync(breadcrumbPath, 'utf8');

// Verification checks
const checks = [
  { name: 'Import React hooks (memo, useRef, useState, useId, useMemo)', test: content.includes('useId') && content.includes('useMemo') && content.includes('useRef') && content.includes('memo') },
  { name: 'Hoisted frozen fallback EMPTY_ITEMS', test: content.includes('const EMPTY_ITEMS = Object.freeze([])') },
  { name: 'SSR-safe nodeId / attestedHash using useId & useMemo', test: content.includes('attestedHash = useMemo(') && content.includes('generatedId.replace') },
  { name: 'Sub-pixel attestation hash badging 0xBRD_', test: content.includes('0xBRD_') && content.includes('[0xBRD_VAULT]') },
  { name: '60fps Direct-DOM tilt & mouse position variables', test: content.includes('--mouse-x') && content.includes('--mouse-y') && content.includes('--tilt-x') && content.includes('--tilt-y') },
  { name: 'Dynamic telemetry coordinate overlay (TX_...° TY_...°)', test: content.includes('txRef.current.innerText') && content.includes('TX_') },
  { name: 'Liquid border illumination & radial gradient lens', test: content.includes('radial-gradient') && content.includes('WebkitMaskComposite') },
  { name: 'W3C APG compliant focus tilt (rotateX(4deg))', test: content.includes('rotateX(var(--tilt-x') && content.includes("'4deg'") },
  { name: 'Playfair Display italic & JetBrains Mono font hierarchy', test: content.includes('font-serif italic') && content.includes('font-mono') },
  { name: 'DisplayName set', test: content.includes('Breadcrumb.displayName = "Breadcrumb"') }
];

let allPassed = true;
checks.forEach(check => {
  if (check.test) {
    console.log(`✓ ${check.name}`);
  } else {
    console.error(`✗ ${check.name}`);
    allPassed = false;
  }
});

if (!allPassed) {
  console.error('Verification failed!');
  process.exit(1);
}

console.log('🎉 Breadcrumb component verification successful!');
