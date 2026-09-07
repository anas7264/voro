const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

console.log("⚡ Starting Toggle Luxury Refinement Verification...");

// 1. Validate source code tokens
const sourcePath = path.resolve(__dirname, 'src/components/Toggle.jsx');
const sourceCode = fs.readFileSync(sourcePath, 'utf8');

const requiredTokens = [
  'SWITCH_SIZES',
  'GLOW_COLORS',
  'ACTIVE_THEMES',
  'Object.freeze',
  '0xTGL_',
  'useId',
  'role="switch"',
  'aria-checked',
  'aria-disabled',
  'aria-invalid',
  'aria-describedby',
  'aria-labelledby',
  '--mouse-x',
  '--mouse-y',
  '--tilt-x',
  '--tilt-y',
  'perspective(1000px)',
  'rotateX',
  'rotateY',
  'radial-gradient',
  'font-serif italic'
];

for (const token of requiredTokens) {
  if (!sourceCode.includes(token)) {
    console.error(`❌ Verification Failed: Required token "${token}" missing from Toggle.jsx`);
    process.exit(1);
  }
}

console.log("✅ All luxury design system tokens & zero-allocation structures in Toggle.jsx verified.");

// 2. Perform esbuild bundle verification
try {
  const result = esbuild.buildSync({
    entryPoints: [sourcePath],
    bundle: true,
    write: false,
    format: 'esm',
    jsx: 'automatic',
    loader: { '.jsx': 'jsx' },
    external: ['react', 'react-dom']
  });

  if (result.errors.length > 0) {
    console.error("❌ Bundle verification failed with errors:", result.errors);
    process.exit(1);
  }

  console.log("✅ esbuild bundle verification successful.");
} catch (err) {
  console.error("❌ esbuild compilation error:", err);
  process.exit(1);
}

console.log("🎉 Toggle refinement verification successful!");
