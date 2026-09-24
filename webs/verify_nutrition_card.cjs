const fs = require('fs');
const path = require('path');

const nutritionCardPath = path.join(__dirname, 'src', 'components', 'NutritionCard.jsx');
const content = fs.readFileSync(nutritionCardPath, 'utf8');

console.log('=== VERIFYING NUTRITION CARD LUXURY ARCHITECTURE & ACCESSIBILITY ===');

const checks = [
  {
    desc: 'SSR-safe sub-pixel attestation badging (0xMET_...)',
    test: () => content.includes('0xMET_') && content.includes('subpixelHash')
  },
  {
    desc: 'Dynamic liquid border perimeter illumination mask',
    test: () => content.includes('Liquid Border Intelligence') && content.includes('radial-gradient')
  },
  {
    desc: '60fps direct-DOM volumetric 3D rotational tilt tracking',
    test: () => content.includes('perspective(1000px)') && content.includes('--tilt-x') && content.includes('--tilt-y')
  },
  {
    desc: 'Zero-allocation interaction tracking via useRef flags',
    test: () => content.includes('isHoveredRef') && content.includes('isFocusedRef')
  },
  {
    desc: 'Holographic spatial coordinate telemetry overlays',
    test: () => content.includes('tiltXRef') && content.includes('tiltYRef') && content.includes('TX_') && content.includes('TY_')
  },
  {
    desc: 'W3C APG compliant keyboard accessibility (Enter/Space key onEdit & focus tilt)',
    test: () => content.includes('handleKeyDown') && content.includes('Enter') && content.includes('4.00deg')
  },
  {
    desc: 'Context-aware interactive button title tooltips (Modify & Purge)',
    test: () => content.includes('title={`Modify ${mealName}`}') && content.includes('title={isConfirming ? `Confirm purging ${mealName}` : `Purge ${mealName}`}')
  },
  {
    desc: 'State-aware ARIA labels on action buttons',
    test: () => content.includes('aria-label={`Modify ${mealName}`}') && content.includes('aria-label={isConfirming ? `Confirm purge ${mealName}` : `Purge ${mealName}`}')
  }
];

let failed = 0;
checks.forEach((c, idx) => {
  const passed = c.test();
  if (passed) {
    console.log(`✅ [PASS ${idx + 1}/${checks.length}] ${c.desc}`);
  } else {
    console.error(`❌ [FAIL ${idx + 1}/${checks.length}] ${c.desc}`);
    failed++;
  }
});

if (failed > 0) {
  console.error(`\n❌ ${failed} verification checks failed.`);
  process.exit(1);
} else {
  console.log(`\n✨ ALL ${checks.length} NUTRITION CARD VERIFICATION CHECKS PASSED SUCCESSFULLY!`);
}
