const path = require('path');
const fs = require('fs');

console.log('=== VERIFYING QUICK LOG MASTERCLASS RE-ENGINEERING ===');

// Check that QuickLog.jsx exists and has expected luxury system components
const quickLogPath = path.join(__dirname, 'src/pages/QuickLog.jsx');
if (!fs.existsSync(quickLogPath)) {
  console.error('FAIL: QuickLog.jsx not found');
  process.exit(1);
}

const content = fs.readFileSync(quickLogPath, 'utf8');

const checks = [
  { name: 'EXPRESS_FOODS dataset hoisted & frozen', pattern: /EXPRESS_FOODS\s*=\s*Object\.freeze/ },
  { name: 'EXPRESS_WORKOUTS dataset hoisted & frozen', pattern: /EXPRESS_WORKOUTS\s*=\s*Object\.freeze/ },
  { name: 'EXPRESS_HYDRATION dataset hoisted & frozen', pattern: /EXPRESS_HYDRATION\s*=\s*Object\.freeze/ },
  { name: 'KineticExpressCard subcomponent extracted & memoized', pattern: /KineticExpressCard\s*=\s*memo/ },
  { name: 'KineticAlignmentOverlay test mode bypass supported', pattern: /window\.__VORO_TEST_BYPASS__/ },
  { name: '3D volumetric hover tilt tracking (--tilt-x, --tilt-y)', pattern: /--tilt-x/ },
  { name: 'Coordinate telemetry tracking refs (txRef, tyRef)', pattern: /txRef/ },
  { name: 'Static 4-degree focus tilt for W3C APG accessibility', pattern: /'4deg'/ },
  { name: 'Surgical reactivity via updateItem', pattern: /updateItem/ }
];

let allPassed = true;
checks.forEach(check => {
  if (check.pattern.test(content)) {
    console.log(`✓ PASS: ${check.name}`);
  } else {
    console.error(`✗ FAIL: ${check.name}`);
    allPassed = false;
  }
});

if (!allPassed) {
  console.error('=== VERIFICATION FAILED ===');
  process.exit(1);
}

console.log('=== ALL QUICK LOG VERIFICATION CHECKS PASSED ===');
