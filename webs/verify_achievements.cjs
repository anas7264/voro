const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  console.log("Launching browser for Achievements Page verification...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: '/home/jules/verification/videos',
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  // Set test mode marker so security system bypasses environment/integrity locks
  await page.addInitScript(() => {
    window.__VORO_TEST_BYPASS__ = true;
    localStorage.setItem('voro_test_mode', 'true');
  });

  console.log("Navigating to home/entry to inject state securely...");
  await page.goto('http://localhost:4173/');
  await page.waitForTimeout(1000); // Let initial bundle load

  // Now set the keys securely through window.storage.set
  console.log("Securely injecting mock gamification & user profile into storage...");
  await page.evaluate(async () => {
    await window.storage.ensureInitialized();
    await window.storage.set('gamification', {
      level: 4,
      totalXP: 3450,
      achievements: ["a001", "a002", "a005"]
    });
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

  // Now navigate to the Achievements page
  console.log("Navigating to Achievements page...");
  await page.goto('http://localhost:4173/gamification/achievements');
  await page.waitForTimeout(2000); // Wait for transition animations and state load

  // 1. Initial page state
  console.log("Taking screenshot of initial achievements list...");
  await page.screenshot({ path: '/home/jules/verification/screenshots/achievements_initial.png' });

  // 2. Focus the Ascension Biometric Core section (main hero container)
  console.log("Focusing the Ascension Biometric Core section...");
  const heroSection = page.locator('section[aria-label^="Ascension Biometric Core"]');
  if (await heroSection.isVisible()) {
    await heroSection.focus();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/achievements_hero_focus.png' });
  }

  // 3. Hovering over the Ascension Biometric Core section to test mouse-based volumetric tilt
  console.log("Hovering mouse over the Ascension Biometric Core...");
  if (await heroSection.isVisible()) {
    await heroSection.hover({ position: { x: 300, y: 120 } });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/achievements_hero_hover.png' });
  }

  await context.close();
  await browser.close();
  console.log("Achievements Page E2E visual verification complete.");
})();
