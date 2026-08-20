const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

console.log("⚡ Starting Header Component Verification...");

try {
  // Compile Header.jsx with esbuild to verify JSX syntax, imports, and exports
  const result = esbuild.buildSync({
    entryPoints: [path.join(__dirname, 'src/components/Header.jsx')],
    bundle: true,
    write: false,
    format: 'cjs',
    jsx: 'transform',
    target: 'node18',
    external: ['react', 'react-dom', 'lucide-react']
  });

  if (result.errors && result.errors.length > 0) {
    console.error("❌ ESBuild Compilation Errors:", result.errors);
    process.exit(1);
  }

  console.log("✅ Header.jsx ESBuild compilation passed cleanly.");

  // Check file presence and structure
  const headerSource = fs.readFileSync(path.join(__dirname, 'src/components/Header.jsx'), 'utf8');

  const requiredTokens = [
    'containerRef',
    'tiltXRef',
    'tiltYRef',
    'handleMouseMove',
    'handleFocus',
    'handleBlur',
    'Playfair Display',
    'JetBrains Mono',
    'attestedId',
    'nodeId',
    'Header.displayName = "Header"'
  ];

  for (const token of requiredTokens) {
    if (!headerSource.includes(token)) {
      console.error(`❌ Verification failed: Token "${token}" missing from Header.jsx`);
      process.exit(1);
    }
  }

  console.log("✅ All required luxury design system tokens verified in Header.jsx source.");
  console.log("🎉 Header component verification successful!");
} catch (err) {
  console.error("❌ Header Verification Exception:", err);
  process.exit(1);
}
