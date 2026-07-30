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

  // Set localStorage and inject test mode bypass with customized logs & PRs
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
      fatGoal: 70
    }));
    localStorage.setItem('voro_profile', JSON.stringify({
      name: 'Ulysses Elite',
      completedOnboarding: true
    }));

    // Inject workout history
    const workoutLog = {
      "2026-07-28": {
        attended: true,
        type: "Strength",
        duration: 45,
        volume: 8500,
        exercises: [
          {
            name: "Bench Press",
            sets: [
              { weight: "100", reps: "5" },
              { weight: "100", reps: "5" },
              { weight: "105", reps: "5" }
            ]
          }
        ]
      },
      "2026-07-29": {
        attended: true,
        type: "Cardio",
        duration: 30,
        volume: 0,
        exercises: [
          {
            name: "Treadmill Run",
            sets: [
              { weight: "0", reps: "1" }
            ]
          }
        ]
      }
    };
    localStorage.setItem('voro_workout_log', JSON.stringify(workoutLog));

    // Inject PR Records
    const prHistory = {
      "ex_bench_press": [
        { date: "2026-07-28", weight: "105", reps: "5" },
        { date: "2026-07-20", weight: "100", reps: "5" }
      ]
    };
    localStorage.setItem('voro_pr_history', JSON.stringify(prHistory));
  });

  // 1. Visit Workout History Page
  console.log("Navigating to Workout History...");
  await page.goto('http://localhost:4173/workout/history');
  await page.waitForTimeout(3000); // Allow loading/animations to complete

  // Take screenshot of initial history view
  await page.screenshot({ path: '/home/jules/verification/screenshots/verification_history_initial.png' });

  // Click on "Cardio" archetype filter pill-tab to verify filter works
  console.log("Filtering by Cardio...");
  const cardioTab = page.locator('button.rounded-full:has-text("Cardio")').first();
  if (await cardioTab.isVisible()) {
    await cardioTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/verification_history_cardio.png' });
  }

  // Go back to "All" and expand Strength card
  console.log("Expanding Strength workout...");
  const allTab = page.locator('button.rounded-full:has-text("All")').first();
  if (await allTab.isVisible()) {
    await allTab.click();
    await page.waitForTimeout(1000);
  }

  const strengthHeader = page.locator('h3:has-text("Strength")');
  if (await strengthHeader.isVisible()) {
    await strengthHeader.click();
    await page.waitForTimeout(1500); // Allow accordion smooth transition
    await page.screenshot({ path: '/home/jules/verification/screenshots/verification_history_expanded.png' });
  }

  // 2. Visit PR Records Page
  console.log("Navigating to Personal Records...");
  await page.goto('http://localhost:4173/body/pr-records');
  await page.waitForTimeout(3000);

  // Take screenshot of initial PR view
  await page.screenshot({ path: '/home/jules/verification/screenshots/verification_prs_initial.png' });

  // Hover over the first card to verify the 3D tilt effect and coordinates telemetry
  const prCard = page.locator('article[aria-label*="Personal Records"]').first();
  if (await prCard.isVisible()) {
    console.log("Hovering over PR card...");
    await prCard.hover();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/verification_prs_hover.png' });
  }

  await context.close();
  await browser.close();
  console.log("E2E verification of History & PR successfully complete.");
})();
