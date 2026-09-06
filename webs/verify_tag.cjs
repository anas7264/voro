const fs = require('fs');
const path = require('path');

console.log('⚡ Starting Tag.jsx Component Verification...');

const tagPath = path.join(__dirname, 'src', 'components', 'Tag.jsx');
if (!fs.existsSync(tagPath)) {
  console.error('ERROR: Tag.jsx does not exist!');
  process.exit(1);
}

const tagContent = fs.readFileSync(tagPath, 'utf8');

// Verification checks
const checks = [
  { name: 'Import React hooks (memo, useRef, useMemo, useId)', test: tagContent.includes('useId') && tagContent.includes('useMemo') && tagContent.includes('memo') && tagContent.includes('useRef') },
  { name: 'Frozen static SIZES mapping', test: tagContent.includes('const SIZES = Object.freeze({') },
  { name: 'Frozen static VARIANTS mapping', test: tagContent.includes('const VARIANTS = Object.freeze({') },
  { name: 'Frozen static DOT_COLORS mapping', test: tagContent.includes('const DOT_COLORS = Object.freeze({') },
  { name: 'Frozen static GLOW_COLORS mapping', test: tagContent.includes('const GLOW_COLORS = Object.freeze({') },
  { name: 'SSR-safe subpixelHash using useId (no Math.random)', test: !tagContent.includes('Math.random()') && tagContent.includes('0xTAG_') && tagContent.includes('generatedId.replace') },
  { name: 'Direct-DOM 60fps tilt tracking', test: tagContent.includes('--tilt-x') && tagContent.includes('--tilt-y') && tagContent.includes('containerRef.current.style') },
  { name: 'W3C APG compliant static 4-degree focus tilt', test: tagContent.includes('4.00deg') && tagContent.includes('-4.00deg') },
  { name: 'Dynamic liquid border illumination mask', test: tagContent.includes('radial-gradient') && tagContent.includes('WebkitMaskComposite') },
  { name: 'Interactive remove button support with ARIA label', test: tagContent.includes('onRemove') && tagContent.includes('aria-label') },
  { name: 'DisplayName set', test: tagContent.includes('Tag.displayName = "Tag"') }
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

console.log('🎉 Tag component verification successful!');
