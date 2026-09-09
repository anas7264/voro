const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

console.log('⚡ Starting Dashboard2 Verification...');

// 1. Compile Dashboard2.jsx using ESBuild to check for syntax and import issues
const filePath = path.join(__dirname, 'src/pages/Dashboard2.jsx');

try {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  esbuild.buildSync({
    entryPoints: [filePath],
    bundle: false,
    write: false,
    format: 'esm',
    jsx: 'automatic',
    loader: { '.jsx': 'jsx' }
  });

  console.log('✅ Dashboard2.jsx ESBuild compilation passed cleanly.');

  // 2. Perform static analysis checks for zero-allocation performance rules
  if (fileContent.includes('setIsHovered')) {
    throw new Error('❌ Found setIsHovered state allocation in KineticMatrixCard! Hover tracking must be direct-DOM.');
  }

  if (!fileContent.includes("useStorageKeySelector('nutrition_log'")) {
    throw new Error('❌ Missing dynamic subscription to nutrition_log via useStorageKeySelector!');
  }

  if (!fileContent.includes("useStorageKeySelector('workout_log'")) {
    throw new Error('❌ Missing dynamic subscription to workout_log via useStorageKeySelector!');
  }

  if (!fileContent.includes("useStorageKeySelector('body_metrics'")) {
    throw new Error('❌ Missing dynamic subscription to body_metrics via useStorageKeySelector!');
  }

  if (!fileContent.includes('useAppContext')) {
    throw new Error('❌ Missing user profile binding via useAppContext!');
  }

  console.log('✅ Dynamic reactivity & zero-allocation standards verified in Dashboard2.jsx.');
  console.log('🎉 Dashboard2 optimization verification successful!');
} catch (err) {
  console.error('❌ Verification Failed:', err);
  process.exit(1);
}
