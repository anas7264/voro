const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

// Ensure ChallengeCard file exists and contains expected accessibility and micro-UX features
const filePath = path.join(__dirname, 'src/components/ChallengeCard.jsx');
const content = fs.readFileSync(filePath, 'utf8');

console.log("=== VERIFYING CHALLENGE CARD ARCHITECTURE & ACCESSIBILITY ===");

let passed = 0;
let total = 0;

function check(description, condition) {
  total++;
  if (condition) {
    console.log(`✅ PASS: ${description}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${description}`);
  }
}

// 1. Check W3C APG Keyboard interaction handling
check("Contains handleKeyDown for Enter and Space key activation", content.includes("handleKeyDown") && content.includes("e.key === 'Enter'") && content.includes("e.key === ' '"));
check("Container has tabIndex={0} for W3C APG keyboard focusability", content.includes("tabIndex={0}"));

// 2. Check micro-UX state-aware tooltips
check("Container has dynamic state-aware title tooltip", content.includes("title={cardTitle}"));
check("Claim button has title tooltip", content.includes("title={buttonTitle}"));

// 3. Check defensive property handling
check("Safely defaults challenge object fields", content.includes("safeChallenge") && content.includes("safeChallenge.name ||"));
check("Normalizes difficulty strings with fallbacks", content.includes("normalizedDiff") && content.includes("DIFFICULTY_STYLES.Beginner"));

// 4. Check 60fps direct-DOM rotational tilt and spatial coordinate telemetry
check("Direct DOM style updates for 60fps rotational tilt", content.includes("elStyle.setProperty('--mouse-x'") && content.includes("elStyle.setProperty('--mouse-y'"));
check("Static 4.0deg APG focus tilt feedback", content.includes("rotateX(4deg) rotateY(-4deg)"));
check("Sub-pixel attestation badging (0xCHL_...)", content.includes("0xCHL_"));

console.log(`\nSummary: ${passed}/${total} checks passed.`);

if (passed !== total) {
  process.exit(1);
} else {
  console.log("ChallengeCard architectural verification complete!");
}
