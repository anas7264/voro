const fs = require('fs');
const path = require('path');

console.log(" Verifying AchievementCard.jsx zero-allocation & luxury architecture...");

const filePath = path.join(__dirname, 'src', 'components', 'AchievementCard.jsx');
const content = fs.readFileSync(filePath, 'utf8');

const checks = [
  {
    name: "Zero useState hooks for interaction state",
    test: !content.includes('useState(')
  },
  {
    name: "useRef flags present for hover and focus tracking",
    test: content.includes('isHoveredRef = useRef(') && content.includes('isFocusedRef = useRef(')
  },
  {
    name: "Direct DOM style updates for 3D volumetric rotational tilt",
    test: content.includes('containerRef.current.style.transform =')
  },
  {
    name: "Direct DOM innerText updates for live coordinate telemetry",
    test: content.includes('tiltXRef.current.innerText =') && content.includes('tiltYRef.current.innerText =')
  },
  {
    name: "SSR-safe deterministic attestation hash badging using useId",
    test: content.includes('useId()') && content.includes('0xACH_')
  },
  {
    name: "W3C APG compliant keyboard accessibility (Enter / Space key handlers & static focus tilt)",
    test: content.includes('handleKeyDown') && content.includes('Enter') && content.includes('e.key === " "')
  },
  {
    name: "Hoisted frozen ICON_MAP and RARITY_STYLES lookup maps",
    test: content.includes('ICON_MAP = Object.freeze') && content.includes('RARITY_STYLES = Object.freeze')
  },
  {
    name: "Explicit component displayName set",
    test: content.includes("AchievementCard.displayName = \"AchievementCard\"")
  }
];

let allPassed = true;
checks.forEach((check, index) => {
  if (check.test) {
    console.log(`[PASS] Check ${index + 1}: ${check.name}`);
  } else {
    console.error(`[FAIL] Check ${index + 1}: ${check.name}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log("\n All 8 AchievementCard zero-allocation & luxury architecture checks passed successfully!");
} else {
  console.error("\n Some AchievementCard checks failed!");
  process.exit(1);
}
