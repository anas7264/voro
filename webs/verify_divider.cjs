const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

console.log("⚡ Starting Divider Component Verification...\n");

const filePath = path.join(__dirname, 'src', 'components', 'Divider.jsx');

// Step 1: Verify ESBuild Compilation
try {
  esbuild.buildSync({
    entryPoints: [filePath],
    bundle: true,
    write: false,
    format: 'esm',
    jsx: 'automatic',
    external: ['react', 'react-dom', 'lucide-react']
  });
  console.log("✅ Divider.jsx ESBuild compilation passed cleanly.");
} catch (err) {
  console.error("❌ Divider.jsx ESBuild compilation failed:", err);
  process.exit(1);
}

// Step 2: Source Code Token & Architecture Verification
const source = fs.readFileSync(filePath, 'utf8');

const requiredTokens = [
  'useId',
  'useMemo',
  'useRef',
  'memo',
  '--mouse-x',
  '--mouse-y',
  '--tilt-x',
  '--tilt-y',
  'radial-gradient',
  '0xDIV_STRATUM_',
  'role="separator"',
  'aria-orientation="horizontal"',
  'font-serif italic',
  'Divider.displayName = "Divider"'
];

let missing = [];
for (const token of requiredTokens) {
  if (!source.includes(token)) {
    missing.push(token);
  }
}

if (missing.length > 0) {
  console.error("❌ Missing required luxury design tokens:", missing);
  process.exit(1);
} else {
  console.log("✅ All required luxury design system tokens verified in Divider.jsx source.");
}

console.log("\n🎉 Divider component verification successful!");
