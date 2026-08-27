const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

console.log('⚡ Starting Luxury Progress Component Verification...');

const filePath = path.join(__dirname, 'src/components/Progress.jsx');
const content = fs.readFileSync(filePath, 'utf8');

// 1. ESBuild Compilation Check
try {
  esbuild.transformSync(content, { loader: 'jsx' });
  console.log('✅ Progress.jsx ESBuild compilation passed cleanly.');
} catch (err) {
  console.error('❌ Progress.jsx ESBuild compilation failed:', err);
  process.exit(1);
}

// 2. Code Structure Verification
const checks = [
  { pattern: /Object\.freeze\(\{/, description: 'Frozen static style/color lookups' },
  { pattern: /--tilt-x/, description: 'Direct-DOM tilt-x tracking' },
  { pattern: /--tilt-y/, description: 'Direct-DOM tilt-y tracking' },
  { pattern: /--mouse-x/, description: 'Direct-DOM mouse-x spot tracking' },
  { pattern: /--mouse-y/, description: 'Direct-DOM mouse-y spot tracking' },
  { pattern: /TX_/, description: 'Monospaced spatial tilt X telemetry' },
  { pattern: /TY_/, description: 'Monospaced spatial tilt Y telemetry' },
  { pattern: /role="progressbar"/, description: 'W3C APG progressbar ARIA role' },
  { pattern: /aria-valuenow/, description: 'W3C APG aria-valuenow telemetry' },
  { pattern: /font-serif italic/, description: 'Forge Playfair Display luxury serif typography' }
];

let allPassed = true;
checks.forEach(({ pattern, description }) => {
  if (pattern.test(content)) {
    console.log(`✅ Verified: ${description}`);
  } else {
    console.error(`❌ Missing requirement: ${description}`);
    allPassed = false;
  }
});

if (!allPassed) {
  console.error('❌ Verification failed: Some luxury design or performance tokens are missing.');
  process.exit(1);
}

console.log('🚀 All Progress.jsx verification checks passed successfully!');
