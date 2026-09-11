const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Verifying SecurityLockdown.jsx Re-engineering ---');

const filePath = path.join(__dirname, 'src', 'components', 'SecurityLockdown.jsx');
const content = fs.readFileSync(filePath, 'utf8');

// Verification 1: Memoization & Display Name
assert.ok(content.includes('const SecurityLockdown = memo('), 'SecurityLockdown should be memoized with React.memo');
assert.ok(content.includes("SecurityLockdown.displayName = 'SecurityLockdown'"), 'displayName must be explicitly assigned');

// Verification 2: SSR-safe deterministic badging using useId()
assert.ok(content.includes('useId()'), 'Must use React.useId() for SSR-safe deterministic badging');
assert.ok(content.includes('0xLCK_'), 'Must generate sub-pixel attestation hash badging');

// Verification 3: Direct-DOM 60fps 3D volumetric tilt tracking & liquid border
assert.ok(content.includes('--mouse-x'), 'Must support --mouse-x CSS variable');
assert.ok(content.includes('--mouse-y'), 'Must support --mouse-y CSS variable');
assert.ok(content.includes('--tilt-x'), 'Must support --tilt-x CSS variable');
assert.ok(content.includes('--tilt-y'), 'Must support --tilt-y CSS variable');
assert.ok(content.includes('perspective(1200px)'), 'Must apply 3D perspective transform');
assert.ok(content.includes('radial-gradient'), 'Must support liquid border spotlight illumination');

// Verification 4: W3C APG Dialog & Keyboard Accessibility
assert.ok(content.includes('role="dialog"'), 'Must specify role="dialog"');
assert.ok(content.includes('aria-modal="true"'), 'Must specify aria-modal="true"');
assert.ok(content.includes('aria-labelledby'), 'Must link title with aria-labelledby');
assert.ok(content.includes('aria-describedby'), 'Must link description with aria-describedby');

// Verification 5: Typography Pairing
assert.ok(content.includes('font-serif italic'), 'Must use Playfair Display italic serif headings');
assert.ok(content.includes('font-mono'), 'Must use JetBrains Mono font-mono telemetry');

// Verification 6: Symmetrical Telemetry Matrix
assert.ok(content.includes('CIRCUIT_BREAKER'), 'Telemetry matrix must list CIRCUIT_BREAKER');
assert.ok(content.includes('CIPHER_STATE'), 'Telemetry matrix must list CIPHER_STATE');
assert.ok(content.includes('INTEGRITY_SHIELD'), 'Telemetry matrix must list INTEGRITY_SHIELD');
assert.ok(content.includes('ATTESTATION_STAMP'), 'Telemetry matrix must list ATTESTATION_STAMP');

console.log('✅ All structural assertions passed successfully!');
