const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  console.log("Launching browser for Body Metrics / Biometric Calibration Enclave verification...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: '/home/jules/verification/videos',
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  // Print page console logs
  page.on('console', msg => {
    console.log(`[PAGE CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  // Set test mode marker so security system bypasses environment/integrity locks
  await page.addInitScript(() => {
    window.__VORO_TEST_BYPASS__ = true;
    localStorage.setItem('voro_test_mode', 'true');
  });

  console.log("Navigating to home/entry to inject state securely...");
  await page.goto('http://localhost:4173/');
  await page.waitForTimeout(1000); // Let initial bundle load

  // Now set the keys securely through window.storage.set to align with CDDSA
  console.log("Securely injecting mock body metrics & user profile into storage...");
  await page.evaluate(async () => {
    await window.storage.ensureInitialized();
    await window.storage.set('body_metrics', {
      weights: [
        { date: "2026-05-15T12:00:00.000Z", value: 82.5 },
        { date: "2026-06-01T12:00:00.000Z", value: 81.2 },
        { date: "2026-06-15T12:00:00.000Z", value: 80.0 }
      ],
      bodyFat: [
        { date: "2026-05-15T12:00:00.000Z", value: 16.5 },
        { date: "2026-06-01T12:00:00.000Z", value: 15.8 },
        { date: "2026-06-15T12:00:00.000Z", value: 15.0 }
      ],
      measurements: [
        {
          date: "2026-06-15T12:00:00.000Z",
          chest: 104,
          waist: 82,
          hips: 96,
          bicep: 38,
          thigh: 58,
          calf: 38
        }
      ]
    });
    await window.storage.set('user', {
      name: 'Ulysses Elite',
      primaryGoal: 'Evolution',
      heightCm: 180,
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

  // Now navigate to the Body Metrics page
  console.log("Navigating to Body Metrics page...");
  await page.goto('http://localhost:4173/body/metrics');

  // Wait for cinematic loading screen and transition (2.5s) plus some buffer
  console.log("Waiting for cinematic loading screen transition to complete...");
  await page.waitForTimeout(3000);

  // Take screenshot of the initial loaded page (Enclave view)
  console.log("Taking screenshot of the loaded Enclave view...");
  await page.screenshot({ path: '/home/jules/verification/screenshots/body_metrics_enclave.png' });

  // 1. Focus the 'chest' SVG node
  console.log("Clicking Chest node on interactive SVG...");
  const chestText = page.locator('text=Chest [0xCHST]');
  if (await chestText.isVisible()) {
    await chestText.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/body_metrics_chest_active.png' });
  }

  // 2. Click the Bicep node on interactive SVG
  console.log("Clicking Bicep node on interactive SVG...");
  const bicepText = page.locator('text=Bicep [0xBCP]');
  if (await bicepText.isVisible()) {
    await bicepText.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/body_metrics_bicep_active.png' });
  }

  // 3. Hovering over the Mass Trajectory Card for volumetric tilt feedback
  console.log("Hovering mouse over Mass Trajectory card...");
  const trajectoryCard = page.locator('section').first();
  if (await trajectoryCard.isVisible()) {
    await trajectoryCard.hover({ position: { x: 100, y: 100 } });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/body_metrics_trajectory_hover.png' });
  }

  // 4. Fill in weight in the Mass logging input
  console.log("Filling weight in the Mass logging input...");
  const weightInput = page.locator('input[placeholder="Magnitude (kg)"]');
  if (await weightInput.isVisible()) {
    await weightInput.fill('79.5');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/body_metrics_weight_input.png' });
  }

  // 5. Submit weight log
  console.log("Clicking Record Mass button...");
  const recordBtn = page.locator('button:has-text("Record Mass")');
  if (await recordBtn.isVisible()) {
    await recordBtn.click();
    await page.waitForTimeout(1500); // wait for success notification
    await page.screenshot({ path: '/home/jules/verification/screenshots/body_metrics_weight_submitted.png' });
  }

  await context.close();
  await browser.close();
  console.log("Body Metrics E2E visual verification complete.");
})();
