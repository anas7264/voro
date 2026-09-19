const fs = require('fs');
const path = require('path');

console.log('⚡ Starting NotificationContainer.jsx Verification...');

const ncPath = path.join(__dirname, 'src', 'components', 'NotificationContainer.jsx');
if (!fs.existsSync(ncPath)) {
  console.error('ERROR: NotificationContainer.jsx does not exist!');
  process.exit(1);
}

const content = fs.readFileSync(ncPath, 'utf8');

const checks = [
  { name: 'Import React memo', test: content.includes('import React, { memo }') },
  { name: 'Consume notification hooks (useNotificationState, useNotifications)', test: content.includes('useNotificationState') && content.includes('useNotifications') },
  { name: 'Semantic <section> container tag with APG live region', test: content.includes('<section') && content.includes('role="region"') && content.includes('aria-label="System Notification Matrix Stream"') && content.includes('aria-live="polite"') },
  { name: 'Responsive golden-ratio whitespace & z-index', test: content.includes('fixed top-6 right-6 sm:top-10 sm:right-10') && content.includes('z-[100]') },
  { name: 'Luxury stream telemetry header matrix badge', test: content.includes('Notification_Stream') && content.includes('[0xNTF_STREAM]') && content.includes('SIGNAL') },
  { name: 'Renders Alert with title, message, and onClose', test: content.includes('<Alert') && content.includes('title={notification.title}') && content.includes('message={notification.message}') && content.includes('onClose=') },
  { name: 'Named and default exports', test: content.includes('export const NotificationContainer = memo(') && content.includes('export default NotificationContainer') },
  { name: 'DisplayName set', test: content.includes('NotificationContainer.displayName = "NotificationContainer"') }
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

console.log('🎉 NotificationContainer verification successful!');
