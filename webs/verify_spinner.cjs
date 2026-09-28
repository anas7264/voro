const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('⚡ Starting Spinner Luxury Architecture Verification...');

const filePath = path.join(__dirname, 'src/components/Spinner.jsx');
const content = fs.readFileSync(filePath, 'utf8');

// Check 1: Frozen static SIZE_MAP and COLOR_MAP mappings
assert.strictEqual(
  content.includes('Object.freeze(') && content.includes('SIZE_MAP = Object.freeze') && content.includes('COLOR_MAP = Object.freeze'),
  true,
  'Check 1 Failed: Frozen static SIZE_MAP and COLOR_MAP mappings missing'
);

// Check 2: SSR-safe useId import and usage
assert.strictEqual(
  content.includes('useId') && content.includes('const reactId = useId()'),
  true,
  'Check 2 Failed: useId hook usage for SSR-safe identification missing'
);

// Check 3: Sub-pixel attestation hash badging (0xSPN_..._ATTESTED_CORE)
assert.strictEqual(
  content.includes('0xSPN_') && content.includes('_ATTESTED_CORE'),
  true,
  'Check 3 Failed: Sub-pixel attestation hash badging missing'
);

// Check 4: Playfair Display italic typography (font-serif italic)
assert.strictEqual(
  content.includes('font-serif italic'),
  true,
  'Check 4 Failed: Playfair Display italic typography missing'
);

// Check 5: JetBrains Mono font-black metadata
assert.strictEqual(
  content.includes('font-mono font-black'),
  true,
  'Check 5 Failed: JetBrains Mono font-black system metadata missing'
);

// Check 6: W3C APG status live-region accessibility (role="status" and aria-live="polite")
assert.strictEqual(
  content.includes('role="status"') && content.includes('aria-live="polite"'),
  true,
  'Check 6 Failed: W3C APG role="status" and aria-live="polite" attributes missing'
);

// Check 7: Direct-DOM telemetry stream updates (telemetryRef)
assert.strictEqual(
  content.includes('telemetryRef1.current.innerText') && content.includes('telemetryRef2.current.innerText'),
  true,
  'Check 7 Failed: Direct-DOM telemetry text updates missing'
);

// Check 8: DisplayName set to "Spinner"
assert.strictEqual(
  content.includes('Spinner.displayName = "Spinner"'),
  true,
  'Check 8 Failed: Spinner.displayName set missing'
);

console.log('✅ All 8/8 Spinner Luxury Architecture checks passed successfully!');
