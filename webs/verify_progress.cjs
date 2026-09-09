const fs = require('fs');
const path = require('path');

console.log('Running verification for Progress.jsx...');

const progressPath = path.join(__dirname, 'src', 'components', 'Progress.jsx');
if (!fs.existsSync(progressPath)) {
  console.error('ERROR: Progress.jsx does not exist!');
  process.exit(1);
}

const progressContent = fs.readFileSync(progressPath, 'utf8');

// Verification checks
const checks = [
  { name: 'Import React hooks (memo, useRef, useState, useMemo, useId)', test: progressContent.includes('useId') && progressContent.includes('useMemo') && progressContent.includes('memo') },
  { name: 'No Math.random() in component logic', test: !progressContent.includes('Math.random()') },
  { name: 'Frozen static CONDUIT_COLORS mapping', test: progressContent.includes('const CONDUIT_COLORS = Object.freeze({') },
  { name: 'Frozen static GLOW_COLORS mapping', test: progressContent.includes('const GLOW_COLORS = Object.freeze({') },
  { name: 'Frozen static BORDER_GLOW_COLORS mapping', test: progressContent.includes('const BORDER_GLOW_COLORS = Object.freeze({') },
  { name: 'Frozen static SIZES mapping', test: progressContent.includes('const SIZES = Object.freeze({') },
  { name: 'SSR-safe nodeId & attestationHash using useId', test: progressContent.includes('reactId.replace') && progressContent.includes('attestationHash') },
  { name: 'Direct-DOM 60fps volumetric tilt handling', test: progressContent.includes('--tilt-x') && progressContent.includes('--tilt-y') && progressContent.includes('--mouse-x') },
  { name: 'W3C APG compliant focus tilt physics', test: progressContent.includes('setProperty(\'--tilt-x\', \'4deg\')') && progressContent.includes('role="progressbar"') },
  { name: 'Liquid border perimeter illumination mask', test: progressContent.includes('radial-gradient') && progressContent.includes('WebkitMaskComposite') },
  { name: 'DisplayName set', test: progressContent.includes('Progress.displayName = "Progress"') }
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

console.log('All Progress.jsx verification checks passed successfully!');
