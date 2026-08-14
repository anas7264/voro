const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Ensure verification directories exist
const videosDir = '/home/jules/verification/videos';
const screenshotsDir = '/home/jules/verification/screenshots';
fs.mkdirSync(videosDir, { recursive: true });
fs.mkdirSync(screenshotsDir, { recursive: true });

(async () => {
  console.log("Launching browser for Biophysical Statistics verification...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: videosDir,
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  // Attach console listener to print browser logs
  page.on('console', msg => {
    console.log(`[BROWSER LOG] [${msg.type()}] ${msg.text()}`);
  });

  // Set test mode marker so security system bypasses environment/integrity locks
  await page.addInitScript(() => {
    window.__VORO_TEST_BYPASS__ = true;
    localStorage.setItem('voro_test_mode', 'true');
  });

  console.log("Navigating to home/entry to inject state securely...");
  await page.goto('http://localhost:4173/');
  await page.waitForTimeout(1000); // Let initial bundle load

  console.log("Securely injecting mock nutrition_log & workout_log & user profile into storage...");
  await page.evaluate(async () => {
    await window.storage.ensureInitialized();
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

    const logs = {};
    const workouts = {};
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
      logs[dateStr] = {
        totals: {
          calories: 1800 + (i % 5) * 50,
          protein: 140 + (i % 3) * 5,
          carbs: 180 + (i % 4) * 10,
          fat: 65 + (i % 2) * 5
        }
      };
      workouts[dateStr] = {
        attended: i % 2 === 0,
        type: 'Upper Body Push',
        duration: 45,
        volume: 5000 + (i % 3) * 500
      };
    }
    await window.storage.set('nutrition_log', logs);
    await window.storage.set('workout_log', workouts);
  });

  console.log("Navigating to Trajectory Registry page...");
  await page.goto('http://localhost:4173/analytics/dashboard');

  // Let alignment loading animation play
  console.log("Waiting for cinematic Biophysical Synthesis alignment...");
  await page.waitForTimeout(3000);

  // 1. Snapshot of main dashboard view
  console.log("Taking screenshot of initial re-engineered dashboard...");
  await page.screenshot({ path: path.join(screenshotsDir, 'statistics_main.png') });

  // 2. Hover over first statistics card (Kinetic Sessions) to test volumetric tilt
  console.log("Hovering over Kinetic Sessions card...");
  const firstStatCard = page.locator('.Stat').first();
  if (await firstStatCard.isVisible()) {
    await firstStatCard.hover({ position: { x: 30, y: 30 } });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, 'statistics_stat_hover.png') });
  }

  // 3. Hover over the Calorie Trend chart card to test direct-DOM volumetric 3D tilt
  console.log("Hovering over the Calorie Trend card...");
  const calorieTrendCard = page.locator('div[role="region"]:has-text("Metabolic Momentum")').first();
  if (await calorieTrendCard.isVisible()) {
    await calorieTrendCard.hover({ position: { x: 40, y: 40 } });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, 'statistics_chart_hover.png') });
  }

  // 4. Focus the Calorie Trend chart card to test keyboard focus static 4-degree tilt
  console.log("Focusing the Calorie Trend card...");
  if (await calorieTrendCard.isVisible()) {
    await calorieTrendCard.focus();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, 'statistics_chart_focus.png') });
  }

  // 5. Interact with the Period Tabs (e.g., Click '7D')
  console.log("Clicking '7D' period tab...");
  const tab7D = page.locator('button:has-text("7D")').first();
  if (await tab7D.isVisible()) {
    await tab7D.click();
    await page.waitForTimeout(1500); // wait for state change and recalculations
    await page.screenshot({ path: path.join(screenshotsDir, 'statistics_7D_active.png') });
  }

  await context.close();
  await browser.close();
  console.log("Biophysical Statistics E2E verification complete.");
})();
