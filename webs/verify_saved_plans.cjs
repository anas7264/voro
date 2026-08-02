const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  console.log("Launching browser for Saved Meal Plans verification...");
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
  console.log("Securely injecting mock meal plans & user profile into storage...");
  await page.evaluate(async () => {
    await window.storage.ensureInitialized();
    await window.storage.set('plans', {
      savedMealPlans: [
        {
          id: 1121,
          name: "Metabolic Protocol — Premium Elite",
          createdAt: "2026-06-12T12:00:00.000Z",
          days: [
            { day: 1, calories: 1800, protein: 180, carbs: 120, fat: 60 },
            { day: 2, calories: 1600, protein: 170, carbs: 110, fat: 50 }
          ]
        },
        {
          id: 1122,
          name: "Levantine Lipid Composition Cycle",
          createdAt: "2026-06-13T12:00:00.000Z",
          days: [
            { day: 1, calories: 2100, protein: 190, carbs: 150, fat: 70 }
          ]
        }
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

  // Now navigate to the Saved Meal Plans page since onboarding state is complete
  console.log("Navigating to Saved Meal Plans page...");
  await page.goto('http://localhost:4173/nutrition/saved-plans');
  await page.waitForTimeout(2000); // Wait for transition animations and state load

  // 1. Initial page state with 2 plans
  console.log("Taking screenshot of initial plans list...");
  await page.screenshot({ path: '/home/jules/verification/screenshots/saved_plans_initial.png' });

  // 2. Focus the second card to test static 4-degree keyboard focus tilt
  console.log("Focusing the second meal plan card...");
  const secondCard = page.locator('div[tabindex="0"]').nth(1);
  if (await secondCard.isVisible()) {
    await secondCard.focus();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/saved_plans_card_focus.png' });
  }

  // 3. Hovering over the first card to test mouse-based volumetric tilt
  console.log("Hovering mouse over the first meal plan card...");
  const firstCard = page.locator('div[tabindex="0"]').first();
  if (await firstCard.isVisible()) {
    await firstCard.hover({ position: { x: 50, y: 50 } });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/saved_plans_card_hover.png' });
  }

  // 4. Click delete on the second card (Trigger confirmation)
  console.log("Clicking delete on the second card (Confirmation step 1)...");
  const deleteBtn = page.locator('button[aria-label^="Remove plan:"]').nth(1);
  if (await deleteBtn.isVisible()) {
    await deleteBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/saved_plans_confirm_delete.png' });
  }

  // 5. Wait for self-cancel timeout (3 seconds) to verify automatic rollback
  console.log("Waiting for automatic cancel of deletion state...");
  await page.waitForTimeout(3500);
  await page.screenshot({ path: '/home/jules/verification/screenshots/saved_plans_deletestate_reset.png' });

  // 6. Double click to actually delete the second card (First click to arm, second to confirm)
  console.log("Executing actual delete flow...");
  if (await deleteBtn.isVisible()) {
    await deleteBtn.click();
    await page.waitForTimeout(500);
    await deleteBtn.click();
    await page.waitForTimeout(2000); // wait for removal animation/UI update
    await page.screenshot({ path: '/home/jules/verification/screenshots/saved_plans_after_delete.png' });
  }

  // 7. Click Generate New Blueprint to test navigation connectivity
  console.log("Testing navigation connectivity...");
  const generateBtn = page.locator('button:has-text("Generate New Blueprint")').first();
  if (await generateBtn.isVisible()) {
    await generateBtn.click();
    await page.waitForTimeout(2000); // wait for page navigation
    await page.screenshot({ path: '/home/jules/verification/screenshots/saved_plans_navigated_to_planner.png' });
  }

  await context.close();
  await browser.close();
  console.log("Saved Meal Plans E2E visual verification complete.");
})();
