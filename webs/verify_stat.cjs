const fs = require('fs');
const path = require('path');

console.log("⚡ Starting Stat Luxury Refinement Verification...");

const statPath = path.join(__dirname, 'src', 'components', 'Stat.jsx');
const content = fs.readFileSync(statPath, 'utf8');

// 1. Verify zero-allocation structure hoisting
if (!content.includes('const TOKEN_MAP = Object.freeze(')) {
  console.error("❌ TOKEN_MAP is not hoisted and frozen with Object.freeze().");
  process.exit(1);
}

if (!content.includes('const TELEMETRY_STREAM_NODES = Object.freeze(')) {
  console.error("❌ TELEMETRY_STREAM_NODES is not hoisted and frozen with Object.freeze().");
  process.exit(1);
}

// 2. Verify Liquid Border Intelligence gradient mask
if (!content.includes('WebkitMaskComposite') || !content.includes('radial-gradient(')) {
  console.error("❌ Liquid Border Intelligence gradient mask missing.");
  process.exit(1);
}

// 3. Verify Golden Ratio typography hierarchy
if (!content.includes('font-serif italic') || !content.includes('font-mono font-bold')) {
  console.error("❌ Typography hierarchy missing Playfair Display italic serif or JetBrains Mono metadata.");
  process.exit(1);
}

// 4. Verify sub-pixel hash badging & coordinate telemetry
if (!content.includes('subpixelHash') || !content.includes('TX_') || !content.includes('TY_')) {
  console.error("❌ Sub-pixel system attestation badge or coordinate telemetry missing.");
  process.exit(1);
}

// 5. Verify exports
if (!content.includes('export const Stat = memo(') || !content.includes('export default Stat;')) {
  console.error("❌ Stat component exports invalid.");
  process.exit(1);
}

console.log("✅ All luxury design system tokens & zero-allocation structures in Stat.jsx verified.");
console.log("🎉 Stat refinement verification successful!");
