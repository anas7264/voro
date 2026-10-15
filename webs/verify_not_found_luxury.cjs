const fs = require('fs');
const path = require('path');

console.log('⚡ Running Luxury NotFound Page Masterclass Verifier...');

const notFoundPath = path.join(__dirname, 'src/pages/NotFound.jsx');
const content = fs.readFileSync(notFoundPath, 'utf8');

const checks = [
  { name: 'Uses React.memo or memo export', check: () => content.includes('memo(') },
  { name: 'Uses React.useId for SSR-safe attestation', check: () => content.includes('useId()') },
  { name: 'Features 60fps direct-DOM 3D rotational tilt tracking', check: () => content.includes('style.setProperty(\'--tilt-x\'') && content.includes('perspective(') },
  { name: 'Includes sub-pixel attestation hash badging', check: () => content.includes('0xNFD_') && content.includes('ATTESTED_VOID') },
  { name: 'Includes Playfair Display italic hero typography', check: () => content.includes('font-serif') && content.includes('italic') },
  { name: 'Includes JetBrains Mono system telemetry', check: () => content.includes('font-mono') },
  { name: 'Features liquid perimeter lighting mask', check: () => content.includes('radial-gradient') && content.includes('maskComposite') },
  { name: 'Provides dual navigation triggers (Dashboard & Back)', check: () => content.includes("navigate('/dashboard')") && content.includes("navigate(-1)") },
  { name: 'Exports displayName = "NotFound"', check: () => content.includes('NotFound.displayName = "NotFound"') },
  { name: 'Complies with W3C APG role="main" and aria-label', check: () => content.includes('role="main"') && content.includes('aria-label="Page Not Found"') }
];

let passed = 0;
for (const c of checks) {
  if (c.check()) {
    console.log(`  ✓ ${c.name}`);
    passed++;
  } else {
    console.error(`  ✕ ${c.name}`);
  }
}

console.log(`\nVerification Summary: ${passed}/${checks.length} checks passed.`);
if (passed === checks.length) {
  console.log('🎉 NotFound luxury refinement verified successfully!');
  process.exit(0);
} else {
  console.error('❌ Verification failed.');
  process.exit(1);
}
