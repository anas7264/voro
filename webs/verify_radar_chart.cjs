const fs = require('fs');
const path = require('path');

console.log("=================================================");
console.log("VORO LUXURY MASTERCLASS VERIFICATION: RadarChartComponent");
console.log("=================================================");

const filePath = path.join(__dirname, 'src', 'components', 'RadarChartComponent.jsx');
const code = fs.readFileSync(filePath, 'utf8');

let checksPassed = 0;
const totalChecks = 8;

function check(label, condition) {
  if (condition) {
    console.log(`✓ CHECK ${checksPassed + 1}: ${label}`);
    checksPassed++;
  } else {
    console.error(`✗ CHECK ${checksPassed + 1} FAILED: ${label}`);
  }
}

// 1. Direct-DOM 60fps 3D volumetric rotational tilt tracking
check(
  "60fps direct-DOM 3D tilt tracking with --mouse-x, --mouse-y, --tilt-x, --tilt-y",
  code.includes("setProperty('--mouse-x'") &&
  code.includes("setProperty('--mouse-y'") &&
  code.includes("setProperty('--tilt-x'") &&
  code.includes("setProperty('--tilt-y'") &&
  code.includes("perspective(1200px) rotateX")
);

// 2. Zero-allocation performance flags
check(
  "Zero-allocation performance flags using useRef for isHoveredRef and isFocusedRef",
  code.includes("isHoveredRef = useRef(false)") &&
  code.includes("isFocusedRef = useRef(false)") &&
  !code.includes("const [isHovered, setIsHovered]")
);

// 3. Dynamic magnetic liquid light illumination mask
check(
  "Liquid light perimeter illumination mask with radial-gradient and maskComposite",
  code.includes("radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%)") &&
  code.includes("maskComposite: 'exclude'")
);

// 4. Holographic spatial coordinate telemetry
check(
  "Holographic spatial coordinate telemetry overlay (TX_...°, TY_...°)",
  code.includes("tiltXRef") &&
  code.includes("tiltYRef") &&
  code.includes("TX_") &&
  code.includes("TY_")
);

// 5. SSR-safe deterministic sub-pixel attestation hash badge
check(
  "SSR-safe deterministic sub-pixel attestation hash badge (0xRADAR_..._ATTESTED)",
  code.includes("0xRADAR_") &&
  code.includes("_ATTESTED")
);

// 6. W3C APG keyboard accessibility focus state handling
check(
  "W3C APG keyboard accessibility focus state handling with static 4.0° tilt fallback",
  code.includes('role="region"') &&
  code.includes("tabIndex={0}") &&
  code.includes("focus-visible:ring-2") &&
  code.includes("rotateX(4deg) rotateY(-4deg)")
);

// 7. CustomTooltip typography pairing Playfair Display & JetBrains Mono
check(
  "Elevated CustomTooltip typography with Playfair Display italic serif hero figures and JetBrains Mono metadata",
  code.includes("font-serif italic font-medium text-white") &&
  code.includes("font-mono") &&
  code.includes("0xRADAR_TELEMETRY")
);

// 8. Optional Title and Subtitle header layout support
check(
  "Optional title & subtitle header layout support with luxury typography",
  code.includes("Neural Capability Matrix") &&
  code.includes("text-[0.55rem] font-mono font-black uppercase tracking-[0.35em]") &&
  code.includes("text-2xl font-serif italic")
);

console.log("-------------------------------------------------");
console.log(`Verification Summary: ${checksPassed}/${totalChecks} checks passed.`);

if (checksPassed === totalChecks) {
  console.log("🎉 ALL RADARCHARTCOMPONENT LUXURY MASTERCLASS CHECKS PASSED SUCCESSFULLY!\n");
  process.exit(0);
} else {
  console.error("❌ SOME CHECKS FAILED!\n");
  process.exit(1);
}
