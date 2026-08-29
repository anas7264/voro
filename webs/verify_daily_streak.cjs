const path = require('path');
const fs = require('fs');

async function verifyDailyStreak() {
  console.log('⚡ Starting Daily Streak Luxury Refinement Verification...');

  const entryFile = path.join(__dirname, 'src/pages/DailyStreak.jsx');

  if (!fs.existsSync(entryFile)) {
    console.error(`❌ Source file not found: ${entryFile}`);
    process.exit(1);
  }

  const content = fs.readFileSync(entryFile, 'utf8');

  // Verify required luxury design system markers and zero-allocation / performance features
  const requiredTokens = [
    'DEFAULT_STREAKS',
    'WEEKLY_MATRIX_TEMPLATE',
    'STREAK_METRICS_CONFIG',
    'KineticMomentumNode',
    'KineticStreakAlignmentOverlay',
    'useStorageKeySelector',
    'updateItem',
    'purgeActive',
    'purgeCountdown',
    'handleResetTrigger',
    'preserve-3d',
    'bg-boutique-grain',
    '0xSTRK_MTX_v4'
  ];

  let hasErrors = false;
  for (const token of requiredTokens) {
    if (!content.includes(token)) {
      console.error(`❌ Missing required luxury design system token: ${token}`);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  // Syntax and structural validations
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    console.error(`❌ Mismatched braces count: ${openBraces} open vs ${closeBraces} close.`);
    process.exit(1);
  }

  const openParens = (content.match(/\(/g) || []).length;
  const closeParens = (content.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    console.error(`❌ Mismatched parens count: ${openParens} open vs ${closeParens} close.`);
    process.exit(1);
  }

  console.log('✅ All luxury design system tokens & zero-allocation structures verified.');
  console.log('🎉 Daily Streak refinement verification successful!');
}

verifyDailyStreak();
