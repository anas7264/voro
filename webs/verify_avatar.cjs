const fs = require('fs');
const path = require('path');

const avatarFilePath = path.join(__dirname, 'src/components/Avatar.jsx');
const content = fs.readFileSync(avatarFilePath, 'utf8');

console.log('--- Verifying Avatar.jsx ---');

// 1. Check for export
if (!content.includes('export const Avatar = memo(')) {
  console.error('FAIL: Avatar not exported properly');
  process.exit(1);
}

// 2. Check for initials derivation
if (!content.includes('displayInitials') || !content.includes('initials.toUpperCase()')) {
  console.error('FAIL: displayInitials derivation missing or incorrect');
  process.exit(1);
}

// 3. Check for computedTitle micro-UX tooltip
if (!content.includes('computedTitle') || !content.includes('title={computedTitle}')) {
  console.error('FAIL: computedTitle micro-UX tooltip missing');
  process.exit(1);
}

// 4. Check for direct-DOM 3D volumetric tilt tracking
if (!content.includes('--tilt-x') || !content.includes('--tilt-y') || !content.includes('rotateX')) {
  console.error('FAIL: 3D volumetric tilt tracking missing');
  process.exit(1);
}

// 5. Check for subpixelHash attestation
if (!content.includes('0xAVT_')) {
  console.error('FAIL: subpixelHash attestation missing');
  process.exit(1);
}

// 6. Check for keyboard accessibility (handleKeyDown)
if (!content.includes('handleKeyDown') || !content.includes('Enter')) {
  console.error('FAIL: handleKeyDown W3C APG interaction missing');
  process.exit(1);
}

console.log('SUCCESS: All 6 static verification checks passed for Avatar.jsx!');
