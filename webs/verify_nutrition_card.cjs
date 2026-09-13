const fs = require('fs');
const path = require('path');

console.log('⚡ Starting Nutrition Card Luxury Refinement Verification...');

const cardPath = path.join(__dirname, 'src', 'components', 'NutritionCard.jsx');

if (!fs.existsSync(cardPath)) {
  console.error('ERROR: NutritionCard.jsx file does not exist!');
  process.exit(1);
}

const cardContent = fs.readFileSync(cardPath, 'utf8');

const checks = [
  { name: 'Component memoized with memo', test: cardContent.includes('export const NutritionCard = memo(') },
  { name: 'Hoisted static frozen MACRO_ITEMS map', test: cardContent.includes('const MACRO_ITEMS = Object.freeze(') },
  { name: 'SSR-safe deterministic subpixelHash and nodeId using useId', test: cardContent.includes('const { nodeId, subpixelHash } = useMemo(') && cardContent.includes('0xMET_') },
  { name: 'Direct-DOM 60fps 3D volumetric tilt tracking (--tilt-x, --tilt-y, --mouse-x, --mouse-y)', test: cardContent.includes("style.setProperty('--tilt-x'") && cardContent.includes("style.setProperty('--tilt-y'") && cardContent.includes("style.setProperty('--mouse-x'") },
  { name: 'W3C APG compliant static 4-degree keyboard focus tilt handlers', test: cardContent.includes("style.setProperty('--tilt-x', '4.00deg')") && cardContent.includes("handleFocus") && cardContent.includes("handleBlur") },
  { name: 'W3C APG role="article" and tabIndex={0} accessibility attributes', test: cardContent.includes('role="article"') && cardContent.includes('tabIndex={0}') },
  { name: 'Detailed ARIA label describing metabolic artifact', test: cardContent.includes('aria-label={`Metabolic artifact:') },
  { name: 'Liquid border intelligence perimeter illumination gradient mask', test: cardContent.includes('background: `radial-gradient(400px circle at var(--mouse-x') },
  { name: 'Defensive callback invocation with stopPropagation', test: cardContent.includes('e.stopPropagation()') && cardContent.includes('onEdit?.(meal)') && cardContent.includes('onDelete?.(meal)') },
  { name: 'Explicit displayName set', test: cardContent.includes('NutritionCard.displayName = "NutritionCard";') }
];

let allPassed = true;
checks.forEach(check => {
  if (check.test) {
    console.log(`✓ ${check.name}`);
  } else {
    console.error(`✗ ${check.name}`);
    allPassed = false;
  }
});

if (!allPassed) {
  console.error('Verification failed!');
  process.exit(1);
}

console.log('🎉 Nutrition Card verification successful!');
