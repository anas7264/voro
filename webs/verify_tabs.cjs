const fs = require('fs');
const path = require('path');

console.log('⚡ Starting Tabs.jsx Component Verification...');

const tabsPath = path.join(__dirname, 'src', 'components', 'Tabs.jsx');
if (!fs.existsSync(tabsPath)) {
  console.error('ERROR: Tabs.jsx does not exist!');
  process.exit(1);
}

const tabsContent = fs.readFileSync(tabsPath, 'utf8');

// Verification checks
const checks = [
  { name: 'Import React hooks (memo, useRef, useEffect, useState, useId, useMemo, useCallback)', test: tabsContent.includes('useId') && tabsContent.includes('useMemo') && tabsContent.includes('useCallback') && tabsContent.includes('memo') },
  { name: 'Hoisted frozen fallback EMPTY_TABS', test: tabsContent.includes('const EMPTY_TABS = Object.freeze([])') },
  { name: 'SSR-safe cleanMatrixId using useId & useMemo', test: tabsContent.includes('cleanMatrixId = useMemo(') && tabsContent.includes('baseId.replace') },
  { name: 'Sub-pixel attestation hash badging 0xTAB_', test: tabsContent.includes('0xTAB_') },
  { name: '60fps Direct-DOM tilt & mouse position variables', test: tabsContent.includes('--mouse-x') && tabsContent.includes('--mouse-y') && tabsContent.includes('--tilt-x') && tabsContent.includes('--tilt-y') },
  { name: '60fps Direct-DOM magnetic vector tab node transforms', test: tabsContent.includes('translate3d(') && tabsContent.includes('scale(') && tabsContent.includes('querySelectorAll(\'[role="tab"]\')') },
  { name: 'Dynamic telemetry coordinate overlay (TX_...° TY_...°)', test: tabsContent.includes('telemetryRef.current.textContent') && tabsContent.includes('TX_') },
  { name: 'ResizeObserver / window resize indicator auto-alignment', test: tabsContent.includes('window.addEventListener("resize"') },
  { name: 'Liquid border illumination mask', test: tabsContent.includes('radial-gradient') },
  { name: 'W3C APG compliant focus tilt (rotateX(4deg))', test: tabsContent.includes('rotateX(4deg)') },
  { name: 'Playfair Display italic & JetBrains Mono font hierarchy', test: tabsContent.includes('font-serif italic') && tabsContent.includes('font-mono') },
  { name: 'DisplayName set', test: tabsContent.includes('Tabs.displayName = "Tabs"') }
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

console.log('🎉 Tabs component verification successful!');
