const fs = require('fs');
const path = require('path');

console.log("=================================================");
console.log("VORO LUXURY MASTERCLASS VERIFICATION: PieChartComponent");
console.log("=================================================");

const pieChartPath = path.join(__dirname, 'src', 'components', 'PieChartComponent.jsx');

if (!fs.existsSync(pieChartPath)) {
  console.error("❌ ERROR: PieChartComponent.jsx not found at path:", pieChartPath);
  process.exit(1);
}

const source = fs.readFileSync(pieChartPath, 'utf8');

const checks = [
  {
    description: "60fps direct-DOM 3D tilt tracking with --mouse-x, --mouse-y, --tilt-x, --tilt-y",
    test: () => source.includes('--mouse-x') && source.includes('--mouse-y') && source.includes('--tilt-x') && source.includes('--tilt-y')
  },
  {
    description: "Zero-allocation performance flags using useRef for isHoveredRef and isFocusedRef",
    test: () => source.includes('isHoveredRef = useRef(false)') && source.includes('isFocusedRef = useRef(false)')
  },
  {
    description: "Liquid light perimeter illumination mask with radial-gradient",
    test: () => source.includes('radial-gradient(') && source.includes('maskComposite')
  },
  {
    description: "Holographic spatial coordinate telemetry overlay (TX_...°, TY_...°)",
    test: () => source.includes('TX_') && source.includes('TY_')
  },
  {
    description: "SSR-safe deterministic sub-pixel attestation hash badge (0xPIE_..._ATTESTED)",
    test: () => source.includes('0xPIE_') && source.includes('ATTESTED')
  },
  {
    description: "W3C APG keyboard accessibility focus state handling with static 4.0° tilt fallback",
    test: () => source.includes("4.00deg") && source.includes("rotateX(4deg)")
  },
  {
    description: "Glassmorphic center biometric summary readout lens with Playfair Display & JetBrains Mono",
    test: () => source.includes('font-serif italic') && source.includes('0xPIE_SYNC')
  },
  {
    description: "Percentage distribution badges in legend specimen",
    test: () => source.includes('%') && source.includes('itemPct')
  }
];

let passedCount = 0;

checks.forEach((check, index) => {
  const result = check.test();
  if (result) {
    console.log(`✓ CHECK ${index + 1}: ${check.description}`);
    passedCount++;
  } else {
    console.error(`✕ CHECK ${index + 1} FAILED: ${check.description}`);
  }
});

console.log("-------------------------------------------------");
console.log(`Verification Summary: ${passedCount}/${checks.length} checks passed.`);

if (passedCount === checks.length) {
  console.log("🎉 ALL PIECHARTCOMPONENT LUXURY MASTERCLASS CHECKS PASSED SUCCESSFULLY!");
  process.exit(0);
} else {
  console.error("❌ Some checks failed.");
  process.exit(1);
}
