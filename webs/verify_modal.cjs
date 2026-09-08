const fs = require('fs');
const path = require('path');

console.log('⚡ Starting Modal.jsx Component Verification...');

const modalPath = path.join(__dirname, 'src', 'components', 'Modal.jsx');
if (!fs.existsSync(modalPath)) {
  console.error('ERROR: Modal.jsx does not exist!');
  process.exit(1);
}

const modalContent = fs.readFileSync(modalPath, 'utf8');

// Verification checks
const checks = [
  { name: 'Import React hooks (memo, useEffect, useId, useMemo, useRef)', test: modalContent.includes('useRef') && modalContent.includes('useId') && modalContent.includes('useMemo') && modalContent.includes('memo') },
  { name: 'Capture document.activeElement for focus restoration', test: modalContent.includes('previousFocus = document.activeElement') },
  { name: 'Keyboard focus trapping logic for Tab & Shift+Tab', test: modalContent.includes('e.key === "Tab"') && modalContent.includes('shiftKey') },
  { name: 'Restore focus on modal unmount / close', test: modalContent.includes('previousFocus.focus()') },
  { name: 'Initial focus set to modal container', test: modalContent.includes('modalRef.current.focus()') },
  { name: 'Modal container tabIndex={-1} and ref', test: modalContent.includes('ref={modalRef}') && modalContent.includes('tabIndex={-1}') },
  { name: 'Close button title and aria-label tooltip', test: modalContent.includes('aria-label={closeLabel}') && modalContent.includes('title={closeLabel}') },
  { name: 'W3C APG dialog role and aria-modal attributes', test: modalContent.includes('role="dialog"') && modalContent.includes('aria-modal="true"') },
  { name: 'DisplayName set', test: modalContent.includes('Modal.displayName = "Modal"') }
];

let allPassed = true;
checks.forEach(check => {
  if (check.test) {
    console.log(`✓ ${check.name}`);
  } else {
    console.error(`✗ ${check.name}`);
    allPassed = false;
  }
});

if (!allPassed) {
  console.error('Verification failed!');
  process.exit(1);
}

console.log('🎉 Modal component verification successful!');
