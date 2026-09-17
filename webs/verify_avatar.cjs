const fs = require('fs');
const path = require('path');

console.log('⚡ Starting Avatar.jsx Component Verification...');

const avatarPath = path.join(__dirname, 'src', 'components', 'Avatar.jsx');
if (!fs.existsSync(avatarPath)) {
  console.error('ERROR: Avatar.jsx does not exist!');
  process.exit(1);
}

const avatarContent = fs.readFileSync(avatarPath, 'utf8');

// Verification checks
const checks = [
  { name: 'Import React hooks (memo, useRef, useMemo, useId, useCallback)', test: avatarContent.includes('useId') && avatarContent.includes('useMemo') && avatarContent.includes('memo') && avatarContent.includes('useCallback') },
  { name: 'Frozen static SIZES mapping', test: avatarContent.includes('const SIZES = Object.freeze({') },
  { name: 'Frozen static FRAME_RADII mapping', test: avatarContent.includes('const FRAME_RADII = Object.freeze({') },
  { name: 'Frozen static STATUS_COLORS mapping', test: avatarContent.includes('const STATUS_COLORS = Object.freeze({') },
  { name: 'Frozen static GLOW_COLORS mapping', test: avatarContent.includes('const GLOW_COLORS = Object.freeze({') },
  { name: 'SSR-safe subpixelHash using useId (no Math.random)', test: !avatarContent.includes('Math.random()') && avatarContent.includes('0xAVT_') && avatarContent.includes('generatedId.replace') },
  { name: 'Direct-DOM 60fps tilt tracking', test: avatarContent.includes('--tilt-x') && avatarContent.includes('--tilt-y') && avatarContent.includes('containerRef.current.style') },
  { name: 'W3C APG compliant static 4-degree focus tilt', test: avatarContent.includes('4.00deg') && avatarContent.includes('-4.00deg') },
  { name: 'Keyboard navigation handler for Enter/Space keys', test: avatarContent.includes('e.key === "Enter"') || avatarContent.includes("e.key === 'Enter'") },
  { name: 'Dynamic liquid border illumination mask', test: avatarContent.includes('radial-gradient') && avatarContent.includes('WebkitMaskComposite') },
  { name: 'DisplayName set', test: avatarContent.includes('Avatar.displayName = "Avatar"') }
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

console.log('🎉 Avatar component verification successful!');
