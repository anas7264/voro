const { chromium } = require('@playwright/test');

(async () => {
  console.log("Launching headless browser for Saved Training Plans verification...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: '/home/jules/verification/videos',
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  // Inject test bypass flags into localStorage and window object
  await page.addInitScript(() => {
    window.__VORO_TEST_BYPASS__ = true;
    localStorage.setItem('voro_test_mode', 'true');
  });

  console.log("Navigating to entry point to initialize storage state...");
  await page.goto('http://localhost:4173/');
  await page.waitForTimeout(1000);

  console.log("Injecting mock training plans and onboarding profile into storage...");
  await page.evaluate(async () => {
    await window.storage.ensureInitialized();
    await window.storage.set('plans', {
      savedTrainingPlans: [
        {
          id: 2001,
          name: "Hypertrophy Volume Matrix — Phase I",
          level: "Elite Protocol",
          days: 5,
          exercisesCount: 20,
          createdAt: "2026-06-15T10:00:00.000Z"
        },
        {
          id: 2002,
          name: "Neuromuscular Power & Kinetic Rate",
          level: "Advanced",
          days: 4,
          exercisesCount: 16,
          createdAt: "2026-06-16T14:30:00.000Z"
        }
      ]
    });
    await window.storage.set('user', {
      name: 'Ulysses Elite',
      completedOnboarding: true
    });
    await window.storage.set('profile', {
      name: 'Ulysses Elite',
      completedOnboarding: true
    });
  });

  console.log("Navigating to Saved Training Plans route (/workout/plans)...");
  await page.goto('http://localhost:4173/workout/plans');

  // Wait for the simulated 2.5-second loading sequence to finish
  console.log("Waiting for protocol vault loading sequence...");
  await page.waitForTimeout(3000);

  // 1. Initial State Screenshot with 2 Plans
  console.log("Capturing initial training plans list...");
  await page.screenshot({ path: '/home/jules/verification/screenshots/saved_training_plans_initial.png' });

  // 2. Keyboard Focus on Second Card (Static 4-degree tilt)
  console.log("Focusing second blueprint card for keyboard accessibility tilt check...");
  const secondCard = page.locator('div[role="article"]').nth(1);
  if (await secondCard.isVisible()) {
    await secondCard.focus();
    await page.waitForTimeout(800);
    await page.screenshot({ path: '/home/jules/verification/screenshots/saved_training_plans_card_focus.png' });
  }

  // 3. Mouse Hover on First Card (3D Volumetric tilt)
  console.log("Hovering mouse over first blueprint card for 3D tilt check...");
  const firstCard = page.locator('div[role="article"]').first();
  if (await firstCard.isVisible()) {
    await firstCard.hover({ position: { x: 60, y: 60 } });
    await page.waitForTimeout(800);
    await page.screenshot({ path: '/home/jules/verification/screenshots/saved_training_plans_card_hover.png' });
  }

  // 4. Click Purge (Step 1 of Double Confirmation)
  console.log("Triggering purge state on second card (Confirmation step 1)...");
  const deleteBtn = page.locator('button[aria-label^="Delete blueprint:"]').nth(1);
  if (await deleteBtn.isVisible()) {
    await deleteBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: '/home/jules/verification/screenshots/saved_training_plans_confirm_purge.png' });
  }

  // 5. Wait for Self-Cancel Timeout (3 seconds)
  console.log("Waiting for automatic cancel of purge state...");
  await page.waitForTimeout(3500);
  await page.screenshot({ path: '/home/jules/verification/screenshots/saved_training_plans_purgestate_reset.png' });

  // 6. Execute Actual Delete Flow (Step 1 + Step 2)
  console.log("Executing actual purge flow...");
  if (await deleteBtn.isVisible()) {
    await deleteBtn.click();
    await page.waitForTimeout(400);
    await deleteBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: '/home/jules/verification/screenshots/saved_training_plans_after_delete.png' });
  }

  // 7. Test Empty State
  console.log("Purging remaining blueprint to test Kinetic Void Matrix empty state...");
  const firstDeleteBtn = page.locator('button[aria-label^="Delete blueprint:"]').first();
  if (await firstDeleteBtn.isVisible()) {
    await firstDeleteBtn.click();
    await page.waitForTimeout(400);
    await firstDeleteBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: '/home/jules/verification/screenshots/saved_training_plans_empty_state.png' });
  }

  await context.close();
  await browser.close();
  console.log("Saved Training Plans E2E verification complete.");
})();
