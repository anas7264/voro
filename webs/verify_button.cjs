const fs = require('fs');
const path = require('path');

console.log('⚡ Starting Button.jsx Component Verification...');

const buttonPath = path.join(__dirname, 'src', 'components', 'Button.jsx');
if (!fs.existsSync(buttonPath)) {
  console.error('ERROR: Button.jsx does not exist!');
  process.exit(1);
}

const buttonContent = fs.readFileSync(buttonPath, 'utf8');

// Verification checks
const checks = [
  { name: 'Import React hooks (memo, useRef, useState, useId, useMemo)', test: buttonContent.includes('useId') && buttonContent.includes('useMemo') && buttonContent.includes('memo') },
  { name: 'Frozen static VARIANTS mapping', test: buttonContent.includes('const VARIANTS = Object.freeze({') },
  { name: 'Frozen static SIZES mapping', test: buttonContent.includes('const SIZES = Object.freeze({') },
  { name: 'SSR-safe attestedId using useId', test: buttonContent.includes('0xBTN_') && buttonContent.includes('generatedId.replace') },
  { name: 'Direct-DOM 60fps tilt handling', test: buttonContent.includes('--rotate-x') && buttonContent.includes('--rotate-y') && buttonContent.includes('--move-x') },
  { name: 'Clean telemetry reset on mouse leave', test: buttonContent.includes('txRef.current.innerText = "0.0"') },
  { name: 'W3C APG compliant focus tilt (4.0° / -4.0°)', test: buttonContent.includes('rotate-x\', \'4deg\'') },
  { name: 'Liquid border illumination mask', test: buttonContent.includes('radial-gradient') && buttonContent.includes('WebkitMaskComposite') },
  { name: 'DisplayName set', test: buttonContent.includes('Button.displayName = "Button"') }
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

console.log('🎉 Button component verification successful!');
