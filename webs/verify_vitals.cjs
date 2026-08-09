const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  console.log("Launching browser for Vitals Tracker verification...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: '/home/jules/verification/videos',
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  // Print console logs and page errors
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  // Set test mode marker so security system bypasses environment/integrity locks
  await page.addInitScript(() => {
    window.__VORO_TEST_BYPASS__ = true;
    localStorage.setItem('voro_test_mode', 'true');
  });

  console.log("Navigating to home/entry to prepare pristine environment...");
  await page.goto('http://localhost:4173/');
  await page.waitForTimeout(1000);

  // Clear previous runs' state completely to avoid CSBA desynchronization
  console.log("Clearing IndexedDB and Local Storage for a pristine boot...");
  await page.evaluate(async () => {
    localStorage.clear();
    localStorage.setItem('voro_test_mode', 'true');
    // Delete Voro database to start fresh
    await new Promise((resolve) => {
      const req = window.indexedDB.deleteDatabase('VORO_SECURE_STORAGE');
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  });

  // Reload the page to boot securely on a clean state
  console.log("Reloading page to generate secure matching anchors...");
  await page.reload();
  await page.waitForTimeout(2000);

  // Securely inject mock vitals & user profile into storage
  console.log("Securely injecting mock vitals history & user profile into storage...");
  await page.evaluate(async () => {
    await window.storage.ensureInitialized();
    await window.storage.set('vitals', [
      {
        date: "2026-06-10T12:00:00.000Z",
        heartRate: 60,
        bloodPressure: "115/75",
        sleep: 8,
        mood: 9,
        energy: 9
      },
      {
        date: "2026-06-11T12:00:00.000Z",
        heartRate: 64,
        bloodPressure: "118/78",
        sleep: 7.5,
        mood: 8,
        energy: 8
      }
    ]);
    await window.storage.set('user', {
      name: 'Ulysses Elite',
      primaryGoal: 'Evolution',
      calorieGoal: 2000,
      waterGoal: 2000,
      proteinGoal: 150,
      carbsGoal: 200,
      fatGoal: 70,
      heightCm: 180,
      age: 28,
      gender: 'male'
    });
    await window.storage.set('profile', {
      name: 'Ulysses Elite',
      completedOnboarding: true
    });
  });

  // Navigate to Vitals page
  console.log("Navigating to Vitals Tracker page...");
  await page.goto('http://localhost:4173/body/vitals');
  await page.waitForTimeout(4000); // Wait for transition animations and state load

  // Take screenshot of initial state with existing history entries
  console.log("Taking screenshot of initial Vitals Tracker state...");
  await page.screenshot({ path: '/home/jules/verification/screenshots/vitals_initial.png' });

  // Modify the range sliders
  console.log("Interacting with Neural Balance slider...");
  const moodSlider = page.locator('input[type="range"]').first();
  if (await moodSlider.isVisible()) {
    console.log("Slider found!");
    await moodSlider.focus();
    await moodSlider.fill('6'); // Adjust to 6
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/vitals_sliders_adjusted.png' });
  } else {
    console.log("Slider NOT visible or found.");
  }

  // Click Synchronize Vitals to save a new record
  console.log("Clicking Synchronize Vitals button...");
  const syncBtn = page.locator('button:has-text("Synchronize Vitals")').first();
  if (await syncBtn.isVisible()) {
    await syncBtn.click();
    await page.waitForTimeout(2000); // wait for notification/UI update and timeline addition
    await page.screenshot({ path: '/home/jules/verification/screenshots/vitals_after_sync.png' });
  }

  await context.close();
  await browser.close();
  console.log("Vitals Tracker E2E visual verification complete.");
})();
