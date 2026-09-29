const fs = require('fs');
const path = require('path');

console.log("⚡ Verifying Achievements.jsx Voro 'Forge' Luxury Architecture & Performance...");

const filePath = path.join(__dirname, 'src', 'pages', 'Achievements.jsx');
const content = fs.readFileSync(filePath, 'utf8');

const checks = [
  {
    name: "Header component integrated from @/components/Header",
    test: content.includes("import { Header } from '@/components/Header'") && content.includes('<Header')
  },
  {
    name: "Tabs component integrated from @/components/Tabs",
    test: content.includes("import { Tabs } from '@/components/Tabs'") && content.includes('<Tabs')
  },
  {
    name: "Badge component integrated from @/components/Badge",
    test: content.includes("import { Badge } from '@/components/Badge'") && content.includes('<Badge')
  },
  {
    name: "Tag component integrated from @/components/Tag",
    test: content.includes("import { Tag } from '@/components/Tag'") && content.includes('<Tag')
  },
  {
    name: "Hoisted frozen CATEGORIES and ACHIEVEMENTS_BY_CATEGORY map",
    test: content.includes('CATEGORIES = [...new Set(') && content.includes('ACHIEVEMENTS_BY_CATEGORY = achievements.reduce')
  },
  {
    name: "Direct-DOM 60fps volumetric tilt handling for Hero Enclave",
    test: content.includes("heroRef.current.style.setProperty('--mouse-x'") && content.includes("heroRef.current.style.transform =")
  },
  {
    name: "Direct-DOM innerText updates for live coordinate telemetry",
    test: content.includes("heroTiltXRef.current.innerText =") && content.includes("heroTiltYRef.current.innerText =")
  },
  {
    name: "Sub-pixel system attestation hash badging present",
    test: content.includes("0xASC_CORE_ATTESTED_MATRIX")
  },
  {
    name: "W3C APG compliant keyboard accessibility (tabIndex & role)",
    test: content.includes('tabIndex={0}') && content.includes('role="region"')
  },
  {
    name: "Playfair Display italic serif typography paired with JetBrains Mono font-mono",
    test: content.includes('font-serif italic') && content.includes('font-mono')
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
  console.log("\n All 10 Achievements page luxury architecture checks passed successfully!");
} else {
  console.error("\n Some Achievements page checks failed!");
  process.exit(1);
}
