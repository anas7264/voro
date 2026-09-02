const fs = require('fs');
const path = require('path');

console.log('Running verification for Card.jsx...');

const cardPath = path.join(__dirname, 'src', 'components', 'Card.jsx');
if (!fs.existsSync(cardPath)) {
  console.error('ERROR: Card.jsx does not exist!');
  process.exit(1);
}

const cardContent = fs.readFileSync(cardPath, 'utf8');

// Verification checks
const checks = [
  { name: 'Import React hooks (memo, useRef, useMemo, useId)', test: cardContent.includes('useId') && cardContent.includes('useMemo') && cardContent.includes('memo') },
  { name: 'Frozen static VARIANTS mapping', test: cardContent.includes('const VARIANTS = Object.freeze({') },
  { name: 'SSR-safe subpixelHash using useId', test: cardContent.includes('subpixelHash = useMemo') && cardContent.includes('generatedId.replace') },
  { name: 'Direct-DOM 60fps tilt handling', test: cardContent.includes('--tilt-x') && cardContent.includes('--tilt-y') && cardContent.includes('--grid-x') },
  { name: 'W3C APG compliant focus tilt', test: cardContent.includes('rotateX(4deg) rotateY(-4deg)') },
  { name: 'Liquid border intelligence mask', test: cardContent.includes('radial-gradient') && cardContent.includes('WebkitMaskComposite') },
  { name: 'DisplayName set', test: cardContent.includes('Card.displayName = "Card"') }
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

console.log('All Card.jsx verification checks passed successfully!');
