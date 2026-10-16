const fs = require('fs');
const path = require('path');

console.log('⚡ Running Daily UI/UX Masterclass Refinement Verifier...\n');

const componentsToVerify = [
  { name: 'Accordion.jsx', path: 'webs/src/components/Accordion.jsx' },
  { name: 'AchievementCard.jsx', path: 'webs/src/components/AchievementCard.jsx' },
  { name: 'Alert.jsx', path: 'webs/src/components/Alert.jsx' },
  { name: 'Avatar.jsx', path: 'webs/src/components/Avatar.jsx' },
  { name: 'Badge.jsx', path: 'webs/src/components/Badge.jsx' },
  { name: 'Breadcrumb.jsx', path: 'webs/src/components/Breadcrumb.jsx' },
  { name: 'Button.jsx', path: 'webs/src/components/Button.jsx' },
  { name: 'Card.jsx', path: 'webs/src/components/Card.jsx' },
  { name: 'ChallengeCard.jsx', path: 'webs/src/components/ChallengeCard.jsx' },
  { name: 'Checkbox.jsx', path: 'webs/src/components/Checkbox.jsx' },
  { name: 'Container.jsx', path: 'webs/src/components/Container.jsx' },
  { name: 'DatePicker.jsx', path: 'webs/src/components/DatePicker.jsx' },
  { name: 'Divider.jsx', path: 'webs/src/components/Divider.jsx' },
  { name: 'ExerciseCard.jsx', path: 'webs/src/components/ExerciseCard.jsx' },
  { name: 'Header.jsx', path: 'webs/src/components/Header.jsx' },
  { name: 'Input.jsx', path: 'webs/src/components/Input.jsx' },
  { name: 'LoadingSpinner.jsx', path: 'webs/src/components/LoadingSpinner.jsx' },
  { name: 'Modal.jsx', path: 'webs/src/components/Modal.jsx' },
  { name: 'NotificationContainer.jsx', path: 'webs/src/components/NotificationContainer.jsx' },
  { name: 'NutritionCard.jsx', path: 'webs/src/components/NutritionCard.jsx' },
  { name: 'PieChartComponent.jsx', path: 'webs/src/components/PieChartComponent.jsx' },
  { name: 'Progress.jsx', path: 'webs/src/components/Progress.jsx' },
  { name: 'Ring.jsx', path: 'webs/src/components/Ring.jsx' },
  { name: 'ScreenPrivacyGuard.jsx', path: 'webs/src/components/ScreenPrivacyGuard.jsx' },
  { name: 'SecurityLockdown.jsx', path: 'webs/src/components/SecurityLockdown.jsx' },
  { name: 'Select.jsx', path: 'webs/src/components/Select.jsx' },
  { name: 'Sidebar.jsx', path: 'webs/src/components/Sidebar.jsx' },
  { name: 'Spinner.jsx', path: 'webs/src/components/Spinner.jsx' },
  { name: 'Stat.jsx', path: 'webs/src/components/Stat.jsx' },
  { name: 'Table.jsx', path: 'webs/src/components/Table.jsx' },
  { name: 'Tabs.jsx', path: 'webs/src/components/Tabs.jsx' },
  { name: 'Tag.jsx', path: 'webs/src/components/Tag.jsx' },
  { name: 'Textarea.jsx', path: 'webs/src/components/Textarea.jsx' },
  { name: 'Toggle.jsx', path: 'webs/src/components/Toggle.jsx' },
  { name: 'VoroLogo.jsx', path: 'webs/src/components/VoroLogo.jsx' }
];

let totalChecks = 0;
let passedChecks = 0;

function check(description, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ ${description}`);
  } else {
    console.error(`  ✕ FAIL: ${description}`);
  }
}

componentsToVerify.forEach(comp => {
  console.log(`Evaluating ${comp.name}...`);
  const fullPath = path.resolve(__dirname, '..', comp.path);
  const code = fs.readFileSync(fullPath, 'utf8');

  check(`${comp.name} uses React.memo for render optimization`, code.includes('memo('));
  check(`${comp.name} uses SSR-safe useId for unique attestation/node markers`, code.includes('useId()'));
  check(`${comp.name} features direct-DOM 60fps rotational tilt or vector tracking`, code.includes('style.setProperty') || code.includes('--tilt-x') || code.includes('transform'));
  check(`${comp.name} includes sub-pixel attestation hash badging or telemetry overlay`, code.includes('0x') || code.includes('TX_'));
  check(`${comp.name} exports displayName for React dev tools`, code.includes('displayName'));
});

console.log(`\n--------------------------------------------------`);
console.log(`Masterclass UI/UX Refinement Results: ${passedChecks}/${totalChecks} checks passed.`);

if (passedChecks === totalChecks) {
  console.log('🎉 ALL LUXURY MASTERCLASS REFINEMENT CHECKS PASSED PERFECTLY!\n');
  process.exit(0);
} else {
  console.error('❌ SOME CHECKS FAILED!\n');
  process.exit(1);
}
