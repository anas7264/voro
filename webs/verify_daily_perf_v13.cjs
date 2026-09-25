const fs = require('fs');
const path = require('path');

console.log('=========================================');
console.log('⚡ VERIFYING DAILY PERFORMANCE OPTIMIZATIONS (V13)');
console.log('=========================================');

let failed = false;

function verifyFile(filepath, checks) {
  console.log(`\n🧪 Verifying ${path.basename(filepath)}...`);
  const content = fs.readFileSync(path.join(__dirname, filepath), 'utf8');

  for (const check of checks) {
    if (check.type === 'includes') {
      if (content.includes(check.str)) {
        console.log(`✅ Success: ${check.msg}`);
      } else {
        console.error(`❌ Failure: ${check.msg}`);
        console.error(`Expected file to contain: "${check.str}"`);
        failed = true;
      }
    } else if (check.type === 'not_includes') {
      if (!content.includes(check.str)) {
        console.log(`✅ Success: ${check.msg}`);
      } else {
        console.error(`❌ Failure: ${check.msg}`);
        console.error(`Expected file NOT to contain: "${check.str}"`);
        failed = true;
      }
    }
  }
}

// 1. Verify SupplementTracker.jsx
verifyFile('src/pages/SupplementTracker.jsx', [
  { type: 'includes', str: 'const isFocusedRef = useRef(false);', msg: 'CatalogItem uses useRef for focus tracking' },
  { type: 'includes', str: 'const isHoveredRef = useRef(false);', msg: 'ActiveProtocolCard uses useRef for hover tracking' },
  { type: 'includes', str: 'const isFocusedRef = useRef(false);', msg: 'ActiveProtocolCard uses useRef for focus tracking' },
  { type: 'not_includes', str: 'const [isFocused, setIsFocused] = useState(false);', msg: 'Eliminated React useState for focus in SupplementTracker components' },
  { type: 'not_includes', str: 'const [isHovered, setIsHovered] = useState(false);', msg: 'Eliminated React useState for hover in SupplementTracker components' }
]);

// 2. Verify ShoppingList.jsx
verifyFile('src/pages/ShoppingList.jsx', [
  { type: 'includes', str: 'const isHoveredRef = useRef(false);', msg: 'ProcuredResourceCard uses useRef for hover tracking' },
  { type: 'includes', str: 'const isFocusedRef = useRef(false);', msg: 'ProcuredResourceCard uses useRef for focus tracking' },
  { type: 'not_includes', str: 'const [isHovered, setIsHovered] = useState(false);', msg: 'Eliminated React useState for hover in ProcuredResourceCard' },
  { type: 'not_includes', str: 'const [isFocused, setIsFocused] = useState(false);', msg: 'Eliminated React useState for focus in ProcuredResourceCard' }
]);

// 3. Verify CompetitionPrep.jsx
verifyFile('src/pages/CompetitionPrep.jsx', [
  { type: 'includes', str: 'const isHoveredRef = useRef(false);', msg: 'ProtocolCard/ChronosNode use useRef for hover tracking' },
  { type: 'includes', str: 'const isFocusedRef = useRef(false);', msg: 'ProtocolCard/ChronosNode use useRef for focus tracking' },
  { type: 'not_includes', str: 'const [isHovered, setIsHovered] = useState(false);', msg: 'Eliminated React useState for hover in CompetitionPrep components' },
  { type: 'not_includes', str: 'const [isFocused, setIsFocused] = useState(false);', msg: 'Eliminated React useState for focus in CompetitionPrep components' }
]);

// 4. Verify MealPrepPlanner.jsx
verifyFile('src/pages/MealPrepPlanner.jsx', [
  { type: 'includes', str: 'const isFocusedRef = useRef(false);', msg: 'PrepSessionCard uses useRef for focus tracking' },
  { type: 'not_includes', str: 'const [isFocused, setIsFocused] = useState(false);', msg: 'Eliminated React useState for focus in PrepSessionCard' }
]);

console.log('\n=========================================');
if (failed) {
  console.error('❌ SOME VERIFICATION CHECKS FAILED!');
  process.exit(1);
} else {
  console.log('🎉 ALL DAILY OPTIMIZATION V13 CHECKS PASSED!');
  console.log('=========================================');
}
