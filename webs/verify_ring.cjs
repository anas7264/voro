const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log("Launching browser for Ring Component masterclass verification...");

  // Ensure output directory exists
  const outDir = '/home/jules/verification/screenshots';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // Set test mode marker so security system bypasses environment/integrity locks
  await page.addInitScript(() => {
    window.__VORO_TEST_BYPASS__ = true;
    localStorage.setItem('voro_test_mode', 'true');
  });

  console.log("Navigating to entry point...");
  await page.goto('http://localhost:4173/');
  await page.waitForTimeout(1000);

  // Securely inject initial state
  await page.evaluate(async () => {
    if (window.storage) {
      await window.storage.ensureInitialized();
      await window.storage.set('user', {
        name: 'Ulysses Elite',
        primaryGoal: 'Evolution',
        calorieGoal: 2000,
        waterGoal: 2000,
        proteinGoal: 150,
        carbsGoal: 200,
        fatGoal: 70
      });
      await window.storage.set('profile', {
        name: 'Ulysses Elite',
        completedOnboarding: true
      });
    }
  });

  console.log("Navigating to Dashboard page to inspect Ring component...");
  await page.goto('http://localhost:4173/dashboard');
  await page.waitForTimeout(2000);

  const ringNode = page.locator('[role="progressbar"]').first();
  if (await ringNode.isVisible()) {
    console.log("Ring node located. Testing focus state...");
    await ringNode.focus();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, 'ring_focus.png') });

    console.log("Testing volumetric 3D hover state...");
    await ringNode.hover({ position: { x: 40, y: 40 } });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, 'ring_hover_masterclass.png') });
  } else {
    console.log("Ring node not found directly, capturing full page screenshot...");
    await page.screenshot({ path: path.join(outDir, 'ring_dashboard_full.png') });
  }

  await context.close();
  await browser.close();
  console.log("Ring component verification script execution complete.");
})();
