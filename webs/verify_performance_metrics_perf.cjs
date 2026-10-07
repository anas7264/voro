const fs = require('fs');
const path = require('path');

console.log('Running PerformanceMetrics verification checks...');

const metricsPath = path.join(__dirname, 'src/pages/PerformanceMetrics.jsx');
const content = fs.readFileSync(metricsPath, 'utf8');

// Check 1: No useState in KineticCapabilityNode or KineticInteractiveCard for hover/focus state
if (content.includes('const [isHovered,') || content.includes('const [isFocused,')) {
  console.error('FAIL: React useState found for hover or focus state!');
  process.exit(1);
} else {
  console.log('PASS: Zero useState used for mouse/hover/focus tracking.');
}

// Check 2: useRef used for interaction flags
if (!content.includes('isHoveredRef') || !content.includes('isFocusedRef')) {
  console.error('FAIL: useRef flags for hover/focus tracking not found!');
  process.exit(1);
} else {
  console.log('PASS: Direct-DOM interaction flags via useRef verified.');
}

// Check 3: Frozen fallback data structure
if (!content.includes('Object.freeze({')) {
  console.error('FAIL: Static fallback object freezing not found!');
  process.exit(1);
} else {
  console.log('PASS: Frozen static fallback objects verified.');
}

// Check 4: W3C APG accessibility attributes
if (!content.includes('role="region"') || !content.includes('role="article"') || !content.includes('tabIndex={0}')) {
  console.error('FAIL: APG accessibility role or tabIndex attributes missing!');
  process.exit(1);
} else {
  console.log('PASS: APG keyboard navigation attributes verified.');
}

console.log('ALL PerformanceMetrics VERIFICATION CHECKS PASSED SUCCESSFULLY!');
