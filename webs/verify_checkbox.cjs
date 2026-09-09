const fs = require('fs');
const path = require('path');

console.log('⚡ Starting Checkbox Luxury Refinement Verification...');

const checkboxPath = path.join(__dirname, 'src', 'components', 'Checkbox.jsx');
const content = fs.readFileSync(checkboxPath, 'utf8');

const requiredTokens = [
  'CHECKBOX_SIZES',
  'ICON_SIZES',
  'GLOW_COLORS',
  'handleMouseMove',
  '--tilt-x',
  '--tilt-y',
  '--mouse-x',
  '--mouse-y',
  'perspective(1000px)',
  'role="checkbox"',
  'aria-checked',
  'htmlFor={inputId}',
  'font-serif italic'
];

let failed = false;
for (const token of requiredTokens) {
  if (!content.includes(token)) {
    console.error(` ❌ Verification Failed: Required token "${token}" missing from Checkbox.jsx`);
    failed = true;
  } else {
    console.log(` ✓ Token verified: ${token}`);
  }
}

if (failed) {
  process.exit(1);
}

console.log('✨ Checkbox Luxury Refinement Verification Passed Successfully!');
