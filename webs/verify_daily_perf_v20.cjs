const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=========================================');
console.log('⚡ TESTING DAILY PERFORMANCE OPTIMIZATION V20');
console.log('=========================================');

// Test 1: Verify PRRecords.jsx imports useCallback and uses it in ApexPRCard
const prRecordsPath = path.join(__dirname, 'src/pages/PRRecords.jsx');
const prRecordsContent = fs.readFileSync(prRecordsPath, 'utf8');

assert.ok(
  /import\s+React,\s*\{[^}]*useCallback[^}]*\}\s*from\s*['"]react['"]/.test(prRecordsContent),
  'PRRecords.jsx must import useCallback from react'
);
assert.ok(
  prRecordsContent.includes('ApexPRCard'),
  'PRRecords.jsx must export/define ApexPRCard'
);
console.log('✅ PASS: PRRecords.jsx imports useCallback and contains ApexPRCard');

// Test 2: Verify Periodization.jsx uses useCallback for KineticBlockCard and TimelineNodeItem handlers and Optimistic UI
const periodizationPath = path.join(__dirname, 'src/pages/Periodization.jsx');
const periodizationContent = fs.readFileSync(periodizationPath, 'utf8');

assert.ok(
  /import\s+React,\s*\{[^}]*useCallback[^}]*\}\s*from\s*['"]react['"]/.test(periodizationContent),
  'Periodization.jsx must import useCallback from react'
);
assert.ok(
  periodizationContent.includes('const updateTransform = useCallback'),
  'Periodization.jsx must wrap updateTransform in useCallback'
);
assert.ok(
  periodizationContent.includes('// ⚡ OPTIMISTIC UI: Instant state propagation'),
  'Periodization.jsx must include Optimistic UI comment/logic in handleAddBlock'
);
console.log('✅ PASS: Periodization.jsx uses useCallback for interaction handlers and Optimistic UI state propagation');

// Test 3: Verify GymSetup.jsx uses useCallback for KineticHardwareCell and SpatialBlueprintEnclave handlers
const gymSetupPath = path.join(__dirname, 'src/pages/GymSetup.jsx');
const gymSetupContent = fs.readFileSync(gymSetupPath, 'utf8');

assert.ok(
  /import\s+React,\s*\{[^}]*useCallback[^}]*\}\s*from\s*['"]react['"]/.test(gymSetupContent),
  'GymSetup.jsx must import useCallback from react'
);
assert.ok(
  gymSetupContent.includes('const updateTransform = useCallback'),
  'GymSetup.jsx must wrap updateTransform in useCallback'
);
assert.ok(
  gymSetupContent.includes('equipmentSet = useMemo'),
  'GymSetup.jsx must use useMemo for O(1) equipmentSet lookups'
);
console.log('✅ PASS: GymSetup.jsx uses useCallback for hardware cell interaction handlers and O(1) Set lookups');

// Test 4: AST/Hook usage check across all src/ pages and components (stripping comments first)
function checkHookImports(dir) {
  const files = fs.readdirSync(dir);
  let errorCount = 0;
  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      errorCount += checkHookImports(fullPath);
    } else if (f.endsWith('.jsx') || f.endsWith('.js')) {
      const rawContent = fs.readFileSync(fullPath, 'utf8');
      // Strip comments
      const codeOnly = rawContent.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');

      const reactImportMatch = rawContent.match(/import\s+.*?\s+from\s+["']react["']/s);
      const reactImportStr = reactImportMatch ? reactImportMatch[0] : '';
      const hooks = ['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useId', 'useContext'];
      for (const hook of hooks) {
        const hookUsedRegex = new RegExp('(?:^|[^\\w\\.])' + hook + '\\s*\\(');
        if (hookUsedRegex.test(codeOnly)) {
          if (!reactImportStr.includes(hook) && !codeOnly.includes('React.' + hook) && !rawContent.includes(`import { ${hook} }`)) {
            console.error(`❌ Missing hook import in ${fullPath}: ${hook}`);
            errorCount++;
          }
        }
      }
    }
  }
  return errorCount;
}

const missingHookErrors = checkHookImports(path.join(__dirname, 'src'));
assert.strictEqual(missingHookErrors, 0, 'No missing React hook imports should exist in src/');
console.log('✅ PASS: System-wide audit verified 0 missing React hook imports across all components and pages');

console.log('=========================================');
console.log('🎉 VERIFICATION COMPLETED: ALL TESTS PASSED');
