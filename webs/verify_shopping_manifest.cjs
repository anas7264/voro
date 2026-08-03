const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  console.log("Launching browser for Secure Procurement Registry verification...");
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
  console.log("Securely injecting mock shopping list & user profile into storage...");
  await page.evaluate(async () => {
    await window.storage.ensureInitialized();
    await window.storage.set('shopping_list', [
      { id: 101, text: "Kinetic Protein Isolates (Premium Whey)", checked: false },
      { id: 102, text: "Organic Steamed Basmati Matrix", checked: true },
      { id: 103, text: "Hydro-hydration Electrolyte Buffer", checked: false }
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

  // Navigate to the Procurement Manifest (Shopping List) page
  console.log("Navigating to Procurement Manifest page...");
  await page.goto('http://localhost:4173/nutrition/shopping-list');
  await page.waitForTimeout(2000); // Wait for transition animations and state load

  // 1. Initial page state with 3 injected items
  console.log("Taking screenshot of initial Procurement Manifest list...");
  await page.screenshot({ path: '/home/jules/verification/screenshots/shopping_manifest_initial.png' });

  // 2. Focus the first list item card to test static 4-degree keyboard focus tilt
  console.log("Focusing the first resource card...");
  const firstCard = page.locator('div[role="listitem"]').first();
  if (await firstCard.isVisible()) {
    await firstCard.focus();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/shopping_manifest_card_focus.png' });
  }

  // 3. Hovering over the second card to test mouse-based volumetric tilt
  console.log("Hovering mouse over the second resource card...");
  const secondCard = page.locator('div[role="listitem"]').nth(1);
  if (await secondCard.isVisible()) {
    await secondCard.hover({ position: { x: 120, y: 30 } });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/shopping_manifest_card_hover.png' });
  }

  // 4. Click check/uncheck toggle on the first card
  console.log("Toggling checked status on the first card...");
  const toggleBtn = firstCard.locator('button[role="checkbox"]').first();
  if (await toggleBtn.isVisible()) {
    await toggleBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/shopping_manifest_card_toggled.png' });
  }

  // 5. Test individual card delete confirmation
  console.log("Clicking individual delete on the third card (Confirmation step 1)...");
  const thirdCard = page.locator('div[role="listitem"]').nth(2);
  const deleteBtn = thirdCard.locator('button[aria-label^="Request decommission of"]').first();
  if (await deleteBtn.isVisible()) {
    await deleteBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/shopping_manifest_individual_confirm_delete.png' });
  }

  // 6. Wait for self-cancel timeout (3 seconds) to verify automatic rollback
  console.log("Waiting for automatic cancel of individual deletion state...");
  await page.waitForTimeout(3500);
  await page.screenshot({ path: '/home/jules/verification/screenshots/shopping_manifest_individual_deletestate_reset.png' });

  // 7. Double click to actually delete the third card
  console.log("Executing actual delete flow for individual card...");
  if (await deleteBtn.isVisible()) {
    await deleteBtn.click();
    await page.waitForTimeout(500);
    await deleteBtn.click();
    await page.waitForTimeout(2000); // wait for removal animation/UI update
    await page.screenshot({ path: '/home/jules/verification/screenshots/shopping_manifest_individual_after_delete.png' });
  }

  // 8. Test global Purge Manifest confirmation countdown
  console.log("Clicking PURGE MANIFEST (Global confirmation step 1)...");
  const globalPurgeBtn = page.locator('button:has-text("PURGE MANIFEST")').first();
  if (await globalPurgeBtn.isVisible()) {
    await globalPurgeBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/shopping_manifest_global_confirm_delete.png' });
  }

  // 9. Let global countdown reset automatically
  console.log("Waiting for automatic cancel of global countdown state...");
  await page.waitForTimeout(3500);
  await page.screenshot({ path: '/home/jules/verification/screenshots/shopping_manifest_global_deletestate_reset.png' });

  // 10. Execute actual global purge manifest
  console.log("Executing actual global purge flow...");
  if (await globalPurgeBtn.isVisible()) {
    await globalPurgeBtn.click();
    await page.waitForTimeout(500);
    await globalPurgeBtn.click();
    await page.waitForTimeout(2000); // wait for wipe animation/UI update
    await page.screenshot({ path: '/home/jules/verification/screenshots/shopping_manifest_after_global_purge_empty.png' });
  }

  // 11. Add a new item through the Input Terminus Card to verify addition flow
  console.log("Typing and submitting a new resource in the Input Terminus Card...");
  const inputElement = page.locator('input[placeholder^="Declare resource identifier"]');
  if (await inputElement.isVisible()) {
    await inputElement.fill("Synthesized Glutamine Hydration Matrix");
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000); // wait for addition render
    await page.screenshot({ path: '/home/jules/verification/screenshots/shopping_manifest_after_new_item_addition.png' });
  }

  await context.close();
  await browser.close();
  console.log("Secure Procurement Registry E2E visual verification complete.");
})();
