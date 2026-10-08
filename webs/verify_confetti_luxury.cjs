const fs = require('fs');
const path = require('path');

console.log('⚡ Starting Confetti Luxury Refinement Verification...');

const confettiPath = path.join(__dirname, 'src', 'components', 'Confetti.jsx');
const content = fs.readFileSync(confettiPath, 'utf8');

const requiredTokens = [
  'BRAND_PALETTES',
  'DEFAULT_PALETTE',
  'handleMouseMove',
  'handleMouseEnter',
  'handleMouseLeave',
  'handleFocus',
  'handleBlur',
  '--tilt-x',
  '--tilt-y',
  '--mouse-x',
  '--mouse-y',
  'perspective(1000px)',
  'role="status"',
  'aria-live="polite"',
  'font-serif italic',
  'subpixelHash',
  'useImperativeHandle',
  'fire',
  'reset',
  'Dismiss milestone announcement'
];

let failed = false;
for (const token of requiredTokens) {
  if (!content.includes(token)) {
    console.error(` ❌ Verification Failed: Required token "${token}" missing from Confetti.jsx`);
    failed = true;
  } else {
    console.log(` ✓ Token verified: ${token}`);
  }
}

if (failed) {
  process.exit(1);
}

console.log('✨ Confetti Luxury Refinement Verification Passed Successfully!');
