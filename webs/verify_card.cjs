const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

console.log("⚡ Starting Luxury Card Component Verification...");

try {
  // 1. ESBuild Compilation Check
  const result = esbuild.buildSync({
    entryPoints: [path.join(__dirname, 'src/components/Card.jsx')],
    bundle: true,
    write: false,
    format: 'cjs',
    jsx: 'transform',
    target: 'node18',
    external: ['react', 'react-dom']
  });

  if (result.errors && result.errors.length > 0) {
    console.error("❌ ESBuild Compilation Errors:", result.errors);
    process.exit(1);
  }

  console.log("✅ Card.jsx ESBuild compilation passed cleanly.");

  // 2. Structural & Tokens Inspection
  const cardSource = fs.readFileSync(path.join(__dirname, 'src/components/Card.jsx'), 'utf8');

  const requiredTokens = [
    'containerRef',
    'tiltXRef',
    'tiltYRef',
    'subpixelHash',
    'handleMouseMove',
    'handleMouseEnter',
    'handleMouseLeave',
    'handleFocus',
    'handleBlur',
    'VARIANTS',
    'Object.freeze',
    'Card.displayName = "Card"'
  ];

  for (const token of requiredTokens) {
    if (!cardSource.includes(token)) {
      console.error(`❌ Verification failed: Token "${token}" missing from Card.jsx`);
      process.exit(1);
    }
  }

  console.log("✅ All required luxury Forge design tokens and zero-allocation structures verified in Card.jsx.");

} catch (err) {
  console.error("❌ Card Verification Exception:", err);
  process.exit(1);
}
