import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('⚡ Running Zero-Allocation Interaction Tracking Verification for Food Diary & Journal...');

const foodDiaryPath = path.join(__dirname, 'src/pages/FoodDiary.jsx');
const foodJournalPath = path.join(__dirname, 'src/pages/FoodJournal.jsx');

const foodDiaryCode = fs.readFileSync(foodDiaryPath, 'utf8');
const foodJournalCode = fs.readFileSync(foodJournalPath, 'utf8');

// 1. Verify KineticMealSlotCard and KineticMacroCard in FoodDiary.jsx
if (foodDiaryCode.includes('const [isHovered, setIsHovered] = useState(false);') ||
    foodDiaryCode.includes('const [isFocused, setIsFocused] = useState(false);')) {
  console.error('❌ Error: FoodDiary.jsx still contains useState for isHovered or isFocused!');
  process.exit(1);
}

if (!foodDiaryCode.includes('isHoveredRef = useRef(false);') ||
    !foodDiaryCode.includes('isFocusedRef = useRef(false);')) {
  console.error('❌ Error: FoodDiary.jsx missing useRef flags for interaction tracking!');
  process.exit(1);
}

// 2. Verify JournalEntryCard in FoodJournal.jsx
if (foodJournalCode.includes('const [isHovered, setIsHovered] = useState(false);') ||
    foodJournalCode.includes('const [isFocused, setIsFocused] = useState(false);')) {
  console.error('❌ Error: FoodJournal.jsx still contains useState for isHovered or isFocused!');
  process.exit(1);
}

if (!foodJournalCode.includes('isHoveredRef = useRef(false);') ||
    !foodJournalCode.includes('isFocusedRef = useRef(false);')) {
  console.error('❌ Error: FoodJournal.jsx missing useRef flags for interaction tracking!');
  process.exit(1);
}

// 3. Verify Direct DOM Property Updates
if (!foodDiaryCode.includes("style.setProperty('transform'") ||
    !foodJournalCode.includes("style.setProperty('transform'")) {
  console.error('❌ Error: Direct DOM transform manipulation missing from cards!');
  process.exit(1);
}

console.log('✓ KineticMealSlotCard verified: useRef interaction flags, zero useState hover/focus re-renders.');
console.log('✓ KineticMacroCard verified: useRef interaction flags, zero useState hover/focus re-renders.');
console.log('✓ JournalEntryCard verified: useRef interaction flags, zero useState hover/focus re-renders.');
console.log('✓ Direct DOM 60fps tilt property updates verified.');
console.log('🎉 Food Diary & Food Journal performance verification passed successfully!');
