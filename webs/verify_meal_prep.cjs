const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  console.log("Launching browser for Culinary Procurement Enclave verification...");
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

  // Securely inject state
  console.log("Securely injecting mock meal prep and profile into storage...");
  await page.evaluate(async () => {
    await window.storage.ensureInitialized();
    await window.storage.set('meal_prep', {
      plan: [
        { id: 1001, day: 'Sunday', duration: '2 hours', count: 12, recipes: ['Metabolic Salmon Synthesis', 'Kinetic Chicken Fuel'] },
        { id: 1002, day: 'Wednesday', duration: '1 hour', count: 6, recipes: ['Egg White Frittata Matrix'] }
      ],
      provisions: [
        { item: 'Organic Salmon Matrix', qty: '2.0 kg', checked: false },
        { item: 'Kinetic Chicken Breast', qty: '3.0 kg', checked: true },
        { item: 'Liquid Hydration (Oils)', qty: '500 ml', checked: false }
      ]
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

  // Navigate to Meal Prep Planner
  console.log("Navigating to Culinary Procurement Enclave...");
  await page.goto('http://localhost:4173/nutrition/meal-prep');

  // Robustly wait for the cinematic loading overlay to disperse and page elements to load
  console.log("Waiting for main enclave elements to appear on screen...");
  await page.waitForSelector('button:has-text("Design Prep Plan")', { timeout: 15000 });

  // Print diagnostics
  const listItemsCount = await page.locator('div[role="listitem"]').count();
  console.log("DIAGNOSTIC - div[role='listitem'] count on page:", listItemsCount);

  // 1. Initial State
  console.log("Taking screenshot of initial Culinary Procurement Enclave...");
  await page.screenshot({ path: '/home/jules/verification/screenshots/meal_prep_initial.png' });

  // 2. Focus the first card to verify focus tilt
  console.log("Focusing first prep session card...");
  const firstCard = page.locator('div[role="listitem"]').first();
  if (await firstCard.isVisible()) {
    await firstCard.focus();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/meal_prep_card_focus.png' });
  }

  // 3. Hovering the second card to verify mouse tilt
  console.log("Hovering second prep session card...");
  const secondCard = page.locator('div[role="listitem"]').nth(1);
  if (await secondCard.isVisible()) {
    await secondCard.hover({ position: { x: 80, y: 40 } });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/meal_prep_card_hover.png' });
  }

  // 4. Test individual session delete confirmation countdown
  console.log("Clicking delete on second session (Confirmation step 1)...");
  const deleteBtn = secondCard.locator('button[aria-label^="Purge session"]').first();
  const deleteBtnVisible = await deleteBtn.isVisible();
  console.log("DIAGNOSTIC - deleteBtn visible:", deleteBtnVisible);
  if (deleteBtnVisible) {
    await deleteBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/meal_prep_card_delete_confirm.png' });
  }

  // 5. Wait for self-cancel timeout (3 seconds) to verify automatic rollback
  console.log("Waiting for automatic cancel of individual deletion state...");
  await page.waitForTimeout(3500);
  await page.screenshot({ path: '/home/jules/verification/screenshots/meal_prep_card_delete_reset.png' });

  // 6. Double click to actually delete the second card
  console.log("Executing actual delete flow for individual card...");
  if (deleteBtnVisible) {
    // Since it was reset, click once to arm
    await deleteBtn.click();
    await page.waitForTimeout(500);
    const confirmDeleteBtn = secondCard.locator('button[aria-label="Confirm purge sequence"]').first();
    const confirmDeleteBtnVisible = await confirmDeleteBtn.isVisible();
    console.log("DIAGNOSTIC - confirmDeleteBtn visible:", confirmDeleteBtnVisible);
    if (confirmDeleteBtnVisible) {
      await confirmDeleteBtn.click();
      await page.waitForTimeout(2000); // wait for removal UI update
      await page.screenshot({ path: '/home/jules/verification/screenshots/meal_prep_after_delete.png' });
    }
  }

  // 7. Test toggle checkbox for provisions matrix
  console.log("Toggling checked status of the first provision item...");
  const firstItem = page.locator('button:has-text("Organic Salmon Matrix")').first();
  const firstItemVisible = await firstItem.isVisible();
  console.log("DIAGNOSTIC - firstItem (Organic Salmon Matrix) visible:", firstItemVisible);
  if (firstItemVisible) {
    await firstItem.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/meal_prep_provision_toggled.png' });
  }

  // 8. Test global Purge Provisions matrix confirmation
  console.log("Clicking PURGE ALL provisions (Confirmation step 1)...");
  const purgeAllBtn = page.locator('button[aria-label="Purge provisions list"]').first();
  const purgeAllBtnVisible = await purgeAllBtn.isVisible();
  console.log("DIAGNOSTIC - purgeAllBtn visible:", purgeAllBtnVisible);
  if (purgeAllBtnVisible) {
    await purgeAllBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/meal_prep_provisions_confirm_purge.png' });
  }

  // 9. Let global countdown reset automatically
  console.log("Waiting for automatic cancel of global provisions purge state...");
  await page.waitForTimeout(3500);
  await page.screenshot({ path: '/home/jules/verification/screenshots/meal_prep_provisions_purge_reset.png' });

  // 10. Execute actual global provisions purge
  console.log("Executing actual global provisions purge flow...");
  if (purgeAllBtnVisible) {
    await purgeAllBtn.click();
    await page.waitForTimeout(500);
    const confirmPurgeBtn = page.locator('button[aria-label="Confirm purge of all provisions"]').first();
    const confirmPurgeBtnVisible = await confirmPurgeBtn.isVisible();
    console.log("DIAGNOSTIC - confirmPurgeBtn visible:", confirmPurgeBtnVisible);
    if (confirmPurgeBtnVisible) {
      await confirmPurgeBtn.click();
      await page.waitForTimeout(2000); // wait for wipe UI update
      await page.screenshot({ path: '/home/jules/verification/screenshots/meal_prep_after_provisions_purge.png' });
    }
  }

  // 11. Add a new prep plan session to verify additions flow
  console.log("Testing design prep plan additions module...");
  const designBtn = page.locator('button:has-text("Design Prep Plan")').first();
  const designBtnVisible = await designBtn.isVisible();
  console.log("DIAGNOSTIC - designBtn visible:", designBtnVisible);
  if (designBtnVisible) {
    await designBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/meal_prep_add_module_open.png' });

    console.log("Filling and submitting new session...");
    const recipeInput = page.locator('input[placeholder="e.g. Kinetic Salmon Matrix..."]').first();
    if (await recipeInput.isVisible()) {
      await recipeInput.fill("Elite Protein Synapse Blend");
      await page.waitForTimeout(500);
      const appendBtn = page.locator('button:has-text("Append Recipe")').first();
      await appendBtn.click();
      await page.waitForTimeout(500);

      const synthesizeBtn = page.locator('button:has-text("Synthesize Plan")').first();
      await synthesizeBtn.click();
      await page.waitForTimeout(2000); // wait for addition
      await page.screenshot({ path: '/home/jules/verification/screenshots/meal_prep_after_addition.png' });
    }
  }

  await context.close();
  await browser.close();
  console.log("Culinary Procurement Enclave E2E visual verification complete.");
})();
