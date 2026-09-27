const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

console.log('⚡ Starting Confetti Component Luxury Refinement Verification...');

const confettiFilePath = path.join(__dirname, 'src', 'components', 'Confetti.jsx');
const content = fs.readFileSync(confettiFilePath, 'utf8');

const checks = [
  { name: 'ForwardRef usage', test: content.includes('forwardRef((') },
  { name: 'Explicit displayName', test: content.includes("Confetti.displayName = 'Confetti';") },
  { name: 'Direct DOM bannerRef', test: content.includes('bannerRef') && content.includes('showBannerUI') && content.includes('hideBannerUI') },
  { name: 'SSR-safe subpixel hash', test: content.includes('useId()') && content.includes('subpixelHash') },
  { name: 'Frozen BRAND_PALETTES', test: content.includes('BRAND_PALETTES = Object.freeze(') },
  { name: 'Aria live status region', test: content.includes('role="status"') && content.includes('aria-live="polite"') },
  { name: 'Imperative handle fire and reset', test: content.includes('useImperativeHandle(ref, () => ({') }
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

// Test esbuild bundle compilation
try {
  esbuild.buildSync({
    entryPoints: [confettiFilePath],
    bundle: true,
    write: false,
    format: 'esm',
    jsx: 'automatic',
    loader: { '.jsx': 'jsx' },
    external: ['react', 'react-dom', 'canvas-confetti']
  });
  console.log('✓ esbuild bundle compilation successful');
} catch (err) {
  console.error('✗ esbuild compilation error:', err);
  allPassed = false;
}

if (!allPassed) {
  console.error('❌ Verification failed!');
  process.exit(1);
}

console.log('🎉 Confetti.jsx luxury refinement verification complete!');
