const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('⚡ Starting LoadingSpinner Luxury Architecture Verification...');

const filePath = path.join(__dirname, 'src/components/LoadingSpinner.jsx');
const content = fs.readFileSync(filePath, 'utf8');

// Check 1: Direct-DOM status stream manipulation ref (zero-allocation)
assert.strictEqual(
  content.includes('statusTextRef.current.innerText'),
  true,
  'Check 1 Failed: Direct-DOM status text updates missing'
);

// Check 2: 3D volumetric tilt handlers and CSS variables
assert.strictEqual(
  content.includes('handleMouseMove') && content.includes('--tilt-x') && content.includes('--tilt-y'),
  true,
  'Check 2 Failed: Direct-DOM 3D volumetric tilt tracking missing'
);

// Check 3: Playfair Display italic serif hero typography
assert.strictEqual(
  content.includes('font-serif italic') && content.includes('font-medium text-white'),
  true,
  'Check 3 Failed: Playfair Display italic typography missing'
);

// Check 4: JetBrains Mono system telemetry and font-mono status metadata
assert.strictEqual(
  content.includes('font-mono font-black') && content.includes('font-mono font-bold'),
  true,
  'Check 4 Failed: JetBrains Mono font-bold/font-black system telemetry metadata missing'
);

// Check 5: SSR-safe sub-pixel attestation hash badging (0xLDR_..._ATTESTED_CHAMBER)
assert.strictEqual(
  content.includes('0xLDR_') && content.includes('_ATTESTED_CHAMBER'),
  true,
  'Check 5 Failed: Sub-pixel attestation hash badging missing'
);

// Check 6: Dynamic magnetic liquid border perimeter illumination mask
assert.strictEqual(
  content.includes('radial-gradient') && content.includes('maskComposite'),
  true,
  'Check 6 Failed: Liquid border perimeter illumination mask missing'
);

// Check 7: W3C APG ARIA live region status accessibility
assert.strictEqual(
  content.includes('role="status"') && content.includes('aria-live="polite"') && content.includes('aria-busy="true"'),
  true,
  'Check 7 Failed: W3C APG accessibility attributes missing'
);

// Check 8: Absence of useState import / calls in LoadingSpinner to avoid component re-renders
assert.strictEqual(
  !content.includes('useState(') && !content.includes('useState'),
  true,
  'Check 8 Failed: useState found in LoadingSpinner (must use direct-DOM useRef)'
);

console.log('✅ All 8/8 LoadingSpinner Luxury Architecture checks passed successfully!');
