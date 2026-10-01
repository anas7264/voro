const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("=========================================");
console.log("🧪 VERIFYING LAYOUT PRIMITIVES (Grid, Stack, Container)");
console.log("=========================================");

const gridPath = path.join(__dirname, 'src/components/Grid.jsx');
const stackPath = path.join(__dirname, 'src/components/Stack.jsx');
const containerPath = path.join(__dirname, 'src/components/Container.jsx');

const gridContent = fs.readFileSync(gridPath, 'utf8');
const stackContent = fs.readFileSync(stackPath, 'utf8');
const containerContent = fs.readFileSync(containerPath, 'utf8');

// Check 1: Grid style prop forwarding
assert(gridContent.includes('style={style}'), "Grid.jsx must forward style={style}");
console.log("✅ Grid.jsx forwards style={style}.");

// Check 2: Grid responsive column lookup mapping
assert(gridContent.includes('GRID_COLS_RESPONSIVE'), "Grid.jsx must use frozen GRID_COLS_RESPONSIVE dictionary");
console.log("✅ Grid.jsx uses frozen GRID_COLS_RESPONSIVE lookup map.");

// Check 3: Stack style prop forwarding
assert(stackContent.includes('style={style}'), "Stack.jsx must forward style={style}");
console.log("✅ Stack.jsx forwards style={style}.");

// Check 4: Stack direction and gap lookup mapping
assert(stackContent.includes('STACK_DIRECTIONS') && stackContent.includes('STACK_GAPS'), "Stack.jsx must use frozen STACK_DIRECTIONS and STACK_GAPS dictionaries");
console.log("✅ Stack.jsx uses frozen STACK_DIRECTIONS and STACK_GAPS lookup maps.");

// Check 5: Container max width, padding, and variant lookup mapping
assert(containerContent.includes('MAX_WIDTH_MAP') && containerContent.includes('PADDING_MAP') && containerContent.includes('VARIANT_MAP'), "Container.jsx must use frozen MAX_WIDTH_MAP, PADDING_MAP, and VARIANT_MAP dictionaries");
console.log("✅ Container.jsx uses frozen MAX_WIDTH_MAP, PADDING_MAP, and VARIANT_MAP lookup maps.");

// Check 6: Container style forwarding
assert(containerContent.includes('style={style}'), "Container.jsx must forward style={style}");
console.log("✅ Container.jsx forwards style={style}.");

// Check 7: JSDoc architectural design philosophy documentation
assert(gridContent.includes('PSYCHOLOGICAL & AESTHETIC DESIGN PHILOSOPHY'), "Grid.jsx must contain JSDoc architectural design philosophy");
assert(stackContent.includes('PSYCHOLOGICAL & AESTHETIC DESIGN PHILOSOPHY'), "Stack.jsx must contain JSDoc architectural design philosophy");
assert(containerContent.includes('DESIGN PHILOSOPHY'), "Container.jsx must contain JSDoc design philosophy");
console.log("✅ Grid, Stack, and Container include JSDoc architectural design philosophy documentation.");

console.log("\n🎉 ALL LAYOUT PRIMITIVES VERIFICATION CHECKS PASSED SUCCESSFULLY!");
console.log("=========================================");
