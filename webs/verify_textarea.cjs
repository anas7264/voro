const fs = require('fs');
const path = require('path');

console.log('=========================================');
console.log('🧪 VERIFYING LUXURY TEXTAREA NODE (Textarea.jsx)');
console.log('=========================================');

const textareaPath = path.join(__dirname, 'src', 'components', 'Textarea.jsx');
if (!fs.existsSync(textareaPath)) {
  console.error('❌ Textarea.jsx does not exist!');
  process.exit(1);
}

const code = fs.readFileSync(textareaPath, 'utf8');

// Verification checks
const checks = [
  { name: 'Forge Standard JSDoc Header', pattern: /⚡ REFINEMENT: Luxury Neural Textstream Node/ },
  { name: 'Direct-DOM Volumetric Tilt Tracking (useRef)', pattern: /containerRef\s*=\s*useRef/ },
  { name: 'Telemetry Coordinates (txRef & tyRef)', pattern: /txRef\s*=\s*useRef/ },
  { name: 'CSS Variables (--tilt-x, --tilt-y, --mouse-x, --mouse-y)', pattern: /setProperty\('--tilt-x'/ },
  { name: 'W3C APG Focus Tilt (4deg)', pattern: /setProperty\('--tilt-x',\s*'4deg'\)/ },
  { name: 'Holographic Coordinate Overlay (TX_...° TY_...°)', pattern: /TX_<span ref=\{txRef\}>0\.0<\/span>°/ },
  { name: 'Sub-pixel Hash Badge ([0xTXT_STREAM])', pattern: /\[0xTXT_STREAM\]/ },
  { name: 'Liquid Radial Light Spot', pattern: /radial-gradient\(180px circle at/ },
  { name: 'Active Edge Laser Indicator', pattern: /bg-voro-primary rounded-r-full/ },
  { name: 'Playfair Display Italic Placeholder Typography', pattern: /placeholder:font-serif placeholder:italic/ },
  { name: 'Accessibility Support (aria-invalid & aria-describedby)', pattern: /aria-invalid=\{!!error\}/ },
  { name: 'Prop Contract (label, required, maxLength, rows, error, disabled)', pattern: /rows=\{rows\}/ }
];

let failed = false;
checks.forEach((check, index) => {
  if (check.pattern.test(code)) {
    console.log(`✅ Test ${index + 1}: ${check.name} passed.`);
  } else {
    console.error(`❌ Test ${index + 1}: ${check.name} FAILED! Pattern mismatch.`);
    failed = true;
  }
});

if (failed) {
  console.error('\n❌ TEXTAREA NODE VERIFICATION FAILED!');
  process.exit(1);
}

console.log('\n🎉 ALL LUXURY TEXTAREA NODE VERIFICATION TESTS PASSED SUCCESSFULLY!');
console.log('=========================================');
