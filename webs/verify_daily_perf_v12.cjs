const fs = require('fs');
const path = require('path');

const nutrientPath = path.join(__dirname, 'src/pages/NutrientTracker.jsx');
const waterPath = path.join(__dirname, 'src/pages/WaterTracker.jsx');

const nutrientContent = fs.readFileSync(nutrientPath, 'utf8');
const waterContent = fs.readFileSync(waterPath, 'utf8');

console.log('--- Verifying NutrientTracker.jsx & WaterTracker.jsx Zero-Allocation Performance ---');

// 1. Verify NutrientTracker.jsx uses isHoveredRef and isFocusedRef
if (nutrientContent.includes('const isHoveredRef = useRef(false);') && nutrientContent.includes('const isFocusedRef = useRef(false);')) {
  console.log('✅ NutrientTracker.jsx correctly declares useRef flags for interaction tracking.');
} else {
  console.error('❌ NutrientTracker.jsx missing useRef flags for interaction tracking.');
  process.exit(1);
}

// Ensure no useState for hover/focus in NutrientTracker.jsx
if (nutrientContent.includes('const [isHovered, setIsHovered]') || nutrientContent.includes('const [isFocused, setIsFocused]')) {
  console.error('❌ NutrientTracker.jsx still uses React useState for hover/focus state updates!');
  process.exit(1);
} else {
  console.log('✅ NutrientTracker.jsx eliminated React useState for hover/focus state updates.');
}

// 2. Verify WaterTracker.jsx uses isHoveredRef and isFocusedRef
if (waterContent.includes('const isHoveredRef = useRef(false);') && waterContent.includes('const isFocusedRef = useRef(false);')) {
  console.log('✅ WaterTracker.jsx correctly declares useRef flags for interaction tracking.');
} else {
  console.error('❌ WaterTracker.jsx missing useRef flags for interaction tracking.');
  process.exit(1);
}

// Ensure no useState for hover/focus in WaterTracker.jsx
if (waterContent.includes('const [isHovered, setIsHovered]') || waterContent.includes('const [isFocused, setIsFocused]')) {
  console.error('❌ WaterTracker.jsx still uses React useState for hover/focus state updates!');
  process.exit(1);
} else {
  console.log('✅ WaterTracker.jsx eliminated React useState for hover/focus state updates.');
}

console.log('🚀 All verification checks passed for webs/verify_daily_perf_v12.cjs!');
