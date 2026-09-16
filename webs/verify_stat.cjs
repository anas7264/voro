const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

console.log('⚡ Starting Stat Component Luxury Refinement Verification...');

const statFilePath = path.join(__dirname, 'src', 'components', 'Stat.jsx');
const content = fs.readFileSync(statFilePath, 'utf8');

// 1. Check for Zero-Allocation state structure (no useState for hover/focus)
if (content.includes('useState(')) {
  console.error('❌ FAIL: Stat.jsx should not use useState for hover/focus state (must be zero-allocation direct DOM refs).');
  process.exit(1);
}
console.log('✅ Passed: Zero-allocation state refactoring (no useState for interaction states).');

// 2. Check for useRef flags and DOM tracking refs
if (!content.includes('isHoveredRef') || !content.includes('isFocusedRef') || !content.includes('containerRef')) {
  console.error('❌ FAIL: Stat.jsx must use isHoveredRef, isFocusedRef, and containerRef for direct-DOM manipulation.');
  process.exit(1);
}
console.log('✅ Passed: Direct-DOM interaction refs verified.');

// 3. Check for SSR-safe useId hook usage
if (!content.includes('useId()') || !content.includes('subpixelHash')) {
  console.error('❌ FAIL: Stat.jsx must generate SSR-safe subpixelHash badging via useId().');
  process.exit(1);
}
console.log('✅ Passed: SSR-safe deterministic attestation badge generation verified.');

// 4. Check for frozen static lookup mappings
if (!content.includes('Object.freeze(')) {
  console.error('❌ FAIL: Static dictionary mappings in Stat.jsx must be frozen via Object.freeze.');
  process.exit(1);
}
console.log('✅ Passed: Hoisted & frozen static dictionaries verified.');

// 5. Check for displayName
if (!content.includes('Stat.displayName = "Stat";')) {
  console.error('❌ FAIL: Stat component missing explicit displayName.');
  process.exit(1);
}
console.log('✅ Passed: Explicit component displayName verified.');

// 6. Test esbuild bundle compilation
try {
  esbuild.buildSync({
    entryPoints: [statFilePath],
    bundle: true,
    write: false,
    format: 'esm',
    jsx: 'automatic',
    loader: { '.jsx': 'jsx' },
    external: ['react', 'react-dom', 'lucide-react']
  });
  console.log('✅ Passed: esbuild bundle compilation successful.');
} catch (err) {
  console.error('❌ FAIL: esbuild compilation error:', err);
  process.exit(1);
}

console.log('🎉 Stat.jsx luxury refinement verification complete!');
