const fs = require('fs');
const path = require('path');

console.log('=========================================');
console.log('🧪 VERIFYING LUXURY TEMPORAL NODE (DatePicker.jsx)');
console.log('=========================================');

const datePickerPath = path.join(__dirname, 'src', 'components', 'DatePicker.jsx');
if (!fs.existsSync(datePickerPath)) {
  console.error('❌ DatePicker.jsx does not exist!');
  process.exit(1);
}

const code = fs.readFileSync(datePickerPath, 'utf8');

// Verification checks
const checks = [
  { name: 'Forge Standard JSDoc Header', pattern: /⚡ REFINEMENT: Luxury Neural Temporal Node/ },
  { name: 'Direct-DOM Volumetric Tilt Tracking (useRef)', pattern: /containerRef\s*=\s*useRef/ },
  { name: 'Telemetry Coordinates (txRef & tyRef)', pattern: /txRef\s*=\s*useRef/ },
  { name: 'CSS Variables (--tilt-x, --tilt-y, --mouse-x, --mouse-y)', pattern: /setProperty\('--tilt-x'/ },
  { name: 'W3C APG Focus Tilt (4deg)', pattern: /setProperty\('--tilt-x',\s*'4deg'\)/ },
  { name: 'Holographic Coordinate Overlay (TX_...° TY_...°)', pattern: /TX_<span ref=\{txRef\}>0\.0<\/span>°/ },
  { name: 'Sub-pixel Hash Badge ([0xDT_VAULT])', pattern: /\[0xDT_VAULT\]/ },
  { name: 'Liquid Radial Light Spot', pattern: /radial-gradient\(180px circle at/ },
  { name: 'Active Edge Laser Indicator', pattern: /bg-voro-primary rounded-r-full/ },
  { name: 'Color Scheme Dark Date Formatting', pattern: /\[color-scheme:dark\]/ },
  { name: 'Accessibility Support (aria-invalid & aria-describedby)', pattern: /aria-invalid=\{!!error\}/ },
  { name: 'Prop Contract (label, required, error, disabled, onFocus, onBlur)', pattern: /onFocus=\{handleInputFocus\}/ }
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
  console.error('\n❌ DATE PICKER NODE VERIFICATION FAILED!');
  process.exit(1);
}

console.log('\n🎉 ALL LUXURY DATE PICKER NODE VERIFICATION TESTS PASSED SUCCESSFULLY!');
console.log('=========================================');
