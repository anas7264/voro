const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  console.log("Launching browser for Progress Photos verification...");
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

  // Now set the keys securely through window.storage.set to align with CDDSA
  console.log("Securely injecting mock progress photos into storage...");
  await page.evaluate(async () => {
    await window.storage.ensureInitialized();
    await window.storage.set('voro_progress_photos', [
      {
        id: "photo-1121",
        src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%237C3AED'/><text x='10' y='50' fill='white' font-size='12'>Before Specimen</text></svg>",
        date: "2026-06-12T12:00:00.000Z",
        label: "Before Evolution"
      },
      {
        id: "photo-1122",
        src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%2310B981'/><text x='10' y='50' fill='white' font-size='12'>After Specimen</text></svg>",
        date: "2026-06-13T12:00:00.000Z",
        label: "After Evolution"
      }
    ]);
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

  // Now navigate to the Progress Photos page since onboarding state is complete
  console.log("Navigating to Progress Photos page...");
  await page.goto('http://localhost:4173/body/photos');
  await page.waitForTimeout(2000); // Wait for transition animations and state load

  // 1. Initial page state with 2 photos
  console.log("Taking screenshot of initial photos list...");
  await page.screenshot({ path: '/home/jules/verification/screenshots/progress_photos_initial.png' });

  // 2. Focus the second photo card to test static 4-degree keyboard focus tilt
  console.log("Focusing the second progress photo card...");
  const secondCard = page.locator('div[role="button"]').nth(1);
  if (await secondCard.isVisible()) {
    await secondCard.focus();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/progress_photos_card_focus.png' });
  }

  // 3. Click Spectral Lens button to enter compare mode
  console.log("Entering Spectral Lens compare mode...");
  const compareBtn = page.locator('button:has-text("Spectral Lens")');
  if (await compareBtn.isVisible()) {
    await compareBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/progress_photos_compare_setup.png' });
  }

  // 4. Select the two cards for comparison
  console.log("Selecting node A...");
  const firstCard = page.locator('div[role="button"]').first();
  if (await firstCard.isVisible()) {
    await firstCard.click();
    await page.waitForTimeout(500);
  }
  console.log("Selecting node B...");
  if (await secondCard.isVisible()) {
    await secondCard.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: '/home/jules/verification/screenshots/progress_photos_spectral_lens_active.png' });
  }

  // 5. Decommissioning node double confirmation flow test
  console.log("Triggering delete flow confirmation on node B...");
  const deleteBtn = page.locator('button[aria-label^="Decommission biometric node"]').nth(1);
  if (await deleteBtn.isVisible()) {
    await deleteBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/progress_photos_confirm_delete.png' });
  }

  await context.close();
  await browser.close();
  console.log("Progress Photos E2E visual verification complete.");
})();
