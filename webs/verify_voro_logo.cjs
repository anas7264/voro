const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, 'src/components/VoroLogo.jsx');
const content = fs.readFileSync(logoPath, 'utf8');

console.log('Running verification for VoroLogo.jsx...');

// Checks
const checks = [
  {
    name: 'Import React hooks (memo)',
    pass: content.includes('import React, { memo } from \'react\';') || content.includes('import React, { memo')
  },
  {
    name: 'Export memoized component',
    pass: content.includes('memo(') && content.includes('VoroLogo.displayName = \'VoroLogo\';')
  },
  {
    name: 'W3C APG Keyboard accessibility (Enter and Space keys)',
    pass: content.includes('e.key === \'Enter\'') && content.includes('e.key === \' \'')
  },
  {
    name: 'Interactive role, tabIndex, action-oriented aria-label, and title tooltip',
    pass: content.includes("role: 'button'") && content.includes("tabIndex: 0") && content.includes("Navigate to Dashboard") && content.includes("computedTitle")
  },
  {
    name: 'Luxury neural brand signature structure (Kinetic rings & Playfair Display)',
    pass: content.includes('font-serif') && content.includes('animate-[spin-slow') && content.includes('animate-[spin-reverse')
  }
];

let allPassed = true;
checks.forEach(check => {
  if (check.pass) {
    console.log(`✓ ${check.name}`);
  } else {
    console.error(`✗ ${check.name}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('All VoroLogo.jsx verification checks passed successfully!');
} else {
  process.exit(1);
}
