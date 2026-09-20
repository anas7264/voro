const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

async function runVerification() {
  console.log("⚡ Starting Daily Optimization v9 Performance Verification...");

  const targetFiles = [
    'src/components/Sidebar.jsx',
    'src/pages/Dashboard.jsx',
    'src/pages/SavedTrainingPlans.jsx',
    'src/pages/SavedMealPlans.jsx'
  ];

  for (const relativePath of targetFiles) {
    const fullPath = path.resolve(__dirname, relativePath);
    console.log(`Checking ${relativePath}...`);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }

    const content = fs.readFileSync(fullPath, 'utf8');

    // 1. Verify zero useState calls for hover or focus in target components
    if (relativePath.includes('Sidebar.jsx')) {
      if (/const\s*\[\s*isHovered\s*,\s*setIsHovered\s*\]\s*=\s*useState/.test(content)) {
        throw new Error(`[PERF ERROR] Sidebar.jsx still contains useState for isHovered!`);
      }
      if (/const\s*\[\s*isFocused\s*,\s*setIsFocused\s*\]\s*=\s*useState/.test(content)) {
        throw new Error(`[PERF ERROR] Sidebar.jsx still contains useState for isFocused!`);
      }
      if (!content.includes('isHoveredRef') || !content.includes('isFocusedRef')) {
        throw new Error(`[PERF ERROR] Sidebar.jsx missing isHoveredRef/isFocusedRef zero-allocation refs!`);
      }
    }

    if (relativePath.includes('Dashboard.jsx')) {
      if (/const\s*\[\s*isHovered\s*,\s*setIsHovered\s*\]\s*=\s*useState/.test(content)) {
        throw new Error(`[PERF ERROR] Dashboard.jsx still contains useState for isHovered in VolumetricTelemetryNode!`);
      }
      if (/const\s*\[\s*heroHovered\s*,\s*setHeroHovered\s*\]\s*=\s*useState/.test(content)) {
        throw new Error(`[PERF ERROR] Dashboard.jsx still contains useState for heroHovered!`);
      }
      if (!content.includes('heroHoveredRef') || !content.includes('heroFocusedRef')) {
        throw new Error(`[PERF ERROR] Dashboard.jsx missing heroHoveredRef/heroFocusedRef zero-allocation refs!`);
      }
    }

    if (relativePath.includes('SavedTrainingPlans.jsx')) {
      if (/const\s*\[\s*isHovered\s*,\s*setIsHovered\s*\]\s*=\s*useState/.test(content)) {
        throw new Error(`[PERF ERROR] SavedTrainingPlans.jsx KineticBlueprintCard still contains useState for isHovered!`);
      }
      if (!content.includes('isHoveredRef') || !content.includes('isFocusedRef')) {
        throw new Error(`[PERF ERROR] SavedTrainingPlans.jsx missing isHoveredRef/isFocusedRef zero-allocation refs!`);
      }
    }

    if (relativePath.includes('SavedMealPlans.jsx')) {
      if (/const\s*\[\s*isHovered\s*,\s*setIsHovered\s*\]\s*=\s*useState/.test(content)) {
        throw new Error(`[PERF ERROR] SavedMealPlans.jsx SavedMealPlanCard still contains useState for isHovered!`);
      }
      if (!content.includes('isHoveredRef') || !content.includes('isFocusedRef')) {
        throw new Error(`[PERF ERROR] SavedMealPlans.jsx missing isHoveredRef/isFocusedRef zero-allocation refs!`);
      }
    }

    // 2. Test ESBuild bundle compilation
    try {
      await esbuild.build({
        entryPoints: [fullPath],
        bundle: true,
        write: false,
        jsx: 'automatic',
        loader: { '.jsx': 'jsx', '.js': 'jsx', '.png': 'dataurl', '.svg': 'dataurl' },
        alias: { '@': path.resolve(__dirname, 'src') },
        external: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'recharts', 'canvas-confetti', 'jspdf', 'jspdf-autotable']
      });
      console.log(`  ✅ ESBuild compilation passed cleanly for ${relativePath}`);
    } catch (buildErr) {
      console.error(`  ❌ ESBuild compilation failed for ${relativePath}:`, buildErr);
      process.exit(1);
    }
  }

  console.log("\n🎉 All 4 target files passed zero-allocation interaction reactivity checks!");
}

runVerification().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
