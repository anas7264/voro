const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

console.log('⚡ Starting Daily Optimization v10 Performance Verification...\n');

const targetFiles = [
  'src/pages/PRRecords.jsx',
  'src/pages/AICoach.jsx',
  'src/pages/GymSetup.jsx',
  'src/pages/Periodization.jsx',
  'src/pages/Reports.jsx',
  'src/pages/ProgressPhotos.jsx',
];

let failed = false;

for (const relPath of targetFiles) {
  const fullPath = path.join(__dirname, relPath);
  console.log(`Checking ${relPath}...`);

  if (!fs.existsSync(fullPath)) {
    console.error(`  ❌ Error: File not found: ${relPath}`);
    failed = true;
    continue;
  }

  const fileContent = fs.readFileSync(fullPath, 'utf8');

  // Verify no useState tracking for hover or focus
  if (/useState\s*\(\s*(false|true)\s*\).*(Hover|Focus)/i.test(fileContent) ||
      /\[\s*isHovered\s*,\s*setIsHovered\s*\]\s*=\s*useState/i.test(fileContent) ||
      /\[\s*isFocused\s*,\s*setIsFocused\s*\]\s*=\s*useState/i.test(fileContent)) {
    console.error(`  ❌ Failed: ${relPath} still uses React useState for hover/focus tracking.`);
    failed = true;
    continue;
  }

  // ESBuild bundle verification
  try {
    esbuild.buildSync({
      entryPoints: [fullPath],
      bundle: true,
      write: false,
      loader: { '.js': 'jsx', '.jsx': 'jsx' },
      alias: {
        '@': path.join(__dirname, 'src')
      },
      external: [
        'react',
        'react-dom',
        'react-router-dom',
        'lucide-react',
        'recharts',
        'canvas-confetti',
        'jspdf',
        'jspdf-autotable'
      ]
    });
    console.log(`  ✅ ESBuild compilation passed cleanly for ${relPath}`);
  } catch (err) {
    console.error(`  ❌ ESBuild compilation error for ${relPath}:`, err.message);
    failed = true;
  }
}

if (failed) {
  console.error('\n❌ Verification FAILED!');
  process.exit(1);
} else {
  console.log('\n🎉 All 6 target files passed zero-allocation interaction reactivity checks!');
  process.exit(0);
}
