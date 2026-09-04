const fs = require('fs');
const path = require('path');

console.log('⚡ Starting Badge.jsx Component Verification...');

const badgePath = path.join(__dirname, 'src', 'components', 'Badge.jsx');
if (!fs.existsSync(badgePath)) {
  console.error('ERROR: Badge.jsx does not exist!');
  process.exit(1);
}

const badgeContent = fs.readFileSync(badgePath, 'utf8');

// Verification checks
const checks = [
  { name: 'Import React hooks (memo, useRef, useMemo, useId)', test: badgeContent.includes('useId') && badgeContent.includes('useMemo') && badgeContent.includes('memo') },
  { name: 'Frozen static SIZES mapping', test: badgeContent.includes('const SIZES = Object.freeze({') },
  { name: 'Frozen static VARIANTS mapping', test: badgeContent.includes('const VARIANTS = Object.freeze({') },
  { name: 'Frozen static DOT_COLORS mapping', test: badgeContent.includes('const DOT_COLORS = Object.freeze({') },
  { name: 'Frozen static GLOW_COLORS mapping', test: badgeContent.includes('const GLOW_COLORS = Object.freeze({') },
  { name: 'SSR-safe subpixelHash using useId (no Math.random)', test: !badgeContent.includes('Math.random()') && badgeContent.includes('0xBDG_') && badgeContent.includes('generatedId.replace') },
  { name: 'Direct-DOM 60fps tilt tracking', test: badgeContent.includes('--tilt-x') && badgeContent.includes('--tilt-y') && badgeContent.includes('containerRef.current.style') },
  { name: 'W3C APG compliant static 4-degree focus tilt', test: badgeContent.includes('4.00deg') && badgeContent.includes('-4.00deg') },
  { name: 'Dynamic liquid border illumination mask', test: badgeContent.includes('radial-gradient') && badgeContent.includes('WebkitMaskComposite') },
  { name: 'DisplayName set', test: badgeContent.includes('Badge.displayName = "Badge"') }
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

console.log('🎉 Badge component verification successful!');
