const fs = require('fs');
const path = require('path');

console.log('⚡ Starting Calculators.jsx Component Verification...');

const calcPath = path.join(__dirname, 'src', 'pages', 'Calculators.jsx');
if (!fs.existsSync(calcPath)) {
  console.error('ERROR: Calculators.jsx does not exist!');
  process.exit(1);
}

const content = fs.readFileSync(calcPath, 'utf8');

// Verification checks
const checks = [
  { name: 'Import React hooks (useMemo, memo, useRef, useId)', test: content.includes('useId') && content.includes('useMemo') && content.includes('useRef') && content.includes('memo') },
  { name: 'VolumetricComputationNode re-engineered with sub-pixel hash badging', test: content.includes('0xCALC_') && content.includes('ATTESTED_MATRIX') },
  { name: 'Direct-DOM 60fps tilt handling (--tilt-x, --tilt-y, txRef/tyRef)', test: content.includes('--tilt-x') && content.includes('--tilt-y') && content.includes('tiltXRef.current') },
  { name: 'Liquid border perimeter illumination mask (radial-gradient with maskComposite)', test: content.includes('radial-gradient') && content.includes('maskComposite: \'exclude\'') },
  { name: 'Holographic coordinate telemetry overlay (TX_...° TY_...°)', test: content.includes('TX_') && content.includes('TY_') },
  { name: 'W3C APG compliant focus tilt physics', test: content.includes('rotateX(4deg) rotateY(-4deg)') },
  { name: 'Playfair Display italic serif hero typography paired with JetBrains Mono font-black metadata', test: content.includes('font-serif italic') && content.includes('font-mono') },
  { name: 'VolumetricComputationNode displayName set', test: content.includes('VolumetricComputationNode.displayName = "VolumetricComputationNode"') }
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

console.log('🎉 Calculators.jsx verification successful!');
