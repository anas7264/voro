import fs from 'fs';
import path from 'path';

const fileContent = fs.readFileSync('webs/src/pages/Statistics.jsx', 'utf8');

console.log("Checking Statistics.jsx optimizations...");

// Check 1: InteractiveChartCard should not use useState for isHovered/isFocused
const chartCardStateMatch = /const InteractiveChartCard = memo[\s\S]*?useState\(false\)/.test(fileContent);
if (chartCardStateMatch) {
  console.error("FAIL: InteractiveChartCard still uses useState for interaction state!");
  process.exit(1);
} else {
  console.log("PASS: InteractiveChartCard does not use useState for hover/focus.");
}

// Check 2: MacroSynthesisMatrixEnclave should not use useState for isHovered/isFocused
const enclaveStateMatch = /const MacroSynthesisMatrixEnclave = memo[\s\S]*?useState\(false\)/.test(fileContent);
if (enclaveStateMatch) {
  console.error("FAIL: MacroSynthesisMatrixEnclave still uses useState for interaction state!");
  process.exit(1);
} else {
  console.log("PASS: MacroSynthesisMatrixEnclave does not use useState for hover/focus.");
}

// Check 3: Ensure useRef is used for hover/focus flags
if (fileContent.includes('isHoveredRef') && fileContent.includes('isFocusedRef')) {
  console.log("PASS: Both components use useRef boolean flags (isHoveredRef, isFocusedRef).");
} else {
  console.error("FAIL: Missing isHoveredRef or isFocusedRef!");
  process.exit(1);
}

console.log("All Statistics.jsx interaction performance checks passed successfully!");
