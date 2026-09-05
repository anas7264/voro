const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // Inject bypass mode and profile/user data into storage before page load
  await page.addInitScript(() => {
    window.voro_test_mode = 'true';
    window.__VORO_TEST_BYPASS__ = true;
    localStorage.setItem('voro_profile', JSON.stringify({ name: 'Alex', completedOnboarding: true }));
    localStorage.setItem('voro_user', JSON.stringify({ name: 'Alex', email: 'alex@voro.fit' }));
  });

  await page.goto('http://localhost:5173/workout/log', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const screenshotPath = '/home/jules/verification/date_picker_forge.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot captured at ${screenshotPath}`);

  await browser.close();
})();
