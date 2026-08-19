const { chromium } = require('@playwright/test');

(async () => {
  console.log("Launching browser for Kinetic Blueprint Architecture verification...");
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
  await page.waitForTimeout(1000);

  // Set user state so onboarding guard passes
  await page.evaluate(async () => {
    await window.storage.ensureInitialized();
    await window.storage.set('user', {
      name: 'Ulysses Elite',
      primaryGoal: 'Evolution',
      calorieGoal: 2000
    });
    await window.storage.set('profile', {
      name: 'Ulysses Elite',
      completedOnboarding: true
    });
  });

  console.log("Navigating to Training Plan page (/workout/plan)...");
  await page.goto('http://localhost:4173/workout/plan');
  await page.waitForTimeout(1500);

  // 1. Initial Void state screenshot
  console.log("Taking screenshot of initial empty blueprint state...");
  await page.screenshot({ path: '/home/jules/verification/screenshots/training_plan_void.png' });

  // 2. Select parameters and click Initiate Synthesis
  console.log("Selecting Advanced level and Hypertrophy focus...");
  const advancedBtn = page.locator('button:has-text("Advanced")').first();
  if (await advancedBtn.isVisible()) {
    await advancedBtn.click();
  }

  const hypertrophyBtn = page.locator('button:has-text("Hypertrophy")').first();
  if (await hypertrophyBtn.isVisible()) {
    await hypertrophyBtn.click();
  }

  console.log("Clicking Initiate Synthesis...");
  const synthesizeBtn = page.locator('button:has-text("Initiate Synthesis")').first();
  await synthesizeBtn.click();
  await page.waitForTimeout(2000); // Wait for synthesis to store and UI update

  console.log("Taking screenshot of synthesized blueprint matrix...");
  await page.screenshot({ path: '/home/jules/verification/screenshots/training_plan_synthesized.png' });

  // 3. Hovering over a training day card to verify 60fps 3D volumetric tilt
  console.log("Hovering mouse over the first training day card...");
  const firstCard = page.locator('div[role="region"][aria-label^="Training Day"]').first();
  if (await firstCard.isVisible()) {
    await firstCard.hover({ position: { x: 80, y: 80 } });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/training_plan_card_hover.png' });
  }

  // 4. Focus the second training day card to verify static 4-degree accessibility focus tilt
  console.log("Focusing the second training day card via keyboard...");
  const secondCard = page.locator('div[role="region"][aria-label^="Training Day"]').nth(1);
  if (await secondCard.isVisible()) {
    await secondCard.focus();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/training_plan_card_focus.png' });
  }

  // 5. Click archive button (Trigger confirmation 'PURGE?')
  console.log("Clicking Archive button (Confirmation step 1)...");
  const archiveBtn = page.locator('button:has-text("Archive")').first();
  if (await archiveBtn.isVisible()) {
    await archiveBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/training_plan_confirm_purge.png' });
  }

  // 6. Confirm purge
  console.log("Confirming purge...");
  const confirmBtn = page.locator('button:has-text("PURGE?")').first();
  if (await confirmBtn.isVisible()) {
    await confirmBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: '/home/jules/verification/screenshots/training_plan_after_purge.png' });
  }

  await context.close();
  await browser.close();
  console.log("Training Plan E2E visual verification complete.");
})();
