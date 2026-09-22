const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

console.log('⚡ Starting Daily Optimization v11 Performance Verification...\n');

const targetFiles = [
  'src/pages/PerformanceMetrics.jsx',
  'src/pages/BodyComposition.jsx',
  'src/pages/RecipeLibrary.jsx',
  'src/pages/Achievements.jsx',
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
      /\[\s*isFocused\s*,\s*setIsFocused\s*\]\s*=\s*useState/i.test(fileContent) ||
      /\[\s*isHeroHovered\s*,\s*setIsHeroHovered\s*\]\s*=\s*useState/i.test(fileContent) ||
      /\[\s*isHeroFocused\s*,\s*setIsHeroFocused\s*\]\s*=\s*useState/i.test(fileContent)) {
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
  console.log('\n🎉 All 4 target files passed zero-allocation interaction reactivity checks!');
  process.exit(0);
}
