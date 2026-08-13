const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: '/home/jules/verification/videos',
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Set test mode marker so security system bypasses environment/integrity locks
  await page.addInitScript(() => {
    window.__VORO_TEST_BYPASS__ = true;
    localStorage.setItem('voro_test_mode', 'true');
  });

  console.log("Navigating to home/entry to inject state securely...");
  await page.goto('http://localhost:4173/');
  await page.waitForTimeout(2000); // Let initial bundle load

  // Now set the keys securely through window.storage.set
  console.log("Securely injecting mock profile & user into storage...");
  await page.evaluate(async () => {
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
  });

  // Navigate to reports page
  await page.goto('http://localhost:4173/analytics/reports');
  await page.waitForTimeout(5000); // Allow lazy loading to completely finish

  // Take screenshot of the initial reports dashboard
  await page.screenshot({ path: '/home/jules/verification/screenshots/verification_reports.png' });
  await page.waitForTimeout(1000);

  // Click on a report card synthesis button
  const synthesizeBtn = page.locator('text=Synthesize PDF').first();
  if (await synthesizeBtn.isVisible()) {
    await synthesizeBtn.click();
    // Wait for simulated steps to complete (approx 3.5 seconds)
    await page.waitForTimeout(4000);
    // Take a screenshot after simulated synthesis
    await page.screenshot({ path: '/home/jules/verification/screenshots/verification_reports_after_synthesis.png' });
  }

  await context.close();
  await browser.close();
  console.log("Successfully ran E2E verification of Reports.");
})();
