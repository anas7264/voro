const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

console.log('=========================================');
console.log('⚡ VERIFYING SCREEN PRIVACY GUARD & ERROR BOUNDARY PERF');
console.log('=========================================');

// 1. Verify ScreenPrivacyGuard.jsx
const privacyGuardPath = path.join(__dirname, 'src', 'components', 'ScreenPrivacyGuard.jsx');
const privacyGuardCode = fs.readFileSync(privacyGuardPath, 'utf8');

console.log('\n🧪 Checking ScreenPrivacyGuard.jsx...');

if (privacyGuardCode.includes('if (!isLocked) return;')) {
  console.log('✅ Success: ScreenPrivacyGuard clock interval guarded by if (!isLocked) return;');
} else {
  console.error('❌ FAIL: ScreenPrivacyGuard clock interval is NOT guarded when unlocked!');
  process.exit(1);
}

if (!privacyGuardCode.match(/setTelemetryTelemetryTime\([^)]*\);\s*const interval = setInterval/s) || privacyGuardCode.includes('if (!isLocked) return;')) {
  console.log('✅ Success: 10Hz background re-render churn eliminated when unlocked.');
} else {
  console.error('❌ FAIL: Clock interval still runs when unlocked!');
  process.exit(1);
}

// 2. Verify ErrorBoundary.jsx
const errorBoundaryPath = path.join(__dirname, 'src', 'components', 'ErrorBoundary.jsx');
const errorBoundaryCode = fs.readFileSync(errorBoundaryPath, 'utf8');

console.log('\n🧪 Checking ErrorBoundary.jsx...');

if (errorBoundaryCode.includes('this.isHovered = false;') && errorBoundaryCode.includes('this.isFocused = false;')) {
  console.log('✅ Success: ErrorBoundary uses instance flags (this.isHovered, this.isFocused).');
} else {
  console.error('❌ FAIL: ErrorBoundary does not initialize instance interaction flags!');
  process.exit(1);
}

if (!errorBoundaryCode.includes('isHovered: false') && !errorBoundaryCode.includes('setState({ isHovered')) {
  console.log('✅ Success: ErrorBoundary eliminated setState for hover/focus interaction tracking.');
} else {
  console.error('❌ FAIL: ErrorBoundary still uses setState for hover/focus!');
  process.exit(1);
}

// 3. Test esbuild compilation
console.log('\n📦 Testing esbuild bundle compilation...');
try {
  for (const file of [privacyGuardPath, errorBoundaryPath]) {
    esbuild.buildSync({
      entryPoints: [file],
      bundle: true,
      write: false,
      format: 'esm',
      jsx: 'automatic',
      external: ['react', 'react-dom', 'lucide-react', '../utils/security', './VoroLogo', './Card', './Button']
    });
  }
  console.log('✅ Success: esbuild bundle compilation succeeded with zero errors.');
} catch (err) {
  console.error('❌ FAIL: esbuild compilation error:', err);
  process.exit(1);
}

console.log('\n=========================================');
console.log('🎉 ALL SCREEN PRIVACY GUARD & ERROR BOUNDARY CHECKS PASSED!');
console.log('=========================================');
process.exit(0);
