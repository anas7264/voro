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

  // Set localStorage and inject test mode bypass
  await page.addInitScript(() => {
    window.__VORO_TEST_BYPASS__ = true;
    localStorage.setItem('voro_test_mode', 'true');
    localStorage.setItem('voro_user', JSON.stringify({
      name: 'Ulysses Elite',
      primaryGoal: 'Evolution',
      calorieGoal: 2000,
      waterGoal: 2000,
      proteinGoal: 150,
      carbsGoal: 200,
      fatGoal: 70
    }));
    localStorage.setItem('voro_profile', JSON.stringify({
      name: 'Ulysses Elite',
      completedOnboarding: true
    }));
  });

  // Direct load of Dashboard first to properly trigger state injection
  await page.goto('http://localhost:4173/dashboard');
  await page.waitForTimeout(5000); // Allow loading animation to complete
  await page.screenshot({ path: '/home/jules/verification/screenshots/dashboard.png' });

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
