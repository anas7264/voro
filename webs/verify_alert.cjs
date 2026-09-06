const fs = require('fs');
const path = require('path');

console.log('⚡ Starting Alert.jsx Component Verification...');

const alertPath = path.join(__dirname, 'src', 'components', 'Alert.jsx');
if (!fs.existsSync(alertPath)) {
  console.error('ERROR: Alert.jsx does not exist!');
  process.exit(1);
}

const alertContent = fs.readFileSync(alertPath, 'utf8');

// Verification checks
const checks = [
  { name: 'Import React hooks (memo, useRef, useState, useId, useMemo)', test: alertContent.includes('useId') && alertContent.includes('useMemo') && alertContent.includes('memo') && alertContent.includes('useRef') },
  { name: 'Frozen static ICONS mapping', test: alertContent.includes('const ICONS = Object.freeze({') },
  { name: 'Frozen static VARIANTS mapping', test: alertContent.includes('const VARIANTS = Object.freeze({') },
  { name: 'Frozen static STATUS_GLOW mapping', test: alertContent.includes('const STATUS_GLOW = Object.freeze({') },
  { name: 'Frozen static ATMOSPHERIC_GLOW mapping', test: alertContent.includes('const ATMOSPHERIC_GLOW = Object.freeze({') },
  { name: 'Frozen static PERIMETER_GLOW mapping', test: alertContent.includes('const PERIMETER_GLOW = Object.freeze({') },
  { name: 'SSR-safe subpixelHash using useId (no Math.random)', test: !alertContent.includes('Math.random()') && alertContent.includes('0xALT_') && alertContent.includes('generatedId.replace') },
  { name: 'Direct-DOM 60fps tilt tracking', test: alertContent.includes('--tilt-x') && alertContent.includes('--tilt-y') && alertContent.includes('containerRef.current.style') },
  { name: 'Live spatial coordinate telemetry overlays', test: alertContent.includes('tiltXRef') && alertContent.includes('tiltYRef') && alertContent.includes('TX_') },
  { name: 'W3C APG compliant static 4-degree focus tilt', test: alertContent.includes('4.00deg') && alertContent.includes('-4.00deg') },
  { name: 'Dynamic liquid border illumination mask', test: alertContent.includes('radial-gradient') && alertContent.includes('WebkitMaskComposite') },
  { name: 'Dismiss button with accessible ARIA label', test: alertContent.includes('onClose') && alertContent.includes('aria-label') },
  { name: 'W3C APG Role & Attributes', test: alertContent.includes('role="alert"') && alertContent.includes('aria-atomic="true"') && alertContent.includes('tabIndex={0}') },
  { name: 'DisplayName set', test: alertContent.includes('Alert.displayName = "Alert"') }
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

console.log('🎉 Alert component verification successful!');
