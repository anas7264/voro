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
      fatGoal: 70,
      age: 28,
      gender: 'Male'
    }));
    localStorage.setItem('voro_profile', JSON.stringify({
      name: 'Ulysses Elite',
      completedOnboarding: true
    }));
    // Populate some weights and bodyFat logs
    localStorage.setItem('voro_body_metrics', JSON.stringify({
      weights: [
        { date: '2025-05-01', value: 80.5 },
        { date: '2025-05-15', value: 79.2 },
        { date: '2025-05-30', value: 78.4 }
      ],
      bodyFat: [
        { date: '2025-05-01', value: 16.5 },
        { date: '2025-05-15', value: 15.8 },
        { date: '2025-05-30', value: 15.2 }
      ]
    }));
  });

  // Load Dashboard to seed local state
  await page.goto('http://localhost:4173/dashboard');
  await page.waitForTimeout(3000);

  // Navigate to Body Composition
  await page.goto('http://localhost:4173/body/composition');

  // Hold for the loading sequence to complete (approx 2.5s)
  await page.waitForTimeout(4000);

  // Take screenshot of the main premium body composition layout with Somatic Specimen Cells
  await page.screenshot({ path: '/home/jules/verification/screenshots/body_composition_forge.png' });

  // Simulate mouse hovering on the body composition cards to trigger the interactive direct-DOM 3D tilt
  const specCell = page.locator('text=Lean Mass').first();
  if (await specCell.isVisible()) {
    await specCell.hover();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/body_composition_cell_hover.png' });
  }

  await context.close();
  await browser.close();
  console.log("Successfully ran E2E verification of Body Composition.");
})();
